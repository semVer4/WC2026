# World Cup 2026 Predictions — static site

A fast, SEO-ready static website (HTML/CSS/JS, **no build step**) for World Cup 2026
predictions, with built-in slots for a bookmaker referral banner.

---

## 1. Two ways ads appear (read this)

There are **two separate things** on the site:

### A) Banner / ad-block spaces — you fill these by hand with images
Empty, clearly-labelled placeholder boxes are already placed around the site.
Each looks like a dashed box that says e.g. *"Banner space — 728×90"*.
To use one, **replace the inner contents** of the `.ad-slot` with your own
image + link:

```html
<!-- BEFORE (placeholder) -->
<div class="ad-slot ad-slot--leaderboard">
  <span class="ad-slot__label">…Banner space — 728×90…</span>
</div>

<!-- AFTER (your banner) -->
<div class="ad-slot ad-slot--leaderboard">
  <a href="https://YOUR-REF-LINK.com/?ref=YOURID" target="_blank" rel="sponsored nofollow noopener">
    <img src="assets/img/your-banner-728x90.jpg" alt="Bet on the World Cup 2026" width="728" height="90">
  </a>
</div>
```

Available slot sizes (CSS class → size):
`ad-slot--leaderboard` 728×90 · `ad-slot--billboard` responsive wide ·
`ad-slot--rectangle` 336×280 · `ad-slot--mpu` 300×250 · `ad-slot--halfpage` 300×600.
Put your banner image files in `assets/img/`.

### B) Inline text anchor links — controlled from config.js
Sponsored links inside the article text (e.g. *"best World Cup 2026 odds"*)
are marked with `data-ref-link`. They all point to one URL you set once:

Open **`assets/js/config.js`**:

```js
refLink: "https://YOUR-BOOKMAKER-REF-LINK.com/?ref=YOURID",  // your affiliate link
siteUrl: "https://YOUR-DOMAIN.com"
```

To add a new anchor link in any text, just write:
`<a class="anchor-link" data-ref-link href="#">your anchor text</a>` —
`main.js` automatically sets the URL and adds `rel="sponsored nofollow noopener"`.

## 1.5 Live / auto-updating odds (optional)

The odds table reads its baseline from **`assets/data/odds-data.js`**
(`window.ODDS_DATA`). Edit those numbers any time — that alone keeps the table
accurate manually.

To make it **update automatically**, edit `window.ODDS_CONFIG` in
`assets/js/config.js`:

```js
window.ODDS_CONFIG = {
  mode: "live",                         // "static" or "live"
  liveUrl: "https://YOUR-DOMAIN.com/api/odds",  // must return the ODDS_DATA json shape
  refreshSeconds: 60
};
```

`liveUrl` must return JSON in this exact shape:

```json
{
  "market": "Outright Winner",
  "updated": "2026-06-10T15:00:00Z",
  "teams": [
    { "team": "France", "flag": "🇫🇷", "conf": "UEFA", "prob": 16, "odds": "+550" }
  ]
}
```

When live, the table shows a pulsing **"Last updated …"** line and any odd that
changes briefly **flashes gold**.

### Where to get the live data (pick a legal source)

1. **Odds API (recommended)** — e.g. *The Odds API* has a free tier and returns
   World Cup outright odds as JSON. Don't call it straight from the browser
   (it exposes your API key and the format differs). Instead create a tiny
   **serverless function** (Cloudflare Worker / Netlify Function — both free)
   that: calls the odds API → reshapes it into the JSON above → returns it.
   Point `liveUrl` at that function.
2. **Affiliate data feed / widget** — many betting affiliate programs give you an
   official odds feed or an embeddable live-odds widget with your ref link baked
   in. If yours does, use it: it's sanctioned and zero-maintenance. (For a widget
   you'd drop their snippet into an `.ad-slot` instead of using this table.)

### ⚠️ Don't scrape the bookmaker's site directly
Pulling odds by scraping a bookmaker's pages almost always **breaks their terms
of service**, is blocked by bot protection (Cloudflare/CAPTCHA), and shatters
whenever they tweak their HTML. Use an odds API or an official feed instead — the
table above is built to consume exactly that.

---

## 2. Replace the domain placeholder

Search-and-replace **`YOUR-DOMAIN.com`** with your real domain in:
`index.html`, `winner-prediction.html`, `format-and-groups.html`,
`about.html`, `responsible-gambling.html`, `sitemap.xml`, `robots.txt`.

(Used for canonical tags, Open Graph and the sitemap.)

## 3. Preview locally

It's pure static files — just open `index.html` in a browser.
Or run a tiny local server (better, so JS paths behave):

```powershell
# from the wc2026-predictions folder
python -m http.server 8080
# then open http://localhost:8080
```

## 4. Deploy (pick one — all work with static files)

- **Cloudflare Pages** / **Netlify** / **GitHub Pages** — drag-and-drop the folder
  or connect a repo. Free, fast, HTTPS included.
- **Any shared hosting** — upload the folder contents via FTP to `public_html`.

## 5. Go-live SEO checklist

- [ ] Set `refLink` + `siteUrl` in `config.js`
- [ ] Replace all `YOUR-DOMAIN.com` placeholders
- [ ] Drop your banner images into the `.ad-slot` boxes (see section 1A)
- [ ] (Optional) Swap the included SVG `assets/img/og-image.svg` / `favicon.svg` for your own branding
- [ ] Verify the site in **Google Search Console** and submit `sitemap.xml`
- [ ] Add **Google Analytics** or a privacy-friendly analytics snippet (e.g. Plausible)
- [ ] Double-check betting ads comply with the laws of the countries you target

---

## File structure

```
wc2026-predictions/
├── index.html                 # Homepage
├── winner-prediction.html     # Main SEO article (winner odds) — your money page
├── format-and-groups.html     # Format explainer (great for search traffic)
├── about.html                 # E-E-A-T: who you are / editorial method
├── responsible-gambling.html  # 18+ / compliance (important for ad networks)
├── 404.html
├── sitemap.xml
├── robots.txt
├── matches.html               # Hub: every match prediction (data-driven)
├── match.html                 # Single-match template (reads ?id= from the URL)
└── assets/
    ├── css/style.css
    ├── img/                   # thematic SVGs: hero, trophy, ball, pitch, favicon, og-image
    ├── data/
    │   ├── odds-data.js       # ← EDIT THIS (the outright odds table values)
    │   └── matches-data.js    # ← EDIT THIS (all fixtures + match predictions)
    └── js/
        ├── config.js          # ← EDIT THIS (referral link + live-odds settings)
        ├── odds.js            # renders + live-refreshes the odds table (leave as-is)
        ├── matches.js         # renders the matches hub + each match page (leave as-is)
        └── main.js            # anchor-link wiring + nav (leave as-is)
```

## Match predictions

Every fixture lives in **`assets/data/matches-data.js`** (one array). The hub
page `matches.html` lists them all; each one also gets its own page at
`match.html?id=<slug>` with a full preview, 1X2 odds, recent form and ad slots.

**To add a match**, copy one entry in `matches-data.js`, change the values, and
give it a unique `id`. That's it — it appears on the hub and gets its own page
automatically. Then add its URL to `sitemap.xml`.

> The included fixtures are **samples** (real teams/venues, plausible dates).
> Replace them with the official schedule once confirmed.

**SEO note:** match pages use a `?id=` URL and render with JavaScript, which
Google can index but treats as slightly weaker than a plain static page. If you
want the strongest possible ranking for big games (e.g. "Brazil vs Japan
prediction"), ask for a static pre-rendered version — one real `.html` file per
match instead of the `?id=` template. The current setup is the low-maintenance
option; pre-rendered is the max-SEO option.

---

## How to grow it (more pages = more rankings)

Each new prediction = one more page that can rank. Easy wins, all variations of
the same template:

- "Group A predictions", "Group B predictions" … (one page per group)
- "France World Cup 2026 chances", "Brazil…", "England…" (one per top team)
- Match previews once fixtures are known ("Team A vs Team B prediction")
- "World Cup 2026 Golden Boot odds"

Copy `winner-prediction.html`, change the title/description/H1/content, add the URL
to `sitemap.xml`, and link to it from the homepage.

---

## Notes on the referral / ads

- Banner links use `rel="sponsored nofollow noopener"` and open in a new tab —
  this is the correct, Google-compliant way to mark affiliate/ad links.
- Every page carries an **18+ / bet-responsibly** disclaimer and links to the
  responsible-gambling page. Keep these — many ad networks and hosts require them,
  and they reduce the risk of takedowns.
- Make sure you only show betting offers to users in regions where it's legal,
  and follow your affiliate program's branding/compliance rules.

---

## A note on link-buying SEO

Bought links are against Google's guidelines and carry real risk (penalties /
deindexing), especially in the betting niche which Google watches closely.
What actually makes rankings *stick*: genuinely useful content (this site is built
for that), fast load + clean technical SEO (done), regular fresh pages, and a
natural-looking link profile. If you do buy links, the quality of the site behind
them is what decides whether the spend survives an update — so keep investing in
the content, not just the links.
```
