import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { AppMode, DiffWord, ModelResult } from '../../types';
import { ModelCard } from './ModelCard';
import { Info } from 'lucide-react';

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
      {/* Legend Information Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 shadow-2xs">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <span className="font-semibold text-slate-800">Panduan Warna:</span>
          <span>
            {mode === 'benchmark' ? t('diff_legend_benchmark') : t('diff_legend_freeform')}
          </span>
        </div>

        {mode === 'benchmark' && (
          <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            {t('lower_is_better')}
          </span>
        )}
      </div>

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
