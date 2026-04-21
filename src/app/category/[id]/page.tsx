import { getAnalysisBySlug, getDesignAnalysis, getCategoryTemplatesFull, buildCategoryTemplates, buildCategoryInsights, isIndonesianCategory } from '@/lib/category-data';
import OverviewTab from '@/components/tabs/OverviewTab';

export const dynamic = 'force-dynamic';

export default async function OverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = await params;
  const analysis = await getAnalysisBySlug(slug);
  if (!analysis) return null; // layout handles 404

  const fullTemplates = await getCategoryTemplatesFull(analysis.category_id);
  const categoryTemplates = buildCategoryTemplates(fullTemplates);
  const nicheTemplateMap = analysis.niche_template_map || {};
  const niches = analysis.niche_distribution || [];
  const categoryInsights = buildCategoryInsights(fullTemplates, nicheTemplateMap, niches);
  const isID = isIndonesianCategory(analysis.category_name || '');

  return (
    <OverviewTab
      analysis={analysis}
      niches={niches}
      insights={analysis.key_insights || []}
      recs={analysis.recommendations || []}
      categoryInsights={categoryInsights}
      isID={isID}
      slug={slug}
      categoryTemplates={categoryTemplates}
      nicheTemplateMap={nicheTemplateMap}
    />
  );
}
