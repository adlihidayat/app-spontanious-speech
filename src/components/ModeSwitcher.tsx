import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { AppMode } from '../types';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

interface ModeSwitcherProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
}

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ currentMode, onSelectMode }) => {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-xl mx-auto">
      <Tabs
        value={currentMode}
        onValueChange={(val: string) => onSelectMode(val as AppMode)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 h-auto p-1.5 rounded-2xl bg-neutral-100/90 border border-neutral-200/80 gap-1.5">
          <TabsTrigger
            value="benchmark"
            onClick={() => onSelectMode('benchmark')}
            className="py-2.5 px-4 text-xs sm:text-sm font-medium rounded-xl transition-all data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm"
          >
            {t('mode_benchmark')}
          </TabsTrigger>
          <TabsTrigger
            value="freeform"
            onClick={() => onSelectMode('freeform')}
            className="py-2.5 px-4 text-xs sm:text-sm font-medium rounded-xl transition-all data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm"
          >
            {t('mode_freeform')}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
