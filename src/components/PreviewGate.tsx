'use client';

import React from 'react';

/**
 * PreviewGate — shows first `limit` children, then renders fake blurred items.
 *
 * Security: behind the blur is NOT real data — it's randomly generated gibberish.
 * Even if someone removes the blur via DevTools, they get unreadable text.
 *
 * Usage:
 *   <PreviewGate limit={3} fakeCount={5} columns={1}>
 *     {items.map(item => <ItemCard key={item.id} {...item} />)}
 *   </PreviewGate>
 */

// Generate random gibberish that looks like real text but is unreadable
const CHARS = 'abcdefghijklmnopqrstuvwxyz';
function fakeWord(min = 3, max = 10): string {
  const len = min + Math.floor(Math.random() * (max - min));
  return Array.from({ length: len }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');
}
function fakeSentence(words = 4): string {
  return Array.from({ length: words }, () => fakeWord()).join(' ');
}

// Pre-generate fake data for cards (deterministic per render to avoid hydration mismatch)
function generateFakeCards(count: number, seed: number): { title: string; subtitle: string; values: string[] }[] {
  // Use seed for pseudo-random consistency
  let s = seed;
  const next = () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };

  const word = (min = 3, max = 10) => {
    const len = min + Math.floor(next() * (max - min));
    return Array.from({ length: len }, () => CHARS[Math.floor(next() * CHARS.length)]).join('');
  };
  const sentence = (w = 4) => Array.from({ length: w }, () => word()).join(' ');

  return Array.from({ length: count }, () => ({
    title: sentence(2 + Math.floor(next() * 3)),
    subtitle: sentence(3 + Math.floor(next() * 4)),
    values: Array.from({ length: 2 + Math.floor(next() * 3) }, () =>
      `${Math.floor(next() * 100)}`
    ),
  }));
}

interface PreviewGateProps {
  /** Number of real items to show */
  limit?: number;
  /** Number of fake blurred items to show */
  fakeCount?: number;
  /** Grid columns for fake items (1 = list, 2+ = grid) */
  columns?: number;
  /** Height per fake card */
  cardHeight?: number;
  /** CTA text */
  ctaText?: string;
  /** CTA link */
  ctaLink?: string;
  children: React.ReactNode;
}

export default function PreviewGate({
  limit = 3,
  fakeCount = 5,
  columns = 1,
  cardHeight = 72,
  ctaText = 'Subscribe to kelaskreator.com to unlock all insights',
  ctaLink,
  children,
}: PreviewGateProps) {
  const childArray = React.Children.toArray(children);
  const visibleChildren = childArray.slice(0, limit);
  const hasMore = childArray.length > limit;

  // Generate fake cards with a consistent seed
  const fakeCards = React.useMemo(() => generateFakeCards(fakeCount, 42), [fakeCount]);

  if (!hasMore && childArray.length <= limit) {
    return <>{children}</>;
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Real data — first N items */}
      {visibleChildren}

      {/* Blurred fake data zone */}
      <div style={{ position: 'relative', marginTop: 8 }}>
        {/* Fake cards with blur */}
        <div
          style={{
            filter: 'blur(8px)',
            WebkitFilter: 'blur(8px)',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            pointerEvents: 'none',
            display: columns > 1 ? 'grid' : 'flex',
            gridTemplateColumns: columns > 1 ? `repeat(${columns}, 1fr)` : undefined,
            flexDirection: columns === 1 ? 'column' : undefined,
            gap: 8,
          }}
          aria-hidden="true"
          data-preview-blur="true"
        >
          {fakeCards.map((fake, i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-hover)',
                borderRadius: 12,
                padding: '14px 16px',
                minHeight: cardHeight,
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                {fake.title}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                {fake.subtitle}
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                {fake.values.map((v, j) => (
                  <span key={j} style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-dim)' }}>{v}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            zIndex: 10,
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #6B5BFF, #4299e1)',
              color: '#fff',
              padding: '12px 28px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              boxShadow: '0 8px 32px rgba(107,91,255,0.3)',
              cursor: ctaLink ? 'pointer' : 'default',
              textAlign: 'center',
              maxWidth: 360,
              lineHeight: 1.5,
            }}
          >
            🔒 {ctaText}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)', fontWeight: 500 }}>
            🔓 Preview shows top 3 results only
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * PreviewBlurOverlay — simpler version for wrapping entire sections
 * Renders children normally but with a blur + CTA after the visible portion
 */
export function PreviewBanner({ text }: { text?: string }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '24px 16px',
        margin: '16px 0',
        borderRadius: 14,
        background: 'var(--bg-hover)',
        border: '1px solid var(--border)',
      }}
    >
      <div style={{ fontSize: 24, marginBottom: 8 }}>🔒</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
        {text || 'Subscribe to kelaskreator.com to unlock all insights'}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
        🔓 Subscribe to kelaskreator.com to unlock all insights
      </div>
    </div>
  );
}
