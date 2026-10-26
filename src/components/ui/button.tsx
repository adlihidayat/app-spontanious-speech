import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl shadow-sm',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 rounded-xl shadow-sm',
        outline:
          'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 rounded-xl shadow-sm',
        secondary:
          'bg-neutral-100 text-neutral-800 hover:bg-neutral-200/80 rounded-xl',
        ghost:
          'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70 rounded-xl',
        link: 'text-primary underline-offset-4 hover:underline',
        blue: 'bg-[#0070f3] text-white hover:bg-[#0060df] rounded-xl shadow-sm',
      },
      size: {
        default: 'h-9 px-4 py-2 text-sm rounded-xl',
        sm: 'h-8 px-3 text-xs rounded-lg',
        lg: 'h-10 px-6 text-sm rounded-xl font-medium',
        icon: 'h-8 w-8 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
