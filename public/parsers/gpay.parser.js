/**
 * public/parsers/gpay.parser.js
 *
 * Google Pay UPI monthly statement parser.
 * ES module — imported dynamically by statement-parser.worker.ts
 *
 * Contract:
 *   detect(lines: string[]) → boolean
 *   parse(lines: string[])  → ParsedRow[]
 */

// ─── Regexes ──────────────────────────────────────────────────────────────────

const DATE_RE =
  /\b(\d{2} (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec),? \d{4})\b/;
const TIME_RE = /\b(\d{1,2}:\d{2} [AP]M)\b/;
const AMT_RE = /₹([\d,]+(?:\.\d{1,2})?)/;
const UPI_RE = /UPI Transaction ID[:\s]+(\d+)/i;
const DIR_RE =
  /(Paid to|Received from|Self transfer to)\s+([\w\s.,&'-]+?)(?=\s*₹|\s*UPI\s*Transaction|\s*Paid (?:by|to)\s+\w+[\w\s]*(?:Bank|India)|\s*$)/i;
const BANK_RE = /Paid (?:by|to)\s+([A-Za-z ]+(?:Bank|India)[A-Za-z ]*\s*\d+)/i;
const NOISE_RE = /Transaction statement|Note: This|Powered by|Page \d+ of \d+/i;

// ─── detect ───────────────────────────────────────────────────────────────────

export function detect(lines) {
  return lines.slice(0, 10).some((l) => /google pay|gpay/i.test(l));
}

// ─── parse ────────────────────────────────────────────────────────────────────

export function parse(lines) {
  // Group lines into per-transaction blocks (each starts with a date line)
  const blocks = [];
  let cur = null;

  for (const line of lines) {
    if (NOISE_RE.test(line)) continue;
    if (DATE_RE.test(line)) {
      if (cur) blocks.push(cur);
      cur = [line];
    } else if (cur) {
      cur.push(line);
    }
  }
  if (cur?.length) blocks.push(cur);

  return blocks.flatMap((block) => {
    const txt = block.join(" ");

    const amtM = txt.match(AMT_RE);
    if (!amtM) return [];
    const amount = parseFloat(amtM[1].replace(/,/g, ""));
    if (isNaN(amount) || amount === 0) return [];

    const date = txt.match(DATE_RE)?.[1] ?? "";
    const time = txt.match(TIME_RE)?.[1] ?? "12:00 AM";
    const refId = txt.match(UPI_RE)?.[1] ?? "";
    const bank = txt.match(BANK_RE)?.[1]?.trim() ?? "";

    const dirM = txt.match(DIR_RE);
    let type = "expense";
    let counterParty = "";

    if (dirM) {
      const d = dirM[1].toLowerCase();
      type = d.startsWith("received")
        ? "income"
        : d.startsWith("self")
          ? "self"
          : "expense";
      counterParty = dirM[2].trim();
    }

    return [
      { date, time, details: txt, counterParty, type, amount, refId, bank },
    ];
  });
}
