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
  // v1.35 — top-60 most-seen unmapped issuers from fleet 13F filings (2026-04-17 audit).
  // Each row maps a real CUSIP that was falling through to cleaned-issuer-name fallback,
  // hiding genuine positions across hundreds of manager-quarters.
  "N07059210": "ASML",   // ASML Holding
  "92840M102": "VST",    // Vistra Corp
  "22160N109": "CSGP",   // CoStar Group
  "G3643J108": "FLUT",   // Flutter Entertainment
  "98978V103": "ZTS",    // Zoetis
  "47215P106": "JD",     // JD.com
  "883556102": "TMO",    // Thermo Fisher
  "03769M106": "APO",    // Apollo Global Mgmt
  "48251W104": "KKR",    // KKR & Co
  "670100205": "NVO",    // Novo-Nordisk
  "G6683N103": "NU",     // Nu Holdings
  "217204106": "CPRT",   // Copart
  "45866F104": "ICE",    // Intercontinental Exchange
  "10806X102": "BBIO",   // BridgeBio Pharma
  "294429105": "EFX",    // Equifax
  "40415F101": "HDB",    // HDFC Bank
  "13646K108": "CP",     // Canadian Pacific Kansas City
  "78463V107": "GLD",    // SPDR Gold Trust
  "31488V107": "FERG",   // Ferguson
  "512807306": "LRCX",   // Lam Research
  "032654105": "ADI",    // Analog Devices
  "464288752": "IVV",    // iShares Core S&P 500 ETF
  "67103H107": "ORLY",   // O'Reilly Automotive
  "12008R107": "BLDR",   // Builders FirstSource
  "366505105": "GTX",    // Garrett Motion
  "538034109": "LYV",    // Live Nation Entertainment
  "50212V100": "LPLA",   // LPL Financial
  "679580100": "ODFL",   // Old Dominion Freight Line
  "70432V102": "PAYC",   // Paycom Software
  "G61188101": "LBTYK",  // Liberty Global (C shares)
  "219948106": "CPAY",   // Corpay (fka FleetCor)
  "01609W102": "BABA",   // Alibaba (alt CUSIP)
  "146869102": "CVNA",   // Carvana
  "12510Q100": "CCCS",   // CCC Intelligent Solutions
  "74758T303": "QLYS",   // Qualys
  "87422Q109": "TLN",    // Talen Energy
  "872590104": "TMUS",   // T-Mobile US
  "G96629103": "WTW",    // Willis Towers Watson
  "58506Q109": "MEDP",   // Medpace
  "35671D857": "FCX",    // Freeport-McMoRan
  "053015103": "ADP",    // Automatic Data Processing
  "25809K105": "DASH",   // DoorDash
  "28176E108": "EW",     // Edwards Lifesciences
  "45780R101": "IBP",    // Installed Building Products
  "550021109": "LULU",   // Lululemon
  "571903202": "MAR",    // Marriott
  "82982L103": "SITE",   // SiteOne Landscape Supply
  "88034P109": "TME",    // Tencent Music
  "339750101": "FND",    // Floor & Decor
  "46266C105": "IQV",    // IQVIA
  "517834107": "LVS",    // Las Vegas Sands
  "09061G101": "BMRN",   // BioMarin Pharmaceutical
  "052769106": "ADSK",   // Autodesk
  "629377508": "NRG",    // NRG Energy
  "23331A109": "DHI",    // D.R. Horton
  "016255101": "ALGN",   // Align Technology
  "00650F109": "ADPT",   // Adaptive Biotechnologies
  "29362U104": "ENTG",   // Entegris
  "303250104": "FICO",   // Fair Isaac
  "34959J108": "FTV",    // Fortive
  // v1.35 — round 2 additions (next 78 unmapped issuers, ~1,270 filing-rows)
  "38267D109": "GSHD",   // Goosehead Insurance
  "740444104": "PLPC",   // Preformed Line Products
  "98850P109": "YUMC",   // Yum China
  "55933J203": "MX",     // MagnaChip Semiconductor
  "776696106": "ROP",    // Roper Technologies
  "101137107": "BSX",    // Boston Scientific
  "144285103": "CRS",    // Carpenter Technology
  "33829M101": "FIVE",   // Five Below
  "09290D101": "BLK",    // BlackRock
  "225310101": "CACC",   // Credit Acceptance
  "91688F104": "UPWK",   // Upwork
  "N00985106": "AER",    // AerCap Holdings
  "87162W100": "SNX",    // TD Synnex
  "G4412G101": "HLF",    // Herbalife
  "366651107": "IT",     // Gartner
  "874054109": "TTWO",   // Take-Two Interactive
  "05329W102": "AN",     // AutoNation
  "58733R102": "MELI",   // MercadoLibre (alt CUSIP)
  "892672106": "TW",     // Tradeweb Markets
  "94419L101": "W",      // Wayfair
  "051774107": "AUR",    // Aurora Innovation
  "21037T109": "CEG",    // Constellation Energy
  "26622P107": "DOCS",   // Doximity
  "55261F104": "MTB",    // M&T Bank
  "819047101": "SHAK",   // Shake Shack
  "82509L107": "SHOP",   // Shopify
  "20854L108": "CEIX",   // CONSOL Energy
  "388689101": "GPK",    // Graphic Packaging
  "67080N101": "NUVB",   // Nuvation Bio
  "95082P105": "WCC",    // Wesco International
  "049468101": "TEAM",   // Atlassian
  "040413205": "ANET",   // Arista Networks
  "G1151C101": "ACN",    // Accenture
  "N14506104": "ESTC",   // Elastic NV
  "008474108": "AEM",    // Agnico Eagle Mines
  "031100100": "AME",    // AMETEK
  "031652100": "AMKR",   // Amkor Technology
  "127190304": "CACI",   // CACI International
  "27579R104": "EWBC",   // East West Bancorp
  "533900106": "LECO",   // Lincoln Electric
  "68268W103": "OMF",    // OneMain Holdings
  "78467J100": "SSNC",   // SS&C Technologies
  "894164102": "TNL",    // Travel + Leisure
  "00402L107": "ASO",    // Academy Sports & Outdoors
  "020764106": "AMR",    // Alpha Metallurgical Resources
  "05988J103": "BAND",   // Bandwidth
  "06417N103": "OZK",    // Bank OZK
  "12685J105": "CABO",   // Cable One
  "133131102": "CPT",    // Camden Property Trust
  "149568107": "CVCO",   // Cavco Industries
  "151290889": "CX",     // CEMEX
  "29414B104": "EPAM",   // EPAM Systems
  "311900104": "FAST",   // Fastenal
  "G4124C109": "GRAB",   // Grab Holdings
  "40131M109": "GH",     // Guardant Health
  "423452101": "HP",     // Helmerich & Payne
  "537008104": "LFUS",   // Littelfuse
  "620076307": "MSI",    // Motorola Solutions
  "682189105": "ON",     // ON Semiconductor
  "687793109": "OSCR",   // Oscar Health
  "71654V101": "PBR",    // Petrobras
  "74164M108": "PRI",    // Primerica
  "74275K108": "PCOR",   // Procore Technologies
  "750491102": "RDNT",   // RadNet
  "75282U104": "RNGR",   // Ranger Energy Services
  "758750103": "RRX",    // Regal Rexnord
  "83193G107": "SMRT",   // SmartRent
  "34385P108": "LAB",    // Standard BioTools
  "87918A105": "TDOC",   // Teladoc Health
  "879433829": "TDS",    // Telephone & Data Systems
  "892356106": "TSCO",   // Tractor Supply
  "023586100": "UHAL",   // U-Haul (AMERCO)
  "91332U101": "U",      // Unity Software
  "93627C101": "HCC",    // Warrior Met Coal
  "941848103": "WAT",    // Waters Corp
  "988498101": "YUM",    // Yum! Brands
  "929740108": "WAB",    // Wabtec
  "88337F105": "ODP",    // ODP Corp
  "878742204": "TECK",   // Teck Resources
  // v1.35 — round 3: high-concentration positions on priority-manager books
  // that were still hidden from the UI (Burry's 66% PLTR, Icahn's 61.8% IEP, etc).
  "69608A108": "PLTR",   // Palantir Technologies (Burry 66%)
  "451100101": "IEP",    // Icahn Enterprises (Icahn own holding)
  "68634K106": "ORLA",   // Orla Mining
  "G9460G101": "VAL",    // Valaris
  "12662P108": "CVI",    // CVR Energy
  "H8817H100": "RIG",    // Transocean
  "03940R107": "ARCH",   // Arch Resources
  "036752103": "ELV",    // Elevance Health
  "75886F107": "REGN",   // Regeneron Pharmaceuticals
  "632307104": "NTRA",   // Natera
  "136375102": "CNI",    // Canadian National Railway
  "82452J109": "FOUR",   // Shift4 Payments
  "60855R100": "MOH",    // Molina Healthcare
  "489398107": "KW",     // Kennedy-Wilson Holdings
  "904311107": "UAA",    // Under Armour A
  "165167180": "EXE",    // Expand Energy (fka Chesapeake)
  "09228F103": "BB",     // BlackBerry
  "254709108": "DFS",    // Discover Financial
  "444097109": "HPP",    // Hudson Pacific Properties
  "165167735": "CHK",    // Chesapeake Energy (pre-rename)
  "518439104": "EL",     // Estée Lauder
  "22266T109": "CPNG",   // Coupang
  "185899101": "CLF",    // Cleveland-Cliffs
  "19247G107": "COHR",   // Coherent
  "863667101": "SYK",    // Stryker
  "457669307": "INSM",   // Insmed
  "881624209": "TEVA",   // Teva Pharmaceuticals
  "G21810109": "CLVT",   // Clarivate
  "256677105": "DG",     // Dollar General
  "92552V100": "VSAT",   // Viasat
  "85207H104": "PHYS",   // Sprott Physical Gold Trust
  "907818108": "UNP",    // Union Pacific (alt CUSIP)
  "G7997R103": "STX",    // Seagate Technology
  "783513203": "RYAAY",  // Ryanair Holdings
  "406216101": "HAL",    // Halliburton
  "116794108": "BRKR",   // Bruker Corp
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
  // EDGAR filings mix uppercase/lowercase CUSIPs (e.g. "48251W104" vs
  // "48251w104"). Normalize to uppercase before lookup so the same issuer
  // isn't duplicated into separate unmapped rows.
  const cu = cusip.toUpperCase();
  const c6 = cu.substring(0, 6); // 6-digit issuer
  // Try exact match first
  if (CUSIP_TO_TICKER[cu]) return CUSIP_TO_TICKER[cu];
  // Try 6-char prefix match (different share classes)
  for (const [k, v] of Object.entries(CUSIP_TO_TICKER)) {
    if (k.substring(0, 6).toUpperCase() === c6) return v;
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
        // Skip unmapped CUSIPs whose cleaned-name fallback produced an empty
        // string — these would otherwise aggregate into a phantom position
        // that shows up as a single 50%+ portfolio slice.
        if (!ticker) continue;
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
