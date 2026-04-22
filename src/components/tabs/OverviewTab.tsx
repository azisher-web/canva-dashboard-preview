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

      {/* ── Top Creators + Ranking Signal side by side (2-column grid) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32, alignItems: 'start' }}>
        {/* Top Creators — scrollable list */}
        {creators.length > 0 && (
          <div className="card2" style={{ padding: 22, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div className="eyebrow">All Creators ({creators.length})</div>
              <span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 500 }}>{isID ? 'Klik untuk lihat template' : 'Click to see templates'}</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 10px', lineHeight: 1.5 }}>
              {isID ? 'Kreator diurutkan berdasarkan jumlah template — identifikasi kompetitor dan pelajari strategi mereka.' : 'Creators ranked by template volume — identify competitors and study their strategies.'}
            </p>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12, fontSize: 10, fontWeight: 600, color: 'var(--text-dim)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 4, borderRadius: 2, background: '#f59e0b' }} />Pro</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 4, borderRadius: 2, background: '#60a5fa' }} />Free</span>
            </div>
            {/* Visible top 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', maxHeight: 480, overflowY: 'auto', overflowX: 'hidden' }}>
              {creators.slice(0, 3).map((c, i) => {
                const maxCount = creators[0]?.count || 1;
                const barW = Math.round((c.count / maxCount) * 100);
                const proPct = c.count > 0 ? Math.round((c.pro / c.count) * 100) : 0;
                const rowBg = i % 2 === 1 ? 'rgba(255,255,255,0.03)' : 'transparent';
                return (
                  <div key={i} onClick={() => setDrawerCreator(c.name)} style={{
                    cursor: 'pointer', borderRadius: 8, padding: '7px 8px',
                    background: rowBg, transition: 'background 0.15s', flexShrink: 0,
                  }} onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')} onMouseLeave={(e) => (e.currentTarget.style.background = rowBg)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 4, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                        <span style={{
                          width: 22, height: 22, borderRadius: 6, fontSize: 10, fontWeight: 800,
                          background: i < 3 ? 'var(--accent)' : 'var(--bg-hover)',
                          color: i < 3 ? '#fff' : 'var(--text-dim)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>{i + 1}</span>
                        <span style={{ color: i < 3 ? 'var(--accent)' : 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, fontWeight: i < 3 ? 700 : 500 }}>
                          {c.name}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 11, flexShrink: 0, marginLeft: 8 }}>
                        <span style={{ color: '#f59e0b' }}>{c.pro}P</span>
                        <span style={{ color: '#60a5fa' }}>{c.free}F</span>
                        <span style={{ color: 'var(--text-dim)', fontWeight: 700 }}>{c.count}</span>
                      </div>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: 'var(--bg-hover)', overflow: 'hidden', width: `${barW}%`, transition: 'width 0.4s ease' }}>
                      <div style={{ display: 'flex', height: '100%' }}>
                        <div style={{ width: `${proPct}%`, height: '100%', background: '#f59e0b', transition: 'width 0.3s ease' }} />
                        <div style={{ width: `${100 - proPct}%`, height: '100%', background: '#60a5fa', transition: 'width 0.3s ease' }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Blurred fake items */}
            {creators.length > 3 && (() => {
              const blurredFakeCreators = fakeCreators(8);
              return (
                <div style={{ position: 'relative', marginTop: 4 }}>
                  <div style={BLUR_WRAPPER_STYLE} aria-hidden="true">
                    {blurredFakeCreators.map((c, i) => {
                      const proPct = c.count > 0 ? Math.round((c.pro / c.count) * 100) : 0;
                      return (
                        <div key={i} style={{ borderRadius: 8, padding: '7px 8px', flexShrink: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ width: 22, height: 22, borderRadius: 6, fontSize: 10, fontWeight: 800, background: 'var(--bg-hover)', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 4}</span>
                              <span style={{ color: 'var(--text-muted)' }}>{c.name}</span>
                            </div>
                            <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 11, flexShrink: 0 }}>
                              <span style={{ color: '#f59e0b' }}>{c.pro}P</span>
                              <span style={{ color: '#60a5fa' }}>{c.free}F</span>
                              <span style={{ color: 'var(--text-dim)', fontWeight: 700 }}>{c.count}</span>
                            </div>
                          </div>
                          <div style={{ height: 4, borderRadius: 2, background: 'var(--bg-hover)', overflow: 'hidden', width: `${Math.round(Math.random() * 60 + 20)}%` }}>
                            <div style={{ display: 'flex', height: '100%' }}>
                              <div style={{ width: `${proPct}%`, height: '100%', background: '#f59e0b' }} />
                              <div style={{ width: `${100 - proPct}%`, height: '100%', background: '#60a5fa' }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={BLUR_OVERLAY_STYLE}>
                    <a href="https://kelaskreator.com/" target="_blank" rel="noopener noreferrer" style={BLUR_CTA_STYLE} onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(107,91,255,0.45)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(107,91,255,0.3)'; }}>
                      {'\uD83D\uDD12'} Subscribe to kelaskreator.com to unlock all insights
                    </a>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Canva Ranking Signal */}
        {rankings.length > 0 && (
          <div className="card2" style={{ padding: 22, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div className="eyebrow" style={{ margin: 0 }}>Canva Ranking Signal</div>
              <span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 500 }}>Click to see templates</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 14px', lineHeight: 1.5 }}>
              {isID ? 'Rata-rata posisi di pencarian Canva — semakin rendah = Canva lebih mendorong niche ini.' : 'Average position in Canva search — lower = Canva pushes this niche harder.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 480, overflowY: 'auto' }}>
              {rankings.slice(0, 3).map((r, i) => (
                <div key={i} onClick={() => setDrawerRanking(r)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                  borderRadius: 10, background: 'var(--bg-hover)', cursor: 'pointer',
                  transition: 'opacity 0.15s',
                }} onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                  <span style={{
                    fontSize: 16, fontWeight: 800, color: r.signal === 'rising' ? 'var(--green)' : r.signal === 'low' ? 'var(--text-dim)' : 'var(--text)',
                    minWidth: 36,
                  }}>
                    #{r.avgPosition}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.niche}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5, textTransform: 'uppercase',
                    background: ZONE_COLORS[r.zone] ? `color-mix(in srgb, ${ZONE_COLORS[r.zone]} 15%, transparent)` : 'var(--bg-hover)',
                    color: ZONE_COLORS[r.zone] || 'var(--text-dim)',
                  }}>
                    {r.zone}
                  </span>
                  {r.signal === 'rising' && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--green)' }}>&#9650; Rising</span>
                  )}
                </div>
              ))}
            </div>
            {/* Blurred fake items */}
            {rankings.length > 3 && (() => {
              const blurredFakeRankings = fakeRankings(8);
              return (
                <div style={{ position: 'relative', marginTop: 8 }}>
                  <div style={BLUR_WRAPPER_STYLE} aria-hidden="true">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {blurredFakeRankings.map((r, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                          borderRadius: 10, background: 'var(--bg-hover)',
                        }}>
                          <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-dim)', minWidth: 36 }}>#{r.avgPosition}</span>
                          <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 700 }}>{r.niche}</div></div>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: 'var(--bg-hover)', color: 'var(--text-dim)', textTransform: 'uppercase' }}>{r.zone}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={BLUR_OVERLAY_STYLE}>
                    <a href="https://kelaskreator.com/" target="_blank" rel="noopener noreferrer" style={BLUR_CTA_STYLE} onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(107,91,255,0.45)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(107,91,255,0.3)'; }}>
                      {'\uD83D\uDD12'} Subscribe to kelaskreator.com to unlock all insights
                    </a>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* ── Keyword Intelligence + Pro/Free Opportunities side by side (2-column grid) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
        {/* Keyword Intelligence */}
        {keywords.length > 0 && (
          <div className="card2" style={{ padding: 22 }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Keyword Intelligence</div>
            <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 14px', lineHeight: 1.5 }}>
              {isID ? 'Kata kunci paling sering muncul — warna biru menandakan peluang, merah menandakan persaingan ketat.' : 'Most frequent keywords across niches — blue signals opportunity, red signals heavy competition.'}
            </p>
            {/* Visible top 3 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {keywords.slice(0, 3).map((kw, i) => {
                const maxCount = keywords[0]?.count || 1;
                const intensity = Math.max(0.4, kw.count / maxCount);
                const zoneColor = kw.zone === 'blue' ? 'var(--blue)' : kw.zone === 'red' ? 'var(--red)' : 'var(--text-muted)';
                return (
                  <span key={i} style={{
                    fontSize: 11 + Math.round(intensity * 4), fontWeight: 600,
                    padding: '4px 10px', borderRadius: 8,
                    background: `color-mix(in srgb, ${zoneColor} ${Math.round(intensity * 20)}%, transparent)`,
                    color: zoneColor, opacity: 0.5 + intensity * 0.5,
                    border: `1px solid color-mix(in srgb, ${zoneColor} ${Math.round(intensity * 30)}%, transparent)`,
                  }}>
                    {kw.keyword}
                    <span style={{ fontSize: 9, marginLeft: 4, opacity: 0.7 }}>{kw.count}</span>
                  </span>
                );
              })}
            </div>
            {/* Blurred fake items */}
            {keywords.length > 3 && (() => {
              const blurredFakeKW = fakeKeywords(12);
              return (
                <div style={{ position: 'relative', marginTop: 8 }}>
                  <div style={BLUR_WRAPPER_STYLE} aria-hidden="true">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {blurredFakeKW.map((kw, i) => (
                        <span key={i} style={{
                          fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 8,
                          background: 'var(--bg-hover)', color: 'var(--text-dim)',
                          border: '1px solid var(--border)',
                        }}>
                          {kw.keyword}
                          <span style={{ fontSize: 9, marginLeft: 4, opacity: 0.7 }}>{kw.count}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={BLUR_OVERLAY_STYLE}>
                    <a href="https://kelaskreator.com/" target="_blank" rel="noopener noreferrer" style={BLUR_CTA_STYLE} onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(107,91,255,0.45)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(107,91,255,0.3)'; }}>
                      {'\uD83D\uDD12'} Subscribe to kelaskreator.com to unlock all insights
                    </a>
                  </div>
                </div>
              );
            })()}
            <div style={{ display: 'flex', gap: 14, marginTop: 14, fontSize: 11, fontWeight: 600 }}>
              <span style={{ color: 'var(--blue)' }}>&bull; Blue ocean keywords</span>
              <span style={{ color: 'var(--red)' }}>&bull; Red ocean keywords</span>
              <span style={{ color: 'var(--text-dim)' }}>&bull; Mixed</span>
            </div>
          </div>
        )}

        {/* Pro/Free Opportunities */}
        {proFreeOps.length > 0 && (
          <div className="card2" style={{ padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div className="eyebrow" style={{ margin: 0 }}>Pro/Free Opportunities</div>
              <span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 500 }}>{isID ? 'Klik untuk lihat template' : 'Click to see templates'}</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 14px', lineHeight: 1.5 }}>
              {isID ? 'Niche dengan ketidakseimbangan Pro/Free — buat tipe template yang masih kurang untuk merebut pasar.' : 'Niches with Pro/Free imbalance — create the missing type to capture unserved demand.'}
            </p>
            {/* Visible top 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {proFreeOps.slice(0, 3).map((op, i) => (
                <div key={i} onClick={() => setDrawerProFree(op)} style={{
                  padding: '10px 14px', borderRadius: 10, background: 'var(--bg-hover)',
                  borderLeft: `3px solid ${op.signal === 'create-free' ? 'var(--green)' : 'var(--purple)'}`,
                  cursor: 'pointer', transition: 'opacity 0.15s',
                }} onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700 }}>{op.niche}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 5,
                      background: op.signal === 'create-free' ? 'rgba(52,211,153,0.15)' : 'rgba(139,92,246,0.15)',
                      color: op.signal === 'create-free' ? 'var(--green)' : 'var(--purple)',
                      textTransform: 'uppercase',
                    }}>
                      {op.signal === 'create-free' ? 'Create FREE' : 'Create PRO'}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: 0, lineHeight: 1.45 }}>{op.reason}</p>
                </div>
              ))}
            </div>
            {/* Blurred fake items */}
            {proFreeOps.length > 3 && (() => {
              const blurredFakeOps = fakeProFreeOps(8);
              return (
                <div style={{ position: 'relative', marginTop: 8 }}>
                  <div style={BLUR_WRAPPER_STYLE} aria-hidden="true">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {blurredFakeOps.map((op, i) => (
                        <div key={i} style={{
                          padding: '10px 14px', borderRadius: 10, background: 'var(--bg-hover)',
                          borderLeft: `3px solid ${op.signal === 'create-free' ? 'var(--green)' : 'var(--purple)'}`,
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <span style={{ fontSize: 13.5, fontWeight: 700 }}>{op.niche}</span>
                            <span style={{
                              fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 5,
                              background: op.signal === 'create-free' ? 'rgba(52,211,153,0.15)' : 'rgba(139,92,246,0.15)',
                              color: op.signal === 'create-free' ? 'var(--green)' : 'var(--purple)',
                              textTransform: 'uppercase',
                            }}>
                              {op.signal === 'create-free' ? 'Create FREE' : 'Create PRO'}
                            </span>
                          </div>
                          <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: 0, lineHeight: 1.45 }}>{op.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={BLUR_OVERLAY_STYLE}>
                    <a href="https://kelaskreator.com/" target="_blank" rel="noopener noreferrer" style={BLUR_CTA_STYLE} onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(107,91,255,0.45)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(107,91,255,0.3)'; }}>
                      {'\uD83D\uDD12'} Subscribe to kelaskreator.com to unlock all insights
                    </a>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

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
