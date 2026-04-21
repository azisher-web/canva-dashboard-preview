import Link from 'next/link';
import BODashIcon from '@/components/BODashIcon';
import { getAnalysisBySlug } from '@/lib/category-data';
import CategoryTabNav from '@/components/CategoryTabNav';
import { PreviewBanner } from '@/components/PreviewGate';

export const dynamic = 'force-dynamic';

export default async function CategoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  const analysis = await getAnalysisBySlug(slug);

  if (!analysis) {
    return (
      <div className="card2" style={{ margin: 40, padding: 40, textAlign: 'center' }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Analysis not found</h1>
        <Link href="/" style={{ color: 'var(--accent)', fontSize: 14, fontWeight: 600 }}>Back to Dashboard</Link>
      </div>
    );
  }

  const blueSharePct = analysis.total_niches > 0
    ? Math.round(analysis.blue_ocean_count / analysis.total_niches * 100) : 0;

  return (
    <div>
      {/* Hero header */}
      <div>
        <Link
          href="/"
          className="btn btn-ghost"
          style={{ marginBottom: 20, padding: '8px 14px', display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}
        >
          <BODashIcon name="arrowLeft" size={13} /> Back to dashboard
        </Link>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' as const }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span className="eyebrow">{analysis.month}</span>
              <span style={{ width: 3, height: 3, borderRadius: 2, background: 'var(--text-dim)', display: 'inline-block' }} />
              <span className="eyebrow" style={{ color: 'var(--blue)' }}>BLUE OCEAN &middot; {blueSharePct}%</span>
            </div>
            <h1 className="display-xl" style={{ margin: 0, textTransform: 'capitalize' as const }}>
              {analysis.category_name.replace(/-/g, ' ')}
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 10, maxWidth: 640 }}>
              {analysis.total_templates} templates &middot; {analysis.total_niches} niches &middot; {analysis.blue_ocean_count} opportunities surfaced.
            </p>
          </div>
        </div>
      </div>

      {/* Tab navigation (client component for active state) */}
      <CategoryTabNav slug={slug} />

      {/* Tab content (child route) */}
      <div className="rise">
        {children}
      </div>
    </div>
  );
}
