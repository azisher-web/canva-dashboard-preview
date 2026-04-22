'use client';

import React from 'react';
import BODashIcon from '@/components/BODashIcon';
import { PreviewBanner } from '@/components/PreviewGate';
import { DrawerShell } from './shared';
import type { NicheItem } from '@/lib/types';
import type { CreatorStat } from '@/lib/category-data';
import { fakeNiches, BLUR_CTA_STYLE, BLUR_WRAPPER_STYLE, BLUR_OVERLAY_STYLE } from '@/lib/fakeData';

interface CategoryTemplate {
  title: string;
  thumbnail: string;
  url: string;
  is_pro: boolean;
  creator?: string;
}

/* ── Niche Packed Treemap ── */
function NicheTreemap({ niches, zoneCounts, onOpenNiche, allowedNiches = [] }: {
  niches: NicheItem[];
  zoneCounts: { blue: number; yellow: number; red: number };
  onOpenNiche: (n: NicheItem) => void;
  allowedNiches?: string[];
}) {
  const [hovered, setHovered] = React.useState<string | null>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [dims, setDims] = React.useState({ w: 800, h: 420 });

  React.useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const measure = () => {
      const width = el.clientWidth - 40;
      if (width > 100) setDims({ w: width, h: Math.max(400, Math.min(520, width * 0.55)) });
    };
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Theme-aware zone colors — use CSS vars at runtime
  const [zoneColors, setZoneColors] = React.useState({
    blue: { fill: '#4299e1', dim: 'rgba(66,153,225,0.18)', border: 'rgba(66,153,225,0.4)' },
    yellow: { fill: '#FFCE20', dim: 'rgba(255,206,32,0.18)', border: 'rgba(255,206,32,0.4)' },
    red: { fill: '#EE5D50', dim: 'rgba(238,93,80,0.18)', border: 'rgba(238,93,80,0.4)' },
  });

  React.useEffect(() => {
    const updateColors = () => {
      const root = document.documentElement;
      const cs = getComputedStyle(root);
      const blue = cs.getPropertyValue('--blue').trim() || '#4299e1';
      const yellow = cs.getPropertyValue('--yellow').trim() || '#FFCE20';
      const red = cs.getPropertyValue('--red').trim() || '#EE5D50';
      setZoneColors({
        blue: { fill: blue, dim: `color-mix(in srgb, ${blue} 18%, transparent)`, border: `color-mix(in srgb, ${blue} 40%, transparent)` },
        yellow: { fill: yellow, dim: `color-mix(in srgb, ${yellow} 18%, transparent)`, border: `color-mix(in srgb, ${yellow} 40%, transparent)` },
        red: { fill: red, dim: `color-mix(in srgb, ${red} 18%, transparent)`, border: `color-mix(in srgb, ${red} 40%, transparent)` },
      });
    };
    updateColors();
    // Re-read when theme changes (class or data-theme on <html>)
    const obs = new MutationObserver(() => setTimeout(updateColors, 50));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    return () => obs.disconnect();
  }, []);

  const ZONE_COLORS_MAP = zoneColors;

  // Simple treemap layout using squarified algorithm
  const cells = React.useMemo(() => {
    const sorted = [...niches].sort((a, b) => b.count - a.count);
    const total = sorted.reduce((s, n) => s + n.count, 0) || 1;

    // Squarified treemap layout
    interface Cell { niche: NicheItem; x: number; y: number; w: number; h: number }
    const result: Cell[] = [];

    function layoutRow(items: NicheItem[], rowTotal: number, x: number, y: number, w: number, h: number, horizontal: boolean) {
      let offset = 0;
      for (const item of items) {
        const ratio = item.count / rowTotal;
        if (horizontal) {
          result.push({ niche: item, x: x + offset, y, w: w * ratio, h });
          offset += w * ratio;
        } else {
          result.push({ niche: item, x, y: y + offset, w, h: h * ratio });
          offset += h * ratio;
        }
      }
    }

    function squarify(items: NicheItem[], x: number, y: number, w: number, h: number) {
      if (items.length === 0) return;
      if (items.length === 1) {
        result.push({ niche: items[0], x, y, w, h });
        return;
      }

      const itemTotal = items.reduce((s, n) => s + n.count, 0);
      const horizontal = w >= h;
      let rowItems: NicheItem[] = [];
      let rowTotal = 0;
      let bestAspect = Infinity;

      for (let i = 0; i < items.length; i++) {
        const testRow = [...rowItems, items[i]];
        const testTotal = rowTotal + items[i].count;
        const rowFraction = testTotal / itemTotal;
        const rowSize = horizontal ? h * rowFraction : w * rowFraction;

        // Check worst aspect ratio in this row
        let worstAspect = 0;
        for (const item of testRow) {
          const rowDim = horizontal ? h * (testTotal / itemTotal) : w * (testTotal / itemTotal);
          const cellDim = (item.count / testTotal) * (horizontal ? w : h);
          const cw = horizontal ? cellDim : rowDim;
          const ch = horizontal ? rowDim : cellDim;
          const aspect = Math.max(cw / (ch || 1), ch / (cw || 1));
          worstAspect = Math.max(worstAspect, aspect);
        }

        if (worstAspect <= bestAspect || rowItems.length === 0) {
          bestAspect = worstAspect;
          rowItems = testRow;
          rowTotal = testTotal;
        } else {
          // Layout the previous best row
          const prevTotal = rowTotal;
          const prevFraction = prevTotal / itemTotal;
          if (horizontal) {
            layoutRow(rowItems, prevTotal, x, y, w, h * prevFraction, true);
            squarify(items.slice(i), x, y + h * prevFraction, w, h * (1 - prevFraction));
          } else {
            layoutRow(rowItems, prevTotal, x, y, w * prevFraction, h, false);
            squarify(items.slice(i), x + w * prevFraction, y, w * (1 - prevFraction), h);
          }
          return;
        }
      }

      // Layout remaining items
      if (rowItems.length > 0) {
        layoutRow(rowItems, rowTotal, x, y, w, h, horizontal);
      }
    }

    squarify(sorted, 0, 0, dims.w, dims.h);
    return result;
  }, [niches, dims.w, dims.h]);

  return (
    <div ref={cardRef} className="card2" style={{ padding: 20, marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span className="eyebrow" style={{ margin: 0 }}>Niche Distribution</span>
        <div style={{ display: 'flex', gap: 16, fontSize: 12, fontWeight: 700 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 3, background: 'var(--blue)', display: 'inline-block' }} />Blue {zoneCounts.blue}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 3, background: 'var(--yellow)', display: 'inline-block' }} />Yellow {zoneCounts.yellow}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 3, background: 'var(--red)', display: 'inline-block' }} />Red {zoneCounts.red}</span>
        </div>
      </div>
      <div style={{ position: 'relative', width: '100%', height: dims.h, overflow: 'hidden' }}>
        {cells.map(c => {
          const zone = ZONE_COLORS_MAP[c.niche.zone as keyof typeof ZONE_COLORS_MAP] || ZONE_COLORS_MAP.blue;
          const isHov = hovered === c.niche.niche;
          const isAllowed = allowedNiches.length === 0 || allowedNiches.includes(c.niche.niche);
          const showLabel = c.w > 50 && c.h > 30;
          const showCount = c.w > 40 && c.h > 24;
          const maxChars = Math.max(4, Math.floor(c.w / 8));
          const label = c.niche.niche.length > maxChars ? c.niche.niche.substring(0, maxChars - 1) + '…' : c.niche.niche;

          return (
            <div
              key={c.niche.niche}
              onClick={() => onOpenNiche(c.niche)}
              onMouseEnter={() => setHovered(c.niche.niche)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: 'absolute',
                left: c.x + 1.5,
                top: c.y + 1.5,
                width: Math.max(0, c.w - 3),
                height: Math.max(0, c.h - 3),
                borderRadius: 6,
                background: isHov && isAllowed ? zone.border : zone.dim,
                border: `1px solid ${zone.border}`,
                cursor: isAllowed ? 'pointer' : 'default',
                opacity: isAllowed ? 1 : 0.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: 4,
                overflow: 'hidden',
                boxShadow: isHov ? `0 0 0 2px ${zone.fill}` : 'none',
                transition: 'background 0.15s, box-shadow 0.15s',
                zIndex: isHov ? 10 : 1,
              }}
            >
              {showLabel && (
                <div style={{
                  fontSize: c.w > 120 ? 12 : 10,
                  fontWeight: 600,
                  lineHeight: 1.2,
                  color: zone.fill,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: c.h > 60 ? 3 : 2,
                  WebkitBoxOrient: 'vertical' as const,
                  maxWidth: '100%',
                }}>
                  {c.w > 120 ? c.niche.niche : label}
                </div>
              )}
              {showCount && (
                <div style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: zone.fill,
                  opacity: 0.7,
                  marginTop: 2,
                }}>
                  {c.niche.count}
                </div>
              )}
            </div>
          );
        })}
        {/* Blur overlay on bottom portion of treemap */}
        <div style={{
          position: 'absolute',
          left: 0, right: 0, bottom: 0,
          height: '55%',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          background: 'linear-gradient(to bottom, rgba(var(--bg-rgb, 15,15,26), 0) 0%, rgba(var(--bg-rgb, 15,15,26), 0.3) 20%, rgba(var(--bg-rgb, 15,15,26), 0.6) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 15,
          pointerEvents: 'auto',
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
            🔒 Subscribe to unlock all niches
          </a>
        </div>

        {/* Hover tooltip */}
        {hovered && (() => {
          const c = cells.find(c => c.niche.niche === hovered);
          if (!c) return null;
          const tooltipX = c.x + c.w / 2;
          const tooltipLeft = tooltipX > dims.w / 2 ? Math.max(8, c.x - 180) : Math.min(dims.w - 210, c.x + c.w + 8);
          return (
            <div style={{
              position: 'absolute',
              top: Math.max(8, Math.min(dims.h - 90, c.y + c.h / 2 - 40)),
              left: tooltipLeft,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '10px 14px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              zIndex: 20,
              pointerEvents: 'none',
              minWidth: 170,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{c.niche.niche}</div>
              <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
                <span><strong>{c.niche.count}</strong> templates</span>
                <span style={{ color: 'var(--purple)' }}>{c.niche.pro ?? 0} Pro</span>
                <span style={{ color: 'var(--green)' }}>{c.niche.free ?? 0} Free</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 3 }}>{c.niche.pct}% of category &middot; Click to explore</div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

/* ── Niche Drawer Content (with per-niche template matching) ── */
function NicheDrawerContent({ niche, categoryTemplates, nicheTemplateMap = {}, nicheCreators }: {
  niche: NicheItem; categoryTemplates: CategoryTemplate[]; nicheTemplateMap?: Record<string, string[]>; nicheCreators?: Record<string, CreatorStat[]>;
}) {
  // Use niche_template_map (from Claude classification) if available, else fallback to keyword matching
  const nicheTemplates = React.useMemo(() => {
    const mappedTitles = nicheTemplateMap[niche.niche];
    // If niche_template_map exists for this niche (even if empty), trust it — don't fallback
    if (mappedTitles !== undefined) {
      if (mappedTitles.length === 0) return [];
      const titleSet = new Set(mappedTitles.map(t => t.toLowerCase()));
      return categoryTemplates.filter(t => titleSet.has((t.title || '').toLowerCase()));
    }
    // Fallback: keyword matching (only for old analyses without niche_template_map)
    const hasMap = Object.keys(nicheTemplateMap).length > 0;
    if (hasMap) return []; // Map exists but this niche isn't in it — 0 templates
    const words = niche.niche
      .split(/[\s\/,&()]+/)
      .filter(w => w.length > 2)
      .map(w => w.toLowerCase());
    if (words.length === 0) return categoryTemplates;
    return categoryTemplates.filter(t => {
      const text = (t.title || '').toLowerCase();
      return words.some(w => text.includes(w));
    });
  }, [niche.niche, categoryTemplates, nicheTemplateMap]);

  const proTemplates = nicheTemplates.filter(t => t.is_pro);
  const freeTemplates = nicheTemplates.filter(t => !t.is_pro);

  return (
    <div>
      <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 8px' }}>{niche.niche}</h2>
      <span className={`badge-zone badge-${niche.zone}`}><span className="dot" />{niche.zone} ocean</span>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 24, marginTop: 22 }}>
        <div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>{niche.count}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Templates</div>
        </div>
        <div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--purple)' }}>{niche.pro ?? 0}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pro</div>
        </div>
        <div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--green)' }}>{niche.free ?? 0}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Free</div>
        </div>
      </div>

      {/* Pro/Free ratio bar */}
      <div style={{ marginTop: 20, marginBottom: 24 }}>
        <div className="bar-track" style={{ height: 6 }}>
          <div style={{ width: `${niche.count > 0 ? ((niche.pro ?? 0) / niche.count * 100) : 0}%`, background: 'var(--purple)' }} />
          <div style={{ width: `${niche.count > 0 ? ((niche.free ?? 0) / niche.count * 100) : 0}%`, background: 'var(--green)' }} />
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 11, fontWeight: 600 }}>
          <span style={{ color: 'var(--purple)' }}>{niche.count > 0 ? Math.round((niche.pro ?? 0) / niche.count * 100) : 0}% Pro</span>
          <span style={{ color: 'var(--green)' }}>{niche.count > 0 ? Math.round((niche.free ?? 0) / niche.count * 100) : 0}% Free</span>
          <span style={{ marginLeft: 'auto', color: 'var(--text-dim)' }}>{niche.pct}% of category</span>
        </div>
      </div>

      {/* Top Creators in this Niche */}
      {(() => {
        const creators = nicheCreators?.[niche.niche] || [];
        if (creators.length === 0) return null;
        const maxCount = creators[0]?.count || 1;
        return (
          <>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Top Creators</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
              {creators.map((c, i) => (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 800, width: 20, textAlign: 'center',
                    color: i < 3 ? 'var(--accent)' : 'var(--text-dim)',
                  }}>
                    {i + 1}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-dim)', flexShrink: 0, marginLeft: 8 }}>
                        {c.count} &middot; <span style={{ color: 'var(--purple)' }}>{c.pro}P</span> <span style={{ color: 'var(--green)' }}>{c.free}F</span>
                      </span>
                    </div>
                    <div className="bar-track" style={{ height: 3 }}>
                      <div style={{ width: `${(c.count / maxCount) * 100}%`, background: 'var(--accent)', borderRadius: 2 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      })()}

      {/* Pro Templates section */}
      {proTemplates.length > 0 && (
        <>
          <div className="eyebrow" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--purple)' }}>Pro Templates</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-dim)' }}>({proTemplates.length})</span>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 22 }}>
            {proTemplates.slice(0, 12).map((t, j) => (
              <a key={j} href={t.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: 80, flexShrink: 0 }}>
                  <div style={{ width: 80, height: 80, borderRadius: 8, overflow: 'hidden', position: 'relative', background: '#eee' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.thumbnail} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <span style={{
                      position: 'absolute', top: 3, right: 3,
                      fontSize: 8, fontWeight: 800, padding: '1.5px 4px', borderRadius: 3,
                      background: 'rgba(255,170,0,0.92)', color: '#fff',
                    }}>
                      👑 PRO
                    </span>
                  </div>
                  <div style={{
                    marginTop: 3, fontSize: 10, fontWeight: 500, color: 'var(--text-dim)',
                    lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
                  }}>
                    {t.title}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </>
      )}

      {/* Free Templates section */}
      {freeTemplates.length > 0 && (
        <>
          <div className="eyebrow" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--green)' }}>Free Templates</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-dim)' }}>({freeTemplates.length})</span>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {freeTemplates.slice(0, 12).map((t, j) => (
              <a key={j} href={t.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: 80, flexShrink: 0 }}>
                  <div style={{ width: 80, height: 80, borderRadius: 8, overflow: 'hidden', position: 'relative', background: '#eee' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.thumbnail} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div style={{
                    marginTop: 3, fontSize: 10, fontWeight: 500, color: 'var(--text-dim)',
                    lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
                  }}>
                    {t.title}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </>
      )}

      {nicheTemplates.length === 0 && (
        <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 13 }}>
          No matching templates found for this niche.
        </div>
      )}
    </div>
  );
}

/* ── NichesTab (standalone tab with drawer management) ── */
export default function NichesTab({ niches, categoryTemplates, nicheTemplateMap, nicheCreators }: {
  niches: NicheItem[];
  categoryTemplates: CategoryTemplate[];
  nicheTemplateMap: Record<string, string[]>;
  nicheCreators?: Record<string, CreatorStat[]>;
}) {
  const [openNiche, setOpenNiche] = React.useState<NicheItem | null>(null);

  const [zoneFilter, setZoneFilter] = React.useState<'all' | 'blue' | 'yellow' | 'red'>('all');
  const [search, setSearch] = React.useState('');

  const zoneCounts = React.useMemo(() => ({
    blue: niches.filter(n => n.zone === 'blue').length,
    yellow: niches.filter(n => n.zone === 'yellow').length,
    red: niches.filter(n => n.zone === 'red').length,
  }), [niches]);

  const filtered = React.useMemo(() => {
    let list = niches;
    if (zoneFilter !== 'all') list = list.filter(n => n.zone === zoneFilter);
    const q = search.toLowerCase().trim();
    if (q) list = list.filter(n => n.niche.toLowerCase().includes(q));
    return list.sort((a, b) => b.count - a.count);
  }, [niches, zoneFilter, search]);

  const ZONE_COLORS: Record<string, string> = { blue: 'var(--blue)', yellow: 'var(--yellow)', red: 'var(--red)' };

  // Only top 3 red zone niches are clickable in preview
  const redNiches = React.useMemo(() =>
    niches.filter(n => n.zone === 'red').sort((a, b) => b.count - a.count).slice(0, 3).map(n => n.niche),
    [niches]
  );

  const handleOpenNiche = React.useCallback((n: NicheItem) => {
    if (redNiches.includes(n.niche)) {
      setOpenNiche(n);
    }
    // Non-red or beyond top 3 red: do nothing (disabled in preview)
  }, [redNiches]);

  return (
    <>
      <div>
        {/* Packed Treemap visualization */}
        <NicheTreemap niches={niches} zoneCounts={zoneCounts} onOpenNiche={handleOpenNiche} allowedNiches={redNiches} />

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
          <div className="tabs2" style={{ display: 'inline-flex' }}>
            {(['all', 'blue', 'yellow', 'red'] as const).map(z => (
              <button
                key={z}
                className={`tab2 ${zoneFilter === z ? 'active' : ''}`}
                onClick={() => setZoneFilter(z)}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {z !== 'all' && (
                  <span style={{ width: 7, height: 7, borderRadius: 3, background: ZONE_COLORS[z], display: 'inline-block' }} />
                )}
                {z === 'all' ? 'All' : z.charAt(0).toUpperCase() + z.slice(1)}
                {z !== 'all' && (
                  <span style={{ opacity: 0.5, fontWeight: 500, fontSize: 11 }}>{zoneCounts[z]}</span>
                )}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <BODashIcon name="search" size={14} color="var(--text-dim)" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search niches…"
              style={{
                padding: '11px 14px 11px 8px',
                borderRadius: 12,
                border: '1px solid var(--border)',
                background: 'var(--bg-card)',
                fontSize: 13,
                fontFamily: 'inherit',
                color: 'var(--text)',
                outline: 'none',
                width: 200,
              }}
            />
          </div>
        </div>

        {/* Niche cards grid */}
        {filtered.length === 0 ? (
          <div className="card2" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            No niches match this filter.
          </div>
        ) : (
          <>
          {/* Visible top 3 niche cards */}
          <div className="bento stagger">
            {filtered.slice(0, 3).map(n => {
              const isAllowed = redNiches.includes(n.niche);
              return (
              <div key={n.niche} className="col-4">
                <button
                  onClick={() => isAllowed && handleOpenNiche(n)}
                  style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: isAllowed ? 'pointer' : 'default', fontFamily: 'inherit' }}
                >
                  <div className={`card2 ${isAllowed ? 'interactive' : ''}`} style={{ padding: '18px 20px', opacity: isAllowed ? 1 : 0.7 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 700, lineHeight: 1.25, maxWidth: '70%' }}>{n.niche}</div>
                      <span className={`badge-zone badge-${n.zone}`}>
                        <span className="dot" />{n.zone}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
                      <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>{n.count}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>templates &middot; {n.pct}%</span>
                    </div>
                    <div style={{ display: 'flex', gap: 14, fontSize: 11.5, fontWeight: 600 }}>
                      <span style={{ color: 'var(--purple)' }}>{n.pro ?? '—'} PRO</span>
                      <span style={{ color: 'var(--green)' }}>{n.free ?? '—'} FREE</span>
                    </div>
                    {!isAllowed && (
                      <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        🔒 Locked
                      </div>
                    )}
                  </div>
                </button>
              </div>
              );
            })}
          </div>

          {/* Blurred remaining niche cards — uses fake data so real data is never exposed */}
          {filtered.length > 3 && (() => {
            const fake = fakeNiches(filtered.length - 3);
            return (
              <div style={{ position: 'relative', marginTop: 12 }}>
                <div style={BLUR_WRAPPER_STYLE} aria-hidden="true">
                  <div className="bento">
                    {fake.map((f, i) => (
                      <div key={i} className="col-4">
                        <div className="card2" style={{ padding: '18px 20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                            <div style={{ fontSize: 14.5, fontWeight: 700, lineHeight: 1.25, maxWidth: '70%' }}>{f.niche}</div>
                            <span className={`badge-zone badge-${f.zone}`}><span className="dot" />{f.zone}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
                            <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>{f.count}</span>
                            <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>templates &middot; {f.pct}</span>
                          </div>
                          <div style={{ display: 'flex', gap: 14, fontSize: 11.5, fontWeight: 600 }}>
                            <span style={{ color: 'var(--purple)' }}>{f.pro} PRO</span>
                            <span style={{ color: 'var(--green)' }}>{f.free} FREE</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={BLUR_OVERLAY_STYLE}>
                  <a href="https://kelaskreator.com/" target="_blank" rel="noopener noreferrer" style={BLUR_CTA_STYLE} onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(107,91,255,0.45)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(107,91,255,0.3)'; }}>
                    🔒 Subscribe to kelaskreator.com to unlock all insights
                  </a>
                  <div style={{ fontSize: 12, color: 'var(--text-dim)', fontWeight: 500 }}>
                    🔓 {filtered.length - 3} more niches available with full access
                  </div>
                </div>
              </div>
            );
          })()}
          </>
        )}
      </div>

      {/* Niche Drawer */}
      {openNiche && (
        <DrawerShell kind="Niche" onClose={() => setOpenNiche(null)}>
          <NicheDrawerContent
            niche={openNiche}
            categoryTemplates={categoryTemplates}
            nicheTemplateMap={nicheTemplateMap}
            nicheCreators={nicheCreators}
          />
        </DrawerShell>
      )}
    </>
  );
}
