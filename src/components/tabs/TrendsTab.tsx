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
      <div style={{ position: 'relative' }}>
        {/* Show the real component but limit height and blur the overflow */}
        <div style={{ maxHeight: 520, overflow: 'hidden' }}>
          <DesignTrends data={designAnalysis} onOpenPattern={(p) => setDrawer(p)} />
        </div>
        {/* Blur gradient overlay at bottom */}
        <div style={{
          position: 'absolute',
          left: 0, right: 0, bottom: 0,
          height: '60%',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(var(--bg-rgb, 15,15,26), 0.4) 30%, rgba(var(--bg-rgb, 15,15,26), 0.85) 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          zIndex: 10,
        }}>
          <a href="https://kelaskreator.com/" target="_blank" rel="noopener noreferrer" style={{
            background: 'linear-gradient(135deg, #6B5BFF, #4299e1)',
            color: '#fff', padding: '10px 24px', borderRadius: 12,
            fontSize: 13, fontWeight: 700,
            boxShadow: '0 8px 32px rgba(107,91,255,0.3)',
            textDecoration: 'none', display: 'inline-block',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(107,91,255,0.45)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(107,91,255,0.3)'; }}
          >
            🔒 Subscribe to kelaskreator.com to unlock all design trends
          </a>
          <div style={{ fontSize: 12, color: 'var(--text-dim)', fontWeight: 500 }}>
            🔓 Full style analysis available with premium access
          </div>
        </div>
      </div>
      {drawer && (
        <DrawerShell kind="style pattern" onClose={() => setDrawer(null)}>
          <StylePatternDrawerContent pattern={drawer} categoryTemplates={categoryTemplates} />
        </DrawerShell>
      )}
    </>
  );
}
