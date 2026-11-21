"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHead } from "@/components/ui";

type Chapter = { t: string; sub: string; body: React.ReactNode; cta?: { href: string; label: string } };

const Box = ({ title, children, tone = "slate" }: { title: string; children: React.ReactNode; tone?: "slate" | "brand" | "amber" | "emerald" }) => {
  const c = { slate: "bg-slate-50 border-slate-200", brand: "bg-brand-50 border-brand-200", amber: "bg-amber-50 border-amber-200", emerald: "bg-emerald-50 border-emerald-200" }[tone];
  return (
    <div className={`rounded-2xl border p-4 ${c}`}>
      <div className="font-bold">{title}</div>
      <div className="mt-1 text-[0.95em] leading-relaxed text-slate-700">{children}</div>
    </div>
  );
};

const CHAPTERS: Chapter[] = [
  {
    t: "진로·학업설계란?",
    sub: "꿈과 매일의 수업을 잇는 일",
    body: (
      <div className="space-y-4">
        <p>
          진로·학업설계는 ‘장래희망 적기’나 ‘입시 상담’이 아니에요. <b>내가 어떤 사람이고 무엇에 관심이 있는지 알아보고, 그 관심을 키우기 위해 무엇을 어떻게 배울지 스스로 계획하는 과정</b>이에요. 고교학점제에서는 학생마다 듣는 과목이 달라지기 때문에 이 설계가 더 중요해졌어요.
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          <Box title="① 진로 탐색" tone="slate">나는 무엇을 좋아하고 잘할까? 흥미·적성·가치관을 알아보고 직업 세계를 넓게 탐색해요.</Box>
          <Box title="② 학업 설계 (핵심)" tone="brand">그 관심을 키우려면 어떤 과목을 배우고 어떤 탐구를 할까? 3년간의 배움을 계획해요.</Box>
          <Box title="③ 진학·취업" tone="slate">쌓아 온 배움과 경험으로 다음 단계(고교, 대학, 취업)에 도전해요.</Box>
        </div>
        <h3 className="text-lg font-bold">꼭 기억할 세 가지 원리</h3>
        <div className="space-y-3">
          <Box title="원리 1 · 진로는 ‘가설’이에요" tone="amber">
            지금 정한 진로는 평생의 정답이 아니라 경험하면서 다듬어 가는 첫 번째 가설이에요. 직업 이름 하나에 매달리기보다 ‘어떤 문제를 해결하고 싶은지’, ‘어떤 가치를 이루고 싶은지’를 생각해 보세요.
          </Box>
          <Box title="원리 2 · 거꾸로 설계해요" tone="amber">
            관심 분야 → 대학 학과 → 그 학과가 원하는 고교 과목 → 지금 할 일 순서로 거슬러 올라가면, 막연했던 계획이 구체적인 행동으로 바뀌어요.
          </Box>
          <Box title="원리 3 · 기초는 넓게, 관심은 깊게" tone="amber">
            국어·수학·영어와 공통과목은 어떤 진로에서도 힘이 돼요. 기초를 탄탄히 하면서 관심 분야의 과목과 탐구로 깊이를 더하세요.
          </Box>
        </div>
      </div>
    ),
    cta: { href: "/discover", label: "나 알기부터 시작하기" },
  },
  {
    t: "5단계 실천 로드맵",
    sub: "질문에서 시작해 실천과 성찰로",
    body: (
      <div className="space-y-3">
        {[
          ["1. 나 알기", "흥미·가치관·강점을 탐색해요. 공식 진로심리검사 결과와 비교하면 더 정확해요.", "/discover"],
          ["2. 넓게 탐색하기", "직업과 학과를 둘러보고 관심 가는 것을 찜해요. 경남 산업과 연결된 직업도 살펴보세요.", "/jobs"],
          ["3. 길 잇기", "찜한 직업·학과에서 거꾸로 고교 과목과 지금 할 일을 연결하고, 진로 가설을 한 문장으로 써요.", "/path"],
          ["4. 설계하기", "중학생은 고교 유형과 학교를, 고등학생은 192학점 3개년 과목을 설계해요.", "/highschool"],
          ["5. 실천·성찰하기", "학기마다 할 일을 정하고, 활동 후에는 ‘계기 → 한 일 → 알게 된 점 → 다음 걸음’으로 기록해요.", "/plan"],
        ].map(([t, d, h]) => (
          <Link key={t} href={h} className="block rounded-2xl border border-slate-200 p-4 hover:border-brand-300">
            <div className="font-bold">{t}</div>
            <div className="text-[0.95em] text-slate-600">{d}</div>
          </Link>
        ))}
        <p className="text-sm text-slate-500">한 번에 끝나는 과정이 아니에요. 학기마다 1~5단계를 다시 돌며 가설을 고쳐 나가요.</p>
      </div>
    ),
  },
  {
    t: "학년별 성장 로드맵",
    sub: "중1부터 고3까지 무엇을 할까?",
    body: (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-[0.95em]">
          <thead className="bg-slate-50 text-xs text-slate-500">
            <tr>
              <th className="p-3">학년</th>
              <th className="p-3">핵심 과제</th>
              <th className="p-3">추천 활동</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["중1", "나를 알아가기 (자유학기)", "흥미 탐색, 주제선택·동아리 체험, 독서 습관"],
              ["중2", "관심 분야 좁히기", "공식 진로검사, 직업인 인터뷰, 진로 체험(꿈길)"],
              ["중3", "고교 선택과 준비", "고교 유형 비교, 경남 고교 설명회, 고입 일정 확인, 진로연계학기"],
              ["고1", "공통과목 다지기 · 과목 선택", "진로 가설 세우기, 2학년 수강 신청, 동아리 활동"],
              ["고2", "선택과목 깊이 배우기", "수업 속 탐구, 세특 쌓기, 3학년 과목 확정"],
              ["고3", "진학·취업 준비", "학생부 정리, 전형 전략, 수능·원서 준비"],
            ].map(([g, k, a]) => (
              <tr key={g} className="border-t border-slate-100 align-top">
                <td className="p-3 font-extrabold text-brand-700">{g}</td>
                <td className="p-3 font-semibold">{k}</td>
                <td className="p-3 text-slate-600">{a}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Box title="동아리·자율활동 팁" tone="emerald">활동의 ‘양’보다 ‘연결’이 중요해요. 한 가지 관심을 수업, 동아리, 독서, 탐구로 이어 가면 나만의 성장 이야기가 돼요.</Box>
          <Box title="기록 습관" tone="emerald">활동이 끝나면 바로 기록하세요. 시간이 지나면 무엇을 느꼈는지 잊어버려요. 마이로드의 활동 기록과 포트폴리오를 활용해 보세요.</Box>
        </div>
      </div>
    ),
    cta: { href: "/plan", label: "학기별 계획 세우기" },
  },
  {
    t: "나만의 과목 설계법",
    sub: "전공에서 거꾸로 찾는 과목 선택",
    body: (
      <div className="space-y-4">
        <ol className="space-y-2">
          {[
            "관심 학과 2~3개를 정해요. (학과 백과에서 찜하기)",
            "학과별 핵심 과목(★)과 권장 과목(☆)을 확인해요.",
            "내 학교 교육과정 편제표에서 그 과목이 몇 학년 몇 학기에 열리는지 찾아요.",
            "선수과목 순서(예: 물리학 → 역학과 에너지)를 지켜 학기별로 배치해요.",
            "필수 이수 학점(84)·국수영 상한(81)·총 192학점을 확인해요.",
            "학교에 없는 과목은 공동교육과정·온라인학교로 들을 수 있는지 선생님께 여쭤봐요.",
          ].map((s, i) => (
            <li key={s} className="flex gap-3 rounded-xl border border-slate-200 p-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
        <Box title="예시 · 항공우주공학과를 꿈꾸는 경남 학생" tone="brand">
          핵심 과목: 물리학, 역학과 에너지, 미적분Ⅱ, 기하 → 2학년 1학기 물리학, 2학기 역학과 에너지, 3학년에 미적분Ⅱ·기하 배치. 사천의 항공우주 산업 견학과 연결된 탐구 주제(양력, 복합재료)를 수업 속 탐구로 이어 가요.
        </Box>
      </div>
    ),
    cta: { href: "/credits", label: "192학점 설계 해 보기" },
  },
  {
    t: "꿈이 바뀌었을 때 (Plan B)",
    sub: "유연한 재설계와 브릿지 스토리",
    body: (
      <div className="space-y-4">
        <p>진로가 바뀌는 것은 실패가 아니라 탐색이 잘 되고 있다는 신호예요. 중요한 것은 바뀐 이유를 설명할 수 있는 것이에요.</p>
        <div className="grid gap-3 md:grid-cols-3">
          <Box title="1. 공통 분모 찾기" tone="amber">이전 꿈과 새 꿈에 공통으로 필요한 과목·역량을 찾아요. (길 잇기의 ‘꿈이 바뀌어도 든든한 과목’)</Box>
          <Box title="2. 연결 과목 더하기" tone="amber">새 진로에 필요한 핵심 과목을 남은 학기에 배치해요. 늦었다고 생각될 때는 융합선택·진로선택 과목을 활용해요.</Box>
          <Box title="3. 브릿지 스토리 쓰기" tone="amber">‘무엇을 경험했고 → 어떤 점을 깨달아 → 왜 관심이 옮겨 갔는지’를 한 단락으로 정리해요.</Box>
        </div>
        <Box title="브릿지 스토리 예시" tone="slate">
          “로봇공학자를 꿈꾸며 로봇 동아리에서 센서 데이터를 다루다가, 기계를 만드는 것보다 데이터로 문제를 찾는 일이 더 즐겁다는 것을 알게 되었다. 그래서 2학년부터 확률과 통계, 데이터 과학을 선택해 데이터 분석가로 진로를 넓혔다.”
        </Box>
      </div>
    ),
    cta: { href: "/path", label: "Plan B 지도 보기" },
  },
];

export default function GuidePage() {
  const [ch, setCh] = useState(0);
  const [big, setBig] = useState(false);
  useEffect(() => {
    try {
      setBig(localStorage.getItem("myroad:guide-big") === "1");
    } catch {}
  }, []);
  const c = CHAPTERS[ch];
  return (
    <div>
      <PageHead title="진로·학업설계 가이드북" desc="학생, 보호자, 선생님이 함께 읽는 5장짜리 안내서예요. 진로·학업설계의 원리부터 학년별 로드맵, 과목 설계법, 진로가 바뀌었을 때의 대처까지 담았어요." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr] [&>*]:min-w-0">
        <nav className="card h-fit p-2 lg:sticky lg:top-20" aria-label="가이드북 목차">
          {CHAPTERS.map((x, i) => (
            <button key={x.t} onClick={() => setCh(i)} aria-current={ch === i} className={`flex w-full items-start gap-2 rounded-xl px-3 py-2 text-left ${ch === i ? "bg-brand-50 text-brand-800" : "hover:bg-slate-50"}`}>
              <span className="text-xs font-bold text-slate-400">{i + 1}장</span>
              <span>
                <span className="block text-sm font-bold">{x.t}</span>
                <span className="block text-xs text-slate-500">{x.sub}</span>
              </span>
            </button>
          ))}
          <div className="mt-2 flex items-center justify-between border-t border-slate-100 px-3 pt-2 text-xs text-slate-500">
            글자 크기
            <button
              className="chip"
              onClick={() => {
                setBig(!big);
                try {
                  localStorage.setItem("myroad:guide-big", big ? "0" : "1");
                } catch {}
              }}
            >
              {big ? "크게 ✓" : "보통"}
            </button>
          </div>
        </nav>
        <article className={`card ${big ? "text-lg" : ""}`}>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>제 {ch + 1}장 / 5</span>
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full bg-brand-500" style={{ width: `${((ch + 1) / 5) * 100}%` }} />
            </div>
          </div>
          <h2 className="mt-2 text-2xl font-extrabold">{c.t}</h2>
          <p className="mb-4 text-slate-500">{c.sub}</p>
          {c.body}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
            <button className="btn-ghost" disabled={ch === 0} onClick={() => setCh(ch - 1)}>← 이전 장</button>
            {c.cta && <Link href={c.cta.href} className="btn-primary">{c.cta.label} →</Link>}
            <button className="btn-ghost" disabled={ch === 4} onClick={() => setCh(ch + 1)}>다음 장 →</button>
          </div>
        </article>
      </div>
    </div>
  );
}
