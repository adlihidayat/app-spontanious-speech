import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PromptTeleprompter } from './PromptTeleprompter';
import { BENCHMARK_PROMPTS } from '../../services/simulation';
import { LanguageProvider } from '../../i18n/LanguageContext';

describe('PromptTeleprompter integration', () => {
  it('renders current prompt text, prompter index, target category, and only acak kalimat button', () => {
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

    expect(screen.getByText(/Kasus 1/i)).toBeInTheDocument();
    expect(screen.getByText(`"${prompt.text}"`)).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes(prompt.category))).toBeInTheDocument();

    // Verify Acak Kalimat button exists
    expect(screen.getByRole('button', { name: /Acak Kalimat/i })).toBeInTheDocument();

    // Verify next and edit buttons are removed
    expect(screen.queryByRole('button', { name: /Kalimat Berikutnya/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Edit Teks Referensi/i })).not.toBeInTheDocument();
  });

  it('randomizes prompt when "Acak Kalimat" is clicked', () => {
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

    const randomizeBtn = screen.getByRole('button', { name: /Acak Kalimat/i });
    fireEvent.click(randomizeBtn);

    expect(onSelectPrompt).toHaveBeenCalledTimes(1);
    const selectedPrompt = onSelectPrompt.mock.calls[0][0];
    expect(selectedPrompt.id).not.toBe(prompt.id);
    expect(onChangeGroundTruth).toHaveBeenCalledWith(selectedPrompt.text);
  });
});
