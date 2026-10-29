import React from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { AppMode } from "../types";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

interface ModeSwitcherProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
}

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({
  currentMode,
  onSelectMode,
}) => {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-xl mx-auto">
      <Tabs
        value={currentMode}
        onValueChange={(val: string) => onSelectMode(val as AppMode)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 h-auto p-1 rounded-full bg-neutral-100/50 gap-1 border">
          <TabsTrigger
            value="benchmark"
            onClick={() => onSelectMode("benchmark")}
            className="py-2.5 px-4 text-xs sm:text-sm rounded-full transition-all data-[state=active]:bg-white data-[state=active]:text-neutral-900  data-[state=active]:shadow-sm hover:bg-neutral-200/50"
          >
            {t("mode_benchmark")}
          </TabsTrigger>
          <TabsTrigger
            value="freeform"
            onClick={() => onSelectMode("freeform")}
            className="py-2.5 px-4 text-xs sm:text-sm rounded-full transition-all data-[state=active]:bg-white data-[state=active]:text-neutral-900  data-[state=active]:shadow-sm hover:bg-neutral-200/50"
          >
            {t("mode_freeform")}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
