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

// ── types ─────────────────────────────────────────────────────────────────────
type Category = "Finance" | "Goals" | "Health" | "Performance";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: Category;
  badge?: string;
  badgeColor?: string;
}

// ── category config ───────────────────────────────────────────────────────────
const categoryConfig: Record<
  Category,
  { icon: React.ElementType; color: string; bg: string }
> = {
  Finance: {
    icon: DollarSign,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  Goals: {
    icon: Target,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
  },
  Health: {
    icon: Heart,
    color: "text-rose-400",
    bg: "bg-rose-400/10",
  },
  Performance: {
    icon: Star,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
};

// ── props ─────────────────────────────────────────────────────────────────────
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
  const goals = useSelector((state: RootState) =>
    (state.goals.goals ?? []).filter((g) => g.userEmail === currentEmail),
  );
  const workouts = useSelector(
    (state: RootState) => state.health.workouts ?? [],
  );
  const reviews = useSelector(
    (state: RootState) => state.performance.reviews ?? [],
  );

  // ── build flat searchable corpus ───────────────────────────────────────────
  const corpus = useMemo<SearchResult[]>(() => {
    const items: SearchResult[] = [];

    // Transaction — type, amount, category, date, note, counterParty, tags
    transactions.forEach((tx) =>
      items.push({
        id: `tx-${tx.id}`,
        title: tx.counterParty
          ? `${tx.counterParty} · ${tx.category}`
          : tx.category,
        subtitle: `${tx.type === "expense" ? "-" : "+"}₹${tx.amount} · ${tx.date}${tx.note ? ` · ${tx.note}` : ""}`,
        category: "Finance",
        badge: tx.category,
        badgeColor:
          tx.type === "expense" ? "text-rose-400" : "text-emerald-400",
      }),
    );

    // Budget — category, limit, month (no `spent` field on type)
    budgets.forEach((b) =>
      items.push({
        id: `bgt-${b.id}`,
        title: `${b.category} Budget`,
        subtitle: `Limit ₹${b.limit} · ${b.month}`,
        category: "Finance",
        badge: "Budget",
      }),
    );

    // SavingsGoal — title, targetAmount, currentAmount, deadline
    savingsGoals.forEach((sg) =>
      items.push({
        id: `sg-${sg.id}`,
        title: sg.title,
        subtitle: `₹${sg.currentAmount} / ₹${sg.targetAmount}${sg.deadline ? ` · due ${sg.deadline}` : ""}`,
        category: "Finance",
        badge: "Savings",
      }),
    );

    // Goal — title, description, progress, priority, status, dueDate
    goals.forEach((g) =>
      items.push({
        id: `goal-${g.id}`,
        title: g.title,
        subtitle: `${g.progress}% complete · ${g.priority} priority · due ${g.dueDate}`,
        category: "Goals",
        badge: g.status,
      }),
    );

    // Workout — type, name, duration, caloriesBurned, distance
    workouts.forEach((w) =>
      items.push({
        id: `wkt-${w.id}`,
        title: w.name || w.type,
        subtitle: `${w.duration} min · ${w.caloriesBurned} kcal${w.distance ? ` · ${w.distance} km` : ""}`,
        category: "Health",
        badge: w.type,
      }),
    );

    // Review — period, overallScore, metrics (no `title` field on type)
    reviews.forEach((r) =>
      items.push({
        id: `rev-${r.id}`,
        title: `${r.period.charAt(0).toUpperCase() + r.period.slice(1)} Review`,
        subtitle: `Score ${r.overallScore}/100 · P:${r.metrics.productivity} Q:${r.metrics.quality} C:${r.metrics.communication} L:${r.metrics.learning}`,
        category: "Performance",
        badge: `${r.overallScore}%`,
      }),
    );

    return items;
  }, [transactions, budgets, savingsGoals, goals, workouts, reviews]);

  // ── fast-fuzzy searcher ───────────────────────────────────────────────────
  const searcher = useMemo(
    () =>
      new Searcher(corpus, {
        keySelector: (item) => `${item.title} ${item.subtitle}`,
        threshold: 0.6,
      }),
    [corpus],
  );

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return corpus.slice(0, 20);
    return searcher.search(query).slice(0, 30);
  }, [query, corpus, searcher]);

  // ── group by category ─────────────────────────────────────────────────────
  const grouped = useMemo(() => {
    const map = new Map<Category, SearchResult[]>();
    for (const r of results) {
      const arr = map.get(r.category) ?? [];
      arr.push(r);
      map.set(r.category, arr);
    }
    return map;
  }, [results]);

  // ── keyboard nav ──────────────────────────────────────────────────────────
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

  // ── focus on open ─────────────────────────────────────────────────────────
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
    <div
      className="fixed inset-0 z-100 flex flex-col items-center pt-16 px-4"
      style={{
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* search box */}
      <div className="w-full max-w-2xl">
        <div className="relative flex items-center rounded-2xl border border-white/10 bg-white/5 shadow-2xl ring-1 ring-white/5">
          <Search className="ml-4 size-5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Search transactions, goals, workouts…"
            className="flex-1 bg-transparent px-3 py-4 text-base text-foreground placeholder:text-muted-foreground/60 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="mr-2 rounded-md p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
          <kbd className="mr-4 hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
            ESC
          </kbd>
        </div>

        {/* results panel */}
        {results.length > 0 && (
          <div className="mt-3 max-h-[60vh] overflow-y-auto rounded-2xl border border-white/10 bg-background/80 shadow-2xl backdrop-blur-xl">
            {(["Finance", "Goals", "Health", "Performance"] as Category[]).map(
              (cat) => {
                const items = grouped.get(cat);
                if (!items?.length) return null;
                const { icon: Icon, color, bg } = categoryConfig[cat];

                return (
                  <div key={cat}>
                    {/* category header */}
                    <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
                      <div className={cn("rounded-md p-1", bg)}>
                        <Icon className={cn("size-3.5", color)} />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        {cat}
                      </span>
                      <span className="ml-auto text-xs text-muted-foreground/50">
                        {items.length}
                      </span>
                    </div>

                    {/* items */}
                    {items.map((item) => {
                      const idx = globalIdx++;
                      const isActive = idx === activeIndex;
                      return (
                        <div
                          key={item.id}
                          onMouseEnter={() => setActiveIndex(idx)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
                            isActive ? "bg-white/8" : "hover:bg-white/5",
                          )}
                        >
                          <div className={cn("rounded-lg p-1.5 shrink-0", bg)}>
                            <Icon className={cn("size-4", color)} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">
                              {item.title}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {item.subtitle}
                            </p>
                          </div>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className={cn(
                                "shrink-0 text-[10px]",
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

            {/* footer hint */}
            <div className="flex items-center gap-4 border-t border-white/5 px-4 py-2.5 text-[10px] text-muted-foreground/50">
              <span>
                <kbd className="font-mono">↑↓</kbd> navigate
              </span>
              <span>
                <kbd className="font-mono">↵</kbd> open
              </span>
              <span>
                <kbd className="font-mono">ESC</kbd> close
              </span>
              <span className="ml-auto">{results.length} results</span>
            </div>
          </div>
        )}

        {/* empty state */}
        {query && results.length === 0 && (
          <div className="mt-3 rounded-2xl border border-white/10 bg-background/80 px-4 py-10 text-center backdrop-blur-xl">
            <Search className="mx-auto mb-3 size-8 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              No results for <span className="text-foreground">"{query}"</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
