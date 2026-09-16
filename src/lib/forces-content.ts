/* ────────────────────────────────────────────────────────────
   Rich, self-contained content for the Forces Framework page.
   Each force has a long-form description and a metaphor/example
   chosen *deliberately not* to overlap with any scenario in the
   library, so studying the framework never spoils a scenario.
   ──────────────────────────────────────────────────────────── */

export type Force = {
  name: string;
  summary: string;       // one line, shown on the collapsed card
  description: string;   // detailed explanation, shown in the detail view
  metaphor: string;      // vivid non-scenario example
};

export type ForceCategory = {
  key: string;
  name: string;
  icon: string;
  forces: Force[];
};

export const FORCE_CATEGORIES: ForceCategory[] = [
  {
    key: 'structural',
    name: 'Structural / Economic',
    icon: 'account_balance',
    forces: [
      {
        name: 'Comparative advantage',
        summary: 'Specialize in what you sacrifice least to produce, then trade.',
        description:
          'Even if one party is better at producing everything, both still gain by specializing in whatever they give up the least to make, and trading for the rest. Advantage here is about relative opportunity cost, not absolute skill. This quiet logic decides who ends up making what across the entire world economy — and creates the dependencies that later become strategic vulnerabilities.',
        metaphor:
          'A star trial lawyer also happens to type faster than any assistant she could hire. She should still hire one: every hour she spends typing is an hour not spent winning cases worth far more. The "slower" typist holds the comparative advantage in typing because their next-best alternative is so much cheaper.',
      },
      {
        name: 'Rent redistribution',
        summary: 'When rules change, ask who now captures the surplus.',
        description:
          'A change in rules rarely creates or destroys value evenly — it transfers economic rents from one group to another. The crucial question is never just "is this efficient?" but "who captures the gain, and who eats the loss?" Because losers are often concentrated and organized while winners are diffuse, the politics of a reform are usually fiercer than its economics.',
        metaphor:
          'When a city legalizes ride-sharing, the value of a taxi medallion that once cost a fortune collapses. The benefit spreads thinly across millions of riders who each save a little; the loss lands hard on a few thousand medallion owners — which is exactly why they, not the riders, fill the city council meetings.',
      },
      {
        name: 'Cross-border spillover',
        summary: 'A shock travels via currency, rates, or trade to bystanders.',
        description:
          'A shock in one country does not stay put. It transmits through exchange rates, interest rates, capital flows, and trade links to places that had nothing to do with the original event. The transmission channel is usually invisible until the damage surfaces somewhere unexpected — which is what makes spillovers so easy to miss in advance.',
        metaphor:
          'When a major central bank hikes interest rates, global capital rushes home chasing the higher yield, and a small, unrelated economy on the other side of the planet can suddenly find its currency under attack and its borrowing costs spiking — a wave thrown up by a distant storm, swamping a beach where the sky looks clear.',
      },
      {
        name: 'Demographic momentum',
        summary: 'Population effects arrive with multi-decade, unstoppable lags.',
        description:
          'Population structure is the slowest-moving and most predictable force in economics — and the most ignored. A change in birth rates today reshapes schools, then housing, then the labor force, then pension systems, decades apart, with almost no way to reverse it once it is set in motion. The bill reliably arrives on a different government’s watch.',
        metaphor:
          'Picture a python that has swallowed a pig: the bulge moves slowly down the snake’s body over time. A baby boom is that bulge — visible in maternity wards, then primary schools, then the job market, then nursing homes — utterly foreseeable, yet each stage surprises the institutions it hits.',
      },
      {
        name: 'Regime change / loss of anchor',
        summary: 'The disruption is losing the rule everyone organized around.',
        description:
          'Sometimes the rules of the game themselves change, and the real shock is the loss of the coordinating anchor everyone had organized their behavior around. Until a new anchor forms, expectations drift, coordination frays, and behavior turns unstable. The danger lives less in any single event than in the vacuum it leaves.',
        metaphor:
          'When the metronome an entire orchestra was following suddenly stops, the musicians do not each keep flawless time alone — they drift apart, faster and slower, until a new tempo is somehow re-established. It is the silence of the anchor, not any wrong note, that produces the chaos.',
      },
      {
        name: 'Crisis-as-enabler',
        summary: 'Reforms that are impossible until they are suddenly necessary.',
        description:
          'Changes that are politically impossible in calm times can become not just possible but unavoidable in a crisis. The emergency supplies the political cover that good arguments alone never could. The binding constraint was never a shortage of sensible ideas — it was the absence of permission to act on them.',
        metaphor:
          'A family argues for years about whether to gut the dated kitchen, and never does — until the week a pipe bursts and floods it. The flood did not invent the good idea; it simply removed every remaining excuse for not acting on it.',
      },
    ],
  },
  {
    key: 'game-theoretic',
    name: 'Game-theoretic / Systemic',
    icon: 'strategy',
    forces: [
      {
        name: 'Retaliation & coordination failure',
        summary: 'Everyone defects rationally; collectively all are worse off.',
        description:
          'When each player does the individually rational thing, the group can end up worse off than if everyone had cooperated — because no one can credibly commit not to defect first. Defensive moves invite counter-moves, and the spiral continues until all parties have lost ground they could have kept.',
        metaphor:
          'At a concert, one row stands to see better, forcing the row behind to stand too, until the whole hall is on its feet — everyone less comfortable, and no one seeing any better than when all were seated. Each person’s rational choice manufactured a worse outcome for all.',
      },
      {
        name: 'Fallacy of composition',
        summary: 'What helps one part can wreck the whole when all copy it.',
        description:
          'What is true for one part is not automatically true for the whole. A move that benefits a single actor can be self-defeating when everyone attempts it at once. The macro system behaves differently from the simple sum of its micro parts — which is why intuition built from individual cases misfires at scale.',
        metaphor:
          'Standing up at a stadium lets you see better. But if everyone tries to save more during a downturn to protect themselves, total spending falls, incomes drop, and the whole economy ends up poorer. The thrifty individual is prudent; a uniformly thrifty economy can starve itself.',
      },
      {
        name: 'Moral hazard & incentives',
        summary: 'Insurance against a risk quietly increases appetite for it.',
        description:
          'People change their behavior in advance when someone else will bear the downside. Protection against a risk subtly raises the willingness to take that risk. The incentive, not the stated intention, drives the result — so the cure for one problem routinely manufactures the next.',
        metaphor:
          'A driver with a flawless anti-lock braking system tends, without deciding to, to drive a little faster and brake a little later. Part of the safety gain gets "spent" on speed rather than banked as safety. The protection reshapes the very behavior it was meant to cover.',
      },
      {
        name: "Goodhart's Law",
        summary: 'When a measure becomes a target, it stops measuring.',
        description:
          'Once a metric becomes a target, people optimize the number rather than the underlying thing it was meant to capture — and the two quietly diverge. The measure improves on paper precisely as the real goal degrades. The better the incentive attached to a proxy, the faster the proxy decouples from reality.',
        metaphor:
          'A call center graded on "calls resolved per hour" will start hanging up on the hard problems to keep the number high. The dashboard glows green while customer satisfaction — the thing the metric was a stand-in for — quietly collapses.',
      },
      {
        name: 'Unintended consequences',
        summary: 'Second- and third-order effects swamp the intended one.',
        description:
          'Complex systems answer an intervention with second- and third-order effects that often dwarf the intended first-order one. The visible, intended effect is rarely the whole story, and sometimes not even the main event. Acting on a system you only partly understand reliably produces surprises.',
        metaphor:
          'Colonial authorities in Delhi paid a bounty for dead cobras to thin the snake population. Locals began breeding cobras to collect the bounty; when officials scrapped the scheme, the now-worthless snakes were set loose — leaving the city with more cobras than before it started.',
      },
      {
        name: 'Institutions mediate shocks',
        summary: 'Same shock, opposite outcomes, depending on the rules.',
        description:
          'An identical shock produces opposite outcomes depending on the institutional frame it passes through. Rules, norms, and the distribution of power decide who wins and who loses. Because of this path dependence, the shock itself rarely determines the result — the institutions around it do.',
        metaphor:
          'Two houses face the same earthquake. One sits on flexible, modern foundations and sways safely; the other is rigid and collapses. The quake was identical to the inch — the building code decided everything.',
      },
    ],
  },
  {
    key: 'behavioral',
    name: 'Behavioral / Market',
    icon: 'psychology',
    forces: [
      {
        name: 'Reflexivity',
        summary: 'Expectations feed back and change the outcome they predict.',
        description:
          'In markets and politics, beliefs do not merely describe reality — they alter it. Expectations feed back into the fundamentals they were trying to forecast, creating self-reinforcing loops where the map redraws the territory. Cause and effect run in a circle rather than a line.',
        metaphor:
          'A rumor that a perfectly healthy bank is about to fail sends depositors rushing to withdraw their money, which actually drains the bank’s cash and tips it into failure. The false belief manufactured the very reality it claimed to predict.',
      },
      {
        name: 'Mean reversion & cycles',
        summary: 'Extremes pull back to average — but timing is unknowable.',
        description:
          'Extreme readings tend to be pulled back toward long-run averages, but the timing is unpredictable and systems routinely overshoot in both directions. Mistaking a temporary peak for a permanent plateau — or a trough for a new normal — is one of the most common and expensive errors in judgment.',
        metaphor:
          'A swinging pendulum spends almost no time at its resting center, yet it always passes back through it. Booms and busts behave the same way: the calm "normal" middle is where the system is headed, but almost never where it sits.',
      },
      {
        name: 'Loss aversion & the endowment effect',
        summary: 'Losses hurt ~2x as much as equal gains feel good.',
        description:
          'People feel the pain of a loss roughly twice as intensely as the pleasure of an equivalent gain, and they overvalue what they already hold simply because it is theirs. Together these make us cling to losing positions and demand a premium to give up things we never would have paid that much to acquire.',
        metaphor:
          'Hand someone a plain coffee mug and within minutes they will refuse to sell it for the very price they would have refused to pay for it five minutes earlier. Nothing about the mug changed — only that it became "theirs."',
      },
      {
        name: 'Narrative momentum',
        summary: 'The story drives the price, which feeds the story.',
        description:
          'A compelling story can drive collective behavior even when the data argue otherwise — and the resulting movement then becomes fresh evidence for the story, which drives more behavior. Narrative and outcome push each other along, sometimes for a long time, until the loop finally snaps.',
        metaphor:
          'A meme stock rockets not because the business improved but because the story "this is going to the moon" spreads. The rising price becomes proof of the story, which lifts the price further — a self-feeding loop that runs until the narrative cracks and reverses just as fast.',
      },
      {
        name: 'Social proof & reciprocity',
        summary: 'We copy the herd and feel bound to repay favors.',
        description:
          'People look to what others are doing to decide what is correct, and feel a deep obligation to return favors. Both are mental shortcuts that can be deliberately engineered to manufacture cascades and sticky commitments. We are wired both to follow the crowd and to repay a debt.',
        metaphor:
          'A tip jar seeded with a few bills collects far more than an empty one — "others gave, so I should too." And a free sample handed to you in a shop creates a small, quiet debt that nudges you toward a purchase you had no intention of making.',
      },
      {
        name: 'Signaling',
        summary: 'A costly action is believed precisely because it costs you.',
        description:
          'Costly actions communicate private information credibly exactly because they are expensive; cheap talk gets discounted while expensive commitments get believed. The cost is the message — it proves a quality that words alone cannot, because only someone who truly has that quality could afford the gesture.',
        metaphor:
          'A peacock’s enormous tail is a survival handicap — which is precisely why it persuades a mate: only a genuinely fit bird could afford to haul it around and still thrive. The "wasteful" extravagance is the proof.',
      },
    ],
  },
  {
    key: 'marketing',
    name: 'Marketing / Strategy',
    icon: 'campaign',
    forces: [
      {
        name: 'Manufactured scarcity',
        summary: 'Designed shortage drives urgency and perceived value.',
        description:
          'Limiting supply or access — sometimes entirely artificially — raises urgency, perceived value, and willingness to pay. Scarcity is frequently a designed feature rather than a natural fact, and the queue outside the door is part of the product being sold.',
        metaphor:
          'A sneaker label releases only a few thousand pairs of a shoe it could easily make by the million. The deliberate shortage ignites a resale frenzy and a halo of status; unlimited supply would have left the identical shoe ordinary and unremarkable.',
      },
      {
        name: 'Counter-positioning',
        summary: 'Adopt a model the incumbent cannot copy without self-harm.',
        description:
          'A challenger adopts a business model the incumbent cannot imitate without damaging its own existing business. The leader’s greatest strength becomes the cage it cannot escape, and the challenger turns an apparent weakness into the whole pitch.',
        metaphor:
          'A new online-only insurer offers rock-bottom prices because it carries no branch network. The established giant cannot match it without cannibalizing the thousands of offices and agents that are its very identity — trapped, profitably, by its own past success.',
      },
      {
        name: 'Identity & tribal signaling',
        summary: 'People buy who they are, not what objectively works.',
        description:
          'People frequently buy what announces who they are rather than what performs best on the spec sheet; consumption becomes a badge of group membership. The product functions as a flag, and the purchase is an act of belonging more than an act of evaluation.',
        metaphor:
          'Two nearly identical pickup trucks sell to entirely different tribes based on the values stitched into their advertising. Owners slap the logo on the bumper the way a fan wears a team jersey — declaring allegiance, not reporting on torque figures.',
      },
      {
        name: 'Buyer ≠ user',
        summary: 'When payer and consumer differ, the product courts the payer.',
        description:
          'When the person who pays differs from the person who consumes, incentives split, and the product gets optimized for whoever controls the wallet. The lever is to aim at the decision-maker, not necessarily the end user — they may want very different things.',
        metaphor:
          'Children’s cereal is engineered with cartoon mascots and a candy-bright box to win the child in the aisle, while the nutrition claims on the side panel are aimed squarely at the parent who actually pays. One box, two audiences, two different pitches.',
      },
      {
        name: 'Meaning malleability',
        summary: 'A product’s meaning can change without the product changing.',
        description:
          'A product’s meaning lives in its marketing and context, not in its molecules. You can transform what something signifies — and what people will pay for it — without altering the thing itself. Reposition the story and keep the product exactly as it was.',
        metaphor:
          'Bottled water is chemically unremarkable, yet the same water can be sold as a cheap commodity or, poured into a sleek glass bottle with a French name and a minimalist label, as a luxury. The liquid is identical; only the meaning was rebuilt.',
      },
      {
        name: 'Problem manufacturing',
        summary: 'Create the anxiety first, then sell the cure.',
        description:
          'Sometimes the growth comes from making people aware of a problem they never knew they had, then selling the remedy. The anxiety is the real product; the solution is the easy part. Name the ailment convincingly and the market for the treatment appears overnight.',
        metaphor:
          'An industry popularized the notion that "dull, lifeless hair" was a personal failing demanding a special shampoo. The hair was fine all along — the insecurity was the genuine invention, and it conjured a market where none had existed.',
      },
      {
        name: 'Distribution-is-the-product',
        summary: 'The channel, not the thing, is the real innovation.',
        description:
          'Often the real innovation is the channel and the buying context, not the object being sold. Reach the customer in the right place, at the right moment, and a product that previously failed can suddenly win. The path to the customer is the breakthrough.',
        metaphor:
          'A product nobody bought on a crowded store shelf can explode once it ships through a curated monthly subscription box delivered to the door. The item never changed — the new channel simply solved the discovery and convenience problem that retail never could.',
      },
    ],
  },
];
