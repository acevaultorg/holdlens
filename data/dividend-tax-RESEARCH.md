# Dividend-tax research cadence — operator workflow

**Goal:** 75 → 400 verified treaty cells. 30-45 min per evening, ~12 cells per session, ~28 sessions to 100%.

**Sources (in priority order):**
1. **IRS Pub 901** — https://www.irs.gov/pub/irs-pdf/p901.pdf — definitive for US-investor cells.
2. **PwC Worldwide Tax Summaries** — https://taxsummaries.pwc.com/ — most comprehensive non-US source. Country-by-country withholding tax pages.
3. **KPMG Worldwide Tax Guide** — https://kpmg.com/xx/en/home/services/tax/tax-tools-and-resources.html — secondary cross-check.
4. **Country tax authorities** — primary when treaty wording is needed (HMRC, Bundeszentralamt, ATO, etc.).

**Workflow per evening session:**

1. Open today's coverage:
   ```
   npm run dt:stats
   ```
   Note the suggested investor-country batch (lowest coverage first = highest leverage).

2. Open the source for that investor country:
   - For SG investor → KPMG Singapore + IRAS bilateral treaty pages
   - For UK investor → HMRC double-taxation digest
   - For US investor → IRS Pub 901 (already 100% covered)

3. For each missing pair, run:
   ```
   npm run dt:add -- --inv SG --pay US --rate 30 \
     --ref "Singapore-US Tax Treaty (none — no comprehensive treaty; statutory 30% applies)" \
     --src "IRAS bilateral tax treaty list; PwC Singapore Worldwide Tax Summaries"
   ```

4. Or batch via TSV file — one line per cell, tab-separated:
   ```
   inv  pay  rate  ref                                              src
   SG   US   30    Singapore-US (no comprehensive treaty)            IRAS; PwC Singapore
   SG   UK   0     Singapore-UK Treaty Art.10(2) (parent-subsidiary) HMRC + IRAS bilateral
   ```
   Run: `npm run dt:add -- --batch path/to/batch.tsv`

5. Validation runs inline. If a cell's `source_citation` doesn't match approved patterns
   (PwC / KPMG / IRS Pub 901 / OECD / country tax authority), you get a warning. Use
   `--force` to override only when you've verified manually.

6. Commit + push when session ends:
   ```
   git add data/dividend-tax.json
   git commit -m "data(dividend-tax): +N cells from $SOURCE for investor=$INV — $DATE"
   git push
   ```

**Source citation format conventions:**

- `IRS Pub 901 Table 1 ([Country] row, Dividends column)` — for US-investor cells
- `PwC Worldwide Tax Summaries: [Country] — Withholding taxes on dividends [paid to | received from] [other-country] residents` — most general
- `KPMG Worldwide Tax Guide [YYYY]: [Country], chapter [N]` — when KPMG is primary
- Country authority: `HMRC INTM332010` / `Bundeszentralamt — Quellensteuer-Überblick` / `ATO Treaty Country List`
- For zero-rate cells (parent-subsidiary, EU directives, etc.), cite the directive AND the country authority

**Treaty reference format:**

- `[Country A]-[Country B] Tax Treaty Art.10(2)(b)` — most common
- `EU Parent-Subsidiary Directive (Council Directive 2011/96/EU)` — intra-EU 0% on qualifying parent-subsidiary
- `Domestic statutory rate (no treaty / treaty inapplicable)` — when there's no bilateral treaty
- `Self-pair (domestic; treaty inapplicable)` — investor=payer (auto-set by pre-seed)

**State-flag semantics:**

- `verified` — primary source consulted, citation in source_citation field
- `derived` — computed from a treaty framework (e.g. EU directive applied to two EU members)
- `needs_research` — placeholder; the data layer treats this identically to "missing cell" (operator-facing fallback shown, no rate fabricated)

**Diff hygiene:**

- The dt-add script auto-sorts treaties by (investor, payer) on every save. PRs stay diff-friendly even when batches arrive out of order.
- Pre-seeded `needs_research` cells live in the same file. When a cell is verified, the script overwrites the placeholder in-place.
- `_meta.last_verified` updates to the date of the most recent edit. Used by /dividend-tax/ hub page as the "data freshness" signal.
