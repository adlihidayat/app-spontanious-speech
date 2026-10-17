import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnalyticsPanel } from './AnalyticsPanel';
import { LanguageProvider } from '../../i18n/LanguageContext';
import { TranscribeResponse } from '../../types';

describe('AnalyticsPanel component integration', () => {
  const mockResponse: TranscribeResponse = {
    status: 'success',
    mode: 'benchmark',
    ground_truth_normalized: 'jujur ya kemarin tuh aku udah bilang',
    base_model: {
      text: 'Jujur ya kemarin itu aku sudah bilang',
      confidence: 81.4,
      latency_sec: 2.34,
      metrics: {
        wer: 28.57,
        cer: 14.28,
        substitutions: 2,
        deletions: 0,
        insertions: 0,
        hits: 5,
      },
    },
    lora_model: {
      text: 'Jujur ya, kemarin tuh aku udah bilang',
      confidence: 95.8,
      latency_sec: 2.45,
      metrics: {
        wer: 0,
        cer: 0,
        substitutions: 0,
        deletions: 0,
        insertions: 0,
        hits: 7,
      },
    },
    comparison: {
      wer_reduction_absolute: 28.57,
      wer_reduction_relative_pct: 100,
      cer_reduction_absolute: 14.28,
      spontaneous_words_detected: ['tuh', 'udah'],
    },
  };

  it('renders all analytical panels in benchmark mode', () => {
    render(
      <LanguageProvider>
        <AnalyticsPanel mode="benchmark" response={mockResponse} />
      </LanguageProvider>
    );

    // Executive summary banner
    expect(screen.getByText(/Kesimpulan Hasil Penelitian Tesis/i)).toBeInTheDocument();
    expect(screen.getAllByText(/28.57%/).length).toBeGreaterThanOrEqual(1);

    // Visual bar chart
    expect(screen.getByText(/Perbandingan Visual Error Rate/i)).toBeInTheDocument();

    // Error breakdown table
    expect(screen.getByText(/Rincian Kesalahan Kata/i)).toBeInTheDocument();
    expect(screen.getByText(/Substitusi \(S\)/i)).toBeInTheDocument();

    // Spontaneous particles card
    expect(screen.getByText(/Kosakata & Partikel Ujaran Spontan Terdeteksi/i)).toBeInTheDocument();
    expect(screen.getByText(/"tuh"/i)).toBeInTheDocument();
    expect(screen.getByText(/"udah"/i)).toBeInTheDocument();
  });
});
