/**
 * scripts/dt-add.ts — fast cell-population helper for the dividend-tax
 * research cadence (75 → 400 cells, 30-45 min/evening per operator).
 *
 * Usage (single cell):
 *   npm run dt:add -- --inv US --pay DE --rate 15 --ref "US-Germany Tax Treaty Art.10(2)(b)" --src "PwC Worldwide Tax Summaries: Germany — Withholding taxes on dividends to US residents"
 *
 * Usage (batch from clipboard / file):
 *   npm run dt:add -- --batch path/to/cells.tsv
 *
 *   TSV format: inv \t pay \t rate \t ref \t src \t notes(optional)
 *
 * Behavior:
 *   - Validates ISO codes exist in COUNTRIES
 *   - Refuses to overwrite an existing 'verified' cell unless --force
 *   - Promotes existing 'needs_research' placeholders to 'verified' with
 *     proper citation
 *   - Sets last_verified = today
 *   - Validates source_citation contains one of: PwC | KPMG | IRS Pub 901 |
 *     IRS Publication 901 | OECD | HMRC | ATO | Bundeszentralamt | etc.
 *     (sources approved by operator)
 *   - Re-sorts the JSON by (investor, payer) for diff-friendliness
 *
 * Exits 0 on success, 1 on validation error.
 */

import * as fs from "node:fs";
import * as path from "node:path";

type State = "verified" | "derived" | "needs_research";

type TreatyCell = {
  investor_country: string;
  payer_country: string;
  withholding_rate_pct: number;
  treaty_reference: string;
  source_citation: string;
  state: State;
  last_verified: string;
  notes?: string;
};

const DATA_PATH = path.resolve("data/dividend-tax.json");

// Approved primary-source patterns. Operator can extend this list as new
// authorities are added to the research workflow. Citations not matching
// any pattern produce a warning (not a hard fail) — sometimes country-
// specific tax authority guidance (HMRC, ATO, Bundeszentralamt etc.) is
// the correct primary source.
const APPROVED_SOURCES = [
  /pwc/i,
  /kpmg/i,
  /irs\s+(publication|pub\.?)\s*901/i,
  /oecd/i,
  /deloitte/i,
  /ey\b/i,
  /hmrc/i, // UK
  /\bato\b/i, // Australia
  /bundeszentralamt|bzst/i, // Germany
  /skatteverket/i, // Sweden
  /skatteetaten/i, // Norway
  /skatteforvaltningen|skat\.dk/i, // Denmark
  /agenzia entrate/i, // Italy
  /aeat/i, // Spain
  /belastingdienst/i, // Netherlands
  /direction.*finances|impots\.gouv/i, // France
  /efd|estv/i, // Switzerland
  /cra|canada\.ca/i, // Canada
  /revenue\.ie/i, // Ireland
  /nta\.go\.jp/i, // Japan
  /iras\.gov\.sg/i, // Singapore
  /finanzministerium|finanzonline/i, // Austria
];

function loadData(): { _meta: any; countries: any[]; treaties: TreatyCell[] } {
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
}

function saveData(data: any): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function parseArgs(): Record<string, string> {
  const args: Record<string, string> = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k.startsWith("--")) {
      const v = argv[i + 1];
      if (v && !v.startsWith("--")) {
        args[k.slice(2)] = v;
        i++;
      } else {
        args[k.slice(2)] = "true";
      }
    }
  }
  return args;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function validateCell(
  cell: Partial<TreatyCell>,
  countryCodes: Set<string>,
  force: boolean,
): string[] {
  const errors: string[] = [];
  if (!cell.investor_country || !countryCodes.has(cell.investor_country)) {
    errors.push(`investor_country "${cell.investor_country}" not in COUNTRIES`);
  }
  if (!cell.payer_country || !countryCodes.has(cell.payer_country)) {
    errors.push(`payer_country "${cell.payer_country}" not in COUNTRIES`);
  }
  const r = cell.withholding_rate_pct;
  if (r === undefined || r === null || isNaN(Number(r)) || r < 0 || r > 100) {
    errors.push(`withholding_rate_pct "${r}" must be 0-100`);
  }
  if (!cell.treaty_reference || cell.treaty_reference.trim().length < 3) {
    errors.push(`treaty_reference required (e.g. "US-Germany Tax Treaty Art.10(2)(b)")`);
  }
  if (!cell.source_citation || cell.source_citation.trim().length < 10) {
    errors.push(`source_citation required (cite primary source: PwC/KPMG/IRS Pub 901/etc.)`);
  } else if (!APPROVED_SOURCES.some((re) => re.test(cell.source_citation!))) {
    if (!force) {
      errors.push(
        `source_citation does not match any approved-source pattern. Use --force to override. ` +
          `Approved: PwC, KPMG, IRS Pub 901, OECD, country tax authority (HMRC/ATO/etc.)`,
      );
    }
  }
  return errors;
}

function upsertCell(
  data: any,
  newCell: TreatyCell,
  force: boolean,
): "added" | "promoted" | "overwrote" | "blocked" {
  const idx = data.treaties.findIndex(
    (t: TreatyCell) =>
      t.investor_country === newCell.investor_country &&
      t.payer_country === newCell.payer_country,
  );
  if (idx === -1) {
    data.treaties.push(newCell);
    return "added";
  }
  const existing = data.treaties[idx] as TreatyCell;
  if (existing.state === "verified" && !force) {
    return "blocked";
  }
  const wasNeedsResearch = existing.state === "needs_research";
  data.treaties[idx] = newCell;
  return wasNeedsResearch ? "promoted" : "overwrote";
}

function processOne(
  data: any,
  countryCodes: Set<string>,
  args: { inv: string; pay: string; rate: number; ref: string; src: string; notes?: string },
  force: boolean,
): { ok: boolean; action?: string; errors?: string[] } {
  const cell: TreatyCell = {
    investor_country: args.inv.toUpperCase(),
    payer_country: args.pay.toUpperCase(),
    withholding_rate_pct: Number(args.rate),
    treaty_reference: args.ref,
    source_citation: args.src,
    state: "verified",
    last_verified: todayISO(),
    ...(args.notes ? { notes: args.notes } : {}),
  };
  const errors = validateCell(cell, countryCodes, force);
  if (errors.length) return { ok: false, errors };
  const action = upsertCell(data, cell, force);
  if (action === "blocked") {
    return {
      ok: false,
      errors: [
        `${cell.investor_country}→${cell.payer_country} already verified. Use --force to overwrite.`,
      ],
    };
  }
  return { ok: true, action };
}

function processBatch(filePath: string, data: any, countryCodes: Set<string>, force: boolean) {
  const lines = fs
    .readFileSync(filePath, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
  let added = 0,
    promoted = 0,
    overwrote = 0,
    failed = 0;
  for (const line of lines) {
    const parts = line.split("\t").map((p) => p.trim());
    if (parts.length < 5) {
      console.error(`✗ malformed line (need ≥5 TSV fields): ${line.slice(0, 80)}`);
      failed++;
      continue;
    }
    const [inv, pay, rate, ref, src, notes] = parts;
    const result = processOne(
      data,
      countryCodes,
      { inv, pay, rate: Number(rate), ref, src, notes },
      force,
    );
    if (!result.ok) {
      console.error(`✗ ${inv}→${pay}: ${result.errors!.join("; ")}`);
      failed++;
    } else {
      console.log(`✓ ${inv}→${pay} (${result.action})`);
      if (result.action === "added") added++;
      else if (result.action === "promoted") promoted++;
      else if (result.action === "overwrote") overwrote++;
    }
  }
  console.log(
    `\nBatch summary: ${added} added · ${promoted} promoted from needs_research · ${overwrote} overwrote · ${failed} failed`,
  );
  return failed === 0;
}

function main(): void {
  const args = parseArgs();
  const force = args.force === "true";
  const data = loadData();
  const countryCodes = new Set<string>(data.countries.map((c: any) => c.code));

  if (args.batch) {
    const ok = processBatch(args.batch, data, countryCodes, force);
    if (!ok) {
      console.error("Batch had failures; partial writes still applied. Review log above.");
    }
    // Sort + save regardless (so partial wins persist)
    data.treaties.sort((a: TreatyCell, b: TreatyCell) =>
      a.investor_country !== b.investor_country
        ? a.investor_country.localeCompare(b.investor_country)
        : a.payer_country.localeCompare(b.payer_country),
    );
    data._meta.last_verified = todayISO();
    saveData(data);
    process.exit(ok ? 0 : 1);
    return;
  }

  if (!args.inv || !args.pay || args.rate === undefined || !args.ref || !args.src) {
    console.error(
      "Usage: npm run dt:add -- --inv US --pay DE --rate 15 \\\n" +
        '  --ref "US-Germany Tax Treaty Art.10(2)(b)" \\\n' +
        '  --src "PwC Worldwide Tax Summaries: Germany — Withholding taxes on dividends"\\\n' +
        "  [--notes \"Optional context\"] [--force]\n\n" +
        "Or batch: npm run dt:add -- --batch path/to/cells.tsv",
    );
    process.exit(1);
  }
  const result = processOne(
    data,
    countryCodes,
    {
      inv: args.inv,
      pay: args.pay,
      rate: Number(args.rate),
      ref: args.ref,
      src: args.src,
      notes: args.notes,
    },
    force,
  );
  if (!result.ok) {
    for (const e of result.errors!) console.error(`✗ ${e}`);
    process.exit(1);
  }
  data.treaties.sort((a: TreatyCell, b: TreatyCell) =>
    a.investor_country !== b.investor_country
      ? a.investor_country.localeCompare(b.investor_country)
      : a.payer_country.localeCompare(b.payer_country),
  );
  data._meta.last_verified = todayISO();
  saveData(data);

  // Summary
  const verified = data.treaties.filter((t: TreatyCell) => t.state === "verified").length;
  const total = data.treaties.length;
  console.log(
    `✓ ${args.inv.toUpperCase()}→${args.pay.toUpperCase()} (${result.action}). ` +
      `Coverage: ${verified}/${total} (${((100 * verified) / total).toFixed(1)}%).`,
  );
}

main();
