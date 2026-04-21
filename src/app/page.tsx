import { createServiceClient } from '@/lib/supabase';
import type { Analysis, DesignAnalysis } from '@/lib/types';
import HomeClient from '@/components/HomeClient';

export const dynamic = 'force-dynamic';

// ─── Data fetching ──────────────────────────────────────────────────────────

async function getAnalyses(): Promise<Analysis[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('analyses')
    .select('id, category_id, category_name, month, total_templates, total_pro, total_free, total_niches, blue_ocean_count, yellow_count, red_ocean_count, created_at, tokens_used, key_insights, recommendations')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Analysis[];
}

async function getDesignAnalyses(month: string): Promise<DesignAnalysis[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('design_analyses')
    .select('*')
    .eq('month', month);
  if (error) {
    // Table may not exist yet - gracefully return empty
    console.warn('design_analyses query failed:', error.message);
    return [];
  }
  return (data || []) as DesignAnalysis[];
}

async function getMonthlySummary(month: string): Promise<Record<string, unknown> | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('monthly_summaries')
    .select('*')
    .eq('month', month)
    .single();
  if (error) {
    // Table may not exist yet - gracefully return null
    console.warn('monthly_summaries query failed:', error.message);
    return null;
  }
  return data as Record<string, unknown>;
}

// ─── Helpers for deriving home page data ────────────────────────────────────

function buildGainers(latestAnalyses: Analysis[], allAnalyses: Analysis[], latestMonth: string) {
  // Find previous month
  const allMonths = [...new Set(allAnalyses.map(a => a.month))].sort();
  const latestIdx = allMonths.indexOf(latestMonth);
  if (latestIdx <= 0) return []; // no previous month

  const prevMonth = allMonths[latestIdx - 1];
  const prevAnalyses = allAnalyses.filter(a => a.month === prevMonth);

  return latestAnalyses
    .map(c => {
      const prev = prevAnalyses.find(p => p.category_name === c.category_name);
      const prevTemplates = prev?.total_templates ?? c.total_templates;
      const delta = c.total_templates - prevTemplates;
      const pct = prevTemplates === 0 ? 100 : Math.round(delta / prevTemplates * 100);
      return {
        id: c.id,
        category_name: c.category_name,
        total_templates: c.total_templates,
        blue_ocean_count: c.blue_ocean_count,
        delta,
        pct,
        prevTemplates,
      };
    })
    .filter(c => c.delta > 0)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 5);
}

function buildTrendStyles(designAnalyses: DesignAnalysis[]) {
  const COLORS = ['#f6b93b', '#a29bfe', '#55efc4', '#fd79a8', '#fdcb6e', '#74b9ff'];
  if (designAnalyses.length === 0) {
    return [
      { style: 'Elegant Script', count: 12, color: COLORS[0] },
      { style: 'Minimalist', count: 9, color: COLORS[1] },
      { style: 'Cultural Motif', count: 7, color: COLORS[2] },
    ];
  }

  // Aggregate style_distribution across all design analyses
  const styleMap = new Map<string, number>();
  for (const da of designAnalyses) {
    if (da.style_distribution) {
      for (const s of da.style_distribution) {
        styleMap.set(s.style, (styleMap.get(s.style) || 0) + s.count);
      }
    }
  }

  return [...styleMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map((entry, i) => ({
      style: entry[0],
      count: entry[1],
      color: COLORS[i % COLORS.length],
    }));
}

function buildHotAssets(designAnalyses: DesignAnalysis[]) {
  const COLORS = ['#4299e1', '#a855f7', '#01B574', '#EE5D50', '#FFCE20', '#6B5BFF'];
  if (designAnalyses.length === 0) return [];

  // Aggregate asset_distribution across all design analyses
  const assetMap = new Map<string, number>();
  for (const da of designAnalyses) {
    if (da.asset_distribution) {
      for (const a of da.asset_distribution) {
        assetMap.set(a.name, (assetMap.get(a.name) || 0) + a.count);
      }
    }
  }

  return [...assetMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map((entry, i) => ({
      name: entry[0],
      freq: entry[1],
      color: COLORS[i % COLORS.length],
    }));
}

async function getBlueOceanThumbnails(categoryIds: number[]): Promise<{ thumbnail: string; url: string; title: string; is_pro: boolean }[]> {
  if (categoryIds.length === 0) return [];
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('templates')
    .select('title, thumbnail, url, is_pro, category_id')
    .in('category_id', categoryIds)
    .not('thumbnail', 'is', null)
    .limit(20);
  if (error || !data) return [];
  // Shuffle and return up to 6
  const shuffled = data.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 6).map(t => ({
    thumbnail: t.thumbnail || '',
    url: t.url || '',
    title: t.title || '',
    is_pro: t.is_pro || false,
  }));
}

function buildFeaturedRecs(topByBlue: Analysis[]) {
  // Try to get recommendations from the top category first
  const topOpp = topByBlue[0];
  if (topOpp?.recommendations && topOpp.recommendations.length > 0) {
    return topOpp.recommendations.slice(0, 3).map((r, i) => ({
      categorySlug: topOpp.category_name,
      categoryName: topOpp.category_name.replace(/-/g, ' '),
      niche: r.niche,
      score: r.score,
      demand: r.potentialDemand,
      why: r.why,
      rank: r.rank || i + 1,
    }));
  }

  // Fallback: synthesize from top 3 categories
  return topByBlue.slice(0, 3).map((c, i) => ({
    categorySlug: c.category_name,
    categoryName: c.category_name.replace(/-/g, ' '),
    niche: c.key_insights?.[0]?.split('.')[0] + '.' || c.category_name.replace(/-/g, ' '),
    score: 85 + (c.blue_ocean_count % 10),
    demand: 70 + (c.blue_ocean_count % 20),
    why: c.key_insights?.[0] || `${c.category_name.replace(/-/g, ' ')} has ${c.blue_ocean_count} blue ocean niches with high potential.`,
    rank: i + 1,
  }));
}

// ─── Page component (Server) ────────────────────────────────────────────────

export default async function DashboardPage() {
  const analyses = await getAnalyses();
  const months = [...new Set(analyses.map(a => a.month))].sort().reverse();
  const latestMonth = months[0] || '';
  // Preview: filter to only Instagram Post categories (ID + EN)
  const PREVIEW_CATEGORIES = ['instagram-post-id', 'instagram-post-en'];
  const latestAnalyses = analyses.filter(a => a.month === latestMonth && PREVIEW_CATEGORIES.includes(a.category_name));

  // Fetch additional data sources
  const [designAnalyses, _summary, heroThumbnails] = await Promise.all([
    latestMonth ? getDesignAnalyses(latestMonth) : Promise.resolve([]),
    latestMonth ? getMonthlySummary(latestMonth) : Promise.resolve(null),
    getBlueOceanThumbnails(latestAnalyses.map(a => a.category_id)),
  ]);

  // Compute totals
  const totalTemplates = latestAnalyses.reduce((s, a) => s + a.total_templates, 0);
  const totalNiches = latestAnalyses.reduce((s, a) => s + a.total_niches, 0);
  const totalBlue = latestAnalyses.reduce((s, a) => s + a.blue_ocean_count, 0);
  const totalFree = latestAnalyses.reduce((s, a) => s + (a.total_free || 0), 0);
  const freePct = totalTemplates > 0 ? Math.round(totalFree / totalTemplates * 100) : 0;

  // Top categories
  const topByBlue = [...latestAnalyses].sort((a, b) => b.blue_ocean_count - a.blue_ocean_count).slice(0, 5);
  const topOpp = topByBlue[0] || null;

  // Gainers
  const gainers = buildGainers(latestAnalyses, analyses, latestMonth);

  // Design trends
  const trendStyles = buildTrendStyles(designAnalyses);

  // Hot assets
  const hotAssets = buildHotAssets(designAnalyses);

  // Recommendations
  const featuredRecs = buildFeaturedRecs(topByBlue);

  return (
    <HomeClient
      analyses={analyses}
      months={months}
      latestMonth={latestMonth}
      totals={{
        templates: totalTemplates,
        blue: totalBlue,
        niches: totalNiches,
        free: totalFree,
        freePct,
      }}
      topOpp={topOpp}
      topByBlue={topByBlue}
      gainers={gainers}
      trendStyles={trendStyles}
      hotAssets={hotAssets}
      featuredRecs={featuredRecs}
      heroThumbnails={heroThumbnails}
    />
  );
}
