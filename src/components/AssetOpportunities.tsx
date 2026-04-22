'use client';

import { useState } from 'react';
import BODashIcon from './BODashIcon';
import type { DesignAnalysis } from '@/lib/types';

// Category → color + icon
const CATEGORY_CONFIG: Record<string, { color: string; icon: string }> = {
  'Object Cutout': { color: '#60a5fa', icon: '✂️' },
  'Shape': { color: '#f59e0b', icon: '⬡' },
  'Texture': { color: '#a78bfa', icon: '▦' },
  'Stationery': { color: '#34d399', icon: '📎' },
  'Nature & Organic': { color: '#2dd4bf', icon: '🌿' },
  'Other': { color: '#94a3b8', icon: '◈' },
};

function getCatConfig(cat: string) {
  return CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['Other'];
}

function DemandBadge({ signal }: { signal: string }) {
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
      {signal} demand
    </span>
  );
}

export default function AssetOpportunities({ data, onOpenPack }: { data: DesignAnalysis; onOpenPack?: (pack: DesignAnalysis['asset_packs'][number]) => void }) {
  const [nicheFilter, setNicheFilter] = useState<string | null>(null);

  const assets = data.asset_distribution || [];
  const categoryDist = data.asset_category_dist || [];
  const packs = data.asset_packs || [];

  const filteredAssets = nicheFilter
    ? assets.filter(a => a.niches.includes(nicheFilter))
    : assets;

  const allNiches = [...new Set(assets.flatMap(a => a.niches))];
  const totalAssets = categoryDist.reduce((s, c) => s + c.count, 0) || 1;

  return (
    <div>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BODashIcon name="shapes" size={18} color="var(--accent)" />
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', margin: 0 }}>Asset Opportunities</h2>
        </div>
        <span style={{
          fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 8,
          background: 'var(--bg-hover)', color: 'var(--text-muted)',
        }}>
          {assets.length} unique assets &middot; {packs.length} pack ideas
        </span>
      </div>

      {/* Asset Categories — compact horizontal strip */}
      <div className="card2" style={{ padding: '16px 22px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span className="eyebrow" style={{ margin: 0, flexShrink: 0 }}>Asset Categories</span>
          <div style={{ display: 'flex', gap: 10, flex: 1, flexWrap: 'wrap' }}>
            {categoryDist.map((c, i) => {
              const pct = Math.round((c.count / totalAssets) * 100);
              const config = getCatConfig(c.category);
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <span style={{ fontSize: 14 }}>{config.icon}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{c.category}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600 }}>{c.count} ({pct}%)</span>
                    </div>
                    <div style={{ height: 4, width: 80, borderRadius: 2, background: 'var(--bg-hover)', overflow: 'hidden', marginTop: 3 }}>
                      <div style={{ width: `${pct}%`, height: '100%', borderRadius: 2, background: config.color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top 10 Recurring Assets — 2-column grid */}
      <div className="card2" style={{ padding: 22, marginBottom: 28 }}>
        <div className="eyebrow" style={{ marginBottom: 16 }}>Top 10 Recurring Assets</div>
        <div className="grid-responsive-2col-to-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {assets.slice(0, 10).map((a, i) => {
            const maxCount = assets[0]?.count || 1;
            const pct = Math.round((a.count / maxCount) * 100);
            const config = getCatConfig(a.category);
            return (
              <div key={i} style={{
                padding: '10px 14px', borderRadius: 10, background: 'var(--bg-hover)',
                borderLeft: `3px solid ${config.color}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>
                      {a.name}
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 3 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: '1px 5px', borderRadius: 3,
                        background: config.color + '15', color: config.color,
                      }}>
                        {config.icon} {a.category}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>
                        {a.niche_count} niche{a.niche_count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 16, fontWeight: 800, color: config.color, flexShrink: 0, marginLeft: 10,
                  }}>
                    {a.count}x
                  </span>
                </div>
                <div style={{ height: 4, borderRadius: 2, background: 'var(--bg-card, #fff)', overflow: 'hidden' }}>
                  <div style={{
                    width: `${pct}%`, height: '100%', borderRadius: 2,
                    background: config.color, opacity: 0.7, transition: 'width 0.4s ease',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Asset Pack Recommendations */}
      {packs.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Recommended Asset Packs to Create &amp; Sell</div>
          <div className="bento">
            {packs.map((pack, i) => {
              const config = getCatConfig(pack.category);
              return (
                <div key={i} className="col-4">
                  <button
                    onClick={() => onOpenPack?.(pack)}
                    style={{
                      width: '100%', textAlign: 'left', fontFamily: 'inherit', cursor: 'pointer',
                      background: 'none', border: 'none', padding: 0,
                    }}
                  >
                    <div className="card2 interactive" style={{ padding: '18px 20px' }}>
                      {/* Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 18 }}>{config.icon}</span>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 700 }}>{pack.pack_name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>
                              {pack.item_count}+ items &middot; {pack.pricing_suggestion}
                            </div>
                          </div>
                        </div>
                        <DemandBadge signal={pack.demand_signal} />
                      </div>

                      {/* Stats */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
                        {[
                          { v: pack.niche_count, l: 'Niches' },
                          { v: pack.total_appearances, l: 'Seen in' },
                          { v: pack.competition, l: 'Competition' },
                        ].map((s, j) => (
                          <div key={j} style={{
                            textAlign: 'center', padding: '8px 6px', borderRadius: 10,
                            background: 'var(--bg-hover)',
                          }}>
                            <div style={{ fontSize: 16, fontWeight: 800, textTransform: 'capitalize' as const }}>{s.v}</div>
                            <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>{s.l}</div>
                          </div>
                        ))}
                      </div>

                      {/* Asset tags — preview */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {pack.assets.slice(0, 5).map((name, j) => (
                          <span key={j} style={{
                            fontSize: 10.5, fontWeight: 600, padding: '2px 7px', borderRadius: 5,
                            background: config.color + '15', color: config.color,
                          }}>
                            {name}
                          </span>
                        ))}
                        {pack.assets.length > 5 && (
                          <span style={{ fontSize: 10.5, padding: '2px 7px', color: 'var(--text-dim)' }}>
                            +{pack.assets.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Asset List */}
      <div className="card2" style={{ padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div className="eyebrow" style={{ margin: 0 }}>All Detected Assets ({filteredAssets.length})</div>
          {/* Niche filter */}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            <button
              onClick={() => setNicheFilter(null)}
              style={{
                fontSize: 10.5, fontWeight: 700, padding: '4px 10px', borderRadius: 7,
                background: !nicheFilter ? 'var(--accent-dim)' : 'var(--bg-hover)',
                color: !nicheFilter ? 'var(--accent)' : 'var(--text-dim)',
                border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              }}>
              All
            </button>
            {allNiches.slice(0, 8).map((n, i) => (
              <button key={i}
                onClick={() => setNicheFilter(nicheFilter === n ? null : n)}
                style={{
                  fontSize: 10.5, fontWeight: 700, padding: '4px 10px', borderRadius: 7,
                  background: nicheFilter === n ? 'var(--blue-dim, rgba(96,165,250,0.15))' : 'var(--bg-hover)',
                  color: nicheFilter === n ? 'var(--blue)' : 'var(--text-dim)',
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                }}>
                {n}
              </button>
            ))}
          </div>
        </div>

        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-dim)' }}>
                <th style={{ paddingBottom: 10, paddingLeft: 8 }}>Asset</th>
                <th style={{ paddingBottom: 10 }}>Category</th>
                <th style={{ paddingBottom: 10, textAlign: 'center' }}>Freq</th>
                <th style={{ paddingBottom: 10, textAlign: 'center' }}>Niches</th>
                <th style={{ paddingBottom: 10 }}>Styles</th>
                <th style={{ paddingBottom: 10, textAlign: 'center' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.slice(0, 50).map((a, i) => {
                const config = getCatConfig(a.category);
                return (
                  <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '8px 8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 7, height: 7, borderRadius: 4, background: config.color, flexShrink: 0 }} />
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{a.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '8px 0' }}>
                      <span style={{
                        fontSize: 10.5, fontWeight: 600, padding: '2px 6px', borderRadius: 4,
                        background: config.color + '15', color: config.color,
                      }}>
                        {config.icon} {a.category}
                      </span>
                    </td>
                    <td style={{ padding: '8px 0', textAlign: 'center' }}>
                      <span style={{ fontSize: 12, fontWeight: 800 }}>{a.count}x</span>
                    </td>
                    <td style={{ padding: '8px 0', textAlign: 'center' }}>
                      <span style={{ fontSize: 12, color: a.niche_count >= 3 ? 'var(--green)' : 'var(--text-muted)' }}>
                        {a.niche_count}
                      </span>
                    </td>
                    <td style={{ padding: '8px 0' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {a.styles.slice(0, 3).map((s, j) => (
                          <span key={j} style={{
                            fontSize: 9.5, padding: '1px 5px', borderRadius: 3,
                            background: 'var(--bg-hover)', color: 'var(--text-dim)',
                          }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '8px 0', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                        {a.hero_count > 0 && (
                          <span style={{ fontSize: 9.5, padding: '1px 4px', borderRadius: 3, background: 'var(--yellow-dim, rgba(251,191,36,0.15))', color: 'var(--yellow)' }}>
                            H{a.hero_count}
                          </span>
                        )}
                        {a.accent_count > 0 && (
                          <span style={{ fontSize: 9.5, padding: '1px 4px', borderRadius: 3, background: 'var(--blue-dim, rgba(96,165,250,0.15))', color: 'var(--blue)' }}>
                            A{a.accent_count}
                          </span>
                        )}
                        {a.bg_count > 0 && (
                          <span style={{ fontSize: 9.5, padding: '1px 4px', borderRadius: 3, background: 'var(--bg-hover)', color: 'var(--text-dim)' }}>
                            B{a.bg_count}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
          {[
            { code: 'H', label: 'Hero (main visual)', bg: 'var(--yellow-dim, rgba(251,191,36,0.15))', color: 'var(--yellow)' },
            { code: 'A', label: 'Accent (supporting)', bg: 'var(--blue-dim, rgba(96,165,250,0.15))', color: 'var(--blue)' },
            { code: 'B', label: 'Background (subtle)', bg: 'var(--bg-hover)', color: 'var(--text-dim)' },
          ].map((l, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: 'var(--text-dim)' }}>
              <span style={{ padding: '1px 4px', borderRadius: 3, background: l.bg, color: l.color, fontWeight: 700 }}>{l.code}</span>
              = {l.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
