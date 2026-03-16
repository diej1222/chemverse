"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { type Element } from "@/types/element";
import { getCategoryStyle, CATEGORY_LABELS } from "@/lib/element-utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ElementCellProps {
  element: Element;
  compact?: boolean;
}

export function ElementCell({ element, compact = false }: ElementCellProps) {
  const style = getCategoryStyle(element.category);
  const slug = element.name.toLowerCase();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={`/chemical/${slug}`}
          className={cn(
            "group relative flex flex-col items-center justify-center",
            "rounded-lg border transition-all duration-200 ease-out",
            "cursor-pointer select-none overflow-hidden min-w-0",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "w-full aspect-square",
            style.bg,
            style.border,
            "hover:scale-110 hover:z-10 hover:shadow-md hover:brightness-105",
          )}
        >
          {/* Atomic number */}
          <span className="leading-none font-mono tabular-nums text-muted-foreground text-[clamp(6px,1.1cqi,9px)]">
            {element.number}
          </span>

          {/* Symbol */}
          <span
            className={cn(
              "font-bold leading-none text-[clamp(9px,2cqi,16px)]",
              style.text,
            )}
          >
            {element.symbol}
          </span>

          {/* Name */}
          <span className="leading-none text-center truncate w-full px-0.5 text-muted-foreground text-[clamp(10px,0.9cqi,8px)]">
            {element.name}
          </span>
        </Link>
      </TooltipTrigger>

      <TooltipContent side="top" className="text-center bg-primary">
        <p className="font-semibold text-sm">{element.name}</p>
        <p className="text-xs ">
          {element.number} · {element.atomic_mass.toFixed(3)} u
        </p>
        <p className="text-xs ">
          {CATEGORY_LABELS[element.category] ?? element.category}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
