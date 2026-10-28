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
        <span className="text-xs sm:text-xs font-medium">{label}</span>
        {badge}
        {infoAction && (
          <button
            type="button"
            onClick={infoAction.onClick}
            title={infoAction.title}
            aria-label={infoAction.title || "Detail"}
            className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-neutral-200 hover:text-neutral-800 text-neutral-500 border border-neutral-500 cursor-pointer transition-colors text-[10px] font-bold shadow-2xs ml-0.5"
          >
            !
          </button>
        )}
      </div>
      <div className="font-mono text-xs font-medium flex-shrink-0 ml-3">
        {score}
      </div>
    </div>
  );
};
