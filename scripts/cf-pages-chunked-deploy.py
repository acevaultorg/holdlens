#!/usr/bin/env python3
from __future__ import annotations
"""CF Pages chunked-upload deployer for holdlens.com (copy-forked from readinglist.school).

PAGES FUNCTIONS (2026-09-06, card mtotsyge1hnu5o): this uploader used to ship STATIC ASSETS
ONLY — the manifest, nothing else — so every deploy silently dropped functions/_middleware.ts
+ functions/api/{subscribe,thesis,unsubscribe}.ts from production (POST /api/subscribe 405,
GET /api/thesis 404, the WordPress-probe 410 gone, measured 2026-09-05 22:50Z; the same
failure class as readstacks 2026-07-03 and conversionbench). It now (a) recompiles functions/
into out/_worker.js with `wrangler pages functions build` on every run, (b) REFUSES to deploy
when functions/ is non-empty but no worker could be built, (c) posts _worker.js + _routes.json
as dedicated multipart FILE parts (as an asset the worker is INERT — Pages never enters
advanced mode), and (d) probes the live Functions after the deploy with a 404 control.

WHY: readinglist out/ is ~962MB / 11,981 files. `wrangler pages deploy` closes
the upload socket at a hard ~56MB PER CONNECTION (log-verified EPIPE), and Next's
build-ID churn makes ~all HTML re-upload each build → the changed payload is
hundreds of MB → wrangler deterministically EPIPEs. RSC-pruning is not enough
here (still way over 56MB). This script uploads in 8-file/1MB batches (each a
fresh connection, far under the cap) and then creates the deployment.

AUTH (verified 2026-06-20): create-deployment requires an Account·Cloudflare
Pages·Edit API token. The asset-upload JWT alone returns error 9106 on
create-deployment, and the wrangler OAuth token is NOT accepted as a raw API
Bearer, and the session $CLOUDFLARE_API_TOKEN has no Pages scope. So a Pages:Edit
token is mandatory and is read from (in order):
    $CLOUDFLARE_PAGES_TOKEN   OR   ~/.cf-pages-token   OR   $CLOUDFLARE_API_TOKEN
Create it once: dash.cloudflare.com → My Profile → API Tokens → Create Token →
"Edit Cloudflare Pages" template → Continue → Create →
    echo 'THE_TOKEN' > ~/.cf-pages-token
Then: python3 scripts/cf-pages-chunked-deploy.py   (after `npm run build` + RSC prune)

Run-from-clean wrapper: scripts/deploy-cf-chunked.sh (build + prune + this).
"""
import base64, hashlib, json, mimetypes, os, pathlib, re, subprocess, sys, tempfile, time, uuid, urllib.request, urllib.error

ACCOUNT = "72bfd26c5f3c935393a25e5c0dea6039"
PROJECT = os.environ.get("CF_PAGES_PROJECT", "holdlens")
# Branch is the production/preview selector: CF Pages treats the project's production branch
# as LIVE and any other branch as an isolated preview URL. Overridable so a risky change (e.g.
# a _worker.js that takes over ALL routing) is proven on a preview URL before it touches main.
BRANCH = os.environ.get("CF_PAGES_BRANCH", "main")
# Where the post-deploy Functions probe runs when BRANCH is the production branch.
PROD_URL = os.environ.get("PROD_URL", "https://holdlens.com").rstrip("/")
OUT_DIR = pathlib.Path(os.environ.get("OUT_DIR",
    str(pathlib.Path(__file__).resolve().parent.parent / "out"))).resolve()

def _load_token() -> str:
    # Pages:Edit token. Prefer explicit Pages vars (the session $CLOUDFLARE_API_TOKEN
    # is DNS-scoped and has NO Pages scope). ~/.zshenv ships CF_PAGES_TOKEN (verified
    # Pages:Edit 2026-06-20). Order: explicit Pages env → token file → generic.
    for var in ("CLOUDFLARE_PAGES_TOKEN", "CF_PAGES_TOKEN", "CLOUDFLARE_PAGES_API_TOKEN"):
        t = os.environ.get(var)
        if t and t.strip():
            return t.strip()
    f = pathlib.Path.home() / ".cf-pages-token"
    if f.is_file():
        v = f.read_text().strip()
        if v:
            return v
    return (os.environ.get("CLOUDFLARE_API_TOKEN") or "").strip()

API_TOKEN = _load_token()
MAX_BATCH_FILES = int(os.environ.get("CF_BATCH_FILES", "1000"))
# CF_BATCH_MB env override: shrink batches to grind through a degraded CF upload
# window (20MB batches retry-loop/timeout on a bad window; 1MB "grinds through" —
# documented fleet lesson, color-lane 2026-07-14). Default 20MB (fast, good window).
MAX_BATCH_BYTES = int(float(os.environ.get("CF_BATCH_MB", "20")) * 1024 * 1024)  # was 20MB — stays well under
# the ~56MB/connection cap (each batch is a fresh Connection: close), but drops the
# batch COUNT ~25× (1MB/8-file → ~1600 batches ≈ 23min; 20MB → ~48 batches ≈ 2-4min).
# The per-batch connection/SSL-handshake overhead (~0.85s) dominated total upload time,
# so big batches finish FAST — critical when the env kills long-running deploys mid-upload
# (CF doesn't persist uploaded assets without a created deployment, so a killed run can't
# resume → the whole upload must complete in one shot). 2026-06-21.

if not API_TOKEN:
    print("ERROR: no Pages token. Create 'Edit Cloudflare Pages' token, then:\n"
          "  echo 'THE_TOKEN' > ~/.cf-pages-token", file=sys.stderr)
    sys.exit(2)
if not OUT_DIR.is_dir():
    print(f"ERROR: build dir not found: {OUT_DIR} (run `npm run build` first)", file=sys.stderr)
    sys.exit(2)

def http(url, method="GET", headers=None, data=None, timeout=120):
    # Transport via curl, not urllib: macOS system Python (/usr/bin/python3) ships
    # LibreSSL 2.8.3, which intermittently fails CF's TLS with SSLV3_ALERT_BAD_RECORD_MAC
    # on POST bodies (log-verified 2026-06-21, while curl/OpenSSL on the same host+network
    # succeeds). curl makes this deployer SSL-stack-immune fleet-wide.
    import subprocess, tempfile
    # --http1.1: CF's assets/upload edge over a flaky/proxied path resets HTTP/2 streams,
    # surfacing as SSL_read/bad-record-mac; HTTP/1.1 + curl's own --retry is far more robust.
    args = ["curl", "-sS", "--http1.1", "--retry", "3", "--retry-all-errors", "--max-time", str(timeout), "-X", method, "-w", "\n%{http_code}", url]
    for k, v in (headers or {}).items():
        args += ["-H", f"{k}: {v}"]
    tmp = None
    if data is not None:
        tmp = tempfile.NamedTemporaryFile(delete=False)
        tmp.write(data); tmp.flush(); tmp.close()
        args += ["--data-binary", f"@{tmp.name}"]
    try:
        p = subprocess.run(args, capture_output=True, timeout=timeout + 15)
    finally:
        if tmp is not None:
            try: os.unlink(tmp.name)
            except OSError: pass
    if p.returncode != 0:
        raise RuntimeError(f"curl {p.returncode} on {url}: {p.stderr.decode('utf-8','replace')[:200]}")
    raw = p.stdout; nl = raw.rfind(b"\n")
    body, code = (raw[:nl], raw[nl + 1:].decode().strip()) if nl >= 0 else (raw, "")
    if code and not code.startswith("2"):
        raise RuntimeError(f"HTTP {code} on {url}: {body.decode('utf-8','replace')[:300]}")
    return json.loads(body) if body else {"success": True}

def get_jwt():
    r = http(f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT}/pages/projects/{PROJECT}/upload-token",
             headers={"Authorization": f"Bearer {API_TOKEN}"})
    if not r.get("success"):
        raise RuntimeError(f"upload-token fetch failed (is the token Pages:Edit scoped?): {r}")
    return r["result"]["jwt"]

def walk(root):
    out = []
    for p in sorted(root.rglob("*")):
        if not p.is_file(): continue
        rel = "/" + str(p.relative_to(root)).replace(os.sep, "/")
        c = p.read_bytes(); ext = p.suffix.lstrip(".")
        h = hashlib.sha256(); h.update(c); h.update(ext.encode())
        out.append((rel, c, h.hexdigest()[:32]))
    return out

def check_missing(jwt, hashes):
    miss = []
    for i in range(0, len(hashes), 5000):
        r = http("https://api.cloudflare.com/client/v4/pages/assets/check-missing", method="POST",
                 headers={"Authorization": f"Bearer {jwt}", "Content-Type": "application/json"},
                 data=json.dumps({"hashes": hashes[i:i+5000]}).encode(), timeout=60)
        if not r.get("success"): raise RuntimeError(f"check-missing failed: {r}")
        miss.extend(r.get("result", []))
    return miss

def upload(jwt, batch, attempts=40):
    body = json.dumps(batch).encode(); last = None
    for a in range(1, attempts+1):
        try:
            r = http("https://api.cloudflare.com/client/v4/pages/assets/upload", method="POST",
                     headers={"Authorization": f"Bearer {jwt}", "Content-Type": "application/json", "Connection": "close"},
                     data=body, timeout=60)
            if not r.get("success"): raise RuntimeError(f"upload failed: {r}")
            return
        except Exception as e:
            last = e; s = min(30, 2**(a-1))
            sys.stderr.write(f"  ⚠ batch {a}/{attempts}: {str(e)[:110]} — retry {s}s\n"); sys.stderr.flush()
            time.sleep(s)
    raise RuntimeError(f"batch failed after {attempts}: {last}")

# CF Pages treats all four as CONFIGURATION, not static assets. They must be posted as their
# own multipart FILE parts on create-deployment; left in the asset manifest they are stored as
# inert files and never executed (sculptclub's deployer records the A/B: worker-as-asset →
# /api 404/405; worker-as-form-field → live).
#
# CORRECTED 2026-09-06 (task mtpgtssqyumit5): a prior version of this comment excluded
# _headers/_redirects here, citing "holdlens documented that _redirects wildcards broke
# production once." Checked against this repo's own history: the real 2026-04-20 incident
# was a BROAD catch-all rule (`/section/:slug 302`) over-matching real static pages under
# plain wrangler/Vercel deploy — nothing to do with manifest-vs-config-part placement. That
# rule was removed same-day (out/_redirects "404 RECOVERY removed 2026-04-20" comment) and
# every rule shipped since is scoped to a specific path prefix (`/stock/:ticker`,
# `/investor/:slug/q/*`, etc.) — none are section-root catch-alls.
#
# Meanwhile leaving _redirects OUT of SPECIAL_FILES here (this deployer has been the sole
# holdlens deploy path since e6b034cef, 2026-06-28) means it has sat as an INERT asset the
# whole time: verified live 2026-09-06, `curl -sIL holdlens.com/stock/AAPL` serves the
# disabled Next.js __next_error__ placeholder shell (200) instead of the intended 301 to
# /signal/AAPL/ — every /stock/*, /stocks/*, /investors/* and BRK.A alias redirect has been
# silently broken for ~2 months. Moving _redirects (and _headers) into SPECIAL_FILES fixes
# that live regression; it does not reintroduce the 04-20 incident, whose actual cause
# (an over-broad wildcard) is absent from the current file.
SPECIAL_FILES = ("_worker.js", "_routes.json", "_headers", "_redirects")

def regenerate_worker_from_functions():
    """Recompile functions/ → out/_worker.js on every run (ported from readstacks 2026-07-27).
    Refuse to deploy when functions/ has files but no worker could be built: shipping a
    Functions-less deploy would silently kill /api/subscribe, /api/thesis and the middleware
    with exit 0 (cloudflare-pages-epipe.md guard). ALLOW_STALE_WORKER=1 keeps whatever is
    already in out/_worker.js (only for a deploy where wrangler is genuinely unavailable)."""
    functions_dir = OUT_DIR.parent / "functions"
    fn_files = [p for p in functions_dir.rglob("*") if p.is_file()] if functions_dir.is_dir() else []
    if not fn_files:
        return None
    target = OUT_DIR / "_worker.js"
    if os.environ.get("ALLOW_STALE_WORKER") == "1":
        print("[!] ALLOW_STALE_WORKER=1 — not recompiling functions/ (using out/_worker.js as-is)")
    else:
        with tempfile.TemporaryDirectory() as tmp:
            print(f"[+] functions/ has {len(fn_files)} file(s) — compiling to out/_worker.js…")
            r = subprocess.run(["npx", "wrangler", "pages", "functions", "build", f"--outdir={tmp}"],
                               cwd=str(OUT_DIR.parent), capture_output=True, text=True)
            compiled = pathlib.Path(tmp) / "index.js"
            if r.returncode != 0 or not compiled.exists():
                sys.exit(f"[x] REFUSING TO DEPLOY: functions/ has {len(fn_files)} file(s) but "
                         f"`wrangler pages functions build` failed — deploying now would ship a site "
                         f"with NO Functions (/api/subscribe, /api/thesis, middleware).\n{r.stderr[-2000:]}\n"
                         f"Override only for a deliberate stale-worker deploy: ALLOW_STALE_WORKER=1")
            target.write_bytes(compiled.read_bytes())
            print(f"[+] out/_worker.js written ({target.stat().st_size}B)")
    if not target.is_file() or target.stat().st_size < 1000:
        sys.exit(f"[x] REFUSING TO DEPLOY: functions/ is non-empty but {target} is missing/empty — "
                 f"a Functions-less deploy would take /api/* down with exit 0.")
    routes = OUT_DIR / "_routes.json"
    if not routes.is_file():
        src = OUT_DIR.parent / "public" / "_routes.json"
        if src.is_file():
            routes.write_bytes(src.read_bytes()); print("[+] out/_routes.json copied from public/")
        else:
            print("[!] no _routes.json — the worker will receive EVERY request (no static bypass list)")
    return target.read_bytes()

def create_deployment(manifest, specials=None):
    b = f"----cf{uuid.uuid4().hex}"; parts = []
    def fld(n, v):
        parts.append(f"--{b}\r\nContent-Disposition: form-data; name=\"{n}\"\r\n\r\n{v}\r\n".encode())
    def filefld(n, content, ctype):
        parts.append(f"--{b}\r\nContent-Disposition: form-data; name=\"{n}\"; filename=\"{n}\"\r\n"
                     f"Content-Type: {ctype}\r\n\r\n".encode() + content + b"\r\n")
    fld("manifest", json.dumps(manifest)); fld("branch", BRANCH)
    for name, content in (specials or {}).items():
        ctype = "application/javascript+module" if name.endswith(".js") else ("application/json" if name.endswith(".json") else "text/plain")
        filefld(name, content, ctype)
    parts.append(f"--{b}--\r\n".encode())
    return http(f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT}/pages/projects/{PROJECT}/deployments",
                method="POST", data=b"".join(parts),
                headers={"Authorization": f"Bearer {API_TOKEN}", "Content-Type": f"multipart/form-data; boundary={b}"},
                timeout=180)

def mime(p):
    m, _ = mimetypes.guess_type(p); return m or "application/octet-stream"

def main():
    t0 = time.time()
    print(f"[+] chunked deploy · project={PROJECT} · out={OUT_DIR}")
    regenerate_worker_from_functions()
    entries = walk(OUT_DIR)
    # Pull the advanced-mode files OUT of the asset manifest — they go as form fields.
    specials, kept = {}, []
    for rel, c, sha in entries:
        if rel.lstrip("/") in SPECIAL_FILES: specials[rel.lstrip("/")] = c
        else: kept.append((rel, c, sha))
    entries = kept
    fn_dir = OUT_DIR.parent / "functions"
    if fn_dir.is_dir() and any(fn_dir.rglob("*")) and "_worker.js" not in specials:
        sys.exit("[x] REFUSING TO DEPLOY: functions/ is non-empty but out/_worker.js is not in the deploy set.")
    print(f"[+] {len(entries)} files" + (f" + specials: {sorted(specials)}" if specials else " (no _worker.js/_routes.json)"))
    # Fail-fast BEFORE the (expensive, ~minutes-long) upload: CF Pages create_deployment
    # rejects a manifest >20,000 files (HTTP 400) -- and per
    # positive-control-before-absence.md this failure is otherwise SILENT: the uploader
    # runs its full length and no deployment ever appears, which reads exactly like a
    # hung upload. Measured 2026-09-03: this tree is 37,920 files (190% of the cap), of
    # which 12,997 are RSC soft-nav .txt payloads -- dropping those alone is not enough
    # to clear the cap here, so this is a hard abort, not a warning.
    if len(entries) > 20000:
        print(f"ERROR: {len(entries)} files exceeds CF Pages' 20,000/deployment cap.\n"
              f"  Prune the out/ tree before deploying (RSC .txt soft-nav payloads and/or\n"
              f"  unindexed page-type twins -- prune by CONTENT SIGNATURE, never by filename:\n"
              f"  robots.txt/ads.txt/llms.txt/IndexNow-key files are also .txt).",
              file=sys.stderr)
        sys.exit(2)
    manifest = {rel: sha for rel, _, sha in entries}
    idx = {}
    for rel, c, sha in entries: idx.setdefault(sha, (c, rel))
    uniq = list(idx.keys())
    jwt = get_jwt(); jwt_at = time.time()
    miss = check_missing(jwt, uniq)
    print(f"[+] {len(miss)} need upload ({len(uniq)-len(miss)} cached)")
    if miss:
        miss.sort(key=lambda h: len(idx[h][0]))
        batch, nb, up, by = [], 0, 0, 0
        for h in miss:
            c, path = idx[h]
            if batch and (len(batch) >= MAX_BATCH_FILES or by + len(c) > MAX_BATCH_BYTES):
                if time.time() - jwt_at > 1500: jwt = get_jwt(); jwt_at = time.time()  # refresh < 30min
                upload(jwt, batch); nb += 1; up += len(batch); batch, by = [], 0
                if nb % 25 == 0: print(f"[+] {up}/{len(miss)} · {nb} batches · {int(time.time()-t0)}s")
            batch.append({"key": h, "value": base64.b64encode(c).decode("ascii"),
                          "metadata": {"contentType": mime(path)}, "base64": True}); by += len(c)
        if batch:
            if time.time() - jwt_at > 1500: jwt = get_jwt()
            upload(jwt, batch); nb += 1; up += len(batch)
        print(f"[+] uploaded {up} files in {nb} batches · {int(time.time()-t0)}s")
    print("[+] creating deployment…")
    r = create_deployment(manifest, specials)
    if not r.get("success"):
        print(f"ERROR: create-deployment failed: {r}", file=sys.stderr); sys.exit(1)
    res = r["result"]
    print(f"[✓] DEPLOYED · id={res.get('id')} · {res.get('url')} · {int(time.time()-t0)}s")
    if "_worker.js" in specials:
        verify_functions_live(PROD_URL if BRANCH == "main" else str(res.get("url") or "").rstrip("/"))

def _looks_html(body, ctype):
    return "text/html" in (ctype or "").lower() or body.lstrip()[:15].lower().startswith(b"<!doctype html")

def verify_functions_live(base):
    """Probe the deployed Functions. Status alone cannot discriminate (a live Function rejecting a
    method returns 405 with a non-HTML body; an ABSENT route falls through to the framework's HTML
    404 page), so the body type is read too, and a bogus path is the 404 control. Probes chosen
    for holdlens: POST /api/subscribe with an empty body → the handler's own 400 JSON (never the
    framework 405); GET /wp-login.php → the middleware's 410. SKIP_FUNCTIONS_PROBE=1 skips."""
    if os.environ.get("SKIP_FUNCTIONS_PROBE") == "1" or not base:
        print("[i] Functions probe skipped."); return
    def probe(u, method="GET", data=None):
        try:
            req = urllib.request.Request(u, method=method, data=data, headers={"User-Agent": "cf-deploy-verify", "content-type": "application/json"})
            with urllib.request.urlopen(req, timeout=30) as resp:
                return resp.status, _looks_html(resp.read(2048), resp.headers.get("Content-Type", ""))
        except urllib.error.HTTPError as e:
            try: body = e.read(2048)
            except Exception: body = b""
            return e.code, _looks_html(body, e.headers.get("Content-Type", "") if e.headers else "")
        except Exception as e:
            return f"ERR:{type(e).__name__}", False
    print(f"[+] verifying Functions at {base} (propagation pause 20s)…"); time.sleep(20)
    ctrl = probe(f"{base}/__deploy_probe_should_404__{uuid.uuid4().hex[:8]}")[0]
    sub, sub_html = probe(f"{base}/api/subscribe", "POST", b"{}")
    gone = probe(f"{base}/wp-login.php")[0]
    print(f"    control(bogus)={ctrl}  POST /api/subscribe={sub} body={'HTML' if sub_html else 'non-HTML'}  GET /wp-login.php={gone} (expect 404 / 400 non-HTML / 410)")
    if ctrl != 404:
        print("[!] INCONCLUSIVE: the 404 control did not return 404 — verify by hand.", file=sys.stderr); return
    if sub == 400 and not sub_html and gone == 410:
        print("[✓] Functions LIVE."); return
    if (sub in (404, 405) and sub_html) or gone == 404:
        print(f"[X] FUNCTIONS ARE DEAD on {base}: the framework's HTML 404/405 answered where the Function should have.\n"
              f"    The site still serves HTML 200, so this does not look broken from a browser. Rebuild + redeploy.", file=sys.stderr)
        sys.exit(4)
    print(f"[!] Functions probe mismatch (subscribe={sub}, wp-login={gone}) — not the dead-worker signature; check by hand.", file=sys.stderr)

if __name__ == "__main__":
    main()
