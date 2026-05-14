/**
 * statement-parser.worker.ts
 * components/finance/statement-parser.worker.ts
 *
 * Thin orchestrator — all bank-specific logic lives in /public/parsers/*.parser.js
 * Adding a new bank = drop a new parser file, no worker changes needed.
 *
 * Message in:  { file: File, providerId?: string }
 * Messages out:
 *   { type: "progress",  value: number }
 *   { type: "detected",  providerId: string }
 *   { type: "done",      rows: ParsedRow[] }
 *   { type: "error",     message: string }
 */

export interface ParsedRow {
  date: string;
  time: string;
  details: string;
  counterParty: string;
  type: "income" | "expense" | "self";
  amount: number;
  refId: string;
  bank: string;
}

interface ParserModule {
  detect: (lines: string[]) => boolean;
  parse: (lines: string[]) => ParsedRow[];
}

type WorkerMsg =
  | { type: "progress"; value: number }
  | { type: "detected"; providerId: string }
  | { type: "done"; rows: ParsedRow[] }
  | { type: "error"; message: string };

function post(msg: WorkerMsg) {
  self.postMessage(msg);
}

// ─── Provider registry ────────────────────────────────────────────────────────
// Only IDs here — parse/detect logic lives in /public/parsers/

const PROVIDER_IDS = ["gpay", "canara"] as const;
type ProviderId = (typeof PROVIDER_IDS)[number];

async function loadParser(id: ProviderId): Promise<ParserModule> {
  // Fetch the parser source and re-import via a Blob URL.
  // This sidesteps worker dynamic-import restrictions on absolute URLs
  // that affect Chrome/Firefox when running from localhost or behind Turbopack.
  const url = `${self.location.origin}/parsers/${id}.parser.js`;
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`Failed to fetch parser: ${url} (${res.status})`);
  const src = await res.text();
  const blob = new Blob([src], { type: "text/javascript" });
  const blobUrl = URL.createObjectURL(blob);
  try {
    const mod = (await import(
      /* webpackIgnore: true */ blobUrl
    )) as ParserModule;
    if (typeof mod.parse !== "function" || typeof mod.detect !== "function") {
      throw new Error(`Parser "${id}" is missing parse() or detect() export`);
    }
    return mod;
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

// ─── PDF text extractor ───────────────────────────────────────────────────────

async function extractLines(file: File): Promise<string[]> {
  // @ts-ignore — dynamic import inside worker
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() })
    .promise;

  const allItems: { str: string; x: number; y: number; page: number }[] = [];

  for (let p = 1; p <= pdf.numPages; p++) {
    post({ type: "progress", value: Math.round(10 + (p / pdf.numPages) * 45) });
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    for (const raw of content.items as { str: string; transform: number[] }[]) {
      const str = raw.str.trim();
      if (!str) continue;
      allItems.push({
        str,
        x: Math.round(raw.transform[4]),
        y: Math.round(raw.transform[5]),
        page: p,
      });
    }
  }

  // Bucket items into visual lines (±4 px y tolerance)
  const lineMap = new Map<string, { x: number; str: string }[]>();
  for (const item of allItems) {
    const key = `${item.page}__${Math.round(item.y / 4) * 4}`;
    if (!lineMap.has(key)) lineMap.set(key, []);
    lineMap.get(key)!.push({ x: item.x, str: item.str });
  }

  return Array.from(lineMap.keys())
    .sort((a, b) => {
      const [pa, ya] = a.split("__").map(Number);
      const [pb, yb] = b.split("__").map(Number);
      return pa !== pb ? pa - pb : yb - ya;
    })
    .map((k) =>
      lineMap
        .get(k)!
        .sort((a, b) => a.x - b.x)
        .map((i) => i.str)
        .join(" ")
        .trim(),
    )
    .filter(Boolean);
}

// ─── Message handler ──────────────────────────────────────────────────────────

self.onmessage = async (
  e: MessageEvent<{ file: File; providerId?: string }>,
) => {
  const { file, providerId } = e.data;

  try {
    post({ type: "progress", value: 5 });

    // 1. Extract text from PDF
    const lines = await extractLines(file);
    post({ type: "progress", value: 60 });

    // 2. Resolve provider — manual pick or auto-detect
    let resolvedId: ProviderId | undefined;

    if (
      providerId &&
      (PROVIDER_IDS as readonly string[]).includes(providerId)
    ) {
      resolvedId = providerId as ProviderId;
    } else {
      for (const id of PROVIDER_IDS) {
        const mod = await loadParser(id);
        if (mod.detect(lines)) {
          resolvedId = id;
          break;
        }
      }
    }

    if (!resolvedId) {
      post({
        type: "error",
        message:
          "Could not detect statement format. Please select a provider manually.",
      });
      return;
    }

    post({ type: "detected", providerId: resolvedId });
    post({ type: "progress", value: 70 });

    // 3. Load the correct parser and run it
    const parser = await loadParser(resolvedId);
    const rows = parser.parse(lines);
    post({ type: "progress", value: 95 });

    if (rows.length === 0) {
      post({
        type: "error",
        message:
          "No transactions found. Make sure this is a valid statement PDF.",
      });
      return;
    }

    post({ type: "progress", value: 100 });
    post({ type: "done", rows });
  } catch (err) {
    post({ type: "error", message: String(err) });
  }
};
