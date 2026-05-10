"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RootState } from "@/store/index";
import { deleteTransaction } from "@/store/slices/budgets";
import { cn } from "@/lib/utils";
import {
  ArrowDownRight,
  ArrowUpRight,
  Filter,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TransactionType } from "@/lib/types/budgets";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

interface TransactionsSectionProps {
  viewMode: string;
  userEmail: string | null;
  onAddTransaction: () => void;
}

export function TransactionsSection({
  viewMode,
  userEmail,
  onAddTransaction,
}: TransactionsSectionProps) {
  const dispatch = useDispatch();
  const allTransactions = useSelector(
    (state: RootState) => state.budgets.transactions,
  );

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | TransactionType>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const userTx = useMemo(
    () => allTransactions.filter((tx) => tx.userEmail === userEmail),
    [allTransactions, userEmail],
  );

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    userTx.forEach((tx) => cats.add(tx.category));
    return Array.from(cats).sort();
  }, [userTx]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return userTx.filter((tx) => {
      const matchSearch =
        (tx.note ?? "").toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q) ||
        (tx.counterParty ?? "").toLowerCase().includes(q);
      const matchType = typeFilter === "all" || tx.type === typeFilter;
      const matchCat =
        categoryFilter === "all" || tx.category === categoryFilter;
      return matchSearch && matchType && matchCat;
    });
  }, [userTx, search, typeFilter, categoryFilter]);

  const totals = useMemo(() => {
    const income = filtered
      .filter((tx) => tx.type === "income")
      .reduce((s, tx) => s + tx.amount, 0);
    const expenses = filtered
      .filter((tx) => tx.type === "expense")
      .reduce((s, tx) => s + tx.amount, 0);
    return { income, expenses, net: income - expenses };
  }, [filtered]);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="text-2xl font-bold text-green-600">
              +{fmt(totals.income)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold text-destructive">
              -{fmt(totals.expenses)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Net Balance</p>
            <p
              className={cn(
                "text-2xl font-bold",
                totals.net >= 0 ? "text-green-600" : "text-destructive",
              )}
            >
              {totals.net >= 0 ? "+" : ""}
              {fmt(totals.net)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search note, category, merchant…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={typeFilter}
              onValueChange={(v) => setTypeFilter(v as "all" | TransactionType)}
            >
              <SelectTrigger className="w-full sm:w-37.5">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-45">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                {filtered.length} transaction
                {filtered.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={onAddTransaction}>
              <Plus className="mr-1 h-3.5 w-3.5" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No transactions found. Adjust filters or add a new transaction.
            </p>
          ) : (
            <div
              className={cn(
                "space-y-2",
                viewMode === "grid" &&
                  "sm:grid sm:grid-cols-2 sm:gap-2 sm:space-y-0",
              )}
            >
              {filtered.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                      tx.type === "income"
                        ? "bg-green-100 text-green-600"
                        : "bg-destructive/10 text-destructive",
                    )}
                  >
                    {tx.type === "income" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {tx.counterParty || tx.note || tx.category}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tx.category} · {fmtDate(tx.date)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 text-sm font-semibold",
                      tx.type === "income"
                        ? "text-green-600"
                        : "text-foreground",
                    )}
                  >
                    {tx.type === "income" ? "+" : "−"}
                    {fmt(tx.amount)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => dispatch(deleteTransaction(tx.id))}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
