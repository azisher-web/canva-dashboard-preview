'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import BODashIcon from '@/components/BODashIcon';
import PreviewGate, { PreviewBanner } from '@/components/PreviewGate';
import { Tooltip, Donut, OvMetric, TemplateThumbnail, ScoreBar, DrawerShell, THUMB_GRADIENTS } from './shared';
import type { CategoryTemplate } from './shared';
import type { Analysis, NicheItem, Recommendation } from '@/lib/types';
import type { CreatorStat, KeywordStat, ProFreeOpportunity, NicheRanking, CategoryInsights } from '@/lib/category-data';

/* ── Creator Drawer ── */
function CreatorDrawerContent({ creatorName, categoryTemplates }: {
  creatorName: string; categoryTemplates: CategoryTemplate[];
}) {
  const templates = React.useMemo(
    () => categoryTemplates.filter(t => t.creator === creatorName),
    [creatorName, categoryTemplates],
  );

  const proTemplates = templates.filter(t => t.is_pro);
  const freeTemplates = templates.filter(t => !t.is_pro);

  return (
    <div>
      <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 8px' }}>{creatorName}</h2>
      <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>Template creator</span>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 24, marginTop: 22 }}>
        <div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>{templates.length}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Templates</div>
        </div>
        <div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--purple)' }}>{proTemplates.length}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pro</div>
        </div>
        <div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--green)' }}>{freeTemplates.length}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Free</div>
        </div>
      </div>

      {/* Pro/Free ratio bar */}
      <div style={{ marginTop: 20, marginBottom: 24 }}>
        <div className="bar-track" style={{ height: 6 }}>
          <div style={{ width: `${templates.length > 0 ? (proTemplates.length / templates.length * 100) : 0}%`, background: 'var(--purple)' }} />
          <div style={{ width: `${templates.length > 0 ? (freeTemplates.length / templates.length * 100) : 0}%`, background: 'var(--green)' }} />
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 11, fontWeight: 600 }}>
          <span style={{ color: 'var(--purple)' }}>{templates.length > 0 ? Math.round(proTemplates.length / templates.length * 100) : 0}% Pro</span>
          <span style={{ color: 'var(--green)' }}>{templates.length > 0 ? Math.round(freeTemplates.length / templates.length * 100) : 0}% Free</span>
        </div>
      </div>

      {/* Pro Templates */}
      {proTemplates.length > 0 && (
        <>
          <div className="eyebrow" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--purple)' }}>Pro Templates</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-dim)' }}>({proTemplates.length})</span>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 22 }}>
            {proTemplates.map((t, j) => (
              <a key={j} href={t.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: 80, flexShrink: 0 }}>
                  <div style={{ width: 80, height: 80, borderRadius: 8, overflow: 'hidden', position: 'relative', background: '#eee' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.thumbnail} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <span style={{
                      position: 'absolute', top: 3, right: 3,
                      fontSize: 8, fontWeight: 800, padding: '1.5px 4px', borderRadius: 3,
                      background: 'rgba(255,170,0,0.92)', color: '#fff',
                    }}>PRO</span>
                  </div>
                  <div style={{
                    marginTop: 3, fontSize: 10, fontWeight: 500, color: 'var(--text-dim)',
                    lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
                  }}>{t.title}</div>
                </div>
              </a>
            ))}
          </div>
        </>
      )}

      {/* Free Templates */}
      {freeTemplates.length > 0 && (
        <>
          <div className="eyebrow" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--green)' }}>Free Templates</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-dim)' }}>({freeTemplates.length})</span>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {freeTemplates.map((t, j) => (
              <a key={j} href={t.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: 80, flexShrink: 0 }}>
                  <div style={{ width: 80, height: 80, borderRadius: 8, overflow: 'hidden', background: '#eee' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.thumbnail} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div style={{
                    marginTop: 3, fontSize: 10, fontWeight: 500, color: 'var(--text-dim)',
                    lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
                  }}>{t.title}</div>
                </div>
              </a>
            ))}
          </div>
        </>
      )}

      {templates.length === 0 && (
        <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 13 }}>
          No templates found for this creator.
        </div>
      )}
    </div>
  );
}

/* ── Ranking Signal Drawer (shows templates in that niche) ── */
function RankingDrawerContent({ ranking, categoryTemplates, nicheTemplateMap = {} }: {
  ranking: NicheRanking; categoryTemplates: CategoryTemplate[]; nicheTemplateMap?: Record<string, string[]>;
}) {
  const ZONE_COLORS: Record<string, string> = { blue: 'var(--blue)', yellow: 'var(--yellow)', red: 'var(--red)' };
  const zoneColor = ZONE_COLORS[ranking.zone] || 'var(--text-muted)';

  const nicheTemplates = React.useMemo(() => {
    const mappedTitles = nicheTemplateMap[ranking.niche];
    if (mappedTitles !== undefined) {
      if (mappedTitles.length === 0) return [];
      const titleSet = new Set(mappedTitles.map(t => t.toLowerCase()));
      return categoryTemplates.filter(t => titleSet.has((t.title || '').toLowerCase()));
    }
    return [];
  }, [ranking.niche, categoryTemplates, nicheTemplateMap]);

  const proTemplates = nicheTemplates.filter(t => t.is_pro);
  const freeTemplates = nicheTemplates.filter(t => !t.is_pro);

  return (
    <div>
      <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 8px' }}>{ranking.niche}</h2>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 22 }}>
        <span className={`badge-zone badge-${ranking.zone}`}><span className="dot" />{ranking.zone} ocean</span>
        {ranking.signal === 'rising' && (
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)' }}>&#9650; Rising</span>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, color: zoneColor }}>#{ranking.avgPosition}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Avg Position</div>
        </div>
        <div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>{ranking.count}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Templates</div>
        </div>
        <div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--purple)' }}>{proTemplates.length}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pro</div>
        </div>
        <div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--green)' }}>{freeTemplates.length}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Free</div>
        </div>
      </div>

      {/* Pro/Free ratio bar */}
      {nicheTemplates.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div className="bar-track" style={{ height: 6 }}>
            <div style={{ width: `${(proTemplates.length / nicheTemplates.length) * 100}%`, background: 'var(--purple)' }} />
            <div style={{ width: `${(freeTemplates.length / nicheTemplates.length) * 100}%`, background: 'var(--green)' }} />
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 11, fontWeight: 600 }}>
            <span style={{ color: 'var(--purple)' }}>{Math.round((proTemplates.length / nicheTemplates.length) * 100)}% Pro</span>
            <span style={{ color: 'var(--green)' }}>{Math.round((freeTemplates.length / nicheTemplates.length) * 100)}% Free</span>
          </div>
        </div>
      )}

      {/* Pro Templates */}
      {proTemplates.length > 0 && (
        <>
          <div className="eyebrow" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--purple)' }}>Pro Templates</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-dim)' }}>({proTemplates.length})</span>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 22 }}>
            {proTemplates.slice(0, 12).map((t, j) => (
              <TemplateThumbnail key={j} title={t.title} canvaUrl={t.url} thumbnailUrl={t.thumbnail} index={j} size={80} showTitle isPro />
            ))}
          </div>
        </>
      )}

      {/* Free Templates */}
      {freeTemplates.length > 0 && (
        <>
          <div className="eyebrow" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--green)' }}>Free Templates</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-dim)' }}>({freeTemplates.length})</span>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {freeTemplates.slice(0, 12).map((t, j) => (
              <TemplateThumbnail key={j} title={t.title} canvaUrl={t.url} thumbnailUrl={t.thumbnail} index={j} size={80} showTitle />
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

/* ── Pro/Free Opportunity Drawer (shows templates in that niche) ── */
function ProFreeDrawerContent({ opportunity, categoryTemplates, nicheTemplateMap = {} }: {
  opportunity: ProFreeOpportunity; categoryTemplates: CategoryTemplate[]; nicheTemplateMap?: Record<string, string[]>;
}) {
  const nicheTemplates = React.useMemo(() => {
    const mappedTitles = nicheTemplateMap[opportunity.niche];
    if (mappedTitles !== undefined) {
      if (mappedTitles.length === 0) return [];
      const titleSet = new Set(mappedTitles.map(t => t.toLowerCase()));
      return categoryTemplates.filter(t => titleSet.has((t.title || '').toLowerCase()));
    }
    return [];
  }, [opportunity.niche, categoryTemplates, nicheTemplateMap]);

  const proTemplates = nicheTemplates.filter(t => t.is_pro);
  const freeTemplates = nicheTemplates.filter(t => !t.is_pro);
  const isFreeSignal = opportunity.signal === 'create-free';

  return (
    <div>
      <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 8px' }}>{opportunity.niche}</h2>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 22 }}>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6,
          background: isFreeSignal ? 'rgba(52,211,153,0.15)' : 'rgba(139,92,246,0.15)',
          color: isFreeSignal ? 'var(--green)' : 'var(--purple)',
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          {isFreeSignal ? 'Create FREE' : 'Create PRO'}
        </span>
        <span className={`badge-zone badge-${opportunity.zone}`}><span className="dot" />{opportunity.zone} ocean</span>
      </div>

      {/* Reason */}
      <div style={{
        padding: '14px 16px', borderRadius: 12, marginBottom: 24,
        background: isFreeSignal ? 'rgba(52,211,153,0.08)' : 'rgba(139,92,246,0.08)',
        borderLeft: `3px solid ${isFreeSignal ? 'var(--green)' : 'var(--purple)'}`,
      }}>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{opportunity.reason}</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>{opportunity.count}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Templates</div>
        </div>
        <div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--purple)' }}>{opportunity.proPct}%</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pro Rate</div>
        </div>
      </div>

      {/* Pro/Free ratio bar */}
      {nicheTemplates.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div className="bar-track" style={{ height: 6 }}>
            <div style={{ width: `${(proTemplates.length / nicheTemplates.length) * 100}%`, background: 'var(--purple)' }} />
            <div style={{ width: `${(freeTemplates.length / nicheTemplates.length) * 100}%`, background: 'var(--green)' }} />
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 11, fontWeight: 600 }}>
            <span style={{ color: 'var(--purple)' }}>{proTemplates.length} Pro</span>
            <span style={{ color: 'var(--green)' }}>{freeTemplates.length} Free</span>
          </div>
        </div>
      )}

      {/* Pro Templates */}
      {proTemplates.length > 0 && (
        <>
          <div className="eyebrow" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--purple)' }}>Pro Templates</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-dim)' }}>({proTemplates.length})</span>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 22 }}>
            {proTemplates.slice(0, 12).map((t, j) => (
              <TemplateThumbnail key={j} title={t.title} canvaUrl={t.url} thumbnailUrl={t.thumbnail} index={j} size={80} showTitle isPro />
            ))}
          </div>
        </>
      )}

      {/* Free Templates */}
      {freeTemplates.length > 0 && (
        <>
          <div className="eyebrow" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--green)' }}>Free Templates</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-dim)' }}>({freeTemplates.length})</span>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {freeTemplates.slice(0, 12).map((t, j) => (
              <TemplateThumbnail key={j} title={t.title} canvaUrl={t.url} thumbnailUrl={t.thumbnail} index={j} size={80} showTitle />
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

/* ── Overview Tab ── */
export default function OverviewTab({ analysis, niches, insights, recs, categoryInsights, isID, slug, categoryTemplates, nicheTemplateMap }: {
  analysis: Analysis;
  niches: NicheItem[];
  insights: string[];
  recs: Recommendation[];
  categoryInsights?: CategoryInsights;
  isID: boolean;
  slug: string;
  categoryTemplates: CategoryTemplate[];
  nicheTemplateMap: Record<string, string[]>;
}) {
  // Drawer state
  const [drawerCreator, setDrawerCreator] = useState<string | null>(null);
  const [drawerRanking, setDrawerRanking] = useState<NicheRanking | null>(null);
  const [drawerProFree, setDrawerProFree] = useState<ProFreeOpportunity | null>(null);

  // showAllCreators state removed — now always shows all in scrollable section
  const blueSharePct = analysis.total_niches > 0
    ? Math.round(analysis.blue_ocean_count / analysis.total_niches * 100) : 0;
  const freePct = analysis.total_templates > 0
    ? Math.round((analysis.total_free || 0) / analysis.total_templates * 100) : 0;

  const creators = categoryInsights?.topCreators || [];
  const keywords = categoryInsights?.topKeywords || [];
  const proFreeOps = categoryInsights?.proFreeOpportunities || [];
  const rankings = categoryInsights?.nicheRankings || [];

  const ZONE_COLORS: Record<string, string> = { blue: 'var(--blue)', yellow: 'var(--yellow)', red: 'var(--red)', mixed: 'var(--text-muted)' };

  return (
    <div>
      {/* Stats grid */}
      <div className="bento" style={{ marginBottom: 32 }}>
        <div className="col-3 stat2">
          <div className="v">{analysis.total_templates}</div>
          <div className="l">Templates</div>
        </div>
        <div className="col-3 stat2">
          <div className="v" style={{ color: 'var(--blue)' }}>
            {analysis.blue_ocean_count}<span style={{ fontSize: 14, color: 'var(--text-dim)' }}>/ {analysis.total_niches}</span>
          </div>
          <div className="l">Blue Ocean ({blueSharePct}%)</div>
        </div>
        <div className="col-3 stat2">
          <div className="v" style={{ color: 'var(--purple)' }}>{analysis.total_pro || 0}</div>
          <div className="l">Pro</div>
        </div>
        <div className="col-3 stat2">
          <div className="v" style={{ color: 'var(--green)' }}>{freePct}%</div>
          <div className="l">Free share</div>
        </div>
      </div>

      {/* Top recommendation + Donut */}
      {recs[0] && (
        <div className="bento" style={{ marginBottom: 32 }}>
          <Link
            href={`/category/${slug}/recs`}
            className="col-8 card2 accent"
            style={{ padding: 24, cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 7, background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                #1
              </span>
              <span className="badge-zone badge-blue"><span className="dot" />Blue ocean</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.15, marginBottom: 10 }}>
              {recs[0].niche}
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 600, margin: '0 0 16px' }}>
              {recs[0].why}
            </p>
            <div style={{ display: 'flex', gap: 18, marginBottom: 16 }}>
              <OvMetric label="score" value={recs[0].score} color="var(--accent)" />
              <OvMetric label="demand" value={`${recs[0].potentialDemand}%`} color="var(--green)" />
              <OvMetric label="competition" value={recs[0].competition} color="var(--red)" />
              <OvMetric label="templates" value={recs[0].templates} color="var(--text)" />
            </div>
            <span
              className="btn btn-primary"
              style={{ fontSize: 13, padding: '8px 18px' }}
            >
              See ideas <BODashIcon name="arrowRight" size={13} />
            </span>
          </Link>
          <div className="col-4 card2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <Donut pct={blueSharePct} color="var(--blue)" />
            <div style={{ marginTop: 12, fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>
              Blue Ocean Share
            </div>
          </div>
        </div>
      )}

      {/* Key Insights */}
      {insights.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Key Insights</div>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 14px', lineHeight: 1.5 }}>
            {isID ? 'Rangkuman utama dari analisis data — poin-poin penting yang perlu kamu perhatikan.' : 'Top takeaways from the data — key patterns and signals you should pay attention to.'}
          </p>
          <div className="bento">
            {insights.map((ins, i) => (
              <div key={i} className={`${i === 0 ? 'col-12' : 'col-6'} card2`} style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 9, flexShrink: 0, marginTop: 1,
                    background: i === 0 ? 'var(--accent)' : 'var(--accent-dim)',
                    color: i === 0 ? '#fff' : 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 800,
                  }}>{i + 1}</div>
                  <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{ins}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zone distribution mini */}
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Zone Distribution</div>
        <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 14px', lineHeight: 1.5 }}>
          {isID ? 'Sebaran niche berdasarkan zona kompetisi — biru = peluang, kuning = moderat, merah = jenuh.' : 'How niches split across competition zones — blue = opportunity, yellow = moderate, red = saturated.'}
        </p>
        <div className="bar-track" style={{ height: 8, marginBottom: 10 }}>
          <div style={{ width: `${analysis.blue_ocean_count / analysis.total_niches * 100}%`, background: 'var(--blue)' }} />
          <div style={{ width: `${(analysis.yellow_count || 0) / analysis.total_niches * 100}%`, background: 'var(--yellow)' }} />
          <div style={{ width: `${analysis.red_ocean_count / analysis.total_niches * 100}%`, background: 'var(--red)' }} />
        </div>
        <div style={{ display: 'flex', gap: 20, fontSize: 13, fontWeight: 600 }}>
          <span style={{ color: 'var(--blue)' }}>&bull; {analysis.blue_ocean_count} Blue</span>
          <span style={{ color: 'var(--yellow)' }}>&bull; {analysis.yellow_count || 0} Yellow</span>
          <span style={{ color: 'var(--red)' }}>&bull; {analysis.red_ocean_count} Red</span>
          <span style={{ marginLeft: 'auto', color: 'var(--text-dim)' }}>{analysis.total_niches} total niches</span>
        </div>
      </div>

      {/* ── All Creators (top 3 visible, rest blurred) ── */}
      {creators.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>All Creators</div>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 14px', lineHeight: 1.5 }}>
            {isID ? 'Pembuat template teratas di kategori ini.' : 'Top template creators in this category.'}
          </p>
          {/* Visible top 3 */}
          <div className="bento stagger">
            {creators.slice(0, 3).map((c, i) => (
              <div key={c.name} className="col-4">
                <button onClick={() => setDrawerCreator(c.name)} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}>
                  <div className="card2 interactive" style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 6, background: 'var(--accent-dim)', color: 'var(--accent)' }}>#{i + 1}</span>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>{c.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 14, fontSize: 12, fontWeight: 600 }}>
                      <span>{c.count} templates</span>
                      <span style={{ color: 'var(--purple)' }}>{c.pro} Pro</span>
                      <span style={{ color: 'var(--green)' }}>{c.free} Free</span>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
          {/* Blurred remaining */}
          {creators.length > 3 && (
            <div style={{ position: 'relative', marginTop: 8 }}>
              <div style={{ filter: 'blur(8px)', WebkitFilter: 'blur(8px)', userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }} aria-hidden="true">
                <div className="bento">
                  {creators.slice(3, 9).map((c, i) => (
                    <div key={c.name} className="col-4">
                      <div className="card2" style={{ padding: '16px 20px' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{c.count} templates</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, zIndex: 10 }}>
                <div style={{ background: 'linear-gradient(135deg, #6B5BFF, #4299e1)', color: '#fff', padding: '10px 24px', borderRadius: 12, fontSize: 13, fontWeight: 700, boxShadow: '0 8px 32px rgba(107,91,255,0.3)', textAlign: 'center', maxWidth: 340, lineHeight: 1.5 }}>
                  🔒 Subscribe to kelaskreator.com to unlock all insights
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Canva Ranking Signal (top 3 visible, rest blurred) ── */}
      {rankings.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Canva Ranking Signal</div>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 14px', lineHeight: 1.5 }}>
            {isID ? 'Posisi rata-rata template per niche di hasil pencarian Canva.' : 'Average template position per niche in Canva search results.'}
          </p>
          <div className="bento stagger">
            {rankings.slice(0, 3).map((r, i) => (
              <div key={r.niche} className="col-4">
                <button onClick={() => setDrawerRanking(r)} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}>
                  <div className="card2 interactive" style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, maxWidth: '65%' }}>{r.niche}</span>
                      <span className={`badge-zone badge-${r.zone}`}><span className="dot" />{r.zone}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 14, fontSize: 12, fontWeight: 600 }}>
                      <span style={{ color: ZONE_COLORS[r.zone] || 'var(--text-muted)' }}>Avg #{r.avgPosition}</span>
                      <span>{r.count} templates</span>
                      {r.signal === 'rising' && <span style={{ color: 'var(--green)' }}>&#9650; Rising</span>}
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
          {rankings.length > 3 && (
            <div style={{ position: 'relative', marginTop: 8 }}>
              <div style={{ filter: 'blur(8px)', WebkitFilter: 'blur(8px)', userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }} aria-hidden="true">
                <div className="bento">
                  {rankings.slice(3, 9).map(r => (
                    <div key={r.niche} className="col-4">
                      <div className="card2" style={{ padding: '16px 20px' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{r.niche}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Avg #{r.avgPosition} · {r.count} templates</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, zIndex: 10 }}>
                <div style={{ background: 'linear-gradient(135deg, #6B5BFF, #4299e1)', color: '#fff', padding: '10px 24px', borderRadius: 12, fontSize: 13, fontWeight: 700, boxShadow: '0 8px 32px rgba(107,91,255,0.3)', textAlign: 'center', maxWidth: 340, lineHeight: 1.5 }}>
                  🔒 Subscribe to kelaskreator.com to unlock all insights
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Keyword Intelligence (top 3 visible, rest blurred) ── */}
      {keywords.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Keyword Intelligence</div>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 14px', lineHeight: 1.5 }}>
            {isID ? 'Kata kunci paling umum dan zona distribusinya.' : 'Most common keywords and their zone distribution.'}
          </p>
          <div className="bento stagger">
            {keywords.slice(0, 3).map((k, i) => (
              <div key={k.keyword} className="col-4">
                <div className="card2" style={{ padding: '16px 20px' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{k.keyword}</div>
                  <div style={{ display: 'flex', gap: 14, fontSize: 12, fontWeight: 600 }}>
                    <span>{k.count} templates</span>
                    <span className={`badge-zone badge-${k.zone}`}><span className="dot" />{k.zone}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: 'rgba(66,153,225,0.15)', color: 'var(--blue)' }}>blue {k.blueCount}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: 'rgba(238,93,80,0.15)', color: 'var(--red)' }}>red {k.redCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {keywords.length > 3 && (
            <div style={{ position: 'relative', marginTop: 8 }}>
              <div style={{ filter: 'blur(8px)', WebkitFilter: 'blur(8px)', userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }} aria-hidden="true">
                <div className="bento">
                  {keywords.slice(3, 9).map(k => (
                    <div key={k.keyword} className="col-4">
                      <div className="card2" style={{ padding: '16px 20px' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{k.keyword}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{k.count} templates</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, zIndex: 10 }}>
                <div style={{ background: 'linear-gradient(135deg, #6B5BFF, #4299e1)', color: '#fff', padding: '10px 24px', borderRadius: 12, fontSize: 13, fontWeight: 700, boxShadow: '0 8px 32px rgba(107,91,255,0.3)', textAlign: 'center', maxWidth: 340, lineHeight: 1.5 }}>
                  🔒 Subscribe to kelaskreator.com to unlock all insights
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Pro/Free Opportunities (top 3 visible, rest blurred) ── */}
      {proFreeOps.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Pro/Free Opportunities</div>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 14px', lineHeight: 1.5 }}>
            {isID ? 'Peluang untuk membuat template Pro atau Free berdasarkan celah pasar.' : 'Opportunities to create Pro or Free templates based on market gaps.'}
          </p>
          <div className="bento stagger">
            {proFreeOps.slice(0, 3).map((op, i) => {
              const isFree = op.signal === 'create-free';
              return (
                <div key={op.niche} className="col-4">
                  <button onClick={() => setDrawerProFree(op)} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}>
                    <div className="card2 interactive" style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, maxWidth: '65%' }}>{op.niche}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 5, background: isFree ? 'rgba(52,211,153,0.15)' : 'rgba(139,92,246,0.15)', color: isFree ? 'var(--green)' : 'var(--purple)', textTransform: 'uppercase' }}>{isFree ? 'Free' : 'Pro'}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 14, fontSize: 12, fontWeight: 600 }}>
                        <span>{op.count} templates</span>
                        <span style={{ color: 'var(--purple)' }}>{op.proPct}% pro</span>
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
          {proFreeOps.length > 3 && (
            <div style={{ position: 'relative', marginTop: 8 }}>
              <div style={{ filter: 'blur(8px)', WebkitFilter: 'blur(8px)', userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }} aria-hidden="true">
                <div className="bento">
                  {proFreeOps.slice(3, 9).map(op => (
                    <div key={op.niche} className="col-4">
                      <div className="card2" style={{ padding: '16px 20px' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{op.niche}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{op.count} templates · {op.proPct}% pro</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, zIndex: 10 }}>
                <div style={{ background: 'linear-gradient(135deg, #6B5BFF, #4299e1)', color: '#fff', padding: '10px 24px', borderRadius: 12, fontSize: 13, fontWeight: 700, boxShadow: '0 8px 32px rgba(107,91,255,0.3)', textAlign: 'center', maxWidth: 340, lineHeight: 1.5 }}>
                  🔒 Subscribe to kelaskreator.com to unlock all insights
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Creator drawer */}
      {drawerCreator && (
        <DrawerShell kind="Creator" onClose={() => setDrawerCreator(null)}>
          <CreatorDrawerContent creatorName={drawerCreator} categoryTemplates={categoryTemplates} />
        </DrawerShell>
      )}

      {/* Ranking Signal drawer */}
      {drawerRanking && (
        <DrawerShell kind="Ranking Signal" onClose={() => setDrawerRanking(null)}>
          <RankingDrawerContent ranking={drawerRanking} categoryTemplates={categoryTemplates} nicheTemplateMap={nicheTemplateMap} />
        </DrawerShell>
      )}

      {/* Pro/Free Opportunity drawer */}
      {drawerProFree && (
        <DrawerShell kind="Opportunity" onClose={() => setDrawerProFree(null)}>
          <ProFreeDrawerContent opportunity={drawerProFree} categoryTemplates={categoryTemplates} nicheTemplateMap={nicheTemplateMap} />
        </DrawerShell>
      )}

    </div>
  );
}
