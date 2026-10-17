/**
 * Indonesian Spontaneous Speech Lexicon & Particle Detector
 * Covers common colloquial particles, contractions, slang, and discourse markers.
 */

export interface SpontaneousTermInfo {
  formalEquivalent?: string;
  category: 'particle' | 'contraction' | 'slang' | 'filler' | 'pronoun';
  descriptionId: string;
  descriptionEn: string;
}

export const SPONTANEOUS_LEXICON: Record<string, SpontaneousTermInfo> = {
  // Particles & Clitics
  sih: { formalEquivalent: '-', category: 'particle', descriptionId: 'Partikel penegas atau pelembut ujaran', descriptionEn: 'Emphatic/softening discourse particle' },
  dong: { formalEquivalent: '-', category: 'particle', descriptionId: 'Partikel penegas permintaan atau kesimpulan', descriptionEn: 'Pleading or assertive discourse particle' },
  deh: { formalEquivalent: '-', category: 'particle', descriptionId: 'Partikel penegas atau kepasrahan', descriptionEn: 'Resignation or agreement discourse particle' },
  tuh: { formalEquivalent: 'itu', category: 'contraction', descriptionId: 'Bentuk kasual dari kata penunjuk "itu"', descriptionEn: 'Colloquial form of demonstrative "itu"' },
  nih: { formalEquivalent: 'ini', category: 'contraction', descriptionId: 'Bentuk kasual dari kata penunjuk "ini"', descriptionEn: 'Colloquial form of demonstrative "ini"' },
  kok: { formalEquivalent: 'mengapa', category: 'particle', descriptionId: 'Partikel penanda keheranan / tanda tanya', descriptionEn: 'Question/surprise particle' },
  loh: { formalEquivalent: '-', category: 'particle', descriptionId: 'Partikel penarik perhatian lawan bicara', descriptionEn: 'Attention-grabbing discourse particle' },
  lah: { formalEquivalent: '-', category: 'particle', descriptionId: 'Partikel penegas kalimat', descriptionEn: 'Sentence emphasis particle' },
  kan: { formalEquivalent: 'bukan', category: 'contraction', descriptionId: 'Partikel konfirmasi ujaran', descriptionEn: 'Tag question/confirmation particle' },
  eh: { formalEquivalent: '-', category: 'filler', descriptionId: 'Interjeksi penanda keraguan atau pergantian topik', descriptionEn: 'Conversational hesitation interjection' },
  ya: { formalEquivalent: 'iya', category: 'filler', descriptionId: 'Interjeksi persetujuan / pengisi jeda', descriptionEn: 'Agreement or filler interjection' },

  // Contractions & Slang
  nggak: { formalEquivalent: 'tidak', category: 'contraction', descriptionId: 'Penyangkalan informal dari "tidak"', descriptionEn: 'Informal negation ("tidak")' },
  ngga: { formalEquivalent: 'tidak', category: 'contraction', descriptionId: 'Penyangkalan informal dari "tidak"', descriptionEn: 'Informal negation ("tidak")' },
  gak: { formalEquivalent: 'tidak', category: 'contraction', descriptionId: 'Penyangkalan informal dari "tidak"', descriptionEn: 'Informal negation ("tidak")' },
  udah: { formalEquivalent: 'sudah', category: 'contraction', descriptionId: 'Bentuk pendek dari "sudah"', descriptionEn: 'Colloquial abbreviation of "sudah"' },
  dah: { formalEquivalent: 'sudah', category: 'contraction', descriptionId: 'Bentuk pendek dari "sudah"', descriptionEn: 'Shortened colloquial form of "sudah"' },
  gitu: { formalEquivalent: 'begitu', category: 'contraction', descriptionId: 'Kontraksi dari "begitu"', descriptionEn: 'Contraction of "begitu" (like that)' },
  gini: { formalEquivalent: 'begini', category: 'contraction', descriptionId: 'Kontraksi dari "begini"', descriptionEn: 'Contraction of "begini" (like this)' },
  kayak: { formalEquivalent: 'seperti', category: 'slang', descriptionId: 'Sinonim informal untuk "seperti"', descriptionEn: 'Informal for "like" / "such as"' },
  banget: { formalEquivalent: 'sangat', category: 'slang', descriptionId: 'Penguat derajat informal ("sangat")', descriptionEn: 'Informal degree adverb ("very")' },
  beneran: { formalEquivalent: 'sungguh-sungguh', category: 'slang', descriptionId: 'Bentuk informal untuk kepastian', descriptionEn: 'Informal for "really" / "truly"' },
  emang: { formalEquivalent: 'memang', category: 'contraction', descriptionId: 'Bentuk santai dari "memang"', descriptionEn: 'Casual form of "memang" (indeed)' },
  doang: { formalEquivalent: 'saja / hanya', category: 'slang', descriptionId: 'Pembatas informal untuk "hanya"', descriptionEn: 'Colloquial restrictor ("only / just")' },
  gimana: { formalEquivalent: 'bagaimana', category: 'contraction', descriptionId: 'Bentuk lisan santai dari "bagaimana"', descriptionEn: 'Casual spoken form of "bagaimana"' },
  gue: { formalEquivalent: 'saya / aku', category: 'pronoun', descriptionId: 'Pronomina orang pertama informal (dialek Jakarta)', descriptionEn: 'Informal 1st-person pronoun' },
  gw: { formalEquivalent: 'saya / aku', category: 'pronoun', descriptionId: 'Singkatan pronomina orang pertama', descriptionEn: 'Informal 1st-person pronoun abbreviation' },
  lu: { formalEquivalent: 'kamu / anda', category: 'pronoun', descriptionId: 'Pronomina orang kedua informal', descriptionEn: 'Informal 2nd-person pronoun' },
  lo: { formalEquivalent: 'kamu / anda', category: 'pronoun', descriptionId: 'Pronomina orang kedua informal', descriptionEn: 'Informal 2nd-person pronoun' },
  jujurly: { formalEquivalent: 'sejujurnya', category: 'slang', descriptionId: 'Campuran slang bahasa gaul ("jujur" + "-ly")', descriptionEn: 'Indonesian-English slang for "honestly"' },
  mager: { formalEquivalent: 'malas gerak', category: 'slang', descriptionId: 'Akronim gaul "malas bergerak"', descriptionEn: 'Slang for "lazy to move"' },
  baper: { formalEquivalent: 'bawa perasaan', category: 'slang', descriptionId: 'Akronim gaul "bawa perasaan"', descriptionEn: 'Slang for overly emotional' },
  santuy: { formalEquivalent: 'santai', category: 'slang', descriptionId: 'Metatesis / bahasa gaul dari "santai"', descriptionEn: 'Slang permutation of "santai"' },
  nekat: { formalEquivalent: 'nekad', category: 'slang', descriptionId: 'Istilah spontan untuk berani tanpa pikir panjang', descriptionEn: 'Reckless / bold colloquial expression' },
  beres: { formalEquivalent: 'selesai', category: 'slang', descriptionId: 'Istilah santai untuk selesai/tuntas', descriptionEn: 'Informal for settled / finished' },
};

export function isSpontaneousWord(word: string): boolean {
  if (!word) return false;
  const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean in SPONTANEOUS_LEXICON;
}

export function getSpontaneousInfo(word: string): SpontaneousTermInfo | null {
  if (!word) return null;
  const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
  return SPONTANEOUS_LEXICON[clean] || null;
}

export function detectSpontaneousWords(text: string): string[] {
  if (!text) return [];
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/);
  const detected = new Set<string>();
  for (const w of words) {
    if (w && isSpontaneousWord(w)) {
      detected.add(w);
    }
  }
  return Array.from(detected);
}
