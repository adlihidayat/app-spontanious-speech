import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { AppMode, DiffWord, ModelResult } from '../../types';
import { ModelCard } from './ModelCard';

interface ComparisonArenaProps {
  mode: AppMode;
  baseResult: ModelResult | null;
  loraResult: ModelResult | null;
  baseDiffWords: DiffWord[];
  loraDiffWords: DiffWord[];
  werReductionAbs?: number;
  cerReductionAbs?: number;
}

export const ComparisonArena: React.FC<ComparisonArenaProps> = ({
  mode,
  baseResult,
  loraResult,
  baseDiffWords,
  loraDiffWords,
  werReductionAbs,
  cerReductionAbs,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 mb-8">
      {/* Side-by-Side Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Baseline Card */}
        <ModelCard
          modelType="base"
          title={t('base_model_title')}
          tag={t('base_model_tag')}
          result={baseResult}
          mode={mode}
          diffWords={baseDiffWords}
        />

        {/* LoRA Proposed Card */}
        <ModelCard
          modelType="lora"
          title={t('lora_model_title')}
          tag={t('lora_model_tag')}
          result={loraResult}
          mode={mode}
          diffWords={loraDiffWords}
          werDelta={werReductionAbs}
          cerDelta={cerReductionAbs}
        />
      </div>
    </div>
  );
};
