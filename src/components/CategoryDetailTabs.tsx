'use client';

import React from 'react';
import BODashIcon from './BODashIcon';
import type { Analysis, DesignAnalysis, NicheItem, Outlier, Recommendation, AssetPack } from '@/lib/types';
import DesignTrends, { type PatternDrawerData } from './DesignTrends';
import AssetOpportunities from './AssetOpportunities';
import AdvancedInsights, { type AdvancedInsightsData } from './AdvancedInsights';

const DETAIL_TABS = [
  { key: 'overview', label: 'Overview', icon: 'dashboard' },
  { key: 'niches', label: 'Niches', icon: 'folder' },
  { key: 'outliers', label: 'Outliers', icon: 'sparkles' },
  { key: 'recs', label: 'Recommendations', icon: 'lightbulb' },
  { key: 'trends', label: 'Design Trends', icon: 'palette' },
  { key: 'assets', label: 'Asset Opportunities', icon: 'shapes' },
  { key: 'advanced', label: 'Advanced', icon: 'sparkles' },
];

const THUMB_GRADIENTS = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #a18cd1, #fbc2eb)',
  'linear-gradient(135deg, #fccb90, #d57eeb)',
  'linear-gradient(135deg, #e0c3fc, #8ec5fc)',
];

export interface TemplateInfo {
  thumbnail: string;
  url: string;
  is_pro?: boolean;
}

export interface CategoryTemplate {
  title: string;
  thumbnail: string;
  url: string;
  is_pro: boolean;
  creator?: string;
}

interface CreatorStat {
  name: string;
  count: number;
  pro: number;
  free: number;
  avgPosition: number;
  topNiches: string[];
}

interface KeywordStat {
  keyword: string;
  count: number;
  blueCount: number;
  redCount: number;
  zone: 'blue' | 'red' | 'mixed';
}

interface ProFreeOpportunity {
  niche: string;
  zone: string;
  proPct: number;
  count: number;
  signal: 'create-free' | 'create-pro';
  reason: string;
}

interface NicheRanking {
  niche: string;
  zone: string;
  avgPosition: number;
  count: number;
  signal: 'rising' | 'stable' | 'low';
}

interface CategoryInsights {
  topCreators: CreatorStat[];
  topKeywords: KeywordStat[];
  proFreeOpportunities: ProFreeOpportunity[];
  nicheRankings: NicheRanking[];
  nicheCreators: Record<string, CreatorStat[]>;
}

interface Props {
  analysis: Analysis;
  designAnalysis: DesignAnalysis | null;
  templateMap?: Record<string, TemplateInfo>;
  categoryTemplates?: CategoryTemplate[];
  nicheTemplateMap?: Record<string, string[]>;
  categoryInsights?: CategoryInsights;
  advancedInsights?: AdvancedInsightsData;
}

/* ── Tooltip ── */
function Tooltip({ children, text }: { children: React.ReactNode; text: string }) {
  const [show, setShow] = React.useState(false);
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span style={{
          position: 'absolute', bottom: '120%', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--bg-card, #1a1a2e)', color: 'var(--text, #e0e0e0)',
          border: '1px solid var(--border)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          padding: '10px 14px', borderRadius: 10, fontSize: 12, lineHeight: 1.5,
          whiteSpace: 'pre-line', width: 260, zIndex: 999, pointerEvents: 'none',
          fontWeight: 500,
        }}>
          {text}
        </span>
      )}
    </span>
  );
}

/* ── Donut SVG ── */
function Donut({ pct, color }: { pct: number; color: string }) {
  const r = 52, c = 2 * Math.PI * r;
  const off = c - (pct / 100) * c;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={r} fill="none" stroke="var(--bg-hover)" strokeWidth="12" />
      <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 70 70)"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
      <text x="70" y="72" textAnchor="middle" dominantBaseline="middle"
        style={{ fontSize: 30, fontWeight: 800, fill: 'var(--text)', letterSpacing: '-0.02em' }}>
        {pct}<tspan style={{ fontSize: 14, fill: 'var(--text-muted)' }}>%</tspan>
      </text>
    </svg>
  );
}

/* ── OvMetric ── */
function OvMetric({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{ fontSize: 12 }}>
      <span style={{ fontWeight: 700, color }}>{value}</span>{' '}
      <span style={{ color: 'var(--text-dim)' }}>{label}</span>
    </div>
  );
}

/* ── Template Thumbnail with real image, title label, Canva link, and Pro badge ── */
function TemplateThumbnail({ title, canvaUrl, thumbnailUrl, index, size = 72, showTitle = false, isPro = false }: {
  title: string; canvaUrl?: string; thumbnailUrl?: string; index: number; size?: number; showTitle?: boolean; isPro?: boolean;
}) {
  const grad = THUMB_GRADIENTS[index % THUMB_GRADIENTS.length];
  const inner = (
    <div style={{ width: size, flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: 8,
        background: thumbnailUrl ? '#eee' : grad,
        position: 'relative', overflow: 'hidden',
      }}>
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '14px 6px 5px', fontSize: 9, fontWeight: 600,
            color: '#fff', lineHeight: 1.2,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.55))',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {title}
          </div>
        )}
        {isPro && (
          <span style={{
            position: 'absolute', top: 3, right: 3,
            fontSize: 8, fontWeight: 800, padding: '1.5px 4px', borderRadius: 3,
            background: 'rgba(255,170,0,0.92)', color: '#fff',
            letterSpacing: '0.04em', lineHeight: 1.3,
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}>
            👑 PRO
          </span>
        )}
      </div>
      {showTitle && (
        <div style={{
          marginTop: 4, fontSize: 10, fontWeight: 500, color: 'var(--text-dim)',
          lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
        }}>
          {title}
        </div>
      )}
    </div>
  );
  if (canvaUrl) return <a href={canvaUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>{inner}</a>;
  return inner;
}

// Indonesian category slugs
const ID_SLUGS = new Set([
  'kiriman-instagram', 'instagram-posts', 'poster', 'undangan', 'sertifikat',
  'presentasi', 'logo', 'brosur', 'kartu-nama', 'resume', 'pamflet',
  'infografis', 'menu', 'banner', 'spanduk', 'kalender', 'stiker',
  'label', 'jadwal', 'daftar-harga', 'kwitansi', 'faktur',
]);
function isIndonesianCategory(name: string) {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  if (ID_SLUGS.has(slug)) return true;
  // Heuristic: Indonesian slugs often contain Indonesian words
  return /kiriman|undangan|sertifikat|presentasi|brosur|pamflet|infografis|daftar|kwitansi|faktur|jadwal/.test(slug);
}

export default function CategoryDetailTabs({ analysis, designAnalysis, templateMap = {}, categoryTemplates = [], nicheTemplateMap = {}, categoryInsights, advancedInsights }: Props) {
  const [tab, setTab] = React.useState('overview');
  const [drawer, setDrawer] = React.useState<{ kind: string; data: unknown } | null>(null);

  const isID = isIndonesianCategory(analysis.category_name || '');
  const niches = analysis.niche_distribution || [];
  const outliers = analysis.outliers || [];
  const recs = analysis.recommendations || [];
  const insights = analysis.key_insights || [];

  return (
    <>
      {/* Tab navigation */}
      <div style={{ marginTop: 24, marginBottom: 24, overflowX: 'auto' }}>
        <div className="tabs2" style={{ display: 'inline-flex' }}>
          {DETAIL_TABS.map(t => (
            <button
              key={t.key}
              className={`tab2 ${tab === t.key ? 'active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              <BODashIcon name={t.icon} size={14} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div key={tab} className="rise">
        {tab === 'overview' && (
          <OverviewPanel
            analysis={analysis}
            niches={niches}
            insights={insights}
            recs={recs}
            onTabChange={setTab}
            categoryInsights={categoryInsights}
            isID={isID}
            onOpenCreator={(name) => setDrawer({ kind: 'creator', data: name })}
            onOpenRanking={(r) => setDrawer({ kind: 'ranking', data: r })}
            onOpenProFree={(op) => setDrawer({ kind: 'proFree', data: op })}
          />
        )}
        {tab === 'niches' && <NichesPanel niches={niches} categoryTemplates={categoryTemplates} onOpenNiche={(n) => setDrawer({ kind: 'niche', data: n })} />}
        {tab === 'outliers' && <OutliersPanel outliers={outliers} templateMap={templateMap} nicheTemplateMap={nicheTemplateMap} categoryTemplates={categoryTemplates} isID={isID} />}
        {tab === 'recs' && <RecsPanel recs={recs} templateMap={templateMap} onOpenRec={(r) => setDrawer({ kind: 'rec', data: r })} />}
        {tab === 'trends' && designAnalysis && <DesignTrends data={designAnalysis} onOpenPattern={(p) => setDrawer({ kind: 'stylePattern', data: p })} />}
        {tab === 'trends' && !designAnalysis && <EmptyState text="No design trend data available for this category." />}
        {tab === 'assets' && designAnalysis && designAnalysis.asset_distribution?.length > 0 && <AssetOpportunities data={designAnalysis} onOpenPack={(pack) => setDrawer({ kind: 'assetPack', data: pack })} />}
        {tab === 'assets' && (!designAnalysis || !designAnalysis.asset_distribution?.length) && <EmptyState text="No asset opportunity data available for this category." />}
        {tab === 'advanced' && advancedInsights && <AdvancedInsights data={advancedInsights} isID={isID} />}
        {tab === 'advanced' && !advancedInsights && <EmptyState text="Advanced insights require template data." />}
      </div>

      {/* Drawer */}
      {drawer && (
        <>
          <div className="drawer-backdrop" onClick={() => setDrawer(null)} />
          <aside className="drawer" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <span className="eyebrow">{drawer.kind} detail</span>
              <button
                onClick={() => setDrawer(null)}
                style={{
                  background: 'var(--bg-hover)', width: 32, height: 32, borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)', border: 'none', cursor: 'pointer',
                }}
              >
                <BODashIcon name="close" size={15} />
              </button>
            </div>
            {drawer.kind === 'rec' && <RecDrawerContent rec={drawer.data as Recommendation} templateMap={templateMap} analysis={analysis} />}
            {drawer.kind === 'niche' && <NicheDrawerContent niche={drawer.data as NicheItem} categoryTemplates={categoryTemplates} nicheTemplateMap={nicheTemplateMap} nicheCreators={categoryInsights?.nicheCreators} />}
            {drawer.kind === 'creator' && <CreatorDrawerContent creatorName={drawer.data as string} categoryTemplates={categoryTemplates} />}
            {drawer.kind === 'assetPack' && <AssetPackDrawerContent pack={drawer.data as AssetPack} categoryTemplates={categoryTemplates} assetDistribution={designAnalysis?.asset_distribution || []} />}
            {drawer.kind === 'ranking' && <RankingDrawerContent ranking={drawer.data as NicheRanking} categoryTemplates={categoryTemplates} nicheTemplateMap={nicheTemplateMap} />}
            {drawer.kind === 'proFree' && <ProFreeDrawerContent opportunity={drawer.data as ProFreeOpportunity} categoryTemplates={categoryTemplates} nicheTemplateMap={nicheTemplateMap} />}
            {drawer.kind === 'stylePattern' && <StylePatternDrawerContent pattern={drawer.data as PatternDrawerData} categoryTemplates={categoryTemplates} />}
          </aside>
        </>
      )}
    </>
  );
}

/* ── Overview Panel ── */
function OverviewPanel({ analysis, niches, insights, recs, onTabChange, categoryInsights, isID = false, onOpenCreator, onOpenRanking, onOpenProFree }: {
  analysis: Analysis; niches: NicheItem[]; insights: string[]; recs: Recommendation[];
  onTabChange: (tab: string) => void; categoryInsights?: CategoryInsights; isID?: boolean; onOpenCreator?: (name: string) => void;
  onOpenRanking?: (r: NicheRanking) => void; onOpenProFree?: (op: ProFreeOpportunity) => void;
}) {
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
          <div
            className="col-8 card2 accent"
            style={{ padding: 24, cursor: 'pointer' }}
            onClick={() => onTabChange('recs')}
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
            <button
              className="btn btn-primary"
              onClick={(e) => { e.stopPropagation(); onTabChange('recs'); }}
              style={{ fontSize: 13, padding: '8px 18px' }}
            >
              See ideas <BODashIcon name="arrowRight" size={13} />
            </button>
          </div>
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

      {/* ═══ Top Creators + Ranking Signal side by side ═══ */}
      <div className="grid-responsive-2col-to-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32, alignItems: 'start' }}>
        {/* Top Creators — scrollable list showing ALL creators */}
        {creators.length > 0 && (
          <div className="card2" style={{ padding: 22, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div className="eyebrow">All Creators ({creators.length})</div>
              <span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 500 }}>{isID ? 'Klik untuk lihat template' : 'Click to see templates'}</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 10px', lineHeight: 1.5 }}>
              {isID ? 'Kreator diurutkan berdasarkan jumlah template — identifikasi kompetitor dan pelajari strategi mereka.' : 'Creators ranked by template volume — identify competitors and study their strategies.'}
            </p>
            {/* Tier legend */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 12, fontSize: 10, fontWeight: 600, color: 'var(--text-dim)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 4, borderRadius: 2, background: '#f59e0b' }} />Pro</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 4, borderRadius: 2, background: '#60a5fa' }} />Free</span>
            </div>
            <div style={{
              display: 'flex', flexDirection: 'column',
              maxHeight: 480, overflowY: 'auto', overflowX: 'hidden',
            }}>
              {creators.map((c, i) => {
                const maxCount = creators[0]?.count || 1;
                const barW = Math.round((c.count / maxCount) * 100);
                const proPct = c.count > 0 ? Math.round((c.pro / c.count) * 100) : 0;
                const rowBg = i % 2 === 1 ? 'rgba(255,255,255,0.03)' : 'transparent';
                return (
                  <div key={i} onClick={() => onOpenCreator?.(c.name)} style={{
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
                    {/* Dual Pro/Free bar */}
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
              {rankings.slice(0, 10).map((r, i) => (
                <div key={i} onClick={() => onOpenRanking?.(r)} style={{
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
          </div>
        )}
      </div>

      {/* ═══ Keyword Intelligence + Pro/Free Opportunities side by side ═══ */}
      <div className="grid-responsive-2col-to-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
        {/* Keyword Intelligence */}
        {keywords.length > 0 && (
          <div className="card2" style={{ padding: 22 }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Keyword Intelligence</div>
            <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '0 0 14px', lineHeight: 1.5 }}>
              {isID ? 'Kata kunci paling sering muncul — warna biru menandakan peluang, merah menandakan persaingan ketat.' : 'Most frequent keywords across niches — blue signals opportunity, red signals heavy competition.'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {keywords.map((kw, i) => {
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {proFreeOps.map((op, i) => (
                <div key={i} onClick={() => onOpenProFree?.(op)} style={{
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
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Niche Packed Treemap ── */
function NicheTreemap({ niches, zoneCounts, onOpenNiche }: {
  niches: NicheItem[];
  zoneCounts: { blue: number; yellow: number; red: number };
  onOpenNiche: (n: NicheItem) => void;
}) {
  const [hovered, setHovered] = React.useState<string | null>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [dims, setDims] = React.useState({ w: 800, h: 420 });

  React.useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const measure = () => {
      const width = el.clientWidth - 40;
      if (width > 100) setDims({ w: width, h: Math.max(400, Math.min(520, width * 0.55)) });
    };
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Theme-aware zone colors — use CSS vars at runtime
  const [zoneColors, setZoneColors] = React.useState({
    blue: { fill: '#4299e1', dim: 'rgba(66,153,225,0.18)', border: 'rgba(66,153,225,0.4)' },
    yellow: { fill: '#FFCE20', dim: 'rgba(255,206,32,0.18)', border: 'rgba(255,206,32,0.4)' },
    red: { fill: '#EE5D50', dim: 'rgba(238,93,80,0.18)', border: 'rgba(238,93,80,0.4)' },
  });

  React.useEffect(() => {
    const updateColors = () => {
      const root = document.documentElement;
      const cs = getComputedStyle(root);
      const blue = cs.getPropertyValue('--blue').trim() || '#4299e1';
      const yellow = cs.getPropertyValue('--yellow').trim() || '#FFCE20';
      const red = cs.getPropertyValue('--red').trim() || '#EE5D50';
      setZoneColors({
        blue: { fill: blue, dim: `color-mix(in srgb, ${blue} 18%, transparent)`, border: `color-mix(in srgb, ${blue} 40%, transparent)` },
        yellow: { fill: yellow, dim: `color-mix(in srgb, ${yellow} 18%, transparent)`, border: `color-mix(in srgb, ${yellow} 40%, transparent)` },
        red: { fill: red, dim: `color-mix(in srgb, ${red} 18%, transparent)`, border: `color-mix(in srgb, ${red} 40%, transparent)` },
      });
    };
    updateColors();
    // Re-read when theme changes (class or data-theme on <html>)
    const obs = new MutationObserver(() => setTimeout(updateColors, 50));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    return () => obs.disconnect();
  }, []);

  const ZONE_COLORS_MAP = zoneColors;

  // Simple treemap layout using squarified algorithm
  const cells = React.useMemo(() => {
    const sorted = [...niches].sort((a, b) => b.count - a.count);
    const total = sorted.reduce((s, n) => s + n.count, 0) || 1;

    // Squarified treemap layout
    interface Cell { niche: NicheItem; x: number; y: number; w: number; h: number }
    const result: Cell[] = [];

    function layoutRow(items: NicheItem[], rowTotal: number, x: number, y: number, w: number, h: number, horizontal: boolean) {
      let offset = 0;
      for (const item of items) {
        const ratio = item.count / rowTotal;
        if (horizontal) {
          result.push({ niche: item, x: x + offset, y, w: w * ratio, h });
          offset += w * ratio;
        } else {
          result.push({ niche: item, x, y: y + offset, w, h: h * ratio });
          offset += h * ratio;
        }
      }
    }

    function squarify(items: NicheItem[], x: number, y: number, w: number, h: number) {
      if (items.length === 0) return;
      if (items.length === 1) {
        result.push({ niche: items[0], x, y, w, h });
        return;
      }

      const itemTotal = items.reduce((s, n) => s + n.count, 0);
      const horizontal = w >= h;
      let rowItems: NicheItem[] = [];
      let rowTotal = 0;
      let bestAspect = Infinity;

      for (let i = 0; i < items.length; i++) {
        const testRow = [...rowItems, items[i]];
        const testTotal = rowTotal + items[i].count;
        const rowFraction = testTotal / itemTotal;
        const rowSize = horizontal ? h * rowFraction : w * rowFraction;

        // Check worst aspect ratio in this row
        let worstAspect = 0;
        for (const item of testRow) {
          const rowDim = horizontal ? h * (testTotal / itemTotal) : w * (testTotal / itemTotal);
          const cellDim = (item.count / testTotal) * (horizontal ? w : h);
          const cw = horizontal ? cellDim : rowDim;
          const ch = horizontal ? rowDim : cellDim;
          const aspect = Math.max(cw / (ch || 1), ch / (cw || 1));
          worstAspect = Math.max(worstAspect, aspect);
        }

        if (worstAspect <= bestAspect || rowItems.length === 0) {
          bestAspect = worstAspect;
          rowItems = testRow;
          rowTotal = testTotal;
        } else {
          // Layout the previous best row
          const prevTotal = rowTotal;
          const prevFraction = prevTotal / itemTotal;
          if (horizontal) {
            layoutRow(rowItems, prevTotal, x, y, w, h * prevFraction, true);
            squarify(items.slice(i), x, y + h * prevFraction, w, h * (1 - prevFraction));
          } else {
            layoutRow(rowItems, prevTotal, x, y, w * prevFraction, h, false);
            squarify(items.slice(i), x + w * prevFraction, y, w * (1 - prevFraction), h);
          }
          return;
        }
      }

      // Layout remaining items
      if (rowItems.length > 0) {
        layoutRow(rowItems, rowTotal, x, y, w, h, horizontal);
      }
    }

    squarify(sorted, 0, 0, dims.w, dims.h);
    return result;
  }, [niches, dims.w, dims.h]);

  return (
    <div ref={cardRef} className="card2" style={{ padding: 20, marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span className="eyebrow" style={{ margin: 0 }}>Niche Distribution</span>
        <div style={{ display: 'flex', gap: 16, fontSize: 12, fontWeight: 700 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 3, background: 'var(--blue)', display: 'inline-block' }} />Blue {zoneCounts.blue}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 3, background: 'var(--yellow)', display: 'inline-block' }} />Yellow {zoneCounts.yellow}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 3, background: 'var(--red)', display: 'inline-block' }} />Red {zoneCounts.red}</span>
        </div>
      </div>
      <div style={{ position: 'relative', width: '100%', height: dims.h, overflow: 'hidden' }}>
        {cells.map(c => {
          const zone = ZONE_COLORS_MAP[c.niche.zone as keyof typeof ZONE_COLORS_MAP] || ZONE_COLORS_MAP.blue;
          const isHov = hovered === c.niche.niche;
          const showLabel = c.w > 50 && c.h > 30;
          const showCount = c.w > 40 && c.h > 24;
          const maxChars = Math.max(4, Math.floor(c.w / 8));
          const label = c.niche.niche.length > maxChars ? c.niche.niche.substring(0, maxChars - 1) + '…' : c.niche.niche;

          return (
            <div
              key={c.niche.niche}
              onClick={() => onOpenNiche(c.niche)}
              onMouseEnter={() => setHovered(c.niche.niche)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: 'absolute',
                left: c.x + 1.5,
                top: c.y + 1.5,
                width: Math.max(0, c.w - 3),
                height: Math.max(0, c.h - 3),
                borderRadius: 6,
                background: isHov ? zone.border : zone.dim,
                border: `1px solid ${zone.border}`,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: 4,
                overflow: 'hidden',
                boxShadow: isHov ? `0 0 0 2px ${zone.fill}` : 'none',
                transition: 'background 0.15s, box-shadow 0.15s',
                zIndex: isHov ? 10 : 1,
              }}
            >
              {showLabel && (
                <div style={{
                  fontSize: c.w > 120 ? 12 : 10,
                  fontWeight: 600,
                  lineHeight: 1.2,
                  color: zone.fill,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: c.h > 60 ? 3 : 2,
                  WebkitBoxOrient: 'vertical' as const,
                  maxWidth: '100%',
                }}>
                  {c.w > 120 ? c.niche.niche : label}
                </div>
              )}
              {showCount && (
                <div style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: zone.fill,
                  opacity: 0.7,
                  marginTop: 2,
                }}>
                  {c.niche.count}
                </div>
              )}
            </div>
          );
        })}
        {/* Hover tooltip */}
        {hovered && (() => {
          const c = cells.find(c => c.niche.niche === hovered);
          if (!c) return null;
          const tooltipX = c.x + c.w / 2;
          const tooltipLeft = tooltipX > dims.w / 2 ? Math.max(8, c.x - 180) : Math.min(dims.w - 210, c.x + c.w + 8);
          return (
            <div style={{
              position: 'absolute',
              top: Math.max(8, Math.min(dims.h - 90, c.y + c.h / 2 - 40)),
              left: tooltipLeft,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '10px 14px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              zIndex: 20,
              pointerEvents: 'none',
              minWidth: 170,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{c.niche.niche}</div>
              <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
                <span><strong>{c.niche.count}</strong> templates</span>
                <span style={{ color: 'var(--purple)' }}>{c.niche.pro ?? 0} Pro</span>
                <span style={{ color: 'var(--green)' }}>{c.niche.free ?? 0} Free</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 3 }}>{c.niche.pct}% of category &middot; Click to explore</div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

/* ── Niches Panel (bubble chart + card grid, opens drawer on click) ── */
function NichesPanel({ niches, categoryTemplates, onOpenNiche }: {
  niches: NicheItem[]; categoryTemplates: CategoryTemplate[]; onOpenNiche: (n: NicheItem) => void;
}) {
  const [zoneFilter, setZoneFilter] = React.useState<'all' | 'blue' | 'yellow' | 'red'>('all');
  const [search, setSearch] = React.useState('');

  const zoneCounts = React.useMemo(() => ({
    blue: niches.filter(n => n.zone === 'blue').length,
    yellow: niches.filter(n => n.zone === 'yellow').length,
    red: niches.filter(n => n.zone === 'red').length,
  }), [niches]);

  const filtered = React.useMemo(() => {
    let list = niches;
    if (zoneFilter !== 'all') list = list.filter(n => n.zone === zoneFilter);
    const q = search.toLowerCase().trim();
    if (q) list = list.filter(n => n.niche.toLowerCase().includes(q));
    return list.sort((a, b) => b.count - a.count);
  }, [niches, zoneFilter, search]);

  const ZONE_COLORS: Record<string, string> = { blue: 'var(--blue)', yellow: 'var(--yellow)', red: 'var(--red)' };

  return (
    <div>
      {/* Packed Treemap visualization */}
      <NicheTreemap niches={niches} zoneCounts={zoneCounts} onOpenNiche={onOpenNiche} />

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="tabs2" style={{ display: 'inline-flex' }}>
          {(['all', 'blue', 'yellow', 'red'] as const).map(z => (
            <button
              key={z}
              className={`tab2 ${zoneFilter === z ? 'active' : ''}`}
              onClick={() => setZoneFilter(z)}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {z !== 'all' && (
                <span style={{ width: 7, height: 7, borderRadius: 3, background: ZONE_COLORS[z], display: 'inline-block' }} />
              )}
              {z === 'all' ? 'All' : z.charAt(0).toUpperCase() + z.slice(1)}
              {z !== 'all' && (
                <span style={{ opacity: 0.5, fontWeight: 500, fontSize: 11 }}>{zoneCounts[z]}</span>
              )}
            </button>
          ))}
        </div>
        <div style={{ position: 'relative', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <BODashIcon name="search" size={14} color="var(--text-dim)" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search niches…"
            style={{
              padding: '11px 14px 11px 8px',
              borderRadius: 12,
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              fontSize: 13,
              fontFamily: 'inherit',
              color: 'var(--text)',
              outline: 'none',
              width: 200,
            }}
          />
        </div>
      </div>

      {/* Niche cards grid */}
      {filtered.length === 0 ? (
        <div className="card2" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
          No niches match this filter.
        </div>
      ) : (
        <div className="bento stagger">
          {filtered.map(n => (
            <div key={n.niche} className="col-4">
              <button
                onClick={() => onOpenNiche(n)}
                style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <div className="card2 interactive" style={{ padding: '18px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 700, lineHeight: 1.25, maxWidth: '70%' }}>{n.niche}</div>
                    <span className={`badge-zone badge-${n.zone}`}>
                      <span className="dot" />{n.zone}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>{n.count}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>templates &middot; {n.pct}%</span>
                  </div>
                  <div style={{ display: 'flex', gap: 14, fontSize: 11.5, fontWeight: 600 }}>
                    <span style={{ color: 'var(--purple)' }}>{n.pro ?? '—'} PRO</span>
                    <span style={{ color: 'var(--green)' }}>{n.free ?? '—'} FREE</span>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Niche Drawer Content (with per-niche template matching) ── */
function NicheDrawerContent({ niche, categoryTemplates, nicheTemplateMap = {}, nicheCreators }: {
  niche: NicheItem; categoryTemplates: CategoryTemplate[]; nicheTemplateMap?: Record<string, string[]>; nicheCreators?: Record<string, CreatorStat[]>;
}) {
  // Use niche_template_map (from Claude classification) if available, else fallback to keyword matching
  const nicheTemplates = React.useMemo(() => {
    const mappedTitles = nicheTemplateMap[niche.niche];
    // If niche_template_map exists for this niche (even if empty), trust it — don't fallback
    if (mappedTitles !== undefined) {
      if (mappedTitles.length === 0) return [];
      const titleSet = new Set(mappedTitles.map(t => t.toLowerCase()));
      return categoryTemplates.filter(t => titleSet.has((t.title || '').toLowerCase()));
    }
    // Fallback: keyword matching (only for old analyses without niche_template_map)
    const hasMap = Object.keys(nicheTemplateMap).length > 0;
    if (hasMap) return []; // Map exists but this niche isn't in it — 0 templates
    const words = niche.niche
      .split(/[\s\/,&()]+/)
      .filter(w => w.length > 2)
      .map(w => w.toLowerCase());
    if (words.length === 0) return categoryTemplates;
    return categoryTemplates.filter(t => {
      const text = (t.title || '').toLowerCase();
      return words.some(w => text.includes(w));
    });
  }, [niche.niche, categoryTemplates, nicheTemplateMap]);

  const proTemplates = nicheTemplates.filter(t => t.is_pro);
  const freeTemplates = nicheTemplates.filter(t => !t.is_pro);

  return (
    <div>
      <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 8px' }}>{niche.niche}</h2>
      <span className={`badge-zone badge-${niche.zone}`}><span className="dot" />{niche.zone} ocean</span>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 24, marginTop: 22 }}>
        <div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>{niche.count}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Templates</div>
        </div>
        <div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--purple)' }}>{niche.pro ?? 0}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pro</div>
        </div>
        <div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--green)' }}>{niche.free ?? 0}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Free</div>
        </div>
      </div>

      {/* Pro/Free ratio bar */}
      <div style={{ marginTop: 20, marginBottom: 24 }}>
        <div className="bar-track" style={{ height: 6 }}>
          <div style={{ width: `${niche.count > 0 ? ((niche.pro ?? 0) / niche.count * 100) : 0}%`, background: 'var(--purple)' }} />
          <div style={{ width: `${niche.count > 0 ? ((niche.free ?? 0) / niche.count * 100) : 0}%`, background: 'var(--green)' }} />
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 11, fontWeight: 600 }}>
          <span style={{ color: 'var(--purple)' }}>{niche.count > 0 ? Math.round((niche.pro ?? 0) / niche.count * 100) : 0}% Pro</span>
          <span style={{ color: 'var(--green)' }}>{niche.count > 0 ? Math.round((niche.free ?? 0) / niche.count * 100) : 0}% Free</span>
          <span style={{ marginLeft: 'auto', color: 'var(--text-dim)' }}>{niche.pct}% of category</span>
        </div>
      </div>

      {/* Top Creators in this Niche */}
      {(() => {
        const creators = nicheCreators?.[niche.niche] || [];
        if (creators.length === 0) return null;
        const maxCount = creators[0]?.count || 1;
        return (
          <>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Top Creators</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
              {creators.map((c, i) => (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 800, width: 20, textAlign: 'center',
                    color: i < 3 ? 'var(--accent)' : 'var(--text-dim)',
                  }}>
                    {i + 1}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-dim)', flexShrink: 0, marginLeft: 8 }}>
                        {c.count} &middot; <span style={{ color: 'var(--purple)' }}>{c.pro}P</span> <span style={{ color: 'var(--green)' }}>{c.free}F</span>
                      </span>
                    </div>
                    <div className="bar-track" style={{ height: 3 }}>
                      <div style={{ width: `${(c.count / maxCount) * 100}%`, background: 'var(--accent)', borderRadius: 2 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      })()}

      {/* Pro Templates section */}
      {proTemplates.length > 0 && (
        <>
          <div className="eyebrow" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--purple)' }}>Pro Templates</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-dim)' }}>({proTemplates.length})</span>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 22 }}>
            {proTemplates.slice(0, 12).map((t, j) => (
              <a key={j} href={t.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: 80, flexShrink: 0 }}>
                  <div style={{ width: 80, height: 80, borderRadius: 8, overflow: 'hidden', position: 'relative', background: '#eee' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.thumbnail} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <span style={{
                      position: 'absolute', top: 3, right: 3,
                      fontSize: 8, fontWeight: 800, padding: '1.5px 4px', borderRadius: 3,
                      background: 'rgba(255,170,0,0.92)', color: '#fff',
                    }}>
                      👑 PRO
                    </span>
                  </div>
                  <div style={{
                    marginTop: 3, fontSize: 10, fontWeight: 500, color: 'var(--text-dim)',
                    lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
                  }}>
                    {t.title}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </>
      )}

      {/* Free Templates section */}
      {freeTemplates.length > 0 && (
        <>
          <div className="eyebrow" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--green)' }}>Free Templates</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-dim)' }}>({freeTemplates.length})</span>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {freeTemplates.slice(0, 12).map((t, j) => (
              <a key={j} href={t.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: 80, flexShrink: 0 }}>
                  <div style={{ width: 80, height: 80, borderRadius: 8, overflow: 'hidden', position: 'relative', background: '#eee' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.thumbnail} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div style={{
                    marginTop: 3, fontSize: 10, fontWeight: 500, color: 'var(--text-dim)',
                    lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
                  }}>
                    {t.title}
                  </div>
                </div>
              </a>
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

/* ── Outliers Panel ── */
function OutliersPanel({ outliers, templateMap, nicheTemplateMap = {}, categoryTemplates = [], isID = false }: {
  outliers: Outlier[]; templateMap: Record<string, TemplateInfo>;
  nicheTemplateMap?: Record<string, string[]>; categoryTemplates?: CategoryTemplate[];
  isID?: boolean;
}) {
  // Build a quick title→CategoryTemplate lookup for fallback examples
  const ctMap = React.useMemo(() => {
    const m: Record<string, CategoryTemplate> = {};
    for (const t of categoryTemplates) { if (t.title && t.thumbnail) m[t.title] = t; }
    return m;
  }, [categoryTemplates]);

  if (outliers.length === 0) return <EmptyState text="No outliers found." />;
  return (
    <div className="bento stagger">
      {outliers.map((o, i) => {
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
  );
}

/* ── Recommendations Panel ── */
function RecsPanel({ recs, templateMap, onOpenRec }: {
  recs: Recommendation[]; templateMap: Record<string, TemplateInfo>; onOpenRec: (r: Recommendation) => void;
}) {
  if (recs.length === 0) return <EmptyState text="No recommendations available." />;
  return (
    <div className="bento">
      {recs.map((rec, i) => (
        <div key={i} className="col-6 card2 interactive" onClick={() => onOpenRec(rec)} style={{ padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 7, background: 'var(--accent-dim)', color: 'var(--accent)' }}>
              #{rec.rank}
            </span>
            <span className="badge-zone badge-blue"><span className="dot" />Blue ocean</span>
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2, marginBottom: 10 }}>
            {rec.niche}
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55, margin: '0 0 16px',
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
            {rec.why}
          </p>
          {/* Score bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            <ScoreBar label="Score" value={rec.score} color="var(--accent)" />
            <ScoreBar label="Demand" value={rec.potentialDemand} color="var(--green)" />
            <ScoreBar label="Competition" value={rec.competition} color="var(--red)" />
          </div>
          {/* Keywords */}
          {rec.keywords?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: rec.examples?.length ? 14 : 0 }}>
              {rec.keywords.slice(0, 5).map((k, j) => <span key={j} className="pill">{k}</span>)}
            </div>
          )}
          {/* Template thumbnails */}
          {rec.examples && rec.examples.length > 0 && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
              {rec.examples.slice(0, 3).map((ex, j) => {
                const info = templateMap[ex.title];
                return (
                  <TemplateThumbnail
                    key={j}
                    title={ex.title}
                    canvaUrl={info?.url || ex.url}
                    thumbnailUrl={info?.thumbnail}
                    index={j + i * 3}
                    size={64}
                    showTitle
                    isPro={info?.is_pro}
                  />
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Rec Drawer Content ── */
function RecDrawerContent({ rec, templateMap, analysis }: { rec: Recommendation; templateMap: Record<string, TemplateInfo>; analysis?: Analysis }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyKeywords = () => {
    if (!rec.keywords?.length) return;
    const text = rec.keywords.join(', ');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadMarkdown = () => {
    const categoryName = analysis?.category_name?.replace(/-/g, ' ') || 'Unknown Category';
    const month = analysis?.month || '';
    const lines: string[] = [
      `# Blue Ocean Brief: ${rec.niche}`,
      '',
      `> Auto-generated from Blue Ocean Finder — ${categoryName} (${month})`,
      '',
      '## Overview',
      '',
      `- **Category:** ${categoryName}`,
      `- **Niche:** ${rec.niche}`,
      `- **Rank:** #${rec.rank}`,
      `- **Opportunity Score:** ${rec.score}/100`,
      `- **Demand:** ${rec.potentialDemand}/100`,
      `- **Competition:** ${rec.competition}/100`,
      `- **Existing Templates:** ${rec.templates}`,
      '',
      '## Why This Is an Opportunity',
      '',
      rec.why,
      '',
      '## Template Ideas',
      '',
      ...(rec.ideas || []).map((idea, i) => `${i + 1}. ${idea}`),
      '',
      '## Target Keywords',
      '',
      (rec.keywords || []).map(k => `\`${k}\``).join(', '),
      '',
      '## Reference Templates',
      '',
      ...(rec.examples || []).map(ex => {
        const info = templateMap[ex.title];
        const url = info?.url || ex.url || '';
        const pro = info?.is_pro ? ' (Pro)' : ' (Free)';
        return url ? `- [${ex.title}](${url})${pro}` : `- ${ex.title}${pro}`;
      }),
      '',
      '---',
      '',
      '## Prompt for LLM',
      '',
      'Use the data above to help me create a design brief for Canva templates targeting this blue ocean niche. Consider:',
      '',
      '1. What visual styles would work best for this niche?',
      '2. What color palettes and typography would appeal to the target audience?',
      '3. What specific template variations should I create (sizes, formats)?',
      '4. How should I differentiate from the existing templates listed above?',
      '5. What keywords and titles should I use for maximum discoverability?',
      '',
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brief-${rec.niche.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 8px' }}>{rec.niche}</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span className="badge-zone badge-blue"><span className="dot" />Blue ocean opportunity</span>
        <button
          onClick={handleDownloadMarkdown}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '5px 12px', borderRadius: 7,
            border: '1px solid var(--border)',
            background: 'var(--bg-card)',
            color: 'var(--accent)',
            fontSize: 11, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'inherit', transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--accent)'; }}
        >
          <BODashIcon name="download" size={11} />
          Download Brief (.md)
        </button>
      </div>
      <p style={{ marginTop: 18, color: 'var(--text-secondary)', fontSize: 14.5, lineHeight: 1.7 }}>{rec.why}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 22 }}>
        <ScoreBar label="Opportunity score" value={rec.score} color="var(--accent)" />
        <ScoreBar label="Demand" value={rec.potentialDemand} color="var(--green)" />
        <ScoreBar label="Competition" value={rec.competition} color="var(--red)" />
      </div>

      {/* Template ideas — numbered list */}
      <div className="eyebrow" style={{ marginTop: 22, marginBottom: 10 }}>Template ideas</div>
      <ol style={{ paddingLeft: 20, margin: 0, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8, listStyleType: 'decimal' }}>
        {(rec.ideas || []).map((idea, j) => (
          <li key={j} style={{ paddingLeft: 4, marginBottom: 4 }}>{idea}</li>
        ))}
      </ol>

      {/* Keywords with copy button */}
      {rec.keywords?.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 22, marginBottom: 10 }}>
            <span className="eyebrow" style={{ margin: 0 }}>Keywords</span>
            <button
              onClick={handleCopyKeywords}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 7,
                border: '1px solid var(--border)',
                background: copied ? 'var(--green-dim)' : 'var(--bg-card)',
                color: copied ? 'var(--green)' : 'var(--text-muted)',
                fontSize: 11, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'inherit', transition: 'all 0.2s ease',
              }}
            >
              <BODashIcon name={copied ? 'check' : 'copy'} size={11} />
              {copied ? 'Copied!' : 'Copy all'}
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {rec.keywords.map((k, j) => <span key={j} className="pill">{k}</span>)}
          </div>
        </>
      )}

      {/* Template examples — linked to Canva with titles */}
      {rec.examples && rec.examples.length > 0 && (
        <>
          <div className="eyebrow" style={{ marginTop: 22, marginBottom: 10 }}>Template examples</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {rec.examples.slice(0, 6).map((ex, j) => {
              const info = templateMap[ex.title];
              return (
                <TemplateThumbnail
                  key={j}
                  title={ex.title}
                  canvaUrl={info?.url || ex.url}
                  thumbnailUrl={info?.thumbnail}
                  index={j}
                  size={96}
                  showTitle
                  isPro={info?.is_pro}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Score Bar ── */
function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
        <span style={{ color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ color }}>{value}/100</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-hover)', overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', borderRadius: 3, background: color, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  );
}

/* ── Asset Pack Drawer ── */
function AssetPackDrawerContent({ pack, categoryTemplates = [], assetDistribution = [] }: {
  pack: AssetPack; categoryTemplates?: CategoryTemplate[]; assetDistribution?: import('@/lib/types').AssetDistItem[];
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

  // Find templates that use assets in this pack
  const packTemplates = React.useMemo(() => {
    const assetNames = new Set(pack.assets.map(a => a.toLowerCase().trim()));
    // Collect unique template titles from asset_distribution that match this pack's assets
    const templateTitlesSet = new Set<string>();
    for (const asset of assetDistribution) {
      if (assetNames.has(asset.name.toLowerCase().trim())) {
        for (const t of asset.templates) {
          templateTitlesSet.add(t.toLowerCase().trim());
        }
      }
    }
    // Match to categoryTemplates for thumbnails
    return categoryTemplates.filter(t =>
      templateTitlesSet.has((t.title || '').toLowerCase().trim())
    );
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

      {/* Stats */}
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

      {/* All Assets */}
      <div className="eyebrow" style={{ marginBottom: 10 }}>All Assets ({pack.assets.length})</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
        {pack.assets.map((name, j) => (
          <span key={j} style={{
            fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 6,
            background: config.color + '15', color: config.color,
          }}>
            {name}
          </span>
        ))}
      </div>

      {/* Render Styles */}
      {pack.styles.length > 0 && (
        <>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Render Styles</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
            {pack.styles.map((s, j) => (
              <span key={j} style={{
                fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 6,
                background: 'var(--bg-hover)', color: 'var(--text-muted)',
              }}>
                {s}
              </span>
            ))}
          </div>
        </>
      )}

      {/* Shapes in Action — template thumbnails */}
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

      {/* Used in Niches */}
      {pack.niches_using.length > 0 && (
        <>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Used in Niches</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {pack.niches_using.map((n, j) => (
              <div key={j} style={{
                padding: '8px 12px', borderRadius: 8, background: 'var(--bg-hover)',
                fontSize: 13, fontWeight: 600,
              }}>
                {n}
              </div>
            ))}
          </div>
        </>
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

/* ── Style Pattern Drawer ── */
function StylePatternDrawerContent({ pattern, categoryTemplates }: {
  pattern: PatternDrawerData; categoryTemplates: CategoryTemplate[];
}) {
  // Match templates by title from pattern.matchedTemplates
  const templates = React.useMemo(() => {
    const titleSet = new Set(pattern.matchedTemplates.map(t => t.title.toLowerCase()));
    return categoryTemplates.filter(ct => titleSet.has(ct.title.toLowerCase()));
  }, [pattern, categoryTemplates]);

  // Group matched templates by niche
  const nicheGroups = React.useMemo(() => {
    const groups: Record<string, { title: string; confidence: string; notes: string }[]> = {};
    for (const t of pattern.matchedTemplates) {
      if (!groups[t.niche]) groups[t.niche] = [];
      groups[t.niche].push(t);
    }
    return groups;
  }, [pattern]);

  const STYLE_COLORS: Record<string, string> = {
    'Minimalist': '#60a5fa', 'Maximalist': '#f59e0b', 'Flat Design': '#34d399',
    'Corporate / Professional': '#a78bfa', '3D / Isometric': '#fb923c',
    'Retro / Vintage': '#fbbf24', 'Brutalist': '#ef4444',
    'Gradient / Glassmorphism': '#818cf8', 'Photo-Centric': '#2dd4bf',
    'Illustrated / Hand-drawn': '#e27b4a', 'Typography-Heavy': '#c084fc',
    'Playful / Fun': '#38bdf8', 'Elegant / Luxury': '#d4a574',
    'Collage / Scrapbook': '#a3e635',
  };
  const styleColor = STYLE_COLORS[pattern.style] || '#94a3b8';

  return (
    <div>
      <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 8px' }}>{pattern.style}</h2>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 22, flexWrap: 'wrap' }}>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6,
          background: pattern.signal === 'high' ? 'rgba(52,211,153,0.15)' : pattern.signal === 'medium' ? 'rgba(251,191,36,0.15)' : 'var(--bg-hover)',
          color: pattern.signal === 'high' ? 'var(--green)' : pattern.signal === 'medium' ? 'var(--yellow)' : 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          {pattern.signal} signal
        </span>
        <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{pattern.total_count} templates across {pattern.niches.length} niches</span>
      </div>

      {/* Description */}
      <div style={{
        padding: '14px 16px', borderRadius: 12, marginBottom: 24,
        background: `${styleColor}10`, borderLeft: `3px solid ${styleColor}`,
      }}>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{pattern.pattern}</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, color: styleColor }}>{pattern.total_count}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Templates</div>
        </div>
        <div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>{pattern.niches.length}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Niches</div>
        </div>
        <div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>{pattern.matchedTemplates.length}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Matched</div>
        </div>
      </div>

      {/* Niches using this style */}
      <div className="eyebrow" style={{ marginBottom: 10 }}>Niches Using This Style</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
        {pattern.niches.map((n, i) => (
          <span key={i} style={{
            fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 6,
            background: `${styleColor}15`, color: styleColor,
          }}>
            {n} {nicheGroups[n] ? `(${nicheGroups[n].length})` : ''}
          </span>
        ))}
      </div>

      {/* Template thumbnails */}
      {templates.length > 0 && (
        <>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Templates with {pattern.style} Style ({templates.length})</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {templates.slice(0, 20).map((t, j) => (
              <TemplateThumbnail key={j} title={t.title} canvaUrl={t.url} thumbnailUrl={t.thumbnail} index={j} size={80} showTitle isPro={t.is_pro} />
            ))}
          </div>
        </>
      )}

      {templates.length === 0 && pattern.matchedTemplates.length > 0 && (
        <>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Templates ({pattern.matchedTemplates.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {pattern.matchedTemplates.slice(0, 20).map((t, j) => (
              <div key={j} style={{
                display: 'flex', alignItems: 'center', gap: 8, fontSize: 12,
                padding: '6px 8px', borderRadius: 8, background: 'var(--bg-hover)',
              }}>
                <span style={{ width: 8, height: 8, borderRadius: 4, background: styleColor, flexShrink: 0 }} />
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
                  {t.title}
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-dim)', flexShrink: 0 }}>{t.niche}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {templates.length === 0 && pattern.matchedTemplates.length === 0 && (
        <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 13 }}>
          No matching templates found for this style pattern.
        </div>
      )}
    </div>
  );
}

/* ── Empty State ── */
function EmptyState({ text }: { text: string }) {
  return (
    <div className="card2" style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
      <BODashIcon name="search" size={28} color="var(--text-dim)" />
      <div style={{ fontSize: 16, fontWeight: 600, marginTop: 12, color: 'var(--text)' }}>Nothing here yet</div>
      <div style={{ fontSize: 13, marginTop: 6 }}>{text}</div>
    </div>
  );
}
