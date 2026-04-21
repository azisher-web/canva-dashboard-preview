'use client';

import { useState } from 'react';
import type { NicheItem } from '@/lib/types';
import ZoneBadge from './ZoneBadge';

type Filter = 'all' | 'blue' | 'yellow' | 'red';

export default function NicheTable({ niches }: { niches: NicheItem[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const filtered = niches.filter(n => {
    if (filter !== 'all' && n.zone !== filter) return false;
    if (search && !n.niche.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: niches.length },
    { key: 'blue', label: 'Blue', count: niches.filter(n => n.zone === 'blue').length },
    { key: 'yellow', label: 'Yellow', count: niches.filter(n => n.zone === 'yellow').length },
    { key: 'red', label: 'Red', count: niches.filter(n => n.zone === 'red').length },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="section-title">All Niches</h2>
        <span className="text-xs font-medium" style={{ color: 'var(--text-dim)' }}>
          {filtered.length} of {niches.length}
        </span>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-3 mb-3">
        <div className="tab-filter">
          {tabs.map(t => (
            <button key={t.key}
              className={`tab-item ${filter === t.key ? 'active' : ''}`}
              onClick={() => setFilter(t.key)}>
              {t.label} ({t.count})
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search niche..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full px-3.5 py-2 rounded-xl text-sm mb-3 outline-none"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
        }}
      />

      {/* Table with internal scroll */}
      <div className="scroll-container">
        <table className="data-table">
          <thead>
            <tr className="text-left">
              <th className="pr-3">Niche</th>
              <th className="pr-3 text-right">Count</th>
              <th className="pr-3 text-right">PRO</th>
              <th className="pr-3 text-right">FREE</th>
              <th className="pr-3 text-right">%</th>
              <th>Zone</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((n, i) => (
              <tr key={i}>
                <td className="pr-3 font-medium text-[13px]">{n.niche}</td>
                <td className="pr-3 text-right text-[13px]">{n.count}</td>
                <td className="pr-3 text-right text-[13px]" style={{ color: 'var(--purple)' }}>{n.pro ?? '—'}</td>
                <td className="pr-3 text-right text-[13px]" style={{ color: 'var(--green)' }}>{n.free ?? '—'}</td>
                <td className="pr-3 text-right text-[13px]" style={{ color: 'var(--text-muted)' }}>{n.pct}%</td>
                <td><ZoneBadge zone={n.zone} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
