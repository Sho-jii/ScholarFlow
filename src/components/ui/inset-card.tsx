import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InsetCardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export const InsetCard = forwardRef<HTMLElement, InsetCardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          "overflow-hidden rounded-2xl md:rounded-3xl bg-card text-card-foreground border border-black/10 dark:border-white/10 shadow-xs transition-all duration-300",
          className
        )}
        {...props}
      >
        {children}
      </section>
    );
  }
);

InsetCard.displayName = "InsetCard";
