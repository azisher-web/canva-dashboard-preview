'use client';

import { useState } from 'react';
import BODashIcon from './BODashIcon';
import type { DesignAnalysis } from '@/lib/types';

// Style → color mapping
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

export interface PatternDrawerData {
  pattern: string;
  style: string;
  signal: 'high' | 'medium' | 'low';
  total_count: number;
  niches: string[];
  // collected from niche_styles
  matchedTemplates: { title: string; niche: string; confidence: string; notes: string }[];
}

export default function DesignTrends({ data, onOpenPattern }: { data: DesignAnalysis; onOpenPattern?: (p: PatternDrawerData) => void }) {
  const [activeNiche, setActiveNiche] = useState<string | null>(null);

  const styleData = (data.style_distribution || []).map(({ style: s, ...rest }) => ({ ...rest, styleName: s }));
  const nicheStyles = data.niche_styles || [];
  const patterns = data.cross_niche_patterns || [];
  const recommendations = data.style_recommendations || [];
  const insights = data.key_insights || [];

  const selectedNiche = activeNiche ? nicheStyles.find(n => n.niche === activeNiche) : null;
  const totalStyles = styleData.reduce((s, x) => s + x.count, 0) || 1;

  return (
    <div>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BODashIcon name="palette" size={18} color="var(--accent)" />
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', margin: 0 }}>Design Trend Analysis</h2>
        </div>
        <span style={{
          fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 8,
          background: 'var(--bg-hover)', color: 'var(--text-muted)',
        }}>
          {data.total_images_analyzed} images &middot; {data.total_blue_niches} niches
        </span>
      </div>

      {/* Key Insights */}
      {insights.length > 0 && (
        <div className="grid-responsive-2col-to-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 28 }}>
          {insights.map((insight, i) => (
            <div key={i} className="card2" style={{
              padding: '14px 18px', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65,
              borderLeft: `3px solid var(--accent)`,
            }}>
              {insight}
            </div>
          ))}
        </div>
      )}

      {/* Style Distribution + Cross-Niche Patterns */}
      <div className="grid-responsive-2col-to-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28, alignItems: 'start' }}>
        {/* Style Distribution — no scroll, full height */}
        <div className="card2" style={{ padding: 22 }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Style Distribution (Blue Ocean Only)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {styleData.map((s, i) => {
              const pct = Math.round((s.count / totalStyles) * 100);
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, fontWeight: 600, marginBottom: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 3, background: getStyleColor(s.styleName), flexShrink: 0 }} />
                      <span style={{ color: 'var(--text)' }}>{s.styleName}</span>
                    </div>
                    <span style={{ color: 'var(--text-dim)' }}>{s.count} ({pct}%)</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-hover)', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`, height: '100%', borderRadius: 3,
                      background: getStyleColor(s.styleName), transition: 'width 0.4s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cross-Niche Patterns — clickable items, scrollable */}
        <div className="card2" style={{ padding: 22, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexShrink: 0 }}>
            <div className="eyebrow" style={{ margin: 0 }}>Cross-Niche Patterns</div>
            {onOpenPattern && <span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 500 }}>Click to see templates</span>}
          </div>
          {patterns.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 460, overflowY: 'auto' }}>
              {patterns.map((p, i) => {
                const handleClick = () => {
                  if (!onOpenPattern) return;
                  // Collect templates matching this style from niche_styles
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
                  onOpenPattern({ ...p, matchedTemplates: matched });
                };
                return (
                  <div key={i} onClick={handleClick} style={{
                    padding: '12px 14px', borderRadius: 12,
                    background: 'var(--bg-hover)', border: '1px solid var(--border)',
                    cursor: onOpenPattern ? 'pointer' : 'default',
                    transition: 'opacity 0.15s',
                  }} onMouseEnter={e => { if (onOpenPattern) e.currentTarget.style.opacity = '0.75'; }}
                     onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 4, background: getStyleColor(p.style), flexShrink: 0 }} />
                      <span style={{ fontSize: 14.5, fontWeight: 700 }}>{p.style}</span>
                      <SignalBadge signal={p.signal} />
                      <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-dim)' }}>
                        {p.total_count} templates
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
                      Found in {p.niches.length} niches: {p.niches.join(', ')}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>No cross-niche patterns detected.</p>
          )}
        </div>
      </div>

      {/* Per-Niche Style Breakdown — master/detail layout */}
      <div className="card2" style={{ padding: 22, marginBottom: 28 }}>
        <div className="eyebrow" style={{ marginBottom: 16 }}>Style per Niche (click to explore)</div>
        <div className="grid-responsive-2col-to-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Niche list */}
          <div style={{ maxHeight: 400, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 8 }}>
            {nicheStyles.map((ns, i) => {
              const total = ns.styles.reduce((s, x) => s + x.count, 0);
              const isActive = activeNiche === ns.niche;
              return (
                <button key={i} onClick={() => setActiveNiche(isActive ? null : ns.niche)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '12px 14px', borderRadius: 12,
                    background: isActive ? 'var(--accent-dim)' : 'var(--bg-hover)',
                    border: isActive ? '1px solid var(--accent)' : '1px solid transparent',
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s ease',
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text)' }}>{ns.niche}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                      {total} &middot; {ns.dominant_style}
                    </span>
                  </div>
                  {/* Mini bar */}
                  <div style={{ display: 'flex', borderRadius: 4, overflow: 'hidden', height: 8 }}>
                    {ns.styles.map((s, j) => (
                      <div key={j} style={{
                        width: `${(s.count / total) * 100}%`,
                        background: getStyleColor(s.style),
                        minWidth: 3,
                      }} title={`${s.style}: ${s.count}`} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div>
            {selectedNiche ? (
              <div style={{ padding: 16, borderRadius: 14, background: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px' }}>{selectedNiche.niche}</h4>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>{selectedNiche.design_note}</p>

                {/* Style breakdown bars */}
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

                {/* Templates */}
                <div className="eyebrow" style={{ marginBottom: 8, fontSize: 10 }}>Templates ({selectedNiche.templates.length})</div>
                <div style={{ maxHeight: 180, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {selectedNiche.templates.map((t, j) => (
                    <div key={j} style={{
                      display: 'flex', alignItems: 'center', gap: 8, fontSize: 12,
                      padding: '6px 8px', borderRadius: 8, background: 'var(--bg-card)',
                    }}>
                      <span style={{ width: 8, height: 8, borderRadius: 4, background: getStyleColor(t.style), flexShrink: 0 }} />
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
                        {t.title}
                      </span>
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4,
                        background: getStyleColor(t.style) + '20', color: getStyleColor(t.style),
                      }}>
                        {t.style.split(' / ')[0]}
                      </span>
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

      {/* Style Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Style Recommendations</div>
          <div className="bento">
            {recommendations.map((rec, i) => (
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
        </div>
      )}
    </div>
  );
}
