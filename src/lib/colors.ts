// 분야별 색 (카드 아이콘 타일·포인트 선)
export type Hue = { tile: string; text: string; bar: string };
const H = (tile: string, text: string, bar: string): Hue => ({ tile, text, bar });
const P = {
  teal: H("bg-brand-50", "text-brand-700", "bg-brand-500"),
  amber: H("bg-amber-50", "text-amber-700", "bg-amber-400"),
  violet: H("bg-violet-50", "text-violet-700", "bg-violet-400"),
  sky: H("bg-sky-50", "text-sky-700", "bg-sky-400"),
  rose: H("bg-rose-50", "text-rose-700", "bg-rose-400"),
  coral: H("bg-coral-50", "text-coral-700", "bg-coral-400"),
  emerald: H("bg-emerald-50", "text-emerald-700", "bg-emerald-400"),
  indigo: H("bg-indigo-50", "text-indigo-700", "bg-indigo-400"),
  lime: H("bg-lime-50", "text-lime-700", "bg-lime-500"),
  slate: H("bg-slate-100", "text-slate-700", "bg-slate-400"),
};
export const FIELD_HUE: Record<string, Hue> = {
  it: P.indigo, eng: P.sky, sci: P.violet, med: P.rose, edu: P.amber, biz: P.coral, law: P.slate, art: P.violet, media: P.coral, sports: P.emerald, life: P.amber, env: P.lime,
};
export const TRACK_HUE: Record<string, Hue> = {
  hum: P.amber, soc: P.coral, biz: P.rose, nat: P.violet, ai: P.indigo, eng: P.sky, med: P.rose, edu: P.emerald, art: P.violet,
};
export const GROUP_HUE: Record<string, Hue> = {
  과학계열: P.emerald, 체육계열: P.lime, 예술계열: P.violet, "외국어·국제계열": P.coral, 국어: P.rose, 수학: P.indigo, 영어: P.sky, 사회: P.amber, 과학: P.emerald, "기술·가정/정보": P.teal, "제2외국어/한문": P.coral, 체육: P.lime, 예술: P.violet, 교양: P.slate,
};
