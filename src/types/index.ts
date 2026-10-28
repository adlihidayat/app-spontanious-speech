export type AppMode = 'benchmark' | 'freeform';

export type Language = 'id' | 'en';

export interface ModelMetrics {
  wer: number;
  cer: number;
  substitutions: number;
  deletions: number;
  insertions: number;
  hits: number;
}

export interface ModelResult {
  text: string;
  confidence: number;
  latency_sec: number;
  metrics: ModelMetrics;
  audio_duration_sec?: number;
  rtf?: number;
  peak_vram_mb?: number;
  checkpoint_size_mb?: number;
}

export interface ComparisonSummary {
  wer_reduction_absolute: number;
  wer_reduction_relative_pct: number;
  cer_reduction_absolute: number;
  spontaneous_words_detected: string[];
}

export interface TranscribeResponse {
  status: 'success' | 'error';
  mode: AppMode;
  ground_truth_normalized?: string;
  base_model: ModelResult;
  lora_model: ModelResult;
  comparison: ComparisonSummary;
  message?: string;
}

export type DiffType = 'hit' | 'substitution' | 'deletion' | 'insertion' | 'spontaneous';

export interface DiffWord {
  word: string;
  type: DiffType;
  expected?: string;
  isSpontaneous?: boolean;
}

export interface PromptItem {
  id: number;
  text: string;
  category: string;
}

export interface ApiConfig {
  baseUrl: string;
  isDemoMode: boolean;
  isConnected: boolean;
  lastChecked?: number;
}
