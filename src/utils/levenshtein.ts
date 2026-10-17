import { normalizeText, tokenizeWords } from './textNormalization';
import { ModelMetrics, DiffWord } from '../types';
import { isSpontaneousWord } from './spontaneousLexicon';

export interface AlignmentOp {
  refWord?: string;
  hypWord?: string;
  type: 'hit' | 'substitution' | 'deletion' | 'insertion';
}

/**
 * Computes Levenshtein Dynamic Programming distance and word-level alignment
 * between reference (Ground Truth) and hypothesis (ASR Output).
 */
export function computeWordAlignment(reference: string, hypothesis: string): {
  metrics: ModelMetrics;
  alignment: AlignmentOp[];
} {
  const refTokens = tokenizeWords(reference);
  const hypTokens = tokenizeWords(hypothesis);

  const n = refTokens.length;
  const m = hypTokens.length;

  if (n === 0 && m === 0) {
    return {
      metrics: { wer: 0, cer: 0, substitutions: 0, deletions: 0, insertions: 0, hits: 0 },
      alignment: []
    };
  }

  if (n === 0) {
    return {
      metrics: { wer: 100, cer: 100, substitutions: 0, deletions: 0, insertions: m, hits: 0 },
      alignment: hypTokens.map(w => ({ hypWord: w, type: 'insertion' }))
    };
  }

  // DP table: dp[i][j] stores minimum operations to align refTokens[0..i-1] with hypTokens[0..j-1]
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  const ops: ('match' | 'sub' | 'del' | 'ins')[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill('match'));

  for (let i = 1; i <= n; i++) {
    dp[i][0] = i;
    ops[i][0] = 'del';
  }
  for (let j = 1; j <= m; j++) {
    dp[0][j] = j;
    ops[0][j] = 'ins';
  }

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (refTokens[i - 1] === hypTokens[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
        ops[i][j] = 'match';
      } else {
        const subCost = dp[i - 1][j - 1] + 1;
        const delCost = dp[i - 1][j] + 1;
        const insCost = dp[i][j - 1] + 1;

        const minCost = Math.min(subCost, delCost, insCost);
        dp[i][j] = minCost;

        // Choose operation (priority: sub > del > ins for readable alignments)
        if (minCost === subCost) {
          ops[i][j] = 'sub';
        } else if (minCost === delCost) {
          ops[i][j] = 'del';
        } else {
          ops[i][j] = 'ins';
        }
      }
    }
  }

  // Backtrack to find exact alignment
  let i = n;
  let j = m;
  const alignmentReversed: AlignmentOp[] = [];
  let substitutions = 0;
  let deletions = 0;
  let insertions = 0;
  let hits = 0;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && ops[i][j] === 'match') {
      alignmentReversed.push({
        refWord: refTokens[i - 1],
        hypWord: hypTokens[j - 1],
        type: 'hit'
      });
      hits++;
      i--;
      j--;
    } else if (i > 0 && j > 0 && ops[i][j] === 'sub') {
      alignmentReversed.push({
        refWord: refTokens[i - 1],
        hypWord: hypTokens[j - 1],
        type: 'substitution'
      });
      substitutions++;
      i--;
      j--;
    } else if (i > 0 && (j === 0 || ops[i][j] === 'del')) {
      alignmentReversed.push({
        refWord: refTokens[i - 1],
        type: 'deletion'
      });
      deletions++;
      i--;
    } else {
      alignmentReversed.push({
        hypWord: hypTokens[j - 1],
        type: 'insertion'
      });
      insertions++;
      j--;
    }
  }

  const alignment = alignmentReversed.reverse();
  const wer = n > 0 ? Number((((substitutions + deletions + insertions) / n) * 100).toFixed(2)) : 0;
  const cer = calculateCER(reference, hypothesis);

  return {
    metrics: {
      wer,
      cer,
      substitutions,
      deletions,
      insertions,
      hits
    },
    alignment
  };
}

/**
 * Character Error Rate (CER) calculation via character-level Levenshtein distance
 */
export function calculateCER(reference: string, hypothesis: string): number {
  const refNorm = normalizeText(reference).replace(/\s+/g, '');
  const hypNorm = normalizeText(hypothesis).replace(/\s+/g, '');

  const n = refNorm.length;
  const m = hypNorm.length;

  if (n === 0 && m === 0) return 0;
  if (n === 0) return 100;

  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

  for (let i = 0; i <= n; i++) dp[i][0] = i;
  for (let j = 0; j <= m; j++) dp[0][j] = j;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (refNorm[i - 1] === hypNorm[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const distance = dp[n][m];
  return Number(((distance / n) * 100).toFixed(2));
}

/**
 * Generates formatted DiffWord array for rendering highlighted transcripts
 */
export function getDiffWordsForDisplay(
  rawHypothesis: string,
  alignment: AlignmentOp[]
): DiffWord[] {
  // If no alignment available, split raw hypothesis preserving original punctuation
  const words = rawHypothesis.trim().split(/\s+/).filter(Boolean);
  if (!alignment || alignment.length === 0) {
    return words.map(w => ({
      word: w,
      type: 'hit',
      isSpontaneous: isSpontaneousWord(w)
    }));
  }

  // Map hypothesis words from alignment
  const result: DiffWord[] = [];
  let hypIdx = 0;

  for (const op of alignment) {
    if (op.type === 'deletion') {
      // Deletions are in reference but missing in hypothesis.
      // We can represent as a ghost token or omit depending on UI
      result.push({
        word: `[hilang: ${op.refWord}]`,
        type: 'deletion',
        expected: op.refWord
      });
    } else {
      const displayWord = words[hypIdx] || op.hypWord || '';
      hypIdx++;
      result.push({
        word: displayWord,
        type: op.type,
        expected: op.refWord,
        isSpontaneous: isSpontaneousWord(displayWord)
      });
    }
  }

  return result;
}

/**
 * Compare two models in Free-Form Mode (Base vs LoRA)
 * Detects token divergence and spontaneous particles
 */
export function compareFreeFormTokens(
  baseText: string,
  loraText: string
): {
  baseDiffs: DiffWord[];
  loraDiffs: DiffWord[];
  divergenceCount: number;
} {
  const baseTokens = baseText.trim().split(/\s+/).filter(Boolean);
  const loraTokens = loraText.trim().split(/\s+/).filter(Boolean);

  const baseNorm = baseTokens.map(w => normalizeText(w));
  const loraNorm = loraTokens.map(w => normalizeText(w));

  let divergenceCount = 0;

  const loraDiffs: DiffWord[] = loraTokens.map((w, idx) => {
    const isSpont = isSpontaneousWord(w);
    const differs = baseNorm[idx] !== loraNorm[idx];
    if (differs) divergenceCount++;

    return {
      word: w,
      type: differs ? 'substitution' : 'hit',
      expected: baseTokens[idx],
      isSpontaneous: isSpont
    };
  });

  const baseDiffs: DiffWord[] = baseTokens.map((w, idx) => {
    const differs = baseNorm[idx] !== loraNorm[idx];
    return {
      word: w,
      type: differs ? 'substitution' : 'hit',
      expected: loraTokens[idx],
      isSpontaneous: isSpontaneousWord(w)
    };
  });

  return { baseDiffs, loraDiffs, divergenceCount };
}
