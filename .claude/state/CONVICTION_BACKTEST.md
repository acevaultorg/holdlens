# ConvictionScore v4.1+v4.2 Backtest
_Generated 2026-04-19 by scripts/backtest-conviction.ts_

Score-eligible universe: **69** tickers

Fetching 70 price series from Yahoo (2y daily)...
Fetched: 67 OK, 3 failed/skipped

## 2024-Q4 (filed 2025-02-14, held 428 days)

- Tickers scored + priced: **52**
- SPY return over window: **16.47%**
- Pearson r(score, return):     -0.037
- Pearson r(score, alpha):      -0.037

### Top-10 BUY vs SELL
| group | mean return | mean alpha | hit-rate |
|---|---:|---:|---:|
| top-10 BUY (highest score) | 15.6% | -0.9% | 30% positive alpha |
| top-10 SELL (lowest score) | 35.6% | +19.1% | 60% negative alpha |
| delta BUY − SELL | -20.0pt | -20.0pt | — |

## 2025-Q1 (filed 2025-05-15, held 338 days)

- Tickers scored + priced: **53**
- SPY return over window: **20.86%**
- Pearson r(score, return):     -0.183
- Pearson r(score, alpha):      -0.183

### Top-10 BUY vs SELL
| group | mean return | mean alpha | hit-rate |
|---|---:|---:|---:|
| top-10 BUY (highest score) | 17.9% | -3.0% | 40% positive alpha |
| top-10 SELL (lowest score) | 88.6% | +67.7% | 40% negative alpha |
| delta BUY − SELL | -70.7pt | -70.7pt | — |

## 2025-Q2 (filed 2025-08-14, held 247 days)

- Tickers scored + priced: **55**
- SPY return over window: **10.12%**
- Pearson r(score, return):     -0.164
- Pearson r(score, alpha):      -0.164

### Top-10 BUY vs SELL
| group | mean return | mean alpha | hit-rate |
|---|---:|---:|---:|
| top-10 BUY (highest score) | 9.8% | -0.3% | 60% positive alpha |
| top-10 SELL (lowest score) | 31.9% | +21.8% | 50% negative alpha |
| delta BUY − SELL | -22.0pt | -22.0pt | — |

## 2025-Q3 (filed 2025-11-14, held 155 days)

- Tickers scored + priced: **61**
- SPY return over window: **5.67%**
- Pearson r(score, return):     -0.063
- Pearson r(score, alpha):      -0.063

### Top-10 BUY vs SELL
| group | mean return | mean alpha | hit-rate |
|---|---:|---:|---:|
| top-10 BUY (highest score) | -4.7% | -10.3% | 30% positive alpha |
| top-10 SELL (lowest score) | 10.0% | +4.3% | 60% negative alpha |
| delta BUY − SELL | -14.6pt | -14.6pt | — |

## Aggregate (all 4 quarters pooled)

- Total (ticker, quarter) pairs: **221**
- Pearson r(score, return):     -0.123
- Pearson r(score, alpha):      -0.117
- Mean return overall:          18.4%
- Mean alpha overall:           5.4%

### Score bucket performance
| bucket | N | mean return | mean alpha | hit-rate (alpha > 0) |
|---|---:|---:|---:|---:|
| Strong sell (≤ -30) | 0 | 0.0% | 0.0% | 0% |
| Sell (-29..-10) | 23 | 35.4% | +22.3% | 48% |
| Weak sell (-9..-1) | 34 | 24.3% | +9.7% | 32% |
| Neutral (0) | 7 | 0.8% | -13.9% | 43% |
| Weak buy (1..9) | 58 | 25.8% | +13.9% | 40% |
| Buy (10..29) | 90 | 8.5% | -4.3% | 28% |
| Strong buy (≥ 30) | 9 | 16.3% | +3.1% | 56% |

## Verdict

- **Top-decile alpha:** -5.0%
- **Bottom-decile alpha:** +23.7%
- **Decile spread:** -28.7pt
- **Correlation r(score, alpha):** -0.117

❌ **r < 0 → inverse signal over this window.** Either the model is wrong or this window's forward returns are idiosyncratic. Investigate before shipping score-based UIs.

---
Method + code: scripts/backtest-conviction.ts. Data: Yahoo Finance v8 chart API, 2y daily closes, fetched at script runtime.
