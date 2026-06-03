/* =====================================================================
   odds.js  —  renders the odds table and (optionally) keeps it live.
   - Always renders the baseline from window.ODDS_DATA (works on file://).
   - If ODDS_CONFIG.mode === "live", it fetches ODDS_CONFIG.liveUrl every
     refreshSeconds, expecting the same JSON shape, and updates in place.
   - Cells that change briefly flash so users see the movement.
   No framework, no dependencies.
   ===================================================================== */
(function () {
  "use strict";

  var cfg  = window.ODDS_CONFIG || {};
  var tbody = document.querySelector("[data-odds-body]");
  if (!tbody) return; // page has no odds table

  var updatedEl = document.querySelector("[data-odds-updated]");
  var lastByTeam = {}; // remember previous odds string per team to detect change

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function fmtTime(iso) {
    try {
      var d = iso ? new Date(iso) : new Date();
      if (isNaN(d.getTime())) return "";
      return d.toLocaleString("en-GB", {
        hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short"
      });
    } catch (e) { return ""; }
  }

  function render(data) {
    if (!data || !Array.isArray(data.teams)) return;

    var rows = "";
    for (var i = 0; i < data.teams.length; i++) {
      var t = data.teams[i];
      var changed = lastByTeam.hasOwnProperty(t.team) && lastByTeam[t.team] !== t.odds;
      rows +=
        '<tr data-team="' + esc(t.team) + '">' +
          '<td class="rank">' + (i + 1) + "</td>" +
          '<td><span class="team"><span class="team-flag">' + esc(t.flag || "") + "</span>" + esc(t.team) + "</span></td>" +
          "<td>" + esc(t.conf || "") + "</td>" +
          "<td>" + esc(t.prob != null ? t.prob + "%" : "—") + "</td>" +
          '<td><span class="odd-pill' + (changed ? " is-changed" : "") + '">' + esc(t.odds || "—") + "</span></td>" +
        "</tr>";
      lastByTeam[t.team] = t.odds;
    }
    tbody.innerHTML = rows;

    if (updatedEl && cfg.showUpdatedTime !== false) {
      var when = fmtTime(data.updated);
      updatedEl.textContent = when
        ? "Last updated " + when + (cfg.mode === "live" ? " · auto-refreshing" : "")
        : "";
    }
  }

  function fetchLive() {
    if (!cfg.liveUrl) return;
    fetch(cfg.liveUrl, { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) { if (data) render(data); })
      .catch(function () { /* keep showing last good data on error */ });
  }

  // 1) Render baseline immediately so the table is never empty (and SEO-safe:
  //    the static <noscript>/server HTML still holds a copy — see index.html).
  render(window.ODDS_DATA);

  // 2) Go live if configured.
  if (cfg.mode === "live" && cfg.liveUrl) {
    fetchLive();
    var every = Math.max(15, cfg.refreshSeconds || 60) * 1000;
    setInterval(fetchLive, every);
  }
})();
