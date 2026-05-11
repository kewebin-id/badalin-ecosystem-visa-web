import { cn } from '@/shared/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { HTMLAttributeAnchorTarget } from 'react';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        primary:
          'bg-primary-default border-primary-default border text-white hover:bg-primary-600 focus-visible:ring-primary-default/50',
        primaryOutline:
          'bg-transparent border border-transparent border border border-primary-default text-primary-default  hover:bg-primary-100 focus-visible:ring-primary-default/50',
        ocean:
          'bg-ocean-default border-ocean-default border text-white  hover:bg-ocean-600 focus-visible:ring-ocean-default/50',
        oceanOutline:
          'bg-transparent border border-transparent border border border-ocean-default text-ocean-default  hover:bg-ocean-100 focus-visible:ring-ocean-default/50',
        danger:
          'bg-danger-default border-danger-default border text-white  hover:bg-danger-600 focus-visible:ring-danger-default/50',
        dangerOutline:
          'bg-transparent border border-transparent border border border-danger-default text-danger-default  hover:bg-danger-100 focus-visible:ring-danger-default/50',
        secondary:
          'bg-gray-700 border-gray-700 border text-black/45  hover:bg-gray-600 focus-visible:ring-gray-default/50',
        secondaryOutline:
          'bg-transparent border border-transparent border border border-gray-300 text-black/45  hover:bg-gray-100 focus-visible:ring-gray-default/50',
        transparent:
          'bg-transparent border-transparent border-none text-black/45 hover:bg-gray-100 focus-visible:ring-gray-default/50',
        success:
          'bg-emerald-600 border-emerald-600 border text-white hover:bg-emerald-700 focus-visible:ring-emerald-600/50 shadow-lg shadow-emerald-600/10',
        dark: 'bg-dark-950 border-dark-950 border text-white hover:bg-primary-default hover:border-primary-default focus-visible:ring-dark-950/50 shadow-lg shadow-dark-950/10',
      },
      size: {
        sm: 'h-9 rounded-lg text-xs px-3 has-[>svg]:px-2.5',
        md: 'h-10 rounded-lg text-sm px-4 has-[>svg]:px-3',
        lg: 'h-11 rounded-lg text-base px-6 has-[>svg]:px-4',
        xl: 'h-12 rounded-2xl text-lg px-7 has-[>svg]:px-5',
        '2xl': 'h-13 rounded-2xl text-xl px-8 has-[>svg]:px-6',
        '3xl': 'h-14 rounded-3xl text-2xl px-10 has-[>svg]:px-8',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

const Button = ({
  className,
  variant,
  size,
  asChild = false,
  isSubmitting,
  href,
  disabled,
  target,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    href?: string;
    isSubmitting?: boolean;
    target?: HTMLAttributeAnchorTarget;
  }) => {
  const buttonClassName = cn('w-full', buttonVariants({ variant, size, className }));
  const buttonDisabled = isSubmitting || disabled;

  const buttonContent = (
    <>
      {isSubmitting && (
        <Loader2Icon
          className={cn(
            'animate-spin',
            size === '2xl'
              ? 'size-7'
              : size === 'xl'
                ? 'size-6'
                : size === 'lg'
                  ? 'size-5'
                  : 'size-4',
          )}
        />
      )}
      {props.children}
    </>
  );

  if (asChild) {
    return (
      <div className="w-full">
        <Slot
          {...({
            'data-slot': 'button',
            className: buttonClassName,
            ...props,
            disabled: !!buttonDisabled,
          } as React.HTMLAttributes<HTMLElement> & { disabled?: boolean })}
        >
          {props.children}
        </Slot>
      </div>
    );
  }

  return (
    <div className="w-full">
      {href ? (
        <Link href={{ pathname: href }} target={target} className={buttonClassName}>
          {buttonContent}
        </Link>
      ) : (
        <button data-slot="button" className={buttonClassName} disabled={buttonDisabled} {...props}>
          {buttonContent}
        </button>
      )}
    </div>
  );
};

export { Button, buttonVariants };
