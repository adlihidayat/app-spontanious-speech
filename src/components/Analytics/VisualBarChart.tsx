import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { BarChart3, TrendingDown } from 'lucide-react';

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

  // Find max scale for normalization
  const maxWer = Math.max(baseWer, loraWer, 30);
  const maxCer = Math.max(baseCer, loraCer, 20);

  const baseWerWidth = Math.min(100, (baseWer / maxWer) * 100);
  const loraWerWidth = Math.min(100, (loraWer / maxWer) * 100);

  const baseCerWidth = Math.min(100, (baseCer / maxCer) * 100);
  const loraCerWidth = Math.min(100, (loraCer / maxCer) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              Perbandingan Visual Error Rate (WER & CER)
            </h3>
            <p className="text-xs text-slate-500">
              Perbandingan tingkat kesalahan kata dan karakter antara kedua model
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md self-start sm:self-auto flex items-center gap-1">
          <TrendingDown className="w-3.5 h-3.5" />
          {t('lower_is_better')}
        </span>
      </div>

      {/* WER Comparison Bars */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>{t('metric_wer')}</span>
          <span className="font-mono text-slate-500">Target: 0%</span>
        </div>

        {/* Base Model WER */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Base Whisper-Small:</span>
            <span className="font-mono font-bold text-slate-800">{baseWer}%</span>
          </div>
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.max(4, baseWerWidth)}%` }}
            />
          </div>
        </div>

        {/* LoRA Model WER */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-indigo-900 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Whisper-Small + LoRA:
            </span>
            <span className="font-mono font-extrabold text-emerald-600">{loraWer}%</span>
          </div>
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out shadow-xs"
              style={{ width: `${Math.max(4, loraWerWidth)}%` }}
            />
          </div>
        </div>
      </div>

      {/* CER Comparison Bars */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>{t('metric_cer')}</span>
          <span className="font-mono text-slate-500">Target: 0%</span>
        </div>

        {/* Base Model CER */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Base Whisper-Small:</span>
            <span className="font-mono font-bold text-slate-800">{baseCer}%</span>
          </div>
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-rose-400 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.max(4, baseCerWidth)}%` }}
            />
          </div>
        </div>

        {/* LoRA Model CER */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-indigo-900 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Whisper-Small + LoRA:
            </span>
            <span className="font-mono font-extrabold text-emerald-600">{loraCer}%</span>
          </div>
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out shadow-xs"
              style={{ width: `${Math.max(4, loraCerWidth)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
