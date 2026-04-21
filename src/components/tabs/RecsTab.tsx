'use client';

import React from 'react';
import { TemplateThumbnail, ScoreBar, DrawerShell, THUMB_GRADIENTS } from './shared';
import BODashIcon from '@/components/BODashIcon';
import { PreviewBanner } from '@/components/PreviewGate';
import type { Recommendation, Analysis } from '@/lib/types';

type TemplateInfo = { thumbnail: string; url: string; is_pro: boolean };

/* ── Rec Drawer Content (internal) ── */
function RecDrawerContent({ rec, templateMap, analysis }: { rec: Recommendation; templateMap: Record<string, TemplateInfo>; analysis: Analysis }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyKeywords = () => {
    if (!rec.keywords?.length) return;
    const text = rec.keywords.join(', ');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadMarkdown = () => {
    const categoryName = analysis?.category_name?.replace(/-/g, ' ') || 'Unknown Category';
    const month = analysis?.month || '';
    const lines: string[] = [
      `# Blue Ocean Brief: ${rec.niche}`,
      '',
      `> Auto-generated from Blue Ocean Finder — ${categoryName} (${month})`,
      '',
      '## Overview',
      '',
      `- **Category:** ${categoryName}`,
      `- **Niche:** ${rec.niche}`,
      `- **Rank:** #${rec.rank}`,
      `- **Opportunity Score:** ${rec.score}/100`,
      `- **Demand:** ${rec.potentialDemand}/100`,
      `- **Competition:** ${rec.competition}/100`,
      `- **Existing Templates:** ${rec.templates}`,
      '',
      '## Why This Is an Opportunity',
      '',
      rec.why,
      '',
      '## Template Ideas',
      '',
      ...(rec.ideas || []).map((idea, i) => `${i + 1}. ${idea}`),
      '',
      '## Target Keywords',
      '',
      (rec.keywords || []).map(k => `\`${k}\``).join(', '),
      '',
      '## Reference Templates',
      '',
      ...(rec.examples || []).map(ex => {
        const info = templateMap[ex.title];
        const url = info?.url || ex.url || '';
        const pro = info?.is_pro ? ' (Pro)' : ' (Free)';
        return url ? `- [${ex.title}](${url})${pro}` : `- ${ex.title}${pro}`;
      }),
      '',
      '---',
      '',
      '## Prompt for LLM',
      '',
      'Use the data above to help me create a design brief for Canva templates targeting this blue ocean niche. Consider:',
      '',
      '1. What visual styles would work best for this niche?',
      '2. What color palettes and typography would appeal to the target audience?',
      '3. What specific template variations should I create (sizes, formats)?',
      '4. How should I differentiate from the existing templates listed above?',
      '5. What keywords and titles should I use for maximum discoverability?',
      '',
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brief-${rec.niche.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 8px' }}>{rec.niche}</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span className="badge-zone badge-blue"><span className="dot" />Blue ocean opportunity</span>
        <button
          onClick={handleDownloadMarkdown}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '5px 12px', borderRadius: 7,
            border: '1px solid var(--border)',
            background: 'var(--bg-card)',
            color: 'var(--accent)',
            fontSize: 11, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'inherit', transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--accent)'; }}
        >
          <BODashIcon name="download" size={11} />
          Download Brief (.md)
        </button>
      </div>
      <p style={{ marginTop: 18, color: 'var(--text-secondary)', fontSize: 14.5, lineHeight: 1.7 }}>{rec.why}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 22 }}>
        <ScoreBar label="Opportunity score" value={rec.score} color="var(--accent)" />
        <ScoreBar label="Demand" value={rec.potentialDemand} color="var(--green)" />
        <ScoreBar label="Competition" value={rec.competition} color="var(--red)" />
      </div>

      {/* Template ideas — numbered list */}
      <div className="eyebrow" style={{ marginTop: 22, marginBottom: 10 }}>Template ideas</div>
      <ol style={{ paddingLeft: 20, margin: 0, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8, listStyleType: 'decimal' }}>
        {(rec.ideas || []).map((idea, j) => (
          <li key={j} style={{ paddingLeft: 4, marginBottom: 4 }}>{idea}</li>
        ))}
      </ol>

      {/* Keywords with copy button */}
      {rec.keywords?.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 22, marginBottom: 10 }}>
            <span className="eyebrow" style={{ margin: 0 }}>Keywords</span>
            <button
              onClick={handleCopyKeywords}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 7,
                border: '1px solid var(--border)',
                background: copied ? 'var(--green-dim)' : 'var(--bg-card)',
                color: copied ? 'var(--green)' : 'var(--text-muted)',
                fontSize: 11, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'inherit', transition: 'all 0.2s ease',
              }}
            >
              <BODashIcon name={copied ? 'check' : 'copy'} size={11} />
              {copied ? 'Copied!' : 'Copy all'}
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {rec.keywords.map((k, j) => <span key={j} className="pill">{k}</span>)}
          </div>
        </>
      )}

      {/* Template examples — linked to Canva with titles */}
      {rec.examples && rec.examples.length > 0 && (
        <>
          <div className="eyebrow" style={{ marginTop: 22, marginBottom: 10 }}>Template examples</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {rec.examples.slice(0, 6).map((ex, j) => {
              const info = templateMap[ex.title];
              return (
                <TemplateThumbnail
                  key={j}
                  title={ex.title}
                  canvaUrl={info?.url || ex.url}
                  thumbnailUrl={info?.thumbnail}
                  index={j}
                  size={96}
                  showTitle
                  isPro={info?.is_pro}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Empty State (internal) ── */
function EmptyState({ text }: { text: string }) {
  return (
    <div className="card2" style={{ padding: 48, textAlign: 'center' }}>
      <BODashIcon name="sparkles" size={28} />
      <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 12, fontWeight: 500 }}>{text}</div>
    </div>
  );
}

/* ── RecsTab (default export) ── */
export default function RecsTab({ recs, templateMap, analysis }: {
  recs: Recommendation[];
  templateMap: Record<string, { thumbnail: string; url: string; is_pro: boolean }>;
  analysis: Analysis;
}) {
  const [openRec, setOpenRec] = React.useState<Recommendation | null>(null);

  if (recs.length === 0) return <EmptyState text="No recommendations available." />;

  const VISIBLE_LIMIT = 3;
  const visibleRecs = recs.slice(0, VISIBLE_LIMIT);
  const blurredRecs = recs.slice(VISIBLE_LIMIT);

  const renderRecCard = (rec: Recommendation, i: number, clickable: boolean) => (
    <div key={i} className={`col-6 card2 ${clickable ? 'interactive' : ''}`} onClick={clickable ? () => setOpenRec(rec) : undefined} style={{ padding: 22, cursor: clickable ? 'pointer' : 'default' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 7, background: 'var(--accent-dim)', color: 'var(--accent)' }}>
          #{rec.rank}
        </span>
        <span className="badge-zone badge-blue"><span className="dot" />Blue ocean</span>
      </div>
      <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2, marginBottom: 10 }}>
        {rec.niche}
      </h3>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55, margin: '0 0 16px',
        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
        {rec.why}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        <ScoreBar label="Score" value={rec.score} color="var(--accent)" />
        <ScoreBar label="Demand" value={rec.potentialDemand} color="var(--green)" />
        <ScoreBar label="Competition" value={rec.competition} color="var(--red)" />
      </div>
      {rec.keywords?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: rec.examples?.length ? 14 : 0 }}>
          {rec.keywords.slice(0, 5).map((k, j) => <span key={j} className="pill">{k}</span>)}
        </div>
      )}
      {rec.examples && rec.examples.length > 0 && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
          {rec.examples.slice(0, 3).map((ex, j) => {
            const info = templateMap[ex.title];
            return (
              <TemplateThumbnail key={j} title={ex.title} canvaUrl={info?.url || ex.url} thumbnailUrl={info?.thumbnail} index={j + i * 3} size={64} showTitle isPro={info?.is_pro} />
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Visible top 3 */}
      <div className="bento">
        {visibleRecs.map((rec, i) => renderRecCard(rec, i, true))}
      </div>

      {/* Blurred remaining with CTA */}
      {blurredRecs.length > 0 && (
        <div style={{ position: 'relative', marginTop: 12 }}>
          <div style={{ filter: 'blur(8px)', WebkitFilter: 'blur(8px)', userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }} aria-hidden="true">
            <div className="bento">
              {blurredRecs.map((rec, i) => renderRecCard(rec, i + VISIBLE_LIMIT, false))}
            </div>
          </div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, zIndex: 10 }}>
            <div style={{ background: 'linear-gradient(135deg, #6B5BFF, #4299e1)', color: '#fff', padding: '12px 28px', borderRadius: 12, fontSize: 14, fontWeight: 700, boxShadow: '0 8px 32px rgba(107,91,255,0.3)', textAlign: 'center', maxWidth: 360, lineHeight: 1.5 }}>
              🔒 Subscribe to kelaskreator.com to unlock all insights
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', fontWeight: 500 }}>
              🔓 {blurredRecs.length} more recommendations available with full access
            </div>
          </div>
        </div>
      )}

      {/* Drawer */}
      {openRec && (
        <DrawerShell kind="Recommendation" onClose={() => setOpenRec(null)}>
          <RecDrawerContent rec={openRec} templateMap={templateMap} analysis={analysis} />
        </DrawerShell>
      )}
    </>
  );
}
