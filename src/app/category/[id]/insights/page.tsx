import { getAnalysisBySlug, getCategoryTemplatesFull, buildAdvancedInsights, getDesignAnalysis, isIndonesianCategory } from '@/lib/category-data';
import { PreviewBanner } from '@/components/PreviewGate';
import {
  fakeNicheDominance, fakeCreatorStrategies, fakeBlueKeywords, fakeKeywordRanking,
  fakePositionBuckets, fakeFreeOppScores, fakeStyleSaturation, fakeStyleZone,
  fakeContrarianStyles, fakeStyleDiversity, fakeAssetRarity, fakeUnderservedAssets,
  BLUR_WRAPPER_STYLE, BLUR_OVERLAY_STYLE, BLUR_CTA_STYLE,
} from '@/lib/fakeData';

export const dynamic = 'force-dynamic';

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS — copied from AdvancedInsights.tsx for server-component use
   ═══════════════════════════════════════════════════════════════════════════ */

const SECTION_COLORS: Record<string, string> = {
  A: '#60a5fa', B: '#34d399', C: '#f59e0b', D: '#a78bfa',
  E: '#fb923c', F: '#2dd4bf', G: '#94a3b8', H: '#94a3b8',
};

const ZONE_COLORS: Record<string, string> = {
  blue: '#60a5fa', yellow: '#fbbf24', red: '#ef4444',
};

function ZoneDot({ zone }: { zone: string }) {
  return <span style={{ width: 8, height: 8, borderRadius: 4, background: ZONE_COLORS[zone] || '#94a3b8', display: 'inline-block', flexShrink: 0 }} />;
}

function SectionHeader({ letter, title, subtitle, color }: { letter: string; title: string; subtitle: string; color: string }) {
  return (
    <div style={{ marginBottom: 20, marginTop: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{
          width: 32, height: 32, borderRadius: 10, background: color + '20', color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 800, flexShrink: 0,
        }}>{letter}</span>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>{title}</h2>
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 6, marginLeft: 44, lineHeight: 1.5 }}>{subtitle}</p>
    </div>
  );
}

function MiniBar({ value, max, color, width = 120, fullWidth }: { value: number; max: number; color: string; width?: number; fullWidth?: boolean }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div style={{ width: fullWidth ? '100%' : width, height: 6, borderRadius: 3, background: 'var(--bg-hover)', overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', borderRadius: 3, background: color, transition: 'width 0.3s ease' }} />
    </div>
  );
}

function StrategyBadge({ strategy }: { strategy: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    'Pro-focused': { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b' },
    'Free-focused': { bg: 'rgba(96,165,250,0.15)', text: '#60a5fa' },
    'Mixed': { bg: 'rgba(148,163,184,0.15)', text: '#94a3b8' },
  };
  const c = colors[strategy] || colors.Mixed;
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
      background: c.bg, color: c.text, textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>{strategy}</span>
  );
}

function LockedSection({ title, reason }: { title: string; reason: string }) {
  return (
    <div className="card2" style={{
      padding: '32px 28px', textAlign: 'center', opacity: 0.6,
      border: '1px dashed var(--border)',
    }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{title}</div>
      <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6, maxWidth: 400, margin: '0 auto' }}>{reason}</p>
    </div>
  );
}

function BlurLock({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', marginTop: 8 }}>
      <div style={BLUR_WRAPPER_STYLE} aria-hidden="true">
        {children}
      </div>
      <div style={BLUR_OVERLAY_STYLE}>
        <a href="https://kelaskreator.com/" target="_blank" rel="noopener noreferrer" style={BLUR_CTA_STYLE}>
          🔒 Subscribe to unlock all insights
        </a>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export default async function InsightsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = await params;
  const analysis = await getAnalysisBySlug(slug);
  if (!analysis) return <PreviewBanner text="No data available." />;

  const fullTemplates = await getCategoryTemplatesFull(analysis.category_id);
  const designAnalysis = await getDesignAnalysis(analysis.category_id, analysis.month);
  const nicheTemplateMap = analysis.niche_template_map || {};
  const niches = analysis.niche_distribution || [];
  const data = buildAdvancedInsights(fullTemplates, nicheTemplateMap, niches, designAnalysis);
  const isID = isIndonesianCategory(analysis.category_name || '');

  // Pre-compute maxes for MiniBar
  const maxDominance = Math.max(...data.nicheDominance.map(d => d.dominancePct), 1);
  const maxCreatorCount = Math.max(...data.creatorStrategies.map(c => c.count), 1);
  const maxBlueKw = Math.max(...data.blueKeywords.map(k => k.count), 1);
  const maxKwRank = Math.max(...data.keywordRanking.map(k => k.count), 1);
  const maxBucket = Math.max(...data.positionBuckets.map(b => b.blue + b.yellow + b.red), 1);
  const maxFreeOpp = Math.max(...data.freeOppScores.map(f => f.score), 1);

  const hasNoData = data.nicheDominance.length === 0 && data.creatorStrategies.length === 0
    && data.blueKeywords.length === 0 && data.keywordRanking.length === 0
    && data.freeOppScores.length === 0;

  if (hasNoData) {
    return <PreviewBanner text="Advanced Insights available with full access — unlock creator dominance, keyword intelligence, and more." />;
  }

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Advanced Insights</h1>
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 0, lineHeight: 1.6 }}>
        Data-driven insights that reveal hidden opportunities, competitor blind spots, and untapped niches most creators miss.
      </p>

      {/* ══════════════════════════════════════════════════════════════════════
         SECTION A — CREATOR COMPETITIVE INTELLIGENCE
         ══════════════════════════════════════════════════════════════════════ */}
      <SectionHeader letter="A" title="Creator Competitive Intelligence" subtitle="Who dominates which niches and how they monetize" color={SECTION_COLORS.A} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>
        {/* A1: Niche Dominance — top 3, rest locked */}
        <div className="card2" style={{ padding: 20 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Niche Dominance Score</div>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 14px', lineHeight: 1.5 }}>
            {isID ? 'Lihat niche mana yang dimonopoli satu kreator vs. terbuka untuk pendatang baru.' : 'See which niches are monopolized by one creator vs. open for newcomers.'}
          </p>
          <div style={{ maxHeight: 420, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '6px 0', fontWeight: 600, color: 'var(--text-dim)', fontSize: 11 }}>Niche</th>
                  <th style={{ textAlign: 'left', padding: '6px 0', fontWeight: 600, color: 'var(--text-dim)', fontSize: 11 }}>Top Creator</th>
                  <th style={{ textAlign: 'right', padding: '6px 0', fontWeight: 600, color: 'var(--text-dim)', fontSize: 11 }}>Share</th>
                  <th style={{ textAlign: 'right', padding: '6px 0', fontWeight: 600, color: 'var(--text-dim)', fontSize: 11 }}>Creators</th>
                </tr>
              </thead>
              <tbody>
                {data.nicheDominance.slice(0, 3).map((d, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--bg-hover)' }}>
                    <td style={{ padding: '8px 8px 8px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <ZoneDot zone={d.zone} />
                        <span style={{ fontWeight: 600 }}>{d.niche}</span>
                      </div>
                    </td>
                    <td style={{ padding: '8px 0', color: 'var(--text-muted)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.topCreator}</td>
                    <td style={{ padding: '8px 0', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                        <MiniBar value={d.dominancePct} max={maxDominance} color={d.dominancePct >= 40 ? '#ef4444' : d.dominancePct >= 25 ? '#f59e0b' : '#34d399'} width={60} />
                        <span style={{ fontWeight: 700, minWidth: 36, textAlign: 'right', color: d.dominancePct >= 40 ? '#ef4444' : 'var(--text)' }}>{d.dominancePct}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: 'var(--text-dim)' }}>{d.totalCreators}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.nicheDominance.length > 3 && (
            <BlurLock>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <tbody>
                  {fakeNicheDominance(6).map((d, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--bg-hover)' }}>
                      <td style={{ padding: '8px 8px 8px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <ZoneDot zone={d.zone} />
                          <span style={{ fontWeight: 600 }}>{d.niche}</span>
                        </div>
                      </td>
                      <td style={{ padding: '8px 0', color: 'var(--text-muted)' }}>{d.topCreator}</td>
                      <td style={{ padding: '8px 0', textAlign: 'right' }}>
                        <span style={{ fontWeight: 700 }}>{d.dominancePct}%</span>
                      </td>
                      <td style={{ padding: '8px 0', textAlign: 'right', color: 'var(--text-dim)' }}>{d.totalCreators}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </BlurLock>
          )}
          <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.5 }}>
            🔴 40%+ = one creator owns the niche &nbsp; 🟡 25-39% = moderate dominance &nbsp; 🟢 &lt;25% = fragmented (easier entry)
          </div>
        </div>

        {/* A2: Creator Monetization Strategy — top 3, rest locked */}
        <div className="card2" style={{ padding: 20 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Creator Monetization Strategy</div>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 14px', lineHeight: 1.5 }}>
            {isID ? 'Strategi monetisasi kreator teratas — pelajari apakah mereka fokus Pro, Free, atau campuran.' : 'How top creators split between Pro and Free — learn whether they go premium, free, or mixed.'}
          </p>
          <div style={{ maxHeight: 420, overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.creatorStrategies.slice(0, 3).map((c, i) => (
                <div key={i} style={{
                  padding: '10px 12px', borderRadius: 10,
                  background: i % 2 === 0 ? 'var(--bg-hover)' : 'transparent',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <StrategyBadge strategy={c.strategy} />
                      <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{c.count} templates</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--bg-card)', overflow: 'hidden', display: 'flex' }}>
                      <div style={{ width: `${c.proPct}%`, height: '100%', background: '#f59e0b' }} />
                      <div style={{ width: `${100 - c.proPct}%`, height: '100%', background: '#60a5fa' }} />
                    </div>
                    <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 600, minWidth: 32 }}>P {c.proPct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {data.creatorStrategies.length > 3 && (
            <BlurLock>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {fakeCreatorStrategies(6).map((c, i) => (
                  <div key={i} style={{ padding: '10px 12px', borderRadius: 10, background: i % 2 === 0 ? 'var(--bg-hover)' : 'transparent' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{c.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <StrategyBadge strategy={c.strategy} />
                        <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{c.count} templates</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--bg-card)', overflow: 'hidden', display: 'flex' }}>
                        <div style={{ width: `${c.proPct}%`, height: '100%', background: '#f59e0b' }} />
                        <div style={{ width: `${100 - c.proPct}%`, height: '100%', background: '#60a5fa' }} />
                      </div>
                      <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 600, minWidth: 32 }}>P {c.proPct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </BlurLock>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
         SECTION B — KEYWORD INTELLIGENCE
         ══════════════════════════════════════════════════════════════════════ */}
      <SectionHeader letter="B" title="Keyword Intelligence" subtitle="Which keywords signal untapped opportunities and rank higher" color={SECTION_COLORS.B} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>
        {/* B1: Blue Ocean Exclusive Keywords — top 3, rest locked */}
        <div className="card2" style={{ padding: 20 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Blue Ocean Exclusive Keywords</div>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 14, lineHeight: 1.5 }}>
            Keywords found ONLY in blue ocean niches — safe targets with no red ocean competition.
          </p>
          {data.blueKeywords.length > 0 ? (
            <>
              <div style={{ maxHeight: 340, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {data.blueKeywords.slice(0, 3).map((k, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                    borderRadius: 8, background: i % 2 === 0 ? 'rgba(96,165,250,0.06)' : 'transparent',
                  }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                      background: 'rgba(96,165,250,0.15)', color: '#60a5fa',
                    }}>BLUE</span>
                    <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{k.keyword}</span>
                    <MiniBar value={k.count} max={maxBlueKw} color="#60a5fa" width={60} />
                    <span style={{ fontSize: 12, color: 'var(--text-dim)', minWidth: 20, textAlign: 'right' }}>{k.count}</span>
                  </div>
                ))}
              </div>
              {data.blueKeywords.length > 3 && (
                <BlurLock>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {fakeBlueKeywords(6).map((k, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                        borderRadius: 8, background: i % 2 === 0 ? 'rgba(96,165,250,0.06)' : 'transparent',
                      }}>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                          background: 'rgba(96,165,250,0.15)', color: '#60a5fa',
                        }}>BLUE</span>
                        <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{k.keyword}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-dim)', minWidth: 20, textAlign: 'right' }}>{k.count}</span>
                      </div>
                    ))}
                  </div>
                </BlurLock>
              )}
            </>
          ) : (
            <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>No blue-exclusive keywords found — most keywords appear across zones.</p>
          )}
        </div>

        {/* B2: Keyword Ranking Power — top 3, rest locked */}
        <div className="card2" style={{ padding: 20 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Keyword Ranking Power</div>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 14, lineHeight: 1.5 }}>
            Keywords whose templates rank highest (lowest avg position = better visibility).
          </p>
          <div style={{ maxHeight: 340, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '6px 0', fontWeight: 600, color: 'var(--text-dim)', fontSize: 11 }}>Keyword</th>
                  <th style={{ textAlign: 'right', padding: '6px 0', fontWeight: 600, color: 'var(--text-dim)', fontSize: 11 }}>Avg Position</th>
                  <th style={{ textAlign: 'right', padding: '6px 0', fontWeight: 600, color: 'var(--text-dim)', fontSize: 11 }}>Templates</th>
                </tr>
              </thead>
              <tbody>
                {data.keywordRanking.slice(0, 3).map((k, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--bg-hover)' }}>
                    <td style={{ padding: '7px 8px 7px 0', fontWeight: 600 }}>{k.keyword}</td>
                    <td style={{ padding: '7px 0', textAlign: 'right' }}>
                      <span style={{
                        fontWeight: 700,
                        color: k.avgPosition < 150 ? '#34d399' : k.avgPosition < 300 ? '#fbbf24' : '#ef4444',
                      }}>#{k.avgPosition}</span>
                    </td>
                    <td style={{ padding: '7px 0', textAlign: 'right', color: 'var(--text-dim)' }}>{k.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.keywordRanking.length > 3 && (
            <BlurLock>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <tbody>
                  {fakeKeywordRanking(6).map((k, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--bg-hover)' }}>
                      <td style={{ padding: '7px 8px 7px 0', fontWeight: 600 }}>{k.keyword}</td>
                      <td style={{ padding: '7px 0', textAlign: 'right' }}>
                        <span style={{ fontWeight: 700, color: '#fbbf24' }}>#{k.avgPosition}</span>
                      </td>
                      <td style={{ padding: '7px 0', textAlign: 'right', color: 'var(--text-dim)' }}>{k.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </BlurLock>
          )}
        </div>
      </div>

      {/* B3: Keyword Length Distribution — show ALL, no lock */}
      <div className="card2" style={{ padding: 20, marginTop: 20 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Keyword Length Distribution</div>
        <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 14px', lineHeight: 1.5 }}>
          {isID ? 'Keyword pendek = persaingan luas. Long-tail (4+ kata) = peluang spesifik yang lebih mudah dimenangkan.' : 'Short keywords = broad competition. Long-tail (4+ words) = specific niches easier to win.'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {data.keywordLength.map((k, i) => {
            const total = k.total || 1;
            return (
              <div key={i} style={{ padding: '16px 18px', borderRadius: 12, background: 'var(--bg-hover)' }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>{k.type}</div>
                <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 10, color: SECTION_COLORS.B }}>{k.total}</div>
                <div style={{ display: 'flex', borderRadius: 4, overflow: 'hidden', height: 8, marginBottom: 8 }}>
                  <div style={{ width: `${(k.blue / total) * 100}%`, background: '#60a5fa', minWidth: k.blue > 0 ? 3 : 0 }} />
                  <div style={{ width: `${(k.red / total) * 100}%`, background: '#ef4444', minWidth: k.red > 0 ? 3 : 0 }} />
                  <div style={{ width: `${((total - k.blue - k.red) / total) * 100}%`, background: '#fbbf24', minWidth: (total - k.blue - k.red) > 0 ? 3 : 0 }} />
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-dim)' }}>
                  <span>🔵 {k.blue}</span>
                  <span>🔴 {k.red}</span>
                  <span>🟡 {total - k.blue - k.red}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
         SECTION C — POSITION & RANKING INSIGHTS
         ══════════════════════════════════════════════════════════════════════ */}
      <SectionHeader letter="C" title="Position & Ranking Insights" subtitle="How templates are distributed by position and what positions to target" color={SECTION_COLORS.C} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>
        {/* C1: Position Distribution by Zone — top 3, rest locked */}
        <div className="card2" style={{ padding: 20 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Position Distribution by Zone</div>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 14px', lineHeight: 1.5 }}>
            {isID ? 'Di mana template muncul di hasil pencarian Canva — posisi lebih rendah = visibilitas lebih tinggi.' : 'Where templates land in Canva search results — lower position = higher visibility.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.positionBuckets.slice(0, 3).map((b, i) => {
              const total = b.blue + b.yellow + b.red;
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-muted)', minWidth: 70 }}>{b.range}</span>
                    <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--text-dim)' }}>
                      {b.blue > 0 && <span style={{ color: '#60a5fa' }}>● {b.blue}</span>}
                      {b.yellow > 0 && <span style={{ color: '#fbbf24' }}>● {b.yellow}</span>}
                      {b.red > 0 && <span style={{ color: '#ef4444' }}>● {b.red}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', background: 'var(--bg-hover)' }}>
                    <div style={{ width: `${(b.blue / maxBucket) * 100}%`, background: '#60a5fa', transition: 'width 0.3s' }} />
                    <div style={{ width: `${(b.yellow / maxBucket) * 100}%`, background: '#fbbf24', transition: 'width 0.3s' }} />
                    <div style={{ width: `${(b.red / maxBucket) * 100}%`, background: '#ef4444', transition: 'width 0.3s' }} />
                  </div>
                </div>
              );
            })}
          </div>
          {data.positionBuckets.length > 3 && (
            <BlurLock>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {fakePositionBuckets(6).map((b, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-muted)', minWidth: 70 }}>{b.range}</span>
                      <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--text-dim)' }}>
                        <span style={{ color: '#60a5fa' }}>● {b.blue}</span>
                        <span style={{ color: '#fbbf24' }}>● {b.yellow}</span>
                        <span style={{ color: '#ef4444' }}>● {b.red}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', background: 'var(--bg-hover)' }}>
                      <div style={{ width: `${b.blue * 3}%`, background: '#60a5fa' }} />
                      <div style={{ width: `${b.yellow * 3}%`, background: '#fbbf24' }} />
                      <div style={{ width: `${b.red * 3}%`, background: '#ef4444' }} />
                    </div>
                  </div>
                ))}
              </div>
            </BlurLock>
          )}
        </div>

        {/* C2 + C3: Pro/Free Position Bias + Sweet Spot — both show ALL, no lock */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card2" style={{ padding: 20 }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Pro vs Free Position Bias</div>
            <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 12px', lineHeight: 1.5 }}>
              {isID ? 'Apakah Canva memprioritaskan template Pro atau Free di posisi atas?' : 'Does Canva prioritize Pro or Free templates in top positions?'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: '#f59e0b' }}>Pro Templates</span>
                  <span style={{ fontWeight: 700 }}>Avg #{data.proFreePosition.proAvg}</span>
                </div>
                <MiniBar value={500 - data.proFreePosition.proAvg} max={500} color="#f59e0b" fullWidth />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: '#60a5fa' }}>Free Templates</span>
                  <span style={{ fontWeight: 700 }}>Avg #{data.proFreePosition.freeAvg}</span>
                </div>
                <MiniBar value={500 - data.proFreePosition.freeAvg} max={500} color="#60a5fa" fullWidth />
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4, lineHeight: 1.5 }}>
                {data.proFreePosition.proAvg < data.proFreePosition.freeAvg
                  ? '⚡ Pro templates rank higher on average — consider Pro for visibility.'
                  : '⚡ Free templates rank higher on average — great news for free creators!'}
              </p>
            </div>
          </div>

          <div className="card2" style={{ padding: 20 }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Blue Ocean Sweet Spot</div>
            <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 10px', lineHeight: 1.5 }}>
              {isID ? 'Rentang posisi pencarian di mana template blue ocean paling banyak muncul.' : 'The search position range where blue ocean templates cluster most.'}
            </p>
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: SECTION_COLORS.C }}>
                #{data.sweetSpot.start}–{data.sweetSpot.end}
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 8, lineHeight: 1.5 }}>
                {data.sweetSpot.blueCount} blue ocean templates ({data.sweetSpot.bluePct}%) cluster in this position range.
                Target this zone for optimal visibility.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
         SECTION D — PRO/FREE MARKET DYNAMICS
         ══════════════════════════════════════════════════════════════════════ */}
      <SectionHeader letter="D" title="Pro/Free Market Dynamics" subtitle="Combined opportunity score: high demand + high Pro% + low count = best free template opportunity" color={SECTION_COLORS.D} />

      <div className="card2" style={{ padding: 20 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Free Template Opportunity Score</div>
        <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 14px', lineHeight: 1.5 }}>
          {isID ? 'Skor tinggi = permintaan tinggi tapi kompetisi free rendah — peluang terbaik untuk template gratis.' : 'Higher score = high demand but low free competition — best opportunity for free templates.'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, maxHeight: 400, overflowY: 'auto' }}>
          {data.freeOppScores.slice(0, 4).map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
              borderRadius: 10, background: 'var(--bg-hover)',
            }}>
              <span style={{
                fontSize: 18, fontWeight: 800, color: SECTION_COLORS.D, minWidth: 40,
              }}>{f.score}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <ZoneDot zone={f.zone} />
                  <span style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.niche}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                  Pro {f.proPct}% · {f.count} templates
                </div>
              </div>
              <MiniBar value={f.score} max={maxFreeOpp} color={SECTION_COLORS.D} width={50} />
            </div>
          ))}
        </div>
        {data.freeOppScores.length > 4 && (
          <BlurLock>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {fakeFreeOppScores(6).map((f, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                  borderRadius: 10, background: 'var(--bg-hover)',
                }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: SECTION_COLORS.D, minWidth: 40 }}>{f.score}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <ZoneDot zone={f.zone} />
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{f.niche}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>Pro {f.proPct}% · {f.count} templates</div>
                  </div>
                </div>
              ))}
            </div>
          </BlurLock>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
         SECTION E — DESIGN STYLE INSIGHTS
         ══════════════════════════════════════════════════════════════════════ */}
      <SectionHeader letter="E" title="Design Style Insights" subtitle="Style saturation, zone correlation, and contrarian opportunities" color={SECTION_COLORS.E} />

      {data.hasDesignData ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>
            {/* E1: Style Saturation Index — top 3, rest locked */}
            <div className="card2" style={{ padding: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>Style Saturation Index</div>
              <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 14, lineHeight: 1.5 }}>
                Low saturation = distinctive. High saturation = generic / overused.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {data.styleSaturation.slice(0, 3).map((s, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600 }}>{s.style}</span>
                      <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>{s.nicheCount}/{s.totalNiches} niches ({s.pct}%)</span>
                    </div>
                    <MiniBar value={s.pct} max={100} color={s.pct >= 50 ? '#ef4444' : s.pct >= 25 ? '#fbbf24' : '#34d399'} fullWidth />
                  </div>
                ))}
              </div>
              {data.styleSaturation.length > 3 && (
                <BlurLock>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {fakeStyleSaturation(6).map((s, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                          <span style={{ fontWeight: 600 }}>{s.style}</span>
                          <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>{s.nicheCount}/{s.totalNiches} niches ({s.pct}%)</span>
                        </div>
                        <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'var(--bg-hover)', overflow: 'hidden' }}>
                          <div style={{ width: `${s.pct}%`, height: '100%', borderRadius: 3, background: '#fbbf24' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </BlurLock>
              )}
            </div>

            {/* E2: Style x Zone Distribution — top 3, rest locked */}
            <div className="card2" style={{ padding: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Style × Zone Distribution</div>
              <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 14px', lineHeight: 1.5 }}>
                {isID ? 'Gaya desain mana yang dominan di zona biru vs merah — temukan gaya yang belum dieksploitasi.' : 'Which design styles dominate blue vs red zones — find unexploited style-zone combinations.'}
              </p>
              <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <th style={{ textAlign: 'left', padding: '6px 0', fontWeight: 600, color: 'var(--text-dim)', fontSize: 11 }}>Style</th>
                      <th style={{ textAlign: 'center', padding: '6px 0', fontWeight: 600, color: '#60a5fa', fontSize: 11 }}>Blue</th>
                      <th style={{ textAlign: 'center', padding: '6px 0', fontWeight: 600, color: '#fbbf24', fontSize: 11 }}>Yellow</th>
                      <th style={{ textAlign: 'center', padding: '6px 0', fontWeight: 600, color: '#ef4444', fontSize: 11 }}>Red</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.styleZone.slice(0, 3).map((s, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--bg-hover)' }}>
                        <td style={{ padding: '7px 8px 7px 0', fontWeight: 600, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.style}</td>
                        <td style={{ padding: '7px 0', textAlign: 'center', fontWeight: 700, color: s.blue > 0 ? '#60a5fa' : 'var(--bg-hover)' }}>{s.blue || '—'}</td>
                        <td style={{ padding: '7px 0', textAlign: 'center', fontWeight: 700, color: s.yellow > 0 ? '#fbbf24' : 'var(--bg-hover)' }}>{s.yellow || '—'}</td>
                        <td style={{ padding: '7px 0', textAlign: 'center', fontWeight: 700, color: s.red > 0 ? '#ef4444' : 'var(--bg-hover)' }}>{s.red || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.styleZone.length > 3 && (
                <BlurLock>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <tbody>
                      {fakeStyleZone(6).map((s, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--bg-hover)' }}>
                          <td style={{ padding: '7px 8px 7px 0', fontWeight: 600 }}>{s.style}</td>
                          <td style={{ padding: '7px 0', textAlign: 'center', fontWeight: 700, color: '#60a5fa' }}>{s.blue || '—'}</td>
                          <td style={{ padding: '7px 0', textAlign: 'center', fontWeight: 700, color: '#fbbf24' }}>{s.yellow || '—'}</td>
                          <td style={{ padding: '7px 0', textAlign: 'center', fontWeight: 700, color: '#ef4444' }}>{s.red || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </BlurLock>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 20, marginTop: 20, alignItems: 'start' }}>
            {/* E3: Contrarian Style Opportunities — top 3, rest locked */}
            <div className="card2" style={{ padding: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>Contrarian Style Opportunities</div>
              <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 14, lineHeight: 1.5 }}>
                Niches using a different dominant style from the category average — potential differentiation wins.
              </p>
              {data.contrarianStyles.length > 0 ? (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {data.contrarianStyles.slice(0, 3).map((c, i) => (
                      <div key={i} style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-hover)' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{c.niche}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ color: '#fb923c', fontWeight: 600 }}>{c.nicheStyle}</span>
                          <span style={{ color: 'var(--text-dim)' }}>vs category dominant</span>
                          <span style={{ fontWeight: 600 }}>{c.categoryDominant}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {data.contrarianStyles.length > 3 && (
                    <BlurLock>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {fakeContrarianStyles(6).map((c, i) => (
                          <div key={i} style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-hover)' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{c.niche}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ color: '#fb923c', fontWeight: 600 }}>{c.nicheStyle}</span>
                              <span style={{ color: 'var(--text-dim)' }}>vs category dominant</span>
                              <span style={{ fontWeight: 600 }}>{c.categoryDominant}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </BlurLock>
                  )}
                </>
              ) : (
                <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>All niches follow the category&apos;s dominant style.</p>
              )}
            </div>

            {/* E4: Style Diversity per Niche — top 3, rest locked */}
            <div className="card2" style={{ padding: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>Style Diversity per Niche</div>
              <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 14, lineHeight: 1.5 }}>
                Low diversity = room to differentiate with a fresh style.
              </p>
              <div style={{ maxHeight: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {data.styleComplexity.slice(0, 3).map((s, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                    borderRadius: 8, background: i % 2 === 0 ? 'var(--bg-hover)' : 'transparent',
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 600, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.niche}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                      background: s.diversity < 30 ? 'rgba(52,211,153,0.15)' : s.diversity < 60 ? 'rgba(251,191,36,0.15)' : 'rgba(239,68,68,0.15)',
                      color: s.diversity < 30 ? '#34d399' : s.diversity < 60 ? '#fbbf24' : '#ef4444',
                    }}>
                      {s.styleCount} styles · {s.diversity}% diverse
                    </span>
                  </div>
                ))}
              </div>
              {data.styleComplexity.length > 3 && (
                <BlurLock>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {fakeStyleDiversity(6).map((s, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                        borderRadius: 8, background: i % 2 === 0 ? 'var(--bg-hover)' : 'transparent',
                      }}>
                        <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{s.niche}</span>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                          background: 'rgba(251,191,36,0.15)', color: '#fbbf24',
                        }}>
                          {s.styleCount} styles · {s.diversity}% diverse
                        </span>
                      </div>
                    ))}
                  </div>
                </BlurLock>
              )}
            </div>
          </div>
        </>
      ) : (
        <LockedSection title="Design Data Not Available" reason="Run the vision analysis (unified-analyze.js) to unlock design style insights." />
      )}

      {/* ══════════════════════════════════════════════════════════════════════
         SECTION F — ASSET & VISUAL ELEMENT INSIGHTS
         ══════════════════════════════════════════════════════════════════════ */}
      <SectionHeader letter="F" title="Asset & Visual Element Insights" subtitle="Rare assets, underserved categories, and creative opportunities" color={SECTION_COLORS.F} />

      {data.hasDesignData ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>
          {/* F1: Rare Signature Assets — top 3, rest locked */}
          <div className="card2" style={{ padding: 20 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Rare Signature Assets</div>
            <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 14, lineHeight: 1.5 }}>
              Assets appearing in 1-2 niches with high prominence — signature elements that define a niche look.
            </p>
            {data.assetRarity.length > 0 ? (
              <>
                <div style={{ maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {data.assetRarity.slice(0, 3).map((a, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                      borderRadius: 8, background: 'var(--bg-hover)',
                    }}>
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 6,
                        background: 'rgba(45,212,191,0.15)', color: '#2dd4bf',
                      }}>{a.category}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{a.name}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{a.nicheCount} niche{a.nicheCount > 1 ? 's' : ''} · {a.heroCount} hero</span>
                    </div>
                  ))}
                </div>
                {data.assetRarity.length > 3 && (
                  <BlurLock>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {fakeAssetRarity(6).map((a, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                          borderRadius: 8, background: 'var(--bg-hover)',
                        }}>
                          <span style={{
                            fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 6,
                            background: 'rgba(45,212,191,0.15)', color: '#2dd4bf',
                          }}>{a.category}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{a.name}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{a.nicheCount} niche{a.nicheCount > 1 ? 's' : ''} · {a.heroCount} hero</span>
                        </div>
                      ))}
                    </div>
                  </BlurLock>
                )}
              </>
            ) : (
              <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>No rare signature assets detected.</p>
            )}
          </div>

          {/* F2: Underserved Asset Categories — top 3, rest locked */}
          <div className="card2" style={{ padding: 20 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Underserved Asset Categories</div>
            <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 14, lineHeight: 1.5 }}>
              Asset categories with low presence in blue ocean niches — room to differentiate.
            </p>
            {data.underservedAssets.length > 0 ? (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {data.underservedAssets.slice(0, 3).map((a, i) => (
                    <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--bg-hover)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>{a.category}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{a.totalCount} total</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'var(--bg-card)', overflow: 'hidden' }}>
                          <div style={{
                            width: `${a.bluePct}%`, height: '100%', borderRadius: 4,
                            background: a.bluePct < 20 ? '#ef4444' : a.bluePct < 40 ? '#fbbf24' : '#34d399',
                          }} />
                        </div>
                        <span style={{
                          fontSize: 12, fontWeight: 700,
                          color: a.bluePct < 20 ? '#ef4444' : a.bluePct < 40 ? '#fbbf24' : '#34d399',
                        }}>{a.bluePct}% blue</span>
                      </div>
                    </div>
                  ))}
                </div>
                {data.underservedAssets.length > 3 && (
                  <BlurLock>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {fakeUnderservedAssets(6).map((a, i) => (
                        <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--bg-hover)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 14, fontWeight: 700 }}>{a.category}</span>
                            <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{a.totalCount} total</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'var(--bg-card)', overflow: 'hidden' }}>
                              <div style={{
                                width: `${a.bluePct}%`, height: '100%', borderRadius: 4,
                                background: a.bluePct < 20 ? '#ef4444' : a.bluePct < 40 ? '#fbbf24' : '#34d399',
                              }} />
                            </div>
                            <span style={{
                              fontSize: 12, fontWeight: 700,
                              color: a.bluePct < 20 ? '#ef4444' : a.bluePct < 40 ? '#fbbf24' : '#34d399',
                            }}>{a.bluePct}% blue</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </BlurLock>
                )}
              </>
            ) : (
              <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>No underserved asset categories detected.</p>
            )}
          </div>
        </div>
      ) : (
        <LockedSection title="Asset Data Not Available" reason="Run the vision analysis to unlock asset insights." />
      )}

      {/* ══════════════════════════════════════════════════════════════════════
         SECTION G — NICHE LIFECYCLE & TIMING (LOCKED)
         ══════════════════════════════════════════════════════════════════════ */}
      <SectionHeader letter="G" title="Niche Lifecycle & Timing Signals" subtitle="Zone migration, velocity, seasonality, and emerging niche detection" color={SECTION_COLORS.G} />
      <LockedSection
        title="Requires 2+ Months of Data"
        reason="Zone Migration Tracker, Niche Velocity, Seasonality Detection, and Emerging Niche Detection will unlock once we have month-over-month comparison data. Run the scraper and analyzer for at least 2 consecutive months."
      />

      {/* ══════════════════════════════════════════════════════════════════════
         SECTION H — CROSS-CATEGORY INSIGHTS (LOCKED)
         ══════════════════════════════════════════════════════════════════════ */}
      <SectionHeader letter="H" title="Cross-Category Insights" subtitle="Niche overlap, creator cross-presence, and style portability across categories" color={SECTION_COLORS.H} />
      <LockedSection
        title="Requires 2+ Categories"
        reason="Niche Name Overlap, Creator Cross-Category Presence, and Style Consistency will unlock once we have analysis data from multiple Canva categories (e.g., Instagram Posts + Presentations)."
      />

      {/* Bottom spacer */}
      <div style={{ height: 60 }} />
    </div>
  );
}
