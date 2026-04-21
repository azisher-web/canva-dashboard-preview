'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BODashIcon from './BODashIcon';

const TABS = [
  { key: '', label: 'Overview', icon: 'dashboard' },
  { key: 'niches', label: 'Niches', icon: 'folder' },
  { key: 'outliers', label: 'Outliers', icon: 'sparkles' },
  { key: 'recs', label: 'Recommendations', icon: 'lightbulb' },
  { key: 'trends', label: 'Design Trends', icon: 'palette' },
  { key: 'assets', label: 'Asset Opportunities', icon: 'shapes' },
  { key: 'insights', label: 'Advanced', icon: 'sparkles' },
];

export default function CategoryTabNav({ slug }: { slug: string }) {
  const pathname = usePathname();
  const base = `/category/${slug}`;

  return (
    <div style={{ marginTop: 24, marginBottom: 24, overflowX: 'auto' }}>
      <div className="tabs2" style={{ display: 'inline-flex' }}>
        {TABS.map(t => {
          const href = t.key ? `${base}/${t.key}` : base;
          const isActive = t.key
            ? pathname === href || pathname.startsWith(href + '/')
            : pathname === base || pathname === base + '/';
          return (
            <Link
              key={t.key || 'overview'}
              href={href}
              className={`tab2 ${isActive ? 'active' : ''}`}
              style={{ textDecoration: 'none' }}
              prefetch={true}
            >
              <BODashIcon name={t.icon} size={14} /> {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
