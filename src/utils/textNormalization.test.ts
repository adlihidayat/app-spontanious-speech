import { describe, it, expect } from 'vitest';
import { normalizeText, tokenizeWords } from './textNormalization';

describe('textNormalization utility', () => {
  it('should convert text to lowercase and trim spaces', () => {
    expect(normalizeText('  HALO DUnia  ')).toBe('halo dunia');
  });

  it('should remove punctuation and symbols while preserving alphanumeric characters', () => {
    expect(normalizeText('Halo, apa kabar?! Saya baik-baik saja: "luar biasa".')).toBe(
      'halo apa kabar saya baik baik saja luar biasa'
    );
  });

  it('should convert hyphens and dashes into spaces for standard ASR word alignment', () => {
    expect(normalizeText('ikut-ikutan')).toBe('ikut ikutan');
    expect(normalizeText('jalan–jalan')).toBe('jalan jalan');
  });

  it('should collapse multiple consecutive whitespaces into a single space', () => {
    expect(normalizeText('satu    dua   tiga\n\tempat')).toBe('satu dua tiga empat');
  });

  it('should handle empty or whitespace-only strings gracefully', () => {
    expect(normalizeText('')).toBe('');
    expect(normalizeText('   ')).toBe('');
  });

  it('should tokenize words into clean arrays', () => {
    expect(tokenizeWords('Jujur ya, kemarin tuh aku udah bilang')).toEqual([
      'jujur',
      'ya',
      'kemarin',
      'tuh',
      'aku',
      'udah',
      'bilang',
    ]);
  });

  it('should return empty array for empty or punctuation-only string', () => {
    expect(tokenizeWords('')).toEqual([]);
    expect(tokenizeWords('... !!! ???')).toEqual([]);
  });
});
