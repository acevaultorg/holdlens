# QUALITY.md — @craftsman Love Score log (v17.2)

State file for the `@craftsman` specialist per AcePilot invariant I-23.
Every public-facing ship in Pro modes gets a Love Score across 5 dimensions
(Useful · Delightful · Reliable · Clear · Unique). Mean ≥ 0.5 required
unless operator tags `[experimental]` or `[thin-content-acceptable]`.

Append-only. Corrections go in `## Corrections` at the bottom.

## Love Log

```
ts                 | target                              | U   D   R   C   Un  | mean | verdict | fix
2026-04-16 19:55   | welcome email (subscribe.ts)        | .75 .50 .55 .75 .55 | 0.62 | PASS    | List-Unsubscribe header
```

Legend: U=Useful, D=Delightful, R=Reliable, C=Clear, Un=Unique. Verdict:
PASS (≥0.5) · SLOP (<0.5) · EXPERIMENTAL-OK (operator-tagged).

## Highest-leverage fix queue (shipped inline as part of the ship)

- **v1.25** — welcome email: List-Unsubscribe header + 1-click unsubscribe
  (mailto + https variants), per Gmail/Yahoo 2024 bulk-sender requirements.
  Projected reliability lift: +0.30 → mean 0.68 post-fix.

## Calibration notes

First-ever Love Score entry. No archetype calibration yet — need ≥5 entries
in the same category (email / landing-page / component / article) before the
per-archetype multiplier adjustments kick in.
