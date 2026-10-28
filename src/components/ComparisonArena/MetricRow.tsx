import React from "react";

export interface MetricRowProps {
  icon: React.ReactNode;
  label: string;
  score: string;
  badge?: React.ReactNode;
  infoAction?: {
    onClick: () => void;
    title?: string;
  };
}

export const MetricRow: React.FC<MetricRowProps> = ({
  icon,
  label,
  score,
  badge,
  infoAction,
}) => {
  return (
    <div className="flex items-center justify-between py-2 px-1 rounded-xl transition-colors text-neutral-500">
      <div className="flex items-center gap-2 min-w-0 flex-wrap sm:flex-nowrap">
        <div className=" rounded-lg  flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <span className="text-xs sm:text-sm font-medium">{label}</span>
        {badge}
        {infoAction && (
          <button
            type="button"
            onClick={infoAction.onClick}
            title={infoAction.title}
            aria-label={infoAction.title || "Detail"}
            className="inline-flex items-center justify-center w-5 h-5 rounded-md border border-neutral-200/90 bg-white hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 cursor-pointer transition-colors text-[11px] font-bold shadow-2xs ml-0.5"
          >
            !
          </button>
        )}
      </div>
      <div className="font-mono text-sm font-medium flex-shrink-0 ml-3">
        {score}
      </div>
    </div>
  );
};
