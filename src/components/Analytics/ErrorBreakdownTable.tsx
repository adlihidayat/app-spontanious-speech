import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ModelMetrics } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../ui/table';

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
      desc: 'Salah ditranskripsi atau diganti',
      base: baseMetrics.substitutions,
      lora: loraMetrics.substitutions,
      delta: baseMetrics.substitutions - loraMetrics.substitutions,
    },
    {
      label: t('stat_deletions'),
      desc: 'Hilang / tidak terdeteksi',
      base: baseMetrics.deletions,
      lora: loraMetrics.deletions,
      delta: baseMetrics.deletions - loraMetrics.deletions,
    },
    {
      label: t('stat_insertions'),
      desc: 'Kata tambahan di luar ucapan',
      base: baseMetrics.insertions,
      lora: loraMetrics.insertions,
      delta: baseMetrics.insertions - loraMetrics.insertions,
    },
    {
      label: t('stat_hits'),
      desc: 'Sesuai dengan teks referensi',
      base: baseMetrics.hits,
      lora: loraMetrics.hits,
      delta: loraMetrics.hits - baseMetrics.hits,
    },
  ];

  return (
    <Card className="rounded-3xl border-neutral-200/90 shadow-sm overflow-hidden">
      <CardHeader className="border-b border-neutral-100 p-5 sm:p-6 pb-4">
        <CardTitle className="text-base text-neutral-900">
          {t('error_breakdown_title')}
        </CardTitle>
        <CardDescription className="text-xs text-neutral-400">
          Rincian operasi kata berdasarkan jarak Levenshtein
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('col_metric')}</TableHead>
              <TableHead>{t('col_base')}</TableHead>
              <TableHead>{t('col_lora')}</TableHead>
              <TableHead>{t('col_delta')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <span className="font-semibold text-neutral-900 block text-xs sm:text-sm">
                    {row.label}
                  </span>
                  <span className="text-[11px] text-neutral-400 hidden sm:block">
                    {row.desc}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-neutral-500">
                  {row.base}
                </TableCell>
                <TableCell className="font-mono font-medium text-neutral-900">
                  {row.lora}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {row.delta !== 0 ? (
                    <span className={row.delta > 0 ? 'text-emerald-600 font-semibold' : 'text-red-600 font-semibold'}>
                      {row.delta > 0 ? `+${row.delta}` : row.delta}
                    </span>
                  ) : (
                    <span className="text-neutral-400">0</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
