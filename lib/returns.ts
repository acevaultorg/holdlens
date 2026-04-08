// BRK-A annual price returns (source: Berkshire Hathaway annual reports, 1999–2025).
// SPY annual total returns over same period (source: S&P 500 TR).
// Approximate; used for educational backtest only.
export type YearRow = { year: number; brk: number; spy: number };

export const RETURNS: YearRow[] = [
  { year: 1999, brk: -19.9, spy: 21.0 },
  { year: 2000, brk: 26.6, spy: -9.1 },
  { year: 2001, brk: 6.5, spy: -11.9 },
  { year: 2002, brk: -3.8, spy: -22.1 },
  { year: 2003, brk: 15.8, spy: 28.7 },
  { year: 2004, brk: 4.3, spy: 10.9 },
  { year: 2005, brk: 0.8, spy: 4.9 },
  { year: 2006, brk: 24.1, spy: 15.8 },
  { year: 2007, brk: 28.7, spy: 5.5 },
  { year: 2008, brk: -31.8, spy: -37.0 },
  { year: 2009, brk: 2.7, spy: 26.5 },
  { year: 2010, brk: 21.4, spy: 15.1 },
  { year: 2011, brk: -4.7, spy: 2.1 },
  { year: 2012, brk: 16.8, spy: 16.0 },
  { year: 2013, brk: 32.7, spy: 32.4 },
  { year: 2014, brk: 27.0, spy: 13.7 },
  { year: 2015, brk: -12.5, spy: 1.4 },
  { year: 2016, brk: 23.4, spy: 12.0 },
  { year: 2017, brk: 21.9, spy: 21.8 },
  { year: 2018, brk: 2.8, spy: -4.4 },
  { year: 2019, brk: 11.0, spy: 31.5 },
  { year: 2020, brk: 2.4, spy: 18.4 },
  { year: 2021, brk: 29.6, spy: 28.7 },
  { year: 2022, brk: 4.0, spy: -18.1 },
  { year: 2023, brk: 15.8, spy: 26.3 },
  { year: 2024, brk: 25.5, spy: 25.0 },
  { year: 2025, brk: 8.2, spy: 11.4 },
];

// Pershing Square (Ackman) annual returns. Approximate; based on PSH NAV reports.
export const ACKMAN_RETURNS: YearRow[] = [
  { year: 2014, brk: 40.4, spy: 13.7 },
  { year: 2015, brk: -20.5, spy: 1.4 },
  { year: 2016, brk: -13.5, spy: 12.0 },
  { year: 2017, brk: -4.0, spy: 21.8 },
  { year: 2018, brk: -0.7, spy: -4.4 },
  { year: 2019, brk: 58.1, spy: 31.5 },
  { year: 2020, brk: 70.2, spy: 18.4 },
  { year: 2021, brk: 26.9, spy: 28.7 },
  { year: 2022, brk: -8.8, spy: -18.1 },
  { year: 2023, brk: 26.7, spy: 26.3 },
  { year: 2024, brk: 10.2, spy: 25.0 },
  { year: 2025, brk: 12.5, spy: 11.4 },
];

export function simulateManager(returns: YearRow[], startYear: number, amount: number) {
  const rows = returns.filter((r) => r.year >= startYear);
  let mgr = amount;
  let spy = amount;
  const series: { year: number; brk: number; spy: number }[] = [
    { year: startYear - 1, brk: mgr, spy },
  ];
  for (const r of rows) {
    mgr = mgr * (1 + r.brk / 100);
    spy = spy * (1 + r.spy / 100);
    series.push({ year: r.year, brk: mgr, spy });
  }
  return {
    series,
    brkFinal: mgr,
    spyFinal: spy,
    brkMultiple: mgr / amount,
    spyMultiple: spy / amount,
    years: rows.length,
    brkCagr: rows.length > 0 ? Math.pow(mgr / amount, 1 / rows.length) - 1 : 0,
    spyCagr: rows.length > 0 ? Math.pow(spy / amount, 1 / rows.length) - 1 : 0,
  };
}

export function simulate(startYear: number, amount: number) {
  const rows = RETURNS.filter((r) => r.year >= startYear);
  let brk = amount;
  let spy = amount;
  const series: { year: number; brk: number; spy: number }[] = [
    { year: startYear - 1, brk, spy },
  ];
  for (const r of rows) {
    brk = brk * (1 + r.brk / 100);
    spy = spy * (1 + r.spy / 100);
    series.push({ year: r.year, brk, spy });
  }
  return {
    series,
    brkFinal: brk,
    spyFinal: spy,
    brkMultiple: brk / amount,
    spyMultiple: spy / amount,
    years: rows.length,
    brkCagr: Math.pow(brk / amount, 1 / rows.length) - 1,
    spyCagr: Math.pow(spy / amount, 1 / rows.length) - 1,
  };
}
