import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-brand-primary-500 text-white shadow",
        secondary:
          "border-transparent bg-brand-secondary-200 text-brand-secondary-900 dark:bg-brand-secondary-700 dark:text-white",
        accent:
          "border-transparent bg-brand-accent-500 text-white shadow",
        outline:
          "border-brand-primary-500 text-brand-primary-500",
        success:
          "border-transparent bg-green-500 text-white shadow",
        warning:
          "border-transparent bg-yellow-500 text-white shadow",
        danger:
          "border-transparent bg-red-500 text-white shadow",
        info:
          "border-transparent bg-blue-500 text-white shadow",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
