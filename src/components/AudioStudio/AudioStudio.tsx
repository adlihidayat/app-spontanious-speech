import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { AppMode, PromptItem } from '../../types';
import { PromptTeleprompter } from './PromptTeleprompter';
import { AudioRecorder } from './AudioRecorder';
import { AudioUploader } from './AudioUploader';
import { AudioPlayer } from './AudioPlayer';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Button } from '../ui/button';
import { Mic, UploadCloud, Loader2, ArrowRight } from 'lucide-react';

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
    <Card className="rounded-3xl border-neutral-200/90 shadow-sm overflow-hidden bg-white">
      <CardContent className="p-6 sm:p-7 space-y-5">
        {/* Sentence Reference Section (Benchmark Mode) */}
        {mode === 'benchmark' ? (
          <PromptTeleprompter
            currentPrompt={currentPrompt}
            groundTruth={groundTruth}
            onSelectPrompt={onSelectPrompt}
            onChangeGroundTruth={onChangeGroundTruth}
          />
        ) : (
          <div className="space-y-1 py-1">
            <h3 className="text-base font-semibold tracking-tight text-neutral-900">
              Mode Bebas: Uji Suara Langsung Tanpa Teks Referensi
            </h3>
            <p className="text-xs text-neutral-400">
              Rekam atau unggah audio percakapan santai apa pun untuk menguji performa model secara langsung tanpa teks acuan.
            </p>
          </div>
        )}

        {/* Subtle Hairline Divider between Reference and Audio Input */}
        <div className="border-t border-neutral-100" />

        {/* Audio Input Tabs: Mic / Upload */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as 'mic' | 'upload')}
          className="w-full space-y-3"
        >
          <div className="flex items-center justify-between">
            <TabsList className="h-9 p-0.5 bg-neutral-100/90 rounded-xl border border-neutral-200/60 inline-flex">
              <TabsTrigger value="mic" className="gap-2 text-xs rounded-lg px-3">
                <Mic className="w-3.5 h-3.5" />
                <span>{t('tab_mic')}</span>
              </TabsTrigger>
              <TabsTrigger value="upload" className="gap-2 text-xs rounded-lg px-3">
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{t('tab_file')}</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="mic" className="mt-0">
            <AudioRecorder
              onAudioReady={handleAudioReady}
              isProcessing={isAnalyzing}
            />
          </TabsContent>

          <TabsContent value="upload" className="mt-0">
            <AudioUploader
              onAudioReady={handleAudioReady}
              isProcessing={isAnalyzing}
            />
          </TabsContent>
        </Tabs>

        {/* Audio Player Preview */}
        {audioSource && (
          <div>
            <AudioPlayer audioUrl={audioSource.url} />
          </div>
        )}

        {/* Transcribe Action Button */}
        <div className="pt-2">
          <Button
            type="button"
            onClick={handleAnalyzeClick}
            disabled={!audioSource || isAnalyzing}
            className="w-full h-11 sm:h-12 gap-2 bg-neutral-900 text-white hover:bg-neutral-800 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:border disabled:border-neutral-200/80 rounded-xl text-sm font-semibold shadow-xs transition-all cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t('analyzing_btn')}</span>
              </>
            ) : (
              <>
                <span>{t('analyze_btn')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
