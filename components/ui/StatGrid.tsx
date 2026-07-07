import type { Stat } from "@/content/chapters";

export default function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <div data-stats className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="glass rounded-2xl p-5">
          <div className="font-display text-3xl font-bold text-gradient sm:text-4xl">{s.value}</div>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-dim">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
