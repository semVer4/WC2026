/* =====================================================================
   matches.js  —  powers two pages from window.MATCHES_DATA:
     • matches.html  -> [data-matches-list]  : renders every fixture as a card
     • match.html    -> [data-match-detail]  : renders ONE match (by ?id=slug)
   Pure vanilla JS, no dependencies. Works on file:// (data is a .js file).
   ===================================================================== */
(function () {
  "use strict";

  var data = window.MATCHES_DATA || { matches: [] };
  var matches = data.matches || [];

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function fmtDate(iso) {
    try {
      var d = new Date(iso + "T12:00:00");
      if (isNaN(d.getTime())) return esc(iso);
      return d.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" });
    } catch (e) { return esc(iso); }
  }
  function pickLabel(m) {
    if (m.pick === "home") return esc(m.home) + " win";
    if (m.pick === "away") return esc(m.away) + " win";
    return "Draw";
  }
  function getParam(name) {
    var q = window.location.search.replace(/^\?/, "").split("&");
    for (var i = 0; i < q.length; i++) {
      var kv = q[i].split("=");
      if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || "");
    }
    return "";
  }
  // small W/D/L form strip
  function formStrip(form) {
    var out = "";
    var s = String(form || "");
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i).toUpperCase();
      var cls = c === "W" ? "w" : c === "L" ? "l" : "d";
      out += '<span class="form-pill form-pill--' + cls + '">' + c + "</span>";
    }
    return out;
  }
  // 1X2 odds row; highlights the side we picked
  function oddsRow(m) {
    function cell(side, label, val) {
      var on = m.pick === side ? " is-pick" : "";
      return '<a class="odds1x2__cell' + on + '" data-ref-link href="#" title="Bet on ' + esc(label) + '">' +
               '<span class="odds1x2__lbl">' + esc(label) + "</span>" +
               '<span class="odds1x2__val">' + esc(val) + "</span>" +
             "</a>";
    }
    return '<div class="odds1x2">' +
      cell("home", "1", m.odds.home) +
      cell("draw", "X", m.odds.draw) +
      cell("away", "2", m.odds.away) +
    "</div>";
  }

  /* ----------  HUB: list of all fixtures  ---------- */
  function renderList(el) {
    if (!matches.length) { el.innerHTML = "<p class='muted'>Fixtures coming soon.</p>"; return; }
    var html = "";
    for (var i = 0; i < matches.length; i++) {
      var m = matches[i];
      html +=
        '<a class="fixture" href="match.html?id=' + encodeURIComponent(m.id) + '">' +
          '<div class="fixture__top"><span class="card__tag">' + esc(m.group) + "</span>" +
            '<span class="fixture__date">' + fmtDate(m.date) + " · " + esc(m.time) + "</span></div>" +
          '<div class="fixture__teams">' +
            '<span class="team"><span class="team-flag">' + esc(m.homeFlag) + "</span>" + esc(m.home) + "</span>" +
            '<span class="vs">vs</span>' +
            '<span class="team"><span class="team-flag">' + esc(m.awayFlag) + "</span>" + esc(m.away) + "</span>" +
          "</div>" +
          oddsRow(m) +
          '<div class="fixture__pick"><span class="pick-badge">Our pick</span> ' +
            pickLabel(m) + " · " + esc(m.score) +
            '<span class="fixture__more">Full prediction →</span></div>' +
        "</a>";
    }
    el.innerHTML = html;
  }

  /* ----------  DETAIL: one match  ---------- */
  function renderDetail(el) {
    var id = getParam("id");
    var m = null;
    for (var i = 0; i < matches.length; i++) if (matches[i].id === id) { m = matches[i]; break; }

    if (!m) {
      el.innerHTML = "<h1>Match not found</h1><p class='muted'>This fixture isn't available. " +
        "<a href='matches.html'>Back to all match predictions →</a></p>";
      return;
    }

    // Set document title + meta for SEO/sharing (per match)
    var title = m.home + " vs " + m.away + " Prediction, Odds & Preview — World Cup 2026";
    document.title = title;
    setMeta("description", "Our " + m.home + " vs " + m.away + " prediction for the 2026 World Cup (" +
      m.group + "): " + pickLabel(m) + " " + m.score + ". Odds, form and full match preview.");

    var previewHtml = "";
    for (var p = 0; p < (m.preview || []).length; p++) previewHtml += "<p>" + esc(m.preview[p]) + "</p>";

    el.innerHTML =
      '<p class="muted" style="font-size:.85rem;"><a href="index.html">Home</a> › ' +
        '<a href="matches.html">Matches</a> › ' + esc(m.home) + " vs " + esc(m.away) + "</p>" +

      '<div class="match-hero">' +
        '<span class="card__tag">' + esc(m.group) + "</span>" +
        '<h1>' + esc(m.home) + " vs " + esc(m.away) + " Prediction</h1>" +
        '<div class="meta-row">' +
          "<span>📅 " + fmtDate(m.date) + " · " + esc(m.time) + "</span>" +
          "<span>📍 " + esc(m.venue) + ", " + esc(m.city) + "</span>" +
        "</div>" +
        '<div class="match-hero__teams">' +
          '<div class="match-hero__team"><div class="match-hero__flag">' + esc(m.homeFlag) + "</div>" + esc(m.home) + "</div>" +
          '<div class="match-hero__vs">VS</div>' +
          '<div class="match-hero__team"><div class="match-hero__flag">' + esc(m.awayFlag) + "</div>" + esc(m.away) + "</div>" +
        "</div>" +
      "</div>" +

      '<div class="card pred-box">' +
        '<div><span class="pick-badge">Our prediction</span> <strong>' + pickLabel(m) +
          "</strong> · predicted score <strong>" + esc(m.score) + "</strong></div>" +
        '<div class="confidence"><span>Confidence</span>' +
          '<span class="confidence__bar"><span style="width:' + (m.confidence || 0) + '%"></span></span>' +
          "<span>" + (m.confidence || 0) + "%</span></div>" +
      "</div>" +

      "<h2>Match odds (1X2)</h2>" +
      oddsRow(m) +
      '<p class="muted" style="font-size:.85rem;margin-top:8px;">Illustrative odds — tap a price for the ' +
        'latest line. <a class="anchor-link" data-ref-link href="#">Compare ' + esc(m.home) + " vs " + esc(m.away) +
        " betting odds</a>.</p>" +

      "<h2>Recent form</h2>" +
      '<div class="form-row"><span class="team"><span class="team-flag">' + esc(m.homeFlag) + "</span>" +
        esc(m.home) + "</span> " + formStrip(m.homeForm) + "</div>" +
      '<div class="form-row"><span class="team"><span class="team-flag">' + esc(m.awayFlag) + "</span>" +
        esc(m.away) + "</span> " + formStrip(m.awayForm) + "</div>" +

      "<h2>Match preview &amp; prediction</h2>" +
      previewHtml +

      '<div class="ad-slot ad-slot--leaderboard" style="margin-top:26px;">' +
        '<span class="ad-slot__label"><span class="ad-slot__badge">AD</span> Banner space — 728×90' +
        "<small>replace with your image + referral link</small></span></div>" +

      '<div class="disclaimer" style="margin-top:26px;">' +
        '<span class="age-badge">18+</span><div><strong>Bet responsibly.</strong> Predictions are ' +
        'opinion for entertainment only and do not guarantee any outcome. See our ' +
        '<a href="responsible-gambling.html">responsible gambling</a> page.</div></div>' +

      '<p style="margin-top:24px;"><a href="matches.html">← All World Cup 2026 match predictions</a></p>';

    // re-wire any sponsored links we just injected
    if (window.WIRE_REF_LINKS) window.WIRE_REF_LINKS();
  }

  function setMeta(name, content) {
    var el = document.querySelector('meta[name="' + name + '"]');
    if (!el) { el = document.createElement("meta"); el.setAttribute("name", name); document.head.appendChild(el); }
    el.setAttribute("content", content);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var list = document.querySelector("[data-matches-list]");
    if (list) renderList(list);
    var detail = document.querySelector("[data-match-detail]");
    if (detail) renderDetail(detail);
  });
})();
