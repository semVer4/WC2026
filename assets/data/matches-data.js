/* =====================================================================
   matches-data.js  —  fixtures + predictions, the source of truth for the
   matches hub (matches.html) and each match page (match.html?id=...).

   NOTE: these are SAMPLE fixtures (real teams/venues/dates within the
   tournament window) so the pages look complete. Replace them with the
   OFFICIAL schedule once it's confirmed — just edit this one file.

   Each match:
     id        unique slug -> the URL becomes match.html?id=<slug>
     date      ISO date "2026-06-11"
     time      kickoff label, e.g. "20:00 local"
     group     "Group A"
     venue     stadium name
     city      city, country
     home/away team names
     homeFlag/awayFlag  emoji flags
     odds      { home, draw, away }  american odds, e.g. "+150"
     pick      "home" | "draw" | "away"   (our predicted result)
     score     predicted scoreline "2-1"
     confidence  0-100 (%) how strong the lean is
     homeForm/awayForm  last-5 results, newest last: "WWDLW" (W/D/L)
     preview   array of short paragraphs (the written prediction)
   ===================================================================== */
window.MATCHES_DATA = {
  updated: "2026-06-02T18:00:00Z",
  matches: [
    {
      id: "mexico-vs-croatia",
      date: "2026-06-11", time: "20:00 local", group: "Group A",
      venue: "Estadio Azteca", city: "Mexico City, Mexico",
      home: "Mexico", homeFlag: "🇲🇽", away: "Croatia", awayFlag: "🇭🇷",
      odds: { home: "+175", draw: "+215", away: "+160" },
      pick: "home", score: "2-1", confidence: 52,
      homeForm: "WWDWL", awayForm: "DWWDL",
      preview: [
        "The tournament opens at the iconic Estadio Azteca, and Mexico will ride a wave of altitude, heat and a ferocious home crowd. El Tri have a strong record on home soil and the occasion should lift them.",
        "Croatia remain tactically excellent and dangerous in midfield, but an opening game at altitude against the hosts is the toughest possible start. We lean to a narrow Mexico win, though a draw would not surprise."
      ]
    },
    {
      id: "usa-vs-wales",
      date: "2026-06-12", time: "19:00 local", group: "Group B",
      venue: "SoFi Stadium", city: "Los Angeles, USA",
      home: "United States", homeFlag: "🇺🇸", away: "Wales", awayFlag: "🏴",
      odds: { home: "-130", draw: "+260", away: "+340" },
      pick: "home", score: "2-0", confidence: 58,
      homeForm: "WWDWW", awayForm: "LDWLD",
      preview: [
        "Home advantage, a deeper squad and a young attacking core make the USA clear favourites in their opener. SoFi Stadium will be rocking and the hosts will want a fast start.",
        "Wales will set up to frustrate and hit on the break, but their recent form is patchy. We expect the USA to control the game and take it by two clear goals."
      ]
    },
    {
      id: "canada-vs-belgium",
      date: "2026-06-12", time: "18:00 local", group: "Group C",
      venue: "BC Place", city: "Vancouver, Canada",
      home: "Canada", homeFlag: "🇨🇦", away: "Belgium", awayFlag: "🇧🇪",
      odds: { home: "+220", draw: "+250", away: "+125" },
      pick: "away", score: "1-2", confidence: 50,
      homeForm: "WDLWW", awayForm: "WWDWD",
      preview: [
        "Canada arrive with their strongest-ever generation and a passionate home crowd in Vancouver, and they will not fear anyone. Expect them to play on the front foot.",
        "Belgium still carry more individual quality across the pitch and should edge a high-tempo game. We favour the visitors, but a Canada upset is very much live."
      ]
    },
    {
      id: "argentina-vs-nigeria",
      date: "2026-06-13", time: "21:00 local", group: "Group D",
      venue: "MetLife Stadium", city: "New York/New Jersey, USA",
      home: "Argentina", homeFlag: "🇦🇷", away: "Nigeria", awayFlag: "🇳🇬",
      odds: { home: "-160", draw: "+280", away: "+420" },
      pick: "home", score: "2-0", confidence: 62,
      homeForm: "WWWDW", awayForm: "WDWLW",
      preview: [
        "The defending champions begin at MetLife Stadium, the venue for the final, and Argentina will want to set the tone early. Their settled, confident core remains a class apart.",
        "Nigeria have the pace to threaten on the counter and should not be underestimated, but Argentina's control and big-game composure should see them through comfortably."
      ]
    },
    {
      id: "france-vs-norway",
      date: "2026-06-13", time: "18:00 local", group: "Group E",
      venue: "AT&T Stadium", city: "Dallas, USA",
      home: "France", homeFlag: "🇫🇷", away: "Norway", awayFlag: "🇳🇴",
      odds: { home: "-145", draw: "+270", away: "+380" },
      pick: "home", score: "3-1", confidence: 60,
      homeForm: "WWWWD", awayForm: "WWDWW",
      preview: [
        "Tournament favourites France open under the roof in Dallas. Their blend of pace and depth is built for a long competition, and they will expect to win their group comfortably.",
        "Norway are a rising side with genuine match-winners and real threat in attack. They can score here — but France's overall quality should prove decisive in an entertaining game."
      ]
    },
    {
      id: "brazil-vs-japan",
      date: "2026-06-14", time: "20:00 local", group: "Group F",
      venue: "Mercedes-Benz Stadium", city: "Atlanta, USA",
      home: "Brazil", homeFlag: "🇧🇷", away: "Japan", awayFlag: "🇯🇵",
      odds: { home: "-135", draw: "+260", away: "+360" },
      pick: "home", score: "2-1", confidence: 55,
      homeForm: "WWDWW", awayForm: "WWWDL",
      preview: [
        "Brazil bring arguably the deepest attacking talent on the planet to Atlanta. If their structure holds, they have the individual quality to break any defence down.",
        "Japan are well-drilled, brave on the ball and capable of upsetting a big nation, as recent tournaments have shown. We still favour Brazil, but expect Japan to make it competitive."
      ]
    },
    {
      id: "england-vs-ecuador",
      date: "2026-06-14", time: "17:00 local", group: "Group G",
      venue: "NRG Stadium", city: "Houston, USA",
      home: "England", homeFlag: "🏴", away: "Ecuador", awayFlag: "🇪🇨",
      odds: { home: "-150", draw: "+270", away: "+400" },
      pick: "home", score: "2-0", confidence: 57,
      homeForm: "WDWWW", awayForm: "DWLDW",
      preview: [
        "England finally look like a tournament team rather than a collection of names, with elite attackers now backed by midfield control. The indoor cool of NRG Stadium suits their game.",
        "Ecuador are athletic, organised and tough to break down, and will sit deep. We expect England to be patient and win by two without ever being in real danger."
      ]
    },
    {
      id: "spain-vs-uruguay",
      date: "2026-06-15", time: "19:00 local", group: "Group H",
      venue: "Hard Rock Stadium", city: "Miami, USA",
      home: "Spain", homeFlag: "🇪🇸", away: "Uruguay", awayFlag: "🇺🇾",
      odds: { home: "-120", draw: "+250", away: "+300" },
      pick: "draw", score: "1-1", confidence: 44,
      homeForm: "WWWDW", awayForm: "WDWWD",
      preview: [
        "Spain's possession game travels well and their young core keeps improving, but Miami's heat and humidity will test everyone's legs in the afternoon sun.",
        "Uruguay are tactically mature and capable of frustrating any favourite, with the quality to nick a goal. This has the look of a tight, low-scoring contest — we lean to a share of the spoils."
      ]
    }
  ]
};
