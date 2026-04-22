import { getAnalysisBySlug, getCategoryTemplatesFull, buildCategoryTemplates, buildCategoryInsights, isIndonesianCategory } from '@/lib/category-data';
import { PreviewBanner } from '@/components/PreviewGate';
import { fakeCreators, fakeKeywords, fakeRankings, fakeProFreeOps, BLUR_WRAPPER_STYLE, BLUR_OVERLAY_STYLE, BLUR_CTA_STYLE } from '@/lib/fakeData';

export const dynamic = 'force-dynamic';

export default async function InsightsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = await params;
  const analysis = await getAnalysisBySlug(slug);
  if (!analysis) return <PreviewBanner text="No data available." />;

  const fullTemplates = await getCategoryTemplatesFull(analysis.category_id);
  const nicheTemplateMap = analysis.niche_template_map || {};
  const niches = analysis.niche_distribution || [];
  const categoryInsights = buildCategoryInsights(fullTemplates, nicheTemplateMap, niches);
  const isID = isIndonesianCategory(analysis.category_name || '');

  const creators = categoryInsights?.topCreators || [];
  const keywords = categoryInsights?.topKeywords || [];
  const proFreeOps = categoryInsights?.proFreeOpportunities || [];
  const rankings = categoryInsights?.nicheRankings || [];

  const ZONE_COLORS: Record<string, string> = { blue: 'var(--blue)', yellow: 'var(--yellow)', red: 'var(--red)' };

  const blurCTA = (
    <a href="https://kelaskreator.com/" target="_blank" rel="noopener noreferrer" style={{
      background: 'linear-gradient(135deg, #6B5BFF, #4299e1)',
      color: '#fff', padding: '10px 24px', borderRadius: 12,
      fontSize: 13, fontWeight: 700,
      boxShadow: '0 8px 32px rgba(107,91,255,0.3)',
      textAlign: 'center', textDecoration: 'none', display: 'inline-block',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    }}>
      🔒 Subscribe to kelaskreator.com to unlock all insights
    </a>
  );

  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 6 }}>Advanced Insights</div>
      <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 20px', lineHeight: 1.5 }}>
        {isID ? 'Analisis mendalam — dominasi creator, intelijen keyword, deteksi celah konten.' : 'Deep analysis — creator dominance, keyword intelligence, content gap detection, and more.'}
      </p>

      {/* Row 1: Creator Dominance + Keyword Intelligence (2-column grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32, alignItems: 'start' }}>
        {/* Creator Dominance */}
        {creators.length > 0 && (
          <div className="card2" style={{ padding: 22, overflow: 'hidden' }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Creator Dominance ({creators.length})</div>
            {/* Visible top 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
              {creators.slice(0, 3).map((c, i) => {
                const maxCount = creators[0]?.count || 1;
                const barW = Math.round((c.count / maxCount) * 100);
                const proPct = c.count > 0 ? Math.round((c.pro / c.count) * 100) : 0;
                return (
                  <div key={i} style={{ padding: '7px 8px', borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          width: 22, height: 22, borderRadius: 6, fontSize: 10, fontWeight: 800,
                          background: i < 3 ? 'var(--accent)' : 'var(--bg-hover)',
                          color: i < 3 ? '#fff' : 'var(--text-dim)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>{i + 1}</span>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{c.name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 11, flexShrink: 0 }}>
                        <span style={{ color: '#f59e0b' }}>{c.pro}P</span>
                        <span style={{ color: '#60a5fa' }}>{c.free}F</span>
                        <span style={{ color: 'var(--text-dim)', fontWeight: 700 }}>{c.count}</span>
                      </div>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: 'var(--bg-hover)', overflow: 'hidden', width: `${barW}%` }}>
                      <div style={{ display: 'flex', height: '100%' }}>
                        <div style={{ width: `${proPct}%`, height: '100%', background: '#f59e0b' }} />
                        <div style={{ width: `${100 - proPct}%`, height: '100%', background: '#60a5fa' }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Blurred fake items */}
            {creators.length > 3 && (() => {
              const fakeC = fakeCreators(6);
              return (
                <div style={{ position: 'relative', marginTop: 4 }}>
                  <div style={{ filter: 'blur(8px)', userSelect: 'none', pointerEvents: 'none' }} aria-hidden="true">
                    {fakeC.map((c, i) => (
                      <div key={i} style={{ padding: '7px 8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                          <span>{c.name}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{c.count}</span>
                        </div>
                        <div style={{ height: 4, borderRadius: 2, background: 'var(--bg-hover)', width: `${Math.round(Math.random() * 60 + 20)}%` }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                    {blurCTA}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Keyword Intelligence */}
        {keywords.length > 0 && (
          <div className="card2" style={{ padding: 22 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Keyword Intelligence ({keywords.length})</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {keywords.slice(0, 5).map((kw, i) => {
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
            {/* Blurred fake keywords */}
            {keywords.length > 5 && (() => {
              const fakeK = fakeKeywords(10);
              return (
                <div style={{ position: 'relative', marginTop: 8 }}>
                  <div style={{ filter: 'blur(8px)', userSelect: 'none', pointerEvents: 'none' }} aria-hidden="true">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {fakeK.map((k, i) => (
                        <span key={i} style={{
                          fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 8,
                          background: 'var(--bg-hover)', color: 'var(--text-dim)', border: '1px solid var(--border)',
                        }}>
                          {k.keyword} <span style={{ fontSize: 9, opacity: 0.7 }}>{k.count}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                    {blurCTA}
                  </div>
                </div>
              );
            })()}
            <div style={{ display: 'flex', gap: 14, marginTop: 14, fontSize: 11, fontWeight: 600 }}>
              <span style={{ color: 'var(--blue)' }}>&bull; Blue ocean</span>
              <span style={{ color: 'var(--red)' }}>&bull; Red ocean</span>
              <span style={{ color: 'var(--text-dim)' }}>&bull; Mixed</span>
            </div>
          </div>
        )}
      </div>

      {/* Row 2: Niche Rankings + Pro/Free Opportunities (2-column grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32, alignItems: 'start' }}>
        {/* Niche Rankings */}
        {rankings.length > 0 && (
          <div className="card2" style={{ padding: 22, overflow: 'hidden' }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Niche Rankings</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rankings.slice(0, 3).map((r, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                  borderRadius: 10, background: 'var(--bg-hover)',
                }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: ZONE_COLORS[r.zone] || 'var(--text-dim)', minWidth: 36 }}>#{r.avgPosition}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.niche}</div>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5, textTransform: 'uppercase',
                    background: `color-mix(in srgb, ${ZONE_COLORS[r.zone] || 'var(--text-dim)'} 15%, transparent)`,
                    color: ZONE_COLORS[r.zone] || 'var(--text-dim)',
                  }}>{r.zone}</span>
                </div>
              ))}
            </div>
            {rankings.length > 3 && (() => {
              const fakeR = fakeRankings(6);
              return (
                <div style={{ position: 'relative', marginTop: 8 }}>
                  <div style={{ filter: 'blur(8px)', userSelect: 'none', pointerEvents: 'none' }} aria-hidden="true">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {fakeR.map((r, i) => (
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
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                    {blurCTA}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Pro/Free Opportunities */}
        {proFreeOps.length > 0 && (
          <div className="card2" style={{ padding: 22 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Pro/Free Opportunities</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {proFreeOps.slice(0, 3).map((op, i) => {
                const isFree = op.signal === 'create-free';
                return (
                  <div key={i} style={{
                    padding: '10px 14px', borderRadius: 10, background: 'var(--bg-hover)',
                    borderLeft: `3px solid ${isFree ? 'var(--green)' : 'var(--purple)'}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 700 }}>{op.niche}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 5,
                        background: isFree ? 'rgba(52,211,153,0.15)' : 'rgba(139,92,246,0.15)',
                        color: isFree ? 'var(--green)' : 'var(--purple)', textTransform: 'uppercase',
                      }}>{isFree ? 'Create FREE' : 'Create PRO'}</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: 0, lineHeight: 1.45 }}>{op.reason}</p>
                  </div>
                );
              })}
            </div>
            {proFreeOps.length > 3 && (() => {
              const fakePF = fakeProFreeOps(6);
              return (
                <div style={{ position: 'relative', marginTop: 8 }}>
                  <div style={{ filter: 'blur(8px)', userSelect: 'none', pointerEvents: 'none' }} aria-hidden="true">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {fakePF.map((op, i) => {
                        const isFree = op.signal === 'create-free';
                        return (
                          <div key={i} style={{
                            padding: '10px 14px', borderRadius: 10, background: 'var(--bg-hover)',
                            borderLeft: `3px solid ${isFree ? 'var(--green)' : 'var(--purple)'}`,
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                              <span style={{ fontSize: 13.5, fontWeight: 700 }}>{op.niche}</span>
                              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 5, background: isFree ? 'rgba(52,211,153,0.15)' : 'rgba(139,92,246,0.15)', color: isFree ? 'var(--green)' : 'var(--purple)', textTransform: 'uppercase' }}>{isFree ? 'Create FREE' : 'Create PRO'}</span>
                            </div>
                            <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: 0 }}>{op.reason}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                    {blurCTA}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {creators.length === 0 && keywords.length === 0 && rankings.length === 0 && proFreeOps.length === 0 && (
        <PreviewBanner text="Advanced Insights available with full access — unlock creator dominance, keyword intelligence, and more." />
      )}
    </div>
  );
}
