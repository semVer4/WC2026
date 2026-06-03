/* =====================================================================
   main.js  —  small helpers only.
   - Wires inline text anchor links [data-ref-link] to your referral URL.
   - Mobile nav + footer year.
   Banners are now STATIC placeholder slots in the HTML (.ad-slot) that you
   replace by hand with your own <a><img></a>. See README.
   ===================================================================== */
(function () {
  "use strict";
  var cfg = window.SITE_CONFIG || {};

  // Point every inline [data-ref-link] anchor at your referral URL, open in a
  // new tab, and mark it correctly for Google (sponsored + nofollow).
  function wireRefLinks() {
    var links = document.querySelectorAll("[data-ref-link]");
    for (var i = 0; i < links.length; i++) {
      links[i].setAttribute("href", cfg.refLink || "#");
      links[i].setAttribute("target", "_blank");
      links[i].setAttribute("rel", "sponsored nofollow noopener");
    }
  }
  // Exposed so dynamically-rendered pages (e.g. match.html) can re-wire links
  // they inject after load.
  window.WIRE_REF_LINKS = wireRefLinks;

  function wireNav() {
    var btn = document.querySelector(".nav__toggle");
    var menu = document.querySelector(".nav__menu");
    if (btn && menu) btn.addEventListener("click", function () { menu.classList.toggle("is-open"); });
  }

  function setYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = "2026";
  }

  document.addEventListener("DOMContentLoaded", function () {
    wireRefLinks();
    wireNav();
    setYear();
  });
})();
