import { getAnalysisBySlug, getCategoryTemplatesFull, buildCategoryTemplates, buildCategoryInsights, isIndonesianCategory } from '@/lib/category-data';
import { PreviewBanner } from '@/components/PreviewGate';
import { fakeCreators, fakeKeywords, fakeRankings, fakeProFreeOps } from '@/lib/fakeData';

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

  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 6 }}>Advanced Insights</div>
      <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 20px', lineHeight: 1.5 }}>
        {isID ? 'Analisis mendalam — dominasi creator, intelijen keyword, deteksi celah konten.' : 'Deep analysis — creator dominance, keyword intelligence, content gap detection, and more.'}
      </p>

      {/* Creator Dominance */}
      {creators.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Creator Dominance</div>
          <div className="bento stagger">
            {creators.slice(0, 3).map((c, i) => (
              <div key={c.name} className="col-4">
                <div className="card2" style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 7px', borderRadius: 5, background: 'var(--accent-dim)', color: 'var(--accent)' }}>#{i + 1}</span>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{c.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12, fontWeight: 600 }}>
                    <span>{c.count} templates</span>
                    <span style={{ color: 'var(--purple)' }}>{c.pro} Pro</span>
                    <span style={{ color: 'var(--green)' }}>{c.free} Free</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {creators.length > 3 && (() => {
            const fakeC = fakeCreators(Math.min(creators.length - 3, 6));
            return (
              <div style={{ position: 'relative', marginTop: 8 }}>
                <div style={{ filter: 'blur(8px)', userSelect: 'none', pointerEvents: 'none' }} aria-hidden="true">
                  <div className="bento">
                    {fakeC.map((c, i) => (
                      <div key={i} className="col-4">
                        <div className="card2" style={{ padding: '16px 20px' }}>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>{c.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{c.count} templates</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                  <div style={{ background: 'linear-gradient(135deg, #6B5BFF, #4299e1)', color: '#fff', padding: '10px 24px', borderRadius: 12, fontSize: 13, fontWeight: 700, boxShadow: '0 8px 32px rgba(107,91,255,0.3)', textAlign: 'center' }}>
                    🔒 Subscribe to kelaskreator.com to unlock all insights
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Keyword Intelligence */}
      {keywords.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Keyword Intelligence</div>
          <div className="bento stagger">
            {keywords.slice(0, 3).map((k) => (
              <div key={k.keyword} className="col-4">
                <div className="card2" style={{ padding: '16px 20px' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{k.keyword}</div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12, fontWeight: 600 }}>
                    <span>{k.count} templates</span>
                    <span style={{ color: 'var(--blue)' }}>blue {k.blueCount}</span>
                    <span style={{ color: 'var(--red)' }}>red {k.redCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {keywords.length > 3 && (() => {
            const fakeK = fakeKeywords(Math.min(keywords.length - 3, 6));
            return (
              <div style={{ position: 'relative', marginTop: 8 }}>
                <div style={{ filter: 'blur(8px)', userSelect: 'none', pointerEvents: 'none' }} aria-hidden="true">
                  <div className="bento">
                    {fakeK.map((k, i) => (
                      <div key={i} className="col-4">
                        <div className="card2" style={{ padding: '16px 20px' }}>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>{k.keyword}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{k.count} templates</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                  <div style={{ background: 'linear-gradient(135deg, #6B5BFF, #4299e1)', color: '#fff', padding: '10px 24px', borderRadius: 12, fontSize: 13, fontWeight: 700, boxShadow: '0 8px 32px rgba(107,91,255,0.3)', textAlign: 'center' }}>
                    🔒 Subscribe to kelaskreator.com to unlock all insights
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Ranking Signal */}
      {rankings.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Niche Rankings</div>
          <div className="bento stagger">
            {rankings.slice(0, 3).map((r) => (
              <div key={r.niche} className="col-4">
                <div className="card2" style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, maxWidth: '70%' }}>{r.niche}</span>
                    <span className={`badge-zone badge-${r.zone}`}><span className="dot" />{r.zone}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Avg #{r.avgPosition} · {r.count} templates</div>
                </div>
              </div>
            ))}
          </div>
          {rankings.length > 3 && (() => {
            const fakeR = fakeRankings(Math.min(rankings.length - 3, 6));
            return (
              <div style={{ position: 'relative', marginTop: 8 }}>
                <div style={{ filter: 'blur(8px)', userSelect: 'none', pointerEvents: 'none' }} aria-hidden="true">
                  <div className="bento">
                    {fakeR.map((r, i) => (
                      <div key={i} className="col-4">
                        <div className="card2" style={{ padding: '16px 20px' }}>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>{r.niche}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Avg #{r.avgPosition}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                  <div style={{ background: 'linear-gradient(135deg, #6B5BFF, #4299e1)', color: '#fff', padding: '10px 24px', borderRadius: 12, fontSize: 13, fontWeight: 700, boxShadow: '0 8px 32px rgba(107,91,255,0.3)', textAlign: 'center' }}>
                    🔒 Subscribe to kelaskreator.com to unlock all insights
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Pro/Free Opportunities */}
      {proFreeOps.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Pro/Free Opportunities</div>
          <div className="bento stagger">
            {proFreeOps.slice(0, 3).map((op) => {
              const isFree = op.signal === 'create-free';
              return (
                <div key={op.niche} className="col-4">
                  <div className="card2" style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, maxWidth: '70%' }}>{op.niche}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 5, background: isFree ? 'rgba(52,211,153,0.15)' : 'rgba(139,92,246,0.15)', color: isFree ? 'var(--green)' : 'var(--purple)', textTransform: 'uppercase' }}>{isFree ? 'Free' : 'Pro'}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{op.count} templates · {op.proPct}% pro</div>
                  </div>
                </div>
              );
            })}
          </div>
          {proFreeOps.length > 3 && (() => {
            const fakePF = fakeProFreeOps(Math.min(proFreeOps.length - 3, 6));
            return (
              <div style={{ position: 'relative', marginTop: 8 }}>
                <div style={{ filter: 'blur(8px)', userSelect: 'none', pointerEvents: 'none' }} aria-hidden="true">
                  <div className="bento">
                    {fakePF.map((op, i) => {
                      const isFree = op.signal === 'create-free';
                      return (
                        <div key={i} className="col-4">
                          <div className="card2" style={{ padding: '16px 20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                              <span style={{ fontSize: 14, fontWeight: 700, maxWidth: '70%' }}>{op.niche}</span>
                              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 5, background: isFree ? 'rgba(52,211,153,0.15)' : 'rgba(139,92,246,0.15)', color: isFree ? 'var(--green)' : 'var(--purple)', textTransform: 'uppercase' }}>{isFree ? 'Free' : 'Pro'}</span>
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{op.count} templates · {op.proPct}% pro</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                  <div style={{ background: 'linear-gradient(135deg, #6B5BFF, #4299e1)', color: '#fff', padding: '10px 24px', borderRadius: 12, fontSize: 13, fontWeight: 700, boxShadow: '0 8px 32px rgba(107,91,255,0.3)', textAlign: 'center' }}>
                    🔒 Subscribe to kelaskreator.com to unlock all insights
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {creators.length === 0 && keywords.length === 0 && rankings.length === 0 && proFreeOps.length === 0 && (
        <PreviewBanner text="Advanced Insights available with full access — unlock creator dominance, keyword intelligence, and more." />
      )}
    </div>
  );
}
