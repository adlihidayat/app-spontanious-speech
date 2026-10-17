import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Settings, Sparkles, Activity, ShieldCheck } from 'lucide-react';
import { ApiConfig } from '../types';

interface HeaderProps {
  apiConfig: ApiConfig;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ apiConfig, onOpenSettings }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Branding */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-indigo-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                <ShieldCheck className="w-3 h-3 text-indigo-600" />
                {t('thesis_badge')}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
              {t('app_title')}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {t('app_subtitle')}
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
          {/* Backend Status Indicator */}
          <button
            onClick={onOpenSettings}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              apiConfig.isDemoMode
                ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                : apiConfig.isConnected
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
            }`}
            title="Klik untuk konfigurasi backend API"
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  apiConfig.isDemoMode
                    ? 'bg-amber-400'
                    : apiConfig.isConnected
                    ? 'bg-emerald-400'
                    : 'bg-rose-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  apiConfig.isDemoMode
                    ? 'bg-amber-500'
                    : apiConfig.isConnected
                    ? 'bg-emerald-500'
                    : 'bg-rose-500'
                }`}
              />
            </span>
            <Activity className="w-3.5 h-3.5" />
            <span className="font-medium">
              {apiConfig.isDemoMode ? t('api_status_demo') : t('api_status_connected')}
            </span>
          </button>

          {/* Bilingual Language Switcher */}
          <div className="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setLanguage('id')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                language === 'id'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🇮🇩 ID
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                language === 'en'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🇬🇧 EN
            </button>
          </div>

          {/* Settings Modal Trigger */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200/80 transition-colors"
            title={t('api_settings_title')}
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
