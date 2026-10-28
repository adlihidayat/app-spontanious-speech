import React from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import { ModelResult } from "../../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";
import { Calculator } from "lucide-react";

interface WerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseResult: ModelResult | null;
  loraResult: ModelResult | null;
  werReductionAbs?: number;
}

export const WerDetailModal: React.FC<WerDetailModalProps> = ({
  isOpen,
  onClose,
  baseResult,
  loraResult,
  werReductionAbs: _werReductionAbs,
}) => {
  const { t } = useLanguage();

  const baseMetrics = baseResult?.metrics || {
    substitutions: 0,
    deletions: 0,
    insertions: 0,
    hits: 0,
    wer: 0,
    cer: 0,
  };

  const loraMetrics = loraResult?.metrics || {
    substitutions: 0,
    deletions: 0,
    insertions: 0,
    hits: 0,
    wer: 0,
    cer: 0,
  };

  const baseTotalWords =
    baseMetrics.hits + baseMetrics.substitutions + baseMetrics.deletions;
  const loraTotalWords =
    loraMetrics.hits + loraMetrics.substitutions + loraMetrics.deletions;

  const rows = [
    {
      label: t("stat_substitutions"),
      code: "S",
      desc: "Kata salah ditranskripsi / diganti kata lain",
      base: baseMetrics.substitutions,
      lora: loraMetrics.substitutions,
      delta: baseMetrics.substitutions - loraMetrics.substitutions,
    },
    {
      label: t("stat_deletions"),
      code: "D",
      desc: "Kata hilang / tidak tertangkap",
      base: baseMetrics.deletions,
      lora: loraMetrics.deletions,
      delta: baseMetrics.deletions - loraMetrics.deletions,
    },
    {
      label: t("stat_insertions"),
      code: "I",
      desc: "Kata tambahan yang tidak diucapkan",
      base: baseMetrics.insertions,
      lora: loraMetrics.insertions,
      delta: baseMetrics.insertions - loraMetrics.insertions,
    },
    {
      label: t("stat_hits"),
      code: "H",
      desc: "Kata tepat sesuai teks referensi",
      base: baseMetrics.hits,
      lora: loraMetrics.hits,
      delta: loraMetrics.hits - baseMetrics.hits,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-xl bg-neutral-100 border border-neutral-200/80 flex items-center justify-center text-neutral-800">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-medium text-neutral-900">
                {t("error_breakdown_title")}
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-500">
                Rincian kalkulasi Word Error Rate
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Breakdown Table */}
        <div className="rounded-2xl border border-neutral-200/80 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50/80">
                <TableHead className="text-xs font-semibold text-neutral-700 py-2">
                  {t("col_metric")}
                </TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700 text-center py-2">
                  Base
                </TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700 text-center py-2">
                  LoRA
                </TableHead>
                <TableHead className="text-xs font-semibold text-neutral-700 text-right py-2">
                  {t("col_delta")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={idx} className="hover:bg-neutral-50/50">
                  <TableCell className="py-2.5">
                    <span className="font-medium text-xs text-neutral-800 block">
                      {row.label}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">
                      Simbol: {row.code}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-center text-neutral-600 py-2.5">
                    {row.base}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-center font-semibold text-neutral-900 py-2.5">
                    {row.lora}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-right py-2.5">
                    {row.delta !== 0 ? (
                      <span
                        className={
                          row.delta > 0
                            ? "text-emerald-700 font-semibold"
                            : "text-red-600 font-semibold"
                        }
                      >
                        {row.delta > 0 ? `+${row.delta}` : row.delta}
                      </span>
                    ) : (
                      <span className="text-neutral-400">0</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {/* Total words row */}
              <TableRow className="bg-neutral-50/60 font-medium">
                <TableCell className="py-2.5 text-xs text-neutral-700 font-semibold">
                  {t("stat_total_words")} (N)
                </TableCell>
                <TableCell className="font-mono text-xs text-center text-neutral-600 py-2.5">
                  {baseTotalWords}
                </TableCell>
                <TableCell className="font-mono text-xs text-center font-semibold text-neutral-900 py-2.5">
                  {loraTotalWords}
                </TableCell>
                <TableCell className="font-mono text-xs text-right py-2.5 text-neutral-400">
                  —
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* WER Final Comparison Footer Box */}
        <div className="flex flex-row items-center justify-between p-3.5 rounded-2xl bg-neutral-900 text-white shadow-2xs">
          <span className="text-xs text-neutral-200 block">
            Skor Akhir WER <br />
            (Baseline vs. LoRA):
          </span>
          <div className="flex bg-gray-10 gap-x-2">
            <span className="font-mono text-lg font-semibold line-through text-neutral-500">
              {baseMetrics.wer}%
            </span>
            <span className="font-mono text-lg font-bold text-emerald-400">
              {loraMetrics.wer}%
            </span>
            <div className="flex items-baseline gap-2"></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
