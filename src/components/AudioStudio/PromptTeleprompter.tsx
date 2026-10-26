import React from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import { PromptItem } from "../../types";
import { BENCHMARK_PROMPTS } from "../../services/simulation";
import { Button } from "../ui/button";
import { Shuffle } from "lucide-react";

interface PromptTeleprompterProps {
  currentPrompt: PromptItem;
  groundTruth: string;
  onSelectPrompt: (prompt: PromptItem) => void;
  onChangeGroundTruth?: (newText: string) => void;
}

export const PromptTeleprompter: React.FC<PromptTeleprompterProps> = ({
  currentPrompt,
  groundTruth,
  onSelectPrompt,
  onChangeGroundTruth,
}) => {
  const { t, language } = useLanguage();

  const handleRandomize = () => {
    const available = BENCHMARK_PROMPTS.filter(
      (p) => p.id !== currentPrompt.id,
    );
    const random = available[Math.floor(Math.random() * available.length)];
    onSelectPrompt(random);
    if (onChangeGroundTruth) {
      onChangeGroundTruth(random.text);
    }
  };

  const getCategoryText = (id: number, fallback: string) => {
    if (language === "en") {
      const enCategories: Record<number, string> = {
        1: "Contractions & Spontaneous Particles (tuh, udah, nggak, eh, dong)",
        2: "Interjections & Question Particles (eh, deh, kayaknya, tuh, nggak, sih, kok, gini, ya)",
        3: "Casual Pronouns & Slang (gini, loh, gue, emang, beres, ya udah)",
        4: "Emphatic Particles & Slang (sih, nggak, aja, tuh, beneran, gitu)",
        5: "Contractions & Limiting Slang (gimana, tuh, banget, gue, doang)",
      };
      return enCategories[id] || fallback;
    }
    return fallback;
  };

  return (
    <div className="space-y-4">
      {/* Top Header: H1 Title, H2 Subtitle, and Acak Kalimat button flexed beside it (Outside the bubble) */}
      <div className="flex items-center justify-between flex-wrap">
        <div>
          <h1 className="text-base font-medium tracking-tight text-neutral-900 leading-tight">
            {t("mode_eval_title")}
          </h1>
          <span className="text-sm text-neutral-600 font-medium shadow-2xs">
            {t("mode_eval_subtitle")}
          </span>
        </div>
      </div>

      {/* Inside Bubble with grey background: Prompt, Case Name, and Text Guide */}
      <div className="rounded-2xl bg-neutral-50/60 border border-neutral-200/80">
        {/* Header row inside bubble: Prompt index and Case name */}
        <div className="flex items-center justify-between p-4 sm:p-5 py-1 sm:py-2 border-b border-neutral-200/80">
          <span className="font-mono text-sm text-neutral-600 font-medium shadow-2xs">
            {t("case_label")} {currentPrompt.id} : {getCategoryText(currentPrompt.id, currentPrompt.category)}
          </span>
          <Button
            size="sm"
            onClick={handleRandomize}
            title={t("prompt_randomize")}
            aria-label={t("prompt_randomize")}
            className="p-2 text-xs text-neutral-700 bg-neutral-50/60 hover:text-neutral-900 rounded-lg hover:bg-neutral-200/50 shadow-2xs cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5 text-neutral-500" />
          </Button>
        </div>

        {/* Prompt detail transcript */}
        <div className="py-1 p-4 sm:p-5">
          <p className="text-base tracking-tight text-neutral-900 leading-relaxed">
            "{groundTruth}"
          </p>
        </div>
      </div>
    </div>
  );
};
