import React, { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import { AppMode, DiffWord, ModelResult } from "../../types";
import { Card, CardHeader, CardContent } from "../ui/card";
import { ModelCard } from "./ModelCard";
import { WerDetailModal } from "./WerDetailModal";

interface ComparisonArenaProps {
  mode: AppMode;
  baseResult: ModelResult | null;
  loraResult: ModelResult | null;
  baseDiffWords: DiffWord[];
  loraDiffWords: DiffWord[];
  werReductionAbs?: number;
  cerReductionAbs?: number;
  audioDuration?: number;
}

export const ComparisonArena: React.FC<ComparisonArenaProps> = ({
  mode,
  baseResult,
  loraResult,
  baseDiffWords,
  loraDiffWords,
  werReductionAbs,
  cerReductionAbs,
  audioDuration,
}) => {
  const { t } = useLanguage();
  const [isWerDetailOpen, setIsWerDetailOpen] = useState(false);

  return (
    <>
      <Card className="rounded-3xl border-none overflow-hidden p-0">
        {/* Card Header with h2, p, and right-aligned Legend Badges */}
        <CardHeader className="p-5 sm:p-6 pb-4 sm:pb-2 space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-medium tracking-tight text-neutral-900">
                {t("comparison_title")}
              </h2>
              <p className="text-sm font-normal text-neutral-500">
                {t("comparison_subtitle")}
              </p>
            </div>
          </div>
        </CardHeader>

        {/* Card Content: Comparison Columns inside 1 Card */}
        <CardContent className="p-5 sm:p-6 pt-4 sm:pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
            {/* Baseline Model Column */}
            <ModelCard
              modelType="base"
              title={t("base_model_title")}
              tag={t("base_model_tag")}
              result={baseResult}
              mode={mode}
              diffWords={baseDiffWords}
              audioDuration={audioDuration}
              onOpenWerDetail={
                mode === "benchmark"
                  ? () => setIsWerDetailOpen(true)
                  : undefined
              }
            />

            {/* LoRA Proposed Model Column */}
            <ModelCard
              modelType="lora"
              title={t("lora_model_title")}
              tag={t("lora_model_tag")}
              result={loraResult}
              mode={mode}
              diffWords={loraDiffWords}
              werDelta={werReductionAbs}
              cerDelta={cerReductionAbs}
              baselineResult={baseResult}
              audioDuration={audioDuration}
              onOpenWerDetail={
                mode === "benchmark"
                  ? () => setIsWerDetailOpen(true)
                  : undefined
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* WER Breakdown Detail Modal */}
      {mode === "benchmark" && (
        <WerDetailModal
          isOpen={isWerDetailOpen}
          onClose={() => setIsWerDetailOpen(false)}
          baseResult={baseResult}
          loraResult={loraResult}
          werReductionAbs={werReductionAbs}
        />
      )}
    </>
  );
};
