import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "../../lib/utils";

export type MetricBadgeVariant = "neutral" | "success" | "warning" | "info";

export interface MetricBadgeProps {
  variant?: MetricBadgeVariant;
  arrow?: "down" | "up";
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<MetricBadgeVariant, string> = {
  neutral: "bg-neutral-200/50 text-neutral-600 border-neutral-200/80",
  success:
    "bg-green-100 text-green-700 border-green-200/80 shadow-2xs font-semibold",
  warning: "bg-red-100 text-red-700 border-red-200/80 shadow-2xs font-semibold",
  info: "bg-blue-100 text-blue-700 border-blue-200/80 shadow-2xs font-semibold",
};

export const MetricBadge: React.FC<MetricBadgeProps> = ({
  variant = "neutral",
  arrow,
  icon,
  children,
  className,
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center text-[11px] font-mono font-medium px-2 py-0.5 rounded-md border",
        (arrow || icon) && "gap-1",
        variantStyles[variant],
        className,
      )}
    >
      {arrow === "down" && <ArrowDown className="w-3 h-3 flex-shrink-0" />}
      {arrow === "up" && <ArrowUp className="w-3 h-3 flex-shrink-0" />}
      {icon && !arrow && icon}
      {children}
    </span>
  );
};
