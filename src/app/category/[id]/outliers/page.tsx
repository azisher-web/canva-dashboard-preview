import { getAnalysisBySlug, getCategoryTemplatesFull, buildCategoryTemplates, buildTemplateMap, isIndonesianCategory } from '@/lib/category-data';
import OutliersTab from '@/components/tabs/OutliersTab';

export const dynamic = 'force-dynamic';

export default async function OutliersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = await params;
  const analysis = await getAnalysisBySlug(slug);
  if (!analysis) return null;

  const fullTemplates = await getCategoryTemplatesFull(analysis.category_id);
  const categoryTemplates = buildCategoryTemplates(fullTemplates);
  const templateMap = buildTemplateMap(fullTemplates);
  const nicheTemplateMap = analysis.niche_template_map || {};
  const isID = isIndonesianCategory(analysis.category_name || '');

  return (
    <OutliersTab
      outliers={analysis.outliers || []}
      templateMap={templateMap}
      nicheTemplateMap={nicheTemplateMap}
      categoryTemplates={categoryTemplates}
      isID={isID}
    />
  );
}
