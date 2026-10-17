import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { AppMode, PromptItem } from '../../types';
import { PromptTeleprompter } from './PromptTeleprompter';
import { AudioRecorder } from './AudioRecorder';
import { AudioUploader } from './AudioUploader';
import { AudioPlayer } from './AudioPlayer';
import { Mic, UploadCloud, Play, Loader2, Sparkles, HelpCircle } from 'lucide-react';

interface AudioStudioProps {
  mode: AppMode;
  currentPrompt: PromptItem;
  groundTruth: string;
  onSelectPrompt: (prompt: PromptItem) => void;
  onChangeGroundTruth: (text: string) => void;
  onRunComparison: (audio: Blob | File) => void;
  isAnalyzing: boolean;
}

export const AudioStudio: React.FC<AudioStudioProps> = ({
  mode,
  currentPrompt,
  groundTruth,
  onSelectPrompt,
  onChangeGroundTruth,
  onRunComparison,
  isAnalyzing,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'mic' | 'upload'>('mic');
  const [audioSource, setAudioSource] = useState<{ blob: Blob | File; url: string } | null>(null);

  const handleAudioReady = (blob: Blob | File, url: string) => {
    setAudioSource({ blob, url });
  };

  const handleAnalyzeClick = () => {
    if (!audioSource) return;
    onRunComparison(audioSource.blob);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 md:p-6 mb-8">
      {/* If Benchmark Mode, show Prompt Teleprompter */}
      {mode === 'benchmark' && (
        <PromptTeleprompter
          currentPrompt={currentPrompt}
          groundTruth={groundTruth}
          onSelectPrompt={onSelectPrompt}
          onChangeGroundTruth={onChangeGroundTruth}
        />
      )}

      {/* Free-form Mode Helper Banner */}
      {mode === 'freeform' && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50/70 to-blue-50/50 border border-indigo-100 flex items-start gap-3 mb-5">
          <HelpCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-indigo-950">
              Mode Bebas: Uji Suara Langsung Tanpa Teks Referensi
            </span>
            <p className="text-slate-600 leading-relaxed">
              Anda dapat berbicara apa saja (atau mengunggah audio percakapan santai apa pun). Sistem akan secara otomatis membandingkan transkripsi kedua model, menghitung tingkat keyakinan (confidence), mengukur latensi inferensi, dan menandai kosakata spontan Indonesia yang berhasil ditangkap.
            </p>
          </div>
        </div>
      )}

      {/* Audio Source Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('mic')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'mic'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>{t('tab_mic')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'upload'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>{t('tab_file')}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-1">
          {activeTab === 'mic' ? (
            <AudioRecorder
              onAudioReady={handleAudioReady}
              isProcessing={isAnalyzing}
            />
          ) : (
            <AudioUploader
              onAudioReady={handleAudioReady}
              isProcessing={isAnalyzing}
            />
          )}
        </div>

        {/* Audio Player Preview */}
        {audioSource && (
          <div className="pt-2 animate-in fade-in duration-200">
            <AudioPlayer audioUrl={audioSource.url} />
          </div>
        )}

        {/* Main Compare Action Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            {audioSource ? (
              <span className="text-emerald-700 font-medium inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Audio siap dianalisis
              </span>
            ) : (
              <span className="text-slate-400">
                {t('audio_required_alert')}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAnalyzeClick}
            disabled={!audioSource || isAnalyzing}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl font-bold text-sm transition-all shadow-md ${
              audioSource && !isAnalyzing
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-indigo-200 hover:shadow-indigo-300 cursor-pointer scale-100 hover:scale-[1.01]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{t('analyzing_btn')}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                <span>{t('analyze_btn')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
