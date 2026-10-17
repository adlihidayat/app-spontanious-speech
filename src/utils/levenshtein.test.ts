import { describe, it, expect } from 'vitest';
import {
  computeWordAlignment,
  calculateCER,
  getDiffWordsForDisplay,
  compareFreeFormTokens,
} from './levenshtein';

describe('levenshtein utility (WER & CER calculation)', () => {
  describe('computeWordAlignment', () => {
    it('returns 0% WER and CER when reference and hypothesis match exactly', () => {
      const ref = 'aku udah makan bakso';
      const hyp = 'aku udah makan bakso';
      const result = computeWordAlignment(ref, hyp);

      expect(result.metrics.wer).toBe(0);
      expect(result.metrics.cer).toBe(0);
      expect(result.metrics.hits).toBe(4);
      expect(result.metrics.substitutions).toBe(0);
      expect(result.metrics.deletions).toBe(0);
      expect(result.metrics.insertions).toBe(0);
      expect(result.alignment.every((op) => op.type === 'hit')).toBe(true);
    });

    it('calculates substitutions correctly (e.g. Base model replacing spontaneous words with formal)', () => {
      const ref = 'aku udah bilang ke dia';
      const hyp = 'aku sudah bilang ke dia';
      const result = computeWordAlignment(ref, hyp);

      // 1 substitution ('udah' -> 'sudah') out of 5 reference words = 20% WER
      expect(result.metrics.substitutions).toBe(1);
      expect(result.metrics.hits).toBe(4);
      expect(result.metrics.deletions).toBe(0);
      expect(result.metrics.insertions).toBe(0);
      expect(result.metrics.wer).toBe(20);
    });

    it('calculates deletions correctly when words are omitted in hypothesis', () => {
      const ref = 'kemarin tuh aku udah bilang dong';
      const hyp = 'kemarin aku udah bilang';
      const result = computeWordAlignment(ref, hyp);

      // 'tuh' and 'dong' deleted (2 deletions out of 6 words = 33.33% WER)
      expect(result.metrics.deletions).toBe(2);
      expect(result.metrics.hits).toBe(4);
      expect(result.metrics.wer).toBe(33.33);
    });

    it('calculates insertions correctly when extraneous words are added in hypothesis', () => {
      const ref = 'aku mau pergi';
      const hyp = 'aku mau segera pergi sekarang';
      const result = computeWordAlignment(ref, hyp);

      // 2 insertions ('segera', 'sekarang') over 3 reference words = (2 / 3) * 100 = 66.67%
      expect(result.metrics.insertions).toBe(2);
      expect(result.metrics.hits).toBe(3);
      expect(result.metrics.wer).toBe(66.67);
    });

    it('handles complex benchmark sentence comparing Base errors vs LoRA accuracy', () => {
      const ref = 'Jujur ya, kemarin tuh aku udah bilang ke dia kalau nggak usah ikut-ikutan, eh malah nekat dong.';
      const baseHyp = 'Jujur ya kemarin itu aku sudah bilang ke dia kalau tidak usah ikut-ikutan eh malah nekat dong.';
      const loraHyp = 'Jujur ya, kemarin tuh aku udah bilang ke dia kalau nggak usah ikut-ikutan, eh malah nekat dong.';

      const baseResult = computeWordAlignment(ref, baseHyp);
      const loraResult = computeWordAlignment(ref, loraHyp);

      // Base had substitutions ('tuh' -> 'itu', 'udah' -> 'sudah', 'nggak' -> 'tidak')
      expect(baseResult.metrics.substitutions).toBeGreaterThan(0);
      expect(baseResult.metrics.wer).toBeGreaterThan(0);

      // LoRA has 0% WER on exact match
      expect(loraResult.metrics.wer).toBe(0);
      expect(loraResult.metrics.cer).toBe(0);
    });

    it('handles empty strings gracefully', () => {
      const resultEmpty = computeWordAlignment('', '');
      expect(resultEmpty.metrics.wer).toBe(0);
      expect(resultEmpty.metrics.hits).toBe(0);

      const resultRefEmpty = computeWordAlignment('', 'ada kata');
      expect(resultRefEmpty.metrics.wer).toBe(100);
      expect(resultRefEmpty.metrics.insertions).toBe(2);
    });
  });

  describe('calculateCER', () => {
    it('returns 0 when characters match perfectly', () => {
      expect(calculateCER('selamat pagi', 'selamat pagi')).toBe(0);
    });

    it('returns accurate percentage for single character difference', () => {
      // 'pagi' (4 chars) vs 'pigi' (1 substitution out of 4 = 25%)
      expect(calculateCER('pagi', 'pigi')).toBe(25);
    });

    it('ignores punctuation when calculating CER', () => {
      expect(calculateCER('halo!', 'halo?')).toBe(0);
    });
  });

  describe('getDiffWordsForDisplay', () => {
    it('generates display words with accurate diff tagging and spontaneous detection', () => {
      const ref = 'aku udah tahu';
      const hyp = 'aku sudah tahu';
      const alignment = computeWordAlignment(ref, hyp).alignment;

      const diffWords = getDiffWordsForDisplay(hyp, alignment);
      expect(diffWords.length).toBe(3);

      const udahSub = diffWords.find((w) => w.word === 'sudah');
      expect(udahSub?.type).toBe('substitution');
      expect(udahSub?.expected).toBe('udah');
    });
  });

  describe('compareFreeFormTokens', () => {
    it('identifies divergence between Base and LoRA outputs in freeform mode', () => {
      const baseText = 'aku sudah tahu kamu tidak mau';
      const loraText = 'aku udah tahu lu nggak mau';

      const comparison = compareFreeFormTokens(baseText, loraText);

      expect(comparison.divergenceCount).toBeGreaterThan(0);
      const loraUdah = comparison.loraDiffs.find((d) => d.word === 'udah');
      expect(loraUdah?.isSpontaneous).toBe(true);
      expect(loraUdah?.type).toBe('substitution');
    });
  });
});
