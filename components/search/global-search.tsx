"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Searcher } from "fast-fuzzy";
import {
  Search,
  X,
  Target,
  Heart,
  DollarSign,
  Star,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Category = "Finance" | "Goals" | "Health" | "Performance";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: Category;
  badge?: string;
  badgeColor?: string;
}

const categoryConfig: Record<
  Category,
  { icon: React.ElementType; color: string; bg: string; headerBg: string }
> = {
  Finance: {
    icon: DollarSign,
    color: "text-emerald-500",
    bg: "bg-emerald-500/15",
    headerBg: "bg-emerald-500/8",
  },
  Goals: {
    icon: Target,
    color: "text-violet-500",
    bg: "bg-violet-500/15",
    headerBg: "bg-violet-500/8",
  },
  Health: {
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-500/15",
    headerBg: "bg-rose-500/8",
  },
  Performance: {
    icon: Star,
    color: "text-amber-500",
    bg: "bg-amber-500/15",
    headerBg: "bg-amber-500/8",
  },
};

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

export function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  // ── selectors ─────────────────────────────────────────────────────────────
  const currentEmail = useSelector(
    (state: RootState) => state.auth.currentEmail,
  );
  const transactions = useSelector(
    (state: RootState) => state.finance.transactions ?? [],
  );
  const budgets = useSelector(
    (state: RootState) => state.finance.budgets ?? [],
  );
  const savingsGoals = useSelector(
    (state: RootState) => state.finance.savingsGoals ?? [],
  );
  const goals = useSelector((state: RootState) => state.goals.goals ?? []);
  const workouts = useSelector(
    (state: RootState) => state.health.workouts ?? [],
  );
  const reviews = useSelector(
    (state: RootState) => state.performance.reviews ?? [],
  );

  const userGoals = useMemo(
    () => goals.filter((g) => g.userEmail === currentEmail),
    [goals, currentEmail],
  );

  // ── corpus ────────────────────────────────────────────────────────────────
  const corpus = useMemo<SearchResult[]>(() => {
    const items: SearchResult[] = [];

    transactions.forEach((tx) =>
      items.push({
        id: `tx-${tx.id}`,
        title: tx.counterParty
          ? `${tx.counterParty} · ${tx.category}`
          : tx.category,
        subtitle: `${tx.type === "expense" ? "-" : "+"}₹${tx.amount} · ${tx.createdAt}${tx.note ? ` · ${tx.note}` : ""}`,
        category: "Finance",
        badge: tx.type === "expense" ? "Expense" : "Income",
        badgeColor:
          tx.type === "expense" ? "text-rose-500" : "text-emerald-500",
      }),
    );

    budgets.forEach((b) =>
      items.push({
        id: `bgt-${b.id}`,
        title: `${b.category} Budget`,
        subtitle: `Limit ₹${b.limit} · ${b.month}`,
        category: "Finance",
        badge: "Budget",
      }),
    );

    savingsGoals.forEach((sg) =>
      items.push({
        id: `sg-${sg.id}`,
        title: sg.title,
        subtitle: `₹${sg.currentAmount} / ₹${sg.targetAmount}${sg.deadline ? ` · due ${sg.deadline}` : ""}`,
        category: "Finance",
        badge: "Savings",
      }),
    );

    userGoals.forEach((g) =>
      items.push({
        id: `goal-${g.id}`,
        title: g.title,
        subtitle: `${g.progress}% complete · ${g.priority} priority · due ${g.dueDate}`,
        category: "Goals",
        badge: g.status,
      }),
    );

    workouts.forEach((w) =>
      items.push({
        id: `wkt-${w.id}`,
        title: w.name || w.type,
        subtitle: `${w.duration} min · ${w.caloriesBurned} kcal${w.distance ? ` · ${w.distance} km` : ""}`,
        category: "Health",
        badge: w.type,
      }),
    );

    reviews.forEach((r) =>
      items.push({
        id: `rev-${r.id}`,
        title: `${r.period.charAt(0).toUpperCase() + r.period.slice(1)} Review`,
        subtitle: `Score ${r.overallScore}/100 · Productivity ${r.metrics.productivity} · Quality ${r.metrics.quality}`,
        category: "Performance",
        badge: `${r.overallScore}%`,
      }),
    );

    return items;
  }, [transactions, budgets, savingsGoals, userGoals, workouts, reviews]);

  // ── fuzzy ─────────────────────────────────────────────────────────────────
  const searcher = useMemo(
    () =>
      corpus.length > 0
        ? new Searcher(corpus, {
            keySelector: (item) => `${item.title} ${item.subtitle}`,
            threshold: 0.6,
          })
        : null,
    [corpus],
  );

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return corpus.slice(0, 24);
    if (!searcher) return [];
    return searcher.search(query).slice(0, 30);
  }, [query, corpus, searcher]);

  const grouped = useMemo(() => {
    const map = new Map<Category, SearchResult[]>();
    for (const r of results) {
      const arr = map.get(r.category) ?? [];
      arr.push(r);
      map.set(r.category, arr);
    }
    return map;
  }, [results]);

  // ── keyboard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown")
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      if (e.key === "ArrowUp") setActiveIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, results.length, onClose]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  if (!open) return null;

  let globalIdx = 0;

  return (
    <>
      {/* Backdrop — matches Dialog overlay */}
      <div className="fixed inset-0 z-200 bg-black/50" onClick={onClose} />

      {/* Panel — mirrors DialogContent: centered, rounded, shadow, border */}
      <div
        className="fixed left-1/2 top-[10%] z-201 w-full -translate-x-1/2
                   sm:max-w-lg md:max-w-xl
                   flex flex-col overflow-hidden rounded-xl border border-border
                   bg-popover shadow-xl"
        style={{ maxHeight: "78dvh" }}
      >
        {/* ── DialogHeader equivalent — search input ────────────────────── */}
        <div className="flex shrink-0 items-center gap-3 border-b border-border px-4">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Search transactions, goals, workouts…"
            className="flex-1 min-w-0 bg-transparent py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
          />
          {/* Close button — mirrors Dialog's X button */}
          <button
            onClick={onClose}
            className="shrink-0 rounded-sm p-1 text-muted-foreground opacity-70 hover:opacity-100 transition-opacity ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* ── Body — results / empty states ─────────────────────────────── */}

        {/* Empty corpus */}
        {corpus.length === 0 && (
          <div className="px-6 py-10 text-center">
            <Search className="mx-auto mb-3 size-8 text-muted-foreground/25" />
            <p className="text-sm font-medium text-foreground">No data yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add transactions, goals, or workouts to search them here.
            </p>
          </div>
        )}

        {/* No match */}
        {corpus.length > 0 && query.trim() !== "" && results.length === 0 && (
          <div className="px-6 py-10 text-center">
            <Search className="mx-auto mb-3 size-8 text-muted-foreground/25" />
            <p className="text-sm font-medium text-foreground">
              No results found
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              No results for{" "}
              <span className="font-semibold text-foreground">"{query}"</span>
            </p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="overflow-y-auto overscroll-contain">
            {(["Finance", "Goals", "Health", "Performance"] as Category[]).map(
              (cat) => {
                const items = grouped.get(cat);
                if (!items?.length) return null;
                const { icon: Icon, color, bg } = categoryConfig[cat];

                return (
                  <div key={cat}>
                    {/* Category header */}
                    <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2 backdrop-blur-sm">
                      <div
                        className={cn(
                          "flex items-center justify-center rounded-md p-1",
                          bg,
                        )}
                      >
                        <Icon className={cn("size-3", color)} />
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-widest",
                          color,
                        )}
                      >
                        {cat}
                      </span>
                      <span className="ml-auto rounded-full bg-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {items.length}
                      </span>
                    </div>

                    {/* Result rows */}
                    {items.map((item) => {
                      const idx = globalIdx++;
                      const isActive = idx === activeIndex;

                      return (
                        <div
                          key={item.id}
                          onMouseEnter={() => setActiveIndex(idx)}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 border-b border-border/40 px-4 py-3 last:border-0 transition-colors",
                            isActive ? "bg-accent/10" : "hover:bg-muted/40",
                          )}
                        >
                          {/* Category dot */}
                          <div
                            className={cn(
                              "mt-1 size-1.5 shrink-0 self-start rounded-full",
                              bg.replace("/15", "/70"),
                            )}
                          />

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground leading-snug">
                              {item.title}
                            </p>
                            <p className="truncate text-xs text-muted-foreground mt-0.5 leading-snug">
                              {item.subtitle}
                            </p>
                          </div>

                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className={cn(
                                "hidden sm:inline-flex shrink-0 text-[10px] font-medium",
                                item.badgeColor,
                              )}
                            >
                              {item.badge}
                            </Badge>
                          )}

                          <ArrowRight
                            className={cn(
                              "size-3.5 shrink-0 text-muted-foreground/30 transition-opacity",
                              isActive ? "opacity-100" : "opacity-0",
                            )}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              },
            )}
          </div>
        )}

        {/* ── DialogFooter equivalent ───────────────────────────────────── */}
        <div className="flex shrink-0 items-center justify-between border-t border-border bg-muted/30 px-4 py-2">
          <div className="hidden sm:flex items-center gap-3 text-[10px] text-muted-foreground/60">
            <span>
              <kbd className="font-mono rounded bg-border px-1 py-0.5">↑↓</kbd>{" "}
              navigate
            </span>
            <span>
              <kbd className="font-mono rounded bg-border px-1 py-0.5">↵</kbd>{" "}
              open
            </span>
            <span>
              <kbd className="font-mono rounded bg-border px-1 py-0.5">ESC</kbd>{" "}
              close
            </span>
          </div>
          <span className="sm:hidden text-[10px] text-muted-foreground/60">
            Tap a result to open
          </span>
          <span className="text-[10px] text-muted-foreground/60">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </>
  );
}
