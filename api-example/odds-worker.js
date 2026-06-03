/* =====================================================================
   EXAMPLE serverless function — live odds for the table.
   Deploy as a Cloudflare Worker (free) or adapt to Netlify/Vercel.
   It calls an odds API, reshapes the result into the shape the site
   expects, and returns it as JSON. Point ODDS_CONFIG.liveUrl at its URL.

   WHY a function instead of calling the API from the browser?
     • keeps your API key secret (it never reaches the user)
     • lets you reshape the API's format into ours
     • adds CORS + caching in one place

   SETUP (Cloudflare):
     1. Get a free key at the-odds-api.com
     2. Create a Worker, paste this file
     3. Add a secret:  ODDS_API_KEY = <your key>
     4. Set ODDS_CONFIG.liveUrl in config.js to your Worker URL
   ===================================================================== */

const FLAGS = {
  France: "🇫🇷", Argentina: "🇦🇷", Brazil: "🇧🇷", England: "🏴",
  Spain: "🇪🇸", Portugal: "🇵🇹", Germany: "🇩🇪", Netherlands: "🇳🇱",
  Croatia: "🇭🇷", Morocco: "🇲🇦", "United States": "🇺🇸", Uruguay: "🇺🇾"
};
// keep only the teams you want to show, in this order
const SHOW = ["France","Argentina","Brazil","England","Spain","Portugal","Germany"];

export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=60"
    };

    try {
      const url = "https://api.the-odds-api.com/v4/sports/soccer_fifa_world_cup/odds/"
        + "?regions=us&markets=outrights&oddsFormat=american&apiKey=" + env.ODDS_API_KEY;

      const res = await fetch(url);
      if (!res.ok) throw new Error("upstream " + res.status);
      const raw = await res.json();

      // The Odds API returns bookmakers[].markets[].outcomes[] = { name, price }
      // We take the first bookmaker's outright market and map names -> our shape.
      const outcomes =
        (raw?.[0]?.bookmakers?.[0]?.markets?.[0]?.outcomes) || [];

      const byName = {};
      for (const o of outcomes) byName[o.name] = o.price;

      const teams = SHOW
        .filter((name) => byName[name] != null)
        .map((name) => {
          const price = byName[name];
          return {
            team: name,
            flag: FLAGS[name] || "",
            conf: "",                                   // fill if you like
            prob: americanToProb(price),                // % implied by the odds
            odds: (price > 0 ? "+" : "") + price
          };
        })
        .sort((a, b) => b.prob - a.prob);

      const body = JSON.stringify({
        market: "Outright Winner",
        updated: new Date().toISOString(),
        teams
      });
      return new Response(body, { headers: cors });
    } catch (e) {
      return new Response(JSON.stringify({ error: String(e) }), { status: 502, headers: cors });
    }
  }
};

// American odds -> implied probability (%), rounded
function americanToProb(a) {
  const p = a > 0 ? 100 / (a + 100) : -a / (-a + 100);
  return Math.round(p * 100);
}
