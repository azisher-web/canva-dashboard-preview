import { PreviewBanner } from '@/components/PreviewGate';

export const dynamic = 'force-dynamic';

export default function ComparePage() {
  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 6 }}>Compare</div>
      <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.022em', margin: '0 0 20px' }}>Category Comparison</h2>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 24, maxWidth: 600 }}>
        Compare categories side by side — see template growth, blue ocean shifts, and competition trends across months.
      </p>
      <PreviewBanner text="Category comparison available with full access — compare growth, zones, and trends across all categories." />
    </div>
  );
}
