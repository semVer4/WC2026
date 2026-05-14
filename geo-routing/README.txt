WC2026 Players / Top Teams
Geo-Language Routing Package

FILES
1. .htaccess
2. index.php
3. lang-switch.php
4. language-switcher-example.php

URL STRUCTURE RECOMMENDATION
- Default language (English) without prefix:
  /
  /players/
  /teams/
  /world-cup-2026-format/
  /host-cities/
  /faq/

- Localized versions with language prefixes:
  /es/
  /es/players/
  /es/teams/
  /es/world-cup-2026-format/
  /es/host-cities/
  /es/faq/

  /pt/
  /fr/
  /de/
  /ru/

ROUTING PRIORITY
1. If the request already uses a language-prefixed URL, do not auto-redirect it.
2. If a language cookie exists and is valid, use it.
3. Otherwise, check Cloudflare CF-IPCountry.
4. If country is not mapped, check Accept-Language.
5. If nothing matches, use English.

WHY THIS AVOIDS REDIRECT LOOPS
- Auto-redirect logic only runs on the root-level English/default entry routes.
- Language-prefixed URLs are excluded from routing.
- The manual switcher always rewrites to a clean target once and stores the cookie.

COOKIE LOGIC
- Cookie name: wc2026_lang
- Lifetime: 180 days
- Path: /
- SameSite: Lax
- HttpOnly: false because frontend UI may need to read it later if you add JS helpers
- Secure: on when HTTPS is detected

FALLBACK LOGIC
- If CF-IPCountry is missing or invalid, rely on Accept-Language.
- If Accept-Language is missing or unsupported, fall back to English.
- If a user manually selects a language, cookie overrides geo/browser detection.

APACHE / CLOUDFLARE NOTES
- Enable Cloudflare IP Geolocation so CF-IPCountry reaches origin.
- Use Vary: Accept-Language, CF-IPCountry, Cookie on routing responses.
- Do not cache routing responses publicly.
- If Cloudflare Full Page Cache is active, bypass cache for routing endpoints or cookie-sensitive pages.

PRACTICAL DEPLOYMENT MODEL
- Keep all real localized content under stable language paths.
- Use index.php only as the entry router for root-level default routes.
- Serve actual localized pages from your CMS/router/static generator under /es/, /pt/, /fr/, /de/, /ru/.
- Keep canonical and hreflang page-specific, not handled by the router itself.
