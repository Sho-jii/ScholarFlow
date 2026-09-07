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
          "overflow-hidden rounded-[32px] md:rounded-[40px] bg-background text-foreground shadow-[inset_0_0_5px_rgba(6,5,6,0.18)] dark:shadow-[inset_0_0_5px_rgba(253,252,253,0.12)] border border-black/5 dark:border-white/10 transition-all",
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
