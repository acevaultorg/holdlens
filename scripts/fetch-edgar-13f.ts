#!/usr/bin/env npx tsx
/**
 * EDGAR 13F Parser — fetches 13F-HR filings from SEC EDGAR for all tracked
 * superinvestors and outputs structured JSON for HoldLens.
 *
 * Usage:  npx tsx scripts/fetch-edgar-13f.ts
 * Output: data/edgar-holdings.json, data/edgar-moves.json
 *
 * SEC EDGAR rate limit: 10 requests/second. We throttle to 5/sec for safety.
 * Required: User-Agent header with contact info per SEC fair access policy.
 */

import { writeFileSync, readFileSync, existsSync } from "fs";
import { resolve } from "path";
// v1.19 — import MANAGERS for slug-drift validation. lib/managers.ts is a
// clean TS module with no browser dependencies so tsx picks it up cleanly.
import { MANAGERS } from "../lib/managers";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const USER_AGENT = "HoldLens/0.2 (contact@acevault.org)";
const RATE_LIMIT_MS = 220; // ~4.5 req/sec, well within SEC 10/sec limit
const MAX_QUARTERS = 8; // How many quarters back to fetch
const DATA_DIR = resolve(import.meta.dirname ?? __dirname, "../data");

// CIK map for all 30 tracked managers. Padded to 10 digits for EDGAR API.
// v1.14 — CIK map audit. Nine entries were pointing at the wrong SEC CIK
// (unrelated entities, old entities the manager no longer uses, or LPs that
// stopped filing years ago), so the fetcher got "no 13F-HR filings" for 9 of
// 30 managers. Verified against SEC EDGAR full-text search and fund DB; every
// OLD value documented below for audit trail. Operator directive:
// "0% placeholder data on the whole site" — this was not fake data but it WAS
// undelivered data. Fix unlocks ~3,500 new real moves across 9 managers.
const CIK_MAP: Record<string, string> = {
  "warren-buffett":        "0001067983", // Berkshire Hathaway
  "bill-ackman":           "0001336528", // Pershing Square
  "carl-icahn":            "0000921669", // Icahn Capital
  "david-einhorn":         "0001079114", // Greenlight Capital
  "seth-klarman":          "0001061768", // Baupost Group
  "joel-greenblatt":       "0001167557", // Gotham Asset Mgmt
  "michael-burry":         "0001649339", // Scion Asset Mgmt
  "stanley-druckenmiller": "0001536411", // Duquesne Family Office
  "li-lu":                 "0001709323", // Himalaya Capital
  "monish-pabrai":         "0001549575", // Dalal Street LLC (v1.14 — was 0001173334 "PABRAI MOHNISH" personal CIK with no filings since 2012; Pabrai now files under Dalal Street)
  "howard-marks":          "0000949509", // Oaktree Capital
  "prem-watsa":            "0000915191", // Fairfax Financial (Hamblin Watsa)
  "bill-nygren":           "0000813917", // Harris Associates LP (v1.14 — was 0000872323 "HARRIS ASSOCIATES INVESTMENT TRUST", unrelated mutual fund registrant)
  "glenn-greenberg":       "0001553733", // Brave Warrior Advisors LLC (v1.14 — was 0001548914 "GAVEKAL ASIAN OPPORTUNITIES UCITS FUND", unrelated)
  "david-tepper":          "0001656456", // Appaloosa LP (v1.14 — was 0001082126 "NORWEST ASSET SEC CORP", unrelated; Tepper reorganized from Appaloosa Management LP → Appaloosa LP in 2016)
  "chase-coleman":         "0001167483", // Tiger Global
  "chris-hohn":            "0001647251", // TCI Fund Management
  "chuck-akre":            "0001112520", // Akre Capital Management
  "andreas-halvorsen":     "0001103804", // Viking Global
  "lee-ainslie":           "0001040273", // Maverick Capital
  "stephen-mandel":        "0001061165", // Lone Pine Capital
  "terry-smith":           "0001569205", // Fundsmith
  "john-armitage":         "0001105838", // Egerton Capital
  "david-rolfe":           "0000859804", // Wedgewood Partners Inc (v1.14 — was 0000860489 "CENTRAL & EASTERN EUROPE FUND", unrelated)
  "francois-rochon":       "0001641864", // Giverny Capital Inc (v1.14 — was 0001635891, empty registrant)
  "dev-kantesaria":        "0001697868", // Valley Forge Capital
  "jeffrey-ubben":         "0001817187", // Inclusive Capital Partners LP (v1.14 — was 0001400940, empty registrant; Ubben founded Inclusive in 2020 after leaving ValueAct)
  "tom-slater":            "0001088875", // Baillie Gifford & Co (v1.14 — was 0001596110 "VOIT 50/50 BALANCED", unrelated; Slater co-manages Baillie Gifford's Scottish Mortgage Trust)
  "william-von-mueffling": "0001279936", // Cantillon Capital Management LLC (v1.14 — was 0001359419 "NEWPORT MANOR LLC", unrelated. v1.17 — also renamed slug from bill-von-mueffling to william-von-mueffling to match lib/managers.ts; EDGAR rows previously wrote under the wrong key and never joined to the manager entry)
  "polen-capital":         "0001034524", // Polen Capital Management
};

// v1.19 — slug-drift guard. This is the hygiene fix for the root cause of
// the v1.17 william-von-mueffling bug: CIK_MAP and lib/managers.ts maintained
// parallel slug spaces and drifted silently. We now assert on boot that every
// CIK_MAP key is also a MANAGERS[].slug, and every MANAGERS slug is covered
// by CIK_MAP (or flagged as intentionally missing). The build fails fast with
// a specific diff if anyone introduces drift.
(function validateSlugAlignment() {
  const managerSlugs = new Set(MANAGERS.map((m) => m.slug));
  const cikSlugs = new Set(Object.keys(CIK_MAP));

  const inCikNotManagers = [...cikSlugs].filter((s) => !managerSlugs.has(s));
  const inManagersNotCik = [...managerSlugs].filter((s) => !cikSlugs.has(s));

  const errors: string[] = [];
  if (inCikNotManagers.length > 0) {
    errors.push(
      `CIK_MAP has slugs not in MANAGERS[].slug — EDGAR rows would never join:\n  ${inCikNotManagers.join("\n  ")}\n  (Fix: rename CIK_MAP key to match MANAGERS, or add MANAGERS entry.)`
    );
  }
  if (inManagersNotCik.length > 0) {
    errors.push(
      `MANAGERS has slugs not in CIK_MAP — manager has no EDGAR data source:\n  ${inManagersNotCik.join("\n  ")}\n  (Fix: add SEC CIK to CIK_MAP, or confirm manager files <$100M and document as curated-only.)`
    );
  }
  if (errors.length > 0) {
    console.error("\n❌ SLUG DRIFT DETECTED — see rules/slug-alignment below:\n");
    console.error(errors.join("\n\n"));
    console.error(
      "\nThis guard was added in v1.19 to prevent a repeat of the v1.17 " +
        "william-von-mueffling silent-miss (EDGAR rows written under the " +
        "wrong slug and never rendered on the manager's page).\n"
    );
    process.exit(1);
  }
  console.log(`✓ Slug alignment check passed — ${cikSlugs.size}/${managerSlugs.size} managers mapped`);
})();

// CUSIP → ticker mapping for the ~200 most common institutional holdings.
// Built from the project's existing ticker coverage + major S&P 500 names.
const CUSIP_TO_TICKER: Record<string, string> = {
  "037833100": "AAPL",   // Apple
  "594918104": "MSFT",   // Microsoft
  "02079K107": "GOOG",   // Alphabet C
  "02079K305": "GOOGL",  // Alphabet A
  "30303M102": "META",   // Meta Platforms
  "67066G104": "NVDA",   // NVIDIA
  "023135106": "AMZN",   // Amazon
  "025816109": "AXP",    // American Express
  "060505104": "BAC",    // Bank of America
  "46625H100": "JPM",    // JPMorgan Chase
  "191216100": "KO",     // Coca-Cola
  "169656105": "CMG",    // Chipotle
  "654106103": "NKE",    // Nike
  "43300A203": "HLT",    // Hilton
  "74837Y101": "QSR",    // Restaurant Brands
  "166764100": "CVX",    // Chevron
  "674599105": "OXY",    // Occidental Petroleum
  "615369105": "MCO",    // Moody's
  "500754106": "KHC",    // Kraft Heinz
  "215502100": "CB",     // Chubb
  "23918K108": "DVA",    // DaVita
  "43283X105": "HHH",    // Howard Hughes
  "11135F101": "BN",     // Brookfield
  "13645T100": "CP",     // Canadian Pacific KC
  "88160R101": "TSLA",   // Tesla
  "92826C839": "V",      // Visa
  "22160K105": "MA",     // Mastercard
  "478160104": "JNJ",    // J&J
  "742718109": "PG",     // Procter & Gamble
  "91324P102": "UNH",    // UnitedHealth
  "260543103": "DIS",    // Disney
  "458140100": "INTC",   // Intel
  "007903107": "AMD",    // AMD
  "035420103": "ANSS",   // Ansys
  "585055106": "MCD",    // McDonald's
  "11133T103": "BRKB",   // Berkshire B (unusual — nested)
  "084670702": "BRK.B",  // Berkshire B alt CUSIP
  "00287Y109": "ABBV",   // AbbVie
  "20030N101": "CMCSA",  // Comcast
  "254687106": "DHR",    // Danaher
  "548661107": "LOW",    // Lowe's
  "278865100": "EBAY",   // eBay
  "02209S103": "ATVI",   // Activision
  "464287457": "ISRG",   // Intuitive Surgical
  "808513105": "SCHW",   // Schwab
  "29786A106": "EQIX",   // Equinix
  "14149Y108": "CARR",   // Carrier Global
  "05722G100": "BABA",   // Alibaba
  "369604103": "GE",     // GE Aerospace
  "718172109": "PFE",    // Pfizer
  "92343V104": "VZ",     // Verizon
  "87612E106": "TGT",    // Target
  "931142103": "WMT",    // Walmart
  "903293405": "UPS",    // UPS
  "172967424": "C",      // Citigroup
  "808524102": "SCHD",   // Schwab div ETF (ignore if found)
  "46625H100": "JPM",
  "053332102": "AVGO",   // Broadcom
  "882508104": "TXN",    // Texas Instruments
  "031162100": "AMGN",   // Amgen
  "69331C108": "PDD",    // PDD Holdings
  "44919P508": "HUBS",   // HubSpot
  "02079K107": "GOOG",
  "00846U101": "AFRM",   // Affirm
  "92553P201": "VICI",   // VICI Properties
  "871829107": "SYF",    // Synchrony
  "891906109": "TOL",    // Toll Brothers
  "02313V103": "ALLY",   // Ally Financial
  "519833100": "LBTYA",  // Liberty Global A
  "519833308": "LBTYB",  // Liberty Global B
  "50540R409": "LBRDA",  // Liberty Broadband A
  "552953101": "MKTX",   // MarketAxess
  "543495102": "LNC",    // Lincoln National
  "31620M106": "FNF",    // Fidelity National Financial
  "20825C104": "COP",    // ConocoPhillips
  "92556V106": "VRSN",   // VeriSign
  "30063P105": "EXPE",   // Expedia
  "49338L103": "KEY",    // KeyCorp
  "87170N102": "SYY",    // Sysco
  "143130102": "CARG",   // CarGurus
  "171340102": "CHK",    // Chesapeake Energy
  "22002T108": "CORT",   // Corcept Therapeutics
  "88706T108": "TTWO",   // Take-Two Interactive
  "91911K102": "VALE",   // Vale
  "902973304": "USB",    // US Bancorp
  "26614N102": "DKNG",   // DraftKings
  "45778Q107": "INSP",   // Inspire Medical
  "855244109": "SBUX",   // Starbucks
  "92345Y106": "VRSK",   // Verisk
  "06738E204": "BKNG",   // Booking Holdings
  "654106103": "NKE",
  "302520101": "FMC",    // FMC Corp
  "824348106": "SHW",    // Sherwin-Williams
  "125523100": "CVI",    // CVR Energy
  "927804102": "VST",    // Vistra
  "337738108": "FE",     // FirstEnergy
  "46090E103": "INTU",   // Intuit
  "78409V104": "SPY",    // S&P ETF (skip)
  "464287408": "IVV",    // iShares S&P ETF (skip)
  "922908363": "VTI",    // Vanguard Total Mkt (skip)
  "78462F103": "SPG",    // Simon Property Group
  "928563402": "VMC",    // Vulcan Materials
  "68389X105": "ORCL",   // Oracle
  "742718109": "PG",
  "02209S103": "ATVI",
  "12572Q105": "CRM",    // Salesforce
  "29379V103": "ENPH",   // Enphase
  "44919P508": "HUBS",
  "247361702": "DELL",   // Dell Technologies
  "460146103": "IRTC",   // iRhythm Technologies
  // Top 50 unmapped from first run — common large-cap institutional holdings
  "57636Q104": "MA",     // Mastercard
  "98138H101": "WDAY",   // Workday
  "90353T100": "UBER",   // Uber Technologies
  "50155Q100": "KD",     // Kyndryl
  "009066101": "ABNB",   // Airbnb
  "532457108": "LLY",    // Eli Lilly
  "L8681T102": "SPOT",   // Spotify
  "81762P102": "NOW",    // ServiceNow
  "874039100": "TSM",    // TSMC
  "79466L302": "CRM",    // Salesforce (new CUSIP)
  "64110L106": "NFLX",   // Netflix
  "H1467J104": "CB",     // Chubb (foreign CUSIP)
  "37940X102": "GPN",    // Global Payments
  "89417E109": "TRV",    // Travelers
  "461202103": "INTU",   // Intuit (alt CUSIP)
  "392709101": "GRBK",   // Green Brick Partners
  "10922N103": "BHF",    // Brighthouse Financial
  "G48833118": "WFRD",   // Weatherford
  "70450Y103": "PYPL",   // PayPal
  "14040H105": "COF",    // Capital One
  "58933Y105": "MRK",    // Merck
  "09857L108": "BKNG",   // Booking Holdings (alt CUSIP)
  "595112103": "MU",     // Micron
  "235851102": "DHR",    // Danaher (alt CUSIP)
  "086516101": "BBY",    // Best Buy
  "020002101": "ALL",    // Allstate
  "31620R303": "FNF",    // Fidelity Natl Financial (alt)
  "038222105": "AMAT",   // Applied Materials
  "717081103": "PFE",    // Pfizer (alt CUSIP)
  "37045V100": "GM",     // General Motors
  "713448108": "PEP",    // PepsiCo
  "36828A101": "GEV",    // GE Vernova
  "G87110105": "FTI",    // TechnipFMC
  "98980G102": "ZS",     // Zscaler
  "03027X100": "AMT",    // American Tower
  "126650100": "CVS",    // CVS Health
  "617446448": "MS",     // Morgan Stanley
  "88033G407": "THC",    // Tenet Healthcare
  "G5509L101": "LIVN",   // LivaNova
  "76118Y104": "REZI",   // Resideo
  "58155Q103": "MCK",    // McKesson
  "G3223R108": "EG",     // Everest Group
  "228368106": "CCK",    // Crown Holdings
  "G5960L103": "MDT",    // Medtronic
  "743315103": "PGR",    // Progressive
  "747525103": "QCOM",   // Qualcomm
  "03831W108": "APP",    // AppLovin
  "92343E102": "VRSN",   // VeriSign (alt CUSIP)
  "46982L108": "J",      // Jacobs Solutions
  "15135B101": "CNC",    // Centene
  "11135F101": "BN",     // Brookfield
  "43300A203": "HLT",    // Hilton (alt)
  "74837Y101": "QSR",    // Restaurant Brands (alt)
  "43283X105": "HHH",    // Howard Hughes (alt)
  "00206R102": "T",      // AT&T
  "002824100": "ABT",    // Abbott Labs
  "46120E602": "IONQ",   // IonQ
  "49271V100": "KEYS",   // Keysight
  "92532F100": "VRTX",   // Vertex Pharma
  "458140100": "INTC",   // Intel (dup for safety)
  "91913Y100": "VALE",   // Vale (alt)
  "29444U700": "EQIX",   // Equinix (alt)
  "Y8162K157": "SEA",    // Sea Limited
  "87612E106": "TGT",    // Target
  "82968B103": "SHOP",   // Shopify
  "46284V101": "ISRG",   // Intuitive Surgical
  "22160K105": "MA",     // Mastercard (alt CUSIP)
  // Ackman portfolio CUSIPs
  "11271J107": "BN",     // Brookfield Corp (alt CUSIP)
  "76131D103": "QSR",    // Restaurant Brands Intl (alt CUSIP)
  "44267T102": "HHH",    // Howard Hughes Holdings (alt CUSIP)
  "812215200": "SEA",    // Seaport Entertainment
  "42806J700": "HTZ",    // Hertz Global
  // Buffett portfolio CUSIPs
  "501044101": "KR",     // Kroger
  "829933100": "SIRI",   // Sirius XM
  "21036P108": "STZ",    // Constellation Brands
  "02005N100": "ALLY",   // Ally Financial (alt CUSIP)
  "25754A201": "DPZ",    // Domino's Pizza
  "530909100": "LLYVK",  // Liberty Live Holdings
  "526057104": "LEN",    // Lennar
  "546347105": "LPX",    // Louisiana-Pacific
  "16119P108": "CHTR",   // Charter Communications
  "422806208": "HEI",    // HEICO
  "512816109": "LAMR",   // Lamar Advertising
  "531229755": "LSXMA",  // Liberty Media
  "650111107": "NYT",    // New York Times
  "047726302": "BATRA",  // Atlanta Braves Holdings
  "25243Q205": "DEO",    // Diageo
  "47233W109": "JEF",    // Jefferies Financial
  "G0176J109": "ALLE",   // Allegion
  "G9001E102": "LILAK",  // Liberty Latin America
  // More common institutional holdings
  "78464A714": "SPGI",   // S&P Global
  "00724F101": "ADBE",   // Adobe
  "92826C839": "V",      // Visa (dup for safety)
  "22282X105": "COST",   // Costco
  "02079K305": "GOOGL",  // Alphabet A
  "88579Y101": "MMM",    // 3M
  "48203R104": "JNPR",   // Juniper
  "49456B101": "KLAC",   // KLA Corp
  "30231G102": "XOM",    // Exxon Mobil
  "78462F103": "SPG",    // Simon Property
  "844895102": "SWK",    // Stanley Black Decker
  "N49456101": "MELI",   // MercadoLibre
  "911312106": "UNP",    // Union Pacific
  "38141G104": "GS",     // Goldman Sachs
  "60937P106": "MNST",   // Monster Beverage
  "87265K103": "TJX",    // TJX Companies
  "40412C101": "HCA",    // HCA Healthcare
  "302130109": "XYL",    // Xylem
  "98956P102": "ZM",     // Zoom
  "57667L107": "MSTR",   // MicroStrategy
  "90384S303": "ULTA",   // Ulta Beauty
  "427866108": "HIMS",   // Hims & Hers
  "45168D104": "IBKR",   // Interactive Brokers
  "29786A106": "EQIX",   // Equinix
};

// ETF/index CUSIPs to skip (not individual stocks)
const SKIP_CUSIPS = new Set([
  "78409V104", // SPY
  "464287408", // IVV
  "922908363", // VTI
  "808524102", // SCHD
]);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EdgarFiling {
  accessionNumber: string;
  filingDate: string;
  reportDate: string; // quarter-end date
  form: string;
}

interface EdgarHolding {
  cusip: string;
  issuerName: string;
  titleOfClass: string;
  value: number;       // in thousands
  shares: number;
  investmentDiscretion: string;
}

interface ParsedFiling {
  managerSlug: string;
  cik: string;
  filingDate: string;
  reportDate: string;
  quarter: string;
  holdings: EdgarHolding[];
}

interface OutputHolding {
  ticker: string;
  name: string;
  cusip: string;
  shares: number;
  valueMn: number;      // millions
  pctPortfolio: number;
}

interface OutputFiling {
  managerSlug: string;
  cik: string;
  quarter: string;
  filingDate: string;
  reportDate: string;
  totalValueMn: number;
  holdingCount: number;
  holdings: OutputHolding[];
}

interface OutputMove {
  managerSlug: string;
  quarter: string;
  filedAt: string;
  ticker: string;
  name: string;
  action: "new" | "add" | "trim" | "exit";
  deltaPct: number;
  shareChange: number;
  portfolioImpactPct: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT, Accept: "application/json,text/xml,*/*" },
      });
      if (res.status === 429) {
        console.warn(`  Rate limited, waiting ${(i + 1) * 2}s...`);
        await sleep((i + 1) * 2000);
        continue;
      }
      if (!res.ok && res.status !== 404) {
        console.warn(`  HTTP ${res.status} for ${url}`);
        if (i < retries - 1) await sleep(1000);
        continue;
      }
      return res;
    } catch (err) {
      console.warn(`  Fetch error: ${(err as Error).message}`);
      if (i < retries - 1) await sleep(1000);
    }
  }
  throw new Error(`Failed after ${retries} retries: ${url}`);
}

function reportDateToQuarter(reportDate: string): string {
  const d = new Date(reportDate);
  const m = d.getUTCMonth() + 1; // 1-12
  const y = d.getUTCFullYear();
  if (m <= 3) return `${y}-Q1`;
  if (m <= 6) return `${y}-Q2`;
  if (m <= 9) return `${y}-Q3`;
  return `${y}-Q4`;
}

function cusipToTicker(cusip: string, issuerName: string): string {
  const c6 = cusip.substring(0, 6); // 6-digit issuer
  // Try exact match first
  if (CUSIP_TO_TICKER[cusip]) return CUSIP_TO_TICKER[cusip];
  // Try 6-char prefix match (different share classes)
  for (const [k, v] of Object.entries(CUSIP_TO_TICKER)) {
    if (k.substring(0, 6) === c6) return v;
  }
  // Return cleaned issuer name as fallback
  return issuerName
    .replace(/\b(Inc|Corp|Ltd|PLC|Co|Holdings|Group|NV|SA|SE|AG|LP|LLC|Class [A-Z])\b\.?/gi, "")
    .trim()
    .toUpperCase()
    .substring(0, 10);
}

// ---------------------------------------------------------------------------
// EDGAR API
// ---------------------------------------------------------------------------

async function getFilings(cik: string): Promise<EdgarFiling[]> {
  const url = `https://data.sec.gov/submissions/CIK${cik}.json`;
  const res = await fetchWithRetry(url);
  if (!res.ok) return [];
  const data = await res.json() as any;

  const filings: EdgarFiling[] = [];
  const recent = data.filings?.recent;
  if (!recent) return [];

  for (let i = 0; i < (recent.form?.length ?? 0); i++) {
    if (recent.form[i] === "13F-HR") {
      filings.push({
        accessionNumber: recent.accessionNumber[i],
        filingDate: recent.filingDate[i],
        reportDate: recent.reportDate[i],
        form: recent.form[i],
      });
    }
  }

  return filings.slice(0, MAX_QUARTERS);
}

async function getInfoTableUrl(cik: string, accession: string): Promise<string | null> {
  const accNoDashes = accession.replace(/-/g, "");
  const cikNum = cik.replace(/^0+/, "");
  const base = `https://www.sec.gov/Archives/edgar/data/${cikNum}/${accNoDashes}`;
  const indexUrl = `${base}/index.json`;
  await sleep(RATE_LIMIT_MS);
  const res = await fetchWithRetry(indexUrl);
  if (!res.ok) return null;
  const data = await res.json() as any;

  const items: { name: string; size?: number }[] = data.directory?.item ?? [];

  // Priority 1: XML file with "infotable" in name
  const infoFile = items.find((f) =>
    /infotable/i.test(f.name) && /\.xml$/i.test(f.name)
  );
  if (infoFile) return `${base}/${infoFile.name}`;

  // Priority 2: XML file with "table" in name
  const tableFile = items.find((f) =>
    /table/i.test(f.name) && /\.xml$/i.test(f.name)
  );
  if (tableFile) return `${base}/${tableFile.name}`;

  // Priority 3: XML file with "13f" in name (some filers use 13f_holdings.xml)
  const f13File = items.find((f) =>
    /13f/i.test(f.name) && /\.xml$/i.test(f.name)
  );
  if (f13File) return `${base}/${f13File.name}`;

  // Priority 4: Any XML file that's large enough to be an info table (>1KB)
  // and not the primary document or R files
  const xmlFiles = items.filter((f) =>
    /\.xml$/i.test(f.name) &&
    !/primary/i.test(f.name) &&
    !/^R\d+\.xml$/i.test(f.name) &&
    !/FilingSummary/i.test(f.name) &&
    (f.size ?? 0) > 1000
  );
  if (xmlFiles.length === 1) return `${base}/${xmlFiles[0].name}`;
  // If multiple XML candidates, pick the largest
  if (xmlFiles.length > 1) {
    xmlFiles.sort((a, b) => (b.size ?? 0) - (a.size ?? 0));
    return `${base}/${xmlFiles[0].name}`;
  }

  return null;
}

function parseInfoTableXml(xml: string): EdgarHolding[] {
  const holdings: EdgarHolding[] = [];

  // Match each <infoTable> entry (case-insensitive for namespace variants)
  const entryRegex = /<(?:ns1:)?infoTable>([\s\S]*?)<\/(?:ns1:)?infoTable>/gi;
  let match: RegExpExecArray | null;

  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1];

    const getTag = (tag: string): string => {
      const r = new RegExp(`<(?:ns1:)?${tag}>([^<]*)<\/(?:ns1:)?${tag}>`, "i");
      const m = entry.match(r);
      return m ? m[1].trim() : "";
    };

    const cusip = getTag("cusip");
    if (!cusip || SKIP_CUSIPS.has(cusip)) continue;

    holdings.push({
      cusip,
      issuerName: getTag("nameOfIssuer"),
      titleOfClass: getTag("titleOfClass"),
      value: parseInt(getTag("value")) || 0,
      shares: parseInt(getTag("sshPrnamt")) || 0,
      investmentDiscretion: getTag("investmentDiscretion"),
    });
  }

  return holdings;
}

async function fetchFiling(
  slug: string,
  cik: string,
  filing: EdgarFiling
): Promise<ParsedFiling | null> {
  const infoUrl = await getInfoTableUrl(cik, filing.accessionNumber);
  if (!infoUrl) {
    console.warn(`  No info table found for ${slug} ${filing.accessionNumber}`);
    return null;
  }

  await sleep(RATE_LIMIT_MS);
  const res = await fetchWithRetry(infoUrl);
  if (!res.ok) return null;
  const xml = await res.text();
  const holdings = parseInfoTableXml(xml);

  return {
    managerSlug: slug,
    cik,
    filingDate: filing.filingDate,
    reportDate: filing.reportDate,
    quarter: reportDateToQuarter(filing.reportDate),
    holdings,
  };
}

// ---------------------------------------------------------------------------
// Move computation
// ---------------------------------------------------------------------------

function computeMoves(
  current: OutputFiling,
  previous: OutputFiling | undefined
): OutputMove[] {
  if (!previous) return []; // Can't compute moves for earliest quarter

  const prevMap = new Map<string, OutputHolding>();
  for (const h of previous.holdings) {
    prevMap.set(h.ticker, h);
  }

  const moves: OutputMove[] = [];

  // Check current holdings for new/add
  for (const h of current.holdings) {
    const prev = prevMap.get(h.ticker);
    if (!prev) {
      // NEW position
      moves.push({
        managerSlug: current.managerSlug,
        quarter: current.quarter,
        filedAt: current.filingDate,
        ticker: h.ticker,
        name: h.name,
        action: "new",
        deltaPct: 100,
        shareChange: h.shares,
        portfolioImpactPct: h.pctPortfolio,
      });
    } else {
      const delta = h.shares - prev.shares;
      const deltaPct = prev.shares > 0 ? Math.round((delta / prev.shares) * 100) : 0;
      // Only record if significant change (>5%)
      if (Math.abs(deltaPct) > 5) {
        moves.push({
          managerSlug: current.managerSlug,
          quarter: current.quarter,
          filedAt: current.filingDate,
          ticker: h.ticker,
          name: h.name,
          action: deltaPct > 0 ? "add" : "trim",
          deltaPct,
          shareChange: delta,
          portfolioImpactPct: h.pctPortfolio,
        });
      }
    }
    prevMap.delete(h.ticker);
  }

  // Remaining in prevMap = exits
  for (const [ticker, prev] of prevMap) {
    moves.push({
      managerSlug: current.managerSlug,
      quarter: current.quarter,
      filedAt: current.filingDate,
      ticker,
      name: prev.name,
      action: "exit",
      deltaPct: -100,
      shareChange: -prev.shares,
      portfolioImpactPct: 0,
    });
  }

  return moves;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("EDGAR 13F Parser — HoldLens v0.2");
  console.log(`Fetching filings for ${Object.keys(CIK_MAP).length} managers...\n`);

  const allFilings: OutputFiling[] = [];
  const allMoves: OutputMove[] = [];
  const errors: string[] = [];

  for (const [slug, cik] of Object.entries(CIK_MAP)) {
    console.log(`→ ${slug} (CIK ${cik})`);

    try {
      const filingList = await getFilings(cik);
      await sleep(RATE_LIMIT_MS);

      if (filingList.length === 0) {
        console.log(`  No 13F-HR filings found`);
        errors.push(`${slug}: no 13F-HR filings`);
        continue;
      }

      console.log(`  Found ${filingList.length} recent 13F-HR filings`);

      const parsed: ParsedFiling[] = [];
      for (const f of filingList) {
        const p = await fetchFiling(slug, cik, f);
        if (p) parsed.push(p);
      }

      // Convert to output format
      const outputFilings: OutputFiling[] = [];
      for (const p of parsed) {
        const totalValue = p.holdings.reduce((s, h) => s + h.value, 0); // in thousands
        // Consolidate duplicate tickers (multiple share classes, e.g. GOOG + GOOGL)
      const tickerMap = new Map<string, { name: string; cusip: string; shares: number; value: number }>();
      for (const h of p.holdings) {
        const ticker = cusipToTicker(h.cusip, h.issuerName);
        const existing = tickerMap.get(ticker);
        if (existing) {
          existing.shares += h.shares;
          existing.value += h.value;
        } else {
          tickerMap.set(ticker, { name: h.issuerName, cusip: h.cusip, shares: h.shares, value: h.value });
        }
      }

      const holdings: OutputHolding[] = [...tickerMap.entries()]
        .map(([ticker, h]) => ({
          ticker,
          name: h.name,
          cusip: h.cusip,
          shares: h.shares,
          valueMn: Math.round(h.value / 10) / 100, // thousands → millions (2 decimals)
          pctPortfolio: totalValue > 0 ? Math.round((h.value / totalValue) * 1000) / 10 : 0,
        }))
        .sort((a, b) => b.pctPortfolio - a.pctPortfolio);

        outputFilings.push({
          managerSlug: slug,
          cik,
          quarter: p.quarter,
          filingDate: p.filingDate,
          reportDate: p.reportDate,
          totalValueMn: Math.round(totalValue / 10) / 100,
          holdingCount: holdings.length,
          holdings,
        });
      }

      // Sort by quarter descending for move computation
      outputFilings.sort((a, b) => b.quarter.localeCompare(a.quarter));

      // Compute moves
      for (let i = 0; i < outputFilings.length - 1; i++) {
        const moves = computeMoves(outputFilings[i], outputFilings[i + 1]);
        allMoves.push(...moves);
      }

      allFilings.push(...outputFilings);
      console.log(
        `  ${outputFilings.length} quarters parsed, ${outputFilings.reduce((s, f) => s + f.holdingCount, 0)} total holdings`
      );
    } catch (err) {
      console.error(`  ERROR: ${(err as Error).message}`);
      errors.push(`${slug}: ${(err as Error).message}`);
    }
  }

  // Sort moves by quarter desc, then manager
  allMoves.sort((a, b) => {
    const qc = b.quarter.localeCompare(a.quarter);
    if (qc !== 0) return qc;
    return a.managerSlug.localeCompare(b.managerSlug);
  });

  // Write outputs
  const holdingsPath = resolve(DATA_DIR, "edgar-holdings.json");
  const movesPath = resolve(DATA_DIR, "edgar-moves.json");
  const metaPath = resolve(DATA_DIR, "edgar-meta.json");

  writeFileSync(holdingsPath, JSON.stringify(allFilings, null, 2));
  writeFileSync(movesPath, JSON.stringify(allMoves, null, 2));
  writeFileSync(
    metaPath,
    JSON.stringify(
      {
        fetchedAt: new Date().toISOString(),
        managersTotal: Object.keys(CIK_MAP).length,
        managersSuccess: allFilings.length > 0
          ? new Set(allFilings.map((f) => f.managerSlug)).size
          : 0,
        filingsTotal: allFilings.length,
        movesTotal: allMoves.length,
        quartersSpanned: [...new Set(allFilings.map((f) => f.quarter))].sort().reverse(),
        errors,
        unmappedCusips: getUnmappedCusips(allFilings),
      },
      null,
      2
    )
  );

  console.log(`\n✅ Done.`);
  console.log(`   Holdings: ${holdingsPath} (${allFilings.length} filings)`);
  console.log(`   Moves:    ${movesPath} (${allMoves.length} moves)`);
  console.log(`   Meta:     ${metaPath}`);
  if (errors.length > 0) {
    console.log(`   ⚠ ${errors.length} errors — see edgar-meta.json`);
  }
}

function getUnmappedCusips(filings: OutputFiling[]): string[] {
  const unmapped = new Set<string>();
  for (const f of filings) {
    for (const h of f.holdings) {
      // If ticker looks like a cleaned issuer name (all caps, > 4 chars, has spaces)
      if (h.ticker.length > 5 || h.ticker.includes(" ") || /[^A-Z.]/.test(h.ticker)) {
        unmapped.add(`${h.cusip}=${h.name}`);
      }
    }
  }
  return [...unmapped].sort();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
