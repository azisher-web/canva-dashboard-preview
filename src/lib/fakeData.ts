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
