"use client";

import { useState, useEffect } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface ContentTabAction {
  label: string;
  onClick: () => void;
}

export interface ContentTabItem {
  name: string;
  value: string;
  content: React.ReactNode;
  actions?: ContentTabAction[];
}

interface ContentTabProps {
  tabs: ContentTabItem[];
  defaultValue?: string;
  orientation?: "vertical" | "horizontal";
  className?: string;
}

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isMobile;
};

export const ContentTab = ({
  tabs,
  defaultValue,
  orientation = "vertical",
  className,
}: ContentTabProps) => {
  const [active, setActive] = useState(defaultValue ?? tabs[0]?.value);
  const isMobile = useIsMobile();

  const activeTab = tabs.find((t) => t.value === active);

  // if already horizontal, stay horizontal; if vertical on mobile, switch to horizontal
  const resolvedOrientation =
    orientation === "horizontal" || isMobile ? "horizontal" : "vertical";

  const renderTrigger = (tab: ContentTabItem, extraClass?: string) => {
    const isActive = active === tab.value;

    if (tab.actions?.length) {
      return (
        <DropdownMenu key={tab.value}>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "text-left px-3 py-2 rounded-md text-sm transition-colors w-full cursor-pointer",
                "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                isActive && "bg-muted text-foreground font-medium",
                extraClass,
              )}
            >
              {tab.name}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setActive(tab.value)}>
              View content
            </DropdownMenuItem>
            {tab.actions.map((action) => (
              <DropdownMenuItem key={action.label} onClick={action.onClick}>
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <button
        key={tab.value}
        onClick={() => setActive(tab.value)}
        className={cn(
          "text-left px-3 py-2 rounded-md text-sm transition-colors w-full cursor-pointer",
          "text-muted-foreground hover:text-foreground hover:bg-muted/60",
          isActive && "bg-muted text-foreground font-medium",
          extraClass,
        )}
      >
        {tab.name}
      </button>
    );
  };

  if (resolvedOrientation === "horizontal") {
    return (
      <div className={cn("w-full", className)}>
        <ScrollArea className="w-full">
          <div className="flex gap-1 border-b border-border">
            {tabs.map((tab) => {
              const isActive = active === tab.value;

              if (tab.actions?.length) {
                return (
                  <DropdownMenu key={tab.value}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          "shrink-0 px-4 py-2.5 text-sm font-medium transition-colors relative cursor-pointer",
                          "text-muted-foreground hover:text-foreground",
                          isActive &&
                            "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-foreground",
                        )}
                      >
                        {tab.name}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => setActive(tab.value)}>
                        View content
                      </DropdownMenuItem>
                      {tab.actions.map((action) => (
                        <DropdownMenuItem
                          key={action.label}
                          onClick={action.onClick}
                        >
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              return (
                <button
                  key={tab.value}
                  onClick={() => setActive(tab.value)}
                  className={cn(
                    "shrink-0 px-4 py-2.5 text-sm font-medium transition-colors relative cursor-pointer",
                    "text-muted-foreground hover:text-foreground",
                    isActive &&
                      "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-foreground",
                  )}
                >
                  {tab.name}
                </button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="mt-6 text-sm text-muted-foreground leading-relaxed">
          {activeTab?.content}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full gap-8", className)}>
      <div className="flex flex-col gap-0.5 min-w-50 w-50 shrink-0">
        {tabs.map((tab) => renderTrigger(tab))}
      </div>
      <div className="w-px bg-border shrink-0" />
      <div className="flex-1 min-w-0 text-sm text-muted-foreground leading-relaxed">
        {activeTab?.content}
      </div>
    </div>
  );
};
