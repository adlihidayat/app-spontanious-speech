import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { getSpontaneousInfo } from '../../utils/spontaneousLexicon';
import { Sparkles, MessageSquare } from 'lucide-react';

interface SpontaneousParticlesCardProps {
  detectedTokens: string[];
  baseText?: string;
}

export const SpontaneousParticlesCard: React.FC<SpontaneousParticlesCardProps> = ({
  detectedTokens,
  baseText = '',
}) => {
  const { language } = useLanguage();

  if (detectedTokens.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-slate-400 text-xs">
        Tidak ada partikel ujaran spontan teridentifikasi pada sampel audio ini.
      </div>
    );
  }

  const baseLower = baseText.toLowerCase();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              Kosakata & Partikel Ujaran Spontan Terdeteksi
            </h3>
            <p className="text-xs text-slate-500">
              Daftar istilah non-formal yang berhasil dikenali oleh model LoRA
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold font-mono">
          {detectedTokens.length} Partikel
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
        {detectedTokens.map((token, idx) => {
          const info = getSpontaneousInfo(token);
          const isBaseMissed = !baseLower.includes(token.toLowerCase());

          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/30 hover:bg-indigo-50/60 transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-indigo-950 font-mono">
                  "{token}"
                </span>
                {info && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-indigo-700">
                    {info.category}
                  </span>
                )}
              </div>

              {info && (
                <div className="text-xs text-slate-600 space-y-0.5">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <span>Bentuk Baku:</span>
                    <span className="font-semibold text-slate-700">
                      {info.formalEquivalent || '—'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {language === 'id' ? info.descriptionId : info.descriptionEn}
                  </p>
                </div>
              )}

              {/* Status on Base model */}
              <div className="pt-1 border-t border-indigo-100/60 flex items-center gap-1.5 text-[11px]">
                <MessageSquare className="w-3 h-3 text-slate-400" />
                <span className="text-slate-500">Base Model:</span>
                <span
                  className={`font-medium ${
                    isBaseMissed ? 'text-rose-600 font-semibold' : 'text-slate-700'
                  }`}
                >
                  {isBaseMissed ? 'Diformalkan / Hilang' : 'Tertangkap'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
