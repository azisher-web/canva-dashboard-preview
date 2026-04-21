'use client';

import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import type { NicheItem } from '@/lib/types';

const ZONE_COLORS: Record<string, string> = {
  red: '#EE5D50',
  yellow: '#FFCE20',
  blue: '#4299e1',
};

interface TreemapContentProps {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  zone: string;
  count: number;
  pct: number;
}

function CustomContent(props: TreemapContentProps) {
  const { x, y, width, height, name, zone, count } = props;
  const color = ZONE_COLORS[zone] || ZONE_COLORS.blue;
  const showLabel = width > 50 && height > 30;
  const showCount = width > 40 && height > 45;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={6}
        ry={6}
        style={{
          fill: color,
          fillOpacity: 0.2,
          stroke: color,
          strokeWidth: 1,
          strokeOpacity: 0.4,
        }}
      />
      {showLabel && (
        <text
          x={x + width / 2}
          y={y + height / 2 - (showCount ? 6 : 0)}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: width > 100 ? 11 : 9,
            fontWeight: 600,
            fill: color,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {name.length > (width / 7) ? name.slice(0, Math.floor(width / 7)) + '…' : name}
        </text>
      )}
      {showCount && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: 9,
            fontWeight: 500,
            fill: '#a3aed0',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {count}
        </text>
      )}
    </g>
  );
}

export default function NicheChart({ data }: { data: NicheItem[] }) {
  const sorted = [...data].sort((a, b) => b.count - a.count);
  const treemapData = sorted.map(n => ({
    name: n.niche,
    size: n.count,
    zone: n.zone,
    count: n.count,
    pct: n.pct,
    pro: n.pro,
    free: n.free,
  }));

  return (
    <div className="w-full" style={{ height: 360 }}>
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={treemapData}
          dataKey="size"
          aspectRatio={4 / 3}
          content={<CustomContent x={0} y={0} width={0} height={0} name="" zone="" count={0} pct={0} />}
        >
          <Tooltip
            content={({ payload }) => {
              if (!payload || !payload.length) return null;
              const d = payload[0].payload;
              const color = ZONE_COLORS[d.zone] || ZONE_COLORS.blue;
              return (
                <div style={{
                  background: '#111c44',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  padding: '10px 14px',
                  fontSize: 12,
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{d.name}</div>
                  <div style={{ color: '#a3aed0' }}>
                    <span style={{ color }}>{d.count} templates</span>
                    {' · '}{d.pct}%{' · '}
                    <span style={{ color, textTransform: 'uppercase', fontWeight: 600, fontSize: 10 }}>{d.zone}</span>
                  </div>
                  {(d.pro !== undefined || d.free !== undefined) && (
                    <div style={{ color: '#707eae', marginTop: 2, fontSize: 11 }}>
                      <span style={{ color: '#a855f7' }}>{d.pro ?? '—'} PRO</span>
                      {' · '}
                      <span style={{ color: '#01B574' }}>{d.free ?? '—'} FREE</span>
                    </div>
                  )}
                </div>
              );
            }}
          />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
}
