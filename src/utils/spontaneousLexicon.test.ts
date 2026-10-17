import { describe, it, expect } from 'vitest';
import {
  isSpontaneousWord,
  getSpontaneousInfo,
  detectSpontaneousWords,
  SPONTANEOUS_LEXICON,
} from './spontaneousLexicon';

describe('spontaneousLexicon utility', () => {
  it('should identify spontaneous Indonesian colloquial words', () => {
    const spontaneousWords = [
      'nggak',
      'ngga',
      'gak',
      'udah',
      'kayak',
      'gitu',
      'gini',
      'sih',
      'banget',
      'dong',
      'deh',
      'tuh',
      'nih',
      'gue',
      'lu',
      'gimana',
      'emang',
      'beneran',
      'doang',
      'jujurly',
    ];

    spontaneousWords.forEach((word) => {
      expect(isSpontaneousWord(word)).toBe(true);
    });
  });

  it('should return false for standard formal Indonesian words', () => {
    const formalWords = ['tidak', 'sudah', 'seperti', 'begitu', 'saya', 'kamu', 'bagaimana', 'memang'];
    formalWords.forEach((word) => {
      expect(isSpontaneousWord(word)).toBe(false);
    });
  });

  it('should provide rich metadata for detected terms', () => {
    const info = getSpontaneousInfo('nggak');
    expect(info).not.toBeNull();
    expect(info?.formalEquivalent).toBe('tidak');
    expect(info?.category).toBe('contraction');
    expect(info?.descriptionId).toBeDefined();
    expect(info?.descriptionEn).toBeDefined();

    const infoSih = getSpontaneousInfo('sih');
    expect(infoSih?.category).toBe('particle');

    const infoJujurly = getSpontaneousInfo('jujurly');
    expect(infoJujurly?.formalEquivalent).toBe('sejujurnya');
  });

  it('should extract distinct spontaneous words from a sentence', () => {
    const sentence = 'Jujur ya, kemarin tuh aku udah bilang ke dia kalau nggak usah ikut, eh malah nekat dong!';
    const detected = detectSpontaneousWords(sentence);

    expect(detected).toContain('tuh');
    expect(detected).toContain('udah');
    expect(detected).toContain('nggak');
    expect(detected).toContain('eh');
    expect(detected).toContain('dong');
    expect(detected).not.toContain('bilang');
    expect(detected).not.toContain('kemarin');
  });

  it('should handle punctuation in tested words seamlessly', () => {
    expect(isSpontaneousWord('"udah"')).toBe(true);
    expect(isSpontaneousWord('dong,')).toBe(true);
    expect(isSpontaneousWord('sih?')).toBe(true);
  });

  it('contains valid entries in SPONTANEOUS_LEXICON', () => {
    expect(Object.keys(SPONTANEOUS_LEXICON).length).toBeGreaterThan(15);
  });
});
