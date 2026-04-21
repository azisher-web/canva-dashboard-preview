'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import BODashIcon from '@/components/BODashIcon';
import PreviewGate, { PreviewBanner } from '@/components/PreviewGate';
import { Tooltip, Donut, OvMetric, TemplateThumbnail, ScoreBar, DrawerShell, THUMB_GRADIENTS } from './shared';
import type { CategoryTemplate } from './shared';
import type { Analysis, NicheItem, Recommendation } from '@/lib/types';
import type { CreatorStat, KeywordStat, ProFreeOpportunity, NicheRanking, CategoryInsights } from '@/lib/category-data';
import { fakeCreators, fakeRankings, fakeKeywords, fakeProFreeOps, BLUR_CTA_STYLE, BLUR_WRAPPER_STYLE, BLUR_OVERLAY_STYLE } from '@/lib/fakeData';

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
      {creators.length > 0 && (() => {
        const blurredFakeCreators = fakeCreators(8);
        return (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
            <div className="eyebrow">All Creators ({creators.length})</div>
            <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}>
              {isID ? 'Klik untuk lihat template' : 'Click to see templates'}
            </span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 10px', lineHeight: 1.5 }}>
            {isID ? 'Kreator diurutkan berdasarkan jumlah template — identifikasi kompetitor dan pelajari strategi mereka.' : 'Creators sorted by template count — identify competitors and study their strategies.'}
          </p>
          <div style={{ display: 'flex', gap: 8, fontSize: 12, fontWeight: 600, marginBottom: 14 }}>
            <span><span style={{ color: '#f59e0b' }}>{'\u25CF'}</span> Pro</span>
            <span><span style={{ color: 'var(--blue)' }}>{'\u25CF'}</span> Free</span>
          </div>
          {/* Visible top 3 */}
          {creators.slice(0, 3).map((c, i) => {
            const total = c.pro + c.free;
            const proPct = total > 0 ? (c.pro / total) * 100 : 0;
            const freePct = total > 0 ? (c.free / total) * 100 : 0;
            return (
              <button key={c.name} onClick={() => setDrawerCreator(c.name)} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', display: 'block' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: i === 0 ? 'var(--accent)' : i === 1 ? '#6366f1' : '#8b5cf6',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800,
                  }}>{i + 1}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, minWidth: 140, flexShrink: 0 }}>{c.name}</span>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', height: 14, borderRadius: 4, overflow: 'hidden', background: 'var(--bg-dim)' }}>
                    <div style={{ width: `${proPct}%`, height: '100%', background: '#f59e0b' }} />
                    <div style={{ width: `${freePct}%`, height: '100%', background: 'var(--blue)' }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dim)', whiteSpace: 'nowrap', minWidth: 70, textAlign: 'right' }}>
                    {c.pro}P {c.free}F {total}
                  </span>
                </div>
              </button>
            );
          })}
          {/* Blurred fake items */}
          {creators.length > 3 && (
            <div style={{ position: 'relative', marginTop: 4 }}>
              <div style={BLUR_WRAPPER_STYLE} aria-hidden="true">
                {blurredFakeCreators.map((c, i) => {
                  const total = c.pro + c.free;
                  const proPct = total > 0 ? (c.pro / total) * 100 : 0;
                  const freePctVal = total > 0 ? (c.free / total) * 100 : 0;
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        background: 'var(--text-dim)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 800,
                      }}>{i + 4}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, minWidth: 140, flexShrink: 0 }}>{c.name}</span>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', height: 14, borderRadius: 4, overflow: 'hidden', background: 'var(--bg-dim)' }}>
                        <div style={{ width: `${proPct}%`, height: '100%', background: '#f59e0b' }} />
                        <div style={{ width: `${freePctVal}%`, height: '100%', background: 'var(--blue)' }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dim)', whiteSpace: 'nowrap', minWidth: 70, textAlign: 'right' }}>
                        {c.pro}P {c.free}F {total}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div style={BLUR_OVERLAY_STYLE}>
                <div style={BLUR_CTA_STYLE}>
                  {'\uD83D\uDD12'} Subscribe to kelaskreator.com to unlock all insights
                </div>
              </div>
            </div>
          )}
        </div>
        );
      })()}

      {/* ── Canva Ranking Signal (top 3 visible, rest blurred) ── */}
      {rankings.length > 0 && (() => {
        const blurredFakeRankings = fakeRankings(8);
        const ZONE_BADGE_COLORS: Record<string, { bg: string; color: string }> = {
          blue: { bg: 'rgba(66,153,225,0.15)', color: 'var(--blue)' },
          yellow: { bg: 'rgba(245,158,11,0.15)', color: 'var(--yellow)' },
          red: { bg: 'rgba(238,93,80,0.15)', color: 'var(--red)' },
        };
        return (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
            <div className="eyebrow">Canva Ranking Signal</div>
            <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}>
              {isID ? 'Klik untuk lihat template' : 'Click to see templates'}
            </span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 14px', lineHeight: 1.5 }}>
            {isID ? 'Rata-rata posisi di pencarian Canva — semakin rendah = Canva lebih mendorong niche ini.' : 'Average position in Canva search — lower = Canva pushes this niche more.'}
          </p>
          {/* Visible top 3 */}
          {rankings.slice(0, 3).map((r) => {
            const zBadge = ZONE_BADGE_COLORS[r.zone] || { bg: 'rgba(100,100,100,0.15)', color: 'var(--text-muted)' };
            return (
              <button key={r.niche} onClick={() => setDrawerRanking(r)} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', display: 'block' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: ZONE_COLORS[r.zone] || 'var(--text-muted)', minWidth: 56 }}>#{r.avgPosition}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{r.niche}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 5,
                    background: zBadge.bg, color: zBadge.color, textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>{r.zone}</span>
                </div>
              </button>
            );
          })}
          {/* Blurred fake items */}
          {rankings.length > 3 && (
            <div style={{ position: 'relative', marginTop: 4 }}>
              <div style={BLUR_WRAPPER_STYLE} aria-hidden="true">
                {blurredFakeRankings.map((r, i) => {
                  const zBadge = ZONE_BADGE_COLORS[r.zone] || { bg: 'rgba(100,100,100,0.15)', color: 'var(--text-muted)' };
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: ZONE_COLORS[r.zone] || 'var(--text-muted)', minWidth: 56 }}>#{r.avgPosition}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{r.niche}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 5,
                        background: zBadge.bg, color: zBadge.color, textTransform: 'uppercase', letterSpacing: '0.05em',
                      }}>{r.zone}</span>
                    </div>
                  );
                })}
              </div>
              <div style={BLUR_OVERLAY_STYLE}>
                <div style={BLUR_CTA_STYLE}>
                  {'\uD83D\uDD12'} Subscribe to kelaskreator.com to unlock all insights
                </div>
              </div>
            </div>
          )}
        </div>
        );
      })()}

      {/* ── Keyword Intelligence (top 3 visible, rest blurred) ── */}
      {keywords.length > 0 && (() => {
        const blurredFakeKeywords = fakeKeywords(12);
        const kwPillStyle = (zone: string): React.CSSProperties => {
          if (zone === 'red') return { border: '1.5px solid var(--red)', background: 'rgba(238,93,80,0.08)', color: 'var(--red)' };
          if (zone === 'blue') return { border: '1.5px solid var(--blue)', background: 'rgba(66,153,225,0.08)', color: 'var(--blue)' };
          return { border: '1.5px solid var(--text-dim)', background: 'var(--bg-dim)', color: 'var(--text-secondary)' };
        };
        return (
        <div style={{ marginBottom: 32 }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>Keyword Intelligence</div>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 14px', lineHeight: 1.5 }}>
            {isID ? 'Kata kunci paling sering muncul — warna biru menandakan peluang, merah menandakan persaingan ketat.' : 'Most frequent keywords — blue indicates opportunity, red indicates intense competition.'}
          </p>
          {/* Visible top keywords as pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
            {keywords.slice(0, 3).map((k) => (
              <span key={k.keyword} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                ...kwPillStyle(k.zone),
              }}>
                {k.keyword} <span style={{ fontWeight: 800 }}>{k.count}</span>
              </span>
            ))}
          </div>
          {/* Blurred fake keyword pills */}
          {keywords.length > 3 && (
            <div style={{ position: 'relative', marginTop: 4 }}>
              <div style={BLUR_WRAPPER_STYLE} aria-hidden="true">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {blurredFakeKeywords.map((k, i) => (
                    <span key={i} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                      ...kwPillStyle(k.zone),
                    }}>
                      {k.keyword} <span style={{ fontWeight: 800 }}>{k.count}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div style={BLUR_OVERLAY_STYLE}>
                <div style={BLUR_CTA_STYLE}>
                  {'\uD83D\uDD12'} Subscribe to kelaskreator.com to unlock all insights
                </div>
              </div>
            </div>
          )}
        </div>
        );
      })()}

      {/* ── Pro/Free Opportunities (top 3 visible, rest blurred) ── */}
      {proFreeOps.length > 0 && (() => {
        const blurredFakeOps = fakeProFreeOps(8);
        return (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
            <div className="eyebrow">Pro/Free Opportunities</div>
            <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}>
              {isID ? 'Klik untuk lihat template' : 'Click to see templates'}
            </span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 14px', lineHeight: 1.5 }}>
            {isID ? 'Niche dengan ketidakseimbangan Pro/Free — buat tipe template yang masih kurang untuk merebut pasar.' : 'Niches with Pro/Free imbalance — create the underserved template type to capture the market.'}
          </p>
          {/* Visible top 3 */}
          {proFreeOps.slice(0, 3).map((op) => {
            const isFree = op.signal === 'create-free';
            return (
              <button key={op.niche} onClick={() => setDrawerProFree(op)} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', display: 'block' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 16px', borderBottom: '1px solid var(--border)',
                  borderRadius: 0,
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{op.niche}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.5 }}>
                      {op.proPct}% Pro — {isFree
                        ? (isID ? 'pengguna yang mencari alternatif gratis tidak bisa menemukannya di sini' : 'users seeking free alternatives can\'t find them here')
                        : (isID ? 'peluang buat konten pro premium di niche ini' : 'opportunity to create premium pro content in this niche')}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 800, padding: '4px 12px', borderRadius: 6, whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 16,
                    background: isFree ? 'rgba(52,211,153,0.15)' : 'rgba(139,92,246,0.15)',
                    color: isFree ? 'var(--green)' : 'var(--purple)',
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                  }}>
                    {isFree ? 'CREATE FREE' : 'CREATE PRO'}
                  </span>
                </div>
              </button>
            );
          })}
          {/* Blurred fake items */}
          {proFreeOps.length > 3 && (
            <div style={{ position: 'relative', marginTop: 4 }}>
              <div style={BLUR_WRAPPER_STYLE} aria-hidden="true">
                {blurredFakeOps.map((op, i) => {
                  const isFree = op.signal === 'create-free';
                  return (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '14px 16px', borderBottom: '1px solid var(--border)',
                    }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{op.niche}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.5 }}>
                          {op.proPct}% Pro — {op.reason}
                        </div>
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 800, padding: '4px 12px', borderRadius: 6, whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 16,
                        background: isFree ? 'rgba(52,211,153,0.15)' : 'rgba(139,92,246,0.15)',
                        color: isFree ? 'var(--green)' : 'var(--purple)',
                        textTransform: 'uppercase', letterSpacing: '0.04em',
                      }}>
                        {isFree ? 'CREATE FREE' : 'CREATE PRO'}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div style={BLUR_OVERLAY_STYLE}>
                <div style={BLUR_CTA_STYLE}>
                  {'\uD83D\uDD12'} Subscribe to kelaskreator.com to unlock all insights
                </div>
              </div>
            </div>
          )}
        </div>
        );
      })()}

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
