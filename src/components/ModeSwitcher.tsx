import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { AppMode } from '../types';
import { Target, Mic } from 'lucide-react';

interface ModeSwitcherProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
}

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ currentMode, onSelectMode }) => {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-white rounded-2xl p-2 border border-slate-200/80 shadow-xs mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Mode A: Benchmark Mode */}
        <button
          type="button"
          onClick={() => onSelectMode('benchmark')}
          className={`flex items-start gap-3.5 p-3.5 rounded-xl text-left transition-all relative ${
            currentMode === 'benchmark'
              ? 'bg-indigo-50/70 border-2 border-indigo-600 shadow-xs text-slate-900'
              : 'border border-transparent hover:bg-slate-50 text-slate-600'
          }`}
        >
          <div
            className={`p-2.5 rounded-lg flex-shrink-0 transition-colors ${
              currentMode === 'benchmark'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            <Target className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-slate-900">
                {t('mode_benchmark')}
              </span>
              {currentMode === 'benchmark' && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-600 text-white uppercase tracking-wider">
                  Default
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
              {t('mode_benchmark_desc')}
            </p>
          </div>
        </button>

        {/* Mode B: Free-Form Sandbox */}
        <button
          type="button"
          onClick={() => onSelectMode('freeform')}
          className={`flex items-start gap-3.5 p-3.5 rounded-xl text-left transition-all relative ${
            currentMode === 'freeform'
              ? 'bg-indigo-50/70 border-2 border-indigo-600 shadow-xs text-slate-900'
              : 'border border-transparent hover:bg-slate-50 text-slate-600'
          }`}
        >
          <div
            className={`p-2.5 rounded-lg flex-shrink-0 transition-colors ${
              currentMode === 'freeform'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            <Mic className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-slate-900">
                {t('mode_freeform')}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
              {t('mode_freeform_desc')}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
