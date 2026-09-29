// VENDORED from VAULT-Fleet/tooling/fleet-kit/amazon-ad/amazon-ad.mjs (sha256 4dcda9fa3849) — do not edit here; re-run enroll.mjs.
// Amili Kit Amazon ad — @fleet/kit component (Paulo 2026-09-28, thoughts mulhnwfs777u4h / mulhp9n4orh4wp /
// mulhpjvefhn5bn / mulhuj4lgb2vz1: "amili kit amazon affiliate template", 5 variants, carousel, Amazon's product API).
// CANONICAL: VAULT-Fleet/tooling/fleet-kit/amazon-ad/amazon-ad.mjs. Sites carry a synced copy at kit/amazon-ad.mjs
// (tooling/fleet-kit/amazon-ad/sync.sh <site-repo>); never edit a site copy, edit here and re-sync.
//
// THE COMPLIANCE CONTRACT (Amazon Associates Operating Agreement + Creators API terms) — enforced in code:
//  1. Price, image and Amazon's product title are shown ONLY from a live Creators API response, fetched by the
//     site's own Pages Function (makeItemsHandler), cached at most CACHE_TTL_S (1h, far under the 24h ceiling),
//     and every price carries "Price as of <time>" + the Amazon disclaimer. The browser refuses data older than 24h.
//  2. Star ratings, review counts and the Prime badge are NEVER rendered: the Creators API returned no
//     customerReviews for 48 of 48 creator-gear products (probe 2026-09-28) and exposes no Prime/delivery resource,
//     and those figures may not come from anywhere else. There is no code path that prints them.
//  3. With no API data (error, no tag, no JS, a bot) the card is typographic: our own short name + our own benefit
//     line + "See it on Amazon". No image, no price. No brand logos, ever.
//  4. "Sponsored" + an info button with the affiliate disclosure on every variant. Links are the site's own
//     /go/p gate (makeGateHandler) with rel="sponsored nofollow noopener"; the tag lives only in the Function.
//  5. Every slot has a fixed height (no layout shift); the sticky one pads the page so it covers nothing and can be
//     dismissed; 44px targets; prefers-reduced-motion gets no auto-advance.
//
// THE ALGORITHM (pickProducts): per-site pool of real ASINs, each with our own name/benefit and topic tags.
// Candidates = pool items whose tags meet the page's tags (else the site-level pool). Order = weighted sampling
// without replacement (Efraimidis-Spirakis key u^(1/w)), u from a hash of (page, UTC day, asin): deterministic per
// page per day, rotates daily, and w (default 1) is where click data plugs in later. Items the API reports as not
// buyable are skipped in the browser, falling to the next candidate.
//
// THE A/B: AD_HEAD_JS assigns each visitor one variant (v1..v5, uniform, kept in localStorage) BEFORE first paint;
// CSS shows only that slot. Clicks carry data-event-from="ad-v<N>" (5 low-cardinality keys: the fleet beacon keeps
// at most 12 distinct f= per site-day) and data-asin for GA4. Equal allocation => click counts compare directly.
// ?akv=v3 forces a variant (QA/screenshots) without touching the stored assignment.

export const VARIANTS = ['v1', 'v2', 'v3', 'v4', 'v5'];
export const CACHE_TTL_S = 3600; // edge cache of API data; Amazon's ceiling is 24h
export const MAX_AGE_MS = 24 * 3600 * 1000;
const ASIN_RE = /^[A-Z0-9]{10}$/;
const EMOJI = /\p{Extended_Pictographic}/u;

export const DISCLAIMER = 'Product prices and availability are accurate as of the date/time indicated and are subject to change. Any price and availability information displayed on Amazon.com at the time of purchase will apply to the purchase of this product.';

const L = {
  en: { sponsored: 'Sponsored', cta: 'See it on Amazon', asOf: 'Price as of', details: 'Details', close: 'Close ad', info: 'About this ad', prev: 'Previous product', next: 'Next product', slide: 'Product' },
  nl: { sponsored: 'Gesponsord', cta: 'Bekijk op Amazon', asOf: 'Prijs per', details: 'Details', close: 'Advertentie sluiten', info: 'Over deze advertentie', prev: 'Vorig product', next: 'Volgend product', slide: 'Product' },
};

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------- the algorithm ----------
export function hash32(str) { // FNV-1a, stable across Node and browsers
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}
export const utcDay = (d = new Date()) => d.toISOString().slice(0, 10);

export function candidatesFor(pool, tags = []) {
  const want = new Set(tags.map((t) => String(t).toLowerCase()));
  const hit = pool.filter((p) => (p.tags || []).some((t) => want.has(String(t).toLowerCase())));
  return hit.length ? hit : pool.filter((p) => !p.onlyTagged);
}

export function pickProducts(pool, { page = '', tags = [], day = utcDay(), n = 1, weights = {} } = {}) {
  const cands = candidatesFor(pool, tags);
  const keyed = cands.map((p) => {
    const u = (hash32(`${page}|${day}|${p.asin}`) + 1) / 4294967297; // (0,1)
    const w = Math.max(0.01, Number(weights[p.asin] ?? p.w ?? 1));
    return { p, k: Math.pow(u, 1 / w) };
  });
  keyed.sort((a, b) => b.k - a.k || (a.p.asin < b.p.asin ? -1 : 1));
  return keyed.slice(0, n === Infinity ? keyed.length : n).map((x) => x.p);
}

export function validatePool(pool) {
  const errs = [];
  const seen = new Set();
  for (const p of pool || []) {
    if (!ASIN_RE.test(p?.asin || '')) errs.push(`bad asin: ${JSON.stringify(p?.asin)}`);
    if (seen.has(p?.asin)) errs.push(`duplicate asin ${p.asin}`);
    seen.add(p?.asin);
    if (!p?.name || !p?.why) errs.push(`${p?.asin}: name and why are required (our own words)`);
    for (const t of [p?.name, p?.why]) if (t && EMOJI.test(t)) errs.push(`emoji in ad text: ${t}`);
    for (const t of [p?.name, p?.why]) if (t && /\d(\.\d)?\s*(stars?|★)|\$\s?\d|€\s?\d|reviews?\b|prime\b/i.test(t)) errs.push(`${p.asin}: no prices, stars, reviews or Prime in our own copy: ${t}`);
  }
  if (!pool?.length) errs.push('empty pool');
  return errs;
}

// ---------- API normalisation (server side) ----------
// One Creators API item -> the only fields the ad may show. Returns null when there is no NEW buy-box offer in stock.
export function parseItem(it) {
  if (!it || !ASIN_RE.test(it.asin || '')) return null;
  const L2 = it.offersV2?.listings || [];
  const bb = L2.find((l) => l.isBuyBoxWinner && (l.condition?.value || 'New') === 'New');
  const avail = bb?.availability?.type;
  // IN_STOCK_SCARCE ("Only 5 left in stock") IS in stock: excluding it hid ~2 of 3 prices on fitmylens (2026-09-28;
  // same rule as fitmylens amz-worker/index.mjs parseItem).
  if (!bb || (avail && avail !== 'IN_STOCK' && avail !== 'IN_STOCK_SCARCE')) return null;
  const img = it.images?.primary?.large || it.images?.primary?.medium;
  const price = bb.price?.money?.displayAmount;
  return {
    title: it.itemInfo?.title?.displayValue || '',
    brand: it.itemInfo?.byLineInfo?.brand?.displayValue || '',
    img: img?.url && /^https:\/\/m\.media-amazon\.com\//.test(img.url) ? { url: img.url, w: img.width || 500, h: img.height || 500 } : null,
    price: price && !bb.violatesMAP ? price : null,
  };
}

export const API_RESOURCES = ['itemInfo.title', 'itemInfo.byLineInfo', 'images.primary.large', 'offersV2.listings.price', 'offersV2.listings.isBuyBoxWinner', 'offersV2.listings.condition', 'offersV2.listings.availability'];

// Cloudflare Pages Function factory for GET /amz/items?a=ASIN1,ASIN2 (<=10, allow-listed).
// Needs Pages secrets CREATORS_API_CREDENTIAL_ID + CREATORS_API_SECRET. Rate limits: one getItems call per distinct
// candidate list per colo per hour (caches.default), token reused until expiry, and a failure is cached 5 min so an
// outage cannot turn page views into API calls. Response: {ok, asOf, items:{ASIN:{title,brand,img,price}}}.
export function makeItemsHandler({ tag, allow, marketplace = 'www.amazon.com', fetchImpl, cache } = {}) {
  const allowed = new Set(allow || []);
  let tok = null;
  let tokExp = 0;
  return async function onRequestGet(ctx) {
    const { request, env = {} } = ctx;
    const f = fetchImpl || fetch;
    const url = new URL(request.url);
    const asins = [...new Set((url.searchParams.get('a') || '').split(',').map((s) => s.trim().toUpperCase()))].filter((a) => ASIN_RE.test(a) && allowed.has(a)).sort().slice(0, 10);
    const json = (body, ttl) => new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': `public, max-age=${Math.min(ttl, 600)}`, 'x-robots-tag': 'noindex' } });
    if (!asins.length || !tag) return json({ ok: false, reason: !tag ? 'no-tag' : 'no-asins' }, 300);
    const c = cache === undefined ? (globalThis.caches && globalThis.caches.default) : cache;
    const key = new Request(`${url.origin}/amz/items?a=${asins.join(',')}&v=2`); // v=2: 2026-09-28 IN_STOCK_SCARCE fix, invalidates cached responses
    if (c) { const hit = await c.match(key); if (hit) return hit; }
    let body;
    let ttl = CACHE_TTL_S;
    try {
      const id = env.CREATORS_API_CREDENTIAL_ID;
      const secret = env.CREATORS_API_SECRET;
      if (!id || !secret) throw new Error('no-credentials');
      if (!tok || Date.now() > tokExp) {
        const t = await f('https://api.amazon.com/auth/o2/token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ grant_type: 'client_credentials', client_id: id, client_secret: secret, scope: 'creatorsapi::default' }) }).then((r) => r.json());
        if (!t?.access_token) throw new Error('token');
        tok = t.access_token;
        tokExp = Date.now() + Math.max(60, (t.expires_in || 3600) - 120) * 1000;
      }
      const r = await f('https://creatorsapi.amazon/catalog/v1/getItems', { method: 'POST', headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json', 'x-marketplace': marketplace }, body: JSON.stringify({ itemIds: asins, itemIdType: 'ASIN', marketplace, partnerTag: tag, resources: API_RESOURCES }) });
      if (!r.ok) { if (r.status === 401) tok = null; throw new Error(`api ${r.status}`); }
      const j = await r.json();
      const items = {};
      // the live key is itemsResult (docs say itemResults); the API may echo an ASIN we did not ask for — drop it
      for (const it of (j.itemsResult || j.itemResults || {}).items || []) if (asins.includes(it?.asin)) { const p = parseItem(it); if (p) items[it.asin] = p; }
      body = { ok: true, asOf: new Date().toISOString(), items };
    } catch (e) {
      body = { ok: false, reason: String(e.message || e).slice(0, 40) };
      ttl = 300;
    }
    const res = json(body, ttl);
    if (c) { const store = new Response(res.clone().body, res); store.headers.set('cache-control', `public, max-age=${ttl}`); ctx.waitUntil ? ctx.waitUntil(c.put(key, store)) : await c.put(key, store); }
    return res;
  };
}

// Cloudflare Pages Function factory for GET /go/p?a=ASIN — the affiliate gate. Real same-site navigations only
// (Fetch Metadata), allow-listed ASINs only, tag only here. Anything else goes home.
export function makeGateHandler({ tag, allow, host = 'www.amazon.com', requireGesture = true } = {}) {
  const allowed = new Set(allow || []);
  return function onRequestGet({ request }) {
    const url = new URL(request.url);
    const home = () => Response.redirect(url.origin + '/', 302);
    const mode = request.headers.get('sec-fetch-mode');
    const site = request.headers.get('sec-fetch-site');
    if (mode !== 'navigate' || (site !== 'same-origin' && site !== 'same-site')) return home();
    // GESTURE COOKIE (Kit 3, tooling/fleet-kit/gesture-gate; fleet card mulpb75brknoih, 2026-09-28): Sec-Fetch-* alone is
    // a header any HTTP client can set (affiliate-gate-probe.sh opened this gate with it). AD_HEAD_JS mints cc_g on a
    // trusted click on a /go/ link; without a fresh one (<10 min) the click bounces home. Same check as gesture-gate.mjs.
    const g = (request.headers.get('cookie') || '').match(/(?:^|;\s*)cc_g=([0-9a-z]{6,12})(?:;|$)/);
    const gt = g ? parseInt(g[1], 36) : NaN, now = Date.now();
    if (requireGesture && !(Number.isFinite(gt) && gt <= now + 60000 && now - gt < 600000)) return home();
    const a = (url.searchParams.get('a') || '').toUpperCase();
    if (!tag || !ASIN_RE.test(a) || !allowed.has(a)) return home();
    return new Response(null, { status: 302, headers: { Location: `https://${host}/dp/${a}/?tag=${encodeURIComponent(tag)}&linkCode=ogi&th=1&psc=1`, 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow' } });
  };
}

// ---------- markup ----------
const INFO_SVG = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 7v4.2M8 4.6v.1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
const X_SVG = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

function card(p, i, cfg, t) {
  const href = `${cfg.gate || '/go/p'}?a=${p.asin}`;
  // data-ak-* slots are filled by AD_JS from the live API; until then (or forever, without data) the card is typographic.
  return `<li class="ak-ad-card" data-asin="${p.asin}" data-i="${i}">`
    + `<a class="ak-ad-link" href="${esc(href)}" rel="sponsored nofollow noopener" target="_blank" data-event-from="ad-${cfg.variant}" data-asin="${p.asin}">`
    + '<span class="ak-ad-img" data-ak-img></span>'
    + '<span class="ak-ad-body">'
    + `<span class="ak-ad-brand" data-ak-brand></span>`
    + `<span class="ak-ad-title" data-ak-title>${esc(p.name)}</span>`
    + `<span class="ak-ad-why">${esc(p.why)}</span>`
    + `<span class="ak-ad-price" data-ak-price></span>`
    + `<span class="ak-ad-cta">${esc(t.cta)}</span>`
    + '</span></a></li>';
}

export function validateAdConfig(cfg) {
  const errs = [];
  if (!VARIANTS.includes(cfg?.variant)) errs.push(`variant must be one of ${VARIANTS.join(',')}`);
  if (!cfg?.disclosure) errs.push('disclosure is required (the site\'s own Amazon Associate wording, verbatim)');
  if (!cfg?.products?.length) errs.push('no products');
  errs.push(...validatePool(cfg?.products || []).filter((e) => e !== 'empty pool'));
  return errs;
}

// One slot. cfg = { variant, products (ranked candidates, first n shown), disclosure, api='/amz/items', gate='/go/p',
// lang='en', labels, n (cards per slot; v4 default 3, v1/v2 default 5 as a one-at-a-time carousel, v3/v5 default 1),
// candidates (extra ASINs the browser may fall back to when one is not buyable) }.
export function renderAd(cfg) {
  const errs = validateAdConfig(cfg);
  if (errs.length) throw new Error(`Amili Kit amazon-ad: ${errs.join('; ')}`);
  const t = { ...(L[cfg.lang] || L.en), ...(cfg.labels || {}) };
  const v = cfg.variant;
  const n = cfg.n || { v1: 5, v2: 5, v3: 1, v4: 3, v5: 1 }[v];
  const shown = cfg.products.slice(0, Math.max(n, 1));
  const spare = cfg.products.slice(shown.length).map((p) => p.asin);
  // cfg.duo: two products side by side (a comparison page's two items), never a carousel.
  const carousel = !cfg.duo && (v === 'v1' || v === 'v2' || v === 'v4') && shown.length > 1;
  const dots = carousel && v !== 'v4' ? `<div class="ak-ad-dots" aria-hidden="true">${shown.map((_, i) => `<span${i ? '' : ' class="on"'}></span>`).join('')}</div>` : '';
  const info = `<details class="ak-ad-info"><summary aria-label="${esc(t.sponsored)}: ${esc(t.info)}">${esc(t.sponsored)} ${INFO_SVG}</summary><div class="ak-ad-pop"><p>${esc(cfg.disclosure)}</p><p class="ak-ad-disc" data-ak-disc hidden>${esc(DISCLAIMER)}</p></div></details>`;
  const close = v === 'v2' ? `<button type="button" class="ak-ad-x" data-ak-close aria-label="${esc(t.close)}">${X_SVG}</button>` : '';
  const asOf = `<p class="ak-ad-asof" data-ak-asof hidden>${esc(t.asOf)} <time></time></p>`;
  const w = cfg.products.filter((p) => p.w && p.w !== 1).map((p) => `${p.asin}:${Number(p.w)}`).join(',');
  // cfg.on: always shown, whatever variant the page's A/B assigned (a page's fixed top card beside its own slot).
  // cfg.fixed: show products in the given order (the page's own items, best first) instead of the daily rotation.
  return `<aside class="ak-ad ak-ad-${v}${cfg.on ? ' ak-on' : ''}${cfg.duo ? ' ak-duo' : ''}" data-v="${v}"${cfg.fixed ? ' data-fixed="1"' : ''} data-api="${esc(cfg.api || '/amz/items')}" data-page="${esc(cfg.page || '')}"${w ? ` data-w="${w}"` : ''} data-spare="${spare.join(',')}"${carousel ? ' data-carousel="1"' : ''} aria-label="${esc(t.sponsored)}">`
    + `<div class="ak-ad-in"><p class="ak-ad-promo" data-ak-promo hidden></p>${close}<ul class="ak-ad-track" role="list">${shown.map((p, i) => card(p, i, cfg, t)).join('')}</ul>`
    + `<div class="ak-ad-foot">${dots}${asOf}${info}</div></div></aside>`;
}

// All five slots for one page, keyed by placement, so a site drops each at its own spot:
// top (v1, before the header), sticky (v2, end of body), inContent (v3 + v4, after the first result block), between (v5).
// hostTag wraps each in-content slot (e.g. 'li' inside a results <ul>) in an element that is hidden unless that
// variant is live, so a hidden variant leaves no empty list item or flex gap behind.
export function renderAdSlots(cfg, { hostTag = 'div' } = {}) {
  const out = {};
  for (const v of VARIANTS) out[v] = renderAd({ ...cfg, variant: v });
  const host = (v) => `<${hostTag} class="ak-host ak-host-${v}">${out[v]}</${hostTag}>`;
  return { top: out.v1, sticky: out.v2, inContent: host('v3') + host('v4'), between: host('v5') };
}

// Inline in <head>, before any CSS paints: assigns the visitor's variant. Keep it tiny.
// AD_HEAD_JS also carries the Kit 3 gesture-cookie mint (identical to gesture-gate.mjs MINT_JS): the gate above needs it,
// and <head> is the one place guaranteed to run before the first click.
export const AD_HEAD_JS = `(function(){function m(e){try{if(!e.isTrusted)return;if(e.type==='auxclick'&&e.button!==1)return;var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a||a.host!==location.host||a.pathname.indexOf('/go/')!==0)return;document.cookie='cc_g='+Date.now().toString(36)+'; Path=/go/; Max-Age=600; SameSite=Lax; Secure'}catch(x){}}try{document.addEventListener('click',m,true);document.addEventListener('auxclick',m,true)}catch(x){}})();(function(){try{var V=['v1','v2','v3','v4','v5'],q=(location.search.match(/[?&]akv=(v[1-5]|off)/)||[])[1],v;if(q)v=q;else{try{v=localStorage.getItem('akv')}catch(e){}if(V.indexOf(v)<0){v=V[Math.floor(Math.random()*V.length)];try{localStorage.setItem('akv',v)}catch(e){}}}try{if(v==='v2'&&sessionStorage.getItem('akx'))v='v2x'}catch(e){}document.documentElement.setAttribute('data-akv',v)}catch(e){}})();`;

// The browser half of pickProducts (same hash, same key), so a static page still rotates every UTC day.
// ak_rank(page, day, asins, weights) -> asins in today's order. footer test asserts it matches pickProducts.
export const RANK_JS = `function ak_h(s){var h=0x811c9dc5;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193)}return h>>>0}function ak_rank(pg,day,as,w){return as.map(function(a){var u=(ak_h(pg+'|'+day+'|'+a)+1)/4294967297;return{a:a,k:Math.pow(u,1/Math.max(0.01,(w&&w[a])||1))}}).sort(function(x,y){return y.k-x.k||(x.a<y.a?-1:1)}).map(function(x){return x.a})}`;

// End of body: fills the visible slot from /amz/items, runs the carousel, handles dismiss. No dependencies.
// GA4 (2026-09-28): a click on an ad link fires gtag amazon_click (dest/cta_position 'amili-ad') unless the site's own
// handler already pushed one for this click (dataLayer checked between window capture and window bubble). No client
// fleet beacon here: the amili-amazon-ad Worker counts /go/amzad server-side, so a client beacon would double count.
export const AD_JS = `(function(){${RANK_JS}var h=document.documentElement,v=h.getAttribute('data-akv');var slots=[].slice.call(document.querySelectorAll('.ak-ad.ak-on'+(v?',.ak-ad[data-v="'+v+'"]':'')));if(!slots.length)return;
var akd=0;window.addEventListener('click',function(){akd=(window.dataLayer||[]).length},true);
window.addEventListener('click',function(e){try{if(!e.isTrusted||window.__FLEET_AGENT__||!window.gtag)return;var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a||!a.closest('.ak-ad'))return;var u=new URL(a.href,location.href);if(u.host!==location.host||u.pathname!=='/go/amzad')return;var dl=window.dataLayer||[];for(var k=akd;k<dl.length;k++){var q=dl[k];if(q&&q[0]==='event'&&q[1]==='amazon_click')return}gtag('event','amazon_click',{page:location.pathname,asin:u.searchParams.get('a')||'',dest:'amili-ad',cta_position:'amili-ad'})}catch(x){}});
slots.forEach(function(s){var sv=s.getAttribute('data-v');
var cards=[].slice.call(s.querySelectorAll('.ak-ad-card')),spare=(s.getAttribute('data-spare')||'').split(',').filter(Boolean);
var W={};(s.getAttribute('data-w')||'').split(',').forEach(function(x){var p=x.split(':');if(p[1])W[p[0]]=+p[1]});
var ids=cards.map(function(c){return c.getAttribute('data-asin')}).concat(spare);var want=s.getAttribute('data-fixed')?ids:ak_rank(s.getAttribute('data-page')||'',new Date().toISOString().slice(0,10),cards.map(function(c){return c.getAttribute('data-asin')}).concat(spare),W);
function fmt(iso){var d=new Date(iso);return d.toLocaleString([],{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'})}
function fill(c,a,it){c.setAttribute('data-asin',a);var l=c.querySelector('a');l.setAttribute('data-asin',a);l.href=l.getAttribute('href').replace(/a=[A-Z0-9]{10}/,'a='+a);
if(it.img){var im=new Image();im.alt='';im.width=it.img.w;im.height=it.img.h;im.decoding='async';im.referrerPolicy='no-referrer';im.src=it.img.url;var b=c.querySelector('[data-ak-img]');b.textContent='';b.appendChild(im);c.classList.add('has-img')}
if(it.title)c.querySelector('[data-ak-title]').textContent=it.title;if(it.brand)c.querySelector('[data-ak-brand]').textContent=it.brand;
if(it.price){c.querySelector('[data-ak-price]').textContent=it.price;c.classList.add('has-price')}}
fetch(s.getAttribute('data-api')+'?a='+want.slice().sort().join(','),{credentials:'omit'}).then(function(r){return r.json()}).then(function(j){
if(!j||!j.ok||!j.asOf||Date.now()-Date.parse(j.asOf)>${MAX_AGE_MS})return;var items=j.items||{},pool=want.filter(function(a){return items[a]}),used=0,any=0;
cards.forEach(function(c){var a=pool[used++];if(!a)return;fill(c,a,items[a]);if(items[a].price)any=1});
if(any){var p=s.querySelector('[data-ak-asof]');p.querySelector('time').setAttribute('datetime',j.asOf);p.querySelector('time').textContent=fmt(j.asOf);p.hidden=false;s.querySelector('[data-ak-disc]').hidden=false}
var pm=j.promo,nw=Date.now();if(pm&&pm.text&&nw>=Date.parse(pm.from)&&nw<=Date.parse(pm.to)&&(!pm.paths||new RegExp(pm.paths).test(location.pathname))){var pe=s.querySelector('[data-ak-promo]');if(pe){pe.textContent=pm.text;pe.hidden=false}}
s.classList.add('is-live')}).catch(function(){});
var x=s.querySelector('[data-ak-close]');if(x)x.addEventListener('click',function(){try{sessionStorage.setItem('akx','1')}catch(e){}h.setAttribute('data-akv','v2x')});
if(!s.getAttribute('data-carousel'))return;var tr=s.querySelector('.ak-ad-track'),dots=[].slice.call(s.querySelectorAll('.ak-ad-dots span')),i=0;
function cur(){var w=cards[0].getBoundingClientRect().width||1;return Math.round(tr.scrollLeft/w)}
tr.addEventListener('scroll',function(){var k=cur();if(k!==i){i=k;dots.forEach(function(d,n){d.className=n===k?'on':''})}},{passive:true});
if(sv==='v4'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;var paused=0;['pointerdown','focusin','mouseenter','touchstart'].forEach(function(e){s.addEventListener(e,function(){paused=1},{passive:true})});
var timer=setInterval(function(){if(paused||document.hidden)return;var k=(cur()+1)%cards.length;tr.scrollTo({left:k*cards[0].getBoundingClientRect().width,behavior:'smooth'})},6000);
if('IntersectionObserver'in window)new IntersectionObserver(function(e){paused=e[0].isIntersecting?paused:1}).observe(s)})})();`;

// Scoped under .ak-ad. Fixed heights per variant (--ak-ad-h*) => zero layout shift whether or not the API answers.
// Colours: a white card like Amazon's own (the mockup), overridable with --ak-ad-bg --ak-ad-fg --ak-ad-muted
// --ak-ad-line --ak-ad-accent --ak-ad-cta-bg --ak-ad-cta-fg --ak-ad-page (the page background behind v1).
export const AD_CSS = `.ak-ad{display:none;--ak-ad-bg:#fff;--ak-ad-fg:#0f1111;--ak-ad-muted:#565959;--ak-ad-line:#d5d9d9;--ak-ad-cta-bg:#ffd814;--ak-ad-cta-fg:#0f1111;font:14px/1.35 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--ak-ad-fg);text-align:left;box-sizing:border-box}
.ak-ad *{box-sizing:border-box}
.ak-host{display:none;list-style:none;margin:0;padding:0}
html[data-akv=v1] .ak-ad-v1,html[data-akv=v2] .ak-ad-v2,html[data-akv=v3] .ak-ad-v3,html[data-akv=v4] .ak-ad-v4,html[data-akv=v5] .ak-ad-v5,html:not([data-akv]) .ak-ad-v3,html[data-akv=v1] .ak-host-v1,html[data-akv=v3] .ak-host-v3,html[data-akv=v4] .ak-host-v4,html[data-akv=v5] .ak-host-v5,html:not([data-akv]) .ak-host-v3{display:block}
.ak-ad-in{position:relative;max-width:40rem;margin:0 auto}
.ak-ad-track{list-style:none;margin:0;padding:0;display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;overscroll-behavior-x:contain}
.ak-ad-track::-webkit-scrollbar{display:none}
.ak-ad-card{flex:0 0 100%;scroll-snap-align:start;margin:0;min-width:0}
.ak-ad-link{display:flex;gap:12px;align-items:center;height:100%;min-height:44px;padding:10px 12px;background:var(--ak-ad-bg);border:1px solid var(--ak-ad-line);border-radius:10px;color:inherit;text-decoration:none}
.ak-ad-link:focus-visible{outline:2px solid var(--ak-ad-fg);outline-offset:2px}
.ak-ad-img{flex:0 0 auto;display:none;align-items:center;justify-content:center;background:#fff;border-radius:6px;overflow:hidden}
.has-img .ak-ad-img{display:flex}
.ak-ad-img img{width:100%;height:100%;object-fit:contain}
.ak-ad-body{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}
.ak-ad-brand{font-size:12px;color:var(--ak-ad-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ak-ad-brand:empty{display:none}
.ak-ad-title{font-weight:600;font-size:15px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.ak-ad-why{font-size:13px;color:var(--ak-ad-muted);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.is-live .has-img .ak-ad-why{display:none}
.ak-ad-price{font-size:17px;font-weight:700}
.ak-ad-price:empty{display:none}
.ak-ad-cta{align-self:flex-start;margin-top:4px;padding:6px 14px;border-radius:999px;background:var(--ak-ad-cta-bg);color:var(--ak-ad-cta-fg);font-size:13px;font-weight:600;white-space:nowrap}
.ak-ad-foot{display:flex;align-items:center;justify-content:flex-end;gap:10px;height:36px;font-size:12px;color:var(--ak-ad-muted);white-space:nowrap}
.ak-ad-dots{display:flex;gap:6px;margin-right:auto;padding-left:4px}
.ak-ad-dots span{width:6px;height:6px;border-radius:50%;background:var(--ak-ad-line)}
.ak-ad-dots span.on{background:var(--ak-ad-muted)}
.ak-ad-asof{margin:0;font-size:11px;overflow:hidden;text-overflow:ellipsis;min-width:0}
.ak-ad-promo{position:absolute;left:0;bottom:100%;margin:0 0 3px;padding:0 7px;border-radius:4px;background:var(--ak-ad-cta-bg);color:var(--ak-ad-cta-fg);font-size:12px;line-height:17px;font-weight:700;white-space:nowrap}
.ak-ad-promo[hidden]{display:none}
.ak-ad-info{position:relative}
.ak-ad-info summary{list-style:none;cursor:pointer;display:inline-flex;align-items:center;gap:4px;min-height:44px;min-width:44px;justify-content:flex-end}
.ak-ad-info summary::-webkit-details-marker{display:none}
.ak-ad-pop{position:absolute;right:0;bottom:100%;z-index:3;width:min(20rem,80vw);padding:10px 12px;background:var(--ak-ad-bg);color:var(--ak-ad-fg);border:1px solid var(--ak-ad-line);border-radius:8px;box-shadow:0 6px 24px rgba(0,0,0,.18);font-size:12px}
.ak-ad-pop p{margin:0 0 6px}.ak-ad-pop p:last-child{margin:0}
.ak-ad-x{position:absolute;top:-14px;right:-6px;z-index:2;width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:none;border:0;padding:0;color:var(--ak-ad-fg);cursor:pointer}
.ak-ad-x svg{width:24px;height:24px;padding:5px;background:var(--ak-ad-bg);border:1px solid var(--ak-ad-line);border-radius:50%}
.ak-ad-v1{background:var(--ak-ad-page,#f3f3f3);padding:8px 12px 0;height:var(--ak-ad-h1,150px)}
.ak-ad.ak-on{display:block}
.ak-ad-v1.ak-duo{height:var(--ak-ad-h1d,196px)}
.ak-duo .ak-ad-track{gap:8px;overflow:visible}
.ak-duo .ak-ad-card{flex:1 1 0}
.ak-ad-v1.ak-duo .ak-ad-link{flex-direction:column;align-items:stretch;gap:6px;height:152px;padding:8px}
.ak-ad-v1.ak-duo .ak-ad-img{display:flex;width:100%;height:58px;background:#f3f3f3}
.ak-ad-v1.ak-duo .has-img .ak-ad-img{background:#fff}
.ak-ad-v1.ak-duo .ak-ad-title{font-size:13px;line-height:1.25}
.ak-ad-v1.ak-duo .ak-ad-why,.ak-ad-v1.ak-duo .ak-ad-brand{display:none}
.ak-ad-v1.ak-duo .ak-ad-price{font-size:15px;margin-top:auto}
.ak-ad-v1.ak-duo .ak-ad-foot{height:36px}
.ak-ad-v1[data-fixed] .ak-ad-img{display:flex;background:#f3f3f3}
.ak-ad-v1[data-fixed] .has-img .ak-ad-img{background:#fff}
.ak-ad-v1:not(.ak-duo) .ak-ad-body{justify-content:flex-start}
.ak-ad-v1:not(.ak-duo) .ak-ad-brand{display:block;height:16px}
.ak-ad-v1:not(.ak-duo) .ak-ad-title{height:2.5em;line-height:1.25}
.ak-ad-v1:not(.ak-duo) .ak-ad-why,.ak-ad-v1:not(.ak-duo) .ak-ad-price{height:22px;line-height:22px;-webkit-line-clamp:1}
.ak-ad-v1.ak-duo .ak-ad-title{height:2.5em}
.ak-ad-v1.ak-duo .ak-ad-price{height:20px}
.ak-ad-v1 .ak-ad-link,.ak-ad-v2 .ak-ad-link{height:106px}
.ak-ad-v1 .ak-ad-img,.ak-ad-v2 .ak-ad-img{width:86px;height:86px}
.ak-ad-v1 .ak-ad-why,.ak-ad-v2 .ak-ad-why{-webkit-line-clamp:1}
.ak-ad-v1 .ak-ad-cta,.ak-ad-v2 .ak-ad-cta{display:none}
.ak-ad-v2{position:fixed;left:0;right:0;bottom:0;z-index:40;background:var(--ak-ad-page,#f3f3f3);padding:14px 12px env(safe-area-inset-bottom);height:calc(var(--ak-ad-h2,156px) + env(safe-area-inset-bottom));box-shadow:0 -4px 18px rgba(0,0,0,.22)}
html[data-akv=v2] body{padding-bottom:calc(var(--ak-ad-h2,156px) + env(safe-area-inset-bottom))}
.ak-ad-v3{margin:12px 0;height:var(--ak-ad-h3,368px)}
.ak-ad-v3 .ak-ad-link{flex-direction:column;align-items:stretch;height:328px;padding:12px}
.ak-ad-v3 .ak-ad-img{width:100%;height:170px}
.ak-ad-v3 .ak-ad-card:not(.has-img) .ak-ad-body{justify-content:center;gap:10px;padding:0 4px}
.ak-ad-v3 .ak-ad-card:not(.has-img) .ak-ad-title{font-size:22px;line-height:1.25}
.ak-ad-v3 .ak-ad-card:not(.has-img) .ak-ad-why{font-size:15px;-webkit-line-clamp:4}
.ak-ad-v3 .ak-ad-card:not(.has-img) .ak-ad-cta{margin-top:14px}
.ak-ad-v3 .ak-ad-title{font-size:16px}
.ak-ad-v3 .ak-ad-cta{align-self:stretch;text-align:center;padding:10px 14px;font-size:14px;margin-top:auto}
.ak-ad-v4{margin:12px 0;height:var(--ak-ad-h4,318px)}
.ak-ad-v4 .ak-ad-track{gap:10px;padding-right:28%}
.ak-ad-v4 .ak-ad-card{flex:0 0 44%}
.ak-ad-v4 .ak-ad-link{flex-direction:column;align-items:stretch;height:278px;padding:10px}
.ak-ad-v4 .ak-ad-img{width:100%;height:110px}
.ak-ad-v4 .ak-ad-title{font-size:14px}
.ak-ad-v4 .ak-ad-why{-webkit-line-clamp:3}
.ak-ad-v4 .ak-ad-cta{margin-top:auto;align-self:stretch;text-align:center;font-size:12px;padding:8px 6px;white-space:normal}
.ak-ad-v5{margin:8px 0;height:var(--ak-ad-h5,104px)}
.ak-ad-v5 .ak-ad-link{height:64px;padding:6px 10px;gap:10px}
.ak-ad-v5 .ak-ad-img{width:48px;height:48px}
.ak-ad-v5 .ak-ad-why,.ak-ad-v5 .ak-ad-brand{display:none}
.ak-ad-v5 .ak-ad-body{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;column-gap:10px;row-gap:3px}
.ak-ad-v5 .ak-ad-title{grid-column:1/-1;-webkit-line-clamp:1;font-size:14px;line-height:1.25}
.ak-ad-v5 .ak-ad-price{grid-column:1;font-size:15px;line-height:1.2}
.ak-ad-v5 .ak-ad-cta{grid-column:2;grid-row:2;margin:0;padding:5px 12px;font-size:12.5px}
.ak-ad-v5 .ak-ad-img{display:flex;background:#f3f3f3}
.ak-ad-v5 .has-img .ak-ad-img{background:#fff}
.ak-ad-v5 .ak-ad-cta{justify-self:end}
@media (prefers-reduced-motion:reduce){.ak-ad-track{scroll-behavior:auto}}
@media (min-width:48rem){.ak-ad-v4 .ak-ad-card{flex:0 0 31%}.ak-ad-v4 .ak-ad-track{padding-right:0}}`;
