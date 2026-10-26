import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { getSpontaneousInfo } from '../../utils/spontaneousLexicon';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

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
      <Card className="rounded-3xl p-6 text-center text-neutral-400 text-xs font-mono">
        Tidak ada partikel ujaran spontan teridentifikasi pada sampel audio ini.
      </Card>
    );
  }

  const baseLower = baseText.toLowerCase();

  return (
    <Card className="rounded-3xl border-neutral-200/90 shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-100 p-5 sm:p-6 pb-4 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base text-neutral-900">
            Kosakata & Partikel Ujaran Spontan Terdeteksi
          </CardTitle>
          <CardDescription className="text-xs text-neutral-400">
            Daftar partikel non-formal yang dikenali oleh model LoRA
          </CardDescription>
        </div>

        <Badge variant="secondary" className="font-mono text-xs bg-neutral-100 text-neutral-700">
          {detectedTokens.length} Kata
        </Badge>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {detectedTokens.map((token, idx) => {
            const info = getSpontaneousInfo(token);
            const isBaseMissed = !baseLower.includes(token.toLowerCase());

            return (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-neutral-200/70 bg-neutral-50/60 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-neutral-900 font-mono">
                    "{token}"
                  </span>
                  {info && (
                    <Badge variant="outline" className="text-[10px] font-normal bg-white text-neutral-600 border-neutral-200">
                      {info.category}
                    </Badge>
                  )}
                </div>

                {info && (
                  <div className="text-xs text-neutral-500 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="text-neutral-400">Baku:</span>
                      <span className="font-medium text-neutral-800 font-mono">
                        {info.formalEquivalent || '—'}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 leading-snug">
                      {language === 'id' ? info.descriptionId : info.descriptionEn}
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400">Base Model:</span>
                  <span
                    className={`font-mono font-medium ${
                      isBaseMissed ? 'text-red-600' : 'text-emerald-700'
                    }`}
                  >
                    {isBaseMissed ? 'Diformalkan / Hilang' : 'Tertangkap'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
