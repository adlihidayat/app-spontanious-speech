import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { AppMode, TranscribeResponse } from '../../types';
import { ExecutiveSummary } from './ExecutiveSummary';
import { VisualBarChart } from './VisualBarChart';
import { ErrorBreakdownTable } from './ErrorBreakdownTable';
import { SpontaneousParticlesCard } from './SpontaneousParticlesCard';

interface AnalyticsPanelProps {
  mode: AppMode;
  response: TranscribeResponse;
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  mode,
  response,
}) => {
  const { t } = useLanguage();
  const { base_model, lora_model, comparison } = response;

  const isBenchmark = mode === 'benchmark';

  return (
    <div className="space-y-6 pt-2">
      <div className="flex items-center justify-between pb-1">
        <h2 className="text-base sm:text-lg font-semibold tracking-tight text-neutral-900">
          {t('summary_title')}
        </h2>
      </div>

      {/* Executive Summary Highlight Banner */}
      <ExecutiveSummary
        isBenchmark={isBenchmark}
        werReductionAbs={comparison.wer_reduction_absolute}
        werReductionPct={comparison.wer_reduction_relative_pct}
        cerReductionAbs={comparison.cer_reduction_absolute}
        baseConfidence={base_model.confidence}
        loraConfidence={lora_model.confidence}
        spontaneousCount={comparison.spontaneous_words_detected?.length || 0}
      />

      {/* Benchmark Mode Visual Charts & Error Table */}
      {isBenchmark && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <VisualBarChart
            baseWer={base_model.metrics.wer}
            loraWer={lora_model.metrics.wer}
            baseCer={base_model.metrics.cer}
            loraCer={lora_model.metrics.cer}
          />

          <ErrorBreakdownTable
            baseMetrics={base_model.metrics}
            loraMetrics={lora_model.metrics}
          />
        </div>
      )}

      {/* Spontaneous Vocabulary Detection Card */}
      <SpontaneousParticlesCard
        detectedTokens={comparison.spontaneous_words_detected || []}
        baseText={base_model.text}
      />
    </div>
  );
};
