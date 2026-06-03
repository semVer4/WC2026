/* =====================================================================
   odds-data.js  —  the baseline odds shown before any live data loads.
   This is the SINGLE SOURCE OF TRUTH for the static table. Edit values
   here any time, or let a live feed override them (see config.js + odds.js).

   It's a .js file (not .json) on purpose: it loads via <script>, so the
   table also works when you just double-click index.html (file://), where
   fetching a local .json would be blocked by the browser.

   Each team: { team, flag, conf, prob (0-100), odds (american, e.g. "+550") }
   Keep the list sorted by probability (highest first).
   ===================================================================== */
window.ODDS_DATA = {
  market: "Outright Winner",
  updated: "2026-06-02T18:00:00Z",   // ISO time this baseline was set
  teams: [
    { team: "France",    flag: "🇫🇷", conf: "UEFA",     prob: 16, odds: "+550"  },
    { team: "Argentina", flag: "🇦🇷", conf: "CONMEBOL", prob: 14, odds: "+600"  },
    { team: "Brazil",    flag: "🇧🇷", conf: "CONMEBOL", prob: 13, odds: "+650"  },
    { team: "England",   flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", conf: "UEFA", prob: 11, odds: "+700"  },
    { team: "Spain",     flag: "🇪🇸", conf: "UEFA",     prob: 10, odds: "+750"  },
    { team: "Portugal",  flag: "🇵🇹", conf: "UEFA",     prob: 7,  odds: "+1100" },
    { team: "Germany",   flag: "🇩🇪", conf: "UEFA",     prob: 6,  odds: "+1200" }
  ]
};
