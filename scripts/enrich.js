/* ────────────────────────────────────────────────────────────────
   enrich.js — upgrades the seeded scenarios in two ways:

   1. mode: re-tags the genuinely cross-domain / cross-border economic
      scenarios as "Immersive" (forces span multiple systems at once),
      leaving single-domain ones as "Focused".
   2. setup: replaces the one-paragraph hook with a comprehensive,
      spoiler-free "~2 page" briefing (markdown) that gives enough
      context, data, and tension to genuinely test the learner.

   Records are matched by the internal code prefix in the title
   ("E1 — …", "M10 — …"). Run with:  node scripts/enrich.js
   ──────────────────────────────────────────────────────────────── */

const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/* mode reclassification — 7 cross-system scenarios become Immersive */
const IMMERSIVE = new Set(['E1', 'E3', 'E4', 'E6', 'E7', 'E8', 'E10']);

/* ── The briefings ──────────────────────────────────────────────── */
const BRIEFINGS = {
  E1: `It is the summer of 1971, and the financial architecture the Western world has lived inside since 1944 is visibly buckling.

## The order that is cracking
At Bretton Woods in 1944, the Allied powers built a monetary system with the US dollar at its center. The dollar was fixed to gold at **$35 an ounce**, and every other major currency was pegged to the dollar. Foreign governments could, in principle, hand the United States dollars and demand gold in return. For a quarter century this arrangement gave the world a stable anchor: predictable exchange rates, booming trade, and an American currency that was, quite literally, "as good as gold."

## The pressure building underneath
That promise now looks dangerously hollow. Years of spending on the Vietnam War and the Great Society programs at home have pushed more dollars into the world than America holds gold to back. Inflation is climbing toward 5–6%. For the first time in the twentieth century, the United States is sliding toward a **trade deficit**. Foreign confidence is draining: France, under a long-running conviction that the dollar enjoys an "exorbitant privilege," has been aggressively converting its dollars into gold and shipping the bullion home. Others are quietly preparing to do the same.

The structural trap has a name economists already use — the **Triffin dilemma**: to supply the world with the dollars it needs for trade, America must run deficits, but the more dollars it exports, the less credible the promise to redeem them all for gold becomes. The anchor and the world's appetite for dollars are working against each other.

## Who is in the room
- **President Nixon**, focused on the 1972 re-election and unwilling to tolerate either rising unemployment (near 6%) or a humiliating run on American gold.
- **Treasury Secretary John Connally**, a forceful Texan who will soon tell the world that the dollar "is our currency, but your problem."
- **Fed Chairman Arthur Burns**, worried about inflation but politically entangled.
- **Paul Volcker**, the Treasury under-secretary for monetary affairs, quietly mapping the options.
- **Foreign governments and central banks**, holding more dollars than they trust and ready to bolt.

## The numbers on the table
- Gold peg: **$35/oz**, unchanged since 1934.
- US gold reserves: down from roughly **$25 billion after the war to around $10 billion**, against far larger foreign dollar holdings.
- Inflation: **~4–6% and rising**; unemployment: **~6%**.
- The dollar is widely judged **overvalued** against the German mark and Japanese yen.

## Your task
Nixon is about to address the nation with a dramatic economic package. Do not stop at the headline act — reason through the consequences across three horizons:
- **~6 months:** What happens to the dollar's value and to the fixed-rate system once confidence breaks?
- **~2 years:** Can a patched-up version of fixed exchange rates survive, or does something more fundamental give way? What happens to inflation once the old anchor is gone?
- **~10 years:** How does this reshape the deep architecture of global finance — exchange rates, the role of the dollar, the price of oil, and the flow of capital to the developing world?

Trace the chain, name the forces driving each turn, decide which one most analysts will miss, and commit to a probability before you read the record.`,

  E2: `It is 1980, and an industry that has run on government permission slips for forty-five years is about to be set loose.

## How trucking works today
Since the **Motor Carrier Act of 1935**, interstate trucking has been tightly governed by the **Interstate Commerce Commission (ICC)**. The ICC decides who may operate, which routes they may serve, and what rates they may charge. A carrier wanting to haul a new commodity or serve a new city must petition the ICC and often fight off objections from existing carriers. Operating authority itself has become a valuable asset, bought and sold like a license.

The result is an orderly, profitable, and protected industry. Rates are stable and high. The **Teamsters union** is one of the most powerful in America, and unionized drivers earn a substantial wage premium. Empty backhauls are common because the rules make it hard to pick up return freight. Almost everyone inside the system — carriers and drivers alike — does well by it.

## The pressure to change
The late 1970s have soured on regulation. Inflation is punishing, and economists across the political spectrum argue that ICC rules inflate shipping costs for every product that moves by road. A deregulation wave is already touching airlines and rail. President **Carter** signs the **Motor Carrier Act of 1980**, which dramatically loosens the rules: far easier entry for new carriers, and broad freedom to set rates.

## Who is affected
- **Incumbent carriers**, whose protected routes and pricing power are suddenly exposed.
- **The Teamsters**, whose wage premium rests on limited competition.
- **New entrants**, who can now buy a truck and compete.
- **Shippers** — the manufacturers and retailers who pay to move goods — who stand to gain bargaining power.
- And, less obviously, **anyone downstream** whose business model is shaped by the cost and flexibility of freight.

## The numbers and the setup
- Regulation in place since **1935**; tens of thousands of carriers operate under ICC authority.
- Trucking is the dominant mode for moving finished goods across the country.
- Union density is high; driver wages carry a clear premium over comparable work.

## Your task
Deregulation will obviously stir up the trucking industry — but the instructive question is where the value ultimately lands. Reason across horizons:
- **~6 months–2 years:** What happens to the number of carriers, to freight rates, and to the Teamster wage premium?
- **~2–5 years:** As freight becomes cheap and flexible, which *other* industries can suddenly redesign how they operate?
- **~10+ years:** When you remove friction from one layer of the economy, who captures the gains two layers downstream — and what entirely new industries does that enable?

Trace the chain, name the forces, and decide who the real winner turns out to be.`,

  E3: `It is 1846, and a British prime minister is preparing to commit an act of political self-destruction in the name of cheaper bread.

## The laws in question
The **Corn Laws** — "corn" meaning grain of all kinds — have protected British agriculture since 1815 with tariffs that keep foreign grain out and domestic prices high. Their direct beneficiaries are the **landed aristocracy**, whose rents depend on high grain prices, and who dominate Parliament. Their cost falls on **urban workers and the new industrial class**, who pay more for bread and, indirectly, for the labor that bread sustains.

This is not a narrow tax dispute. It is a contest between two visions of Britain: the old order of land and aristocracy, and the rising order of factories, free trade, and industrial capital.

## The forces converging
- The **Anti-Corn Law League**, led by Richard Cobden and John Bright, has spent years building one of the first modern mass political campaigns, arguing that cheap food means a richer, more competitive Britain.
- The **economic theory** is already well developed: David Ricardo's argument for comparative advantage and the gains from trade is decades old and widely understood among the educated.
- The **Irish potato famine** is now raging across the Irish Sea, and the human catastrophe gives the repeal cause a terrible urgency.
- **Prime Minister Sir Robert Peel** leads the Conservatives — the very party of the landowners — yet has become convinced that repeal is right.

## Who pays, who gains
- **Landowners** stand to see their protected rents fall.
- **Industrial manufacturers** stand to gain cheaper labor and a freer trading world.
- **Urban workers** stand to gain cheaper bread and higher real wages.
- **Peel himself** stands to gain nothing personally — and to split his own party by acting against the class that put him in power.

## The numbers and the moment
- Tariffs in place since **1815**.
- Britain is the workshop of the world, its industry hungry for export markets and cheap inputs.
- A landowning Parliament is being asked to vote against its own economic interest.

## Your task
Repeal looks like a story about bread and famine relief. Look deeper and reason it forward:
- **Short run:** What happens to grain imports, bread prices, and the real wages of urban workers?
- **Medium run:** How does cheaper food reshape the competitiveness of British industry — and the balance of economic power between landowners and industrial capital?
- **Long run:** What does this commit Britain to ideologically for the next several decades, what global trade patterns does it summon into being, and what happens to Peel's party?

Trace the chain, name the dominant force underneath the surface, and assign your probability.`,

  E4: `It is late 1979, and a tall, cigar-chewing new Federal Reserve chairman is about to declare war on an enemy that has defeated every policymaker before him: entrenched inflation.

## The disease
American inflation is running around **13%** and, far worse, it has burrowed into expectations. Workers demand cost-of-living raises because they expect prices to rise; firms raise prices because they expect costs to rise; the spiral feeds itself. Two oil shocks (1973 and 1979) have hammered the economy. The dollar is weak, gold is soaring, and confidence that anyone can control prices has nearly evaporated. The painful new word of the decade is **"stagflation"** — stagnant growth and high inflation together, a combination the old economic playbook said should not even be possible.

## The new sheriff
**Paul Volcker**, appointed to chair the Fed in August 1979, believes inflation will never break until the Fed is willing to inflict real pain. In October he announces a fundamental shift: the Fed will target the **growth of the money supply** rather than smoothing interest rates, and will let rates rise **as far as necessary** to choke inflation out. This is both a technical change and, crucially, a **signal** — a public commitment to hold the line through whatever comes.

## Who is exposed
- **The US economy:** households and businesses dependent on credit, as rates climb toward the unthinkable.
- **Workers**, especially in interest-sensitive industries like housing, autos, and construction.
- **Politicians**, who must tolerate (or not) the unemployment that tight money will produce in an election cycle.
- **The developing world:** governments and banks across Latin America that have borrowed heavily in **dollars at floating rates** during the cheap-money 1970s.

## The numbers on the table
- Inflation: **~13%**.
- The federal funds rate is being pushed sharply upward, ultimately toward **~20%**.
- Latin America has absorbed a flood of recycled "petrodollars" as dollar-denominated, floating-rate debt.

## Your task
"Volcker killed inflation" is the easy summary. Resist it and reason through the whole system:
- **~1–2 years:** What does ~20% interest do to credit, to growth, and to unemployment? What is the political cost?
- **~2–4 years:** Does inflation actually break — and do *expectations* re-anchor? What does that set up for the decades after?
- **Globally:** What does a strong dollar and sky-high US rates do to every borrower on earth who owes in dollars? Where does the crisis surface that has nothing to do with American inflation?

Trace the chain, identify the cross-border force that turns a domestic policy into a foreign solvency event, and commit to your probability.`,

  E5: `It is mid-1991, and the world's largest democracy is roughly two weeks from running out of money.

## The wall India has built
Since independence, India has run a tightly planned economy often called the **"License Raj."** To open a factory, expand output, import a machine, or enter a new line of business, a private firm must obtain government licenses — a maze of permits that protects incumbents, throttles competition, and keeps India largely closed to foreign goods and capital. Tariffs are among the highest in the world. The economy has grown for decades at a sluggish pace cynically nicknamed the **"Hindu rate of growth,"** around 3.5% a year, even as East Asia races ahead.

## The crisis at the door
A balance-of-payments emergency has now arrived. Foreign-exchange reserves have dwindled to roughly **two weeks of imports**. The Gulf War has spiked oil prices and cut remittances from Indian workers abroad. To raise emergency cash and avoid outright default, India has had to physically **airlift gold** to pledge as collateral to the Bank of England and the Bank of Japan — a national humiliation. A new government under Prime Minister **P. V. Narasimha Rao**, with **Manmohan Singh** as finance minister, takes office facing imminent insolvency.

## Who holds the cards
- **The reformers** (Rao, Singh) who may use the emergency to do what was politically impossible before.
- **The IMF**, whose emergency lending comes with conditions.
- **Entrenched interests** — protected industrialists and the bureaucracy — who benefit from the License Raj.
- **A vast, young population** whose economic future hangs on the choices made in the next months.

## The numbers and the moment
- Reserves: **~2 weeks of import cover**.
- Trend growth: **~3.5%**, far below Asian peers.
- Tariffs and licensing: among the most restrictive in the world.

## Your task
A reform under a gun to the head is not the same as a reform freely chosen. Reason it through:
- **Short run:** What immediate measures does a near-default force — on the currency, on licensing, on tariffs, on foreign investment?
- **Medium run:** If the private sector and foreign capital are unleashed, which sectors respond first?
- **Long run:** Can a forced, crisis-driven liberalization become deep and durable enough to re-rate the entire growth trajectory of a nation of hundreds of millions — and which force, more than vision, made it stick?

Trace the chain, name the enabling force, and assign your probability.`,

  E6: `It is September 1985, and in a gilded room at New York's Plaza Hotel the finance ministers of the five richest economies are about to agree to deliberately crash the value of the dollar.

## The imbalance
The US dollar has become enormously strong, driven up by Volcker's high interest rates and a flood of foreign capital. A strong dollar makes American exports expensive and imports cheap, and the **US trade deficit has ballooned**. American manufacturers — autos, steel, machinery — are being undercut and are lobbying furiously in Congress for **protectionist tariffs**. The political pressure to "do something" about the deficit is intense, and a trade war is a real possibility.

## The deal
To relieve that pressure without tariffs, the **G5** (United States, Japan, West Germany, France, and the United Kingdom) agree at the Plaza Hotel to **coordinate intervention in currency markets to push the dollar down** — and, in particular, to push the Japanese **yen** and German mark sharply **up**. The logic is straightforward: a weaker dollar should, over time, narrow the American trade gap and let off the protectionist steam.

## Who is in the room — and who will react
- **US Treasury (James Baker)**, seeking trade relief and a defused Congress.
- **Japan's Ministry of Finance and the Bank of Japan**, agreeing to a much stronger yen that will hammer Japan's export champions.
- **West Germany**, similarly accepting a stronger mark.
- The unspoken fourth player: **how each central bank responds** to the shock its own economy now absorbs.

## The numbers and the setup
- Starting point: the yen trades around **240 per dollar**.
- The intended move: a large, coordinated **appreciation of the yen and mark** (the yen will head toward ~120/$ over two years).
- Japan's economy is deeply dependent on exports; a soaring yen threatens its industrial heartland.

## Your task
This is filed in textbooks as a successful act of currency cooperation. Reason past the headline:
- **~1–2 years:** What does a rapidly appreciating yen do to Japanese exporters — and how is the Bank of Japan likely to respond to cushion the blow?
- **~2–4 years:** Where does that policy response send cheap money flowing inside Japan?
- **~5–10 years:** What does the central bank's reaction — not the trade balance everyone is watching — ultimately do to Japanese asset prices and to the following decade?

Trace the chain, locate the non-obvious link that runs through the central bank's reaction rather than the trade flows, and commit to your probability.`,

  E7: `It is 1347. A pestilence carried on ships and rumor is arriving in Europe, and over the next four years it will kill perhaps **a third of everyone alive** on the continent.

## A world of fixed places
Medieval Europe is built on **serfdom** and the manor. Most people are peasants bound to the land, owing labor and dues to a lord in exchange for protection and the right to farm. Labor is abundant and cheap; land is the scarce, precious asset; and the legal and social order assumes this will never change. Wages are low, rents are high, and a peasant's bargaining power is essentially nil — because there is always another pair of hands.

## The shock
The **Black Death** inverts the oldest fact of this economy. Within a few years, the relationship between people and land flips: suddenly **labor is desperately scarce** and land sits idle for want of hands to work it. The survivors find themselves holding something they have never had before — leverage.

## The tension
Lords will not surrender the old order quietly. Across Europe, rulers will try to **freeze wages and bind peasants in place by decree** (England will pass its Statute of Labourers in 1351). The question is whether such laws can hold against the raw arithmetic of supply and demand — and, crucially, whether the *same* shock produces the *same* result everywhere.

## Who is in the play
- **Surviving peasants and laborers**, suddenly able to bargain, move, or demand wages.
- **Landowners**, watching rents fall and labor costs rise, reaching for the law to stop it.
- **Monarchs and local power structures**, whose strength or weakness will shape what is actually enforceable.
- **Two regions** — call them Western and Eastern Europe — about to receive an identical biological shock through very different institutions.

## The numbers and the setup
- Mortality: roughly **30–60%** of the population over **1347–1351**.
- The pre-existing order: serfdom, cheap labor, expensive land, weak peasant leverage.

## Your task
A catastrophe this total feels purely destructive. For the survivors, reason about who gains power:
- **Over the following decades:** What happens to wages and to land rents when a third of the workforce vanishes? Can wage-freezing decrees succeed?
- **The deeper puzzle:** Why might **two regions hit by the identical shock end up in opposite places** — one drifting toward freedom and wage labor, the other toward tighter bondage?

Trace the chain, identify the force that decides the outcome even though the shock was the same everywhere, and assign your probability.`,

  E8: `It is 1930. The economy is sliding into what does not yet have a name — the Great Depression — and Congress's answer is to raise a wall around America.

## The bill
The **Smoot-Hawley Tariff Act** is about to sharply raise US tariffs on thousands of imported goods. Its stated purpose is to protect American farmers, already battered by collapsing crop prices, and to shield domestic manufacturers from foreign competition as unemployment climbs. To its sponsors and many in Congress, the logic feels like common sense: keep foreign goods out, and American producers and jobs will be spared.

## The warning
The economics profession disagrees almost unanimously. More than **a thousand economists** sign a public petition begging President **Hoover** to veto the bill, warning that tariffs this steep will raise prices for consumers, fail to help the groups they target, and — most dangerously — **invite retaliation** from America's trading partners. Business leaders, including Henry Ford, lobby against it. Hoover privately dislikes it. He signs it anyway.

## The mechanism to reason about
A tariff feels like a one-sided move: *we* raise *our* wall, *they* are kept out. But trade is a web of relationships. Other countries export to America and hold their own struggling farmers and factories. The central question is what **they** do in response — and what happens to American **exporters** when they do.

## Who is exposed
- **American consumers**, who will pay more for tariffed goods.
- **American exporters** — especially farmers selling wheat, cotton, and machinery abroad — who depend on open foreign markets.
- **Trading partners** (Canada and Europe first), each with domestic industries to protect and a public demanding reciprocity.
- **The world trading system** as a whole, already fragile in a contracting global economy.

## The numbers and the setup
- The Depression is just beginning; unemployment is rising fast.
- World trade is large but vulnerable, and many countries are simultaneously contracting their money supplies.
- The tariff covers a vast range of goods at sharply higher rates.

## Your task
"A tariff protects" is the intuition. Reason about the system, not the slogan:
- **Short run:** What happens to import prices, and how do trading partners respond?
- **Medium run:** What happens to American *exports* once retaliation spreads — and to the total volume of world trade?
- **Long run:** How deep does the contraction go when every nation protects itself at once, and what do postwar institution-builders later design specifically to prevent a repeat?

Trace the chain, name the coordination failure at its heart, and commit to your probability.`,

  E9: `It is 1979, and China's leaders, fearing that a surging population will swallow the gains of the reforms they are just beginning, are about to legislate the most intimate decision a family makes.

## The fear
China's population has grown rapidly, and the leadership under Deng Xiaoping is convinced that runaway numbers will outpace food, jobs, and the country's ability to modernize. The proposed remedy is sweeping: a **strict limit of one child per family**, enforced with real penalties — fines, social pressure, and administrative force — and exceptions only at the margins. The policy is framed as a hard but necessary act of national planning.

## The forces in motion
- **Demographic momentum:** population structures change slowly and carry effects forward for generations. A birth-rate change today reshapes the workforce, the elderly population, and the ratio between them decades from now.
- **Incentives and enforcement:** when the state attaches heavy penalties to a deeply personal choice, families will adapt in ways the planners may not intend.
- **Culture:** a strong traditional preference for sons sits underneath the policy, and a new technology — **ultrasound** — is beginning to make the sex of an unborn child knowable.

## Who is affected
- **Families**, navigating a one-child limit against deep cultural expectations.
- **The future workforce and economy**, which will first swell with workers and later thin out.
- **The elderly of the future**, increasingly dependent on a shrinking base of young adults.
- **An entire generation of children**, whose sex ratio may be quietly distorted.

## The numbers and the setup
- The policy begins in **1979–80**.
- China is labor-rich and just opening to the world; a large young workforce is about to power an industrial boom.
- The natural sex ratio at birth is roughly **105 boys per 100 girls**; cultural son-preference plus new technology could push it far higher.

## Your task
Judge this not by its stated goal but by the long arc of its consequences, across very different timescales:
- **~10 years:** What happens to the birth rate, and what kind of workforce does that create?
- **~20 years:** How does a large working-age share with few dependents affect growth — the "demographic dividend"?
- **~30–40 years:** When the bill comes due, what does the age structure look like? What happens to the ratio of workers to retirees, to the marriage market, and to the sex ratio — and can any of it be reversed by simply repealing the policy later?

Trace the chain across decades, name the force with the longest lag in all of economics, and assign your probability.`,

  E10: `It is the early 2000s, and the country once celebrated as Europe's economic engine is being called, to its face, **"the sick man of Europe."**

## The malaise
Germany is stuck. Unemployment is chronically high, growth is sluggish, and its labor market is famously rigid — generous and open-ended unemployment benefits, strong protections, and high barriers to flexible work. Reunification has been costly, and the country has entered the **euro**, meaning it can no longer devalue its own currency to regain competitiveness. The old levers are gone, and the economy feels sclerotic.

## The reform
Chancellor **Gerhard Schröder's** government pushes through a politically explosive package known as the **Hartz reforms (Hartz I–IV)**, phased in across 2003–2005. They **tighten unemployment benefits** (especially long-term support), impose **job-search obligations**, **liberalize temporary and agency work**, and create low-hour **"mini-jobs."** The aim is to make German labor cheaper, more flexible, and more attractive to employ.

## The crucial context: the euro
This is where the scenario stops being purely domestic. Inside a shared currency, a country cannot devalue to become more competitive — it can only get cheaper by holding down its own **costs and wages** relative to its neighbors. So a German labor reform is not just a domestic jobs policy; it changes Germany's competitive position **against France, Italy, Spain, Greece, and Portugal**, who share the euro and cannot devalue back.

## Who is affected
- **German workers**, gaining jobs but also a growing low-wage sector.
- **German exporters**, whose relative costs are about to fall.
- **Germany's eurozone partners**, whose competitiveness is defined *relative* to Germany's.
- **The architecture of the euro itself**, which has no mechanism to absorb large, persistent imbalances between members.

## The numbers and the setup
- Reforms phased in **2003–2005**.
- Germany shares a currency it cannot devalue with much of southern Europe.
- Current-account balances within the eurozone are an accounting mirror: one country's large surplus is another's deficit.

## Your task
This is remembered as the "German jobs miracle." Reason about the whole currency union, not just Germany:
- **Short run:** What happens to German employment, labor costs, and export competitiveness?
- **Medium run:** If German unit labor costs fall relative to its neighbors *inside a shared currency*, what must happen to trade balances across the eurozone?
- **Long run:** How do persistent German surpluses and mirror-image southern deficits build up the vulnerabilities that detonate in the **2010–12 eurozone crisis** — and what is the domestic political backlash to a large low-wage sector?

Trace the chain across borders, name the force that turns a national labor reform into a balance-of-payments weapon, and assign your probability. (Economists genuinely contest the strength of this link — argue your case.)`,

  M1: `It is 1938. Diamond prices are depressed, the world is between wars and depressions, and a company that controls most of the world's diamonds is about to attempt something audacious: to rewrite what marriage itself requires.

## The company and its problem
**De Beers** dominates the global diamond supply — it can throttle how many stones reach the market and thus defend prices. But demand is the weak link. Diamonds are not especially rare in the ground, they have little practical use, and in a depressed economy they are an easy luxury to skip. In the United States, the engagement-ring market is soft, and there is no ironclad social rule that an engagement *requires* a diamond at all.

## The plan
De Beers hires the advertising agency **N.W. Ayer** with a sweeping mandate: not to sell a product, but to **manufacture a social norm**. The goal is to make a diamond engagement ring feel non-negotiable — an expected, even obligatory, part of getting married in America. The campaign will work on emotion, on social expectation, and on the meaning of the stone rather than its physical qualities. In **1947**, a copywriter will coin a four-word line — *"A Diamond Is Forever"* — that becomes one of the most effective slogans ever written.

## The machinery to analyze
- **Manufactured scarcity:** supply is deliberately controlled to keep stones "rare."
- **Norm creation:** the idea that a proper proposal *demands* a diamond, complete with an invented guideline for how much one should spend.
- **Emotional anchoring:** fusing romantic, eternal love to a hard commodity.
- A subtle masterstroke hiding in the word *forever* — think about what "a diamond is forever" implies about ever *selling* one.

## Who is being moved
- **Young couples**, for whom the ring becomes a test of love and seriousness.
- **The broader culture**, absorbing a "tradition" that is in fact brand-new.
- **The resale market**, and whether one ever forms at all.

## Your task
This is not really a story about jewelry. Reason about the strategic structure:
- What forces, working together, can turn an optional luxury into a social obligation?
- Why might making resale feel emotionally unthinkable be even more important than any single advertisement?
- How durable can a manufactured norm be — could it still be intact most of a century later?

Name the forces at play, identify the non-obvious one that protects the whole system, and assign your probability that the campaign reshapes the culture.`,

  M2: `It is the 1920s. A versatile antiseptic that has been sold as everything from surgical disinfectant to floor cleaner is about to find its real fortune — not by curing a disease, but by inventing one.

## The product without a market
**Listerine**, made by the Lambert company, is a general-purpose antiseptic with a sharp medicinal taste. It has been marketed for an almost comic range of uses over the years, but none has made it a household giant. The company wants a far bigger market — and bigger markets come from bigger, more universal problems.

## The idea
Someone reaches for an obscure, clinical-sounding word: **"halitosis."** It simply means bad breath — an ordinary, occasional fact of human life that nobody previously regarded as a medical condition or a source of shame. The campaign's move is to take that unremarkable thing, give it a frightening medical name, and tie it to the deepest social anxieties of the era: romantic rejection, social failure, the fear of being quietly disliked. The most famous execution will warn of the woman *"often a bridesmaid, but never a bride."*

## The mechanism to analyze
- **Problem manufacturing:** the growth doesn't come from a better product; it comes from making people newly anxious about a problem they never knew they had.
- **The power of a clinical name:** calling it "halitosis" makes a trivial thing feel real, diagnosable, shameful, and — conveniently — treatable.
- **Social and romantic stakes:** the ads sell dread of exclusion, not the chemistry of mouthwash.

## Who is being moved
- **Ordinary people**, taught to worry about their own breath and to suspect they may be offending others without knowing it.
- **A whole category of "personal insecurity" products** that this playbook will later spawn.

## The setup
- The product itself **does not change** at all.
- The word "halitosis" is technically real but virtually unused in everyday speech before the campaign.
- Sales are reported to multiply many times over within a few years.

## Your task
Most people assume advertising sells solutions. Reason about what is actually being sold here:
- What does it take to convert an unremarkable fact of life into a named condition people will pay to fix?
- Why is selling the *problem* often more powerful — and more repeatable — than selling the cure?
- Could this exact playbook be reused for body odor, dandruff, or other manufactured anxieties?

Name the forces at play, identify the non-obvious one, and assign your probability that the campaign succeeds.`,

  M3: `It is the early 1950s, and one of the most masculine icons in advertising history is about to be born — to rescue a cigarette currently sold to women.

## The awkward starting point
**Marlboro** is, at this moment, a **women's cigarette**. For years it has been marketed with the gentle slogan *"Mild as May,"* and it carries a filter — which, in the cigarette culture of the time, reads as distinctly feminine. Men smoke unfiltered cigarettes and consider filters dainty.

## The shift in the wind
Emerging health worries about smoking are pushing the whole market toward filtered cigarettes, and manufacturers see that men will increasingly want filters too. But there is a problem: men **will not touch a brand coded as a ladies' product.** The brand's existing meaning is a wall between it and the largest possible market.

## The assignment
The legendary ad man **Leo Burnett** takes the account. The product — the cigarette itself — is essentially fixed. What can be rebuilt is its **meaning**. The question is whether you can take a brand drenched in feminine associations and flip its gender coding entirely, without changing the thing in the pack.

## The mechanism to analyze
- **Meaning malleability:** a product's gender and identity live in its marketing, not in its physical form.
- **Identity signaling:** smokers will adopt the brand that lets them perform the identity they want.
- **Symbolic repositioning:** attaching the most aggressively masculine imagery available — the rugged American cowboy, the open range — to override the old coding.

## Who is being moved
- **Male smokers**, who want a filter but refuse a "women's" brand.
- **The brand's meaning** in the public mind, which must be rebuilt from scratch.

## The setup
- The cigarette is largely **unchanged**; only its image is in play.
- Filters are shifting from feminine to mainstream as health fears spread.
- A strong, simple identity archetype is available to borrow.

## Your task
Reason about how much can change when nothing about the product changes:
- Can a brand's gender coding really be reversed purely through imagery?
- Which force is doing the work here — the formula, the filter, or the symbolism?
- How large and durable could the result be if the repositioning lands?

Name the forces at play, identify the non-obvious one, and assign your probability that the cowboy saves the brand.`,

  M4: `It is 1959 in America, and an agency is about to sell a small, plain, German car to a nation in love with chrome — by telling the truth about it.

## The market mood
The American car market runs on **size, chrome, tailfins, horsepower, and aspiration.** Bigger is better; next year's model should look flashier than this year's; advertising shouts. Into this stands the **Volkswagen Beetle**: small, plain, slow, oddly shaped, inexpensive — and German, which in 1959 still carries heavy postwar baggage. By every prevailing standard of the market, it is wrong.

## The agency
The account goes to **DDB (Doyle Dane Bernbach)**, a shop that will help define modern advertising. The conventional move would be to disguise the Beetle's weaknesses — make it seem bigger, grander, more American. DDB does the opposite.

## The mechanism to analyze
- **Counter-positioning:** lean *into* the apparent weaknesses — small, plain, cheap — and reframe them as honesty, thrift, and good sense.
- **Signaling through restraint:** sparse layouts, lots of white space, self-deprecating copy, understatement. In a sea of bombast, quiet candor is violently distinctive.
- **Trust through candor:** admitting flaws makes every other claim more believable.

## Who is being moved
- **American buyers** exhausted by exaggeration, ready to reward something that sounds honest.
- **The category's unwritten rules**, which DDB is about to break on purpose.

## The setup
- The product is genuinely small, plain, and cheap — and German.
- Every competitor is shouting about size and glamour.
- The lever available is **tone and positioning**, not the car itself.

## Your task
The instinct is to hide a product's weaknesses. Reason about the opposite strategy:
- Why might making the weakness the entire pitch work better than concealing it?
- Why is honesty *especially* powerful in a market saturated with exaggeration — and would the same approach work in an already-understated market?
- How much of the effect depends on the surrounding context rather than the copy itself?

Name the forces at play, identify the context-dependent condition that makes it work, and assign your probability.`,

  M5: `It is 1962. A car-rental company that has been losing money for years and sits firmly in second place is about to turn its own inferiority into its slogan.

## The position
**Avis** is the clear **number two** in car rental, well behind the dominant **Hertz**, and has been unprofitable for some time. The conventional wisdom of marketing says you project strength, claim leadership, and never, ever remind customers that you are not the best. Being #2 is something to bury.

## The agency and the idea
**DDB** takes the account and proposes the opposite of the rulebook: **admit it.** "Avis is only No. 2 in rent a cars. So why go with us? **We try harder.**" The campaign converts the company's weakness — its rank — into the very reason to choose it. If we're not on top, the logic runs, then we have to work harder for you: cleaner cars, shorter lines, more effort.

## The mechanism to analyze
- **Counter-positioning:** own your real place in the category instead of fighting it.
- **Underdog psychology:** people instinctively sympathize with and root for the scrappy challenger.
- **Costly, credible admission:** a statement that goes *against your own interest* ("we're not the leader") is far more believable than any boast — credibility is highest when the words cost the speaker something.

## Who is being moved
- **Renters** choosing between an established leader and a hungry challenger.
- **Avis employees**, handed a rallying identity ("we try harder") to live up to.

## The setup
- Avis is a clear #2 in a category with a dominant #1.
- The company has been losing money.
- The lever is positioning and candor, not a new product.

## Your task
Most firms treat #2 as an embarrassment. Reason about turning it into a promise:
- Why can an admission against your own interest persuade more than a boast?
- Why does this lever depend on the category having an obvious leader you're chasing?
- Would it transfer to a fragmented market with no clear #1?

Name the forces at play, identify the non-obvious one, and assign your probability that "We Try Harder" returns Avis to profit.`,

  M6: `It is 1985. The world's most famous soft-drink company, rattled by a sweeter rival, has run the taste tests, trusted the data, and is about to replace its 99-year-old formula — with a product that beats both the rival and the original in blind tastings.

## The competitive threat
**Pepsi** has been gaining share, helped enormously by the **"Pepsi Challenge"** — public, blind **sip tests** in which consumers, given a single sip, tend to prefer Pepsi's sweeter taste. The implication is unnerving for **Coca-Cola**: in a fair, blind comparison, people seem to like the competitor better.

## The data-driven decision
Coca-Cola responds with rigor. It runs an enormous battery of its own blind taste tests and develops a new, sweeter formula — **"New Coke"** — that **beats both Pepsi and the original Coke** in those tests. Confident in the numbers, the company makes a fateful choice: it will not add New Coke alongside the classic. It will **replace the original formula entirely**, pulling the century-old recipe from shelves.

## The mechanism to analyze
- **Goodhart's Law and measurement error:** the test optimized one thing (taste in a single sip) and may be blind to what actually drives the business.
- **A sip is not a can:** a sweeter taste can win one mouthful and lose a whole drink.
- **Loss aversion and identity:** people may not want a *better* cola so much as *their* cola — and taking it away may trigger a reaction no taste test could capture.

## Who is being moved — and who is being ignored
- **Loyal drinkers**, whose attachment is to a brand and a memory, not just a flavor.
- **The research itself**, which measured taste precisely and meaning not at all.

## The setup
- New Coke **wins** the blind taste tests, including against the original.
- The original formula is being **discontinued**, not supplemented.
- The brand carries decades of emotional and identity weight.

## Your task
It is easy to call this a marketing blunder. Reason more precisely about *what kind* of failure it is:
- What did the taste tests measure well, and what crucial thing did they miss entirely?
- Why might removing the original trigger a reaction far larger than any flavor preference?
- Is it possible the eventual outcome — including any reversal — leaves the brand *stronger* than before?

Name the forces at play, identify the measurement trap at the center, and assign your probability for how the public reacts.`,

  M7: `It is April 2, 1993 — a day that will be remembered on Wall Street as **"Marlboro Friday."** The maker of the world's leading premium cigarette is about to slash its price, and in doing so detonate a debate about whether brands are worth anything at all.

## The slow bleed
For roughly a decade, cheap **discount and generic cigarettes** have been steadily taking share from premium brands. Deep-discount's share of the market has grown from around **1% to over a third**. Marlboro, the flagship premium brand, has watched its overall share **slip for six straight months** as price-conscious smokers trade down. The premium model — charge more, on the strength of the brand — is under visible strain.

## The decision
**Philip Morris** announces it will **cut the price of Marlboro by about 20%** (roughly 40 cents a pack) to halt the defection and win smokers back from the discounters. On its face it is a tactical pricing move. To financial markets, it lands as something far larger: a statement about whether a powerful brand can still command a premium at all.

## The mechanism to analyze
- **Signaling:** does cutting price *defend* the franchise, or *confess* that the brand premium was an illusion?
- **Reflexivity:** the market's *interpretation* of the cut can reshape beliefs about brand value across completely unrelated companies.
- **Narrative momentum:** a single ambiguous data point can crystallize into a sweeping story ("the death of brands").

## Who is watching
- **Smokers**, the supposed target — though they may be the least important audience.
- **Investors**, who must decide what the cut *means* for every branded-goods company.
- **Other brand giants** — makers of cola, detergent, entertainment — whose stock prices may move on a cigarette pricing decision.

## The setup
- Discount share: from **~1% to >33%** over a decade.
- Marlboro's share has fallen for **six straight months**.
- The price cut is large and public.

## Your task
The famous takeaway from this day will be "brands are dead." Reason about whether that's right:
- **That day:** How do investors read the cut, and what happens to Philip Morris stock — and to other branded-goods companies?
- **Over the following years:** Does the premium brand actually recover, or was the franchise genuinely broken?
- **The deeper lesson:** What does this reveal about how violently markets can over-read a single ambiguous signal?

Name the forces at play, separate what actually happened from what was *likely*, and assign your probability that Marlboro recovers its share.`,

  M8: `It is early 2010. A brand most men associate with their grandfathers is losing the body-wash war — and is about to win it back with a single, counter-intuitive insight about who actually does the shopping.

## The fading brand
**Old Spice** is seen as dated — "your grandfather's aftershave" — and is losing the men's body-wash fight to **Axe**, which owns the young-male-attraction angle, and to **Dove Men+Care**, which is about to launch on the **Super Bowl**. Old Spice needs not just better ads but a different strategy.

## The insight
Market research surfaces one quietly explosive fact: roughly **60% of body wash is purchased by women**, frequently for the men in their lives. The users are men; the **buyers** are very often women. The whole category has been aiming its marketing at the user. What if you aimed at the purchaser instead?

## The mechanism to analyze
- **Buyer ≠ user:** the person who pulls out the wallet is a different person from the one who showers, with different motivations.
- **Built for sharing:** humor and absurdity designed to be passed around, not just watched.
- **Real-time participation:** a follow-up "Response" campaign that will produce roughly **186 personalized videos in about 2.5 days**, turning a commercial into a live, social event.

## Who is being moved
- **Women**, addressed directly and playfully, even though they will not use the product.
- **Men**, reached indirectly and through cultural ubiquity.
- **The wider internet**, as shareability becomes its own distribution.

## The setup
- **~60%** of body wash is bought by women.
- The brand is fighting an entrenched rival (Axe) and a well-funded launch (Dove Men+Care).
- The stated business goal is a sales lift on the order of **+15%**.

## Your task
The obvious move is to market a men's product to men. Reason about the alternative:
- Why might pointing the entire campaign at *women* outperform targeting the users?
- How much of the result is the repeatable insight (target the buyer) versus unrepeatable viral luck and timing?
- What is the decisive, easily-missed fact that reframes the whole strategy?

Name the forces at play, separate the durable lesson from the lucky virality, and assign your probability that Old Spice reverses its decline.`,

  M9: `It is Black Friday, 2011 — the loudest shopping day of the American year — and an outdoor-clothing company is about to take out a full-page newspaper ad **begging people not to buy its product.**

## The gesture
**Patagonia** runs a full-page ad in **The New York Times** showing a photo of its best-selling fleece jacket under a blunt headline: **"Don't Buy This Jacket."** The copy details the environmental cost of producing the garment — the water, the carbon, the waste — and urges customers to buy less, repair what they own, and consume more thoughtfully. On the busiest consumption day of the year, the company is telling people to stop consuming.

## The apparent paradox
Why would a company actively discourage sales of its own product? The move only makes sense once you see who Patagonia is really talking to, and what the gesture *signals* rather than what it literally says.

## The mechanism to analyze
- **Costly signaling:** being visibly willing to *lose sales* is exactly what makes the environmental stance believable — a green *boast* would do the opposite.
- **Identity and tribe:** anti-consumption *is* the brand; the ad is a flag planted for a specific values-driven community.
- **Self-selection:** the message repels customers who don't share the values and binds those who do even more tightly.

## Who is being moved
- **Values-driven customers**, who reward sincerity with deep loyalty.
- **The wrong customers**, who are gently waved away — which is part of the point.

## The setup
- The ad runs on **Black Friday**, the peak sales day.
- It explicitly tells people to buy less and repair more.
- The brand's customers genuinely hold the environmental values being invoked.

## Your task
This looks like anti-marketing. Reason about why it may be precision marketing instead:
- How can telling the wrong customers to go away *strengthen* the bond with the right ones?
- Why is a willingness to forgo revenue the credible signal here, where a green slogan would ring hollow?
- What precondition must hold for this to work — and why would it backfire for a brand without an authentic values base?

Name the forces at play, identify the precondition most people miss, and assign your probability that revenue *rises* after the ad.`,

  M10: `It is the early 1950s. A genuinely clever plastic container is failing on store shelves — and is about to succeed spectacularly by abandoning stores altogether.

## The product nobody understands
**Tupperware** is a real innovation: lightweight, durable plastic containers with an airtight **"burp" seal** that keeps food fresh in a way nothing else on the market does. But in stores it sells poorly. A shopper walking past a shelf has no idea why this plastic bowl is special; the seal's magic is invisible without a **demonstration**. The product's whole value is locked behind a comprehension problem that retail cannot solve.

## The alternative channel
A saleswoman named **Brownie Wise** champions a radically different approach: don't sell Tupperware in stores at all. Sell it through **home "Tupperware Parties,"** where a hostess invites friends and neighbors into her living room, a demonstrator shows off the burp seal, and the social setting does the rest. The product never changes — only where and how it is sold.

## The mechanism to analyze
- **Distribution-is-the-product:** the real innovation is the **channel**, not the container. The in-person demo solves the comprehension problem that the shelf could not.
- **Social proof and reciprocity:** you buy partly because your neighbor welcomed you into her home, and because everyone around you is buying.
- **A self-replicating salesforce:** customers become hosts become sellers — the model that will later generalize into direct selling and MLM.
- **Reaching an audience advertising missed:** 1950s housewives, in a social context where store ads had little purchase.

## Who is being moved
- **Buyers**, persuaded by demonstration and social obligation rather than packaging.
- **A whole generation of women**, drawn into a new kind of salesforce.

## The setup
- The product is genuinely good but **fails in stores**.
- Its key feature is invisible without a live demo.
- The proposed channel is social, in-home, and personal.

## Your task
The obvious focus is the plastic. Reason about the channel instead:
- Why does the identical product fail on a shelf and thrive in a living room?
- What does the party format supply — comprehension, social pressure, distribution — that retail cannot?
- When a good product underperforms, why should you look at the channel and buying *context* before blaming the product?

Name the forces at play, identify the decisive variable most people overlook, and assign your probability that the party plan outperforms retail.`,
};

async function run() {
  const { data: scenarios, error } = await supabase.from('scenarios').select('id, title, mode');
  if (error) {
    console.error('Failed to fetch scenarios:', error);
    process.exit(1);
  }

  let updated = 0;
  for (const s of scenarios) {
    const codeMatch = s.title.match(/^([A-Z]\d+)/);
    if (!codeMatch) {
      console.warn(`No code prefix on "${s.title}" — skipping.`);
      continue;
    }
    const code = codeMatch[1];
    const briefing = BRIEFINGS[code];
    if (!briefing) {
      console.warn(`No briefing authored for ${code} ("${s.title}") — skipping.`);
      continue;
    }
    const mode = IMMERSIVE.has(code) ? 'Immersive' : 'Focused';

    const { error: upErr } = await supabase
      .from('scenarios')
      .update({ setup: briefing, mode })
      .eq('id', s.id);

    if (upErr) {
      console.error(`Update failed for ${code}:`, upErr);
    } else {
      updated++;
      console.log(`✓ ${code} → mode=${mode}, briefing ${briefing.length} chars`);
    }
  }

  console.log(`\nDone. Updated ${updated}/${scenarios.length} scenarios.`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
