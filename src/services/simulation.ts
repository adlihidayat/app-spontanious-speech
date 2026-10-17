import { PromptItem, TranscribeResponse } from '../types';
import { computeWordAlignment } from '../utils/levenshtein';
import { detectSpontaneousWords } from '../utils/spontaneousLexicon';
import { normalizeText } from '../utils/textNormalization';

export const BENCHMARK_PROMPTS: PromptItem[] = [
  {
    id: 1,
    text: "Jujur ya, kemarin tuh aku udah bilang ke dia kalau nggak usah ikut-ikutan, eh malah nekat dong.",
    category: "Kontraksi & Partikel Spontan (tuh, udah, nggak, eh, dong)"
  },
  {
    id: 2,
    text: "Eh bentar deh, kayaknya tadi tuh kita salah belok nggak sih? Kok jalannya makin sepi gini ya?",
    category: "Interjeksi & Partikel Penanya (eh, deh, kayaknya, tuh, nggak, sih, kok, gini, ya)"
  },
  {
    id: 3,
    text: "Gini loh maksud gue, kalau emang datanya belum beres sekarang, ya udah kita kerjain bareng aja besok pagi.",
    category: "Pronomina Santai & Slang (gini, loh, gue, emang, beres, ya udah)"
  },
  {
    id: 4,
    text: "Sebenernya sih nggak masalah mau pakai cara yang mana aja, yang penting hasilnya tuh beneran akurat gitu.",
    category: "Partikel Penegas & Slang (sih, nggak, aja, tuh, beneran, gitu)"
  },
  {
    id: 5,
    text: "Aduh gimana ya bilangnya, soalnya dari kemarin tuh dia susah banget dihubungi, chat gue aja cuma dibaca doang.",
    category: "Kontraksi & Slang Pembatas (gimana, tuh, banget, gue, doang)"
  }
];

interface SimulationPreset {
  baseText: string;
  baseConfidence: number;
  baseLatency: number;
  loraText: string;
  loraConfidence: number;
  loraLatency: number;
}

const PRESET_RESPONSES: Record<number, SimulationPreset> = {
  1: {
    baseText: "Jujur ya kemarin itu aku sudah bilang ke dia kalau tidak usah ikut-ikutan eh malah nekat dong.",
    baseConfidence: 81.4,
    baseLatency: 2.34,
    loraText: "Jujur ya, kemarin tuh aku udah bilang ke dia kalau nggak usah ikut-ikutan, eh malah nekat dong.",
    loraConfidence: 95.8,
    loraLatency: 2.45
  },
  2: {
    baseText: "Eh sebentar, kayaknya tadi itu kita salah belok tidak? Kok jalannya makin sepi begini ya?",
    baseConfidence: 79.2,
    baseLatency: 2.28,
    loraText: "Eh bentar deh, kayaknya tadi tuh kita salah belok nggak sih? Kok jalannya makin sepi gini ya?",
    loraConfidence: 94.6,
    loraLatency: 2.41
  },
  3: {
    baseText: "Begini loh maksud saya, kalau memang datanya belum selesai sekarang, ya sudah kita kerjakan bersama saja besok pagi.",
    baseConfidence: 82.0,
    baseLatency: 2.51,
    loraText: "Gini loh maksud gue, kalau emang datanya belum beres sekarang, ya udah kita kerjain bareng aja besok pagi.",
    loraConfidence: 96.2,
    loraLatency: 2.58
  },
  4: {
    baseText: "Sebenarnya tidak masalah mau pakai cara yang mana saja, yang penting hasilnya itu sungguh akurat begitu.",
    baseConfidence: 80.5,
    baseLatency: 2.31,
    loraText: "Sebenernya sih nggak masalah mau pakai cara yang mana aja, yang penting hasilnya tuh beneran akurat gitu.",
    loraConfidence: 95.4,
    loraLatency: 2.44
  },
  5: {
    baseText: "Aduh bagaimana ya bilangnya, soalnya dari kemarin itu dia susah sekali dihubungi, pesan saya saja cuma dibaca saja.",
    baseConfidence: 77.8,
    baseLatency: 2.42,
    loraText: "Aduh gimana ya bilangnya, soalnya dari kemarin tuh dia susah banget dihubungi, chat gue aja cuma dibaca doang.",
    loraConfidence: 94.1,
    loraLatency: 2.49
  }
};

/**
 * Simulate transcription for Benchmark Mode or Free-Form Mode
 */
export async function simulateTranscription(
  groundTruth?: string,
  promptId?: number
): Promise<TranscribeResponse> {
  // Simulate network delay for realistic experience
  await new Promise((resolve) => setTimeout(resolve, 1400 + Math.random() * 800));

  const isBenchmark = Boolean(groundTruth && groundTruth.trim().length > 0);

  if (isBenchmark && groundTruth) {
    const reference = groundTruth.trim();
    // Check if matching any preset prompt
    let preset: SimulationPreset | null = null;

    if (promptId && PRESET_RESPONSES[promptId]) {
      preset = PRESET_RESPONSES[promptId];
    } else {
      // Find closest prompt or generate realistic errors
      const matchedIdx = BENCHMARK_PROMPTS.findIndex(
        p => normalizeText(p.text) === normalizeText(reference)
      );
      if (matchedIdx !== -1) {
        preset = PRESET_RESPONSES[BENCHMARK_PROMPTS[matchedIdx].id];
      }
    }

    let baseText = preset ? preset.baseText : generateSimulatedBaseErrors(reference);
    let loraText = preset ? preset.loraText : reference;

    const baseAlign = computeWordAlignment(reference, baseText);
    const loraAlign = computeWordAlignment(reference, loraText);

    const spontaneousWords = detectSpontaneousWords(loraText);
    const werRedAbs = Number(Math.max(0, baseAlign.metrics.wer - loraAlign.metrics.wer).toFixed(2));
    const werRedPct = baseAlign.metrics.wer > 0 
      ? Number(((werRedAbs / baseAlign.metrics.wer) * 100).toFixed(1))
      : 100;

    return {
      status: 'success',
      mode: 'benchmark',
      ground_truth_normalized: normalizeText(reference),
      base_model: {
        text: baseText,
        confidence: preset ? preset.baseConfidence : Number((78 + Math.random() * 6).toFixed(1)),
        latency_sec: preset ? preset.baseLatency : Number((2.2 + Math.random() * 0.4).toFixed(2)),
        metrics: baseAlign.metrics
      },
      lora_model: {
        text: loraText,
        confidence: preset ? preset.loraConfidence : Number((93 + Math.random() * 4).toFixed(1)),
        latency_sec: preset ? preset.loraLatency : Number((2.3 + Math.random() * 0.4).toFixed(2)),
        metrics: loraAlign.metrics
      },
      comparison: {
        wer_reduction_absolute: werRedAbs,
        wer_reduction_relative_pct: werRedPct,
        cer_reduction_absolute: Number(Math.max(0, baseAlign.metrics.cer - loraAlign.metrics.cer).toFixed(2)),
        spontaneous_words_detected: spontaneousWords
      }
    };
  } else {
    // Free-form mode simulation
    const freeformLora = "Wah jujurly kemarin tuh seru banget sih pas kita nongkrong bareng, lu besok mau ikut lagi nggak?";
    const freeformBase = "Wah sejujurnya kemarin itu seru sekali waktu kita berkumpul bersama, kamu besok mau ikut lagi tidak?";

    const spontaneousWords = detectSpontaneousWords(freeformLora);

    return {
      status: 'success',
      mode: 'freeform',
      base_model: {
        text: freeformBase,
        confidence: 82.3,
        latency_sec: 2.38,
        metrics: { wer: 0, cer: 0, substitutions: 0, deletions: 0, insertions: 0, hits: 0 }
      },
      lora_model: {
        text: freeformLora,
        confidence: 95.7,
        latency_sec: 2.44,
        metrics: { wer: 0, cer: 0, substitutions: 0, deletions: 0, insertions: 0, hits: 0 }
      },
      comparison: {
        wer_reduction_absolute: 0,
        wer_reduction_relative_pct: 0,
        cer_reduction_absolute: 0,
        spontaneous_words_detected: spontaneousWords
      }
    };
  }
}

/**
 * Generate synthetic Base model formalization & particle loss for arbitrary custom reference text
 */
function generateSimulatedBaseErrors(text: string): string {
  let modified = text;
  const replacements: [RegExp, string][] = [
    [/\budah\b/gi, 'sudah'],
    [/\bnggak\b/gi, 'tidak'],
    [/\bngga\b/gi, 'tidak'],
    [/\bgak\b/gi, 'tidak'],
    [/\bgitu\b/gi, 'begitu'],
    [/\bgini\b/gi, 'begini'],
    [/\bkayak\b/gi, 'seperti'],
    [/\bbanget\b/gi, 'sekali'],
    [/\btuh\b/gi, 'itu'],
    [/\bnih\b/gi, 'ini'],
    [/\bgue\b/gi, 'saya'],
    [/\blu\b/gi, 'kamu'],
    [/\bdoang\b/gi, 'saja'],
    [/\baja\b/gi, 'saja'],
    [/\bemang\b/gi, 'memang'],
    [/\bgimana\b/gi, 'bagaimana'],
    [/\bbentur\b/gi, 'sebentar'],
    [/\bbentar\b/gi, 'sebentar'],
    [/\bdeh\b/gi, ''],
    [/\bdong\b/gi, ''],
    [/\bsih\b/gi, '']
  ];

  for (const [pattern, repl] of replacements) {
    modified = modified.replace(pattern, repl);
  }

  return modified.replace(/\s+/g, ' ').trim();
}
