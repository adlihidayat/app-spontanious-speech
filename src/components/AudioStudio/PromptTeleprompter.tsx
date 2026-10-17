import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { PromptItem } from '../../types';
import { BENCHMARK_PROMPTS } from '../../services/simulation';
import { Shuffle, Edit3, Check, RotateCcw, Quote, Tag } from 'lucide-react';

interface PromptTeleprompterProps {
  currentPrompt: PromptItem;
  groundTruth: string;
  onSelectPrompt: (prompt: PromptItem) => void;
  onChangeGroundTruth: (newText: string) => void;
}

export const PromptTeleprompter: React.FC<PromptTeleprompterProps> = ({
  currentPrompt,
  groundTruth,
  onSelectPrompt,
  onChangeGroundTruth,
}) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(groundTruth);

  const handleRandomize = () => {
    const available = BENCHMARK_PROMPTS.filter((p) => p.id !== currentPrompt.id);
    const random = available[Math.floor(Math.random() * available.length)];
    onSelectPrompt(random);
    setEditedText(random.text);
    setIsEditing(false);
  };

  const handleCycle = () => {
    const nextIdx = (BENCHMARK_PROMPTS.findIndex((p) => p.id === currentPrompt.id) + 1) % BENCHMARK_PROMPTS.length;
    const nextPrompt = BENCHMARK_PROMPTS[nextIdx];
    onSelectPrompt(nextPrompt);
    setEditedText(nextPrompt.text);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    onChangeGroundTruth(editedText);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedText(groundTruth);
    setIsEditing(false);
  };

  const handleResetToPreset = () => {
    setEditedText(currentPrompt.text);
    onChangeGroundTruth(currentPrompt.text);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-indigo-100/80 shadow-xs overflow-hidden mb-5">
      {/* Top Bar */}
      <div className="px-5 py-3 bg-gradient-to-r from-indigo-50/70 via-indigo-50/30 to-white border-b border-indigo-100/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Quote className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
            {t('prompt_label')}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-100/70 text-indigo-800">
            Prompt #{currentPrompt.id} / 5
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRandomize}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 shadow-2xs transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>{t('prompt_randomize')}</span>
          </button>

          <button
            type="button"
            onClick={handleCycle}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <span>{t('prompt_next')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsEditing(!isEditing);
              setEditedText(groundTruth);
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
              isEditing
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{t('prompt_edit_toggle')}</span>
          </button>
        </div>
      </div>

      {/* Script Prompter Area */}
      <div className="p-5">
        {!isEditing ? (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed tracking-tight selection:bg-indigo-100">
                "{groundTruth}"
              </p>
            </div>

            {/* Prompt Spontaneous Category Tag */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Tag className="w-3.5 h-3.5 text-indigo-500" />
              <span className="font-medium text-slate-600">Target Evaluasi:</span>
              <span className="text-slate-500 font-mono text-[11px]">
                {currentPrompt.category}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              rows={3}
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              placeholder={t('prompt_edit_placeholder')}
              className="w-full p-3.5 rounded-xl border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 text-sm leading-relaxed"
            />
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleResetToPreset}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset ke Kalimat Asli</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  {t('cancel_btn')}
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-2xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
