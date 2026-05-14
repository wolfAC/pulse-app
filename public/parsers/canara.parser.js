/**
 * public/parsers/canara.parser.js
 *
 * Canara Bank account statement parser.
 * ES module — imported dynamically by statement-parser.worker.ts
 *
 * Typical Canara Bank statement row:
 *   01/04/2026  UPI-MERCHANT-REF-123456  123456  500.00  (blank)  12000.00
 *   columns: Date | Narration | Chq/Ref No | Withdrawal | Deposit | Balance
 *
 * Contract:
 *   detect(lines: string[]) → boolean
 *   parse(lines: string[])  → ParsedRow[]
 */

// ─── Regexes ──────────────────────────────────────────────────────────────────

const DATE_RE = /\b(\d{2}[/-]\d{2}[/-]\d{4})\b/;
const AMT_RE = /\b(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\b/g;
const NOISE_RE =
  /Page \d+|Statement of Account|Branch|Account No|Opening Balance|Closing Balance|Date\s+Narration|Sl\.No/i;
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// ─── detect ───────────────────────────────────────────────────────────────────

export function detect(lines) {
  return lines.slice(0, 15).some((l) => /canara/i.test(l));
}

// ─── parse ────────────────────────────────────────────────────────────────────

export function parse(lines) {
  const rows = [];

  for (const line of lines) {
    if (NOISE_RE.test(line) || !DATE_RE.test(line)) continue;

    const dateM = line.match(DATE_RE);
    if (!dateM) continue;

    // Normalise DD/MM/YYYY → "01 Apr, 2026"
    const [dd, mm, yyyy] = dateM[1].split(/[/-]/);
    const date = `${dd} ${MONTHS[parseInt(mm) - 1]}, ${yyyy}`;

    // Extract all numeric values from the line
    const nums = [];
    const re = new RegExp(AMT_RE.source, "g");
    let m;
    while ((m = re.exec(line)) !== null) {
      const n = parseFloat(m[1].replace(/,/g, ""));
      if (!isNaN(n) && n > 0) nums.push(n);
    }
    // Need at least: amount + balance
    if (nums.length < 2) continue;

    // Last number = balance, second-to-last = transaction amount
    const amount = nums[nums.length - 2];

    // Credit vs debit from narration keywords
    const upper = line.toUpperCase();
    const type = /CREDIT|CR\b|NEFT CR|IMPS CR|UPI CR|SALARY|REVERSAL/.test(
      upper,
    )
      ? "income"
      : "expense";

    // Narration = text between date and first digit cluster
    const afterDate = line.slice(dateM.index + dateM[1].length).trim();
    const narration = afterDate
      .replace(/[\d,.()\s]+$/, "")
      .trim()
      .slice(0, 60);

    // Reference number = first 6+ digit token after date
    const refId = afterDate.match(/\b(\d{6,})\b/)?.[1] ?? "";

    rows.push({
      date,
      time: "12:00 AM",
      details: line,
      counterParty: narration || "Canara Bank Txn",
      type,
      amount,
      refId,
      bank: "Canara Bank",
    });
  }

  return rows;
}
