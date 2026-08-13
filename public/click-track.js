/* holdlens click measurement — global capture-phase delegated listener.
   Shipped 2026-08-13 to close a ~6-week measurement outage.

   WHAT WAS BROKEN: holdlens routed ELEVEN event families through Plausible's
   className mechanism (class="plausible-event-name=Book+Click ..." across 10
   files: AffiliateLink, InvestingBooks, SupportBar, ShareStrip, InstallPrompt,
   FilingWaveBanner, app/layout, app/support, app/reading{,/[topic]}). Those
   classNames are inert markup on their own — they only ever fired because the
   real Plausible tracker bound DOM listeners to them. Plausible's subscription
   lapsed 2026-06-28, so every one of these has been silently dead since:
     Book Click · Audible Click · Affiliate Click · Tip Click ·
     Share Click · Partners Link · Reading Hub Link · FilingBanner Click ·
     PWA Install · PWA Dismiss · PWA Dismiss iOS
   The window.plausible shim added to app/layout.tsx the same day rescues
   EXPLICIT plausible(...) calls, but a shim cannot rescue these — nothing was
   calling a function, the tracker was reading the class attribute.

   WHY A DELEGATED LISTENER instead of editing the 10 files: one capture-phase
   listener on document revives all eleven families at once, touches no
   component, and cannot disturb the live Pricing-View A/B test. Copy-forked
   from the proven colorcombinations/readstacks pattern (public/amazon-track.js)
   per cross-project-learning: share the SOURCE pattern, not a runtime lib.

   COMPLIANCE: listens only. It never alters an href, rel, tag, or disclosure —
   the affiliate markup stays byte-identical, which is the hard requirement in
   affiliate-team-standard.

   THE /c BEACON, and why it is fired ONLY for affiliate clicks: the fleet
   dashboard reads fleet.promptprio.com/c as the canonical un-suppressed daily
   AMAZON-CLICK counter (Amazon's own report hides low-volume tags). Sending a
   non-affiliate event there — a PWA install, a share — would inflate
   amazon_clicks fleet-wide and corrupt every $/click figure the fleet ranks on.
   So: affiliate clicks → Clarity + GA4 + /c. Everything else → Clarity + GA4 only. */
(function () {
  var BEACON = 'https://fleet.promptprio.com/c?s=holdlens.com';

  // GA4 requires snake_case, <=40 chars, leading letter. "Book Click" -> book_click
  function ga4Name(raw) {
    return String(raw || '')
      .replace(/\+/g, ' ')
      .trim()
      .replace(/[^a-z0-9]+/gi, '_')
      .replace(/^_+|_+$/g, '')
      .toLowerCase()
      .slice(0, 40);
  }

  // Plausible encoded props in sibling classes: plausible-event-<key>=<value>,
  // with '+' for spaces. Reproduce that decoding so the props survive the move.
  function propsFrom(el) {
    var out = {};
    var cls = (el.className && el.className.toString ? el.className.toString() : '') || '';
    cls.split(/\s+/).forEach(function (c) {
      var m = c.match(/^plausible-event-([A-Za-z0-9_-]+)=(.*)$/);
      if (!m) return;
      var k = m[1];
      if (k === 'name') return; // the event name itself, not a prop
      var v = m[2].replace(/\+/g, ' ');
      try { v = decodeURIComponent(v); } catch (_) {}
      out[ga4Name(k)] = v.slice(0, 100);
    });
    return out;
  }

  function isAffiliate(name, href) {
    if (/^(Book|Audible|Affiliate)\+?\s?Click$/i.test(String(name).replace(/\+/g, ' '))) return true;
    return /amazon\.|amzn\.to|amzn\.eu|audible\.|\/go\//i.test(href || '');
  }

  function send(name, props, affiliate) {
    var e = ga4Name(name);
    if (!e) return;
    try { if (window.clarity) { window.clarity('event', e); } } catch (_) {}
    try {
      if (window.gtag) {
        window.gtag('event', e, props || {});
        // Affiliate clicks additionally emit the fleet-canonical event name so
        // the metrics layer's amazon_click reader sees holdlens at all.
        if (affiliate) window.gtag('event', 'amazon_click', props || {});
      }
    } catch (_) {}
    if (affiliate) {
      try {
        if (navigator.sendBeacon) {
          // __FLEET_AGENT__ is the fleet's self-declared agent gate: our own
          // verification traffic marks itself so it is not counted as human.
          navigator.sendBeacon(BEACON + (window.__FLEET_AGENT__ ? '&a=1' : ''));
        }
      } catch (_) {}
    }
  }

  function handler(ev) {
    try {
      var t = ev.target;
      if (!t || !t.closest) return;
      // Match the nearest element carrying a tagged-event name — anchors AND
      // buttons, because PWA Install / Dismiss are buttons, not links.
      var el = t.closest('[class*="plausible-event-name="]');
      if (!el) return;
      var cls = (el.className && el.className.toString ? el.className.toString() : '') || '';
      var m = cls.match(/plausible-event-name=([^\s]+)/);
      if (!m) return;
      var name = m[1];
      var href = el.getAttribute ? (el.getAttribute('href') || '') : '';
      send(name, propsFrom(el), isAffiliate(name, href));
    } catch (_) {}
  }

  document.addEventListener('click', handler, true);
  // Middle-click navigates without firing 'click'.
  document.addEventListener('auxclick', function (ev) { if (ev.button === 1) handler(ev); }, true);
})();
