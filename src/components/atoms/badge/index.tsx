import { cn } from '@/shared/utils/index';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border px-4 py-0.5 text-xs font-normal w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent text-primary-500 bg-primary-lighter/50 [a&]:hover:text-primary-600',
        warning:
          'border-transparent bg-amber-500 text-white [a&]:hover:bg-amber-600 focus-visible:ring-amber-200/30 focus-visible:ring-4',
        secondary: 'border-transparent bg-secondary-700 text-white [a&]:hover:bg-secondary-800',
        destructive:
          'border-transparent bg-danger-500 text-white [a&]:hover:bg-danger-600 focus-visible:ring-danger-200/20',
        outline:
          'border border-gray-500 text-gray-800 [a&]:hover:bg-gray-100 [a&]:hover:text-dark-950',
        dark: 'border-transparent bg-dark-950 text-white [a&]:hover:bg-dark-800',
        outlinePrimary:
          'border border-primary-500 text-primary-500 [a&]:hover:bg-primary-100 [a&]:hover:text-dark-950',
        ocean: 'border-transparent bg-ocean-500 text-white [a&]:hover:bg-ocean-600',
        outlineOcean:
          'border border-ocean-500 text-ocean-500 [a&]:hover:bg-ocean-100 [a&]:hover:text-dark-950',
        info: 'border-transparent bg-info-500 text-white [a&]:hover:bg-info-600',
        outlineInfo:
          'border border-info-500 text-info-500 [a&]:hover:bg-info-100 [a&]:hover:text-dark-950',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
