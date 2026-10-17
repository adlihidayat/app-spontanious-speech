import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { AppMode, DiffWord, ModelResult } from '../../types';
import { getSpontaneousInfo } from '../../utils/spontaneousLexicon';
import { CheckCircle2, Clock, Zap, ArrowDown, Award, Copy, Check } from 'lucide-react';

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
  const { t, language } = useLanguage();
  const [copied, setCopied] = React.useState(false);

  const isLora = modelType === 'lora';

  const handleCopy = () => {
    if (!result?.text) return;
    navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-2xl transition-all flex flex-col h-full bg-white overflow-hidden shadow-xs border-2 ${
        isLora
          ? 'border-indigo-600 shadow-indigo-100/50 shadow-md ring-4 ring-indigo-50'
          : 'border-slate-200'
      }`}
    >
      {/* Card Header */}
      <div
        className={`px-5 py-4 border-b flex items-start justify-between gap-3 ${
          isLora
            ? 'bg-gradient-to-r from-indigo-50/90 via-indigo-50/40 to-emerald-50/30 border-indigo-100'
            : 'bg-slate-50 border-slate-200/80'
        }`}
      >
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                isLora
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {isLora ? 'Usulan Tesis' : 'Baseline'}
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              {tag}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            {title}
            {isLora && <Award className="w-4 h-4 text-amber-500 fill-amber-500" />}
          </h2>
        </div>

        {result && (
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors border border-transparent hover:border-slate-200"
            title="Salin transkrip"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Transcript Body Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Transkripsi Teks</span>
            {result && (
              <span className="font-mono text-slate-500 lowercase font-normal">
                {result.text.split(/\s+/).length} kata
              </span>
            )}
          </div>

          <div
            className={`min-h-[140px] p-4 rounded-xl border text-sm sm:text-base leading-relaxed tracking-tight transition-all font-sans ${
              result
                ? 'bg-white border-slate-200/90 text-slate-900'
                : 'bg-slate-50/60 border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-center italic text-xs'
            }`}
          >
            {result ? (
              <div className="flex flex-wrap items-center gap-1.5 leading-loose">
                {diffWords.length > 0
                  ? diffWords.map((item, idx) => {
                      const spontInfo = isLora && item.isSpontaneous ? getSpontaneousInfo(item.word) : null;

                      // Highlighting logic
                      // Benchmark mode:
                      if (mode === 'benchmark') {
                        if (!isLora && (item.type === 'substitution' || item.type === 'insertion')) {
                          return (
                            <span
                              key={idx}
                              title={item.expected ? `Substitusi dari kata acuan: "${item.expected}"` : 'Kata tambahan'}
                              className="px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200 font-semibold cursor-help inline-flex items-center gap-1"
                            >
                              <span>{item.word}</span>
                              {item.expected && (
                                <span className="text-[10px] text-rose-600 font-mono line-through opacity-70">
                                  ({item.expected})
                                </span>
                              )}
                            </span>
                          );
                        }

                        if (isLora && item.type === 'hit') {
                          return (
                            <span
                              key={idx}
                              className={`px-1.5 py-0.5 rounded-md ${
                                item.isSpontaneous
                                  ? 'bg-emerald-100/90 text-emerald-900 border border-emerald-300 font-bold'
                                  : 'text-slate-900'
                              }`}
                              title={spontInfo ? (language === 'id' ? spontInfo.descriptionId : spontInfo.descriptionEn) : 'Kata cocok dengan referensi'}
                            >
                              {item.word}
                            </span>
                          );
                        }

                        if (isLora && item.type === 'substitution') {
                          return (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200"
                            >
                              {item.word}
                            </span>
                          );
                        }

                        return <span key={idx}>{item.word}</span>;
                      }

                      // Free-Form mode:
                      if (mode === 'freeform') {
                        if (isLora && item.isSpontaneous) {
                          return (
                            <span
                              key={idx}
                              title={spontInfo ? `${language === 'id' ? spontInfo.descriptionId : spontInfo.descriptionEn} (Baku: ${spontInfo.formalEquivalent})` : 'Partikel Ujaran Spontan'}
                              className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-bold inline-flex items-center gap-1 cursor-help shadow-2xs"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                              {item.word}
                            </span>
                          );
                        }

                        if (item.type === 'substitution') {
                          return (
                            <span
                              key={idx}
                              title={item.expected ? `Berbeda dengan model lain: "${item.expected}"` : 'Kata berbeda'}
                              className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200"
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
              <span>{t('waiting_transcription')}</span>
            )}
          </div>
        </div>

        {/* Footer Stats Grid */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Metric: WER (Benchmark mode only) */}
          {mode === 'benchmark' && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">
                {t('metric_wer')}
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="font-mono text-base font-extrabold text-slate-900">
                  {result ? `${result.metrics.wer}%` : '—'}
                </span>
                {isLora && result && typeof werDelta === 'number' && werDelta > 0 && (
                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-1 rounded-sm">
                    <ArrowDown className="w-2.5 h-2.5" />
                    {werDelta}%
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Metric: CER (Benchmark mode only) */}
          {mode === 'benchmark' && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">
                {t('metric_cer')}
              </span>
              <span className="font-mono text-base font-extrabold text-slate-900 mt-0.5 block">
                {result ? `${result.metrics.cer}%` : '—'}
              </span>
            </div>
          )}

          {/* Metric: Confidence Score */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              {t('metric_confidence')}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-mono text-base font-extrabold text-slate-900">
                {result ? `${result.confidence}%` : '—'}
              </span>
              {result && (
                <div className="w-8 h-1.5 bg-slate-200 rounded-full overflow-hidden hidden sm:block">
                  <div
                    className={`h-full rounded-full ${
                      result.confidence > 90 ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Metric: Latency */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {t('metric_latency')}
            </span>
            <span className="font-mono text-base font-extrabold text-slate-900 mt-0.5 block">
              {result ? `${result.latency_sec}s` : '—'}
            </span>
          </div>

          {/* Fallback extra stats if Free-form mode */}
          {mode === 'freeform' && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 col-span-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-indigo-500" />
                Karakteristik Model
              </span>
              <span className="text-xs text-slate-700 font-medium mt-0.5 block">
                {isLora
                  ? 'Mengadaptasi partikel santai & slang lisan'
                  : 'Cenderung menormalisasi ke ejaan formal'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
