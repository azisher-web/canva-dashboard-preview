import { createServiceClient } from '@/lib/supabase';
import type { Analysis } from '@/lib/types';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getAnalyses(): Promise<Analysis[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('analyses')
    .select('id, category_id, category_name, month, total_templates, total_pro, total_free, total_niches, blue_ocean_count, yellow_count, red_ocean_count, created_at, key_insights')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Analysis[];
}

export default async function CategoriesPage() {
  const analyses = await getAnalyses();
  const months = [...new Set(analyses.map(a => a.month))].sort().reverse();
  const latestMonth = months[0] || '';
  // Preview: show only Instagram categories
  const PREVIEW_CATEGORIES = ['instagram-posts', 'kiriman-instagram'];
  const latestAnalyses = analyses.filter(a => a.month === latestMonth && PREVIEW_CATEGORIES.includes(a.category_name));

  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 6 }}>Browse</div>
      <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.022em', margin: '0 0 20px' }}>All Categories</h2>
      <div className="bento stagger">
        {latestAnalyses.map(a => {
          const totalN = Math.max(1, a.blue_ocean_count + (a.yellow_count || 0) + a.red_ocean_count);
          return (
            <div key={a.id} className="col-6">
              <Link href={`/category/${a.category_name}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card2 interactive" style={{ minHeight: 200, display: 'flex', flexDirection: 'column', padding: '20px 24px' }}>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{a.month}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2, marginTop: 3, textTransform: 'capitalize' }}>{a.category_name.replace(/-/g, ' ')}</div>
                  </div>
                  {a.key_insights?.[0] && (
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55, margin: '0 0 14px', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                      {a.key_insights[0]}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 10 }}>
                    <div><div style={{ fontSize: 16, fontWeight: 700 }}>{a.total_templates}</div><div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 3 }}>Tmpl</div></div>
                    <div><div style={{ fontSize: 16, fontWeight: 700, color: 'var(--purple)' }}>{a.total_pro || 0}</div><div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 3 }}>Pro</div></div>
                    <div><div style={{ fontSize: 16, fontWeight: 700, color: 'var(--green)' }}>{a.total_free || 0}</div><div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 3 }}>Free</div></div>
                    <div style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 5 }}>Open →</div>
                  </div>
                  <div>
                    <div className="bar-track" style={{ height: 5 }}>
                      <div style={{ width: `${a.blue_ocean_count / totalN * 100}%`, background: 'var(--blue)' }} />
                      <div style={{ width: `${(a.yellow_count || 0) / totalN * 100}%`, background: 'var(--yellow)' }} />
                      <div style={{ width: `${a.red_ocean_count / totalN * 100}%`, background: 'var(--red)' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 7, fontSize: 11, fontWeight: 600 }}>
                      <span style={{ color: 'var(--blue)' }}>• {a.blue_ocean_count}</span>
                      <span style={{ color: 'var(--yellow)' }}>• {a.yellow_count || 0}</span>
                      <span style={{ color: 'var(--red)' }}>• {a.red_ocean_count}</span>
                      <span style={{ marginLeft: 'auto', color: 'var(--text-dim)' }}>{a.total_niches} niches</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Blurred placeholder for other categories */}
      <div style={{ position: 'relative', marginTop: 16 }}>
        <div style={{ filter: 'blur(8px)', userSelect: 'none', pointerEvents: 'none' }} aria-hidden="true">
          <div className="bento">
            {['Gruvento Xyloph', 'Bolvish Praxen', 'Trenza Moxplay', 'Frelkino Quarvex'].map((name, i) => (
              <div key={i} className="col-6">
                <div className="card2" style={{ minHeight: 180, padding: '20px 24px' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600 }}>2026-04</div>
                  <div style={{ fontSize: 22, fontWeight: 700, marginTop: 3 }}>{name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 10 }}>Zupvane britmane quolfex narvito jelvane fluxweld grothane.</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, zIndex: 10 }}>
          <a href="https://kelaskreator.com/" target="_blank" rel="noopener noreferrer" style={{ background: 'linear-gradient(135deg, #6B5BFF, #4299e1)', color: '#fff', padding: '12px 28px', borderRadius: 12, fontSize: 14, fontWeight: 700, boxShadow: '0 8px 32px rgba(107,91,255,0.3)', textAlign: 'center', maxWidth: 360, lineHeight: 1.5, textDecoration: 'none', display: 'inline-block', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}>
            🔒 Subscribe to kelaskreator.com to unlock all insights
          </a>
          <div style={{ fontSize: 12, color: 'var(--text-dim)', fontWeight: 500 }}>🔓 More categories available with full access</div>
        </div>
      </div>
    </div>
  );
}
