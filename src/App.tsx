import { useState, useMemo, useEffect } from 'react';
import { AppMode, PromptItem, TranscribeResponse, ApiConfig, DiffWord } from './types';
import { BENCHMARK_PROMPTS } from './services/simulation';
import { getStoredApiConfig, transcribeAudio } from './services/api';
import { computeWordAlignment, getDiffWordsForDisplay, compareFreeFormTokens } from './utils/levenshtein';
import { normalizeText } from './utils/textNormalization';
import { Header } from './components/Header';
import { ApiConfigModal } from './components/ApiConfigModal';
import { ModeSwitcher } from './components/ModeSwitcher';
import { AudioStudio } from './components/AudioStudio/AudioStudio';
import { ComparisonArena } from './components/ComparisonArena/ComparisonArena';
import { AnalyticsPanel } from './components/Analytics/AnalyticsPanel';
import { BookOpen, Github, Cpu } from 'lucide-react';

export function App() {

  // Mode state
  const [mode, setMode] = useState<AppMode>('benchmark');

  // Benchmark prompt & ground truth
  const [currentPrompt, setCurrentPrompt] = useState<PromptItem>(BENCHMARK_PROMPTS[0]);
  const [groundTruth, setGroundTruth] = useState<string>(BENCHMARK_PROMPTS[0].text);

  // API Config
  const [apiConfig, setApiConfig] = useState<ApiConfig>(() => getStoredApiConfig());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Inference & Results
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [response, setResponse] = useState<TranscribeResponse | null>(null);

  // When prompt changes, sync ground truth
  const handleSelectPrompt = (prompt: PromptItem) => {
    setCurrentPrompt(prompt);
    setGroundTruth(prompt.text);
  };

  // Recalculate diffs & metrics instantly whenever groundTruth or response changes
  const computedState = useMemo(() => {
    if (!response) {
      return {
        baseDiffs: [] as DiffWord[],
        loraDiffs: [] as DiffWord[],
        baseResult: null,
        loraResult: null,
        werReductionAbs: 0,
        cerReductionAbs: 0,
      };
    }

    if (mode === 'benchmark' && groundTruth.trim().length > 0) {
      const baseAlign = computeWordAlignment(groundTruth, response.base_model.text);
      const loraAlign = computeWordAlignment(groundTruth, response.lora_model.text);

      const baseDiffs = getDiffWordsForDisplay(response.base_model.text, baseAlign.alignment);
      const loraDiffs = getDiffWordsForDisplay(response.lora_model.text, loraAlign.alignment);

      const werRedAbs = Number(Math.max(0, baseAlign.metrics.wer - loraAlign.metrics.wer).toFixed(2));
      const cerRedAbs = Number(Math.max(0, baseAlign.metrics.cer - loraAlign.metrics.cer).toFixed(2));

      const updatedBase = {
        ...response.base_model,
        metrics: baseAlign.metrics,
      };

      const updatedLora = {
        ...response.lora_model,
        metrics: loraAlign.metrics,
      };

      return {
        baseDiffs,
        loraDiffs,
        baseResult: updatedBase,
        loraResult: updatedLora,
        werReductionAbs: werRedAbs,
        cerReductionAbs: cerRedAbs,
      };
    } else {
      // Free-form mode
      const { baseDiffs, loraDiffs } = compareFreeFormTokens(
        response.base_model.text,
        response.lora_model.text
      );

      return {
        baseDiffs,
        loraDiffs,
        baseResult: response.base_model,
        loraResult: response.lora_model,
        werReductionAbs: 0,
        cerReductionAbs: 0,
      };
    }
  }, [response, groundTruth, mode]);

  // Handle run inference
  const handleRunComparison = async (audio: Blob | File) => {
    setIsAnalyzing(true);
    try {
      const gt = mode === 'benchmark' ? groundTruth : '';
      const result = await transcribeAudio(audio, gt, currentPrompt.id, apiConfig);
      setResponse(result);
    } catch (error) {
      console.error('Failed to run transcription comparison', error);
      alert('Terjadi kesalahan saat memproses audio. Silakan coba kembali.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Optional: Auto-populate initial demo simulation if desired for instant thesis presentation
  useEffect(() => {
    // Keep initially ready for quick preview
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      {/* Header */}
      <Header
        apiConfig={apiConfig}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Research Banner Intro */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 flex-shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                Arsitektur Model & Metode Evaluasi
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Membandingkan <strong className="text-slate-900 font-mono">openai/whisper-small</strong> dengan parameter-efficient fine-tuning <strong className="text-slate-900 font-mono">LoRA (r=16, α=32)</strong> pada korpus ujaran santai Bahasa Indonesia.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <a
              href="https://github.com/adlihidayat/app-spontanious-speech"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Repository</span>
            </a>
          </div>
        </div>

        {/* Dual Mode Switcher */}
        <ModeSwitcher
          currentMode={mode}
          onSelectMode={(newMode) => {
            setMode(newMode);
            // reset or adapt response if needed
          }}
        />

        {/* Audio Input Studio */}
        <AudioStudio
          mode={mode}
          currentPrompt={currentPrompt}
          groundTruth={groundTruth}
          onSelectPrompt={handleSelectPrompt}
          onChangeGroundTruth={(newGt) => {
            setGroundTruth(newGt);
            if (response) {
              setResponse({
                ...response,
                ground_truth_normalized: normalizeText(newGt),
              });
            }
          }}
          onRunComparison={handleRunComparison}
          isAnalyzing={isAnalyzing}
        />

        {/* Side-by-Side Comparison Arena */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span>Hasil Komparasi Transkripsi</span>
              {response && (
                <span className="text-xs font-normal text-slate-500 font-mono">
                  ({response.mode === 'benchmark' ? 'Mode Evaluasi' : 'Mode Bebas'})
                </span>
              )}
            </h2>
          </div>

          <ComparisonArena
            mode={mode}
            baseResult={computedState.baseResult}
            loraResult={computedState.loraResult}
            baseDiffWords={computedState.baseDiffs}
            loraDiffWords={computedState.loraDiffs}
            werReductionAbs={computedState.werReductionAbs}
            cerReductionAbs={computedState.cerReductionAbs}
          />
        </div>

        {/* Analytical Summary & Visual Metrics Panel */}
        {response && (
          <AnalyticsPanel
            mode={mode}
            response={{
              ...response,
              base_model: computedState.baseResult || response.base_model,
              lora_model: computedState.loraResult || response.lora_model,
              comparison: {
                ...response.comparison,
                wer_reduction_absolute: computedState.werReductionAbs,
                cer_reduction_absolute: computedState.cerReductionAbs,
              },
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <div className="flex items-center justify-center gap-2 font-medium text-slate-600">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Platform Evaluasi Tesis: Pengenalan Ujaran Spontan Bahasa Indonesia (PEFT-LoRA)</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Dikembangkan untuk demonstrasi sidang tesis komparasi performa model Whisper-Small Base vs. Usulan LoRA.
          </p>
        </div>
      </footer>

      {/* Settings Modal */}
      <ApiConfigModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={apiConfig}
        onUpdateConfig={(newConfig) => setApiConfig(newConfig)}
      />
    </div>
  );
}

export default App;
