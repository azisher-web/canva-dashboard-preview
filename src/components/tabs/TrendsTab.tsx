'use client';

import React from 'react';
import DesignTrends, { type PatternDrawerData } from '@/components/DesignTrends';
import type { DesignAnalysis } from '@/lib/types';
import { DrawerShell, TemplateThumbnail, THUMB_GRADIENTS, EmptyState } from './shared';

interface CategoryTemplate {
  title: string;
  thumbnail: string;
  url: string;
  is_pro: boolean;
  creator?: string;
}

function StylePatternDrawerContent({ pattern, categoryTemplates }: { pattern: PatternDrawerData; categoryTemplates: CategoryTemplate[] }) {
  const matched = (pattern.matchedTemplates || []).map(mt => {
    const title = typeof mt === 'string' ? mt : mt.title;
    const ct = categoryTemplates.find(t => t.title === title);
    return ct ? { title: ct.title, thumbnail: ct.thumbnail, url: ct.url, is_pro: ct.is_pro } : { title, thumbnail: '', url: '', is_pro: false };
  });

  return (
    <div>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{pattern.pattern}</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dim)' }}>{pattern.style}</span>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
          background: pattern.signal === 'high' ? 'rgba(1,181,116,0.15)' : pattern.signal === 'medium' ? 'rgba(255,206,32,0.15)' : 'rgba(163,174,208,0.1)',
          color: pattern.signal === 'high' ? '#01B574' : pattern.signal === 'medium' ? '#FFCE20' : '#a3aed0',
          textTransform: 'uppercase',
        }}>{pattern.signal} signal</span>
        <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{pattern.total_count} templates · {pattern.niches.length} niches</span>
      </div>

      {pattern.niches.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Niches</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {pattern.niches.map(n => (
              <span key={n} style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 8, background: 'var(--bg-hover)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{n}</span>
            ))}
          </div>
        </div>
      )}

      {matched.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Template Examples</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8 }}>
            {matched.slice(0, 12).map((t, i) => (
              <TemplateThumbnail key={i} title={t.title} canvaUrl={t.url} thumbnailUrl={t.thumbnail} index={i} size={80} showTitle isPro={t.is_pro} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrendsTabClient({ designAnalysis, categoryTemplates }: {
  designAnalysis: DesignAnalysis | null;
  categoryTemplates: CategoryTemplate[];
}) {
  const [drawer, setDrawer] = React.useState<PatternDrawerData | null>(null);

  if (!designAnalysis) return <EmptyState text="No design trend data available for this category." />;

  return (
    <>
      <DesignTrends data={designAnalysis} onOpenPattern={(p) => setDrawer(p)} />
      {drawer && (
        <DrawerShell kind="style pattern" onClose={() => setDrawer(null)}>
          <StylePatternDrawerContent pattern={drawer} categoryTemplates={categoryTemplates} />
        </DrawerShell>
      )}
    </>
  );
}
