import { describe, it, expect } from 'vitest';
import { translations, TranslationKey } from './translations';

describe('i18n translations', () => {
  it('should have matching keys in both Indonesian (id) and English (en) dictionaries', () => {
    const idKeys = Object.keys(translations.id).sort();
    const enKeys = Object.keys(translations.en).sort();

    expect(idKeys).toEqual(enKeys);
  });

  it('should not contain empty translation values', () => {
    Object.entries(translations.id).forEach(([key, val]) => {
      expect(val.trim().length, `Indonesian translation for "${key}" is empty`).toBeGreaterThan(0);
    });

    Object.entries(translations.en).forEach(([key, val]) => {
      expect(val.trim().length, `English translation for "${key}" is empty`).toBeGreaterThan(0);
    });
  });

  it('contains critical thesis and metric keys', () => {
    const criticalKeys: TranslationKey[] = [
      'app_title',
      'app_subtitle',
      'mode_benchmark',
      'mode_freeform',
      'base_model_title',
      'lora_model_title',
      'metric_wer',
      'metric_cer',
      'metric_improvement',
      'metric_confidence',
      'metric_latency',
      'diff_legend_benchmark',
      'diff_legend_freeform',
    ];

    criticalKeys.forEach((k) => {
      expect(translations.id[k]).toBeDefined();
      expect(translations.en[k]).toBeDefined();
    });
  });
});
