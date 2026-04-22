'use client';

import React from 'react';
import { TemplateThumbnail, THUMB_GRADIENTS, Tooltip } from './shared';
import BODashIcon from '@/components/BODashIcon';
import type { Outlier } from '@/lib/types';
import { fakeOutliers, BLUR_CTA_STYLE, BLUR_WRAPPER_STYLE, BLUR_OVERLAY_STYLE } from '@/lib/fakeData';

type CategoryTemplate = {
  title: string;
  thumbnail?: string;
  url?: string;
  is_pro?: boolean;
};

function EmptyState({ text }: { text: string }) {
  return (
    <div className="card2" style={{ padding: 48, textAlign: 'center' }}>
      <BODashIcon name="sparkles" size={28} />
      <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 12, fontWeight: 500 }}>{text}</div>
    </div>
  );
}

export default function OutliersTab({ outliers, templateMap, nicheTemplateMap, categoryTemplates, isID }: {
  outliers: Outlier[];
  templateMap: Record<string, { thumbnail: string; url: string; is_pro: boolean }>;
  nicheTemplateMap: Record<string, string[]>;
  categoryTemplates: CategoryTemplate[];
  isID: boolean;
}) {
  const ctMap = React.useMemo(() => {
    const m: Record<string, CategoryTemplate> = {};
    for (const t of categoryTemplates) { if (t.title && t.thumbnail) m[t.title] = t; }
    return m;
  }, [categoryTemplates]);

  if (outliers.length === 0) return <EmptyState text="No outliers found." />;

  const VISIBLE_LIMIT = 2;
  const visibleOutliers = outliers.slice(0, VISIBLE_LIMIT);
  const blurredOutliers = outliers.slice(VISIBLE_LIMIT);

  const renderCard = (o: Outlier, i: number) => {
    let examples = o.examples && o.examples.length > 0 ? o.examples : [];
    if (examples.length === 0) {
      const nicheTitles = nicheTemplateMap[o.title] || [];
      examples = nicheTitles.filter(t => ctMap[t]?.thumbnail).slice(0, 4).map(t => ({ title: t }));
    }

    return (
      <div key={i} className="col-6 card2" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 7, background: 'var(--accent-dim)', color: 'var(--accent)' }}>
              #{o.rank}
            </span>
            <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', margin: 0 }}>{o.title}</h3>
          </div>
          <Tooltip text={isID
            ? `Outlier Score: ${o.score}\n\nDihitung dari Total Templates ÷ jumlah template di niche ini.`
            : `Outlier Score: ${o.score}\n\nCalculated from Total Templates ÷ templates in this niche.`}>
            <span style={{
              fontSize: 14, fontWeight: 800, padding: '6px 14px', borderRadius: 10,
              background: 'var(--green-dim)', color: 'var(--green)', flexShrink: 0, cursor: 'help',
            }}>
              {o.score}
            </span>
          </Tooltip>
        </div>
        <div style={{ display: 'flex', gap: 14, fontSize: 12, marginBottom: 12, color: 'var(--text-dim)' }}>
          <span><strong style={{ color: 'var(--text-muted)' }}>{o.count}</strong> templates</span>
          <Tooltip text={isID
            ? `Demand: ${o.demand}\n\nPerkiraan permintaan pasar berdasarkan analisis AI.`
            : `Demand: ${o.demand}\n\nEstimated market demand based on AI analysis.`}>
            <span className="badge-zone badge-blue" style={{ fontSize: 11, cursor: 'help' }}><span className="dot" />{o.demand} demand</span>
          </Tooltip>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, lineHeight: 1.65, margin: '0 0 14px' }}>{o.reason}</p>
        {examples.length > 0 && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {examples.slice(0, 4).map((ex, j) => {
              const info = templateMap[ex.title] || (ctMap[ex.title] ? { thumbnail: ctMap[ex.title].thumbnail, url: ctMap[ex.title].url, is_pro: ctMap[ex.title].is_pro } : undefined);
              return (
                <TemplateThumbnail
                  key={j}
                  title={ex.title}
                  canvaUrl={info?.url || ex.url}
                  thumbnailUrl={info?.thumbnail}
                  index={j + i * 4}
                  size={72}
                  showTitle
                  isPro={info?.is_pro}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Visible top 3 */}
      <div className="bento stagger">
        {visibleOutliers.map((o, i) => renderCard(o, i))}
      </div>

      {/* Blurred remaining cards with CTA overlay — uses fake data so real data is never exposed */}
      {blurredOutliers.length > 0 && (() => {
        const fake = fakeOutliers(blurredOutliers.length);
        return (
          <div style={{ position: 'relative', marginTop: 12 }}>
            <div style={BLUR_WRAPPER_STYLE} aria-hidden="true">
              <div className="bento">
                {fake.map((f, i) => (
                  <div key={i} className="col-6 card2" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 7, background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                          #{i + VISIBLE_LIMIT + 1}
                        </span>
                        <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', margin: 0 }}>{f.niche}</h3>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 800, padding: '6px 14px', borderRadius: 10, background: 'var(--green-dim)', color: 'var(--green)', flexShrink: 0 }}>
                        {f.score}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 14, fontSize: 12, marginBottom: 12, color: 'var(--text-dim)' }}>
                      <span><strong style={{ color: 'var(--text-muted)' }}>{f.templates}</strong> templates</span>
                      <span className="badge-zone badge-blue" style={{ fontSize: 11 }}><span className="dot" />{f.demand} demand</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>{f.why}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* CTA overlay */}
            <div style={BLUR_OVERLAY_STYLE}>
              <a href="https://kelaskreator.com/" target="_blank" rel="noopener noreferrer" style={BLUR_CTA_STYLE} onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(107,91,255,0.45)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(107,91,255,0.3)'; }}>
                🔒 Subscribe to kelaskreator.com to unlock all insights
              </a>
              <div style={{ fontSize: 12, color: 'var(--text-dim)', fontWeight: 500 }}>
                🔓 {blurredOutliers.length} more outliers available with full access
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
