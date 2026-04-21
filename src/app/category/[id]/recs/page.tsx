import { getAnalysisBySlug, getCategoryTemplatesFull, buildTemplateMap } from '@/lib/category-data';
import RecsTab from '@/components/tabs/RecsTab';

export const dynamic = 'force-dynamic';

export default async function RecsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = await params;
  const analysis = await getAnalysisBySlug(slug);
  if (!analysis) return null;

  const fullTemplates = await getCategoryTemplatesFull(analysis.category_id);
  const templateMap = buildTemplateMap(fullTemplates);

  return (
    <RecsTab
      recs={analysis.recommendations || []}
      templateMap={templateMap}
      analysis={analysis}
    />
  );
}
