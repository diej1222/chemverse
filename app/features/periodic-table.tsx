import { type Element } from "@/types/element";
import { ElementCell } from "./element-cell";
import { getCategoryStyle, CATEGORY_LABELS } from "@/lib/element-utils";
import { cn } from "@/lib/utils";

interface PeriodicTableProps {
  elements: Element[];
}

export function PeriodicTable({ elements }: PeriodicTableProps) {
  const mainElements = elements.filter(
    (e) =>
      !(e.number >= 57 && e.number <= 71) &&
      !(e.number >= 89 && e.number <= 103),
  );
  const lanthanides = elements.filter((e) => e.number >= 57 && e.number <= 71);
  const actinides = elements.filter((e) => e.number >= 89 && e.number <= 103);

  // 7 rows × 18 cols
  const grid: (Element | null)[][] = Array.from({ length: 7 }, () =>
    Array(18).fill(null),
  );
  for (const el of mainElements) {
    const row = el.ypos - 1;
    const col = el.xpos - 1;
    if (row >= 0 && row < 7 && col >= 0 && col < 18) grid[row][col] = el;
  }

  const uniqueCategories = [...new Set(elements.map((e) => e.category))].filter(
    (c) => CATEGORY_LABELS[c],
  );

  // Cell base sizes matching element-cell.tsx breakpoints
  // mobile: 28px, sm: 36px, md: 44px, lg: 52px
  // Gap: 2px everywhere
  // Total min width = 18 × 28 + 17 × 2 = 504 + 34 = 538px → needs scroll on small phones

  return (
    // Outer: full width, scroll on overflow
    <div className="w-full overflow-x-auto pb-1 -mx-1 px-1">
      {/* Inner: min-width ensures the table never collapses below readable size */}
      <div className="min-w-136 sm:min-w-0 w-full">
        {/* ── Main grid ── */}
        <div
          className="grid gap-0.5"
          style={{ gridTemplateColumns: "repeat(18, minmax(0, 1fr))" }}
        >
          {grid.map((row, rowIdx) =>
            row.map((el, colIdx) => {
              const key = `${rowIdx}-${colIdx}`;

              // Lanthanide / actinide placeholder
              if (!el && colIdx === 2 && (rowIdx === 5 || rowIdx === 6)) {
                return (
                  <div
                    key={key}
                    className={cn(
                      "flex items-center justify-center rounded border border-dashed border-border",
                      "w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-13 lg:h-[3.25rem]",
                    )}
                  >
                    <span className="text-[5px] sm:text-[6px] text-muted-foreground leading-tight text-center">
                      {rowIdx === 5 ? "57–71" : "89–103"}
                    </span>
                  </div>
                );
              }

              // Empty cell
              if (!el) {
                return (
                  <div
                    key={key}
                    className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-[3.25rem] lg:h-[3.25rem]"
                  />
                );
              }

              return <ElementCell key={el.number} element={el} />;
            }),
          )}
        </div>

        {/* ── Lanthanide / Actinide rows ── */}
        <div className="mt-1.5 flex flex-col gap-0.5">
          {[
            { label: "Lanthanides", row: lanthanides },
            { label: "Actinides", row: actinides },
          ].map(({ label, row }) => (
            <div key={label} className="flex items-center gap-1">
              {/*
                Label width = ~3 cell widths to align under col 4.
                Matches the 3 empty + placeholder slots on left.
              */}
              <div
                className="shrink-0 text-right text-[8px] sm:text-[9px] text-muted-foreground leading-tight pr-0.5"
                style={{ width: "calc(3 * (100% / 18 * 1) + 6px)" }}
              >
                {label}
              </div>
              <div
                className="grid gap-0.5 flex-1"
                style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}
              >
                {row.map((el) => (
                  <ElementCell key={el.number} element={el} compact />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Legend ── */}
        <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
          {uniqueCategories.map((cat) => {
            const s = getCategoryStyle(cat);
            return (
              <span
                key={cat}
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded border",
                  "text-[9px] sm:text-[10px] md:text-xs font-medium",
                  s.bg,
                  s.text,
                  s.border,
                )}
              >
                {CATEGORY_LABELS[cat] ?? cat}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
