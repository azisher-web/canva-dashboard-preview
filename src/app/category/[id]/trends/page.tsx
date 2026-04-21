import { getAnalysisBySlug, getDesignAnalysis, getCategoryTemplatesFull, buildCategoryTemplates } from '@/lib/category-data';
import TrendsTabClient from '@/components/tabs/TrendsTab';

export const dynamic = 'force-dynamic';

export default async function TrendsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = await params;
  const analysis = await getAnalysisBySlug(slug);
  if (!analysis) return null;

  const designAnalysis = await getDesignAnalysis(analysis.category_id, analysis.month);
  const fullTemplates = await getCategoryTemplatesFull(analysis.category_id);
  const categoryTemplates = buildCategoryTemplates(fullTemplates);

  return (
    <TrendsTabClient
      designAnalysis={designAnalysis}
      categoryTemplates={categoryTemplates}
    />
  );
}
