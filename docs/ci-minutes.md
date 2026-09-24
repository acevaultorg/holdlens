# GitLab CI minutes (2026-09-24)

The acevault-lab namespace ran out of its 400 free runner-minutes in September.
`.gitlab-ci.yml` now runs the ~13-minute validation build only when code or build
inputs change (app, components, lib, functions, workers, scripts, public, config,
package files, the CI file). Data-only pushes such as the daily
`data(edgar): scheduled ingest` commits create no pipeline. Production is not
deployed from CI: `npm run deploy` builds and runs `scripts/predeploy-guard.mjs`
on the exact artifact before upload, so every data change is still validated there.

If a new top-level source directory is added, add it to the `changes:` list.
