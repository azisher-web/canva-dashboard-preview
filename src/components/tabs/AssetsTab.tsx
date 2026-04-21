'use client';

import React from 'react';
import AssetOpportunities from '@/components/AssetOpportunities';
import type { DesignAnalysis, AssetPack, AssetDistItem } from '@/lib/types';
import { DrawerShell, TemplateThumbnail, EmptyState } from './shared';

interface CategoryTemplate {
  title: string;
  thumbnail: string;
  url: string;
  is_pro: boolean;
  creator?: string;
}

function AssetPackDrawerContent({ pack, categoryTemplates = [], assetDistribution = [] }: {
  pack: AssetPack; categoryTemplates?: CategoryTemplate[]; assetDistribution?: AssetDistItem[];
}) {
  const CATEGORY_CONFIG: Record<string, { color: string; icon: string }> = {
    'Object Cutout': { color: '#60a5fa', icon: '✂️' },
    'Shape': { color: '#f472b6', icon: '⭐' },
    'Texture': { color: '#fbbf24', icon: '🧱' },
    'Stationery': { color: '#34d399', icon: '📎' },
    'Nature & Organic': { color: '#4ade80', icon: '🌿' },
    'Other': { color: '#94a3b8', icon: '✨' },
  };
  const config = CATEGORY_CONFIG[pack.category] || CATEGORY_CONFIG['Other'];
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

      {packTemplates.length > 0 && (
        <>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Templates using these assets ({packTemplates.length})</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
            {packTemplates.slice(0, 12).map((t, j) => (
              <TemplateThumbnail key={j} title={t.title} canvaUrl={t.url} thumbnailUrl={t.thumbnail} index={j} size={80} showTitle isPro={t.is_pro} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function AssetsTabClient({ designAnalysis, categoryTemplates }: {
  designAnalysis: DesignAnalysis | null;
  categoryTemplates: CategoryTemplate[];
}) {
  const [openPack, setOpenPack] = React.useState<AssetPack | null>(null);

  if (!designAnalysis || !designAnalysis.asset_distribution?.length) {
    return <EmptyState text="No asset opportunity data available for this category." />;
  }

  const packs = designAnalysis.asset_packs || [];
  const assetDist = designAnalysis.asset_distribution || [];
  const VISIBLE_LIMIT = 3;
  const visiblePacks = packs.slice(0, VISIBLE_LIMIT);
  const blurredPacks = packs.slice(VISIBLE_LIMIT);

  const CATEGORY_CONFIG: Record<string, { color: string; icon: string }> = {
    'Object Cutout': { color: '#60a5fa', icon: '✂️' },
    'Shape': { color: '#f472b6', icon: '⭐' },
    'Texture': { color: '#fbbf24', icon: '🧱' },
    'Stationery': { color: '#34d399', icon: '📎' },
    'Nature & Organic': { color: '#4ade80', icon: '🌿' },
    'Other': { color: '#94a3b8', icon: '✨' },
  };

  const renderPackCard = (pack: AssetPack, i: number, clickable: boolean) => {
    const config = CATEGORY_CONFIG[pack.category] || CATEGORY_CONFIG['Other'];
    return (
      <div key={i} className="col-4">
        <div
          className={`card2 ${clickable ? 'interactive' : ''}`}
          onClick={clickable ? () => setOpenPack(pack) : undefined}
          style={{ padding: '18px 20px', cursor: clickable ? 'pointer' : 'default' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>{config.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{pack.pack_name}</span>
          </div>
          <div style={{ display: 'flex', gap: 10, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
            <span>{pack.item_count}+ items</span>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
              background: pack.demand_signal === 'high' ? 'rgba(52,211,153,0.15)' : 'var(--bg-hover)',
              color: pack.demand_signal === 'high' ? 'var(--green)' : 'var(--text-dim)',
              textTransform: 'uppercase',
            }}>{pack.demand_signal}</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{pack.niche_count} niches · {pack.pricing_suggestion}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Asset Opportunities</div>
        <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 14px', lineHeight: 1.5 }}>
          Asset packs with demand signals, pricing suggestions, and competition levels.
        </p>

        {/* Top recurring assets visualization */}
        {assetDist.length > 0 && (
          <div className="card2" style={{ padding: 20, marginBottom: 20 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Top Recurring Assets</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {assetDist.slice(0, 10).map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{a.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>&times;{a.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visible top 3 pack cards */}
        {visiblePacks.length > 0 && (
          <div className="bento stagger">
            {visiblePacks.map((p, i) => renderPackCard(p, i, true))}
          </div>
        )}

        {/* Blurred remaining */}
        {blurredPacks.length > 0 && (
          <div style={{ position: 'relative', marginTop: 12 }}>
            <div style={{ filter: 'blur(8px)', WebkitFilter: 'blur(8px)', userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }} aria-hidden="true">
              <div className="bento">
                {blurredPacks.map((p, i) => renderPackCard(p, i + VISIBLE_LIMIT, false))}
              </div>
            </div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, zIndex: 10 }}>
              <div style={{ background: 'linear-gradient(135deg, #6B5BFF, #4299e1)', color: '#fff', padding: '12px 28px', borderRadius: 12, fontSize: 14, fontWeight: 700, boxShadow: '0 8px 32px rgba(107,91,255,0.3)', textAlign: 'center', maxWidth: 360, lineHeight: 1.5 }}>
                🔒 Subscribe to kelaskreator.com to unlock all insights
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-dim)', fontWeight: 500 }}>
                🔓 {blurredPacks.length} more asset packs available with full access
              </div>
            </div>
          </div>
        )}
      </div>

      {openPack && (
        <DrawerShell kind="Asset Pack" onClose={() => setOpenPack(null)}>
          <AssetPackDrawerContent pack={openPack} categoryTemplates={categoryTemplates} assetDistribution={assetDist} />
        </DrawerShell>
      )}
    </>
  );
}
