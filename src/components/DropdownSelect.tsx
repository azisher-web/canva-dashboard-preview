'use client';

import React, { useState, useRef, useEffect } from 'react';
import BODashIcon from './BODashIcon';

export interface DropdownOption {
  value: string;
  label: string;
  /** Optional prefix like flag emoji */
  prefix?: string;
}

interface DropdownSelectProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  /** Leading icon name for BODashIcon */
  icon?: string;
  /** Minimum width of the trigger */
  minWidth?: number;
}

export default function DropdownSelect({ value, options, onChange, icon, minWidth = 140 }: DropdownSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const selected = options.find(o => o.value === value);
  const displayLabel = selected ? `${selected.prefix ? selected.prefix + ' ' : ''}${selected.label}` : value;

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '9px 14px',
          borderRadius: 10,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          fontSize: 13,
          fontWeight: 600,
          fontFamily: 'inherit',
          color: 'var(--text)',
          cursor: 'pointer',
          minWidth,
          justifyContent: 'space-between',
          transition: 'border-color 0.15s ease',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon && <BODashIcon name={icon} size={14} color="var(--text-dim)" />}
          {displayLabel}
        </span>
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            opacity: 0.6,
            flexShrink: 0,
          }}
        >
          <path d="M2 3.5 L5 6.5 L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Menu */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            minWidth: '100%',
            zIndex: 50,
            background: 'var(--bg-card-solid)',
            border: '1px solid var(--border-strong, var(--border))',
            borderRadius: 12,
            padding: 6,
            boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
          }}
        >
          {options.map(opt => {
            const isActive = opt.value === value;
            return (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: isActive ? 'var(--bg-hover)' : 'transparent',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--text)' : 'var(--text-secondary, var(--text-muted))',
                  fontSize: 13,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.12s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-hover)';
                }}
                onMouseLeave={e => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                <span>
                  {opt.prefix && <span style={{ marginRight: 6 }}>{opt.prefix}</span>}
                  {opt.label}
                </span>
                {isActive && <BODashIcon name="sparkles" size={12} color="var(--accent)" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
