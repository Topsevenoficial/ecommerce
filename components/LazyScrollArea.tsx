"use client";

import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface LazyScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
}

export const LazyScrollArea = React.forwardRef<
  HTMLDivElement,
  LazyScrollAreaProps
>(({ children, className, onScroll, ...props }, ref) => {
  return (
    <ScrollArea className={cn("h-[250px] w-full", className)}>
      {/* Se crea un contenedor interno que tenga overflow-y-auto y capture el onScroll */}
      <div
        onScroll={onScroll}
        ref={ref}
        {...props}
        className="h-full w-full overflow-y-auto"
      >
        {children}
      </div>
    </ScrollArea>
  );
});

LazyScrollArea.displayName = "LazyScrollArea";
