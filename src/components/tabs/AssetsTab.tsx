'use client';

import React from 'react';
import BODashIcon from '@/components/BODashIcon';
import type { DesignAnalysis, AssetPack, AssetDistItem } from '@/lib/types';
import {
  fakeAssetDistRows,
  fakeAssetPackCards,
  fakeAssetTableRows,
  BLUR_WRAPPER_STYLE,
  BLUR_OVERLAY_STYLE,
  BLUR_CTA_STYLE,
} from '@/lib/fakeData';
import { DrawerShell, TemplateThumbnail, EmptyState } from './shared';

interface CategoryTemplate {
  title: string;
  thumbnail: string;
  url: string;
  is_pro: boolean;
  creator?: string;
}

// ── Category config (colors / icons) ──
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

/** Reusable lock overlay for a section */
function SectionLock({ label }: { label: string }) {
  return (
    <div style={BLUR_OVERLAY_STYLE}>
      <a
        href="https://kelaskreator.com/"
        target="_blank"
        rel="noopener noreferrer"
        style={BLUR_CTA_STYLE}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(107,91,255,0.45)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(107,91,255,0.3)'; }}
      >
        🔒 Subscribe to unlock all {label}
      </a>
    </div>
  );
}

// ── Drawer content (kept as-is) ──

const DRAWER_CATEGORY_CONFIG: Record<string, { color: string; icon: string }> = {
  'Object Cutout': { color: '#60a5fa', icon: '✂️' },
  'Shape': { color: '#f472b6', icon: '⭐' },
  'Texture': { color: '#fbbf24', icon: '🧱' },
  'Stationery': { color: '#34d399', icon: '📎' },
  'Nature & Organic': { color: '#4ade80', icon: '🌿' },
  'Other': { color: '#94a3b8', icon: '✨' },
};

function AssetPackDrawerContent({ pack, categoryTemplates = [], assetDistribution = [] }: {
  pack: AssetPack; categoryTemplates?: CategoryTemplate[]; assetDistribution?: AssetDistItem[];
}) {
  const config = DRAWER_CATEGORY_CONFIG[pack.category] || DRAWER_CATEGORY_CONFIG['Other'];
  const compColor = pack.competition === 'low' ? 'var(--green)' : pack.competition === 'medium' ? 'var(--yellow)' : 'var(--red)';

  const packTemplates = React.useMemo(() => {
    const assetNames = new Set(pack.assets.map(a => a.toLowerCase().trim()));
    const templateTitlesSet = new Set<string>();
    for (const asset of assetDistribution) {
      if (assetNames.has(asset.name.toLowerCase().trim())) {
        for (const t of asset.templates) templateTitlesSet.add(t.toLowerCase().trim());
      }
    }
    return categoryTemplates.filter(t => templateTitlesSet.has((t.title || '').toLowerCase().trim()));
  }, [pack.assets, assetDistribution, categoryTemplates]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 28 }}>{config.icon}</span>
        <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>{pack.pack_name}</h2>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 22 }}>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
          background: pack.demand_signal === 'high' ? 'rgba(52,211,153,0.15)' : pack.demand_signal === 'medium' ? 'rgba(251,191,36,0.15)' : 'var(--bg-hover)',
          color: pack.demand_signal === 'high' ? 'var(--green)' : pack.demand_signal === 'medium' ? 'var(--yellow)' : 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          {pack.demand_signal} demand
        </span>
        <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{pack.item_count}+ items &middot; {pack.pricing_suggestion}</span>
      </div>

      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>{pack.niche_count}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Niches</div>
        </div>
        <div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--blue)' }}>{pack.total_appearances}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Seen in</div>
        </div>
        <div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, color: compColor, textTransform: 'capitalize' }}>{pack.competition}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Competition</div>
        </div>
      </div>

      <div className="eyebrow" style={{ marginBottom: 10 }}>All Assets ({pack.assets.length})</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
        {pack.assets.map((name, j) => (
          <span key={j} style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 6, background: config.color + '15', color: config.color }}>{name}</span>
        ))}
      </div>

      {pack.styles.length > 0 && (
        <>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Render Styles</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
            {pack.styles.map((s, j) => (
              <span key={j} style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 6, background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>{s}</span>
            ))}
          </div>
        </>
      )}

      {packTemplates.length > 0 && (
        <>
          <div className="eyebrow" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>{pack.category} in Action</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-dim)' }}>({packTemplates.length})</span>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
            {packTemplates.slice(0, 12).map((t, j) => (
              <TemplateThumbnail key={j} title={t.title} canvaUrl={t.url} thumbnailUrl={t.thumbnail} index={j} size={80} showTitle isPro={t.is_pro} />
            ))}
          </div>
        </>
      )}

      {pack.niches_using.length > 0 && (
        <>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Used in Niches</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {pack.niches_using.map((n, j) => (
              <div key={j} style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--bg-hover)', fontSize: 13, fontWeight: 600 }}>{n}</div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Main tab component ──

export default function AssetsTabClient({ designAnalysis, categoryTemplates }: {
  designAnalysis: DesignAnalysis | null;
  categoryTemplates: CategoryTemplate[];
}) {
  const [drawer, setDrawer] = React.useState<AssetPack | null>(null);

  if (!designAnalysis || !designAnalysis.asset_distribution?.length) {
    return <EmptyState text="No asset opportunity data available for this category." />;
  }

  const assets = designAnalysis.asset_distribution || [];
  const categoryDist = designAnalysis.asset_category_dist || [];
  const packs = designAnalysis.asset_packs || [];
  const totalAssets = categoryDist.reduce((s, c) => s + c.count, 0) || 1;

  // Visible slices
  const visibleTop10 = assets.slice(0, 2);
  const lockedTop10 = fakeAssetDistRows(8);
  const maxCountTop10 = assets[0]?.count || 1;

  const visiblePacks = packs.slice(0, 3);
  const lockedPacks = fakeAssetPackCards(5);

  const visibleTableRows = assets.slice(0, 3);
  const lockedTableRows = fakeAssetTableRows(12);

  return (
    <>
      <div>
        {/* ── Section Header ── */}
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

        {/* ── 1. Asset Categories — fully unlocked ── */}
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

        {/* ── 2. Top 10 Recurring Assets — 2 visible, rest locked ── */}
        <div className="card2" style={{ padding: 22, marginBottom: 28 }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Top 10 Recurring Assets</div>

          {/* Visible rows (first 2) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 0 }}>
            {visibleTop10.map((a, i) => {
              const pct = Math.round((a.count / maxCountTop10) * 100);
              const config = getCatConfig(a.category);
              return (
                <div key={i} style={{
                  padding: '10px 14px', borderRadius: 10, background: 'var(--bg-hover)',
                  borderLeft: `3px solid ${config.color}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{a.name}</div>
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

          {/* Locked rows (fake data) */}
          <div style={{ position: 'relative', marginTop: 8 }}>
            <div style={BLUR_WRAPPER_STYLE}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {lockedTop10.map((a, i) => {
                  const config = getCatConfig(a.category);
                  return (
                    <div key={i} style={{
                      padding: '10px 14px', borderRadius: 10, background: 'var(--bg-hover)',
                      borderLeft: `3px solid ${config.color}`,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{a.name}</div>
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
                          width: '50%', height: '100%', borderRadius: 2,
                          background: config.color, opacity: 0.7,
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <SectionLock label="recurring assets" />
          </div>
        </div>

        {/* ── 3. Recommended Asset Packs — 3 visible, rest locked ── */}
        <div style={{ marginBottom: 28 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Recommended Asset Packs to Create &amp; Sell</div>

          {/* Visible packs */}
          <div className="bento" style={{ marginBottom: 0 }}>
            {visiblePacks.map((pack, i) => {
              const config = getCatConfig(pack.category);
              return (
                <div key={i} className="col-4">
                  <button
                    onClick={() => setDrawer(pack as AssetPack)}
                    style={{
                      width: '100%', textAlign: 'left', fontFamily: 'inherit', cursor: 'pointer',
                      background: 'none', border: 'none', padding: 0,
                    }}
                  >
                    <div className="card2 interactive" style={{ padding: '18px 20px' }}>
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

          {/* Locked packs (fake data) */}
          <div style={{ position: 'relative', marginTop: 12 }}>
            <div style={BLUR_WRAPPER_STYLE}>
              <div className="bento">
                {lockedPacks.map((pack, i) => {
                  const config = getCatConfig(pack.category);
                  return (
                    <div key={i} className="col-4">
                      <div className="card2" style={{ padding: '18px 20px' }}>
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
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          {pack.assets.slice(0, 5).map((name, j) => (
                            <span key={j} style={{
                              fontSize: 10.5, fontWeight: 600, padding: '2px 7px', borderRadius: 5,
                              background: config.color + '15', color: config.color,
                            }}>
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <SectionLock label="asset pack recommendations" />
          </div>
        </div>

        {/* ── 4. All Detected Assets — 3 visible rows, rest locked ── */}
        <div className="card2" style={{ padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div className="eyebrow" style={{ margin: 0 }}>All Detected Assets ({assets.length})</div>
          </div>

          {/* Visible table rows */}
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
              {visibleTableRows.map((a, i) => {
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

          {/* Locked table rows (fake data) */}
          <div style={{ position: 'relative', marginTop: 0 }}>
            <div style={BLUR_WRAPPER_STYLE}>
              <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
                <tbody>
                  {lockedTableRows.map((a, i) => {
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
            <SectionLock label="detected assets" />
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

      {/* Drawer */}
      {drawer && (
        <DrawerShell kind="asset pack" onClose={() => setDrawer(null)}>
          <AssetPackDrawerContent pack={drawer} categoryTemplates={categoryTemplates} assetDistribution={designAnalysis.asset_distribution} />
        </DrawerShell>
      )}
    </>
  );
}
