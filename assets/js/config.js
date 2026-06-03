/* =====================================================================
   SITE CONFIG  —  edit these values, nothing else needed.
   ===================================================================== */

window.SITE_CONFIG = {
  /* ----  YOUR AFFILIATE / REFERRAL LINK  ----
     Paste your bookmaker referral link here ONE time.
     Every banner and CTA button on the whole site will use it. */
  refLink: "https://YOUR-BOOKMAKER-REF-LINK.com/?ref=YOURID",

  /* Short brand name shown on the banner CTA buttons */
  brandName: "BetPartner",

  /* Banner headline text (kept generic & compliant) */
  bannerHeadline: "Get the latest World Cup 2026 odds",
  bannerSub: "New customers • 18+ • T&Cs apply • Bet responsibly",
  bannerCta: "View Odds",

  /* Your live domain (used for canonical links / sharing).
     Replace before going live. */
  siteUrl: "https://YOUR-DOMAIN.com"
};

/* =====================================================================
   LIVE ODDS CONFIG
   ---------------------------------------------------------------------
   The odds table reads its baseline from assets/data/odds-data.js.
   To make it auto-update, set mode:"live" and a liveUrl that returns the
   SAME json shape as ODDS_DATA, i.e.:
     { "market":"Outright Winner", "updated":"<ISO time>",
       "teams":[ {"team","flag","conf","prob","odds"}, ... ] }

   GOOD sources for liveUrl (legal & reliable):
     • An odds API (e.g. The Odds API) — usually via your OWN small
       serverless function that calls the API, normalises it to the shape
       above, and (optionally) hides your API key. Point liveUrl at that.
     • Your betting affiliate's official data feed, if they provide one.

   AVOID scraping a bookmaker site directly: it typically breaches their
   terms, is blocked by bot protection, and breaks constantly.
   ===================================================================== */
window.ODDS_CONFIG = {
  mode: "static",                 // "static" = use odds-data.js only · "live" = also fetch liveUrl
  liveUrl: "",                    // e.g. "https://YOUR-DOMAIN.com/api/odds" (returns ODDS_DATA shape)
  refreshSeconds: 60,             // how often to re-fetch when mode is "live"
  showUpdatedTime: true           // show the "Last updated …" line under the table
};
