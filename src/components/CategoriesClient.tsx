'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import BODashIcon from './BODashIcon';
import DropdownSelect from './DropdownSelect';
import type { Analysis } from '@/lib/types';

// ─── Types ──────────────────────────────────────────────────────────────────

interface CategoriesClientProps {
  analyses: Analysis[];
  /** Map of category_id → language code ('en' | 'id') */
  categoryLangs: Record<number, string>;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

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

const LANG_OPTIONS = [
  { value: 'all', label: 'All languages', prefix: '🌐' },
  { value: 'id', label: 'Bahasa Indonesia', prefix: '🇮🇩' },
  { value: 'en', label: 'English', prefix: '🇬🇧' },
];

// ─── Sub-components ─────────────────────────────────────────────────────────

function MiniStat({ v, l, color }: { v: number; l: string; color?: string }) {
  return (
    <div>
      <div style={{ fontSize: 16, fontWeight: 700, color: color || 'var(--text)', lineHeight: 1 }}>{v}</div>
      <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 3 }}>{l}</div>
    </div>
  );
}

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '9px 14px', borderRadius: 12,
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      minWidth: 260,
    }}>
      <BODashIcon name="search" size={14} color="var(--text-dim)" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1, background: 'transparent', border: 'none', outline: 'none',
          color: 'var(--text)', fontSize: 13, fontFamily: 'inherit',
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            width: 18, height: 18, borderRadius: 6,
            background: 'var(--bg-hover)', color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer', padding: 0,
          }}
        >
          <BODashIcon name="close" size={9} />
        </button>
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function CategoriesClient({ analyses, categoryLangs }: CategoriesClientProps) {
  const [query, setQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState('all');

  // Extract unique months sorted descending (latest first)
  const months = useMemo(() => {
    const set = new Set<string>();
    analyses.forEach(a => { if (a.month) set.add(a.month); });
    return Array.from(set).sort().reverse();
  }, [analyses]);

  const [selectedMonth, setSelectedMonth] = useState(() => months[0] || '');

  const monthOptions = useMemo(() =>
    months.map(m => ({ value: m, label: formatMonth(m) })),
    [months]
  );

  // Filter by selected month
  const monthAnalyses = useMemo(
    () => analyses.filter(a => a.month === selectedMonth),
    [analyses, selectedMonth],
  );

  // Filter by selected language
  const langFiltered = useMemo(() => {
    if (selectedLang === 'all') return monthAnalyses;
    return monthAnalyses.filter(a => {
      const catLang = categoryLangs[a.category_id];
      return catLang === selectedLang;
    });
  }, [monthAnalyses, selectedLang, categoryLangs]);

  // Filter by search query
  const filtered = useMemo(() => {
    const q = (query || '').toLowerCase().trim();
    if (!q) return langFiltered;
    return langFiltered.filter(a =>
      a.category_name.toLowerCase().includes(q) ||
      (a.key_insights && a.key_insights.some(ins => ins.toLowerCase().includes(q)))
    );
  }, [langFiltered, query]);

  const monthLabel = formatMonth(selectedMonth);
  const langObj = LANG_OPTIONS.find(l => l.value === selectedLang);
  const langLabel = langObj ? langObj.label : 'All';

  return (
    <div className="rise">

      {/* ─── Header ─── */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        gap: 24, marginBottom: 28, paddingBottom: 24,
        borderBottom: '1px solid var(--border)', flexWrap: 'wrap',
      }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 10 }}>
            Browse &middot; Categories
          </div>
          <h1 className="display-xl" style={{ margin: 0, fontSize: 44, letterSpacing: '-0.025em', lineHeight: 1.05 }}>
            All categories
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 12 }}>
            {filtered.length} of {monthAnalyses.length} shown &middot; {monthLabel} &middot; {langLabel}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <DropdownSelect
            value={selectedMonth}
            onChange={setSelectedMonth}
            icon="folder"
            minWidth={160}
            options={monthOptions}
          />
          <DropdownSelect
            value={selectedLang}
            onChange={setSelectedLang}
            minWidth={180}
            options={LANG_OPTIONS}
          />
        </div>
      </div>

      {/* ─── Search ─── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 24 }}>
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder="Search category or insight…"
        />
      </div>

      {/* ─── Grid / Empty state ─── */}
      {filtered.length === 0 ? (
        <div className="card2" style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
          <BODashIcon name="search" size={28} color="var(--text-dim)" />
          <div style={{ fontSize: 16, fontWeight: 600, marginTop: 12, color: 'var(--text)' }}>
            No categories match
          </div>
          <div style={{ fontSize: 13, marginTop: 6 }}>
            Try clearing the search or switching filter.
          </div>
        </div>
      ) : (
        <div className="bento stagger">
          {filtered.map(a => {
            const totalN = Math.max(1, a.blue_ocean_count + (a.yellow_count || 0) + a.red_ocean_count);
            const catLang = categoryLangs[a.category_id] || 'en';
            return (
              <div key={a.id} className="col-4">
                <Link href={`/category/${a.category_name}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="card2 interactive" style={{ minHeight: 220, display: 'flex', flexDirection: 'column' }}>
                    {/* Eyebrow + Name */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{
                        fontSize: 11, color: 'var(--text-dim)', fontWeight: 600,
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}>
                        {a.month}
                        <span style={{ opacity: 0.5 }}>&middot;</span>
                        <span>{catLang === 'id' ? '🇮🇩' : '🇬🇧'}</span>
                      </div>
                      <div style={{
                        fontSize: 19, fontWeight: 700, letterSpacing: '-0.01em',
                        lineHeight: 1.2, marginTop: 3, textTransform: 'capitalize',
                      }}>
                        {a.category_name.replace(/-/g, ' ')}
                      </div>
                    </div>

                    {/* Insight (3-line clamp) */}
                    {a.key_insights?.[0] && (
                      <p style={{
                        fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.55,
                        margin: '0 0 14px', flex: 1,
                        display: '-webkit-box', WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
                      }}>
                        {a.key_insights[0]}
                      </p>
                    )}

                    {/* Mini stats row */}
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 10 }}>
                      <MiniStat v={a.total_templates} l="Tmpl" />
                      <MiniStat v={a.total_pro || 0} l="Pro" color="var(--purple)" />
                      <MiniStat v={a.total_free || 0} l="Free" color="var(--green)" />
                      <div style={{
                        marginLeft: 'auto', fontSize: 11.5, fontWeight: 600,
                        color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 5,
                      }}>
                        Open &rarr;
                      </div>
                    </div>

                    {/* Zone progress bar + legend */}
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
                        <span style={{ marginLeft: 'auto', color: 'var(--text-dim)' }}>
                          {a.total_niches} niches
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
