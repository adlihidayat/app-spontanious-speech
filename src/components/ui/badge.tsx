import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-neutral-900 text-white shadow-sm hover:bg-neutral-800',
        secondary:
          'border-neutral-200/80 bg-neutral-100 text-neutral-700 hover:bg-neutral-200/60',
        destructive:
          'border-red-200 bg-red-50 text-red-600 hover:bg-red-100',
        outline:
          'border-neutral-200 text-neutral-600 bg-white',
        emerald:
          'border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold',
        blue:
          'border-blue-200 bg-blue-50 text-blue-600 font-semibold',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
