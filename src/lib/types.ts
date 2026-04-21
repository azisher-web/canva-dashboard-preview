// ─── Database Types ──────────────────────────────────────────────────────

export interface Category {
  id: number;
  slug: string;
  url: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

export interface ScrapeRun {
  id: number;
  category_id: number;
  started_at: string;
  finished_at: string | null;
  status: 'running' | 'completed' | 'failed';
  templates_found: number;
  with_keywords: number;
  duration_sec: number;
  account_used: string;
  error_message: string | null;
  // joined
  categories?: { name: string; slug: string };
}

export interface Analysis {
  id: number;
  category_id: number;
  scrape_run_id: number;
  month: string;
  category_name: string;
  total_templates: number;
  total_pro: number;
  total_free: number;
  total_niches: number;
  blue_ocean_count: number;
  yellow_count: number;
  red_ocean_count: number;
  niche_distribution: NicheItem[];
  niche_template_map: Record<string, string[]> | null;
  outliers: Outlier[];
  recommendations: Recommendation[];
  key_insights: string[];
  new_templates: TemplateChange[] | null;
  dropped_templates: TemplateChange[] | null;
  model_used: string;
  tokens_used: number;
  created_at: string;
}

export interface NicheItem {
  niche: string;
  count: number;
  zone: 'red' | 'yellow' | 'blue';
  pct: number;
  pro?: number;
  free?: number;
}

export interface Outlier {
  rank: number;
  score: number;
  title: string;
  count: number;
  demand: string;
  reason: string;
  examples: { title: string; url?: string }[];
}

export interface Recommendation {
  rank: number;
  niche: string;
  templates: number;
  potentialDemand: number;
  competition: number;
  score: number;
  ideas: string[];
  why: string;
  keywords: string[];
  examples: { title: string; url?: string }[];
}

export interface TemplateChange {
  url: string;
  title: string;
  creator: string;
  keywords: string;
  thumbnail?: string;
  is_pro?: boolean;
}

// ─── Phase 5 — Design Analysis Types ─────────────────────────────────────

export interface DesignAnalysis {
  id: number;
  category_id: number;
  analysis_id: number;
  month: string;
  total_images_analyzed: number;
  total_blue_niches: number;
  style_distribution: StyleDistItem[];
  niche_styles: NicheStyleItem[];
  cross_niche_patterns: CrossNichePattern[];
  style_recommendations: StyleRecommendation[];
  key_insights: string[];
  // Asset analysis
  asset_distribution: AssetDistItem[];
  asset_category_dist: AssetCategoryItem[];
  niche_assets: NicheAssetItem[];
  asset_packs: AssetPack[];
  // Meta
  model_used: string;
  tokens_used: number;
  cost_estimate: number;
  created_at: string;
}

export interface StyleDistItem {
  style: string;
  count: number;
  pct: number;
}

export interface NicheStyleItem {
  niche: string;
  dominant_style: string;
  styles: { style: string; count: number }[];
  templates: { title: string; style: string; confidence: string; notes: string }[];
  design_note: string;
}

export interface CrossNichePattern {
  pattern: string;
  style: string;
  signal: 'high' | 'medium' | 'low';
  total_count: number;
  niches: string[];
}

export interface StyleRecommendation {
  niche: string;
  current_dominant: string;
  recommended_style: string;
  reason: string;
}

// ─── Asset Analysis Types ────────────────────────────────────────────────

export interface AssetDistItem {
  name: string;
  category: string;
  count: number;
  niche_count: number;
  niches: string[];
  styles: string[];
  hero_count: number;
  accent_count: number;
  bg_count: number;
  templates: string[];
}

export interface AssetCategoryItem {
  category: string;
  count: number;
  pct: number;
}

export interface NicheAssetItem {
  niche: string;
  total_assets: number;
  assets: { name: string; category: string; style: string; prominence: string }[];
  category_breakdown: { category: string; count: number }[];
}

export interface AssetPack {
  pack_name: string;
  category: string;
  item_count: number;
  assets: string[];
  styles: string[];
  niches_using: string[];
  niche_count: number;
  total_appearances: number;
  demand_signal: 'high' | 'medium' | 'low';
  competition: 'high' | 'medium' | 'low';
  pricing_suggestion: string;
}
