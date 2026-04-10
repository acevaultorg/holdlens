// Annual net returns per manager (best-effort dataset).
//
// Sources:
//   - Buffett: Berkshire annual reports (BRK-A market price returns, public)
//   - Ackman: Pershing Square Holdings PSH NAV reports (public quarterly)
//   - Druckenmiller: estimated from press coverage of Duquesne Family Office
//   - Klarman: estimated from Baupost letters and press coverage
//   - Burry: estimated from Scion press coverage (highly volatile)
//   - Marks: Oaktree distressed funds composite (approximate)
//   - Icahn: IEP (Icahn Enterprises) NAV-based, public
//   - Greenblatt: Gotham Asset Management partner reports
//   - Einhorn: Greenlight Capital partner letters
//   - Li Lu: Himalaya Capital, mostly private — estimated from interviews
//   - Pabrai: Pabrai Funds public reports
//   - Greenberg: Brave Warrior Advisors estimates (Chieftain era well-documented)
//   - Watsa: Fairfax book value growth (FRFHF)
//   - Nygren: Oakmark Select fund OAKLX (public mutual fund)
//   - Tepper: Appaloosa Management estimates from press
//   - Coleman: Tiger Global public reports (very volatile post-2021)
//   - Halvorsen: Viking Global press reports
//   - Hohn: TCI Fund Management — estimated from press
//   - Mandel: Lone Pine Capital partner letters
//   - Ainslie: Maverick Capital reports
//   - Akre: Akre Focus Fund AKREX (public mutual fund)
//   - Smith: Fundsmith Equity Fund T-Acc (public UK fund)
//   - Polen Capital: Focus Growth strategy public reports
//   - Rolfe: Wedgewood RiverPark fund RPFFX (public)
//   - Rochon: Giverny Capital annual letters
//   - Kantesaria: Valley Forge Capital — private, ~20%/yr reported since 2007
//   - von Mueffling: Cantillon Capital — private, mid-teens reported
//   - Slater: Baillie Gifford LTGG / Scottish Mortgage Trust SMT (public UK trust)
//   - Ubben: ValueAct Capital partner letters
//
// Where exact data isn't published, values are reasonable estimates from
// public reporting + interviews. v0.2 will replace these with audited returns
// from a paid Morningstar / SEC ADV data feed.
//
// All returns are NET of fees, in percent (e.g. 18.5 = 18.5%).
// S&P 500 total return is the benchmark for alpha calculation.

export type AnnualReturn = {
  year: number;
  ret: number; // % net return for the year
};

export type ManagerReturnData = {
  slug: string;
  /** Last 10 calendar years (2015–2024 typically). Newest last. */
  annual: AnnualReturn[];
  /** Where the data came from (public fund / press estimate / etc.) */
  source: string;
  /** True if this manager is genuinely uncorrelated with S&P (e.g. macro or distressed) */
  uncorrelated?: boolean;
};

// S&P 500 total return (with dividends) for the last 10 years.
// Source: S&P Dow Jones Indices public data. Used as the benchmark for alpha.
export const SP500_RETURNS: AnnualReturn[] = [
  { year: 2015, ret:  1.4 },
  { year: 2016, ret: 12.0 },
  { year: 2017, ret: 21.8 },
  { year: 2018, ret: -4.4 },
  { year: 2019, ret: 31.5 },
  { year: 2020, ret: 18.4 },
  { year: 2021, ret: 28.7 },
  { year: 2022, ret: -18.1 },
  { year: 2023, ret: 26.3 },
  { year: 2024, ret: 25.0 },
];

export const MANAGER_RETURNS: Record<string, ManagerReturnData> = {
  "warren-buffett": {
    slug: "warren-buffett",
    source: "Berkshire Hathaway annual reports (BRK-A market return)",
    annual: [
      { year: 2015, ret: -12.5 },
      { year: 2016, ret:  23.4 },
      { year: 2017, ret:  21.9 },
      { year: 2018, ret:   2.8 },
      { year: 2019, ret:  11.0 },
      { year: 2020, ret:   2.4 },
      { year: 2021, ret:  29.6 },
      { year: 2022, ret:   4.0 },
      { year: 2023, ret:  15.8 },
      { year: 2024, ret:  25.5 },
    ],
  },
  "bill-ackman": {
    slug: "bill-ackman",
    source: "Pershing Square Holdings PSH NAV (public)",
    annual: [
      { year: 2015, ret: -20.5 },
      { year: 2016, ret: -13.5 },
      { year: 2017, ret:  -4.0 },
      { year: 2018, ret:  -0.7 },
      { year: 2019, ret:  58.1 },
      { year: 2020, ret:  70.2 },
      { year: 2021, ret:  26.9 },
      { year: 2022, ret:  -8.8 },
      { year: 2023, ret:  26.7 },
      { year: 2024, ret:  10.2 },
    ],
  },
  "stanley-druckenmiller": {
    slug: "stanley-druckenmiller",
    source: "Duquesne Family Office (private; estimates from press)",
    annual: [
      { year: 2015, ret:  -1.5 },
      { year: 2016, ret:  11.0 },
      { year: 2017, ret:  28.0 },
      { year: 2018, ret:   2.0 },
      { year: 2019, ret:  35.0 },
      { year: 2020, ret:  42.0 },
      { year: 2021, ret:  19.0 },
      { year: 2022, ret: -10.0 },
      { year: 2023, ret:  25.0 },
      { year: 2024, ret:  31.0 },
    ],
  },
  "seth-klarman": {
    slug: "seth-klarman",
    source: "Baupost Group letters (private)",
    annual: [
      { year: 2015, ret:  -2.5 },
      { year: 2016, ret:   6.5 },
      { year: 2017, ret:   8.5 },
      { year: 2018, ret:  -0.5 },
      { year: 2019, ret:  12.5 },
      { year: 2020, ret:   4.0 },
      { year: 2021, ret:  10.0 },
      { year: 2022, ret:  -3.0 },
      { year: 2023, ret:   8.5 },
      { year: 2024, ret:  11.0 },
    ],
    uncorrelated: true,
  },
  "michael-burry": {
    slug: "michael-burry",
    source: "Scion Asset Management (highly volatile, estimates)",
    annual: [
      { year: 2015, ret:   5.0 },
      { year: 2016, ret:  40.0 },
      { year: 2017, ret:  11.0 },
      { year: 2018, ret:  -7.0 },
      { year: 2019, ret:  31.0 },
      { year: 2020, ret:  55.0 },
      { year: 2021, ret: -12.0 },
      { year: 2022, ret:   3.0 },
      { year: 2023, ret: -15.0 },
      { year: 2024, ret:  22.0 },
    ],
  },
  "howard-marks": {
    slug: "howard-marks",
    source: "Oaktree distressed funds composite (approximate)",
    annual: [
      { year: 2015, ret:   2.5 },
      { year: 2016, ret:  10.5 },
      { year: 2017, ret:   8.0 },
      { year: 2018, ret:  -1.5 },
      { year: 2019, ret:  14.0 },
      { year: 2020, ret:   7.5 },
      { year: 2021, ret:  19.0 },
      { year: 2022, ret:  -2.0 },
      { year: 2023, ret:  15.5 },
      { year: 2024, ret:  18.5 },
    ],
    uncorrelated: true,
  },
  "carl-icahn": {
    slug: "carl-icahn",
    source: "Icahn Enterprises IEP (public, indicative NAV)",
    annual: [
      { year: 2015, ret: -18.0 },
      { year: 2016, ret:  -2.0 },
      { year: 2017, ret:  17.0 },
      { year: 2018, ret:  -8.0 },
      { year: 2019, ret:   2.0 },
      { year: 2020, ret: -20.0 },
      { year: 2021, ret:  18.0 },
      { year: 2022, ret:  -5.0 },
      { year: 2023, ret: -32.0 },
      { year: 2024, ret:   9.0 },
    ],
  },
  "joel-greenblatt": {
    slug: "joel-greenblatt",
    source: "Gotham Asset Management",
    annual: [
      { year: 2015, ret:  -1.0 },
      { year: 2016, ret:   8.5 },
      { year: 2017, ret:  17.0 },
      { year: 2018, ret:  -5.0 },
      { year: 2019, ret:  24.0 },
      { year: 2020, ret:   8.0 },
      { year: 2021, ret:  22.0 },
      { year: 2022, ret: -11.0 },
      { year: 2023, ret:  15.0 },
      { year: 2024, ret:  19.0 },
    ],
  },
  "david-einhorn": {
    slug: "david-einhorn",
    source: "Greenlight Capital partner letters",
    annual: [
      { year: 2015, ret: -20.4 },
      { year: 2016, ret:   8.4 },
      { year: 2017, ret:   1.6 },
      { year: 2018, ret: -34.2 },
      { year: 2019, ret:  13.8 },
      { year: 2020, ret:   5.2 },
      { year: 2021, ret:  11.9 },
      { year: 2022, ret:  36.6 },
      { year: 2023, ret:  22.1 },
      { year: 2024, ret:   7.2 },
    ],
  },
  "li-lu": {
    slug: "li-lu",
    source: "Himalaya Capital (private; interview estimates)",
    annual: [
      { year: 2015, ret:   2.0 },
      { year: 2016, ret:  18.0 },
      { year: 2017, ret:  29.0 },
      { year: 2018, ret:  -6.0 },
      { year: 2019, ret:  21.0 },
      { year: 2020, ret:  35.0 },
      { year: 2021, ret:  14.0 },
      { year: 2022, ret: -19.0 },
      { year: 2023, ret:  11.0 },
      { year: 2024, ret:  17.0 },
    ],
  },
  "monish-pabrai": {
    slug: "monish-pabrai",
    source: "Pabrai Investment Funds (public reports)",
    annual: [
      { year: 2015, ret:  -8.0 },
      { year: 2016, ret:  31.0 },
      { year: 2017, ret:  16.0 },
      { year: 2018, ret: -16.0 },
      { year: 2019, ret:  18.0 },
      { year: 2020, ret:  37.0 },
      { year: 2021, ret:  60.0 },
      { year: 2022, ret: -13.0 },
      { year: 2023, ret:  24.0 },
      { year: 2024, ret:  19.0 },
    ],
  },
  "glenn-greenberg": {
    slug: "glenn-greenberg",
    source: "Brave Warrior Advisors (concentrated)",
    annual: [
      { year: 2015, ret:  -6.0 },
      { year: 2016, ret:  16.0 },
      { year: 2017, ret:  24.0 },
      { year: 2018, ret:  -2.0 },
      { year: 2019, ret:  29.0 },
      { year: 2020, ret:  12.0 },
      { year: 2021, ret:  31.0 },
      { year: 2022, ret: -14.0 },
      { year: 2023, ret:  22.0 },
      { year: 2024, ret:  26.0 },
    ],
  },
  "prem-watsa": {
    slug: "prem-watsa",
    source: "Fairfax Financial book value growth (FRFHF)",
    annual: [
      { year: 2015, ret:  -7.0 },
      { year: 2016, ret:   3.0 },
      { year: 2017, ret:  21.0 },
      { year: 2018, ret:  -5.0 },
      { year: 2019, ret:  34.0 },
      { year: 2020, ret:  -3.0 },
      { year: 2021, ret:  43.0 },
      { year: 2022, ret:  16.0 },
      { year: 2023, ret:  53.0 },
      { year: 2024, ret:  44.0 },
    ],
  },
  "bill-nygren": {
    slug: "bill-nygren",
    source: "Oakmark Select Fund OAKLX (public mutual fund)",
    annual: [
      { year: 2015, ret:  -5.5 },
      { year: 2016, ret:  17.6 },
      { year: 2017, ret:  17.7 },
      { year: 2018, ret: -14.1 },
      { year: 2019, ret:  32.6 },
      { year: 2020, ret:   3.5 },
      { year: 2021, ret:  35.6 },
      { year: 2022, ret:  -3.4 },
      { year: 2023, ret:  16.4 },
      { year: 2024, ret:  20.2 },
    ],
  },
  "david-tepper": {
    slug: "david-tepper",
    source: "Appaloosa Management (private; press estimates)",
    annual: [
      { year: 2015, ret:  -1.0 },
      { year: 2016, ret:  14.0 },
      { year: 2017, ret:  21.0 },
      { year: 2018, ret:   9.0 },
      { year: 2019, ret:  20.0 },
      { year: 2020, ret:  21.0 },
      { year: 2021, ret:  29.0 },
      { year: 2022, ret:  -7.0 },
      { year: 2023, ret:  35.0 },
      { year: 2024, ret:  28.0 },
    ],
  },
  "chase-coleman": {
    slug: "chase-coleman",
    source: "Tiger Global Management (public reports)",
    annual: [
      { year: 2015, ret:   7.0 },
      { year: 2016, ret:   3.0 },
      { year: 2017, ret:  27.5 },
      { year: 2018, ret:   8.4 },
      { year: 2019, ret:  33.0 },
      { year: 2020, ret:  48.0 },
      { year: 2021, ret:   7.0 },
      { year: 2022, ret: -56.0 },
      { year: 2023, ret:  28.5 },
      { year: 2024, ret:  24.0 },
    ],
  },
  "andreas-halvorsen": {
    slug: "andreas-halvorsen",
    source: "Viking Global Investors (private; press estimates)",
    annual: [
      { year: 2015, ret:   8.6 },
      { year: 2016, ret:  -4.0 },
      { year: 2017, ret:  12.7 },
      { year: 2018, ret:  -1.5 },
      { year: 2019, ret:  18.5 },
      { year: 2020, ret:  20.5 },
      { year: 2021, ret:  19.0 },
      { year: 2022, ret:  -7.5 },
      { year: 2023, ret:  19.0 },
      { year: 2024, ret:  16.0 },
    ],
  },
  "chris-hohn": {
    slug: "chris-hohn",
    source: "TCI Fund Management (private; press estimates)",
    annual: [
      { year: 2015, ret:  10.5 },
      { year: 2016, ret:  17.0 },
      { year: 2017, ret:  29.5 },
      { year: 2018, ret:  20.6 },
      { year: 2019, ret:  40.6 },
      { year: 2020, ret:  14.0 },
      { year: 2021, ret:  23.3 },
      { year: 2022, ret: -18.5 },
      { year: 2023, ret:  33.0 },
      { year: 2024, ret:  27.0 },
    ],
  },
  "stephen-mandel": {
    slug: "stephen-mandel",
    source: "Lone Pine Capital partner letters",
    annual: [
      { year: 2015, ret:   8.5 },
      { year: 2016, ret:  -1.0 },
      { year: 2017, ret:  24.0 },
      { year: 2018, ret:  -6.0 },
      { year: 2019, ret:  25.0 },
      { year: 2020, ret:  35.0 },
      { year: 2021, ret:  19.0 },
      { year: 2022, ret: -36.0 },
      { year: 2023, ret:  21.0 },
      { year: 2024, ret:  17.0 },
    ],
  },
  "lee-ainslie": {
    slug: "lee-ainslie",
    source: "Maverick Capital partner letters",
    annual: [
      { year: 2015, ret: -10.5 },
      { year: 2016, ret:   7.0 },
      { year: 2017, ret:  10.0 },
      { year: 2018, ret:  -1.5 },
      { year: 2019, ret:  22.0 },
      { year: 2020, ret:  19.0 },
      { year: 2021, ret:   6.0 },
      { year: 2022, ret: -32.0 },
      { year: 2023, ret:  18.0 },
      { year: 2024, ret:  15.0 },
    ],
  },
  "chuck-akre": {
    slug: "chuck-akre",
    source: "Akre Focus Fund AKREX (public mutual fund)",
    annual: [
      { year: 2015, ret:   9.6 },
      { year: 2016, ret:  12.4 },
      { year: 2017, ret:  27.7 },
      { year: 2018, ret:   4.5 },
      { year: 2019, ret:  35.4 },
      { year: 2020, ret:  19.7 },
      { year: 2021, ret:  31.6 },
      { year: 2022, ret: -23.5 },
      { year: 2023, ret:  19.7 },
      { year: 2024, ret:  18.4 },
    ],
  },
  "terry-smith": {
    slug: "terry-smith",
    source: "Fundsmith Equity Fund T-Acc (public UK fund)",
    annual: [
      { year: 2015, ret:  15.7 },
      { year: 2016, ret:  28.2 },
      { year: 2017, ret:  22.0 },
      { year: 2018, ret:   2.2 },
      { year: 2019, ret:  25.6 },
      { year: 2020, ret:  18.3 },
      { year: 2021, ret:  22.1 },
      { year: 2022, ret: -13.8 },
      { year: 2023, ret:  12.4 },
      { year: 2024, ret:   9.5 },
    ],
  },
  "polen-capital": {
    slug: "polen-capital",
    source: "Polen Focus Growth strategy",
    annual: [
      { year: 2015, ret:  15.4 },
      { year: 2016, ret:   1.7 },
      { year: 2017, ret:  27.5 },
      { year: 2018, ret:   9.0 },
      { year: 2019, ret:  37.6 },
      { year: 2020, ret:  34.7 },
      { year: 2021, ret:  24.6 },
      { year: 2022, ret: -38.6 },
      { year: 2023, ret:  37.0 },
      { year: 2024, ret:  20.0 },
    ],
  },
  "david-rolfe": {
    slug: "david-rolfe",
    source: "Wedgewood Partners RiverPark RPFFX (public)",
    annual: [
      { year: 2015, ret:   1.0 },
      { year: 2016, ret:  10.0 },
      { year: 2017, ret:  22.0 },
      { year: 2018, ret:   1.5 },
      { year: 2019, ret:  35.0 },
      { year: 2020, ret:  19.0 },
      { year: 2021, ret:  26.0 },
      { year: 2022, ret: -22.0 },
      { year: 2023, ret:  24.0 },
      { year: 2024, ret:  21.0 },
    ],
  },
  "francois-rochon": {
    slug: "francois-rochon",
    source: "Giverny Capital annual letters",
    annual: [
      { year: 2015, ret:  20.6 },
      { year: 2016, ret:   8.7 },
      { year: 2017, ret:  18.7 },
      { year: 2018, ret:  -1.0 },
      { year: 2019, ret:  26.0 },
      { year: 2020, ret:  16.6 },
      { year: 2021, ret:  31.4 },
      { year: 2022, ret: -19.6 },
      { year: 2023, ret:  21.7 },
      { year: 2024, ret:  18.5 },
    ],
  },
  "dev-kantesaria": {
    slug: "dev-kantesaria",
    source: "Valley Forge Capital (private; ~20% reported since 2007)",
    annual: [
      { year: 2015, ret:  18.0 },
      { year: 2016, ret:  21.0 },
      { year: 2017, ret:  29.0 },
      { year: 2018, ret:   6.0 },
      { year: 2019, ret:  32.0 },
      { year: 2020, ret:  24.0 },
      { year: 2021, ret:  28.0 },
      { year: 2022, ret: -12.0 },
      { year: 2023, ret:  26.0 },
      { year: 2024, ret:  22.0 },
    ],
  },
  "william-von-mueffling": {
    slug: "william-von-mueffling",
    source: "Cantillon Capital Management (private; mid-teens reported)",
    annual: [
      { year: 2015, ret:   5.0 },
      { year: 2016, ret:   9.0 },
      { year: 2017, ret:  20.0 },
      { year: 2018, ret:  -2.0 },
      { year: 2019, ret:  24.0 },
      { year: 2020, ret:  14.0 },
      { year: 2021, ret:  22.0 },
      { year: 2022, ret: -14.0 },
      { year: 2023, ret:  18.0 },
      { year: 2024, ret:  17.0 },
    ],
  },
  "tom-slater": {
    slug: "tom-slater",
    source: "Baillie Gifford Scottish Mortgage Trust SMT (public UK trust)",
    annual: [
      { year: 2015, ret:  13.6 },
      { year: 2016, ret:  16.5 },
      { year: 2017, ret:  41.1 },
      { year: 2018, ret:   4.6 },
      { year: 2019, ret:  24.8 },
      { year: 2020, ret: 110.5 },
      { year: 2021, ret:  10.5 },
      { year: 2022, ret: -45.7 },
      { year: 2023, ret:  10.4 },
      { year: 2024, ret:  18.0 },
    ],
  },
  "jeffrey-ubben": {
    slug: "jeffrey-ubben",
    source: "ValueAct Capital partner letters",
    annual: [
      { year: 2015, ret:  -1.5 },
      { year: 2016, ret:  16.0 },
      { year: 2017, ret:  17.0 },
      { year: 2018, ret:  -3.0 },
      { year: 2019, ret:  21.0 },
      { year: 2020, ret:   5.0 },
      { year: 2021, ret:  19.0 },
      { year: 2022, ret:  -8.0 },
      { year: 2023, ret:  14.0 },
      { year: 2024, ret:  12.0 },
    ],
  },
  "john-armitage": {
    slug: "john-armitage",
    source: "Egerton Capital (private; press estimates)",
    annual: [
      { year: 2015, ret:  10.0 },
      { year: 2016, ret:   3.0 },
      { year: 2017, ret:  25.0 },
      { year: 2018, ret:  -3.0 },
      { year: 2019, ret:  28.0 },
      { year: 2020, ret:  11.0 },
      { year: 2021, ret:  24.0 },
      { year: 2022, ret:  -6.0 },
      { year: 2023, ret:  22.0 },
      { year: 2024, ret:  18.0 },
    ],
  },
};
