import Link from "next/link";
import { OFFICIAL } from "@/data/gn";
import { PageHead } from "@/components/ui";

export const metadata = { title: "진로체험·자료" };

const GROUPS = [
  {
    t: "🎒 진로체험 찾고 신청하기",
    items: [
      { ...OFFICIAL.ggoomgil, d: "교육부·한국직업능력연구원의 진로체험 지원 전산망. 지역(경남)과 분야를 골라 체험 프로그램을 검색하고 학교를 통해 신청해요." },
      { name: "커리어넷 진로체험·동영상", url: "https://www.career.go.kr/", d: "직업인 인터뷰, 학과 소개 영상, 진로 동영상을 볼 수 있어요." },
      { ...OFFICIAL.work24, d: "고용노동부 고용24에서 청소년 직업심리검사와 직업정보를 확인해요." },
    ],
  },
  {
    t: "🏫 학교·과목 정보",
    items: [
      { ...OFFICIAL.hscredit, d: "고교학점제 안내, 과목 안내서, 학교별 교육과정 정보를 볼 수 있어요." },
      { ...OFFICIAL.schoolinfo, d: "학교별 학생 수, 교원 수, 교육과정, 시설 등 공시 정보를 비교해요." },
      { ...OFFICIAL.gneHigh, d: "경남 고교 현황, 전형 요강, 원서 접수, 배정 조회를 하는 공식 고입 포털이에요." },
      { ...OFFICIAL.hifive, d: "전국 특성화고·마이스터고의 학과와 취업 정보를 찾아요." },
    ],
  },
  {
    t: "🎯 대입·대학 정보",
    items: [
      { ...OFFICIAL.adiga, d: "대학별 전형 계획, 권장과목, 입시 결과와 대입 상담(1600-1615)을 제공해요." },
      { ...OFFICIAL.academy, d: "대학별 학과, 취업률, 등록금 등 공시 정보를 비교해요." },
      { ...OFFICIAL.suneung, d: "수능 시행 계획과 2028 수능 예시 문항을 확인해요." },
      { ...OFFICIAL.ebsi, d: "수능 강의와 대입 설명회 자료를 볼 수 있어요." },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="space-y-8">
      <PageHead tone="amber" eyebrow="도구" title="진로체험·자료" desc="진로체험 신청부터 학교·대입 정보까지, 공식 사이트를 목적별로 모았어요. 체험을 다녀오면 마이로드에 기록해 두세요." />
      <section>
        <h2 className="mb-3 text-lg font-bold">마이로드 진로 자료실</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/future", t: "미래 신산업 진로 탐색", d: "8대 신산업 퀴즈 20문항 · 미래 트렌드 친화도 15문항 · 진로·학업 로드맵" },
            { href: "/transition", t: "고3 진로 전환기 10차시", d: "수능 이후 대학 생활·근로·금융·안전까지 수업 자료와 체크리스트" },
            { href: "/guide", t: "진로·학업설계 가이드북", d: "학생·보호자·교사가 함께 읽는 5장 안내서" },
            { href: "/industry", t: "경남 산업 진로 지도", d: "조선·항공우주·기계·나노 등 지역 산업과 연결된 직업·학교" },
            { href: "/portfolio", t: "포트폴리오 작성", d: "진로활동·192학점 로드맵·독서 포트폴리오, 제출용 보고서" },
            { href: "/plan", t: "체험 후 기록하기", d: "계기 → 한 일 → 알게 된 점 → 다음 걸음 4단계 성찰" },
          ].map((c) => (
            <Link key={c.href} href={c.href} className="card transition hover:border-brand-300">
              <div className="font-bold">{c.t}</div>
              <p className="mt-1 text-sm text-slate-600">{c.d}</p>
            </Link>
          ))}
        </div>
      </section>
      {GROUPS.map((g) => (
        <section key={g.t}>
          <h2 className="mb-3 text-lg font-bold">{g.t}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {g.items.map((i) => (
              <a key={i.url + i.name} href={i.url} target="_blank" rel="noreferrer" className="card transition hover:border-brand-200">
                <div className="font-bold">{i.name} ↗</div>
                <p className="mt-1 text-sm text-slate-600">{i.d}</p>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
