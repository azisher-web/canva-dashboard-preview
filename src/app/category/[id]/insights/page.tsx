import { PreviewBanner } from '@/components/PreviewGate';

export const dynamic = 'force-dynamic';

export default async function InsightsPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <PreviewBanner text="Advanced Insights available with full access — unlock creator dominance analysis, keyword intelligence, content gap detection, and more." />
  );
}
