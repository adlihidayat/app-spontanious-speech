import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { PromptItem } from '../../types';
import { BENCHMARK_PROMPTS } from '../../services/simulation';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Shuffle } from 'lucide-react';

interface PromptTeleprompterProps {
  currentPrompt: PromptItem;
  groundTruth: string;
  onSelectPrompt: (prompt: PromptItem) => void;
  onChangeGroundTruth?: (newText: string) => void;
}

export const PromptTeleprompter: React.FC<PromptTeleprompterProps> = ({
  currentPrompt,
  groundTruth,
  onSelectPrompt,
  onChangeGroundTruth,
}) => {
  const { t } = useLanguage();

  const handleRandomize = () => {
    const available = BENCHMARK_PROMPTS.filter((p) => p.id !== currentPrompt.id);
    const random = available[Math.floor(Math.random() * available.length)];
    onSelectPrompt(random);
    if (onChangeGroundTruth) {
      onChangeGroundTruth(random.text);
    }
  };

  return (
    <div className="space-y-3">
      {/* Prompt Bar: Indicators & Controls */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-medium">
            Prompt #{currentPrompt.id} / 5
          </Badge>
          <Badge variant="outline" className="text-xs font-normal text-neutral-500 bg-white border-neutral-200">
            {currentPrompt.category}
          </Badge>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRandomize}
            className="h-8 gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 rounded-lg px-2.5"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>{t('prompt_randomize')}</span>
          </Button>
        </div>
      </div>

      {/* Prompt sentence display */}
      <div className="py-2">
        <p className="text-base sm:text-xl font-medium tracking-tight text-neutral-900 leading-relaxed">
          "{groundTruth}"
        </p>
      </div>
    </div>
  );
};
