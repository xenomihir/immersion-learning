/* ────────────────────────────────────────────────────────────
   Shared scenario helpers — used across the dashboard, the
   scenario page, the debrief, and search so that title cleaning,
   mode handling, labelling, and cover art stay consistent.
   ──────────────────────────────────────────────────────────── */

export const DIFFICULTY_LABELS: Record<number, { label: string; description: string }> = {
  1: { label: 'Foundation', description: 'Well-known events with clear causal chains' },
  2: { label: 'Developing', description: 'Moderately known events requiring deeper analysis' },
  3: { label: 'Advanced', description: 'Complex multi-force interactions' },
  4: { label: 'Expert', description: 'Obscure events where pattern recognition is key' },
  5: { label: 'Master', description: 'Highly complex scenarios with subtle, interacting forces' },
};

export const DOMAIN_LABELS: Record<string, string> = {
  economics: 'Economics',
  monetary_policy: 'Monetary Policy',
  trade: 'Trade',
  labor: 'Labor Economics',
  development: 'Development',
  fiscal_policy: 'Fiscal Policy',
  demographics: 'Demographics',
  industrial_policy: 'Industrial Policy',
  marketing: 'Marketing',
  advertising: 'Advertising',
  branding: 'Branding',
  pricing: 'Pricing',
  retail: 'Retail Strategy',
  direct_selling: 'Direct Selling',
  sustainability: 'Sustainability',
};

/* ── Title ──────────────────────────────────────────────────
   Source titles carry an internal code prefix ("E1 — ", "M10 — ").
   That code is for our taxonomy only; learners should never see it. */
export function cleanTitle(title: string): string {
  if (!title) return '';
  return title.replace(/^\s*[A-Z]\d+\s*[—–-]\s*/, '').trim();
}

/* ── Mode ───────────────────────────────────────────────────
   The DB stores capitalised modes ("Focused" / "Immersive"). All
   comparisons must be case-insensitive — the previous strict
   `=== 'focused'` check silently failed and mislabelled every card. */
export function normalizeMode(mode: string | null | undefined): string {
  return (mode || 'focused').toLowerCase();
}

export function modeLabel(mode: string | null | undefined): string {
  const m = normalizeMode(mode);
  return m.charAt(0).toUpperCase() + m.slice(1);
}

/* ── Domain ─────────────────────────────────────────────── */
export function getDomainDisplay(tags: string[] | null | undefined): string {
  if (!tags || tags.length === 0) return 'General';
  const first = tags[0];
  return DOMAIN_LABELS[first] || first.charAt(0).toUpperCase() + first.slice(1).replace(/_/g, ' ');
}

export function getDomainDisplayAll(tags: string[] | null | undefined): string {
  if (!tags || tags.length === 0) return 'General';
  return tags.map(t => DOMAIN_LABELS[t] || t.charAt(0).toUpperCase() + t.slice(1).replace(/_/g, ' ')).join(' · ');
}

/* ── Dates / time periods ──────────────────────────────────
   Dates are free-text ("Aug 1971", "1347–1351", "Apr 2 1993").
   Pull the first 4-digit year for bucketing and chronological sort. */
export function parseYear(date: string | null | undefined): number {
  if (!date) return 9999;
  const m = date.match(/\d{4}/);
  return m ? parseInt(m[0], 10) : 9999;
}

export const TIME_PERIODS: { key: string; label: string; min: number; max: number }[] = [
  { key: 'pre-1900', label: 'Pre-1900', min: 0, max: 1899 },
  { key: '1900-1950', label: '1900–1950', min: 1900, max: 1950 },
  { key: '1950-1980', label: '1950–1980', min: 1951, max: 1980 },
  { key: '1980-2000', label: '1980–2000', min: 1981, max: 2000 },
  { key: 'post-2000', label: '2000 onward', min: 2001, max: 9998 },
];

export function getTimePeriodKey(date: string | null | undefined): string | null {
  const year = parseYear(date);
  const bucket = TIME_PERIODS.find(p => year >= p.min && year <= p.max);
  return bucket ? bucket.key : null;
}

/* ── Card preview ──────────────────────────────────────────
   Briefings are long structured reads; the card should show only
   the opening prose hook (first paragraph, before any heading). */
export function getPreview(setup: string, max = 150): string {
  if (!setup) return '';
  const firstBlock = setup.split('\n\n').find(b => b.trim() && !b.trim().startsWith('#')) || setup;
  const clean = firstBlock.replace(/[#*>`]/g, '').trim();
  return clean.length > max ? clean.slice(0, max).trimEnd() + '…' : clean;
}

/* ── Local cover art ───────────────────────────────────────
   Deterministic, self-contained SVG covers (data-URI, no network).
   Replaces the fragile external Unsplash links that often failed to
   load. Palette is keyed to domain + mode so the grid reads cleanly. */
type Palette = { from: string; to: string; tint: string };

function paletteFor(domain: string, mode: string): Palette {
  const m = normalizeMode(mode);
  if (m === 'immersive') return { from: '#7c1d1e', to: '#2C2E31', tint: '#9E2A2B' };
  if (domain === 'marketing') return { from: '#7a5a12', to: '#2C2E31', tint: '#D4AF37' };
  // economics / default
  return { from: '#1f3a73', to: '#2C2E31', tint: '#2B50AA' };
}

const COVER_IMAGES: Record<string, string> = {
  'nixon ends bretton woods': '/images/scenarios/nixon_bretton_woods.png',
  'us trucking deregulation (motor carrier act)': '/images/scenarios/trucking_deregulation.png',
  'repeal of the corn laws': '/images/scenarios/corn_laws.png',
  'the volcker shock': '/images/scenarios/volcker_shock.png',
  'india\'s 1991 liberalization': '/images/scenarios/india_liberalization.png',
  'the plaza accord': '/images/scenarios/plaza_accord.png',
  'the black death and the end of serfdom': '/images/scenarios/black_death.png',
  'smoot-hawley tariff': '/images/scenarios/smoot_hawley.png',
  'china\'s one-child policy': '/images/scenarios/china_one_child.png',
  'the hartz reforms': '/images/scenarios/hartz_reforms.png',
  'de beers, "a diamond is forever"': '/images/scenarios/de_beers.png',
  'listerine and the invention of "halitosis"': '/images/scenarios/listerine.png',
  'the marlboro man': '/images/scenarios/marlboro_man.png',
  'volkswagen, "think small"': '/images/scenarios/volkswagen.png',
  'new coke': '/images/scenarios/new_coke.png',
  'marlboro friday': '/images/scenarios/marlboro_friday.png',
  'old spice, "the man your man could smell like"': '/images/scenarios/old_spice.png',
  'avis, "we try harder"': '/images/scenarios/avis.png',
  'patagonia, "don\'t buy this jacket"': '/images/scenarios/patagonia.png',
  'tupperware and the party-plan': '/images/scenarios/tupperware.png',
};

export function getScenarioCover(scenario: {
  title: string;
  domain_tags?: string[] | null;
  mode: string;
  date?: string | null;
  geography?: string | null;
}): string {
  const domain = scenario.domain_tags?.[0] || 'economics';
  const { from, to, tint } = paletteFor(domain, scenario.mode);
  const clean = cleanTitle(scenario.title);
  
  if (COVER_IMAGES[clean.toLowerCase()]) {
    return COVER_IMAGES[clean.toLowerCase()];
  }

  const monogram = clean
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || '')
    .join('');
  const era = (scenario.date || '').replace(/&/g, 'and');
  const place = (scenario.geography || '').replace(/&/g, 'and');

  // A stable pseudo-random offset from the title so covers differ subtly.
  let seed = 0;
  for (let i = 0; i < clean.length; i++) seed = (seed + clean.charCodeAt(i)) % 360;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="320" viewBox="0 0 800 320">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
    <radialGradient id="r" cx="${20 + (seed % 60)}%" cy="30%" r="80%">
      <stop offset="0%" stop-color="${tint}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${tint}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="320" fill="url(#g)"/>
  <rect width="800" height="320" fill="url(#r)"/>
  <g stroke="#ffffff" stroke-opacity="0.07" stroke-width="1">
    ${Array.from({ length: 9 }, (_, i) => `<line x1="${i * 100}" y1="0" x2="${i * 100 + 160}" y2="320"/>`).join('')}
  </g>
  <circle cx="640" cy="90" r="150" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="2"/>
  <circle cx="640" cy="90" r="100" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="2"/>
  <text x="48" y="250" font-family="Inter, sans-serif" font-size="150" font-weight="700" fill="#ffffff" fill-opacity="0.12">${monogram}</text>
  <text x="50" y="60" font-family="Inter, sans-serif" font-size="22" font-weight="700" letter-spacing="3" fill="#ffffff" fill-opacity="0.85">${era}</text>
  <text x="50" y="88" font-family="Inter, sans-serif" font-size="15" font-weight="500" letter-spacing="2" fill="#ffffff" fill-opacity="0.55">${place.toUpperCase()}</text>
</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
