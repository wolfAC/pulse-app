"use client";

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
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { addManyTransactions } from "@/store/slices/finance";
import { Transaction } from "@/lib/types/finance";
import { RootState } from "@/store/index";
import { useStatementParser } from "@/hooks/use-statement-parser";
import type { ParsedRow } from "@/workers/statement-parser.worker";
import { mapCategory } from "@/lib/finance/category-mapper";

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

// ─── Formatters ───────────────────────────────────────────────────────────────

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

// ─── Shared inner content ─────────────────────────────────────────────────────

interface ContentProps {
  derivedStep: Step;
  step: Step;
  parser: ReturnType<typeof useStatementParser>;
  selectedProvider: (typeof PROVIDERS)[number] | undefined;
  providerId: string;
  fileName: string;
  parseDurationMs: number;
  includeSelf: boolean;
  selfRows: ParsedRow[];
  regularRows: ParsedRow[];
  visibleRows: ParsedRow[];
  income: number;
  expenses: number;
  importedCount: number;
  fileRef: React.RefObject<HTMLInputElement | null>;
  setIncludeSelf: (v: boolean) => void;
  handleFile: (f: File) => void;
  onDrop: (e: React.DragEvent) => void;
  onBack: () => void;
  onReset: () => void;
  onSelectProvider: (id: string) => void; // ← new
}

function StepContent({
  derivedStep,
  parser,
  selectedProvider,
  fileName,
  parseDurationMs,
  includeSelf,
  selfRows,
  visibleRows,
  income,
  expenses,
  fileRef,
  setIncludeSelf,
  handleFile,
  onDrop,
  onBack,
  onSelectProvider, // ← new
}: ContentProps) {
  /* ── Select provider ── */
  if (derivedStep === "select-provider") {
    return (
      <div className="space-y-3">
        {PROVIDERS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelectProvider(p.id)} // ← direct, no delegation
            className="flex w-full items-center gap-3 rounded-xl border border-border p-4 text-left transition-colors hover:bg-muted/60 active:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-16"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
              {p.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{p.label}</p>
              <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                {p.description}
              </p>
            </div>
          </button>
        ))}
        <p className="text-xs text-center text-muted-foreground pt-1">
          Don&apos;t see your bank?{" "}
          <span
            onClick={() => onSelectProvider("")} // ← auto-detect
            className="text-primary cursor-pointer underline underline-offset-2"
          >
            Auto-detect from PDF
          </span>
        </p>
      </div>
    );
  }

  /* ── Upload ── */
  if (derivedStep === "upload") {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground active:text-foreground transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Change provider
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
          className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-muted/30 px-6 py-12 text-center transition-colors hover:border-primary hover:bg-muted/60 active:bg-muted"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Upload className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold">
              Drop your{selectedProvider ? ` ${selectedProvider.label}` : ""}{" "}
              statement here
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              or tap to browse · PDF only
            </p>
          </div>
        </div>
        {parser.status === "error" && (
          <div className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {parser.errorMsg}
          </div>
        )}
      </div>
    );
  }

  /* ── Parsing ── */
  if (derivedStep === "parsing") {
    return (
      <div className="flex flex-col items-center gap-5 py-8 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <div>
          <p className="text-sm font-semibold">Parsing {fileName}…</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Running in background — UI stays responsive
          </p>
        </div>
        <div className="w-full max-w-xs">
          <Progress value={parser.progress} className="h-2" />
        </div>
      </div>
    );
  }

  /* ── Preview ── */
  if (derivedStep === "preview") {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Found", value: String(visibleRows.length), color: "" },
            {
              label: "Received",
              value: `+${fmt(income)}`,
              color: "text-green-600",
            },
            {
              label: "Sent",
              value: `−${fmt(expenses)}`,
              color: "text-destructive",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-xl border border-border p-3 text-center"
            >
              <p className="text-[11px] text-muted-foreground">{label}</p>
              <p className={`text-base font-bold mt-0.5 ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground truncate max-w-36">
              {fileName}
            </span>
            <Badge variant="secondary" className="shrink-0 text-[10px]">
              {selectedProvider?.label ?? "Auto"}
            </Badge>
          </div>
          {parseDurationMs > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
              <Timer className="h-3 w-3" />
              {fmtDuration(parseDurationMs)}
            </div>
          )}
        </div>

        {selfRows.length > 0 && (
          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-3 py-3 gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <ArrowLeftRight className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <Label
                  className="text-xs font-medium cursor-pointer"
                  htmlFor="self-toggle"
                >
                  Include {selfRows.length} self-transfer
                  {selfRows.length > 1 ? "s" : ""}
                </Label>
                <p className="text-xs text-muted-foreground leading-snug">
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

        <div className="max-h-[36vh] space-y-1.5 overflow-y-auto pr-0.5 -mr-1 overscroll-contain">
          {visibleRows.map((row, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 rounded-xl border p-3 ${
                row.type === "self"
                  ? "border-muted-foreground/20 bg-muted/20"
                  : "border-border"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  row.type === "income"
                    ? "bg-green-100 text-green-600"
                    : row.type === "self"
                      ? "bg-muted text-muted-foreground"
                      : "bg-destructive/10 text-destructive"
                }`}
              >
                {row.type === "income" ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : row.type === "self" ? (
                  <ArrowLeftRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">
                  {row.counterParty || "—"}
                </p>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  {row.date}
                  {row.bank ? ` · ${row.bank}` : ""}
                  {row.type === "self"
                    ? " · Self Transfer"
                    : ` · ${mapCategory(row.type, row.counterParty, row.details)}`}
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
    );
  }

  /* ── Done ── */
  if (derivedStep === "done") {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div>
          <p className="text-base font-semibold">Import successful!</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Transactions added to your account.
          </p>
          {parseDurationMs > 0 && (
            <p className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" /> Parsed in{" "}
              {fmtDuration(parseDurationMs)}
            </p>
          )}
        </div>
      </div>
    );
  }

  return null;
}

// ─── Main component ───────────────────────────────────────────────────────────

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
  const isMobile = useIsMobile();

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

  const derivedStep: Step = (() => {
    if (step === "done") return "done";
    if (parser.status === "parsing") return "parsing";
    if (parser.status === "done") {
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

  // ← The key fix: direct handler passed as prop, no delegation
  const handleSelectProvider = useCallback((id: string) => {
    setProviderId(id);
    setStep("upload");
  }, []);

  const regularRows = parser.rows.filter((r) => r.type !== "self");
  const selfRows = parser.rows.filter((r) => r.type === "self");
  const visibleRows = includeSelf ? parser.rows : regularRows;

  const income = visibleRows
    .filter((r) => r.type === "income")
    .reduce((s, r) => s + r.amount, 0);
  const expenses = visibleRows
    .filter((r) => r.type !== "income")
    .reduce((s, r) => s + r.amount, 0);

  const handleImport = () => {
    if (!currentEmail) return;
    const label = selectedProvider?.label ?? "Import";
    const source = selectedProvider?.source ?? "manual";

    const transactions: Transaction[] = visibleRows
      .filter((r: ParsedRow) => r.type !== "self" || includeSelf)
      .map((row: ParsedRow) => {
        const txType = (row.type === "self" ? "expense" : row.type) as
          | "income"
          | "expense";
        return {
          id: nanoid(),
          userEmail: currentEmail as Transaction["userEmail"],
          type: txType,
          amount: row.amount,
          category:
            row.type === "self"
              ? "Other"
              : mapCategory(txType, row.counterParty, row.details),
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
        };
      });

    dispatch(addManyTransactions(transactions));
    setImportedCount(transactions.length);
    setStep("done");
  };

  const titles: Record<Step, string> = {
    "select-provider": "Import Statement",
    upload: `Import · ${selectedProvider?.label ?? "Statement"}`,
    parsing: "Reading PDF…",
    preview: `Preview · ${selectedProvider?.label ?? "Statement"}`,
    done: "Import Complete",
  };

  const descriptions: Partial<Record<Step, string>> = {
    "select-provider": "Choose your bank or payment app.",
    upload: `Upload your ${selectedProvider?.description ?? "statement PDF"}.`,
    preview: "Review transactions before importing.",
  };

  const footerButtons = (
    <>
      {(derivedStep === "select-provider" || derivedStep === "upload") && (
        <Button variant="outline" className="w-full sm:w-auto" onClick={close}>
          Cancel
        </Button>
      )}
      {derivedStep === "preview" && (
        <>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              parser.reset();
              setStep("upload");
              setParseDurationMs(0);
            }}
          >
            Back
          </Button>
          <Button className="w-full sm:w-auto" onClick={handleImport}>
            Import {visibleRows.length} transactions
          </Button>
        </>
      )}
      {derivedStep === "done" && (
        <>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={reset}
          >
            Import another
          </Button>
          <Button className="w-full sm:w-auto" onClick={close}>
            Done
          </Button>
        </>
      )}
    </>
  );

  const stepContent = (
    <StepContent
      derivedStep={derivedStep}
      step={step}
      parser={parser}
      selectedProvider={selectedProvider}
      providerId={providerId}
      fileName={fileName}
      parseDurationMs={parseDurationMs}
      includeSelf={includeSelf}
      selfRows={selfRows}
      regularRows={regularRows}
      visibleRows={visibleRows}
      income={income}
      expenses={expenses}
      importedCount={importedCount}
      fileRef={fileRef}
      setIncludeSelf={setIncludeSelf}
      handleFile={handleFile}
      onDrop={onDrop}
      onBack={() => {
        parser.reset();
        setStep("select-provider");
      }}
      onReset={reset}
      onSelectProvider={handleSelectProvider} // ← passed directly
    />
  );

  if (!isMobile) {
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
            {descriptions[derivedStep] && (
              <DialogDescription>{descriptions[derivedStep]}</DialogDescription>
            )}
          </DialogHeader>
          <div className="mt-2">{stepContent}</div>
          <DialogFooter className="mt-4 flex-col-reverse sm:flex-row gap-2">
            {footerButtons}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(o) => {
        if (!o) close();
      }}
    >
      <DrawerContent className="max-h-[92dvh] flex flex-col">
        <DrawerHeader className="text-left px-4 pt-2 pb-0">
          <DrawerTitle>{titles[derivedStep]}</DrawerTitle>
          {descriptions[derivedStep] && (
            <DrawerDescription>{descriptions[derivedStep]}</DrawerDescription>
          )}
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4 py-3 overscroll-contain">
          {stepContent}
        </div>
        <DrawerFooter className="px-4 pb-6 pt-2 flex flex-col gap-2 border-t border-border">
          {footerButtons}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
