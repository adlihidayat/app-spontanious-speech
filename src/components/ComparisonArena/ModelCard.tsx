import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { AppMode, DiffWord, ModelResult } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Copy, Check, ArrowDown } from 'lucide-react';

interface ModelCardProps {
  modelType: 'base' | 'lora';
  title: string;
  tag: string;
  result: ModelResult | null;
  mode: AppMode;
  diffWords: DiffWord[];
  werDelta?: number;
  cerDelta?: number;
}

export const ModelCard: React.FC<ModelCardProps> = ({
  modelType,
  title,
  tag,
  result,
  mode,
  diffWords,
  werDelta,
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = React.useState(false);

  const isLora = modelType === 'lora';

  const handleCopy = () => {
    if (!result?.text) return;
    navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className={`rounded-3xl border-neutral-200/90 shadow-sm flex flex-col h-full overflow-hidden ${isLora ? 'ring-1 ring-neutral-900/10' : ''}`}>
      {/* Header */}
      <CardHeader className="flex flex-row items-start justify-between gap-3 border-b border-neutral-100 p-5 sm:p-6 pb-4 space-y-0">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge
              variant={isLora ? 'default' : 'secondary'}
              className={`font-normal text-[11px] ${isLora ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700'}`}
            >
              {isLora ? 'Usulan Tesis' : 'Baseline'}
            </Badge>
            <span className="text-xs text-neutral-400 font-mono">
              {tag}
            </span>
          </div>
          <CardTitle className="text-base text-neutral-900">
            {title}
          </CardTitle>
        </div>

        {result && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-8 w-8 rounded-lg text-neutral-400 hover:text-neutral-700"
            title="Salin transkrip"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        )}
      </CardHeader>

      {/* Transcript Body Area */}
      <CardContent className="p-5 sm:p-6 pt-5 flex-1 flex flex-col justify-between space-y-5">
        <div className="min-h-[130px] p-4 sm:p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200/70 text-sm leading-relaxed text-neutral-800 flex flex-col justify-center">
          {result ? (
            <div className="flex flex-wrap items-center gap-1.5">
              {diffWords.length > 0
                ? diffWords.map((item, idx) => {
                    // Benchmark Mode diff styling:
                    if (mode === 'benchmark') {
                      if (!isLora && (item.type === 'substitution' || item.type === 'insertion')) {
                        return (
                          <span
                            key={idx}
                            title={item.expected ? `Acuan: "${item.expected}"` : 'Tambahan'}
                            className="px-1.5 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200/80 font-medium text-xs sm:text-sm"
                          >
                            <span>{item.word}</span>
                            {item.expected && (
                              <span className="text-[10px] ml-1 line-through opacity-70 font-mono">
                                ({item.expected})
                              </span>
                            )}
                          </span>
                        );
                      }

                      if (isLora && item.type === 'hit' && item.isSpontaneous) {
                        return (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-medium text-xs sm:text-sm"
                          >
                            {item.word}
                          </span>
                        );
                      }

                      if (isLora && item.type === 'substitution') {
                        return (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200/80 font-medium text-xs sm:text-sm"
                          >
                            {item.word}
                          </span>
                        );
                      }

                      return <span key={idx}>{item.word}</span>;
                    }

                    // Free-form Mode diff styling:
                    if (mode === 'freeform') {
                      if (isLora && item.isSpontaneous) {
                        return (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-full bg-neutral-900 text-white font-medium text-xs"
                          >
                            {item.word}
                          </span>
                        );
                      }

                      if (item.type === 'substitution') {
                        return (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium text-xs sm:text-sm"
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
            <div className="text-center py-4">
              <p className="text-xs text-neutral-400 font-normal">
                {t('waiting_transcription')}
              </p>
            </div>
          )}
        </div>

        {/* Footer Metrics Grid */}
        <div className="pt-4 border-t border-neutral-100 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* WER */}
          {mode === 'benchmark' && (
            <div className="p-3 rounded-xl bg-neutral-50/70 border border-neutral-200/60 min-h-[72px] flex flex-col justify-between">
              <span className="text-[11px] text-neutral-500 font-medium block" title="Word Error Rate (Tingkat Kesalahan Kata)">
                WER (Kata)
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-mono text-base sm:text-lg font-bold text-neutral-900">
                  {result ? `${result.metrics.wer}%` : '—'}
                </span>
                {isLora && result && typeof werDelta === 'number' && werDelta > 0 && (
                  <span className="inline-flex items-center text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-1 py-0.5 rounded">
                    <ArrowDown className="w-2.5 h-2.5" />
                    {werDelta}%
                  </span>
                )}
              </div>
            </div>
          )}

          {/* CER */}
          {mode === 'benchmark' && (
            <div className="p-3 rounded-xl bg-neutral-50/70 border border-neutral-200/60 min-h-[72px] flex flex-col justify-between">
              <span className="text-[11px] text-neutral-500 font-medium block" title="Character Error Rate (Tingkat Kesalahan Huruf)">
                CER (Huruf)
              </span>
              <span className="font-mono text-base sm:text-lg font-bold text-neutral-900 mt-1 block">
                {result ? `${result.metrics.cer}%` : '—'}
              </span>
            </div>
          )}

          {/* Confidence */}
          <div className="p-3 rounded-xl bg-neutral-50/70 border border-neutral-200/60 min-h-[72px] flex flex-col justify-between">
            <span className="text-[11px] text-neutral-500 font-medium block" title="Tingkat Keyakinan Model (Model Confidence)">
              Keyakinan
            </span>
            <span className="font-mono text-base sm:text-lg font-bold text-neutral-900 mt-1 block">
              {result ? `${result.confidence}%` : '—'}
            </span>
          </div>

          {/* Latency */}
          <div className="p-3 rounded-xl bg-neutral-50/70 border border-neutral-200/60 min-h-[72px] flex flex-col justify-between">
            <span className="text-[11px] text-neutral-500 font-medium block" title="Waktu Komputasi / Inferensi">
              Latensi
            </span>
            <span className="font-mono text-base sm:text-lg font-bold text-neutral-900 mt-1 block">
              {result ? `${result.latency_sec}s` : '—'}
            </span>
          </div>

          {/* Free-form note */}
          {mode === 'freeform' && (
            <div className="p-3 rounded-xl bg-neutral-50/70 border border-neutral-200/60 col-span-2 min-h-[72px] flex flex-col justify-between">
              <span className="text-[11px] text-neutral-400 font-medium block">
                Karakteristik Model
              </span>
              <span className="text-xs text-neutral-700 block line-clamp-2">
                {isLora
                  ? 'Mengadaptasi partikel santai & slang lisan'
                  : 'Cenderung menormalisasi ke ejaan formal'}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
