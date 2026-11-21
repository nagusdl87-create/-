import { RIASEC, RIASEC_ORDER } from "@/data/riasec";
import type { Scores } from "@/lib/match";

export function Radar({ scores, size = 260 }: { scores: Scores; size?: number }) {
  const c = size / 2;
  const r = size / 2 - 38;
  const pt = (i: number, v: number) => {
    const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    return [c + Math.cos(a) * r * v, c + Math.sin(a) * r * v];
  };
  const poly = RIASEC_ORDER.map((k, i) => pt(i, Math.max(0.04, scores[k] / 100)).join(",")).join(" ");
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-auto w-full max-w-[300px]" role="img" aria-label="흥미 유형 육각형 그래프">
      {[0.25, 0.5, 0.75, 1].map((lv) => (
        <polygon key={lv} points={RIASEC_ORDER.map((_, i) => pt(i, lv).join(",")).join(" ")} fill="none" stroke="#e2e8f0" />
      ))}
      {RIASEC_ORDER.map((_, i) => {
        const [x, y] = pt(i, 1);
        return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="#e2e8f0" />;
      })}
      <polygon points={poly} fill="rgba(47,123,245,0.18)" stroke="#2f7bf5" strokeWidth={2.5} strokeLinejoin="round" />
      {RIASEC_ORDER.map((k, i) => {
        const [x, y] = pt(i, Math.max(0.04, scores[k] / 100));
        const [lx, ly] = pt(i, 1.22);
        return (
          <g key={k}>
            <circle cx={x} cy={y} r={4} fill={RIASEC[k].color} />
            <text x={lx} y={ly - 5} textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155">
              {RIASEC[k].name}
            </text>
            <text x={lx} y={ly + 10} textAnchor="middle" fontSize="11" fill="#64748b">
              {scores[k]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
