'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BODashIcon from './BODashIcon';

const NAV_ITEMS = [
  { href: '/',            label: 'Home',       icon: 'home' },
  { href: '/categories',  label: 'Categories', icon: 'folder' },
  { href: '/compare',     label: 'Compare',    icon: 'compare' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /* Detect mobile viewport */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  /* Close mobile sidebar on navigation */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* Read persisted theme + set density on mount */
  useEffect(() => {
    const saved = (localStorage.getItem('bo_theme') as 'light' | 'dark') || 'light';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
    document.documentElement.setAttribute('data-density', 'comfort');
  }, []);

  /* Sync attribute + localStorage whenever theme changes */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bo_theme', theme);
  }, [theme]);

  return (
    <>
      {/* Mobile hamburger button */}
      {isMobile && !mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          style={{
            position: 'fixed',
            top: 12,
            left: 12,
            zIndex: 50,
            width: 40,
            height: 40,
            borderRadius: 10,
            border: '1px solid var(--border)',
            background: 'var(--bg-card-solid)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
        </button>
      )}

      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 45,
            transition: 'opacity 0.2s ease',
          }}
        />
      )}

      <aside
        style={{
          width: 256,
          flexShrink: 0,
          background: 'var(--bg-card-solid)',
          borderRight: '1px solid var(--border)',
          padding: '24px 16px',
          position: 'fixed',
          top: 0,
          left: isMobile && !mobileOpen ? -280 : 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
          overflowY: 'auto',
          transition: 'left 0.25s ease',
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

      {/* Theme toggle */}
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
    </>
  );
}
