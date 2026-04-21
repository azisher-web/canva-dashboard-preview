'use client';

import React from 'react';
import DesignTrends, { type PatternDrawerData } from '@/components/DesignTrends';
import type { DesignAnalysis } from '@/lib/types';
import { DrawerShell, TemplateThumbnail, THUMB_GRADIENTS, EmptyState } from './shared';
import { fakeStyles, BLUR_CTA_STYLE, BLUR_WRAPPER_STYLE, BLUR_OVERLAY_STYLE } from '@/lib/fakeData';

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
  const [openPattern, setOpenPattern] = React.useState<PatternDrawerData | null>(null);

  if (!designAnalysis || !designAnalysis.style_distribution?.length) {
    return <EmptyState text="No design trends data available for this category." />;
  }

  const patterns = designAnalysis.style_distribution || [];
  const VISIBLE_LIMIT = 3;
  const visiblePatterns = patterns.slice(0, VISIBLE_LIMIT);
  const blurredPatterns = patterns.slice(VISIBLE_LIMIT);

  const renderPatternCard = (p: typeof patterns[0], i: number) => (
    <div key={i} className="col-4">
      <div className="card2 interactive" style={{ padding: '18px 20px', cursor: 'pointer' }}
        onClick={() => setOpenPattern({
          pattern: p.style,
          style: p.style,
          signal: p.count > 8 ? 'high' : p.count > 4 ? 'medium' : 'low',
          total_count: p.count,
          niches: [],
          matchedTemplates: [],
        })}
      >
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{p.style}</div>
        <div style={{ display: 'flex', gap: 14, fontSize: 12, fontWeight: 600 }}>
          <span>{p.count} templates</span>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
            background: p.count > 8 ? 'rgba(1,181,116,0.15)' : p.count > 4 ? 'rgba(255,206,32,0.15)' : 'var(--bg-hover)',
            color: p.count > 8 ? '#01B574' : p.count > 4 ? '#FFCE20' : 'var(--text-dim)',
            textTransform: 'uppercase',
          }}>
            {p.count > 8 ? 'high' : p.count > 4 ? 'medium' : 'low'} signal
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Design Trends</div>
        <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 14px', lineHeight: 1.5 }}>
          Style patterns and visual signals identified across templates.
        </p>

        {/* Visible top 3 */}
        <div className="bento stagger">
          {visiblePatterns.map((p, i) => renderPatternCard(p, i))}
        </div>

        {/* Blurred remaining — uses fake data so real data is never exposed */}
        {blurredPatterns.length > 0 && (() => {
          const fake = fakeStyles(blurredPatterns.length);
          return (
            <div style={{ position: 'relative', marginTop: 12 }}>
              <div style={BLUR_WRAPPER_STYLE} aria-hidden="true">
                <div className="bento">
                  {fake.map((f, i) => (
                    <div key={i} className="col-4">
                      <div className="card2" style={{ padding: '18px 20px' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{f.style}</div>
                        <div style={{ display: 'flex', gap: 14, fontSize: 12, fontWeight: 600 }}>
                          <span>{f.count} templates</span>
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                            background: f.signal === 'high' ? 'rgba(1,181,116,0.15)' : f.signal === 'medium' ? 'rgba(255,206,32,0.15)' : 'var(--bg-hover)',
                            color: f.signal === 'high' ? '#01B574' : f.signal === 'medium' ? '#FFCE20' : 'var(--text-dim)',
                            textTransform: 'uppercase',
                          }}>
                            {f.signal} signal
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={BLUR_OVERLAY_STYLE}>
                <div style={BLUR_CTA_STYLE}>
                  🔒 Subscribe to kelaskreator.com to unlock all insights
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', fontWeight: 500 }}>
                  🔓 {blurredPatterns.length} more design trends available with full access
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {openPattern && (
        <DrawerShell kind="Design Pattern" onClose={() => setOpenPattern(null)}>
          <StylePatternDrawerContent pattern={openPattern} categoryTemplates={categoryTemplates} />
        </DrawerShell>
      )}
    </>
  );
}
