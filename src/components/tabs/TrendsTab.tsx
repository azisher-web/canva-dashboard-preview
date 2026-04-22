'use client';

import React, { useState } from 'react';
import BODashIcon from '@/components/BODashIcon';
import type { PatternDrawerData } from '@/components/DesignTrends';
import type { DesignAnalysis, CrossNichePattern, NicheStyleItem, StyleRecommendation } from '@/lib/types';
import { DrawerShell, TemplateThumbnail, EmptyState } from './shared';
import {
  fakeStyles, fakeCrossNichePatterns, fakeNicheStyles, fakeStyleRecs,
  BLUR_WRAPPER_STYLE, BLUR_OVERLAY_STYLE, BLUR_CTA_STYLE,
} from '@/lib/fakeData';

interface CategoryTemplate {
  title: string;
  thumbnail: string;
  url: string;
  is_pro: boolean;
  creator?: string;
}

/* ── Style → color mapping (mirrored from DesignTrends) ── */
const STYLE_COLORS: Record<string, string> = {
  'Minimalist': '#60a5fa',
  'Maximalist': '#f59e0b',
  'Flat Design': '#34d399',
  'Corporate / Professional': '#a78bfa',
  '3D / Isometric': '#fb923c',
  'Retro / Vintage': '#fbbf24',
  'Brutalist': '#ef4444',
  'Gradient / Glassmorphism': '#818cf8',
  'Photo-Centric': '#2dd4bf',
  'Illustrated / Hand-drawn': '#e27b4a',
  'Typography-Heavy': '#c084fc',
  'Playful / Fun': '#38bdf8',
  'Elegant / Luxury': '#d4a574',
  'Collage / Scrapbook': '#a3e635',
};
function getStyleColor(style: string): string {
  return STYLE_COLORS[style] || '#94a3b8';
}

function SignalBadge({ signal }: { signal: string }) {
  const cfg: Record<string, { bg: string; text: string }> = {
    high: { bg: 'var(--green-dim, rgba(52,211,153,0.15))', text: 'var(--green)' },
    medium: { bg: 'var(--yellow-dim, rgba(251,191,36,0.15))', text: 'var(--yellow)' },
    low: { bg: 'var(--bg-hover)', text: 'var(--text-muted)' },
  };
  const c = cfg[signal] || cfg.low;
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
      background: c.bg, color: c.text, textTransform: 'uppercase', letterSpacing: '0.05em',
    }}>
      {signal}
    </span>
  );
}

/* ── CTA Link ── */
function LockCTA({ label }: { label: string }) {
  return (
    <a href="https://kelaskreator.com/" target="_blank" rel="noopener noreferrer"
      style={BLUR_CTA_STYLE}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(107,91,255,0.45)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(107,91,255,0.3)'; }}
    >
      🔒 {label}
    </a>
  );
}

/* ── Blur Section helper ── */
function BlurSection({ children, fakeContent, hasMore, ctaLabel }: {
  children: React.ReactNode;
  fakeContent: React.ReactNode;
  hasMore: boolean;
  ctaLabel: string;
}) {
  if (!hasMore) return <>{children}</>;
  return (
    <>
      {children}
      <div style={{ position: 'relative', marginTop: 10 }}>
        <div style={BLUR_WRAPPER_STYLE} aria-hidden="true">
          {fakeContent}
        </div>
        <div style={BLUR_OVERLAY_STYLE}>
          <LockCTA label={ctaLabel} />
        </div>
      </div>
    </>
  );
}

/* ── Drawer Content ── */
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
        <SignalBadge signal={pattern.signal} />
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

/* ── Single style bar row ── */
function StyleBar({ styleName, count, total }: { styleName: string; count: number; total: number }) {
  const pct = Math.round((count / total) * 100);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, fontWeight: 600, marginBottom: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 3, background: getStyleColor(styleName), flexShrink: 0 }} />
          <span style={{ color: 'var(--text)' }}>{styleName}</span>
        </div>
        <span style={{ color: 'var(--text-dim)' }}>{count} ({pct}%)</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-hover)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 3, background: getStyleColor(styleName), transition: 'width 0.4s ease' }} />
      </div>
    </div>
  );
}

/* ── Single pattern row ── */
function PatternRow({ p, onClick }: { p: CrossNichePattern; onClick?: () => void }) {
  return (
    <div onClick={onClick} style={{
      padding: '12px 14px', borderRadius: 12,
      background: 'var(--bg-hover)', border: '1px solid var(--border)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'opacity 0.15s',
    }} onMouseEnter={e => { if (onClick) e.currentTarget.style.opacity = '0.75'; }}
       onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ width: 10, height: 10, borderRadius: 4, background: getStyleColor(p.style), flexShrink: 0 }} />
        <span style={{ fontSize: 14.5, fontWeight: 700 }}>{p.style}</span>
        <SignalBadge signal={p.signal} />
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-dim)' }}>{p.total_count} templates</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
        Found in {p.niches.length} niches: {p.niches.join(', ')}
      </p>
    </div>
  );
}

/* ── Fake niche row (for blur section) ── */
function FakeNicheRow({ ns }: { ns: { niche: string; dominant_style: string; styles: { style: string; count: number }[] } }) {
  const total = ns.styles.reduce((s, x) => s + x.count, 0) || 1;
  return (
    <div style={{
      width: '100%', textAlign: 'left', padding: '12px 14px', borderRadius: 12,
      background: 'var(--bg-hover)', border: '1px solid transparent',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text)' }}>{ns.niche}</span>
        <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{total} · {ns.dominant_style}</span>
      </div>
      <div style={{ display: 'flex', borderRadius: 4, overflow: 'hidden', height: 8 }}>
        {ns.styles.map((s, j) => (
          <div key={j} style={{ width: `${(s.count / total) * 100}%`, background: getStyleColor(s.style), minWidth: 3 }} />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Main TrendsTab — per-section lock controls
   ══════════════════════════════════════════════════════════════════════════ */
export default function TrendsTabClient({ designAnalysis, categoryTemplates }: {
  designAnalysis: DesignAnalysis | null;
  categoryTemplates: CategoryTemplate[];
}) {
  const [drawer, setDrawer] = useState<PatternDrawerData | null>(null);
  const [activeNiche, setActiveNiche] = useState<string | null>(null);

  if (!designAnalysis) return <EmptyState text="No design trend data available for this category." />;

  const styleData = (designAnalysis.style_distribution || []).map(({ style: s, ...rest }) => ({ ...rest, styleName: s }));
  const nicheStyles = designAnalysis.niche_styles || [];
  const patterns = designAnalysis.cross_niche_patterns || [];
  const insights = designAnalysis.key_insights || [];
  const totalStyles = styleData.reduce((s, x) => s + x.count, 0) || 1;
  const selectedNiche = activeNiche ? nicheStyles.find(n => n.niche === activeNiche) : null;

  const VISIBLE = 3;

  const handlePatternClick = (p: CrossNichePattern) => {
    const matched: PatternDrawerData['matchedTemplates'] = [];
    for (const ns of nicheStyles) {
      if (p.niches.includes(ns.niche)) {
        for (const t of ns.templates) {
          if (t.style === p.style) {
            matched.push({ title: t.title, niche: ns.niche, confidence: t.confidence, notes: t.notes });
          }
        }
      }
    }
    setDrawer({ ...p, matchedTemplates: matched });
  };

  const recommendations = designAnalysis.style_recommendations || [];

  const fakeStyleData = fakeStyles(Math.max(0, styleData.length - VISIBLE));
  const fakePatternData = fakeCrossNichePatterns(Math.max(0, patterns.length - VISIBLE));
  const fakeNicheData = fakeNicheStyles(Math.max(0, nicheStyles.length - VISIBLE));
  const fakeRecData = fakeStyleRecs(Math.max(0, recommendations.length - VISIBLE));

  return (
    <>
      <div>
        {/* ────── Section Header (always visible) ────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BODashIcon name="palette" size={18} color="var(--accent)" />
            <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', margin: 0 }}>Design Trend Analysis</h2>
          </div>
          <span style={{
            fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 8,
            background: 'var(--bg-hover)', color: 'var(--text-muted)',
          }}>
            {designAnalysis.total_images_analyzed} images &middot; {designAnalysis.total_blue_niches} niches
          </span>
        </div>

        {/* ────── Key Insights (always visible, no lock) ────── */}
        {insights.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 28 }}>
            {insights.map((insight, i) => (
              <div key={i} className="card2" style={{
                padding: '14px 18px', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65,
                borderLeft: '3px solid var(--accent)',
              }}>
                {insight}
              </div>
            ))}
          </div>
        )}

        {/* ────── Style Distribution + Cross-Niche Patterns (2-col) ────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28, alignItems: 'start' }}>

          {/* Style Distribution — top 3 visible, rest locked */}
          <div className="card2" style={{ padding: 22 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Style Distribution (Blue Ocean Only)</div>
            <BlurSection
              hasMore={styleData.length > VISIBLE}
              ctaLabel="Subscribe to unlock all style data"
              fakeContent={
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {fakeStyleData.map((s, i) => (
                    <StyleBar key={i} styleName={s.style} count={s.count} total={100} />
                  ))}
                </div>
              }
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {styleData.slice(0, VISIBLE).map((s, i) => (
                  <StyleBar key={i} styleName={s.styleName} count={s.count} total={totalStyles} />
                ))}
              </div>
            </BlurSection>
          </div>

          {/* Cross-Niche Patterns — top 3 visible, rest locked */}
          <div className="card2" style={{ padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div className="eyebrow" style={{ margin: 0 }}>Cross-Niche Patterns</div>
              <span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 500 }}>Click to see templates</span>
            </div>
            {patterns.length > 0 ? (
              <BlurSection
                hasMore={patterns.length > VISIBLE}
                ctaLabel="Subscribe to unlock all patterns"
                fakeContent={
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {fakePatternData.map((p, i) => (
                      <PatternRow key={i} p={p as CrossNichePattern} />
                    ))}
                  </div>
                }
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {patterns.slice(0, VISIBLE).map((p, i) => (
                    <PatternRow key={i} p={p} onClick={() => handlePatternClick(p)} />
                  ))}
                </div>
              </BlurSection>
            ) : (
              <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>No cross-niche patterns detected.</p>
            )}
          </div>
        </div>

        {/* ────── Style per Niche — top 3 visible, rest locked ────── */}
        <div className="card2" style={{ padding: 22, marginBottom: 28 }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Style per Niche (click to explore)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Niche list — top 3 real + blurred fake */}
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {nicheStyles.slice(0, VISIBLE).map((ns, i) => {
                  const total = ns.styles.reduce((s, x) => s + x.count, 0);
                  const isActive = activeNiche === ns.niche;
                  return (
                    <button key={i} onClick={() => setActiveNiche(isActive ? null : ns.niche)} style={{
                      width: '100%', textAlign: 'left', padding: '12px 14px', borderRadius: 12,
                      background: isActive ? 'var(--accent-dim)' : 'var(--bg-hover)',
                      border: isActive ? '1px solid var(--accent)' : '1px solid transparent',
                      cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s ease',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text)' }}>{ns.niche}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{total} · {ns.dominant_style}</span>
                      </div>
                      <div style={{ display: 'flex', borderRadius: 4, overflow: 'hidden', height: 8 }}>
                        {ns.styles.map((s, j) => (
                          <div key={j} style={{ width: `${(s.count / total) * 100}%`, background: getStyleColor(s.style), minWidth: 3 }} title={`${s.style}: ${s.count}`} />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
              {nicheStyles.length > VISIBLE && (
                <div style={{ position: 'relative', marginTop: 8 }}>
                  <div style={BLUR_WRAPPER_STYLE} aria-hidden="true">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {fakeNicheData.map((ns, i) => <FakeNicheRow key={i} ns={ns} />)}
                    </div>
                  </div>
                  <div style={BLUR_OVERLAY_STYLE}>
                    <LockCTA label="Subscribe to unlock all niches" />
                  </div>
                </div>
              )}
            </div>

            {/* Detail panel */}
            <div>
              {selectedNiche ? (
                <div style={{ padding: 16, borderRadius: 14, background: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
                  <h4 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px' }}>{selectedNiche.niche}</h4>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>{selectedNiche.design_note}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                    {selectedNiche.styles.map((s, j) => {
                      const total = selectedNiche.styles.reduce((sum, x) => sum + x.count, 0);
                      return (
                        <div key={j}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                            <span style={{ color: getStyleColor(s.style) }}>{s.style}</span>
                            <span style={{ color: 'var(--text-dim)' }}>{s.count}</span>
                          </div>
                          <div style={{ height: 5, borderRadius: 3, background: 'var(--bg-card)', overflow: 'hidden' }}>
                            <div style={{ width: `${(s.count / total) * 100}%`, height: '100%', borderRadius: 3, background: getStyleColor(s.style) }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="eyebrow" style={{ marginBottom: 8, fontSize: 10 }}>Templates ({selectedNiche.templates.length})</div>
                  <div style={{ maxHeight: 180, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {selectedNiche.templates.map((t, j) => (
                      <div key={j} style={{
                        display: 'flex', alignItems: 'center', gap: 8, fontSize: 12,
                        padding: '6px 8px', borderRadius: 8, background: 'var(--bg-card)',
                      }}>
                        <span style={{ width: 8, height: 8, borderRadius: 4, background: getStyleColor(t.style), flexShrink: 0 }} />
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>{t.title}</span>
                        <span style={{
                          fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4,
                          background: getStyleColor(t.style) + '20', color: getStyleColor(t.style),
                        }}>{t.style.split(' / ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{
                  height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: 32, borderRadius: 14, background: 'var(--bg-hover)', color: 'var(--text-dim)',
                }}>
                  <p style={{ fontSize: 13, textAlign: 'center', margin: 0 }}>Click a niche on the left to see detailed style breakdown and templates</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ────── Style Recommendations ────── */}
        {recommendations.length > 0 && (
          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Style Recommendations</div>
            <BlurSection
              hasMore={recommendations.length > VISIBLE}
              ctaLabel="Subscribe to unlock all recommendations"
              fakeContent={
                <div className="bento">
                  {fakeRecData.map((rec, i) => (
                    <div key={i} className="col-4">
                      <div className="card2" style={{ padding: '16px 20px' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{rec.niche}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                          <span style={{
                            fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
                            background: getStyleColor(rec.current_dominant) + '20', color: getStyleColor(rec.current_dominant),
                          }}>
                            Current: {rec.current_dominant}
                          </span>
                          <BODashIcon name="arrowRight" size={12} color="var(--text-dim)" />
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                            background: getStyleColor(rec.recommended_style) + '20', color: getStyleColor(rec.recommended_style),
                          }}>
                            Try: {rec.recommended_style}
                          </span>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.55, margin: 0 }}>{rec.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              }
            >
              <div className="bento">
                {recommendations.slice(0, VISIBLE).map((rec, i) => (
                  <div key={i} className="col-4">
                    <div className="card2" style={{ padding: '16px 20px' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{rec.niche}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
                          background: getStyleColor(rec.current_dominant) + '20', color: getStyleColor(rec.current_dominant),
                        }}>
                          Current: {rec.current_dominant}
                        </span>
                        <BODashIcon name="arrowRight" size={12} color="var(--text-dim)" />
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                          background: getStyleColor(rec.recommended_style) + '20', color: getStyleColor(rec.recommended_style),
                        }}>
                          Try: {rec.recommended_style}
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.55, margin: 0 }}>{rec.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </BlurSection>
          </div>
        )}
      </div>

      {/* Drawer */}
      {drawer && (
        <DrawerShell kind="style pattern" onClose={() => setDrawer(null)}>
          <StylePatternDrawerContent pattern={drawer} categoryTemplates={categoryTemplates} />
        </DrawerShell>
      )}
    </>
  );
}
