'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import BODashIcon from './BODashIcon';
import DropdownSelect from './DropdownSelect';
import type { Analysis } from '@/lib/types';

// ─── Serializable prop types ───────────────────────────────────────────────

interface TrendStyle {
  style: string;
  count: number;
  color: string;
}

interface HotAsset {
  name: string;
  freq: number;
  color: string;
}

interface FeaturedRec {
  categorySlug: string;
  categoryName: string;
  niche: string;
  score: number;
  demand: number;
  why: string;
  rank?: number;
}

interface GainerData {
  id: number;
  category_name: string;
  total_templates: number;
  blue_ocean_count: number;
  delta: number;
  pct: number;
  prevTemplates: number;
}

export interface HomeClientProps {
  analyses: Analysis[];
  months: string[];
  latestMonth: string;
  // Pre-computed totals for latestMonth
  totals: {
    templates: number;
    blue: number;
    niches: number;
    free: number;
    freePct: number;
  };
  topOpp: Analysis | null;
  topByBlue: Analysis[];
  gainers: GainerData[];
  trendStyles: TrendStyle[];
  hotAssets: HotAsset[];
  featuredRecs: FeaturedRec[];
  heroThumbnails: { thumbnail: string; url: string; title: string; is_pro: boolean }[];
}

// ─── Labels ─────────────────────────────────────────────────────────────────

const LABELS = {
  en: {
    reportFor: 'Report for',
    briefing: "This month's briefing",
    thereAre: 'There are ',
    blueOcean: ' blue ocean',
    opportunitiesAcross: ' opportunities across ',
    categoriesThisMonth: ' categories this month.',
    templatesAnalyzed: ' templates analyzed, ',
    free: '% free. Standing out: ',
    with: ' with ',
    blueOceanNiches: ' blue ocean niches',
    topOpp: 'Top opportunity',
    viewAllCategories: 'View all categories',
    topCategory: 'Top Category',
    blueNiches: 'Blue niches',
    templates: 'Templates',
    totalNiches: 'Total niches',
    freeLabel: 'Free',
    snapshot: 'Snapshot',
    thisMonthGlance: 'This month at a glance',
    templatesAnalyzedLabel: 'Templates analyzed',
    blueOceanNichesLabel: 'Blue ocean niches',
    totalNichesLabel: 'Total niches',
    freeShare: 'Free share',
    leaderboard: 'Leaderboard \u00B7 Categories',
    mostBlueOcean: 'Most blue ocean niches',
    topGainers: 'Top gainers',
    featureCompare: 'Feature \u00B7 Compare',
    openCompare: 'Open Compare',
    noGainers: 'No comparison data yet.',
    featureDesignTrends: 'Feature \u00B7 Design Trends',
    stylesDominating: 'Styles dominating this month',
    style: 'Style',
    featureAssets: 'Feature \u00B7 Asset Opportunities',
    hottestAssets: 'Hottest assets this month',
    featureRecs: 'Feature \u00B7 Recommendations',
    handpicked: 'Handpicked this week',
    allRecs: 'All recommendations',
    score: 'score',
    demand: 'demand',
    browse: 'Browse',
    allCategories: 'All categories',
    categories: 'categories',
    open: 'Open',
    blue: 'blue',
    exploreIn: 'Explore in ',
    seeIn: 'See in ',
    featureCategories: 'Feature \u00B7 Categories',
  },
  id: {
    reportFor: 'Laporan untuk',
    briefing: 'Briefing bulan ini',
    thereAre: 'Ada ',
    blueOcean: ' blue ocean',
    opportunitiesAcross: ' peluang di ',
    categoriesThisMonth: ' kategori bulan ini.',
    templatesAnalyzed: ' templates dianalisis, ',
    free: '% free. Yang paling menonjol: ',
    with: ' dengan ',
    blueOceanNiches: ' blue ocean niches',
    topOpp: 'Top peluang',
    viewAllCategories: 'Lihat semua kategori',
    topCategory: 'Top Category',
    blueNiches: 'Blue ocean',
    templates: 'Templates',
    totalNiches: 'Total niches',
    freeLabel: 'Free',
    snapshot: 'Ringkasan',
    thisMonthGlance: 'Ringkasan bulan ini',
    templatesAnalyzedLabel: 'Templates dianalisis',
    blueOceanNichesLabel: 'Blue ocean',
    totalNichesLabel: 'Total niches',
    freeShare: 'Porsi free',
    leaderboard: 'Leaderboard \u00B7 Categories',
    mostBlueOcean: 'Blue ocean terbanyak',
    topGainers: 'Top gainers',
    featureCompare: 'Feature \u00B7 Compare',
    openCompare: 'Buka Compare',
    noGainers: 'Belum ada data perbandingan.',
    featureDesignTrends: 'Feature \u00B7 Design Trends',
    stylesDominating: 'Style yang dominan lintas kategori',
    style: 'Gaya',
    featureAssets: 'Feature \u00B7 Asset Opportunities',
    hottestAssets: 'Aset yang paling sering muncul',
    featureRecs: 'Feature \u00B7 Recommendations',
    handpicked: 'Rekomendasi pilihan minggu ini',
    allRecs: 'Semua rekomendasi',
    score: 'score',
    demand: 'demand',
    browse: 'Browse',
    allCategories: 'Semua kategori',
    categories: 'kategori',
    open: 'Buka',
    blue: 'blue',
    exploreIn: 'Buka ',
    seeIn: 'Lihat di ',
    featureCategories: 'Feature \u00B7 Categories',
  },
} as const;

type Lang = 'en' | 'id';

// ─── Sub-components ─────────────────────────────────────────────────────────

function HomeSection({ eyebrow, title, link, children, inline }: {
  eyebrow: string;
  title: string;
  link?: { label: string; href: string };
  children: React.ReactNode;
  inline?: boolean;
}) {
  return (
    <section style={{ marginBottom: inline ? 0 : 60 }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        gap: 16, marginBottom: 20, paddingBottom: inline ? 0 : 4,
      }}>
        <div style={{ minWidth: 0 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>{eyebrow}</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.022em', margin: 0, textWrap: 'balance' as const }}>{title}</h2>
        </div>
        {link && (
          <Link href={link.href} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600,
            fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6,
            whiteSpace: 'nowrap', padding: '4px 0', textDecoration: 'none',
          }}>
            {link.label} <BODashIcon name="arrowRight" size={12} />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function HomeMetric({ v, l, color }: { v: number | string; l: string; color?: string }) {
  return (
    <div>
      <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.05, color: color || 'var(--text)' }}>{v}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginTop: 4 }}>{l}</div>
    </div>
  );
}

function BigStat({ v, l, color }: { v: number | string; l: string; color?: string }) {
  return (
    <div style={{ padding: '28px 24px', background: 'var(--bg-card-solid)' }}>
      <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.028em', lineHeight: 1, color: color || 'var(--text)' }}>{v}</div>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginTop: 10 }}>{l}</div>
    </div>
  );
}

function RankRow({ rank, title, subtitle, metric, metricLabel, metricColor, href }: {
  rank: number;
  title: string;
  subtitle: string;
  metric: string | number;
  metricLabel: string;
  metricColor: string;
  href: string;
}) {
  return (
    <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 14, padding: '14px 4px',
          borderBottom: '1px solid var(--border)', cursor: 'pointer',
          transition: 'background 0.15s ease',
        }}
      >
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'var(--bg-hover)', color: 'var(--text-muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 800, flexShrink: 0,
        }}>{rank}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, letterSpacing: '-0.005em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textTransform: 'capitalize' as const }}>{title}</div>
          <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subtitle}</div>
        </div>
        <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.015em', color: metricColor, lineHeight: 1 }}>{metric}</div>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginTop: 3 }}>{metricLabel}</div>
        </div>
      </div>
    </Link>
  );
}

function HeroBentoGrid({ thumbnails }: { thumbnails: { thumbnail: string; url: string; title: string; is_pro: boolean }[] }) {
  if (thumbnails.length === 0) return null;
  // Bento layout: first image is large (2x2), rest fill around it
  const BENTO_AREAS = [
    { gridColumn: '1 / 3', gridRow: '1 / 3' },       // large
    { gridColumn: '3 / 4', gridRow: '1 / 2' },
    { gridColumn: '3 / 4', gridRow: '2 / 3' },
    { gridColumn: '1 / 2', gridRow: '3 / 4' },
    { gridColumn: '2 / 3', gridRow: '3 / 4' },
    { gridColumn: '3 / 4', gridRow: '3 / 4' },
  ];
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'repeat(3, 80px)',
      gap: 6,
      width: '100%',
      borderRadius: 14,
      overflow: 'hidden',
    }}>
      {thumbnails.slice(0, 6).map((t, i) => (
        <a
          key={i}
          href={t.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...BENTO_AREAS[i],
            borderRadius: 10,
            overflow: 'hidden',
            position: 'relative',
            background: 'var(--bg-hover)',
          }}
          onClick={e => e.stopPropagation()}
        >
          <img
            src={t.thumbnail}
            alt={t.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {t.is_pro && (
            <span style={{
              position: 'absolute', top: 4, right: 4,
              fontSize: 9, fontWeight: 800, padding: '2px 5px', borderRadius: 4,
              background: 'rgba(255,170,0,0.9)', color: '#fff',
              letterSpacing: '0.04em',
            }}>
              PRO
            </span>
          )}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '12px 6px 4px',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
            fontSize: 9.5, fontWeight: 600, color: '#fff',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {t.title}
          </div>
        </a>
      ))}
    </div>
  );
}

function MiniStat({ v, l, color }: { v: number; l: string; color?: string }) {
  return (
    <div>
      <div style={{ fontSize: 16, fontWeight: 700, color: color || 'var(--text)', lineHeight: 1 }}>{v}</div>
      <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginTop: 3 }}>{l}</div>
    </div>
  );
}

// ─── Format month label ─────────────────────────────────────────────────────

function formatMonth(monthStr: string): string {
  if (!monthStr) return 'N/A';
  try {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } catch {
    return monthStr;
  }
}

// ─── Main component ─────────────────────────────────────────────────────────

export default function HomeClient({
  analyses,
  months,
  latestMonth,
  totals,
  topOpp,
  topByBlue,
  gainers,
  trendStyles,
  hotAssets,
  featuredRecs,
  heroThumbnails,
}: HomeClientProps) {
  const [selectedMonth, setSelectedMonth] = useState(latestMonth);
  const lang: Lang = 'en'; // Dashboard UI always English
  const t = LABELS[lang];

  const latestAnalyses = useMemo(
    () => analyses.filter(a => a.month === selectedMonth),
    [analyses, selectedMonth]
  );

  const monthLabel = formatMonth(selectedMonth);
  const topOppName = topOpp ? topOpp.category_name.replace(/-/g, ' ') : '';
  const topOppFreePct = topOpp && topOpp.total_templates > 0
    ? Math.round((topOpp.total_free || 0) / topOpp.total_templates * 100)
    : 0;

  return (
    <div className="rise">

      {/* ─── Briefing bar ─── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        paddingBottom: 18, marginBottom: 28,
        borderBottom: '1px solid var(--border)', flexWrap: 'wrap' as const,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'var(--accent)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BODashIcon name="sparkles" size={20} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>
              Blue Ocean Finder
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', marginTop: 2 }}>
              {t.reportFor} {monthLabel}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <DropdownSelect
            value={selectedMonth}
            onChange={setSelectedMonth}
            icon="folder"
            minWidth={160}
            options={months.map(m => ({
              value: m,
              label: formatMonth(m),
            }))}
          />
        </div>
      </div>

      {/* ─── Editorial hero ─── */}
      <section style={{ maxWidth: 900, margin: '0 0 48px' }}>
        <div className="eyebrow" style={{ marginBottom: 18 }}>{t.briefing}</div>
        <h1 className="display-xl" style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
          {t.thereAre}
          <span style={{ color: 'var(--blue)' }}>{totals.blue}{t.blueOcean}</span>
          {t.opportunitiesAcross}
          <span style={{ color: 'var(--accent)' }}>{latestAnalyses.length}</span>
          {t.categoriesThisMonth}
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 720, marginTop: 22, lineHeight: 1.55 }}>
          {totals.templates.toLocaleString()}{t.templatesAnalyzed}
          {totals.freePct}{t.free}
          {topOpp && (
            <>
              <b style={{ color: 'var(--text)' }}>{topOppName}</b>
              {t.with}
              <b style={{ color: 'var(--blue)' }}>{topOpp.blue_ocean_count}{t.blueOceanNiches}</b>.
            </>
          )}
        </p>
      </section>

      {/* ─── Section 1: Top opportunity ─── */}
      {topOpp && (
        <HomeSection
          eyebrow={t.featureCategories}
          title={t.topOpp}
          link={{ label: t.viewAllCategories, href: '#all-categories' }}
        >
          <Link href={`/category/${topOpp.category_name}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div
              className="card2 interactive accent"
              style={{ padding: 28, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32, alignItems: 'center' }}
            >
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--accent)', marginBottom: 10 }}>
                  #1 &middot; {t.topCategory}
                </div>
                <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.08, textWrap: 'balance' as const, textTransform: 'capitalize' as const }}>
                  {topOppName}
                </div>
                {topOpp.key_insights?.[0] && (
                  <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginTop: 14, lineHeight: 1.6, maxWidth: 560 }}>
                    {topOpp.key_insights[0]}
                  </p>
                )}
                <div style={{ display: 'flex', gap: 28, alignItems: 'flex-end', marginTop: 22, flexWrap: 'wrap' as const }}>
                  <HomeMetric v={topOpp.blue_ocean_count} l={t.blueNiches} color="var(--blue)" />
                  <HomeMetric v={topOpp.total_templates} l={t.templates} />
                  <HomeMetric v={topOpp.total_niches} l={t.totalNiches} />
                  <HomeMetric v={`${topOppFreePct}%`} l={t.freeLabel} />
                </div>
              </div>
              <HeroBentoGrid thumbnails={heroThumbnails} />
            </div>
          </Link>
        </HomeSection>
      )}

      {/* ─── Section 2: Snapshot ─── */}
      <HomeSection eyebrow={t.snapshot} title={t.thisMonthGlance}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2,
          background: 'var(--border)', border: '1px solid var(--border)',
          borderRadius: 16, overflow: 'hidden',
        }}>
          <BigStat v={totals.templates.toLocaleString()} l={t.templatesAnalyzedLabel} />
          <BigStat v={totals.blue} l={t.blueOceanNichesLabel} color="var(--blue)" />
          <BigStat v={totals.niches} l={t.totalNichesLabel} color="var(--yellow)" />
          <BigStat v={`${totals.freePct}%`} l={t.freeShare} color="var(--green)" />
        </div>
      </HomeSection>

      {/* ─── Section 3: Leaderboard (2-column) ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 60 }}>

        {/* Left: Most blue ocean niches */}
        <HomeSection
          eyebrow={t.leaderboard}
          title={t.mostBlueOcean}
          link={{ label: t.viewAllCategories, href: '#all-categories' }}
          inline
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {topByBlue.map((c, i) => (
              <RankRow
                key={c.id}
                rank={i + 1}
                href={`/category/${c.category_name}`}
                title={c.category_name.replace(/-/g, ' ')}
                subtitle={`${c.total_templates} templates \u00B7 ${c.total_niches} niches`}
                metric={c.blue_ocean_count}
                metricLabel={t.blue}
                metricColor="var(--blue)"
              />
            ))}
          </div>
        </HomeSection>

        {/* Right: Top gainers */}
        <HomeSection
          eyebrow={t.featureCompare}
          title={t.topGainers}
          link={{ label: t.openCompare, href: '/compare' }}
          inline
        >
          {gainers.length === 0 ? (
            <div style={{ padding: '40px 12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
              {t.noGainers}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {gainers.map((c, i) => (
                <RankRow
                  key={c.id}
                  rank={i + 1}
                  href={`/category/${c.category_name}`}
                  title={c.category_name.replace(/-/g, ' ')}
                  subtitle={`${c.prevTemplates} \u2192 ${c.total_templates} templates`}
                  metric={`+${c.delta}`}
                  metricLabel={`+${c.pct}%`}
                  metricColor="var(--green)"
                />
              ))}
            </div>
          )}
        </HomeSection>
      </div>

      {/* ─── Section 4: Design Trends ─── */}
      <HomeSection
        eyebrow={t.featureDesignTrends}
        title={t.stylesDominating}
        link={topOpp ? { label: `${t.exploreIn}${topOppName}`, href: `/category/${topOpp.category_name}` } : undefined}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {trendStyles.map((s, i) => (
            <div key={i} className="card2" style={{ padding: 24, position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', top: 0, right: 0, width: 80, height: 80,
                borderRadius: '50%', background: s.color, opacity: 0.12, filter: 'blur(28px)',
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, position: 'relative' }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--text-dim)' }}>
                  #{i + 1} &middot; {t.style}
                </div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.15 }}>{s.style}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 14 }}>
                <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', color: s.color }}>{s.count}</span>
                <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{t.templates.toLowerCase()}</span>
              </div>
            </div>
          ))}
        </div>
      </HomeSection>

      {/* ─── Section 5: Hot Assets ─── */}
      {hotAssets.length > 0 && (
        <HomeSection
          eyebrow={t.featureAssets}
          title={t.hottestAssets}
          link={topOpp ? { label: `${t.seeIn}${topOppName}`, href: `/category/${topOpp.category_name}` } : undefined}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
            {hotAssets.map((r, i) => (
              <div key={i} className="card2" style={{ padding: '16px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-dim)' }}>#{i + 1}</div>
                <div style={{
                  width: 44, height: 44, margin: '10px auto 8px', borderRadius: 10,
                  background: `color-mix(in oklch, ${r.color} 15%, transparent)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ width: 18, height: 18, borderRadius: 5, background: r.color }} />
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.25, textWrap: 'balance' as const, minHeight: 30 }}>{r.name}</div>
                <div style={{ fontSize: 10.5, color: 'var(--text-dim)', marginTop: 4 }}>&times;{r.freq}</div>
              </div>
            ))}
          </div>
        </HomeSection>
      )}

      {/* ─── Section 6: Handpicked Recommendations ─── */}
      {featuredRecs.length > 0 && (
        <HomeSection
          eyebrow={t.featureRecs}
          title={t.handpicked}
          link={topOpp ? { label: t.allRecs, href: `/category/${topOpp.category_name}` } : undefined}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {featuredRecs.map((r, i) => (
              <Link key={i} href={`/category/${r.categorySlug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card2 interactive" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 7,
                      background: 'var(--accent-dim)', color: 'var(--accent)',
                    }}>
                      #{r.rank || i + 1}
                    </span>
                    <span className="badge-zone badge-blue" style={{ marginLeft: 'auto', fontSize: 10 }}>
                      <span className="dot" />Blue ocean
                    </span>
                  </div>
                  <div style={{
                    fontSize: 11, color: 'var(--text-dim)', fontWeight: 600,
                    textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 4,
                  }}>
                    {r.categoryName}
                  </div>
                  <div style={{
                    fontSize: 19, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2,
                    marginBottom: 10, textWrap: 'balance' as const,
                  }}>
                    {r.niche}
                  </div>
                  <p style={{
                    fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55, margin: '0 0 16px', flex: 1,
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
                  }}>
                    {r.why}
                  </p>
                  <div style={{ display: 'flex', gap: 14, fontSize: 12 }}>
                    <div>
                      <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{r.score}</span>{' '}
                      <span style={{ color: 'var(--text-dim)' }}>{t.score}</span>
                    </div>
                    <div>
                      <span style={{ fontWeight: 700, color: 'var(--green)' }}>{r.demand}%</span>{' '}
                      <span style={{ color: 'var(--text-dim)' }}>{t.demand}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </HomeSection>
      )}

      {/* ─── Section 7: All Categories (bento grid) ─── */}
      <section id="all-categories" style={{ marginBottom: 60 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 6 }}>{t.browse}</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.022em', margin: 0 }}>{t.allCategories}</h2>
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600 }}>
            {latestAnalyses.length} {t.categories}
          </span>
        </div>
        <div className="bento stagger">
          {latestAnalyses.map(a => {
            const totalN = Math.max(1, a.blue_ocean_count + (a.yellow_count || 0) + a.red_ocean_count);
            return (
              <div key={a.id} className="col-4">
                <Link href={`/category/${a.category_name}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="card2 interactive" style={{ minHeight: 220, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
                        {a.month}
                      </div>
                      <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2, marginTop: 3, textTransform: 'capitalize' as const }}>
                        {a.category_name.replace(/-/g, ' ')}
                      </div>
                    </div>

                    {a.key_insights?.[0] && (
                      <p style={{
                        fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.55, margin: '0 0 14px', flex: 1,
                        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
                      }}>
                        {a.key_insights[0]}
                      </p>
                    )}

                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 10 }}>
                      <MiniStat v={a.total_templates} l="Tmpl" />
                      <MiniStat v={a.total_pro || 0} l="Pro" color="var(--purple)" />
                      <MiniStat v={a.total_free || 0} l="Free" color="var(--green)" />
                      <div style={{ marginLeft: 'auto', fontSize: 11.5, fontWeight: 600, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 5 }}>
                        {t.open} &rarr;
                      </div>
                    </div>

                    <div>
                      <div className="bar-track" style={{ height: 5 }}>
                        <div style={{ width: `${a.blue_ocean_count / totalN * 100}%`, background: 'var(--blue)' }} />
                        <div style={{ width: `${(a.yellow_count || 0) / totalN * 100}%`, background: 'var(--yellow)' }} />
                        <div style={{ width: `${a.red_ocean_count / totalN * 100}%`, background: 'var(--red)' }} />
                      </div>
                      <div style={{ display: 'flex', gap: 12, marginTop: 7, fontSize: 11, fontWeight: 600 }}>
                        <span style={{ color: 'var(--blue)' }}>&bull; {a.blue_ocean_count}</span>
                        <span style={{ color: 'var(--yellow)' }}>&bull; {a.yellow_count || 0}</span>
                        <span style={{ color: 'var(--red)' }}>&bull; {a.red_ocean_count}</span>
                        <span style={{ marginLeft: 'auto', color: 'var(--text-dim)' }}>{a.total_niches} niches</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
