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

export default function AssetsTabClient({ designAnalysis, categoryTemplates }: {
  designAnalysis: DesignAnalysis | null;
  categoryTemplates: CategoryTemplate[];
}) {
  const [drawer, setDrawer] = React.useState<AssetPack | null>(null);

  if (!designAnalysis || !designAnalysis.asset_distribution?.length) {
    return <EmptyState text="No asset opportunity data available for this category." />;
  }

  return (
    <>
      <div style={{ position: 'relative' }}>
        {/* Show the real component but limit height and blur the overflow */}
        <div style={{ maxHeight: 520, overflow: 'hidden' }}>
          <AssetOpportunities data={designAnalysis} onOpenPack={(pack) => setDrawer(pack as AssetPack)} />
        </div>
        {/* Blur gradient overlay at bottom */}
        <div style={{
          position: 'absolute',
          left: 0, right: 0, bottom: 0,
          height: '60%',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(var(--bg-rgb, 15,15,26), 0.4) 30%, rgba(var(--bg-rgb, 15,15,26), 0.85) 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          zIndex: 10,
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
            🔒 Subscribe to kelaskreator.com to unlock all asset insights
          </a>
          <div style={{ fontSize: 12, color: 'var(--text-dim)', fontWeight: 500 }}>
            🔓 Full asset analysis available with premium access
          </div>
        </div>
      </div>
      {drawer && (
        <DrawerShell kind="asset pack" onClose={() => setDrawer(null)}>
          <AssetPackDrawerContent pack={drawer} categoryTemplates={categoryTemplates} assetDistribution={designAnalysis.asset_distribution} />
        </DrawerShell>
      )}
    </>
  );
}
