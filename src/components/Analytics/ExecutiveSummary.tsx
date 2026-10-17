import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { TrendingDown, Sparkles, Award } from 'lucide-react';

interface ExecutiveSummaryProps {
  werReductionAbs: number;
  werReductionPct: number;
  cerReductionAbs: number;
  baseConfidence: number;
  loraConfidence: number;
  spontaneousCount: number;
  isBenchmark: boolean;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  werReductionAbs,
  werReductionPct,
  cerReductionAbs,
  baseConfidence,
  loraConfidence,
  spontaneousCount,
  isBenchmark,
}) => {
  const { t } = useLanguage();

  if (isBenchmark) {
    return (
      <div className="rounded-2xl p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-lg relative overflow-hidden mb-6">
        {/* Subtle background decoration */}
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-8 pointer-events-none">
          <Award className="w-48 h-48" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-white/20 backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-emerald-200" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Kesimpulan Hasil Penelitian Tesis
            </span>
          </div>

          <p className="text-lg sm:text-xl font-bold leading-relaxed max-w-3xl">
            {t('summary_banner_benchmark', {
              werGain: `${werReductionAbs}% (Reduksi relatif ${werReductionPct}%)`,
            })}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
              <span className="text-[11px] text-emerald-200 block font-medium">
                Reduksi Mutlak WER
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <TrendingDown className="w-4 h-4 text-emerald-300" />
                <span className="font-mono text-xl font-bold">
                  {werReductionAbs}%
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
              <span className="text-[11px] text-emerald-200 block font-medium">
                Reduksi Mutlak CER
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <TrendingDown className="w-4 h-4 text-emerald-300" />
                <span className="font-mono text-xl font-bold">
                  {cerReductionAbs}%
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-emerald-200 block font-medium">
                Peningkatan Keyakinan Model
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-mono text-xl font-bold">
                  +{(loraConfidence - baseConfidence).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Free-form mode banner
  return (
    <div className="rounded-2xl p-6 bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 text-white shadow-lg relative overflow-hidden mb-6">
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-white/20 backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-indigo-200" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
            Hasil Deteksi Mode Bebas
          </span>
        </div>

        <p className="text-lg sm:text-xl font-bold leading-relaxed max-w-3xl">
          {t('summary_banner_freeform', {
            count: spontaneousCount,
            confidence: loraConfidence,
          })}
        </p>

        <div className="flex flex-wrap gap-4 pt-1">
          <div className="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
            <span className="text-[11px] text-indigo-200 block">Partikel Spontan</span>
            <span className="font-mono text-xl font-bold">{spontaneousCount} kata</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
            <span className="text-[11px] text-indigo-200 block">Keyakinan LoRA</span>
            <span className="font-mono text-xl font-bold">{loraConfidence}%</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
            <span className="text-[11px] text-indigo-200 block">Keyakinan Base</span>
            <span className="font-mono text-xl font-bold">{baseConfidence}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
