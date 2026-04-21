'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BODashIcon from './BODashIcon';

const NAV_ITEMS = [
  { href: '/',            label: 'Home',       icon: 'home' },
  { href: '/categories',  label: 'Categories', icon: 'folder' },
  { href: '/compare',     label: 'Compare',    icon: 'chart' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  /* Read persisted theme + set density on mount */
  useEffect(() => {
    const saved = (localStorage.getItem('bo_theme') as 'light' | 'dark') || 'light';
    // Default to light theme per design spec
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
    document.documentElement.setAttribute('data-density', 'comfort');
  }, []);

  /* Sync attribute + localStorage whenever theme changes (after mount) */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bo_theme', theme);
  }, [theme]);

  return (
    <aside
      style={{
        width: 256,
        flexShrink: 0,
        background: 'var(--bg-card-solid)',
        borderRight: '1px solid var(--border)',
        padding: '24px 16px',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px', marginBottom: 32 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 11,
            background: 'linear-gradient(135deg, #6B5BFF, #4299e1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(67,24,255,0.28)',
          }}
        >
          <BODashIcon name="sparkles" size={19} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2, color: 'var(--text)' }}>
            Blue Ocean
          </div>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
            Preview
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 12px',
                borderRadius: 11,
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                background: isActive ? 'var(--accent-dim)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.18s ease',
              }}
            >
              <BODashIcon name={item.icon} size={17} />
              {item.label}
              {isActive && (
                <span
                  style={{
                    marginLeft: 'auto',
                    width: 5,
                    height: 5,
                    borderRadius: 3,
                    background: 'var(--accent)',
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Spacer to push bottom section down */}
      <div style={{ flex: 1 }} />

      {/* Theme toggle — positioned above user card */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: 4,
          marginBottom: 12,
          borderRadius: 12,
          background: 'var(--bg-hover)',
          border: '1px solid var(--border)',
        }}
      >
        <button
          onClick={() => setTheme('light')}
          aria-label="Light theme"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            height: 34,
            borderRadius: 9,
            border: 'none',
            background: theme === 'light' ? 'var(--bg-card-solid)' : 'transparent',
            boxShadow: theme === 'light' ? 'var(--shadow-sm)' : 'none',
            cursor: 'pointer',
            color: theme === 'light' ? 'var(--text)' : 'var(--text-dim)',
            fontSize: 12,
            fontWeight: 600,
            fontFamily: 'inherit',
            transition: 'all 0.18s ease',
          }}
        >
          <BODashIcon name="sun" size={13} />
          Light
        </button>
        <button
          onClick={() => setTheme('dark')}
          aria-label="Dark theme"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            height: 34,
            borderRadius: 9,
            border: 'none',
            background: theme === 'dark' ? 'var(--bg-card-solid)' : 'transparent',
            boxShadow: theme === 'dark' ? 'var(--shadow-sm)' : 'none',
            cursor: 'pointer',
            color: theme === 'dark' ? 'var(--text)' : 'var(--text-dim)',
            fontSize: 12,
            fontWeight: 600,
            fontFamily: 'inherit',
            transition: 'all 0.18s ease',
          }}
        >
          <BODashIcon name="moon" size={13} />
          Dark
        </button>
      </div>

    </aside>
  );
}
