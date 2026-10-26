import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { TrendingDown, ArrowUpRight } from 'lucide-react';

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
      <Card className="rounded-3xl border-neutral-200/90 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-neutral-100 p-5 sm:p-6 pb-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-normal text-neutral-500 bg-white border-neutral-200">
              Kesimpulan Hasil Penelitian Tesis
            </Badge>
          </div>
          <CardTitle className="text-base sm:text-lg pt-1 text-neutral-900 leading-snug">
            {t('summary_banner_benchmark', {
              werGain: `${werReductionAbs}% (Reduksi relatif ${werReductionPct}%)`,
            })}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/60">
              <span className="text-[11px] text-neutral-400 block font-mono uppercase tracking-wider">
                Reduksi Mutlak WER
              </span>
              <div className="flex items-baseline gap-1.5 mt-1.5">
                <TrendingDown className="w-4 h-4 text-emerald-600" />
                <span className="font-mono text-2xl font-bold text-emerald-600">
                  {werReductionAbs}%
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/60">
              <span className="text-[11px] text-neutral-400 block font-mono uppercase tracking-wider">
                Reduksi Mutlak CER
              </span>
              <div className="flex items-baseline gap-1.5 mt-1.5">
                <TrendingDown className="w-4 h-4 text-emerald-600" />
                <span className="font-mono text-2xl font-bold text-emerald-600">
                  {cerReductionAbs}%
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/60">
              <span className="text-[11px] text-neutral-400 block font-mono uppercase tracking-wider">
                Peningkatan Keyakinan Model
              </span>
              <div className="flex items-baseline gap-1.5 mt-1.5">
                <ArrowUpRight className="w-4 h-4 text-neutral-700" />
                <span className="font-mono text-2xl font-bold text-neutral-900">
                  +{(loraConfidence - baseConfidence).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Free-form mode banner
  return (
    <Card className="rounded-3xl border-neutral-200/90 shadow-sm overflow-hidden">
      <CardHeader className="border-b border-neutral-100 p-5 sm:p-6 pb-4">
        <Badge variant="outline" className="text-xs font-normal text-neutral-500 bg-white border-neutral-200 w-fit">
          Kesimpulan Hasil Pengujian Bebas
        </Badge>
        <CardTitle className="text-base sm:text-lg pt-1 text-neutral-900 leading-snug">
          {t('summary_banner_freeform', { count: spontaneousCount })}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 sm:p-6 pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/60">
            <span className="text-[11px] text-neutral-400 block font-mono uppercase tracking-wider">
              Partikel Spontan Terdeteksi
            </span>
            <span className="font-mono text-2xl font-bold text-neutral-900 mt-1.5 block">
              {spontaneousCount} kata
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/60">
            <span className="text-[11px] text-neutral-400 block font-mono uppercase tracking-wider">
              Selisih Keyakinan (LoRA vs Base)
            </span>
            <span className="font-mono text-2xl font-bold text-neutral-900 mt-1.5 block">
              +{(loraConfidence - baseConfidence).toFixed(1)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
