import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ModelCard } from './ModelCard';
import { LanguageProvider } from '../../i18n/LanguageContext';
import { DiffWord, ModelResult } from '../../types';

describe('ModelCard component', () => {
  const mockBaseResult: ModelResult = {
    text: 'aku sudah makan',
    confidence: 81.4,
    latency_sec: 2.34,
    metrics: {
      wer: 33.33,
      cer: 15.0,
      substitutions: 1,
      deletions: 0,
      insertions: 0,
      hits: 2,
    },
  };

  const mockDiffWords: DiffWord[] = [
    { word: 'aku', type: 'hit' },
    { word: 'sudah', type: 'substitution', expected: 'udah' },
    { word: 'makan', type: 'hit' },
  ];

  it('renders Baseline model details and error metrics correctly in benchmark mode', () => {
    render(
      <LanguageProvider>
        <ModelCard
          modelType="base"
          title="Baseline: OpenAI Whisper-Small"
          tag="Zero-Shot / Pre-trained Model"
          result={mockBaseResult}
          mode="benchmark"
          diffWords={mockDiffWords}
        />
      </LanguageProvider>
    );

    expect(screen.getByText('Baseline: OpenAI Whisper-Small')).toBeInTheDocument();
    expect(screen.getByText('33.33%')).toBeInTheDocument(); // WER
    expect(screen.getByText('15%')).toBeInTheDocument(); // CER
    expect(screen.getByText('81.4%')).toBeInTheDocument(); // Confidence
    expect(screen.getByText('2.34s')).toBeInTheDocument(); // Latency
    expect(screen.getByText('sudah')).toBeInTheDocument();
  });

  it('renders LoRA model with accuracy improvement delta in benchmark mode', () => {
    const mockLoraResult: ModelResult = {
      text: 'aku udah makan',
      confidence: 95.8,
      latency_sec: 2.45,
      metrics: {
        wer: 0,
        cer: 0,
        substitutions: 0,
        deletions: 0,
        insertions: 0,
        hits: 3,
      },
    };

    const loraDiffs: DiffWord[] = [
      { word: 'aku', type: 'hit' },
      { word: 'udah', type: 'hit', isSpontaneous: true },
      { word: 'makan', type: 'hit' },
    ];

    render(
      <LanguageProvider>
        <ModelCard
          modelType="lora"
          title="Usulan: Whisper-Small + LoRA (Spontan ID)"
          tag="PEFT-LoRA Fine-Tuned (10-20h Spontaneous ID)"
          result={mockLoraResult}
          mode="benchmark"
          diffWords={loraDiffs}
          werDelta={33.33}
        />
      </LanguageProvider>
    );

    expect(screen.getByText('Usulan: Whisper-Small + LoRA (Spontan ID)')).toBeInTheDocument();
    expect(screen.getAllByText('0%')).toHaveLength(2); // WER and CER
    expect(screen.getByText(/33.33%/)).toBeInTheDocument(); // werDelta badge
    expect(screen.getByText('95.8%')).toBeInTheDocument(); // Confidence
  });

  it('renders all 5 required metrics in freeform mode without informal trait collision', () => {
    render(
      <LanguageProvider>
        <ModelCard
          modelType="lora"
          title="Usulan: Whisper-Small + LoRA (Spontan ID)"
          tag="PEFT-LoRA Fine-Tuned (10-20h Spontaneous ID)"
          result={{
            text: 'Wah jujurly kemarin tuh seru banget sih',
            confidence: 95.7,
            latency_sec: 2.44,
            metrics: { wer: 0, cer: 0, substitutions: 0, deletions: 0, insertions: 0, hits: 0 },
          }}
          mode="freeform"
          diffWords={[]}
          audioDuration={5.2}
        />
      </LanguageProvider>
    );

    // Verify all 5 metrics are rendered
    expect(screen.getByText('Total Audio Diproses')).toBeInTheDocument();
    expect(screen.getByText('5.20s')).toBeInTheDocument();

    expect(screen.getByText('Total Waktu Inferensi')).toBeInTheDocument();
    expect(screen.getByText('2.44s')).toBeInTheDocument();

    expect(screen.getByText('Real-Time Factor (RTF)')).toBeInTheDocument();
    expect(screen.getByText('0.47x')).toBeInTheDocument();

    expect(screen.getByText('Peak VRAM Usage')).toBeInTheDocument();
    expect(screen.getByText('1,852 MB')).toBeInTheDocument();

    expect(screen.getByText('Model Checkpoint Size')).toBeInTheDocument();
    expect(screen.getByText('15.4 MB')).toBeInTheDocument();

    // Verify "Tends to normalize to formal spelling" is NOT present
    expect(screen.queryByText(/Tends to normalize/i)).toBeNull();
    expect(screen.queryByText(/Cenderung menormalisasi/i)).toBeNull();
  });
});
