/**
 * use-statement-parser.ts
 *
 * Hook that spins up statement-parser.worker.ts, sends it a file,
 * and streams progress + result back to the caller.
 *
 * Usage:
 *   const { parse, status, progress, rows, errorMsg, detectedProvider, reset } =
 *     useStatementParser();
 *
 *   await parse(file, "gpay"); // or omit providerId for auto-detect
 */

import { useCallback, useRef, useState } from "react";
import type { ParsedRow } from "@/workers/statement-parser.worker";

export type ParserStatus = "idle" | "parsing" | "done" | "error";

interface ParserState {
  status: ParserStatus;
  progress: number;
  rows: ParsedRow[];
  errorMsg: string;
  detectedProvider: string;
}

const INIT: ParserState = {
  status: "idle",
  progress: 0,
  rows: [],
  errorMsg: "",
  detectedProvider: "",
};

export function useStatementParser() {
  const workerRef = useRef<Worker | null>(null);
  const [state, setState] = useState<ParserState>(INIT);

  const reset = useCallback(() => {
    workerRef.current?.terminate();
    workerRef.current = null;
    setState(INIT);
  }, []);

  const parse = useCallback((file: File, providerId?: string) => {
    // Terminate any previous worker
    workerRef.current?.terminate();

    setState({ ...INIT, status: "parsing", progress: 5 });

    const worker = new Worker(
      new URL("../workers/statement-parser.worker.ts", import.meta.url),
      { type: "module" },
    );
    workerRef.current = worker;

    worker.onmessage = (
      e: MessageEvent<
        | { type: "progress"; value: number }
        | { type: "detected"; providerId: string }
        | { type: "done"; rows: ParsedRow[] }
        | { type: "error"; message: string }
      >,
    ) => {
      const msg = e.data;
      switch (msg.type) {
        case "progress":
          setState((s) => ({ ...s, progress: msg.value }));
          break;
        case "detected":
          setState((s) => ({ ...s, detectedProvider: msg.providerId }));
          break;
        case "done":
          setState((s) => ({
            ...s,
            status: "done",
            rows: msg.rows,
            progress: 100,
          }));
          worker.terminate();
          break;
        case "error":
          setState((s) => ({ ...s, status: "error", errorMsg: msg.message }));
          worker.terminate();
          break;
      }
    };

    worker.onerror = (err) => {
      setState((s) => ({
        ...s,
        status: "error",
        errorMsg: err.message ?? "Worker crashed unexpectedly.",
      }));
      worker.terminate();
    };

    // Transfer the file — zero-copy if browser supports it
    worker.postMessage({ file, providerId });
  }, []);

  return {
    parse,
    reset,
    status: state.status,
    progress: state.progress,
    rows: state.rows,
    errorMsg: state.errorMsg,
    detectedProvider: state.detectedProvider,
  };
}
