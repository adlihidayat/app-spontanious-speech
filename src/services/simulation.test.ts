import { describe, it, expect } from 'vitest';
import { simulateTranscription, BENCHMARK_PROMPTS } from './simulation';

describe('simulation service', () => {
  it('has 5 distinct benchmark prompts covering spontaneous speech particles', () => {
    expect(BENCHMARK_PROMPTS.length).toBe(5);
    BENCHMARK_PROMPTS.forEach((p) => {
      expect(p.text.length).toBeGreaterThan(10);
      expect(p.category.length).toBeGreaterThan(5);
    });
  });

  it('generates simulated responses for preset prompt with lower WER for LoRA', async () => {
    const prompt1 = BENCHMARK_PROMPTS[0];
    const res = await simulateTranscription(prompt1.text, prompt1.id);

    expect(res.status).toBe('success');
    expect(res.mode).toBe('benchmark');
    expect(res.base_model.text).toBeDefined();
    expect(res.lora_model.text).toBeDefined();

    // LoRA model should have lower WER and higher confidence than Base model
    expect(res.lora_model.metrics.wer).toBeLessThan(res.base_model.metrics.wer);
    expect(res.lora_model.confidence).toBeGreaterThan(res.base_model.confidence);
    expect(res.comparison.wer_reduction_absolute).toBeGreaterThan(0);
    expect(res.comparison.spontaneous_words_detected.length).toBeGreaterThan(0);
  });

  it('generates simulated response for freeform mode without ground truth', async () => {
    const res = await simulateTranscription();

    expect(res.status).toBe('success');
    expect(res.mode).toBe('freeform');
    expect(res.base_model.text).toBeDefined();
    expect(res.lora_model.text).toBeDefined();
    expect(res.lora_model.confidence).toBeGreaterThan(res.base_model.confidence);
    expect(res.comparison.spontaneous_words_detected.length).toBeGreaterThan(0);
  });

  it('generates simulated response for custom ground truth text', async () => {
    const customText = 'Gue emang nggak suka gitu kalau dia datang terlambat terus.';
    const res = await simulateTranscription(customText);

    expect(res.status).toBe('success');
    expect(res.mode).toBe('benchmark');
    // Base should formalize 'nggak' to 'tidak', 'gitu' to 'begitu', etc.
    expect(res.base_model.text).toContain('tidak');
    expect(res.lora_model.metrics.wer).toBeLessThanOrEqual(res.base_model.metrics.wer);
  });
});
