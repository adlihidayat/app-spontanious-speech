import { useState, useMemo } from "react";
import {
  AppMode,
  PromptItem,
  TranscribeResponse,
  ApiConfig,
  DiffWord,
} from "./types";
import {
  BENCHMARK_PROMPTS,
  getPresetMockResponse,
  getFreeformMockResponse,
} from "./services/simulation";
import { getStoredApiConfig, transcribeAudio } from "./services/api";
import {
  computeWordAlignment,
  getDiffWordsForDisplay,
  compareFreeFormTokens,
} from "./utils/levenshtein";
import { normalizeText } from "./utils/textNormalization";
import { Header } from "./components/Header";
import { ApiConfigModal } from "./components/ApiConfigModal";
import { ModeSwitcher } from "./components/ModeSwitcher";
import { AudioStudio } from "./components/AudioStudio/AudioStudio";
import { ComparisonArena } from "./components/ComparisonArena/ComparisonArena";

export function App() {
  // Mode state
  const [mode, setMode] = useState<AppMode>("benchmark");

  // Benchmark prompt & ground truth
  const [currentPrompt, setCurrentPrompt] = useState<PromptItem>(
    BENCHMARK_PROMPTS[0],
  );
  const [groundTruth, setGroundTruth] = useState<string>(
    BENCHMARK_PROMPTS[0].text,
  );

  // API Config
  const [apiConfig, setApiConfig] = useState<ApiConfig>(() =>
    getStoredApiConfig(),
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Inference & Results
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioDuration, setAudioDuration] = useState<number>(5.4);
  const [response, setResponse] = useState<TranscribeResponse | null>(() =>
    getPresetMockResponse(1),
  );

  // When prompt changes, sync ground truth & update mock response
  const handleSelectPrompt = (prompt: PromptItem) => {
    setCurrentPrompt(prompt);
    setGroundTruth(prompt.text);
    const promptDurations: Record<number, number> = {
      1: 5.4,
      2: 4.8,
      3: 6.2,
      4: 5.6,
      5: 6.0,
    };
    setAudioDuration(promptDurations[prompt.id] || 5.2);
    if (mode === "benchmark") {
      setResponse(getPresetMockResponse(prompt.id));
    }
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

    if (mode === "benchmark" && groundTruth.trim().length > 0) {
      const baseAlign = computeWordAlignment(
        groundTruth,
        response.base_model.text,
      );
      const loraAlign = computeWordAlignment(
        groundTruth,
        response.lora_model.text,
      );

      const baseDiffs = getDiffWordsForDisplay(
        response.base_model.text,
        baseAlign.alignment,
      );
      const loraDiffs = getDiffWordsForDisplay(
        response.lora_model.text,
        loraAlign.alignment,
      );

      const werRedAbs = Number(
        Math.max(0, baseAlign.metrics.wer - loraAlign.metrics.wer).toFixed(2),
      );
      const cerRedAbs = Number(
        Math.max(0, baseAlign.metrics.cer - loraAlign.metrics.cer).toFixed(2),
      );

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
        response.lora_model.text,
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
  const handleRunComparison = async (audio: Blob | File, duration?: number) => {
    setIsAnalyzing(true);
    if (duration && isFinite(duration) && duration > 0) {
      setAudioDuration(duration);
    }
    try {
      const gt = mode === "benchmark" ? groundTruth : "";
      const result = await transcribeAudio(
        audio,
        gt,
        currentPrompt.id,
        apiConfig,
      );
      setResponse(result);
    } catch (error) {
      console.error("Failed to run transcription comparison", error);
      alert("Terjadi kesalahan saat memproses audio. Silakan coba kembali.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 antialiased relative">
      {/* Subtle top dot pattern from reference design */}
      <div className="absolute inset-x-0 top-0 h-96 bg-dot-pattern [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10 opacity-60" />

      {/* Header */}
      <Header
        apiConfig={apiConfig}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-8 space-y-8">
        {/* Dual Mode Switcher */}
        <ModeSwitcher
          currentMode={mode}
          onSelectMode={(newMode) => {
            setMode(newMode);
            if (newMode === "freeform") {
              setAudioDuration(5.2);
              setResponse(getFreeformMockResponse());
            } else {
              setAudioDuration(5.4);
              setResponse(getPresetMockResponse(currentPrompt.id));
            }
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
        <ComparisonArena
          mode={mode}
          baseResult={computedState.baseResult}
          loraResult={computedState.loraResult}
          baseDiffWords={computedState.baseDiffs}
          loraDiffWords={computedState.loraDiffs}
          werReductionAbs={computedState.werReductionAbs}
          cerReductionAbs={computedState.cerReductionAbs}
          audioDuration={audioDuration}
        />
      </main>

      {/* Minimal Academic Footer */}
      <footer className="mt-auto border-t border-neutral-100 py-6 text-xs text-neutral-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Platform Evaluasi Tesis: Pengenalan Ujaran Spontan Bahasa Indonesia
            (PEFT-LoRA)
          </p>
          <div className="flex items-center gap-4">
            <p>Copyright Dhiyaadli@2026</p>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              title="Pengaturan Koneksi Backend & Model"
              className="text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
            >
              Pengaturan API
            </button>
          </div>
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
