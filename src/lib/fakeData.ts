/**
 * Fake data generators for blurred preview sections.
 * When users disable blur via DevTools, they see random nonsense instead of real data.
 */

const FAKE_NAMES = [
  'Xylophera Studio', 'Quvint Mraz', 'Belphan Works', 'Trenza Koff', 'Jurmido Arts',
  'Nolvex Creativa', 'Plitho Design', 'Gamrik Styles', 'Wothel Templates', 'Frinjal Co',
  'Zuptera Vex', 'Clorima Dash', 'Yothrin Labs', 'Baxelum Pro', 'Rendiva Hox',
  'Moxelina Prints', 'Drazwik Studio', 'Felvano Zen', 'Kurplex Arts', 'Jintova Flow',
];

const FAKE_NICHES = [
  'Gruvento / Prax Xeno', 'Bolvish / Jentaro Deck', 'Moxplay / Trindel Craft',
  'Frelkino / Zentara Wave', 'Gushvel / Nortiko Spark', 'Quarvex / Lumidash Pop',
  'Jothvel / Prentik Bloom', 'Kinzero / Splithane Glow', 'Duxflar / Melvano Rise',
  'Brulken / Zentasha Pulse', 'Wixgran / Folvelta Mesh', 'Troshvik / Galmire Flux',
  'Nelphor / Kvintora Edge', 'Zibrax / Morventa Hive', 'Pyrflex / Doltrana Link',
];

const FAKE_KEYWORDS = [
  'glenthrix', 'morvello', 'zupvane', 'praxfeld', 'duskovia',
  'britmane', 'quolfex', 'narvito', 'jelvane', 'fluxweld',
  'grothane', 'splindox', 'kelvura', 'thormix', 'zentrade',
  'blivarn', 'crophex', 'dralvino', 'muxfern', 'plixvort',
];

const FAKE_STYLES = [
  'Glenthrix Layered', 'Morvello Abstract', 'Zupvane Gradient',
  'Praxfeld Chromatic', 'Duskovia Matte', 'Britmane Textured',
  'Quolfex Saturated', 'Narvito Pastel', 'Jelvane Duotone',
  'Fluxweld Outlined', 'Grothane Neon', 'Splindox Embossed',
];

const FAKE_ASSETS = [
  'Glenthor shape frame', 'Bruvex dot pattern', 'Morvane gradient blob',
  'Zinthex line divider', 'Prolvex arrow element', 'Duskine card border',
  'Fluxmer icon set', 'Quarvix overlay mesh', 'Trondel badge frame',
  'Kelphan texture strip', 'Jelvano sparkle burst', 'Splinthor wave line',
];

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function fakeCreators(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    name: FAKE_NAMES[i % FAKE_NAMES.length],
    count: rand(4, 15),
    pro: rand(2, 10),
    free: rand(1, 7),
  }));
}

export function fakeRankings(count: number) {
  const zones = ['blue', 'yellow', 'red'];
  return Array.from({ length: count }, (_, i) => ({
    niche: FAKE_NICHES[i % FAKE_NICHES.length],
    avgPosition: rand(120, 400),
    count: rand(3, 20),
    zone: zones[i % 3],
  }));
}

export function fakeKeywords(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    keyword: FAKE_KEYWORDS[i % FAKE_KEYWORDS.length],
    count: rand(20, 100),
    zone: ['blue', 'red', 'mixed'][i % 3],
    blueCount: rand(5, 40),
    redCount: rand(10, 60),
  }));
}

export function fakeProFreeOps(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    niche: FAKE_NICHES[i % FAKE_NICHES.length],
    count: rand(3, 18),
    proPct: rand(70, 100),
    signal: i % 2 === 0 ? 'create-free' : 'create-pro',
    reason: 'Xvelta prax glenthix morvane zupfeld duskova britmix quolfern.',
  }));
}

export function fakeNiches(count: number) {
  const zones = ['blue', 'yellow', 'red'];
  return Array.from({ length: count }, (_, i) => ({
    niche: FAKE_NICHES[i % FAKE_NICHES.length],
    count: rand(2, 50),
    zone: zones[i % 3],
    pro: rand(1, 30),
    free: rand(1, 20),
    pct: `${rand(1, 15)}%`,
  }));
}

export function fakeOutliers(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    niche: FAKE_NICHES[i % FAKE_NICHES.length],
    score: rand(500, 1800),
    templates: rand(2, 8),
    demand: ['Low', 'Medium', 'High', 'Very High'][rand(0, 3)],
    why: 'Xvelta prax glenthix morvane zupfeld duskova britmix quolfern narvito jelvane.',
  }));
}

export function fakeStyles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    style: FAKE_STYLES[i % FAKE_STYLES.length],
    count: rand(2, 30),
    signal: ['high', 'medium', 'low'][i % 3],
  }));
}

export function fakeCrossNichePatterns(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    style: FAKE_STYLES[i % FAKE_STYLES.length],
    signal: (['high', 'medium', 'low'] as const)[i % 3],
    total_count: rand(5, 30),
    niches: FAKE_NICHES.slice(0, rand(2, 5)).map(n => n.split(' / ')[0]),
    pattern: `Xvelta ${FAKE_STYLES[i % FAKE_STYLES.length]} prax`,
  }));
}

export function fakeNicheStyles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    niche: FAKE_NICHES[i % FAKE_NICHES.length].split(' / ')[0],
    dominant_style: FAKE_STYLES[i % FAKE_STYLES.length],
    styles: FAKE_STYLES.slice(0, rand(2, 4)).map((s, j) => ({ style: s, count: rand(1, 10) })),
  }));
}

export function fakeAssetPacks(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    name: FAKE_ASSETS[i % FAKE_ASSETS.length],
    freq: rand(3, 15),
  }));
}

export function fakeRecs(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    niche: FAKE_NICHES[i % FAKE_NICHES.length],
    score: rand(65, 90),
    potentialDemand: rand(60, 95),
    competition: rand(2, 15),
    templates: rand(2, 10),
    why: 'Xvelta prax glenthix morvane zupfeld duskova britmix quolfern narvito jelvane fluxweld grothane splindox kelvura.',
    zone: 'blue',
  }));
}

/* ── Trends: Style Recommendations ── */
export function fakeStyleRecs(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    niche: FAKE_NICHES[i % FAKE_NICHES.length].split(' / ')[0],
    current_dominant: FAKE_STYLES[i % FAKE_STYLES.length],
    recommended_style: FAKE_STYLES[(i + 3) % FAKE_STYLES.length],
    reason: 'Xvelta prax glenthix morvane zupfeld duskova britmix quolfern narvito.',
  }));
}

/* ── Assets: Top 10 rows ── */
export function fakeAssetDistRows(count: number) {
  const cats = ['Object Cutout', 'Shape', 'Texture', 'Stationery'];
  return Array.from({ length: count }, (_, i) => ({
    name: FAKE_ASSETS[i % FAKE_ASSETS.length],
    category: cats[i % cats.length],
    count: rand(2, 15),
    niche_count: rand(1, 5),
  }));
}

/* ── Assets: Pack cards ── */
export function fakeAssetPackCards(count: number) {
  const cats = ['Object Cutout', 'Shape', 'Texture'];
  return Array.from({ length: count }, (_, i) => ({
    pack_name: `${FAKE_ASSETS[i % FAKE_ASSETS.length]} Pack`,
    category: cats[i % cats.length],
    item_count: rand(15, 50),
    pricing_suggestion: ['$5-10', '$10-20', '$3-8'][i % 3],
    demand_signal: ['high', 'medium', 'low'][i % 3],
    niche_count: rand(2, 6),
    total_appearances: rand(5, 20),
    competition: ['low', 'medium', 'high'][i % 3],
    assets: FAKE_ASSETS.slice(0, rand(3, 6)),
  }));
}

/* ── Assets: All Detected Assets table rows ── */
export function fakeAssetTableRows(count: number) {
  const cats = ['Object Cutout', 'Shape', 'Texture', 'Stationery'];
  return Array.from({ length: count }, (_, i) => ({
    name: FAKE_ASSETS[i % FAKE_ASSETS.length],
    category: cats[i % cats.length],
    count: rand(1, 10),
    niche_count: rand(1, 4),
    styles: [FAKE_STYLES[i % FAKE_STYLES.length]],
    hero_count: rand(0, 3),
    accent_count: rand(0, 3),
    bg_count: rand(0, 2),
  }));
}

/* ── Insights: Niche Dominance ── */
export function fakeNicheDominance(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    niche: FAKE_NICHES[i % FAKE_NICHES.length].split(' / ')[0],
    zone: ['blue', 'yellow', 'red'][i % 3],
    topCreator: FAKE_NAMES[i % FAKE_NAMES.length],
    dominancePct: rand(15, 60),
    totalCreators: rand(2, 8),
  }));
}

/* ── Insights: Creator Strategy ── */
export function fakeCreatorStrategies(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    name: FAKE_NAMES[i % FAKE_NAMES.length],
    count: rand(3, 20),
    proPct: rand(10, 90),
    strategy: (['Pro-focused', 'Free-focused', 'Mixed'] as const)[i % 3],
    avgPos: rand(50, 350),
  }));
}

/* ── Insights: Blue Keywords ── */
export function fakeBlueKeywords(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    keyword: FAKE_KEYWORDS[i % FAKE_KEYWORDS.length],
    count: rand(2, 15),
    niches: [FAKE_NICHES[i % FAKE_NICHES.length].split(' / ')[0]],
  }));
}

/* ── Insights: Keyword Ranking ── */
export function fakeKeywordRanking(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    keyword: FAKE_KEYWORDS[i % FAKE_KEYWORDS.length],
    avgPosition: rand(50, 400),
    count: rand(3, 20),
  }));
}

/* ── Insights: Position Buckets ── */
export function fakePositionBuckets(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    range: `${i * 50 + 1}–${(i + 1) * 50}`,
    blue: rand(1, 20),
    yellow: rand(1, 15),
    red: rand(1, 25),
  }));
}

/* ── Insights: Free Opp Scores ── */
export function fakeFreeOppScores(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    niche: FAKE_NICHES[i % FAKE_NICHES.length].split(' / ')[0],
    zone: ['blue', 'yellow', 'red'][i % 3],
    score: rand(30, 80),
    proPct: rand(40, 95),
    count: rand(3, 20),
  }));
}

/* ── Insights: Style Saturation ── */
export function fakeStyleSaturation(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    style: FAKE_STYLES[i % FAKE_STYLES.length],
    nicheCount: rand(1, 8),
    totalNiches: 10,
    pct: rand(10, 80),
  }));
}

/* ── Insights: Style × Zone ── */
export function fakeStyleZone(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    style: FAKE_STYLES[i % FAKE_STYLES.length],
    blue: rand(0, 15),
    yellow: rand(0, 10),
    red: rand(0, 20),
  }));
}

/* ── Insights: Contrarian ── */
export function fakeContrarianStyles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    niche: FAKE_NICHES[i % FAKE_NICHES.length].split(' / ')[0],
    nicheStyle: FAKE_STYLES[i % FAKE_STYLES.length],
    categoryDominant: FAKE_STYLES[(i + 4) % FAKE_STYLES.length],
  }));
}

/* ── Insights: Style Diversity ── */
export function fakeStyleDiversity(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    niche: FAKE_NICHES[i % FAKE_NICHES.length].split(' / ')[0],
    styleCount: rand(2, 6),
    diversity: rand(10, 80),
    dominant: FAKE_STYLES[i % FAKE_STYLES.length],
    dominantPct: rand(30, 90),
  }));
}

/* ── Insights: Rare Assets ── */
export function fakeAssetRarity(count: number) {
  const cats = ['Object Cutout', 'Shape', 'Texture', 'Stationery'];
  return Array.from({ length: count }, (_, i) => ({
    name: FAKE_ASSETS[i % FAKE_ASSETS.length],
    category: cats[i % cats.length],
    nicheCount: rand(1, 2),
    heroCount: rand(1, 4),
  }));
}

/* ── Insights: Underserved Assets ── */
export function fakeUnderservedAssets(count: number) {
  const cats = ['Object Cutout', 'Shape', 'Texture', 'Stationery', 'Nature & Organic', 'Other'];
  return Array.from({ length: count }, (_, i) => ({
    category: cats[i % cats.length],
    bluePct: rand(5, 50),
    totalCount: rand(10, 60),
  }));
}

/** CTA overlay styles used across all blur sections */
export const BLUR_CTA_STYLE: React.CSSProperties = {
  background: 'linear-gradient(135deg, #6B5BFF, #4299e1)',
  color: '#fff',
  padding: '10px 24px',
  borderRadius: 12,
  fontSize: 13,
  fontWeight: 700,
  boxShadow: '0 8px 32px rgba(107,91,255,0.3)',
  textAlign: 'center',
  maxWidth: 340,
  lineHeight: 1.5,
  textDecoration: 'none',
  display: 'inline-block',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease',
  cursor: 'pointer',
};

export const BLUR_WRAPPER_STYLE: React.CSSProperties = {
  filter: 'blur(8px)',
  WebkitFilter: 'blur(8px)',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  pointerEvents: 'none',
};

export const BLUR_OVERLAY_STYLE: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  zIndex: 10,
};
