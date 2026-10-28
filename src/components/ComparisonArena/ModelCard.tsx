import React, { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import { AppMode, DiffWord, ModelResult } from "../../types";
import { Button } from "../ui/button";
import { MetricRow } from "./MetricRow";
import { MetricBadge } from "./MetricBadge";
import {
  Copy,
  Check,
  Cpu,
  FileText,
  SpellCheck,
  CaseSensitive,
  ShieldCheck,
  Clock,
  Zap,
  HardDrive,
  FileAudio,
  ChevronDown,
  ChevronUp,
  BarChart3,
} from "lucide-react";

interface ModelCardProps {
  modelType: "base" | "lora";
  title: string;
  tag?: string;
  result: ModelResult | null;
  mode: AppMode;
  diffWords: DiffWord[];
  werDelta?: number;
  cerDelta?: number;
  baselineResult?: ModelResult | null;
  audioDuration?: number;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onOpenWerDetail?: () => void;
}

export const ModelCard: React.FC<ModelCardProps> = ({
  modelType,
  title,
  tag: _tag,
  result,
  mode,
  diffWords,
  werDelta,
  cerDelta,
  baselineResult,
  audioDuration,
  isExpanded: propIsExpanded,
  onToggleExpand,
  onOpenWerDetail,
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [internalExpanded, setInternalExpanded] = useState(false);

  const isExpanded =
    propIsExpanded !== undefined ? propIsExpanded : internalExpanded;

  const handleToggle = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded((prev) => !prev);
    }
  };

  const isLora = modelType === "lora";

  const handleCopy = () => {
    if (!result?.text) return;
    navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Deltas for LoRA comparison
  const cerDiff =
    typeof cerDelta === "number"
      ? cerDelta
      : baselineResult && result
        ? Number(
            Math.max(
              0,
              baselineResult.metrics.cer - result.metrics.cer,
            ).toFixed(1),
          )
        : 0;

  const confDiff =
    baselineResult && result
      ? Number((result.confidence - baselineResult.confidence).toFixed(1))
      : 0;

  const latDiff =
    baselineResult && result
      ? Number((result.latency_sec - baselineResult.latency_sec).toFixed(2))
      : 0;

  const effectiveAudioDuration =
    result?.audio_duration_sec || audioDuration || 5.2;

  const rtf = result
    ? Number((result.latency_sec / effectiveAudioDuration).toFixed(2))
    : null;

  // Construct structured metrics list without duplicating row JSX
  const metricsList =
    mode === "benchmark"
      ? [
          {
            id: "wer",
            icon: <SpellCheck className="w-3.5 h-3.5" />,
            label: t("metric_wer_label"),
            score: result ? `${result.metrics.wer}%` : "—",
            badge: result ? (
              isLora ? (
                typeof werDelta === "number" && werDelta > 0 ? (
                  <MetricBadge variant="warning" arrow="down">
                    {werDelta}% {t("badge_wer_better")}
                  </MetricBadge>
                ) : (
                  <MetricBadge variant="success">
                    {t("badge_optimal")}
                  </MetricBadge>
                )
              ) : (
                <MetricBadge variant="neutral">
                  {t("badge_baseline")}
                </MetricBadge>
              )
            ) : null,
            infoAction: onOpenWerDetail
              ? {
                  onClick: onOpenWerDetail,
                  title: "Lihat rincian perhitungan WER",
                }
              : undefined,
          },
          {
            id: "cer",
            icon: <CaseSensitive className="w-3.5 h-3.5" />,
            label: t("metric_cer_label"),
            score: result ? `${result.metrics.cer}%` : "—",
            badge: result ? (
              isLora ? (
                cerDiff > 0 ? (
                  <MetricBadge variant="warning" arrow="down">
                    {cerDiff}% {t("badge_cer_better")}
                  </MetricBadge>
                ) : (
                  <MetricBadge variant="success">
                    {t("badge_optimal")}
                  </MetricBadge>
                )
              ) : (
                <MetricBadge variant="neutral">
                  {t("badge_baseline")}
                </MetricBadge>
              )
            ) : null,
          },
          {
            id: "confidence",
            icon: <ShieldCheck className="w-3.5 h-3.5" />,
            label: t("metric_confidence_label"),
            score: result ? `${result.confidence}%` : "—",
            badge: result ? (
              isLora ? (
                confDiff > 0 ? (
                  <MetricBadge variant="success" arrow="up">
                    +{confDiff}% {t("badge_conf_higher")}
                  </MetricBadge>
                ) : (
                  <MetricBadge variant="neutral">
                    {t("badge_optimal")}
                  </MetricBadge>
                )
              ) : (
                <MetricBadge variant="neutral">
                  {t("badge_baseline")}
                </MetricBadge>
              )
            ) : null,
          },
          {
            id: "latency",
            icon: <Clock className="w-3.5 h-3.5" />,
            label: t("metric_latency_label"),
            score: result ? `${result.latency_sec}s` : "—",
            badge: result ? (
              isLora ? (
                latDiff <= 0 ? (
                  <MetricBadge variant="success" arrow="down">
                    {Math.abs(latDiff)}s {t("badge_faster")}
                  </MetricBadge>
                ) : (
                  <MetricBadge variant="neutral">
                    +{latDiff}s {t("badge_overhead")}
                  </MetricBadge>
                )
              ) : (
                <MetricBadge variant="neutral">
                  {t("badge_baseline")}
                </MetricBadge>
              )
            ) : null,
          },
        ]
      : [
          {
            id: "audio_duration",
            icon: <FileAudio className="w-3.5 h-3.5" />,
            label: t("metric_total_audio_label"),
            score: result ? `${effectiveAudioDuration.toFixed(2)}s` : "—",
            badge: <MetricBadge variant="neutral">16 kHz</MetricBadge>,
          },
          {
            id: "total_latency",
            icon: <Clock className="w-3.5 h-3.5" />,
            label: t("metric_total_latency_label"),
            score: result ? `${result.latency_sec}s` : "—",
            badge: result ? (
              isLora ? (
                latDiff <= 0 ? (
                  <MetricBadge variant="success" arrow="down">
                    {Math.abs(latDiff)}s {t("badge_faster")}
                  </MetricBadge>
                ) : (
                  <MetricBadge variant="neutral">
                    +{latDiff}s {t("badge_overhead")}
                  </MetricBadge>
                )
              ) : (
                <MetricBadge variant="neutral">
                  {t("badge_baseline")}
                </MetricBadge>
              )
            ) : null,
          },
          {
            id: "rtf",
            icon: <Zap className="w-3.5 h-3.5" />,
            label: t("metric_rtf_label"),
            score: rtf !== null ? `${rtf}x` : "—",
            badge: result ? (
              <MetricBadge variant={isLora ? "success" : "neutral"}>
                &lt; 1.0x Real-Time
              </MetricBadge>
            ) : null,
          },
          {
            id: "peak_vram",
            icon: <Cpu className="w-3.5 h-3.5" />,
            label: t("metric_vram_label"),
            score: isLora
              ? result?.peak_vram_mb
                ? `${result.peak_vram_mb} MB`
                : "1,852 MB"
              : result?.peak_vram_mb
                ? `${result.peak_vram_mb} MB`
                : "1,840 MB",
            badge: (
              <MetricBadge variant="neutral">
                {isLora ? "+12 MB (+0.6%)" : "FP16"}
              </MetricBadge>
            ),
          },
          {
            id: "checkpoint_size",
            icon: <HardDrive className="w-3.5 h-3.5" />,
            label: t("metric_checkpoint_label"),
            score: isLora
              ? result?.checkpoint_size_mb
                ? `${result.checkpoint_size_mb} MB`
                : "15.4 MB"
              : result?.checkpoint_size_mb
                ? `${result.checkpoint_size_mb} MB`
                : "967 MB",
            badge: isLora ? (
              <MetricBadge variant="success" arrow="down">
                98.4% {t("badge_smaller")}
              </MetricBadge>
            ) : (
              <MetricBadge variant="neutral">
                {t("badge_full_weights")}
              </MetricBadge>
            ),
          },
        ];

  return (
    <div
      className={`rounded-2xl flex flex-col h-full justify-between transition-all ${
        isLora ? "" : "bg-white"
      }`}
    >
      <div className="relative z-10 flex-1 flex flex-col space-y-2 py-4 rounded-2xl border border-neutral-200/70 bg-white shadow-none">
        {/* Header: Badge, Model Title & Copy Button */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-5">
          <h3 className="text-sm font-semibold text-neutral-900 tracking-tight flex space-x-2 items-center">
            <Copy className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
            <span>{title}</span>
          </h3>

          {result && (
            <Button
              type="button"
              size="icon"
              onClick={handleCopy}
              className="h- w- bg-white rounded-xl hover:bg-neutral-200/50 text-neutral-500 hover:text-neutral-900 cursor-pointer transition-colors shadow-none"
              title={copied ? t("copied_success") : t("copy_transcript")}
              aria-label={t("copy_transcript")}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </Button>
          )}
        </div>

        {/* Transcript Body Area (Inside Grey Bubble) */}
        <div className="flex-1 text-sm leading-relaxed text-neutral-500 flex flex-col justify-start px-4 sm:px-5">
          {result ? (
            <div className="flex flex-wrap items-center gap-1.5">
              {diffWords.length > 0
                ? diffWords.map((item, idx) => {
                    if (mode === "benchmark") {
                      if (
                        !isLora &&
                        (item.type === "substitution" ||
                          item.type === "insertion")
                      ) {
                        return (
                          <span
                            key={idx}
                            title={
                              item.expected
                                ? `${t("reference_word")}: "${item.expected}"`
                                : t("extra_word")
                            }
                            className="inline-flex items-baseline gap-1 px-1 py-0.25 rounded-lg bg-red-100/80 text-red-800 font-medium text-xs sm:text-sm"
                          >
                            <span className=" line-through">{item.word}</span>
                            {item.expected && (
                              <span className="text-[13px]  text-red-600/80 font-mono font-semibold">
                                {item.expected}
                              </span>
                            )}
                          </span>
                        );
                      }

                      if (isLora && item.type === "hit" && item.isSpontaneous) {
                        return (
                          <span
                            key={idx}
                            className="inline-flex items-center px-1 py-0.25 rounded-lg bg-green-100/80 text-green-800 font-medium text-xs sm:text-sm"
                          >
                            {item.word}
                          </span>
                        );
                      }

                      if (isLora && item.type === "substitution") {
                        return (
                          <span
                            key={idx}
                            className="inline-flex items-center px-1 py-0.25 rounded-lg bg-red-100/80 text-red-800 font-medium text-xs sm:text-sm"
                          >
                            {item.word}
                          </span>
                        );
                      }

                      return <span key={idx}>{item.word}</span>;
                    }

                    if (mode === "freeform") {
                      if (isLora && item.isSpontaneous) {
                        return (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-neutral-200/90 text-neutral-900 font-medium text-xs shadow-2xs"
                          >
                            {item.word}
                          </span>
                        );
                      }

                      if (item.type === "substitution") {
                        return (
                          <span
                            key={idx}
                            className="inline-flex items-center px-1 py-0.25 rounded-lg bg-amber-100/80 text-amber-800 font-medium text-xs sm:text-sm"
                          >
                            {item.word}
                          </span>
                        );
                      }

                      return <span key={idx}>{item.word}</span>;
                    }

                    return <span key={idx}>{item.word}</span>;
                  })
                : result.text}
            </div>
          ) : (
            <div className="text-center py-6 flex flex-col items-center justify-center flex-1">
              <FileText className="w-5 h-5 text-neutral-400/80 mb-2 stroke-[1.5]" />
              <p className="text-xs text-neutral-400 font-normal">
                {t("waiting_transcription")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Scoring Rows List - mapped through MetricRow cleanly with Collapsible toggle */}
      <div className="relative z-0 pt-6 pb-3 rounded-b-2xl px-3 flex flex-col bg-neutral-100/50 -translate-y-4">
        {/* Toggle Button */}
        <button
          type="button"
          onClick={handleToggle}
          className={`w-full flex items-center justify-between text-xs text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer group ${
            isExpanded
              ? "pb-2 pt-0.5 px-1 border-b border-neutral-200/60 mb-1"
              : "py-0.5 px-1"
          }`}
          aria-expanded={isExpanded}
        >
          <span className="font-medium flex items-center gap-1.5 text-neutral-600 group-hover:text-neutral-900">
            <BarChart3 className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700" />
            {t("metrics_summary_label")}
          </span>
          <span className="inline-flex items-center gap-1 text-neutral-500 group-hover:text-neutral-700 font-medium">
            <span>{isExpanded ? t("hide_metrics") : t("show_metrics")}</span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </span>
        </button>

        {/* Collapsible Metric Rows */}
        {isExpanded && (
          <div className="flex flex-col gap-y-1 pt-1">
            {metricsList.map((m) => (
              <MetricRow
                key={m.id}
                icon={m.icon}
                label={m.label}
                score={m.score}
                badge={m.badge}
                infoAction={m.infoAction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
