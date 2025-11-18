import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-500 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-primary-500 text-white shadow hover:bg-brand-primary-600 active:bg-brand-primary-700",
        secondary:
          "bg-brand-secondary-800 text-white shadow hover:bg-brand-secondary-700 dark:bg-brand-secondary-700 dark:hover:bg-brand-secondary-600",
        outline:
          "border-2 border-brand-primary-500 text-brand-primary-500 hover:bg-brand-primary-50 dark:hover:bg-brand-primary-950",
        ghost:
          "hover:bg-brand-secondary-100 dark:hover:bg-brand-secondary-800",
        accent:
          "bg-brand-accent-500 text-white shadow hover:bg-brand-accent-600 active:bg-brand-accent-700",
        success:
          "bg-green-500 text-white shadow hover:bg-green-600 active:bg-green-700",
        danger:
          "bg-red-500 text-white shadow hover:bg-red-600 active:bg-red-700",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, ...props }, ref) => {
    const computedClassName = cn(
      buttonVariants({ variant, size }),
      fullWidth && "w-full",
      className
    );

    if (asChild) {
      return React.cloneElement(props.children as React.ReactElement<any>, {
        className: computedClassName,
        ref,
      });
    }

    return (
      <button
        className={computedClassName}
        ref={ref}
        {...props}
      >
        {props.children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
