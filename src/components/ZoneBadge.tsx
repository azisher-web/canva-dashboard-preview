export default function ZoneBadge({ zone }: { zone: string }) {
  const cls = zone === 'red' ? 'zone-red' : zone === 'yellow' ? 'zone-yellow' : 'zone-blue';
  return (
    <span className={`${cls} text-[11px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wide`}>
      {zone}
    </span>
  );
}
