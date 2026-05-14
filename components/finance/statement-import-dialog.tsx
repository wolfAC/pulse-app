"use client";

/**
 * StatementImportDialog
 * components/finance/statement-import-dialog.tsx
 *
 * Fixes applied:
 *  - source typed as "gpay-pdf" | "manual" (matches Transaction interface)
 *  - bankName + account populated from parsed row
 *  - Self-transfers shown separately with "include" toggle
 *  - Parse duration shown in preview (ms / s)
 */

import { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  ArrowLeftRight,
  Clock,
  Timer,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { addManyTransactions } from "@/store/slices/finance";
import { Transaction } from "@/lib/types/finance";
import { RootState } from "@/store/index";
import { useStatementParser } from "@/hooks/use-statement-parser";
import type { ParsedRow } from "@/workers/statement-parser.worker";

// ─── Provider metadata ────────────────────────────────────────────────────────

export const PROVIDERS = [
  {
    id: "gpay",
    label: "Google Pay",
    description: "Monthly UPI statement PDF from Google Pay app",
    icon: "G",
    source: "gpay-pdf" as Transaction["source"],
  },
  {
    id: "canara",
    label: "Canara Bank",
    description: "Account statement PDF from Canara Bank net banking",
    icon: "C",
    source: "manual" as Transaction["source"],
  },
] as const;

// ─── Category heuristics ──────────────────────────────────────────────────────

const CATEGORY_RULES: { patterns: RegExp[]; category: string }[] = [
  { patterns: [/tangedco|electricity|power/i], category: "Electricity" },
  {
    patterns: [/bsnl|jio|airtel|sun direct|recharge|mobile/i],
    category: "Utilities",
  },
  { patterns: [/amazon|flipkart|myntra|meesho/i], category: "Shopping" },
  {
    patterns: [/swiggy|zomato|food|restaurant|cafe|bakery|hotel/i],
    category: "Food & Dining",
  },
  {
    patterns: [/milk|grocery|store|mart|supermart|avenue/i],
    category: "Groceries",
  },
  {
    patterns: [/railway|railways|uts|train|bus|cab|ola|uber|cumta/i],
    category: "Transport",
  },
  { patterns: [/jewel|gold|silver/i], category: "Jewellery" },
  { patterns: [/salary|payroll|stipend/i], category: "Salary" },
  { patterns: [/amazon pay later|loan|emi|credit/i], category: "Loan / EMI" },
];

function categorise(counterParty: string, details: string): string {
  const h = `${counterParty} ${details}`.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.patterns.some((p) => p.test(h))) return rule.category;
  }
  return "Miscellaneous";
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

function toTimestamp(date: string, time: string): number {
  try {
    return new Date(`${date} ${time}`).getTime();
  } catch {
    return Date.now();
  }
}

function fmtDuration(ms: number): string {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

// ─── Step type ────────────────────────────────────────────────────────────────

type Step = "select-provider" | "upload" | "parsing" | "preview" | "done";

// ─── Component ────────────────────────────────────────────────────────────────

export function StatementImportDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const dispatch = useDispatch();
  const currentEmail = useSelector((s: RootState) => s.auth.currentEmail);
  const parser = useStatementParser();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("select-provider");
  const [providerId, setProviderId] = useState("");
  const [fileName, setFileName] = useState("");
  const [importedCount, setImportedCount] = useState(0);
  const [includeSelf, setIncludeSelf] = useState(false);
  const [parseStartMs, setParseStartMs] = useState(0);
  const [parseDurationMs, setParseDurationMs] = useState(0);

  const selectedProvider = PROVIDERS.find(
    (p) => p.id === (providerId || parser.detectedProvider),
  );

  const reset = () => {
    parser.reset();
    setStep("select-provider");
    setProviderId("");
    setFileName("");
    setImportedCount(0);
    setIncludeSelf(false);
    setParseDurationMs(0);
  };

  const close = () => {
    reset();
    onOpenChange(false);
  };

  // Track parse time
  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.toLowerCase().endsWith(".pdf")) return;
      setFileName(file.name);
      setStep("parsing");
      setParseStartMs(performance.now());
      parser.parse(file, providerId || undefined);
    },
    [parser, providerId],
  );

  // Derive visible step + capture duration when worker finishes
  const derivedStep: Step = (() => {
    if (step === "done") return "done";
    if (parser.status === "parsing") return "parsing";
    if (parser.status === "done") {
      // Capture duration once
      if (parseDurationMs === 0 && parseStartMs > 0) {
        setParseDurationMs(Math.round(performance.now() - parseStartMs));
      }
      return "preview";
    }
    if (parser.status === "error") return "upload";
    return step;
  })();

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  // Rows split: regular vs self-transfers
  const regularRows = parser.rows.filter((r) => r.type !== "self");
  const selfRows = parser.rows.filter((r) => r.type === "self");
  const visibleRows = includeSelf ? parser.rows : regularRows;

  const handleImport = () => {
    if (!currentEmail) return;
    const label = selectedProvider?.label ?? "Import";
    const source = selectedProvider?.source ?? "manual";

    const transactions: Transaction[] = visibleRows
      .filter((r: ParsedRow) => r.type !== "self" || includeSelf)
      .map((row: ParsedRow) => ({
        id: nanoid(),
        userEmail: currentEmail as Transaction["userEmail"],
        type: (row.type === "self" ? "expense" : row.type) as
          | "income"
          | "expense",
        amount: row.amount,
        category:
          row.type === "self"
            ? "Self Transfer"
            : categorise(row.counterParty, row.details),
        note: `${label} – Ref: ${row.refId}`,
        counterParty: row.counterParty,
        bankName: row.bank || selectedProvider?.label,
        account: row.bank,
        tags: [
          "imported",
          providerId || parser.detectedProvider,
          ...(row.type === "self" ? ["self-transfer"] : []),
        ],
        source: source as Transaction["source"],
        createdAt: toTimestamp(row.date, row.time),
      }));

    dispatch(addManyTransactions(transactions));
    setImportedCount(transactions.length);
    setStep("done");
  };

  const income = visibleRows
    .filter((r) => r.type === "income")
    .reduce((s, r) => s + r.amount, 0);
  const expenses = visibleRows
    .filter((r) => r.type !== "income")
    .reduce((s, r) => s + r.amount, 0);

  const titles: Record<Step, string> = {
    "select-provider": "Import Statement",
    upload: `Import · ${selectedProvider?.label ?? "Statement"}`,
    parsing: "Reading PDF…",
    preview: `Preview · ${selectedProvider?.label ?? "Statement"}`,
    done: "Import Complete",
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) close();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{titles[derivedStep]}</DialogTitle>
          <DialogDescription>
            {derivedStep === "select-provider" &&
              "Choose your bank or payment app."}
            {derivedStep === "upload" &&
              `Upload your ${selectedProvider?.description ?? "statement PDF"}.`}
            {derivedStep === "preview" &&
              "Review transactions before importing."}
          </DialogDescription>
        </DialogHeader>

        {/* ── Select provider ── */}
        {derivedStep === "select-provider" && (
          <div className="space-y-3 mt-2">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setProviderId(p.id);
                  setStep("upload");
                }}
                className="flex w-full items-center gap-4 rounded-lg border border-border p-4 text-left transition-colors hover:bg-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                  {p.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{p.label}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {p.description}
                  </p>
                </div>
              </button>
            ))}
            <p className="text-xs text-center text-muted-foreground pt-1">
              Don&apos;t see your bank?{" "}
              <span
                className="text-primary cursor-pointer"
                onClick={() => {
                  setProviderId("");
                  setStep("upload");
                }}
              >
                Auto-detect from PDF
              </span>
            </p>
          </div>
        )}

        {/* ── Upload ── */}
        {derivedStep === "upload" && (
          <div className="mt-2 space-y-3">
            <button
              onClick={() => {
                parser.reset();
                setStep("select-provider");
              }}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-3 w-3" /> Change provider
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
            <div
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-10 text-center transition-colors hover:border-primary hover:bg-muted/60"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Drop your
                  {selectedProvider ? ` ${selectedProvider.label}` : ""}{" "}
                  statement here
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  or click to browse · PDF only
                </p>
              </div>
            </div>
            {parser.status === "error" && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {parser.errorMsg}
              </div>
            )}
          </div>
        )}

        {/* ── Parsing ── */}
        {derivedStep === "parsing" && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <div>
              <p className="text-sm font-medium">Parsing {fileName}…</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Running in background — UI stays responsive
              </p>
            </div>
            <div className="w-full max-w-xs">
              <Progress value={parser.progress} className="h-2" />
            </div>
          </div>
        )}

        {/* ── Preview ── */}
        {derivedStep === "preview" && (
          <div className="mt-2 space-y-3">
            {/* Parse duration + summary chips */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-border p-3 text-center">
                <p className="text-xs text-muted-foreground">Found</p>
                <p className="text-lg font-bold">{visibleRows.length}</p>
              </div>
              <div className="rounded-lg border border-border p-3 text-center">
                <p className="text-xs text-muted-foreground">Received</p>
                <p className="text-lg font-bold text-green-600">
                  +{fmt(income)}
                </p>
              </div>
              <div className="rounded-lg border border-border p-3 text-center">
                <p className="text-xs text-muted-foreground">Sent</p>
                <p className="text-lg font-bold text-destructive">
                  −{fmt(expenses)}
                </p>
              </div>
            </div>

            {/* Meta row: file name + provider + parse time */}
            <div className="flex items-center gap-2 flex-wrap">
              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground truncate max-w-40">
                {fileName}
              </span>
              <Badge variant="secondary" className="shrink-0">
                {selectedProvider?.label}
              </Badge>
              {parseDurationMs > 0 && (
                <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                  <Timer className="h-3 w-3" />
                  Parsed in {fmtDuration(parseDurationMs)}
                </div>
              )}
            </div>

            {/* Self-transfer toggle — only shown if there are any */}
            {selfRows.length > 0 && (
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label
                      className="text-xs font-medium cursor-pointer"
                      htmlFor="self-toggle"
                    >
                      Include {selfRows.length} self-transfer
                      {selfRows.length > 1 ? "s" : ""}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Transfers between your own accounts
                    </p>
                  </div>
                </div>
                <Switch
                  id="self-toggle"
                  checked={includeSelf}
                  onCheckedChange={setIncludeSelf}
                />
              </div>
            )}

            {/* Transaction list */}
            <div className="max-h-52 space-y-1.5 overflow-y-auto pr-1">
              {visibleRows.map((row, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 rounded-lg border p-2.5 hover:bg-muted/50 ${
                    row.type === "self"
                      ? "border-muted-foreground/20 bg-muted/20"
                      : "border-border"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      row.type === "income"
                        ? "bg-green-100 text-green-600"
                        : row.type === "self"
                          ? "bg-muted text-muted-foreground"
                          : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {row.type === "income" ? (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : row.type === "self" ? (
                      <ArrowLeftRight className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">
                      {row.counterParty || "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {row.date}
                      {row.bank ? ` · ${row.bank}` : ""}
                      {row.type !== "self"
                        ? ` · ${categorise(row.counterParty, row.details)}`
                        : " · Self Transfer"}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-xs font-semibold ${
                      row.type === "income"
                        ? "text-green-600"
                        : row.type === "self"
                          ? "text-muted-foreground"
                          : "text-foreground"
                    }`}
                  >
                    {row.type === "income" ? "+" : "−"}
                    {fmt(row.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Done ── */}
        {derivedStep === "done" && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div>
              <p className="text-base font-semibold">Import successful!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {importedCount} transactions added to your account.
              </p>
              {parseDurationMs > 0 && (
                <p className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> Parsed in{" "}
                  {fmtDuration(parseDurationMs)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <DialogFooter className="mt-2">
          {(derivedStep === "select-provider" || derivedStep === "upload") && (
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
          )}
          {derivedStep === "preview" && (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  parser.reset();
                  setStep("upload");
                  setParseDurationMs(0);
                }}
              >
                Back
              </Button>
              <Button onClick={handleImport}>
                Import {visibleRows.length} transactions
              </Button>
            </>
          )}
          {derivedStep === "done" && (
            <>
              <Button variant="outline" onClick={reset}>
                Import another
              </Button>
              <Button onClick={close}>Done</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
