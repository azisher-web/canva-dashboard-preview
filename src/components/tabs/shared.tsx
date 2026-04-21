'use client';

import React from 'react';
import BODashIcon from '@/components/BODashIcon';

/* ── Types for tab components ── */
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

export type { CreatorStat, KeywordStat, ProFreeOpportunity, NicheRanking, CategoryInsights } from '@/lib/category-data';

export const THUMB_GRADIENTS = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #a18cd1, #fbc2eb)',
  'linear-gradient(135deg, #fccb90, #d57eeb)',
  'linear-gradient(135deg, #e0c3fc, #8ec5fc)',
];

/* ── Tooltip ── */
export function Tooltip({ children, text }: { children: React.ReactNode; text: string }) {
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
export function Donut({ pct, color }: { pct: number; color: string }) {
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
export function OvMetric({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 26, fontWeight: 800, color, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{label}</div>
    </div>
  );
}

/* ── TemplateThumbnail ── */
export function TemplateThumbnail({ title, canvaUrl, thumbnailUrl, index, size = 72, showTitle = false, isPro = false }: {
  title: string; canvaUrl?: string; thumbnailUrl?: string; index: number; size?: number; showTitle?: boolean; isPro?: boolean;
}) {
  const inner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div
        style={{
          width: size, height: size, borderRadius: 10, overflow: 'hidden',
          background: thumbnailUrl ? 'var(--bg-hover)' : THUMB_GRADIENTS[index % THUMB_GRADIENTS.length],
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--border)',
          position: 'relative',
        }}
      >
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: size > 64 ? 14 : 10, fontWeight: 600, color: '#fff', textAlign: 'center', padding: 4, lineHeight: 1.2 }}>
            {title.slice(0, 20)}
          </span>
        )}
        {isPro && (
          <span style={{
            position: 'absolute', top: 3, right: 3,
            background: 'linear-gradient(135deg, #a855f7, #6d28d9)',
            color: '#fff', fontSize: 7, fontWeight: 700,
            padding: '1px 4px', borderRadius: 4,
            letterSpacing: '0.04em', lineHeight: 1.4,
          }}>PRO</span>
        )}
      </div>
      {showTitle && (
        <div style={{
          fontSize: 10, color: 'var(--text-muted)', textAlign: 'center',
          maxWidth: size + 8, overflow: 'hidden', textOverflow: 'ellipsis',
          whiteSpace: 'nowrap', lineHeight: 1.3,
        }}>
          {title}
        </div>
      )}
    </div>
  );
  if (canvaUrl) return <a href={canvaUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>{inner}</a>;
  return inner;
}

/* ── ScoreBar ── */
export function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', width: 80, flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--bg-hover)', overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', borderRadius: 3, background: color, transition: 'width 0.5s ease' }} />
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color, width: 32, textAlign: 'right' }}>{value}</div>
    </div>
  );
}

/* ── EmptyState ── */
export function EmptyState({ text }: { text: string }) {
  return (
    <div className="card2" style={{ padding: 48, textAlign: 'center' }}>
      <BODashIcon name="sparkles" size={28} />
      <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 12, fontWeight: 500 }}>{text}</div>
    </div>
  );
}

/* ── Drawer Shell ── */
export function DrawerShell({ kind, onClose, children }: { kind: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <span className="eyebrow">{kind} detail</span>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-hover)', width: 32, height: 32, borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)', border: 'none', cursor: 'pointer',
            }}
          >
            <BODashIcon name="close" size={15} />
          </button>
        </div>
        {children}
      </aside>
    </>
  );
}
