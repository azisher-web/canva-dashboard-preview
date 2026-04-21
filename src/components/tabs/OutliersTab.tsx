'use client';

import React from 'react';
import { TemplateThumbnail, THUMB_GRADIENTS, Tooltip } from './shared';
import BODashIcon from '@/components/BODashIcon';
import type { Outlier } from '@/lib/types';

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

  const VISIBLE_LIMIT = 3;
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

      {/* Blurred remaining cards with CTA overlay */}
      {blurredOutliers.length > 0 && (
        <div style={{ position: 'relative', marginTop: 12 }}>
          <div
            style={{
              filter: 'blur(8px)',
              WebkitFilter: 'blur(8px)',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          >
            <div className="bento">
              {blurredOutliers.map((o, i) => renderCard(o, i + VISIBLE_LIMIT))}
            </div>
          </div>
          {/* CTA overlay */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 12, zIndex: 10,
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #6B5BFF, #4299e1)',
              color: '#fff', padding: '12px 28px', borderRadius: 12,
              fontSize: 14, fontWeight: 700,
              boxShadow: '0 8px 32px rgba(107,91,255,0.3)',
              textAlign: 'center', maxWidth: 360, lineHeight: 1.5,
            }}>
              🔒 Subscribe to kelaskreator.com to unlock all insights
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', fontWeight: 500 }}>
              🔓 {blurredOutliers.length} more outliers available with full access
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
