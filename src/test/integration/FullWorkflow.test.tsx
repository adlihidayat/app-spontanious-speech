import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';
import { LanguageProvider } from '../../i18n/LanguageContext';

describe('Full Application User Workflow Integration', () => {
  it('renders initial application components in Indonesian by default', () => {
    render(
      <LanguageProvider>
        <App />
      </LanguageProvider>
    );

    // Title and badge
    expect(screen.getByText(/Tesis \/ Penelitian ASR Bahasa Indonesia/i)).toBeInTheDocument();
    expect(screen.getByText(/Evaluasi Komparatif Whisper-Small: Base vs. LoRA/i)).toBeInTheDocument();

    // Dual-mode switcher
    expect(screen.getByText(/Mode Evaluasi \(Dengan Ground Truth\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Mode Bebas \(Uji Suara Langsung\)/i)).toBeInTheDocument();

    // Default Teleprompter prompt #1
    expect(screen.getByText(/Prompt #1 \/ 5/i)).toBeInTheDocument();

    // Models cards
    expect(screen.getByText('Baseline: OpenAI Whisper-Small')).toBeInTheDocument();
    expect(screen.getByText('Usulan: Whisper-Small + LoRA (Spontan ID)')).toBeInTheDocument();
  });

  it('switches languages seamlessly between Indonesian and English', () => {
    render(
      <LanguageProvider>
        <App />
      </LanguageProvider>
    );

    // Click English switch button
    const enBtn = screen.getByText(/🇬🇧 EN/i);
    fireEvent.click(enBtn);

    // App title and tabs should now be in English
    expect(screen.getByText(/Whisper-Small Comparative Evaluation: Base vs. LoRA/i)).toBeInTheDocument();
    expect(screen.getByText(/Benchmark Mode \(With Ground Truth\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Free-Form Mode \(Live Audio Test\)/i)).toBeInTheDocument();

    // Switch back to Indonesian
    const idBtn = screen.getByText(/🇮🇩 ID/i);
    fireEvent.click(idBtn);

    expect(screen.getByText(/Evaluasi Komparatif Whisper-Small: Base vs. LoRA/i)).toBeInTheDocument();
  });

  it('switches between Benchmark Mode and Free-Form Mode', () => {
    render(
      <LanguageProvider>
        <App />
      </LanguageProvider>
    );

    // Teleprompter is present in Benchmark mode
    expect(screen.getByText(/Prompt #1 \/ 5/i)).toBeInTheDocument();

    // Switch to Free-Form mode
    const freeformTab = screen.getByText(/Mode Bebas \(Uji Suara Langsung\)/i);
    fireEvent.click(freeformTab);

    // Teleprompter prompt counter should no longer be present
    expect(screen.queryByText(/Prompt #1 \/ 5/i)).not.toBeInTheDocument();

    // Free-form description banner should appear
    expect(screen.getByText(/Mode Bebas: Uji Suara Langsung Tanpa Teks Referensi/i)).toBeInTheDocument();
  });

  it('opens and closes API settings modal', () => {
    render(
      <LanguageProvider>
        <App />
      </LanguageProvider>
    );

    // Click settings button
    const settingsBtn = screen.getByTitle(/Pengaturan Koneksi Backend & Model/i);
    fireEvent.click(settingsBtn);

    // Modal title should appear
    expect(screen.getByText(/Pengaturan Koneksi Backend & Model/i)).toBeInTheDocument();
    expect(screen.getByText(/URL Endpoint Hugging Face Space/i)).toBeInTheDocument();

    // Close modal
    const closeBtn = screen.getByText(/Tutup/i);
    fireEvent.click(closeBtn);

    expect(screen.queryByText(/URL Endpoint Hugging Face Space/i)).not.toBeInTheDocument();
  });
});
