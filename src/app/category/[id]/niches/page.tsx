import { getAnalysisBySlug, getCategoryTemplatesFull, buildCategoryTemplates, buildCategoryInsights, isIndonesianCategory } from '@/lib/category-data';
import NichesTab from '@/components/tabs/NichesTab';

export const dynamic = 'force-dynamic';

export default async function NichesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = await params;
  const analysis = await getAnalysisBySlug(slug);
  if (!analysis) return null;

  const fullTemplates = await getCategoryTemplatesFull(analysis.category_id);
  const categoryTemplates = buildCategoryTemplates(fullTemplates);
  const nicheTemplateMap = analysis.niche_template_map || {};
  const niches = analysis.niche_distribution || [];
  const categoryInsights = buildCategoryInsights(fullTemplates, nicheTemplateMap, niches);

  return (
    <NichesTab
      niches={niches}
      categoryTemplates={categoryTemplates}
      nicheTemplateMap={nicheTemplateMap}
      nicheCreators={categoryInsights.nicheCreators}
    />
  );
}
