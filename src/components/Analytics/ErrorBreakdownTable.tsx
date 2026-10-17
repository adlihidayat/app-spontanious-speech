import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ModelMetrics } from '../../types';
import { Table, CheckCircle2, XCircle, MinusCircle, PlusCircle } from 'lucide-react';

interface ErrorBreakdownTableProps {
  baseMetrics: ModelMetrics;
  loraMetrics: ModelMetrics;
}

export const ErrorBreakdownTable: React.FC<ErrorBreakdownTableProps> = ({
  baseMetrics,
  loraMetrics,
}) => {
  const { t } = useLanguage();

  const rows = [
    {
      label: t('stat_substitutions'),
      desc: 'Kata spontan yang salah ditranskripsi atau diganti',
      icon: <XCircle className="w-4 h-4 text-rose-500" />,
      base: baseMetrics.substitutions,
      lora: loraMetrics.substitutions,
      delta: baseMetrics.substitutions - loraMetrics.substitutions,
      isGoodWhenReduced: true,
    },
    {
      label: t('stat_deletions'),
      desc: 'Partikel/kata yang hilang atau tidak terdeteksi',
      icon: <MinusCircle className="w-4 h-4 text-amber-500" />,
      base: baseMetrics.deletions,
      lora: loraMetrics.deletions,
      delta: baseMetrics.deletions - loraMetrics.deletions,
      isGoodWhenReduced: true,
    },
    {
      label: t('stat_insertions'),
      desc: 'Kata tambahan yang tidak ada dalam ucapan asli',
      icon: <PlusCircle className="w-4 h-4 text-purple-500" />,
      base: baseMetrics.insertions,
      lora: loraMetrics.insertions,
      delta: baseMetrics.insertions - loraMetrics.insertions,
      isGoodWhenReduced: true,
    },
    {
      label: t('stat_hits'),
      desc: 'Kata yang ditranskripsikan persis sesuai referensi',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      base: baseMetrics.hits,
      lora: loraMetrics.hits,
      delta: loraMetrics.hits - baseMetrics.hits,
      isGoodWhenReduced: false, // Higher hits is better
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Header */}
      <div className="p-5 md:p-6 border-b border-slate-100 flex items-center gap-2">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
          <Table className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-sm sm:text-base text-slate-900">
            {t('error_breakdown_title')}
          </h3>
          <p className="text-xs text-slate-500">
            Klasifikasi operasi perubahan kata (S, D, I, H) berdasarkan jarak Levenshtein
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 sm:px-6">{t('col_metric')}</th>
              <th className="py-3 px-4 sm:px-6">{t('col_base')}</th>
              <th className="py-3 px-4 sm:px-6 text-indigo-900 font-bold bg-indigo-50/50">
                {t('col_lora')}
              </th>
              <th className="py-3 px-4 sm:px-6 text-emerald-800">{t('col_delta')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-4 sm:px-6">
                  <div className="flex items-center gap-2.5">
                    {row.icon}
                    <div>
                      <span className="font-semibold text-slate-900 block">
                        {row.label}
                      </span>
                      <span className="text-[11px] text-slate-400 font-normal hidden sm:block">
                        {row.desc}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-slate-700">
                  {row.base}
                </td>
                <td className="py-3.5 px-4 sm:px-6 font-mono font-extrabold text-indigo-700 bg-indigo-50/30">
                  {row.lora}
                </td>
                <td className="py-3.5 px-4 sm:px-6 font-mono font-bold">
                  {row.delta > 0 ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-xs">
                      +{row.delta} {row.isGoodWhenReduced ? 'berkurang' : 'bertambah'}
                    </span>
                  ) : row.delta === 0 ? (
                    <span className="text-slate-400">0</span>
                  ) : (
                    <span className="text-slate-500 font-mono">{row.delta}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
