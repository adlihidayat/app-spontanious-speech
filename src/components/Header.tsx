import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { ApiConfig } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Github, BookOpen, Settings2, Sparkles } from 'lucide-react';

interface HeaderProps {
  apiConfig: ApiConfig;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ apiConfig, onOpenSettings }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Branding & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-semibold tracking-tight text-neutral-900 leading-none">
                {t('app_title')}
              </h1>
              <Badge variant="secondary" className="hidden lg:inline-flex text-[11px] font-normal text-neutral-600 bg-neutral-100">
                {t('thesis_badge')}
              </Badge>
            </div>
            <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
              {t('app_subtitle')}
            </p>
          </div>
        </div>

        {/* Right: Actions & Links */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* GitHub Link */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 rounded-lg"
          >
            <a
              href="https://github.com/adlihidayat/app-spontanious-speech"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </Button>

          {/* Notebook Link */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 rounded-lg"
          >
            <a
              href="https://github.com/adlihidayat/app-spontanious-speech#notebooks"
              target="_blank"
              rel="noreferrer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Notebook</span>
            </a>
          </Button>

          {/* Backend Connection Status / Settings */}
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenSettings}
            title="Pengaturan Koneksi Backend & Model"
            className="h-8 gap-1.5 text-xs font-mono text-neutral-700 rounded-lg"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                apiConfig.isDemoMode
                  ? 'bg-amber-500'
                  : apiConfig.isConnected
                  ? 'bg-emerald-500'
                  : 'bg-rose-500'
              }`}
            />
            <Settings2 className="w-3.5 h-3.5 text-neutral-500" />
            <span className="hidden md:inline">
              {apiConfig.isDemoMode ? 'Demo Mode' : 'Live API'}
            </span>
          </Button>

          {/* Language Switcher */}
          <div className="flex items-center rounded-lg border border-neutral-200/80 p-0.5 bg-neutral-100/80">
            <button
              type="button"
              onClick={() => setLanguage('id')}
              className={`px-2 py-0.5 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                language === 'id'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              🇮🇩 ID
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                language === 'en'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              🇬🇧 EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
