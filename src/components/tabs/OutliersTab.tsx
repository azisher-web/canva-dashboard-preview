'use client';

import React from 'react';
import { TemplateThumbnail, THUMB_GRADIENTS, Tooltip } from './shared';
import BODashIcon from '@/components/BODashIcon';
import PreviewGate, { PreviewBanner } from '@/components/PreviewGate';
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
  // Build a quick title→CategoryTemplate lookup for fallback examples
  const ctMap = React.useMemo(() => {
    const m: Record<string, CategoryTemplate> = {};
    for (const t of categoryTemplates) { if (t.title && t.thumbnail) m[t.title] = t; }
    return m;
  }, [categoryTemplates]);

  if (outliers.length === 0) return <EmptyState text="No outliers found." />;
  return (
    <div>
      <div className="bento stagger">
        {outliers.slice(0, 3).map((o, i) => {
        // Derive examples: use o.examples if available, otherwise pull from niche_template_map
        let examples = o.examples && o.examples.length > 0 ? o.examples : [];
        if (examples.length === 0) {
          const nicheTitles = nicheTemplateMap[o.title] || [];
          // Pick templates that have thumbnails, up to 4
          examples = nicheTitles
            .filter(t => ctMap[t]?.thumbnail)
            .slice(0, 4)
            .map(t => ({ title: t }));
        }

        return (
        <div key={i} className="col-6 card2" style={{ padding: 20 }}>
          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 7, background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                #{o.rank}
              </span>
              <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', margin: 0 }}>{o.title}</h3>
            </div>
            <Tooltip text={isID
              ? `Outlier Score: ${o.score}\n\nDihitung dari Total Templates ÷ jumlah template di niche ini.\nMakin tinggi = niche makin langka = peluang makin besar.`
              : `Outlier Score: ${o.score}\n\nCalculated from Total Templates ÷ templates in this niche.\nHigher score = rarer niche = bigger opportunity.`}>
              <span style={{
                fontSize: 14, fontWeight: 800, padding: '6px 14px', borderRadius: 10,
                background: 'var(--green-dim)', color: 'var(--green)', flexShrink: 0,
                cursor: 'help',
              }}>
                {o.score}
              </span>
            </Tooltip>
          </div>
          {/* Subtitle */}
          <div style={{ display: 'flex', gap: 14, fontSize: 12, marginBottom: 12, color: 'var(--text-dim)' }}>
            <span><strong style={{ color: 'var(--text-muted)' }}>{o.count}</strong> templates</span>
            <Tooltip text={isID
              ? `Demand: ${o.demand}\n\nPerkiraan permintaan pasar berdasarkan analisis AI.\n\n• Sangat Tinggi — banyak pencari, sedikit template\n• Tinggi — peluang bagus untuk creator baru\n• Sedang — ada ruang untuk template berkualitas\n• Rendah — niche sangat spesifik`
              : `Demand: ${o.demand}\n\nEstimated market demand based on AI analysis.\n\n• Very High — many searchers, few templates\n• High — great opportunity for new creators\n• Medium — room for quality templates\n• Low — very specific niche`}>
              <span className="badge-zone badge-blue" style={{ fontSize: 11, cursor: 'help' }}><span className="dot" />{o.demand} demand</span>
            </Tooltip>
          </div>
          {/* Description */}
          <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, lineHeight: 1.65, margin: '0 0 14px' }}>{o.reason}</p>
          {/* Template example thumbnails */}
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
      })}
      </div>
      {outliers.length > 3 && (
        <PreviewBanner text={`${outliers.length - 3} more outliers available with full access`} />
      )}
    </div>
  );
}
