import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PromptTeleprompter } from './PromptTeleprompter';
import { BENCHMARK_PROMPTS } from '../../services/simulation';
import { LanguageProvider } from '../../i18n/LanguageContext';

describe('PromptTeleprompter integration', () => {
  it('renders current prompt text, prompter index, and target category', () => {
    const prompt = BENCHMARK_PROMPTS[0];
    const onSelectPrompt = vi.fn();
    const onChangeGroundTruth = vi.fn();

    render(
      <LanguageProvider>
        <PromptTeleprompter
          currentPrompt={prompt}
          groundTruth={prompt.text}
          onSelectPrompt={onSelectPrompt}
          onChangeGroundTruth={onChangeGroundTruth}
        />
      </LanguageProvider>
    );

    expect(screen.getByText(/Prompt #1 \/ 5/i)).toBeInTheDocument();
    expect(screen.getByText(`"${prompt.text}"`)).toBeInTheDocument();
    expect(screen.getByText(prompt.category)).toBeInTheDocument();
  });

  it('cycles to next prompt when "Kalimat Berikutnya" is clicked', () => {
    const prompt = BENCHMARK_PROMPTS[0];
    const onSelectPrompt = vi.fn();
    const onChangeGroundTruth = vi.fn();

    render(
      <LanguageProvider>
        <PromptTeleprompter
          currentPrompt={prompt}
          groundTruth={prompt.text}
          onSelectPrompt={onSelectPrompt}
          onChangeGroundTruth={onChangeGroundTruth}
        />
      </LanguageProvider>
    );

    const nextBtn = screen.getByText(/Kalimat Berikutnya/i);
    fireEvent.click(nextBtn);

    expect(onSelectPrompt).toHaveBeenCalledWith(BENCHMARK_PROMPTS[1]);
  });

  it('allows user to edit reference text and saves changes', () => {
    const prompt = BENCHMARK_PROMPTS[0];
    const onSelectPrompt = vi.fn();
    const onChangeGroundTruth = vi.fn();

    render(
      <LanguageProvider>
        <PromptTeleprompter
          currentPrompt={prompt}
          groundTruth={prompt.text}
          onSelectPrompt={onSelectPrompt}
          onChangeGroundTruth={onChangeGroundTruth}
        />
      </LanguageProvider>
    );

    // Click edit toggle
    const editToggle = screen.getByText(/Edit Teks Referensi/i);
    fireEvent.click(editToggle);

    // Textarea should now be visible
    const textarea = screen.getByPlaceholderText(/Ketik atau tempel teks referensi/i);
    expect(textarea).toBeInTheDocument();

    // Type new text
    fireEvent.change(textarea, { target: { value: 'Kalimat acuan kustom baru untuk pengujian' } });

    // Click save
    const saveBtn = screen.getByText(/Simpan Perubahan/i);
    fireEvent.click(saveBtn);

    expect(onChangeGroundTruth).toHaveBeenCalledWith('Kalimat acuan kustom baru untuk pengujian');
  });
});
