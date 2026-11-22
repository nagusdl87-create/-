import Link from "next/link";
import { EXPLORE, TOOLS } from "@/lib/journey";
import { Logo } from "./Logo";
import { CreditLine } from "./Credit";

const OFFICIAL = [
  ["경상남도교육청", "https://www.gne.go.kr/"],
  ["경남 고입포털", "https://highschool.gne.go.kr/s10/hsa/user/main.do"],
  ["고교학점제", "https://www.hscredit.kr/"],
  ["커리어넷", "https://www.career.go.kr/"],
  ["꿈길", "https://www.ggoomgil.go.kr/"],
  ["고용24", "https://www.work24.go.kr/"],
  ["어디가", "https://www.adiga.kr/"],
];

export function Footer() {
  return (
    <footer className="no-print mt-8 bg-ink-900 pb-24 text-slate-300 sm:pb-0">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="inline-block rounded-xl bg-white px-3 py-2">
            <Logo />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">경남 중·고등학생을 위한 진로·학업 설계 플랫폼. 흥미 탐색부터 경남 고교 선택, 192학점 설계, 2028 대입까지 한 흐름으로.</p>
        </div>
        {[
          { t: "탐색", items: EXPLORE.map((i) => [i.label, i.href]) },
          { t: "도구", items: TOOLS.slice(0, 7).map((i) => [i.label, i.href]) },
        ].map((g) => (
          <nav key={g.t} aria-label={g.t}>
            <div className="text-sm font-semibold text-white">{g.t}</div>
            <ul className="mt-3 space-y-2 text-sm">
              {g.items.map(([l, h]) => (
                <li key={h}>
                  <Link href={h} className="text-slate-300 hover:text-white">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <nav aria-label="공식 사이트">
          <div className="text-sm font-semibold text-white">공식 사이트</div>
          <ul className="mt-3 space-y-2 text-sm">
            {OFFICIAL.map(([n, u]) => (
              <li key={u}>
                <a href={u} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white">
                  {n} ↗
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl space-y-2 px-4 py-6 text-xs leading-relaxed text-slate-300">
          <CreditLine className="text-slate-300 [&_a]:text-brand-200 [&_b]:text-white" />
          <p>
            마이로드 경남은 진로 탐색을 돕는 참고용 서비스이며 경상남도교육청의 공식 서비스가 아닙니다. 고교 정보는 경상남도교육청 고등학교 입학포털·공공데이터포털·교육정보 개방포털(NEIS)의 공개 자료를 바탕으로 했고, 입학 전형과 교육과정은 바뀔 수 있으니 원서 접수 전 반드시 교육청과 학교의 공식 안내를 확인하세요. 흥미 탐색 결과는 표준화된 심리검사가 아니며, 입력한 내용은 이 기기의 브라우저에만 저장됩니다. 로그인(선택)한 경우에만 본인 기록이 서버에 저장됩니다.
          </p>
          <p>
            <Link href="/privacy" className="font-semibold text-slate-200 underline-offset-2 hover:underline">개인정보 처리 방침</Link>
            <span className="mx-2" aria-hidden>·</span>
            <Link href="/account" className="text-slate-300 underline-offset-2 hover:underline">내 기록 백업·로그인</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
