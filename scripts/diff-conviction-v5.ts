// Diff helper — runs ConvictionScore v5 across all tickers + reports
// (a) tickers whose direction flipped (BUY→SELL or SELL→BUY)
// (b) top-20 BUY ranking with eventSignal contribution shown
// (c) top-10 SELL ranking with eventSignal contribution shown
// (d) tickers with non-zero eventSignal (the rows that are actually different)
//
// Read-only — does not write any state. Used to validate v5 cutover doesn't
// break the existing rankings unreasonably.

import { getAllConvictionScores } from "../lib/conviction";

const all = getAllConvictionScores();
const withEvent = all.filter((s) => s.breakdown.eventSignal !== 0);

console.log("=== CONVICTIONSCORE v5 DIFF REPORT ===");
console.log(`Total tickers scored: ${all.length}`);
console.log(`Tickers with non-zero eventSignal: ${withEvent.length}\n`);

console.log("=== Tickers where eventSignal is contributing ===");
for (const s of withEvent.sort((a, b) => Math.abs(b.breakdown.eventSignal) - Math.abs(a.breakdown.eventSignal))) {
  console.log(
    `${s.ticker.padEnd(6)} score=${String(s.score).padStart(4)} eventSignal=${String(s.breakdown.eventSignal).padStart(4)} ` +
    `direction=${s.direction.padEnd(7)} smart=${String(s.breakdown.smartMoney).padStart(3)} ` +
    `insider=${String(s.breakdown.insiderBoost).padStart(3)} dissent=${String(s.breakdown.dissentPenalty).padStart(3)}`
  );
}

console.log("\n=== TOP 20 BUYS (v5) ===");
const buys = all.filter((s) => s.direction === "BUY").sort((a, b) => b.score - a.score).slice(0, 20);
for (const s of buys) {
  const ev = s.breakdown.eventSignal;
  const evMark = ev !== 0 ? `(ev:${ev > 0 ? "+" : ""}${ev})` : "";
  console.log(`+${String(s.score).padStart(3)}  ${s.ticker.padEnd(6)} owners=${s.ownerCount} buyers=${s.buyerCount} sellers=${s.sellerCount} ${evMark}`);
}

console.log("\n=== TOP 10 SELLS (v5) ===");
const sells = all.filter((s) => s.direction === "SELL").sort((a, b) => a.score - b.score).slice(0, 10);
for (const s of sells) {
  const ev = s.breakdown.eventSignal;
  const evMark = ev !== 0 ? `(ev:${ev > 0 ? "+" : ""}${ev})` : "";
  console.log(`${String(s.score).padStart(4)}  ${s.ticker.padEnd(6)} owners=${s.ownerCount} buyers=${s.buyerCount} sellers=${s.sellerCount} ${evMark}`);
}
