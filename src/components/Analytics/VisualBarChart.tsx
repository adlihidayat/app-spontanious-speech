import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

interface VisualBarChartProps {
  baseWer: number;
  loraWer: number;
  baseCer: number;
  loraCer: number;
}

export const VisualBarChart: React.FC<VisualBarChartProps> = ({
  baseWer,
  loraWer,
  baseCer,
  loraCer,
}) => {
  const { t } = useLanguage();

  const maxWer = Math.max(baseWer, loraWer, 30);
  const maxCer = Math.max(baseCer, loraCer, 20);

  const baseWerWidth = Math.min(100, (baseWer / maxWer) * 100);
  const loraWerWidth = Math.min(100, (loraWer / maxWer) * 100);

  const baseCerWidth = Math.min(100, (baseCer / maxCer) * 100);
  const loraCerWidth = Math.min(100, (loraCer / maxCer) * 100);

  return (
    <Card className="rounded-3xl border-neutral-200/90 shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-100 p-5 sm:p-6 pb-4 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base text-neutral-900">
            Perbandingan Visual Error Rate (WER & CER)
          </CardTitle>
          <CardDescription className="text-xs text-neutral-400">
            Perbandingan tingkat kesalahan kata dan karakter
          </CardDescription>
        </div>

        <Badge variant="outline" className="text-[11px] font-mono text-neutral-500 bg-white border-neutral-200">
          {t('lower_is_better')}
        </Badge>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 pt-5 space-y-5">
        {/* WER Comparison */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-medium text-neutral-700">
            <span>{t('metric_wer')}</span>
            <span className="font-mono text-neutral-400 text-[11px]">Makin rendah makin baik</span>
          </div>

          {/* Base Model WER */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-500">Base:</span>
              <span className="font-medium text-red-600">{baseWer}%</span>
            </div>
            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(2, baseWerWidth)}%` }}
              />
            </div>
          </div>

          {/* LoRA Model WER */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-900 font-medium">LoRA (Usulan):</span>
              <span className="font-medium text-emerald-600">{loraWer}%</span>
            </div>
            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(2, loraWerWidth)}%` }}
              />
            </div>
          </div>
        </div>

        {/* CER Comparison */}
        <div className="space-y-2.5 pt-4 border-t border-neutral-100">
          <div className="flex items-center justify-between text-xs font-medium text-neutral-700">
            <span>{t('metric_cer')}</span>
            <span className="font-mono text-neutral-400 text-[11px]">Makin rendah makin baik</span>
          </div>

          {/* Base Model CER */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-500">Base:</span>
              <span className="font-medium text-red-600">{baseCer}%</span>
            </div>
            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(2, baseCerWidth)}%` }}
              />
            </div>
          </div>

          {/* LoRA Model CER */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-900 font-medium">LoRA (Usulan):</span>
              <span className="font-medium text-emerald-600">{loraCer}%</span>
            </div>
            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(2, loraCerWidth)}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
