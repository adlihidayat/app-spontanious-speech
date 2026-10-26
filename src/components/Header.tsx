import React from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { ApiConfig } from "../types";
import { Button } from "./ui/button";
import { Github, BookOpen, Sparkles } from "lucide-react";

interface HeaderProps {
  apiConfig?: ApiConfig;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Branding & Subtitle */}
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-black" />
          <h1 className="text-sm sm:text-base font-semibold tracking-tight text-neutral-900 leading-none">
            {t("app_title")}
          </h1>
        </div>

        {/* Right: Actions & Links */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Notebook Link */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 gap-1.5 text-xs text-neutral-600 rounded-lg shadow-sm bg-orange-500/95 hover:bg-orange-500/75 text-white"
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

          {/* GitHub Link */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 gap-1.5 text-xs text-neutral-600 rounded-lg shadow-sm bg-black/90 hover:bg-black/70 text-white"
          >
            <a
              href="https://github.com/adlihidayat/app-spontanious-speech"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Repository</span>
            </a>
          </Button>

          {/* Language Switcher */}
          <div className="flex items-center h-8 rounded-lg border border-neutral-200 bg-neutral-100/50 p-0.5 shadow-sm">
            <button
              type="button"
              onClick={() => setLanguage("id")}
              className={`h-full w-12 inline-flex items-center justify-center text-xs rounded-md font-medium transition-colors cursor-pointer ${
                language === "id"
                  ? "bg-white text-neutral-900 shadow-xs border border-neutral-200"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200"
              }`}
            >
              🇮🇩 ID
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`h-full w-12 inline-flex items-center justify-center text-xs rounded-md font-medium transition-colors cursor-pointer ${
                language === "en"
                  ? "bg-white text-neutral-900 shadow-xs border border-neutral-200"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200"
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
