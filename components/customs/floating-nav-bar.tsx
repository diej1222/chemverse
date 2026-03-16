"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  BrainCircuit,
  FlaskConical,
  Gamepad2,
  type LucideIcon,
} from "lucide-react";

// ─────────────────────────────────────────────
//  NAV CONFIG  ← only touch this to add pages
// ─────────────────────────────────────────────
interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Lessons", href: "/lessons", icon: BookOpen },
  { label: "Quiz", href: "/quiz", icon: BrainCircuit },
  { label: "Experiments", href: "/experiments", icon: FlaskConical },
  { label: "Games", href: "/games", icon: Gamepad2 },
];

// ─────────────────────────────────────────────
//  SINGLE NAV ITEM
// ─────────────────────────────────────────────
function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative flex flex-col items-center justify-center gap-1",
        "flex-1 min-w-0 py-2 px-1 rounded-xl",
        "transition-all duration-300 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "group",
      )}
    >
      {/* Active pill — bg-accent from your existing tokens */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 rounded-xl transition-all duration-300 ease-out bg-accent",
          isActive ? "scale-100 opacity-100" : "scale-75 opacity-0",
        )}
      />

      {/* Icon */}
      <Icon
        size={22}
        strokeWidth={isActive ? 2.2 : 1.8}
        className={cn(
          "relative z-10 transition-all duration-300 ease-out",
          isActive
            ? "text-primary scale-110 -translate-y-0.5"
            : "text-muted-foreground group-hover:text-foreground group-hover:scale-105",
        )}
      />

      {/* Label */}
      <span
        className={cn(
          "relative z-10 text-[11px] font-medium leading-none tracking-wide",
          "truncate max-w-full px-1 transition-all duration-300 ease-out",
          isActive
            ? "text-primary opacity-100 translate-y-0"
            : "text-muted-foreground opacity-70 translate-y-0.5 group-hover:opacity-100",
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}

// ─────────────────────────────────────────────
//  FLOATING NAV BAR
// ─────────────────────────────────────────────
export function FloatingNavBar() {
  const pathname = usePathname();

  return (
    /* Outer positioner */
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none px-4 pb-4 sm:pb-6">
      <nav
        aria-label="Main navigation"
        className={cn(
          "pointer-events-auto",
          "w-full max-w-sm sm:max-w-md",
          "rounded-2xl border border-border",
          "bg-card/80 backdrop-blur-xl shadow-lg",
          "flex items-center px-2 py-1.5 gap-1",
        )}
      >
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={
              pathname === item.href || pathname.startsWith(item.href + "/")
            }
          />
        ))}
      </nav>
    </div>
  );
}

export default FloatingNavBar;
