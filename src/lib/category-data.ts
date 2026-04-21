import { cache } from 'react';
import { createServiceClient } from '@/lib/supabase';
import type { Analysis, DesignAnalysis } from '@/lib/types';
import type { AdvancedInsightsData } from '@/components/AdvancedInsights';

/* ══════════════════════════════════════════════════════════════════════════
   Cached data fetching for category pages.
   React.cache() deduplicates calls within a single server render pass,
   so layout + child page can both call getAnalysisBySlug() without
   hitting Supabase twice.
   ══════════════════════════════════════════════════════════════════════════ */

export const getAnalysisBySlug = cache(async (slug: string): Promise<Analysis | null> => {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('category_name', slug)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  if (error) return null;
  return data as Analysis;
});

export const getDesignAnalysis = cache(async (categoryId: number, month: string): Promise<DesignAnalysis | null> => {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('design_analyses')
    .select('*')
    .eq('category_id', categoryId)
    .eq('month', month)
    .single();
  if (error) return null;
  return data as DesignAnalysis;
});

export interface FullTemplate {
  title: string;
  thumbnail: string;
  url: string;
  is_pro: boolean;
  creator: string;
  keywords: string;
  scrape_order: number;
}

export const getCategoryTemplatesFull = cache(async (categoryId: number): Promise<FullTemplate[]> => {
  const supabase = createServiceClient();
  const { data: run } = await supabase
    .from('scrape_runs')
    .select('id')
    .eq('category_id', categoryId)
    .eq('status', 'completed')
    .order('finished_at', { ascending: false })
    .limit(1)
    .single();
  if (!run) return [];

  const { data, error } = await supabase
    .from('templates')
    .select('title, thumbnail, url, is_pro, creator, keywords, scrape_order')
    .eq('scrape_run_id', run.id)
    .not('title', 'is', null)
    .limit(1000);
  if (error || !data) return [];
  return data.map(t => ({
    title: t.title || '',
    thumbnail: t.thumbnail || '',
    url: t.url || '',
    is_pro: t.is_pro || false,
    creator: t.creator || 'Unknown',
    keywords: t.keywords || '',
    scrape_order: t.scrape_order || 999,
  }));
});

/** Build slim categoryTemplates for niche + creator drawers */
export function buildCategoryTemplates(fullTemplates: FullTemplate[]) {
  return fullTemplates.map(t => ({
    title: t.title, thumbnail: t.thumbnail, url: t.url, is_pro: t.is_pro, creator: t.creator,
  }));
}

/** Build templateMap from fullTemplates */
export function buildTemplateMap(fullTemplates: FullTemplate[]): Record<string, { thumbnail: string; url: string; is_pro: boolean }> {
  const map: Record<string, { thumbnail: string; url: string; is_pro: boolean }> = {};
  for (const t of fullTemplates) {
    if (t.thumbnail && t.title) {
      map[t.title] = { thumbnail: t.thumbnail, url: t.url, is_pro: t.is_pro };
    }
  }
  return map;
}

/* ── Indonesian category detection ── */
const ID_SLUGS = new Set([
  'kiriman-instagram', 'instagram-posts', 'poster', 'undangan', 'sertifikat',
  'presentasi', 'logo', 'brosur', 'kartu-nama', 'resume', 'pamflet',
  'infografis', 'menu', 'banner', 'spanduk', 'kalender', 'stiker',
  'label', 'jadwal', 'daftar-harga', 'kwitansi', 'faktur',
]);
export function isIndonesianCategory(name: string) {
  const s = name.toLowerCase().replace(/\s+/g, '-');
  if (ID_SLUGS.has(s)) return true;
  return /kiriman|undangan|sertifikat|presentasi|brosur|pamflet|infografis|daftar|kwitansi|faktur|jadwal/.test(s);
}

/* ══════════════════════════════════════════════════════════════════════════
   Insight builders — extracted from old page.tsx
   ══════════════════════════════════════════════════════════════════════════ */

export interface CreatorStat {
  name: string;
  count: number;
  pro: number;
  free: number;
  avgPosition: number;
  topNiches: string[];
}

export interface KeywordStat {
  keyword: string;
  count: number;
  blueCount: number;
  redCount: number;
  zone: 'blue' | 'red' | 'mixed';
}

export interface ProFreeOpportunity {
  niche: string;
  zone: string;
  proPct: number;
  count: number;
  signal: 'create-free' | 'create-pro';
  reason: string;
}

export interface NicheRanking {
  niche: string;
  zone: string;
  avgPosition: number;
  count: number;
  signal: 'rising' | 'stable' | 'low';
}

export interface CategoryInsights {
  topCreators: CreatorStat[];
  topKeywords: KeywordStat[];
  proFreeOpportunities: ProFreeOpportunity[];
  nicheRankings: NicheRanking[];
  nicheCreators: Record<string, CreatorStat[]>;
}

export function buildCategoryInsights(
  templates: FullTemplate[],
  nicheTemplateMap: Record<string, string[]>,
  niches: { niche: string; zone: string; count: number; pro?: number; free?: number }[],
): CategoryInsights {
  // ── 1. Creator Analysis ──
  const creatorMap: Record<string, { count: number; pro: number; free: number; positions: number[]; niches: Set<string> }> = {};
  const titleToNiches: Record<string, string[]> = {};
  for (const [nicheName, titles] of Object.entries(nicheTemplateMap)) {
    for (const t of titles) {
      const key = t.toLowerCase();
      if (!titleToNiches[key]) titleToNiches[key] = [];
      titleToNiches[key].push(nicheName);
    }
  }

  for (const t of templates) {
    const c = creatorMap[t.creator] || { count: 0, pro: 0, free: 0, positions: [], niches: new Set() };
    c.count++;
    if (t.is_pro) c.pro++; else c.free++;
    c.positions.push(t.scrape_order);
    const niches_ = titleToNiches[t.title.toLowerCase()] || [];
    for (const n of niches_) c.niches.add(n);
    creatorMap[t.creator] = c;
  }

  const topCreators: CreatorStat[] = Object.entries(creatorMap)
    .map(([name, s]) => ({
      name,
      count: s.count,
      pro: s.pro,
      free: s.free,
      avgPosition: Math.round(s.positions.reduce((a, b) => a + b, 0) / s.positions.length),
      topNiches: Array.from(s.niches).slice(0, 3),
    }))
    .sort((a, b) => b.count - a.count);

  // ── 1b. Per-niche creators ──
  const nicheCreators: Record<string, CreatorStat[]> = {};
  for (const [nicheName, titles] of Object.entries(nicheTemplateMap)) {
    const titleSet = new Set(titles.map(t => t.toLowerCase()));
    const nicheTs = templates.filter(t => titleSet.has(t.title.toLowerCase()));
    const ncMap: Record<string, { count: number; pro: number; free: number; positions: number[] }> = {};
    for (const t of nicheTs) {
      const c = ncMap[t.creator] || { count: 0, pro: 0, free: 0, positions: [] };
      c.count++;
      if (t.is_pro) c.pro++; else c.free++;
      c.positions.push(t.scrape_order);
      ncMap[t.creator] = c;
    }
    nicheCreators[nicheName] = Object.entries(ncMap)
      .map(([name, s]) => ({
        name,
        count: s.count,
        pro: s.pro,
        free: s.free,
        avgPosition: Math.round(s.positions.reduce((a, b) => a + b, 0) / s.positions.length),
        topNiches: [nicheName],
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  // ── 2. Keyword Intelligence ──
  const kwMap: Record<string, { count: number; blue: number; red: number }> = {};
  const stopWords = new Set(['yang', 'dan', 'untuk', 'dengan', 'dari', 'post', 'instagram', 'the', 'and', 'for', 'with', 'of', 'a', 'an', 'in', 'to', 'is', 'on', 'your', 'this', 'that', 'new', 'can', 'you', 'it', 'be', 'has', 'are', 'was', 'but', 'not', 'our', 'we', 'my', 'de', 'la', 'el', 'en']);

  for (const t of templates) {
    const tNiches = titleToNiches[t.title.toLowerCase()] || [];
    const zones = tNiches.map(n => niches.find(ni => ni.niche === n)?.zone).filter(Boolean);
    const hasBlue = zones.includes('blue');
    const hasRed = zones.includes('red');

    const words = (t.keywords || '').split(/[,\n;|]+/).map(w => w.trim().toLowerCase()).filter(w => w.length > 2 && !stopWords.has(w));
    const seen = new Set<string>();
    for (const w of words) {
      if (seen.has(w)) continue;
      seen.add(w);
      const kw = kwMap[w] || { count: 0, blue: 0, red: 0 };
      kw.count++;
      if (hasBlue) kw.blue++;
      if (hasRed) kw.red++;
      kwMap[w] = kw;
    }
  }

  const topKeywords: KeywordStat[] = Object.entries(kwMap)
    .map(([keyword, s]) => ({
      keyword,
      count: s.count,
      blueCount: s.blue,
      redCount: s.red,
      zone: (s.blue > s.red * 2 ? 'blue' : s.red > s.blue * 2 ? 'red' : 'mixed') as 'blue' | 'red' | 'mixed',
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);

  // ── 3. Pro/Free Opportunities ──
  const proFreeOpportunities: ProFreeOpportunity[] = niches
    .filter(n => n.count >= 3)
    .map(n => {
      const proPct = n.count > 0 ? Math.round(((n.pro || 0) / n.count) * 100) : 0;
      let signal: 'create-free' | 'create-pro';
      let reason: string;
      if (proPct >= 80) {
        signal = 'create-free';
        reason = `${proPct}% Pro — users seeking free alternatives can't find them here`;
      } else if (proPct <= 20) {
        signal = 'create-pro';
        reason = `Only ${proPct}% Pro — room for premium quality templates`;
      } else {
        return null;
      }
      return { niche: n.niche, zone: n.zone, proPct, count: n.count, signal, reason };
    })
    .filter((x): x is ProFreeOpportunity => x !== null)
    .sort((a, b) => a.signal === 'create-free' ? b.proPct - a.proPct : a.proPct - b.proPct)
    .slice(0, 10);

  // ── 4. Ranking Signal ──
  const nicheRankings: NicheRanking[] = [];
  const medianPosition = templates.length / 2;
  for (const n of niches) {
    const titleSet = new Set((nicheTemplateMap[n.niche] || []).map(t => t.toLowerCase()));
    const nicheTs = templates.filter(t => titleSet.has(t.title.toLowerCase()));
    if (nicheTs.length === 0) continue;
    const avgPos = Math.round(nicheTs.reduce((s, t) => s + t.scrape_order, 0) / nicheTs.length);
    const signal = avgPos < medianPosition * 0.5 ? 'rising' : avgPos > medianPosition * 1.5 ? 'low' : 'stable';
    nicheRankings.push({ niche: n.niche, zone: n.zone, avgPosition: avgPos, count: nicheTs.length, signal });
  }
  nicheRankings.sort((a, b) => a.avgPosition - b.avgPosition);

  return { topCreators, topKeywords, proFreeOpportunities, nicheRankings, nicheCreators };
}

export function buildAdvancedInsights(
  templates: FullTemplate[],
  nicheTemplateMap: Record<string, string[]>,
  niches: { niche: string; zone: string; count: number; pro?: number; free?: number }[],
  designAnalysis: DesignAnalysis | null,
): AdvancedInsightsData {
  const titleToNiches: Record<string, string[]> = {};
  const nicheZone: Record<string, string> = {};
  for (const n of niches) nicheZone[n.niche] = n.zone;
  for (const [nicheName, titles] of Object.entries(nicheTemplateMap)) {
    for (const t of titles) {
      const key = t.toLowerCase();
      if (!titleToNiches[key]) titleToNiches[key] = [];
      titleToNiches[key].push(nicheName);
    }
  }

  const stopWords = new Set(['yang', 'dan', 'untuk', 'dengan', 'dari', 'post', 'instagram', 'the', 'and', 'for', 'with', 'of', 'a', 'an', 'in', 'to', 'is', 'on', 'your', 'this', 'that', 'new', 'can', 'you', 'it', 'be', 'has', 'are', 'was', 'but', 'not', 'our', 'we', 'my', 'de', 'la', 'el', 'en']);

  // ══ A1: Niche Dominance ══
  const nicheDominance = niches.map(n => {
    const titleSet = new Set((nicheTemplateMap[n.niche] || []).map(t => t.toLowerCase()));
    const nicheTs = templates.filter(t => titleSet.has(t.title.toLowerCase()));
    const creatorCount: Record<string, number> = {};
    for (const t of nicheTs) creatorCount[t.creator] = (creatorCount[t.creator] || 0) + 1;
    const entries = Object.entries(creatorCount).sort((a, b) => b[1] - a[1]);
    const topCreator = entries[0]?.[0] || 'Unknown';
    const topCount = entries[0]?.[1] || 0;
    const total = nicheTs.length || 1;
    return { niche: n.niche, zone: n.zone, topCreator, dominancePct: Math.round((topCount / total) * 100), totalCreators: entries.length };
  }).sort((a, b) => b.dominancePct - a.dominancePct);

  // ══ A3: Creator Strategy ══
  const creatorMap: Record<string, { count: number; pro: number; free: number; positions: number[] }> = {};
  for (const t of templates) {
    const c = creatorMap[t.creator] || { count: 0, pro: 0, free: 0, positions: [] };
    c.count++; if (t.is_pro) c.pro++; else c.free++;
    c.positions.push(t.scrape_order);
    creatorMap[t.creator] = c;
  }
  const creatorStrategies = Object.entries(creatorMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 20)
    .map(([name, s]) => {
      const proPct = Math.round((s.pro / s.count) * 100);
      const strategy = proPct >= 75 ? 'Pro-focused' as const : proPct <= 25 ? 'Free-focused' as const : 'Mixed' as const;
      return { name, count: s.count, proPct, strategy, avgPos: Math.round(s.positions.reduce((a, b) => a + b, 0) / s.positions.length) };
    });

  // ══ B: Keyword Analysis ══
  const kwMap: Record<string, { count: number; blue: number; red: number; yellow: number; positions: number[]; niches: Set<string> }> = {};
  for (const t of templates) {
    const tNiches = titleToNiches[t.title.toLowerCase()] || [];
    const zones = tNiches.map(n => nicheZone[n]).filter(Boolean);
    const hasBlue = zones.includes('blue');
    const hasRed = zones.includes('red');
    const hasYellow = zones.includes('yellow');
    const words = (t.keywords || '').split(/[,\n;|]+/).map(w => w.trim().toLowerCase()).filter(w => w.length > 2 && !stopWords.has(w));
    const seen = new Set<string>();
    for (const w of words) {
      if (seen.has(w)) continue;
      seen.add(w);
      const kw = kwMap[w] || { count: 0, blue: 0, red: 0, yellow: 0, positions: [], niches: new Set() };
      kw.count++;
      if (hasBlue) kw.blue++;
      if (hasRed) kw.red++;
      if (hasYellow) kw.yellow++;
      kw.positions.push(t.scrape_order);
      for (const n of tNiches) kw.niches.add(n);
      kwMap[w] = kw;
    }
  }

  const blueKeywords = Object.entries(kwMap)
    .filter(([, s]) => s.blue > 0 && s.red === 0 && s.count >= 2)
    .map(([keyword, s]) => ({ keyword, count: s.count, niches: Array.from(s.niches).filter(n => nicheZone[n] === 'blue') }))
    .sort((a, b) => b.count - a.count).slice(0, 20);

  const keywordRanking = Object.entries(kwMap)
    .filter(([, s]) => s.count >= 3)
    .map(([keyword, s]) => ({ keyword, count: s.count, avgPosition: Math.round(s.positions.reduce((a, b) => a + b, 0) / s.positions.length) }))
    .sort((a, b) => a.avgPosition - b.avgPosition).slice(0, 20);

  const kwLengthBuckets = { head: { total: 0, blue: 0, red: 0 }, mid: { total: 0, blue: 0, red: 0 }, long: { total: 0, blue: 0, red: 0 } };
  for (const [keyword, s] of Object.entries(kwMap)) {
    const wordCount = keyword.split(/\s+/).length;
    const bucket = wordCount === 1 ? 'head' : wordCount <= 3 ? 'mid' : 'long';
    kwLengthBuckets[bucket].total += s.count;
    kwLengthBuckets[bucket].blue += s.blue;
    kwLengthBuckets[bucket].red += s.red;
  }
  const keywordLength = [
    { type: 'Head (1 word)' as const, ...kwLengthBuckets.head },
    { type: 'Mid-tail (2-3)' as const, ...kwLengthBuckets.mid },
    { type: 'Long-tail (4+)' as const, ...kwLengthBuckets.long },
  ];

  // ══ C: Position Insights ══
  const bucketSize = 50;
  const maxPos = Math.max(...templates.map(t => t.scrape_order), 500);
  const numBuckets = Math.ceil(maxPos / bucketSize);
  const positionBuckets = Array.from({ length: Math.min(numBuckets, 10) }, (_, i) => {
    const start = i * bucketSize + 1;
    const end = (i + 1) * bucketSize;
    const range = `${start}–${end}`;
    let blue = 0, yellow = 0, red = 0;
    for (const t of templates) {
      if (t.scrape_order >= start && t.scrape_order <= end) {
        const tNiches = titleToNiches[t.title.toLowerCase()] || [];
        const zones = tNiches.map(n => nicheZone[n]).filter(Boolean);
        if (zones.includes('blue')) blue++;
        else if (zones.includes('yellow')) yellow++;
        else if (zones.includes('red')) red++;
      }
    }
    return { range, blue, yellow, red };
  });

  const proPositions = templates.filter(t => t.is_pro).map(t => t.scrape_order);
  const freePositions = templates.filter(t => !t.is_pro).map(t => t.scrape_order);
  const proFreePosition = {
    proAvg: proPositions.length > 0 ? Math.round(proPositions.reduce((a, b) => a + b, 0) / proPositions.length) : 0,
    freeAvg: freePositions.length > 0 ? Math.round(freePositions.reduce((a, b) => a + b, 0) / freePositions.length) : 0,
  };

  let bestStart = 1, bestBlue = 0;
  for (let s = 1; s <= maxPos - 99; s += 25) {
    let blueCount = 0;
    for (const t of templates) {
      if (t.scrape_order >= s && t.scrape_order < s + 100) {
        const tNiches = titleToNiches[t.title.toLowerCase()] || [];
        if (tNiches.some(n => nicheZone[n] === 'blue')) blueCount++;
      }
    }
    if (blueCount > bestBlue) { bestBlue = blueCount; bestStart = s; }
  }
  const totalBlueTemplates = templates.filter(t => {
    const tNiches = titleToNiches[t.title.toLowerCase()] || [];
    return tNiches.some(n => nicheZone[n] === 'blue');
  }).length || 1;
  const sweetSpot = { start: bestStart, end: bestStart + 99, blueCount: bestBlue, bluePct: Math.round((bestBlue / totalBlueTemplates) * 100) };

  // ══ D3: Free Opportunity Score ══
  const freeOppScores = niches
    .filter(n => n.count >= 3)
    .map(n => {
      const proPct = n.count > 0 ? Math.round(((n.pro || 0) / n.count) * 100) : 0;
      const zoneBonus = n.zone === 'blue' ? 2 : n.zone === 'yellow' ? 1 : 0;
      const score = Math.round((proPct * 0.6) + (zoneBonus * 20) + Math.max(0, 30 - n.count));
      return { niche: n.niche, zone: n.zone, score, proPct, count: n.count };
    })
    .sort((a, b) => b.score - a.score).slice(0, 16);

  // ══ E: Design Style Insights ══
  const nicheStyles = designAnalysis?.niche_styles || [];
  const styleDist = designAnalysis?.style_distribution || [];
  const totalNichesForStyle = nicheStyles.length || 1;

  const styleNicheCount: Record<string, Set<string>> = {};
  for (const ns of nicheStyles) {
    for (const s of ns.styles) {
      if (!styleNicheCount[s.style]) styleNicheCount[s.style] = new Set();
      styleNicheCount[s.style].add(ns.niche);
    }
  }
  const styleSaturation = Object.entries(styleNicheCount)
    .map(([style, niches_]) => ({ style, nicheCount: niches_.size, totalNiches: totalNichesForStyle, pct: Math.round((niches_.size / totalNichesForStyle) * 100) }))
    .sort((a, b) => b.pct - a.pct);

  const styleZoneMap: Record<string, { blue: number; yellow: number; red: number }> = {};
  for (const ns of nicheStyles) {
    const zone = nicheZone[ns.niche] || 'yellow';
    for (const s of ns.styles) {
      if (!styleZoneMap[s.style]) styleZoneMap[s.style] = { blue: 0, yellow: 0, red: 0 };
      if (zone === 'blue') styleZoneMap[s.style].blue += s.count;
      else if (zone === 'red') styleZoneMap[s.style].red += s.count;
      else styleZoneMap[s.style].yellow += s.count;
    }
  }
  const styleZone = Object.entries(styleZoneMap)
    .map(([style, z]) => ({ style, ...z }))
    .sort((a, b) => (b.blue + b.yellow + b.red) - (a.blue + a.yellow + a.red));

  const categoryDominant = styleDist.length > 0 ? styleDist[0].style : '';
  const contrarianStyles = nicheStyles
    .filter(ns => ns.dominant_style !== categoryDominant && ns.dominant_style)
    .map(ns => ({ niche: ns.niche, nicheStyle: ns.dominant_style, categoryDominant }));

  const styleComplexity = nicheStyles.map(ns => {
    const total = ns.styles.reduce((s, x) => s + x.count, 0) || 1;
    const dominant = ns.styles[0];
    const dominantPct = dominant ? Math.round((dominant.count / total) * 100) : 100;
    return { niche: ns.niche, styleCount: ns.styles.length, diversity: 100 - dominantPct, dominant: dominant?.style || 'Unknown', dominantPct };
  }).sort((a, b) => a.diversity - b.diversity);

  // ══ F: Asset Insights ══
  const assetDist = designAnalysis?.asset_distribution || [];
  const assetRarity = assetDist
    .filter(a => a.niche_count <= 2 && a.hero_count >= 1)
    .map(a => ({ name: a.name, category: a.category, nicheCount: a.niche_count, heroCount: a.hero_count }))
    .sort((a, b) => b.heroCount - a.heroCount).slice(0, 15);

  const assetCatBlue: Record<string, { blue: number; total: number }> = {};
  for (const a of assetDist) {
    if (!assetCatBlue[a.category]) assetCatBlue[a.category] = { blue: 0, total: 0 };
    assetCatBlue[a.category].total += a.count;
    const blueNiches = a.niches.filter(n => nicheZone[n] === 'blue');
    if (blueNiches.length > 0) assetCatBlue[a.category].blue += a.count;
  }
  const underservedAssets = Object.entries(assetCatBlue)
    .map(([category, s]) => ({ category, bluePct: s.total > 0 ? Math.round((s.blue / s.total) * 100) : 0, totalCount: s.total }))
    .sort((a, b) => a.bluePct - b.bluePct);

  return {
    nicheDominance, creatorStrategies, blueKeywords, keywordRanking, keywordLength,
    positionBuckets, proFreePosition, sweetSpot, freeOppScores,
    styleSaturation, styleZone, contrarianStyles, styleComplexity,
    assetRarity, underservedAssets,
    hasDesignData: !!designAnalysis && nicheStyles.length > 0,
  };
}
