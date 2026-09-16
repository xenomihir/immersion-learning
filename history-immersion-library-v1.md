# History-by-Immersion — Scenario Library v1

This is the seed dataset and sourcing playbook for the learning app. It has four parts:

1. **Where the data comes from** (sources, ranked by usefulness)
2. **The Forces taxonomy** (the vocabulary the whole system is built on)
3. **The scenario schema** (how every scenario is tagged)
4. **20 scenarios** — 10 economics, 10 marketing — each with a learner-facing setup and an answer key

---

## Part 1 — Where the data comes from

You don't scrape Wikipedia. You **curate seeds → write/generate the scenario → validate against point-in-time data**. Here's the stack, ranked by how much work each one saves you.

### A. The "no hindsight" data (most important)
The hardest part of the whole system is presenting a situation *as it looked on the day*, with no future knowledge leaking in. These give you that:

- **ALFRED (alfred.stlouisfed.org)** — FRED's archival twin. It returns the *vintage* of any economic series as it existed on a past date. So you can show GDP/inflation/unemployment exactly as a person in March 2000 would have seen them, before revisions. This is the single most valuable source for the app.
- **SEC EDGAR** — 10-Ks and annual reports as filed. For any company scenario, this is what was actually known at the time.
- **NYT TimesMachine / ProQuest Historical Newspapers / archive.org** — the front page on the day. Use for the "what was the narrative at the time" framing.
- **Our World in Data** — clean long-run series for the slower-moving variables (demographics, trade, energy).

### B. Forecasting & calibration data (powers Step 3 scoring)
Your Step 3 needs something to score against that *isn't* "what happened." These give you expert/crowd probabilities recorded before the outcome was known:

- **Metaculus** — public API, thousands of resolved questions, each with a community probability-over-time graph. This is your "expert consensus at the time" benchmark.
- **Good Judgment Open** — same idea, geopolitics-heavy, shows recent-consensus probability over the life of the question.
- **Tetlock's *Superforecasting* / Good Judgment Project data** — the methodology bible for Brier scoring and calibration.

### C. Narrative seed sources (scenario ideas, pre-structured as cause→effect)
Mine these for events. They've already done the work of finding the obscure-but-instructive story:

- **Cautionary Tales (Tim Harford)** — failures with an explicit moral from economics/psychology. Almost every episode is a ready-made scenario.
- **Acquired** — deep company/strategy histories. Best single source for marketing and business-strategy scenarios.
- **Revisionist History (Gladwell)** — re-examines the overlooked story behind a known event.
- **Planet Money / The Indicator (NPR)** and **Odd Lots (Bloomberg)** — short, sharp economic causal stories.
- **EconTalk (Russ Roberts)** — long-form, idea-dense.

### D. Free structured case repositories
- **MIT Sloan LearningEdge** — entire catalog free, Creative Commons. Best free case library.
- **Yale SOM** (free with registration), **Stanford GSB** free cases, **The Case Centre** (free selection).

### E. Books that are basically scenario mines
- **Ray Dalio, *Big Debt Crises*** — free PDF, literally formatted as repeatable templates of how debt cycles play out. Closest thing to your target format that already exists.
- **Howard Marks's Oaktree memos** (free) + ***The Most Important Thing*** — cycles, second-level thinking.
- **Charlie Munger, *Poor Charlie's Almanack*** — the source of the Forces taxonomy idea (worldly wisdom / mental models).
- **Edward Chancellor, *Devil Take the Hindmost*** and **Kindleberger, *Manias, Panics and Crashes*** — bubbles across history.
- **Robert Cialdini, *Influence*** and **Gladwell, *The Tipping Point*** — the marketing/persuasion forces.
- **Joe Studwell, *How Asia Works*** — development-economics scenarios for Asia.

### F. Your scaling path (after the first ~20 hand-built)
Use the Claude API to draft new scenarios from a structured prompt: feed it `event + date + geography`, instruct it to write the setup using *only* information available by that date, draft the causal chain and tag the forces. Then a human (you, at first) validates the setup against ALFRED/EDGAR/newspaper archives before it goes live. Dalio built his first ~50 templates by hand, then automated — same pattern.

---

## Part 2 — The Forces taxonomy

Everything in the app is tagged with these. This is what makes cross-domain pattern recognition possible and what the personalization layer scores you against. Start with ~25; expand as you go. These deliberately span economics, markets, marketing, and sociology so the same force shows up in different costumes.

**Structural / economic**
- Comparative advantage
- Rent redistribution — who actually captures the value when rules change
- Cross-border spillover — a shock travels via currency, rates, or trade
- Demographic momentum — population effects with multi-decade lags
- Regime change / loss of anchor — when the rules of the game themselves shift
- Crisis-as-enabler — reforms that are impossible until they're necessary

**Game-theoretic / systemic**
- Retaliation & coordination failure — everyone defects, all lose
- Fallacy of composition — what helps one part hurts the whole
- Moral hazard & incentives — people optimize for what they're rewarded on
- Goodhart's Law — when a measure becomes a target, it stops measuring
- Unintended consequences / second- and third-order effects
- Institutions mediate shocks — same shock, opposite outcomes by context (path dependence)

**Behavioral / market**
- Reflexivity — expectations change the outcome they're predicting
- Mean reversion & cycles
- Loss aversion & the endowment effect
- Narrative momentum — the story drives the price drives the story
- Social proof & reciprocity
- Signaling — especially costly signals (credible because they cost you something)

**Marketing / strategy**
- Manufactured scarcity
- Counter-positioning — turning a weakness into the pitch
- Identity & tribal signaling — people buy who they are, not what works
- Buyer ≠ user — the purchaser and the consumer are different people
- Meaning malleability — a product's meaning can change without the product changing
- Problem manufacturing — create the anxiety, then sell the cure
- Distribution-is-the-product — the channel, not the thing, is the innovation

---

## Part 3 — The scenario schema

Every scenario is stored with this metadata. The last two fields are gold for personalization: if you consistently miss the non-obvious force, that's your headline blind spot.

```yaml
id:
title:
mode: Focused | Immersive | Fork
domain_tags: [economics, monetary_policy, trade, ...]
forces: [reflexivity, rent_redistribution, ...]   # from the taxonomy
difficulty: 1-5
obscurity: 1-5                # how likely the learner already knows the ending
date:
geography:
setup: |                      # SHOWN to the learner. Information available as-of-date only. No spoilers.
answer_key:
  causal_chain: |             # Focused: 1st/2nd/3rd-order effects with rough timing
  dominant_forces: |          # Immersive: which forces mattered most and how they interacted
  what_most_people_get_wrong:
  the_non_obvious_force:
  rough_probability_note: |   # for Step 3: was the actual outcome likely or a tail? what was consensus at the time?
```

---

## Part 4 — The scenarios

Each one is written as **SETUP** (the learner sees this, frozen at the date) and **ANSWER KEY** (revealed after they respond). All 20 below are Focused mode ("The Chain" for economics, "Forces of the campaign" for marketing). Immersive and Fork scenarios come next round.

---

# ECONOMICS (10)

---

### E1 — Nixon ends Bretton Woods
`mode: Focused | date: Aug 1971 | geo: USA | difficulty: 3 | obscurity: 2`
`forces: regime_change, reflexivity, cross_border_spillover, unintended_consequences`

**SETUP.** It's August 1971. US gold reserves are draining as foreign governments — France most aggressively — redeem dollars for gold. The dollar is widely seen as overvalued, inflation is climbing, and the fixed $35/oz gold peg that has anchored the world's monetary system since 1944 is under visible strain. President Nixon is about to address the nation. What happens to the dollar, to inflation, and to the global financial system over the next 6 months, 2 years, and 10 years?

**ANSWER KEY.**
- *Causal chain.* **1st order (months):** Nixon suspends gold convertibility, adds an import surcharge and a wage/price freeze; the dollar begins to float and devalue. **2nd order (1–2 yrs):** the attempt to patch the fixed-rate system (Smithsonian Agreement) collapses; by 1973 the world is on floating exchange rates, and with no monetary anchor, 1970s inflation runs hot. **3rd order (decade):** oil is priced in dollars, so OPEC raises prices in 1973 partly to claw back the dollar's lost value; the resulting "petrodollars" get recycled through Western banks and lent to Latin America — which sets up the 1980s LatAm debt crisis. Floating FX becomes the permanent architecture of modern finance.
- *What most people get wrong.* They think it was a story about gold. It was a story about who controls inflation and monetary policy once the anchor is gone.
- *The non-obvious force.* The petrodollar recycling loop — it connects a US monetary decision in 1971 to a Latin American sovereign debt crisis a decade and a continent away.
- *Probability note.* The end of the peg was near-inevitable by 1971; the inflationary decade that followed was *not* a foregone conclusion — better monetary policy could have produced a much milder outcome.

---

### E2 — US trucking deregulation (Motor Carrier Act)
`mode: Focused | date: 1980 | geo: USA | difficulty: 3 | obscurity: 4`
`forces: rent_redistribution, unintended_consequences, comparative_advantage`

**SETUP.** It's 1980. US interstate trucking has been regulated by the Interstate Commerce Commission since 1935 — fixed routes, government-set rates, tight limits on who can enter. Carriers are profitable and the Teamsters union is powerful. President Carter signs a law that largely deregulates the industry: easier entry, freedom to set rates. Trace the effects through the trucking industry and beyond.

**ANSWER KEY.**
- *Causal chain.* **1st order:** entry barriers fall, the number of carriers explodes, freight rates drop sharply. **2nd order:** the Teamster wage premium erodes as non-union carriers proliferate; shippers gain negotiating power; just-in-time logistics becomes economically viable for the first time. **3rd order:** the big winner isn't in trucking at all — it's retailers who can exploit cheap, flexible freight. Walmart's hub-and-spoke distribution + cheap trucking = a structural cost advantage that powers everyday-low-prices and reshapes US retail. **4th order:** the entire modern logistics/3PL industry, and the cost base that later made e-commerce viable.
- *What most people get wrong.* They read it as a trucking story. It's a retail and supply-chain story.
- *The non-obvious force.* When you remove friction from a layer of the economy, the value often gets captured two layers downstream — here, by retailers, not truckers.
- *Probability note.* That deregulation would lower rates was highly likely; that it would midwife the Walmart logistics model specifically was contingent on a firm being ready to exploit it.

---

### E3 — Repeal of the Corn Laws
`mode: Focused | date: 1846 | geo: UK | difficulty: 4 | obscurity: 4`
`forces: rent_redistribution, comparative_advantage, regime_change`

**SETUP.** It's 1846. Britain's Corn Laws — tariffs protecting domestic grain since 1815 — keep bread prices high and protect the income of the landed aristocracy. The Irish potato famine is raging. Prime Minister Robert Peel, a Conservative whose party is the party of the landowners, moves to repeal the tariffs. What follows, economically and politically?

**ANSWER KEY.**
- *Causal chain.* **1st order:** grain imports rise, bread prices fall, real wages of urban workers rise. **2nd order:** cheaper food means cheaper labor for industry, boosting British manufacturing competitiveness; the landed gentry's rents fall, shifting economic power from land to industrial capital. **3rd order:** Britain commits to free trade as ideology for ~70 years; a global grain market (US, Russia, later Argentina) expands to feed Britain. Politically, Peel splits and destroys his own party.
- *What most people get wrong.* It's remembered as famine relief — but it was too slow to help the starving Irish. Its real effect was a structural transfer of power from the landed class to industrial capital.
- *The non-obvious force.* A tariff repeal was, underneath, a redistribution of *political* power between social classes.
- *Probability note.* The economic logic was well understood at the time (Ricardo); the political act of a landowners' party committing class suicide to do it was the genuinely contingent part.

---

### E4 — The Volcker Shock
`mode: Focused | date: 1979 | geo: USA / global | difficulty: 3 | obscurity: 3`
`forces: regime_change, cross_border_spillover, reflexivity, signaling`

**SETUP.** It's late 1979. US inflation is running around 13% and is deeply entrenched in expectations. The new Federal Reserve chairman, Paul Volcker, announces a shift to targeting the money supply and signals he will let interest rates rise as far as necessary. What happens to inflation, the US economy, and the rest of the world?

**ANSWER KEY.**
- *Causal chain.* **1st order:** rates spike toward ~20%, credit seizes, and the US falls into a severe 1981–82 recession with unemployment near 10%. **2nd order:** inflation breaks — down to ~4% by 1983 — and, crucially, inflation *expectations* re-anchor, laying the groundwork for the low-inflation "Great Moderation." **3rd order:** sky-high US rates and a strong dollar make dollar-denominated debt unpayable for emerging markets; Mexico defaults in August 1982, triggering the Latin American debt crisis and a "lost decade." **4th order:** central-bank credibility and independence become the global template for fighting inflation.
- *What most people get wrong.* They stop at "Volcker killed inflation." They miss that the same tightening exported a sovereign debt crisis to the developing world.
- *The non-obvious force.* Monetary tightening in one country is a solvency event for every dollar-borrower on earth.
- *Probability note.* Breaking inflation was likely *if* the Fed held its nerve through the recession — the real uncertainty was political tolerance for ~10% unemployment.

---

### E5 — India's 1991 liberalization
`mode: Focused | date: 1991 | geo: India | difficulty: 3 | obscurity: 3`
`forces: crisis_as_enabler, rent_redistribution, regime_change`

**SETUP.** It's mid-1991. India is nearly out of foreign exchange — reserves cover roughly two weeks of imports — and has had to pledge gold to raise emergency funds. The "License Raj" tightly controls who can produce what. A new government takes office facing imminent default. What does it do, and what does it set in motion?

**ANSWER KEY.**
- *Causal chain.* **1st order:** the rupee is devalued, an IMF program is taken, industrial licensing is largely scrapped, tariffs are cut, and foreign investment is opened up. **2nd order:** the private sector is unleashed, foreign capital enters, and a services/IT export boom begins. **3rd order:** GDP growth re-rates from the ~3.5% "Hindu rate of growth" toward 6–8%; a large urban middle class emerges; India integrates into the global services economy. **4th order:** the IT, outsourcing, and eventually startup economy that defines modern India.
- *What most people get wrong.* The reforms get framed as a visionary choice. They were forced — a balance-of-payments gun to the head made politically impossible reforms suddenly necessary.
- *The non-obvious force.* The binding constraint wasn't a shortage of good ideas; it was the absence of political cover, which only a near-default could supply.
- *Probability note.* Some liberalization was near-certain given the crisis; the *depth* and durability of it was the contingent, impressive part.

---

### E6 — The Plaza Accord
`mode: Focused | date: Sep 1985 | geo: Japan / G5 | difficulty: 4 | obscurity: 3`
`forces: cross_border_spillover, unintended_consequences, narrative_momentum`

**SETUP.** It's September 1985, New York. The US trade deficit is large, the dollar is very strong, and American manufacturers are demanding relief. Finance ministers of the G5 agree to coordinate intervention to weaken the dollar — meaning, in particular, a much stronger Japanese yen. Trace this through the Japanese economy.

**ANSWER KEY.**
- *Causal chain.* **1st order:** the yen appreciates dramatically (roughly 240 to 120 per dollar over two years). **2nd order:** the strong yen hammers Japanese exporters, so the Bank of Japan slashes interest rates to cushion the blow — flooding the system with cheap money. **3rd order:** that cheap money pours into stocks and real estate, inflating a colossal asset bubble (the Nikkei nears 39,000 by end-1989; Tokyo land values reach absurd heights). **4th order:** the bubble bursts in 1990, producing a balance-sheet recession and Japan's "lost decades."
- *What most people get wrong.* It's filed as a successful currency-coordination deal. Arguably it lit the fuse on the Japanese asset bubble.
- *The non-obvious force.* The link from the agreement to the bubble runs through the *central bank's reaction* to the currency shock — not through the trade balance everyone was focused on.
- *Probability note.* The yen's rise was the *intended* outcome; the asset bubble was a policy choice (BoJ over-easing), not an inevitability — which is exactly why it's instructive.

---

### E7 — The Black Death and the end of serfdom
`mode: Focused | date: 1347–1351 | geo: Europe | difficulty: 4 | obscurity: 3`
`forces: rent_redistribution, institutions_mediate_shocks, comparative_advantage`

**SETUP.** It's 1347. Plague has arrived in Europe and over the next four years will kill roughly a third of the population. Assume you're advising a landowner — or a surviving peasant. How does the economic balance of power shift over the following decades, and why might two regions experiencing the identical shock end up in opposite places?

**ANSWER KEY.**
- *Causal chain.* **1st order:** a catastrophic labor shortage. **2nd order:** surviving workers suddenly have bargaining power — wages rise, land rents fall. Lords try to freeze wages by decree (England's Statute of Labourers, 1351) and largely fail. **3rd order:** in Western Europe, serfdom erodes as labor mobility and wage work spread. In Eastern Europe, paradoxically, lords *tightened* control — the "second serfdom." Same shock, opposite institutional response.
- *What most people get wrong.* They treat a disaster as purely destructive. For the survivors, it was one of history's largest transfers of economic power to labor.
- *The non-obvious force.* The outcome was determined by *institutions*, not by the shock. Where peasants had leverage and weak lords, they won freedom; where lords were organized, they won tighter control. The shock was identical; the institutions decided everything.
- *Probability note.* Rising wages after mass death is near-deterministic (supply and demand). The *institutional* outcome (freedom vs. second serfdom) was genuinely path-dependent.

---

### E8 — Smoot-Hawley Tariff
`mode: Focused | date: 1930 | geo: USA / global | difficulty: 2 | obscurity: 3`
`forces: retaliation_coordination_failure, fallacy_of_composition`

**SETUP.** It's 1930. The Depression is beginning. Congress is about to pass a sweeping increase in tariffs intended to protect American farmers and manufacturers. More than a thousand economists have signed a petition begging the President to veto it. He signs anyway. What happens to American exporters and to world trade?

**ANSWER KEY.**
- *Causal chain.* **1st order:** import prices rise. **2nd order:** trading partners retaliate with their own tariffs (Canada and Europe first), and US *exports* collapse. **3rd order:** world trade contracts by roughly two-thirds between 1929 and 1933; the Depression deepens and globalizes; economic nationalism spreads. **4th order:** after WWII, the architects of GATT and the Bretton Woods institutions design the entire postwar trade order specifically to prevent a repeat.
- *What most people get wrong.* They think a tariff "protects." The dominant effect here was the *retaliation*, which made everyone — exporters most of all — worse off.
- *The non-obvious force.* It's a coordination failure: each country protecting itself shrinks the whole pie, and the protectionist ends up hurting his own exporters more than he helps the protected industry.
- *Probability note.* Retaliation was highly predictable (and was predicted). The depth of the trade collapse was amplified by the simultaneous monetary contraction — multiple forces stacking.

---

### E9 — China's One-Child Policy
`mode: Focused | date: 1979–80 | geo: China | difficulty: 3 | obscurity: 2`
`forces: demographic_momentum, unintended_consequences, moral_hazard_incentives`

**SETUP.** It's 1979. China's leadership fears that population growth will outrun the country's resources and introduces a strict one-child limit per family, enforced with real penalties. Project the consequences over the next 10, 30, and 40 years.

**ANSWER KEY.**
- *Causal chain.* **1st order (years):** the birth rate falls sharply. **2nd order (~20 yrs):** a "demographic dividend" — a huge working-age share with few dependents — helps power the 1990s–2000s manufacturing and growth boom. **3rd order (~30–40 yrs):** the bill arrives. Rapid aging, a shrinking workforce after the mid-2010s, the "4-2-1" burden (one child supporting two parents and four grandparents), and a badly skewed sex ratio (~117 boys per 100 girls) from sex-selective abortion — tens of millions of "missing women" and a distorted marriage market. **4th order:** the policy is reversed (two-child in 2016, three-child in 2021), but fertility doesn't bounce back — norms have shifted permanently.
- *What most people get wrong.* They judge it on its stated goal (population control). The second- and third-order demographic and gender consequences dwarf that — and they arrive 30 years later.
- *The non-obvious force.* Demographic momentum is the longest lag in economics. The policy's largest costs landed a full generation after it "worked," and they're nearly impossible to reverse.
- *Probability note.* Aging was a near-certain consequence; the *severity* of the sex-ratio distortion depended on the interaction with cultural son-preference and the availability of ultrasound — forces stacking again.

---

### E10 — The Hartz reforms
`mode: Focused | date: 2003–05 | geo: Germany / Eurozone | difficulty: 4 | obscurity: 4`
`forces: comparative_advantage, cross_border_spillover, regime_change`

**SETUP.** It's the early 2000s. Germany is called "the sick man of Europe" — chronic high unemployment, a rigid labor market, sluggish growth. Chancellor Schröder's government pushes through a set of labor-market reforms (Hartz I–IV): tighter unemployment benefits, job-search obligations, liberalized temp work, and "mini-jobs." Trace the effects inside Germany and across the eurozone.

**ANSWER KEY.**
- *Causal chain.* **1st order:** benefits tighten, labor becomes cheaper and more flexible, employment rises. **2nd order:** German unit labor costs fall relative to its eurozone neighbors; German export competitiveness surges. **3rd order:** Germany runs large, persistent current-account surpluses *inside the euro* — which by accounting identity means mirror-image deficits in southern Europe (Greece, Spain, Portugal). Those imbalances build up the vulnerabilities that detonate in the 2010–12 eurozone crisis. **4th order:** domestically, a large low-wage sector and rising inequality fuel a later political backlash.
- *What most people get wrong.* It's celebrated as the "German jobs miracle." Inside a shared currency, German competitiveness gains were partly its neighbors' *losses* — there's no exchange rate to absorb the adjustment.
- *The non-obvious force.* In a currency union, a national labor reform doubles as a balance-of-payments weapon aimed at your trading partners, because they can't devalue to compete back.
- *Probability note.* The domestic jobs improvement was a fairly direct effect; the link to the eurozone crisis is contested among economists — present it as a strong hypothesis, not settled fact, and let the learner argue it.

---

# MARKETING (10)

---

### M1 — De Beers, "A Diamond Is Forever"
`mode: Focused | date: 1938–47 | geo: USA | difficulty: 3 | obscurity: 3`
`forces: manufactured_scarcity, narrative_momentum, identity_signaling, signaling`

**SETUP.** It's 1938. Diamond prices are depressed, and De Beers — which controls most of the world's diamond supply — hires the ad agency N.W. Ayer with a sweeping goal: make a diamond engagement ring a non-negotiable social norm in America. In 1947 a copywriter coins the line "A Diamond Is Forever." What is the actual strategic machinery here, and what makes it work?

**ANSWER KEY.**
- *Forces at play.* Manufactured scarcity (De Beers deliberately throttles supply). Norm creation (engagement *requires* a diamond; the "two months' salary" guideline is invented out of thin air). Most cleverly, making resale emotionally taboo — if a diamond is "forever," you'd never sell yours, which means no secondary market ever forms to undercut prices. Emotional anchoring fuses romantic love to a hard commodity.
- *What most people get wrong.* They assume demand for diamonds is natural and ancient. It was manufactured in the 20th century — including the social rule about how much you're supposed to spend.
- *The non-obvious force.* The masterstroke wasn't selling diamonds; it was *killing the resale market* by making selling one feel like a betrayal of love — which is what protects the artificial scarcity.
- *Probability note.* That a coordinated, supply-controlling monopolist with a long campaign could create a norm was plausible; the durability (still intact ~80 years later) is the remarkable part.

---

### M2 — Listerine and the invention of "halitosis"
`mode: Focused | date: 1920s | geo: USA | difficulty: 2 | obscurity: 4`
`forces: problem_manufacturing, identity_signaling, narrative_momentum`

**SETUP.** It's the 1920s. Listerine is a general antiseptic — it has been sold as everything from a surgical disinfectant to a floor cleaner. The Lambert company wants a much bigger market. Someone dusts off an obscure medical-sounding term: "halitosis." What do they do with it, and why does it work?

**ANSWER KEY.**
- *Forces at play.* Problem manufacturing — turn an unremarkable fact of life (occasional bad breath) into a named medical condition and a source of social dread. Giving it a clinical name ("halitosis") makes it feel real, shameful, and *treatable*. The ads tie it to social and romantic failure (the famous "often a bridesmaid, but never a bride"). Sales reportedly multiplied many times over within a few years.
- *What most people get wrong.* They think advertising sells solutions. Here the advertising sold the *problem* first; the solution was the easy part.
- *The non-obvious force.* The product never changed. They invented the disease, not the cure — the entire growth came from manufacturing a previously nonexistent anxiety.
- *Probability note.* Manufacturing insecurity is a repeatable playbook (later used for body odor, dandruff, "feminine hygiene"), which is why this is a high-value pattern to internalize.

---

### M3 — The Marlboro Man
`mode: Focused | date: 1955 | geo: USA | difficulty: 3 | obscurity: 3`
`forces: meaning_malleability, identity_signaling, regime_change`

**SETUP.** It's the early 1950s. Marlboro is a *women's* cigarette, marketed for years with the slogan "Mild as May," and it has a filter — and at the time, filters read as feminine. But emerging health worries are pushing men toward filtered cigarettes, and men won't touch a brand coded as a ladies' product. Leo Burnett gets the account. What's the move?

**ANSWER KEY.**
- *Forces at play.* Pure symbolic repositioning. Attach the most aggressively masculine imagery available — the rugged cowboy — to a filtered cigarette to override the feminine coding. The cigarette itself is essentially unchanged; only its *meaning* is rebuilt. It becomes one of the best-selling cigarettes in the world for decades.
- *What most people get wrong.* They assume the formula or the product was the lever. It was 100% identity and symbolism.
- *The non-obvious force.* A product's gender coding is not fixed — you can flip it entirely without changing the product, because meaning lives in the marketing, not the molecule.
- *Probability note.* High-conviction repositioning around a strong identity archetype is a reliable lever; the scale of Marlboro's success was outsized but the *direction* was predictable.

---

### M4 — Volkswagen, "Think Small"
`mode: Focused | date: 1959 | geo: USA | difficulty: 3 | obscurity: 3`
`forces: counter_positioning, signaling, social_proof`

**SETUP.** It's 1959 in America. The car market runs on size, chrome, tailfins, and aspiration. The Volkswagen Beetle is small, plain, and German — carrying obvious postwar baggage. The agency DDB takes the account. How do they sell it?

**ANSWER KEY.**
- *Forces at play.* Counter-positioning — lean *into* the apparent weaknesses (small, plain, cheap) and reframe them as honesty and good sense. The tone is anti-advertising: self-deprecating copy, lots of white space, understatement — which stands out violently in a sea of bombast. Candor builds trust.
- *What most people get wrong.* The instinct is to hide a product's weakness. VW made the weakness the entire pitch.
- *The non-obvious force.* In a market saturated with exaggeration, honesty is the most disruptive position available — it's scarce, so it's valuable.
- *Probability note.* This works specifically *because* everyone else is shouting; the same approach in an already-understated market wouldn't differentiate. Context-dependent, which is a useful nuance to test.

---

### M5 — Avis, "We Try Harder"
`mode: Focused | date: 1962 | geo: USA | difficulty: 2 | obscurity: 3`
`forces: counter_positioning, signaling, identity_signaling`

**SETUP.** It's 1962. Avis is the clear number two in car rental, behind Hertz, and has been losing money for years. DDB takes the account. What's the positioning?

**ANSWER KEY.**
- *Forces at play.* Own your real position in the category rather than fight it. Admit you're #2 — and turn it into the reason to choose you: "We're number two. We try harder." Underdog psychology plus a claim that's *credible because it's an admission against your own interest*. Avis returned to profitability.
- *What most people get wrong.* They think being #2 is something to bury. Avis made #2 a service promise.
- *The non-obvious force.* An admission against interest is more persuasive than any boast — credibility is highest when the statement costs the speaker something.
- *Probability note.* Reliable lever when the category has a dominant #1 and you're a clear #2; doesn't transfer to a fragmented market with no obvious leader.

---

### M6 — New Coke
`mode: Focused | date: 1985 | geo: USA | difficulty: 3 | obscurity: 2`
`forces: goodharts_law, loss_aversion, identity_signaling`

**SETUP.** It's 1985. Pepsi is gaining share, helped by the "Pepsi Challenge" — blind sip tests where consumers tend to prefer Pepsi's sweeter taste. Coca-Cola runs its own extensive blind taste tests, develops a sweeter "New Coke" that *beats* both Pepsi and original Coke in those tests, and replaces the original formula entirely. What happens, and why?

**ANSWER KEY.**
- *Forces at play.* The data lied because the test was wrong. A *sip* test isn't drinking a whole can, and — fatally — it measures nothing about brand attachment. Loss aversion and identity: people didn't want a *better* cola, they wanted *their* cola, and taking it away triggered an outpouring no survey had captured. Coca-Cola reversed course in 79 days.
- *What most people get wrong.* They call it a marketing failure. It was a *research-design* failure — they measured taste and ignored meaning.
- *The non-obvious force.* They optimized the thing that was easy to measure (taste) and destroyed the thing that actually drove the business but was invisible in the test (identity and loyalty). Classic Goodhart's Law.
- *Probability note.* Given how the test was designed, a backlash was more likely than Coke believed — and the eventual relaunch arguably *strengthened* the brand, a genuinely counterintuitive outcome worth making the learner reason through.

---

### M7 — Marlboro Friday
`mode: Focused | date: Apr 2 1993 | geo: USA | difficulty: 4 | obscurity: 3`
`forces: signaling, narrative_momentum, reflexivity, loss_aversion`

**SETUP.** It's April 2, 1993. For about a decade, cheap discount cigarette brands have been steadily taking share from premium brands; deep-discount share has grown from roughly 1% to over a third of the market, and Marlboro's overall share has slipped for six straight months. Philip Morris announces it will cut the price of Marlboro by about 20% (roughly 40 cents a pack) to fight back. What happens — to the stock, to other brands, and to the broader idea of brand value?

**ANSWER KEY.**
- *Forces at play.* The core tension: does cutting price *defend* the franchise or *admit* the brand premium is worthless? The market chose the second reading. Philip Morris stock fell 26% in a day, wiping out over $10 billion, and dragged down Coca-Cola, P&G, and Disney too. Pundits declared "the death of brands" and the arrival of the value-conscious consumer. They were wrong — branding boomed for the next 30 years and Marlboro recovered its share.
- *What most people get wrong.* The famous takeaway ("brands are dead") was itself the mistake. The real lesson is about *signaling* and how markets violently over-read a single ambiguous data point.
- *The non-obvious force.* The price cut's biggest impact wasn't on smokers — it was on what *investors believed* about the durability of brand premiums everywhere. That's reflexivity: a pricing decision reshaped beliefs across unrelated industries in one day.
- *Probability note.* Marlboro recovering share was actually the high-probability outcome (it was still the dominant premium brand); the market's "death of brands" panic was the low-probability narrative that briefly won. Great for teaching the gap between what happened and what was likely.

---

### M8 — Old Spice, "The Man Your Man Could Smell Like"
`mode: Focused | date: 2010 | geo: USA | difficulty: 3 | obscurity: 2`
`forces: buyer_not_user, social_proof, narrative_momentum`

**SETUP.** It's early 2010. Old Spice is seen as your grandfather's brand and is losing the men's body-wash fight to Axe and to Dove Men+Care, which is about to launch on the Super Bowl. Market research surfaces one insight: roughly 60% of body wash is *purchased by women*, often for the men in their lives. How should Old Spice attack?

**ANSWER KEY.**
- *Forces at play.* Buyer ≠ user — so aim the campaign at *women* (the purchasers) even though men are the users. Build it for humor and shareability, then escalate with the real-time "Response" campaign (around 186 personalized videos in ~2.5 days) that turned it into a participatory event and dominated category conversation. Results: the goal was +15% sales; sales rose ~60% by May and ~125% by July, and Old Spice became the #1 men's body wash in the US by year-end.
- *What most people get wrong.* They assume a men's product should be marketed to men. The whole campaign was pointed at women.
- *The non-obvious force.* The decisive insight was identifying *who actually pulls out the wallet* — a different person than the one who uses the product.
- *Probability note.* The "target the purchaser" insight was sound; the *viral* scale was partly luck and timing (the Response campaign caught a social-media moment). Separate the repeatable lesson from the unrepeatable virality when scoring.

---

### M9 — Patagonia, "Don't Buy This Jacket"
`mode: Focused | date: 2011 | geo: USA | difficulty: 3 | obscurity: 3`
`forces: signaling, identity_signaling, counter_positioning`

**SETUP.** It's Black Friday 2011. Patagonia runs a full-page ad in the New York Times with a picture of its best-selling jacket and the headline "Don't Buy This Jacket," detailing the environmental cost of producing it and urging customers to buy less and repair more. Why would a company tell people not to buy its product — and what happens?

**ANSWER KEY.**
- *Forces at play.* Costly signaling to a values-driven tribe — anti-consumption *is* the brand, and being willing to lose sales is exactly what makes the environmental stance believable. Self-selection: it repels customers who don't share the values and deepens loyalty among those who do. Reported result: revenue *grew* in the period after.
- *What most people get wrong.* They read it as anti-marketing. It's precision marketing to a specific segment — and it increased sales.
- *The non-obvious force.* Telling the wrong customers to go away is how you bind the right ones to you. The willingness to forgo revenue is the costly signal that makes the values credible — a boast about being green would have done the opposite.
- *Probability note.* This works only for a brand whose customers genuinely hold the stated value and will reward sincerity; copied by a brand without that authentic base, it backfires. Test whether the learner spots that precondition.

---

### M10 — Tupperware and the party-plan
`mode: Focused | date: 1950s | geo: USA | difficulty: 3 | obscurity: 4`
`forces: distribution_is_product, social_proof, identity_signaling`

**SETUP.** It's the early 1950s. Tupperware is a genuinely good product with a clever airtight "burp" seal — but it sells poorly in stores, because shoppers don't understand it without a demonstration. A saleswoman named Brownie Wise champions a different approach: selling it through home "Tupperware Parties." Why does this work where retail failed?

**ANSWER KEY.**
- *Forces at play.* Distribution *is* the product — the in-person demo solves the comprehension problem that retail couldn't. Social obligation and reciprocity: you buy because your neighbor hosted you in her home. It turns customers into a sales force (the model that later generalizes into direct-selling/MLM) and reaches 1950s housewives in a social context where store advertising couldn't. Tupperware was eventually pulled from stores entirely to protect the party channel.
- *What most people get wrong.* They focus on the plastic. The innovation was the *channel* and its social mechanics, not the product.
- *The non-obvious force.* The identical product failed in stores and won in living rooms — so the channel, not the product, was the decisive variable.
- *Probability note.* High-conviction lesson: when a good product underperforms, look at the channel and the buying *context* before blaming the product.

---

## What's next (not in this file yet)

- **Other domains:** sociology/cultural shifts, technology adoption, geopolitics, operations/strategy — same Focused format.
- **Immersive ("The Storm"):** outcome-first, work-backwards-to-forces scenarios (e.g., "By 1995, US manufacturing employment had collapsed — why?"). These need the dominant-forces-with-weights answer key.
- **Fork ("The Decision"):** put the learner in the room at the decision point, score their judgment against a probability tree of what could have happened.
