"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";
import { cn } from "@/app/lib/utils/utils";
import { Label } from "./label";

interface TooltipWrapperProps {
  label: string;
  text: string;
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
  className?: string;
  iconClassName?: string;
}

export function TooltipWrapper({
  label,
  text,
  side = "top",
  delayDuration = 100,
  className,
  iconClassName,
}: TooltipWrapperProps) {
  return (
    <span className="flex items-center gap-1.5 text-white mb-4">
      <Label>{label}</Label>
      <TooltipPrimitive.Provider delayDuration={delayDuration}>
        <TooltipPrimitive.Root>
          <TooltipPrimitive.Trigger asChild>
            <span
              className={cn(
                "inline-flex items-center justify-center cursor-pointer",
                iconClassName
              )}
            >
              <Info className="h-4 w-4 text-white-foreground" />
            </span>
          </TooltipPrimitive.Trigger>
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              side={side}
              sideOffset={4}
              className={cn(
                "z-50 max-w-xs rounded-md bg-muted px-3 py-1.5 text-xs text-muted-foreground shadow-md text-center",
                "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                className
              )}
            >
              {text}
              <TooltipPrimitive.Arrow className="fill-muted" />
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>
    </span>
  );
}
