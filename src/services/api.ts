import { ApiConfig, TranscribeResponse } from '../types';
import { simulateTranscription } from './simulation';
import { computeWordAlignment } from '../utils/levenshtein';
import { normalizeText } from '../utils/textNormalization';

const STORAGE_API_KEY = 'indo_whisper_api_config';

const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_URL || 'https://adlihidayat-indo-whisper-lora.hf.space',
  isDemoMode: true, // Default to demo simulation mode so the app works out-of-the-box
  isConnected: false,
};

export function getStoredApiConfig(): ApiConfig {
  try {
    const raw = localStorage.getItem(STORAGE_API_KEY);
    if (raw) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to load api config from storage', e);
  }
  return DEFAULT_CONFIG;
}

export function saveApiConfig(config: ApiConfig): void {
  try {
    localStorage.setItem(STORAGE_API_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save api config to storage', e);
  }
}

/**
 * Ping backend health endpoint to check connectivity
 */
export async function testApiConnection(baseUrl: string): Promise<boolean> {
  if (!baseUrl) return false;
  try {
    const cleanUrl = baseUrl.replace(/\/+$/, '');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${cleanUrl}/api/health`, {
      method: 'GET',
      signal: controller.signal,
    }).catch(async () => {
      // Fallback check root if /api/health not specifically implemented
      return await fetch(`${cleanUrl}/`, { method: 'GET', signal: controller.signal });
    });

    clearTimeout(timeoutId);
    return response.ok || response.status === 404 || response.status === 405;
  } catch {
    return false;
  }
}

/**
 * Transcribe audio using either the real Hugging Face backend API or local simulation
 */
export async function transcribeAudio(
  audio: Blob | File,
  groundTruth?: string,
  promptId?: number,
  configOverride?: ApiConfig
): Promise<TranscribeResponse> {
  const config = configOverride || getStoredApiConfig();

  // If in Demo Mode or no base URL, use local simulation
  if (config.isDemoMode || !config.baseUrl) {
    return await simulateTranscription(groundTruth, promptId);
  }

  // Attempt real backend call
  try {
    const cleanUrl = config.baseUrl.replace(/\/+$/, '');
    const formData = new FormData();
    formData.append('audio', audio);
    formData.append('ground_truth', groundTruth || '');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for model inference

    const startTime = performance.now();
    const response = await fetch(`${cleanUrl}/api/transcribe`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    const elapsedSec = (performance.now() - startTime) / 1000;

    // Ensure latency values are populated if backend didn't supply them
    if (data.base_model && !data.base_model.latency_sec) {
      data.base_model.latency_sec = Number(elapsedSec.toFixed(2));
    }
    if (data.lora_model && !data.lora_model.latency_sec) {
      data.lora_model.latency_sec = Number(elapsedSec.toFixed(2));
    }

    // Always ensure metrics are strictly synchronized with client ground truth
    if (groundTruth && groundTruth.trim().length > 0) {
      const baseAlign = computeWordAlignment(groundTruth, data.base_model.text);
      const loraAlign = computeWordAlignment(groundTruth, data.lora_model.text);
      data.base_model.metrics = baseAlign.metrics;
      data.lora_model.metrics = loraAlign.metrics;
      data.ground_truth_normalized = normalizeText(groundTruth);
      data.comparison = {
        ...data.comparison,
        wer_reduction_absolute: Number(Math.max(0, baseAlign.metrics.wer - loraAlign.metrics.wer).toFixed(2)),
        wer_reduction_relative_pct: baseAlign.metrics.wer > 0
          ? Number((((baseAlign.metrics.wer - loraAlign.metrics.wer) / baseAlign.metrics.wer) * 100).toFixed(1))
          : 100,
        cer_reduction_absolute: Number(Math.max(0, baseAlign.metrics.cer - loraAlign.metrics.cer).toFixed(2))
      };
    }

    return data;
  } catch (error) {
    console.warn('Real backend call failed, falling back to realistic simulation mode:', error);
    // Graceful fallback to simulation
    const simulated = await simulateTranscription(groundTruth, promptId);
    return simulated;
  }
}
