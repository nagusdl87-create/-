"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, ChevronDown, Compass, GraduationCap, HardDriveDownload, Lightbulb, ListChecks, Route, School, Search } from "lucide-react";
import { PageHead } from "@/components/ui";

type Step = { href: string; title: string; icon: typeof Compass; what: string; how: string[]; stuck?: string };

const MS: Step[] = [
  { href: "/discover", title: "1. 나 알기", icon: Compass, what: "내가 좋아하는 것과 잘하는 것을 알아봐요.",
    how: ["짧은 질문에 ‘나와 가까운 쪽’을 골라요. 정답은 없어요.", "결과로 나오는 ‘흥미 유형’을 확인해요.", "내가 중요하게 생각하는 가치(예: 안정, 도전)와 강점도 골라 봐요."],
    stuck: "고르기 어려우면 ‘조금 더 가까운 쪽’을 골라요. 나중에 다시 해도 돼요." },
  { href: "/jobs", title: "2. 직업 찾기", icon: Lightbulb, what: "나와 맞는 직업을 찾아서 마음에 들면 찜해요.",
    how: ["위쪽 검색창에 관심 있는 말(예: 게임, 동물, 요리)을 써 봐요.", "직업을 눌러서 하는 일, 하루 모습, 필요한 능력을 읽어요.", "마음에 들면 하트(찜)를 눌러요. 찜한 직업은 다음 단계에서 쓰여요."],
    stuck: "무슨 직업이 있는지 모르겠으면 ‘분야별 직업’에서 큰 분야부터 둘러봐요." },
  { href: "/path", title: "3. 길 잇기", icon: Route, what: "찜한 직업 → 가는 학과 → 고등학교에서 들을 과목을 한 줄로 이어 봐요.",
    how: ["찜한 직업을 고르면 관련 학과가 나와요.", "학과를 누르면 고등학교에서 중요한 과목(핵심·권장 과목)이 나와요."],
    stuck: "아직 찜한 직업이 없으면 먼저 ‘직업 찾기’에서 하나만 찜해 보세요." },
  { href: "/highschool", title: "4. 고교 고르기", icon: School, what: "어떤 종류의 고등학교가 있는지 비교하고, 경남의 고등학교를 찾아봐요.",
    how: ["일반고·특목고·특성화고 같은 유형의 차이를 읽어요.", "경남 고교 찾기에서 지도로 학교 위치와 학과, 급식을 확인해요.", "고입 일정(D-day)도 한눈에 볼 수 있어요."] },
  { href: "/plan", title: "5. 계획·기록", icon: ListChecks, what: "이번 학기에 할 일을 정하고, 한 활동을 기록으로 남겨요.",
    how: ["학기별 할 일을 체크해요.", "체험·독서·활동을 짧게 적어 두면 나중에 자기소개서와 면접에 도움이 돼요."] },
];

const HS: Step[] = [
  { href: "/discover", title: "1. 나 알기", icon: Compass, what: "내가 좋아하는 것과 잘하는 것을 알아봐요.",
    how: ["짧은 질문에 ‘나와 가까운 쪽’을 골라요. 정답은 없어요.", "결과로 나오는 흥미 유형과 가치관·강점을 확인해요."],
    stuck: "결과가 마음에 안 들면 다시 해도 돼요. 진로는 계속 바뀌는 게 자연스러워요." },
  { href: "/majors", title: "2. 학과·직업", icon: GraduationCap, what: "가고 싶은 학과나 되고 싶은 직업을 찾아 찜해요.",
    how: ["위쪽 검색창이나 학과 백과에서 관심 있는 이름을 찾아요.", "학과 소개, 배우는 내용, 졸업 후 진로를 읽어요.", "마음에 들면 찜해요. 찜한 학과는 과목 설계에서 바로 쓸 수 있어요."],
    stuck: "정하지 못했어도 괜찮아요. 192학점 설계에서는 ‘계열’(인문·자연 등)만 골라도 시작할 수 있어요." },
  { href: "/path", title: "3. 길 잇기", icon: Route, what: "학과가 원하는 고등학교 과목을 확인해요.",
    how: ["찜한 학과를 고르면 핵심·권장 과목이 나와요.", "과목 이름을 눌러 어떤 과목인지 읽어 봐요."] },
  { href: "/credits", title: "4. 과목 설계", icon: Calculator, what: "3년 동안 들을 과목을 학기별로 담아서 192학점을 맞춰요. 가장 어려운 단계라서 아래에 자세히 적었어요.",
    how: ["목표(학과·직업)를 고르면 3년 모범안이 나와요.", "‘내 설계로 가져오기’를 누르고 내 마음대로 고쳐요.", "‘먼저 이것부터 고쳐요’의 순서대로 고쳐요."] },
  { href: "/plan", title: "5. 계획·기록", icon: ListChecks, what: "할 일, 성적, 활동을 기록해요.",
    how: ["학기별 할 일과 성적을 적어요.", "활동을 짧게 적어 두면 포트폴리오로 모아 볼 수 있어요."] },
];

const CREDIT_STEPS = [
  { t: "목표를 골라요", d: "되고 싶은 학과나 직업의 이름을 검색해서 눌러요. 아직 모르겠으면 ‘인문·자연·공학’ 같은 계열만 골라도 돼요. 목표는 나중에 바꿔도 돼요." },
  { t: "3년 모범안을 봐요", d: "고른 목표에 맞는 과목이 6학기(1학년 1학기~3학년 2학기)로 나뉘어 나와요. 과목 아래의 작은 글씨가 ‘왜 이 과목인지’ 알려 줘요. 모범안은 정답이 아니라 참고 예시예요." },
  { t: "내 설계로 가져와요", d: "‘모범안을 내 설계로 가져오기’를 누르면 아래 6칸의 표에 과목이 담겨요. 이미 담은 과목이 있으면 ‘빈 곳만 채우기’를 눌러요." },
  { t: "내 마음대로 고쳐요", d: "과목 옆 ✕를 누르면 빼고, ‘+ 과목 담기’로 넣어요. 학점 숫자는 칸에서 바꿀 수 있어요. 별(★)은 목표에 중요한 과목이에요." },
  { t: "빨간 안내부터 고쳐요", d: "‘먼저 이것부터 고쳐요’에 가장 급한 것 3개가 나와요. 옆의 버튼을 누르면 자동으로 고쳐 줘요. 모두 고치면 ‘큰 문제는 없어요’가 나와요." },
  { t: "학교 편제표를 맞춰 봐요(선택)", d: "‘학교 편제표 등록’에서 우리 학교를 고르면, 학교가 정한 과목은 잠기고 내가 고를 수 있는 칸(선택군)만 남아요. 실제 수강 신청과 똑같이 연습할 수 있어요." },
  { t: "저장하고 선생님과 이야기해요", d: "‘학업설계서 인쇄’로 종이나 PDF로 만들 수 있어요. 설계 내용은 이 기기에 저장돼요. 다른 기기에서도 보려면 ‘내 기록 백업’을 써요." },
];

const WORDS: { w: string; d: string }[] = [
  { w: "고교학점제", d: "고등학생이 자기 진로에 맞춰 과목을 직접 골라 듣고, 학점을 모아 졸업하는 제도예요. 수업을 학기마다 학점으로 세어요." },
  { w: "학점", d: "과목을 얼마나 오래 배우는지 나타내는 숫자예요. 보통 한 과목이 3~4학점이에요." },
  { w: "192학점", d: "졸업에 필요한 학점이에요. 교과(국어·수학 같은 수업) 174학점 + 창의적 체험활동 18학점으로 이뤄져요." },
  { w: "교과와 창체", d: "교과는 국어·수학·영어 같은 수업이고, 창체(창의적 체험활동)는 자율·동아리·진로 활동이에요. 이 사이트의 과목 설계는 교과 174학점을 짜요." },
  { w: "편제표", d: "우리 학교가 3년 동안 어떤 과목을 몇 학점씩, 어느 학기에 가르치는지 적은 표예요. 학교 누리집이나 고교학점제 누리집에서 볼 수 있어요." },
  { w: "지정 과목", d: "학교가 정해 둔 과목이에요. 모두가 같이 들어서 내가 고를 수 없어요(잠금 표시)." },
  { w: "선택군(택N)", d: "‘이 과목들 중에서 N개를 골라요’라는 묶음이에요. 예를 들어 ‘선택군 A 택2’는 여러 과목 중 2개만 고르는 거예요." },
  { w: "공통·일반선택·진로선택·융합선택", d: "공통은 모두가 듣는 기본 과목, 일반선택은 기초 심화, 진로선택은 내 진로에 맞춘 심화, 융합선택은 여러 분야를 섞은 과목이에요." },
  { w: "선수과목", d: "먼저 배워야 다음 과목을 따라갈 수 있는 과목이에요. 예: 물리학을 먼저 배우고 역학과 에너지를 들어요." },
  { w: "핵심·권장 과목", d: "★핵심은 그 학과나 직업에 특히 중요한 과목, ☆권장은 들으면 도움이 되는 과목이에요. 대학마다 다를 수 있어서 학과 페이지의 원문 링크를 꼭 확인해요." },
  { w: "수능 출제 과목", d: "수능 시험에 나오는 과목이에요. 2028 수능은 국어·수학·영어가 모두 같은 공통 범위로 바뀌어요." },
  { w: "5등급제 내신", d: "과목 성적을 1~5등급으로 나누는 새 방식이에요(2025년 고1부터). 1등급은 상위 10% 이내예요." },
  { w: "세특", d: "‘세부능력 및 특기사항’의 줄임말이에요. 선생님이 과목마다 내가 배우고 탐구한 내용을 적어 주는 기록이에요." },
];

const FAQ: { q: string; a: string }[] = [
  { q: "로그인해야 쓸 수 있나요?", a: "아니요. 로그인하지 않아도 모든 기능을 쓸 수 있어요. 로그인은 선택이에요." },
  { q: "내가 쓴 기록은 어디에 저장돼요?", a: "로그인하지 않으면 지금 쓰는 기기(브라우저) 안에만 저장되고 서버로 보내지 않아요. 로그인하면 내 계정에 저장해서 다른 기기에서도 이어 쓸 수 있어요." },
  { q: "기록이 사라졌어요!", a: "다른 기기, 다른 브라우저, ‘시크릿 모드’에서는 이전 기록이 보이지 않아요. 원래 쓰던 기기와 브라우저로 열어 보세요. 브라우저 기록을 지우면 사라질 수 있으니 ‘도구 → 내 기록 백업’에서 파일로 저장해 두면 안전해요." },
  { q: "다른 기기(집·학교)에서도 이어 쓰고 싶어요.", a: "‘내 기록 백업’에서 파일을 저장해서 다른 기기에서 불러오거나, 로그인(구글 계정)해서 동기화하면 돼요." },
  { q: "선생님이나 친구가 내 기록을 볼 수 있나요?", a: "기본은 아무도 볼 수 없어요. ‘교사·관리자에게 내 포트폴리오 공개’를 직접 켠 경우에만 선생님이 읽을 수 있고, 언제든 끌 수 있어요. 성적과 이메일은 공개되지 않아요. 친구끼리 서로 볼 수는 없어요." },
  { q: "모범안대로만 해야 하나요?", a: "아니요. 모범안은 참고 예시예요. 같은 학과라도 학교에서 열리는 과목이 다르고, 내 관심도 달라요. 마음에 드는 부분만 가져와서 바꿔 쓰세요." },
  { q: "우리 학교가 편제표 목록에 없어요.", a: "학교 누리집이나 고교학점제 누리집에서 우리 학교 편제표를 보면서 ‘학교 편제표 등록’에서 직접 만들 수 있어요. 없을 때는 ‘자유 설계’로 먼저 연습해도 돼요." },
  { q: "지도가 안 보여요.", a: "인터넷 연결을 확인하고 새로고침해 보세요. 카카오 지도가 안 열리면 다른 지도(OpenStreetMap)로 자동으로 바뀌어요." },
  { q: "휴대폰에서 앱처럼 쓰고 싶어요.", a: "브라우저 메뉴에서 ‘홈 화면에 추가’를 누르면 앱처럼 쓸 수 있어요. 인터넷이 약해도 한 번 열어 본 화면은 다시 볼 수 있어요." },
  { q: "글씨가 작거나 눈이 불편해요.", a: "위쪽의 ‘화면’ 버튼으로 밝은 화면과 어두운 화면을 바꿀 수 있어요. 브라우저의 확대 기능(Ctrl과 + 키)도 쓸 수 있어요." },
];

const STUCK: { q: string; a: string }[] = [
  { q: "과목이 담기지 않아요", a: "편제표 모드에서는 ‘택N’의 N개까지만 고를 수 있어요. 이미 다 골랐다면 먼저 다른 과목을 눌러서 빼 주세요. 다른 학기에서 이미 고른 과목은 회색으로 막혀요." },
  { q: "경고가 너무 많이 떠요", a: "‘먼저 이것부터 고쳐요’의 1번부터 하나씩 고치세요. 빨간 경고가 대부분 한꺼번에 사라져요. 파란 ‘참고’는 꼭 고치지 않아도 돼요." },
  { q: "국어·수학·영어가 81학점을 넘었대요", a: "세 교과를 합쳐 81학점까지만 인정돼요. 선택과목 하나를 빼고 다른 교과(예술·과학·사회 등)로 바꿔 보세요." },
  { q: "선수과목 순서가 틀렸대요", a: "‘순서 자동으로 바꾸기’ 버튼을 누르면 먼저 배울 과목을 앞 학기로 옮겨 줘요. 직접 하려면 앞 학기의 과목을 빼고 다시 담으세요." },
  { q: "목표를 바꾸고 싶어요", a: "목표 칸의 ✕를 누르고 새 학과·직업을 고르세요. 이미 담은 과목은 그대로 남아요. 새 모범안으로 바꾸려면 ‘모범안을 내 설계로 가져오기’를 누르세요." },
];

export function HelpBody() {
  const [stage, setStage] = useState<"ms" | "hs">("hs");
  const [q, setQ] = useState("");
  const steps = stage === "ms" ? MS : HS;
  const words = useMemo(() => WORDS.filter((x) => !q.trim() || (x.w + x.d).includes(q.trim())), [q]);

  return (
    <div>
      <PageHead eyebrow="도움말" title="이용 안내" desc="처음이어도 괜찮아요. 순서대로 따라 하면 돼요. 모르는 말은 아래 ‘어려운 말 풀이’에서 찾아보세요." />

      <nav aria-label="이 페이지의 목차" className="no-print mb-6 flex gap-1.5 overflow-x-auto pb-1">
        {[["start", "처음 시작하기"], ["steps", "단계별로 따라 하기"], ["credits", "192학점 설계 따라 하기"], ["words", "어려운 말 풀이"], ["faq", "자주 묻는 질문"], ["stuck", "막힐 때"]].map(([id, l]) => (
          <a key={id} href={`#${id}`} className="chip shrink-0">{l}</a>
        ))}
      </nav>

      <section id="start" className="card mb-6 scroll-mt-24" aria-labelledby="h-start">
        <h2 id="h-start" className="text-lg font-extrabold">처음 시작하기 (3가지만 기억해요)</h2>
        <ol className="mt-3 grid gap-3 sm:grid-cols-3">
          {[
            ["1", "학년을 골라요", "홈 화면에서 ‘중학생’ 또는 ‘고등학생’을 눌러요. 내 학년에 맞는 순서로 안내해 줘요."],
            ["2", "위에서부터 차례로 해요", "화면 위의 5단계(나 알기 → … → 계획·기록)를 순서대로 하면 돼요. 어디까지 했는지 자동으로 표시돼요."],
            ["3", "모르면 이 안내를 열어요", "어려운 말이나 막히는 부분이 생기면 언제든 ‘도구 → 이용 안내’로 오세요."],
          ].map(([n, t, d]) => (
            <li key={n} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white" aria-hidden>{n}</span>
              <div className="mt-2 font-bold">{t}</div>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{d}</p>
            </li>
          ))}
        </ol>
        <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
          알아 두면 좋아요: 정답이 있는 사이트가 아니에요. 진로는 경험하면서 바뀌는 ‘가설’이에요. 바꿔도 괜찮고, 여러 번 해 봐도 돼요.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/" className="btn-primary">홈으로 가서 시작 <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          <Link href="/discover" className="btn-ghost">바로 ‘나 알기’ 하기</Link>
        </div>
      </section>

      <section id="steps" className="mb-6 scroll-mt-24" aria-labelledby="h-steps">
        <h2 id="h-steps" className="text-lg font-extrabold">단계별로 따라 하기</h2>
        <div role="tablist" aria-label="학년 선택" className="mt-2 inline-flex rounded-xl bg-slate-200/60 p-1">
          {([["ms", "중학생"], ["hs", "고등학생"]] as const).map(([k, l]) => (
            <button key={k} role="tab" aria-selected={stage === k} onClick={() => setStage(k)} className={`rounded-lg px-4 py-1.5 text-sm font-semibold ${stage === k ? "bg-white shadow-sm" : "text-slate-500"}`}>{l}</button>
          ))}
        </div>
        <ol className="mt-3 space-y-3">
          {steps.map((s) => (
            <li key={s.title} className="card">
              <div className="flex items-start gap-3">
                <span className="icon-box shrink-0"><s.icon className="h-5 w-5" aria-hidden /></span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold">{s.title}</h3>
                  <p className="mt-0.5 text-sm text-slate-600">{s.what}</p>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
                    {s.how.map((h) => <li key={h}>{h}</li>)}
                  </ol>
                  {s.stuck && <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600"><b>막히면:</b> {s.stuck}</p>}
                  <Link href={s.href} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">이 단계로 가기 <ArrowRight className="h-4 w-4" aria-hidden /></Link>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="credits" className="card mb-6 scroll-mt-24" aria-labelledby="h-credits">
        <h2 id="h-credits" className="text-lg font-extrabold">192학점 설계, 이렇게 따라 하세요</h2>
        <p className="mt-1 text-sm text-slate-600">가장 어려운 부분이라 7걸음으로 나눴어요. 한 걸음씩만 하면 돼요. 중간에 멈추고 나중에 이어서 해도 기록이 남아요.</p>
        <ol className="mt-3 space-y-2">
          {CREDIT_STEPS.map((s, i) => (
            <li key={s.t} className="flex gap-3 rounded-xl border border-slate-200 p-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white" aria-hidden>{i + 1}</span>
              <div>
                <div className="font-bold">{s.t}</div>
                <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
        <Link href="/credits" className="btn-primary mt-3">192학점 설계 열기 <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </section>

      <section id="words" className="mb-6 scroll-mt-24" aria-labelledby="h-words">
        <h2 id="h-words" className="text-lg font-extrabold">어려운 말 풀이</h2>
        <label className="relative mt-2 block max-w-md">
          <span className="sr-only">용어 찾기</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input className="input pl-9" value={q} onChange={(e) => setQ(e.target.value)} placeholder="모르는 말 찾기 (예: 편제표, 선수과목)" />
        </label>
        <dl className="mt-3 grid gap-2 sm:grid-cols-2">
          {words.map((x) => (
            <div key={x.w} className="rounded-xl border border-slate-200 bg-surface p-3">
              <dt className="font-bold text-brand-700">{x.w}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-slate-600">{x.d}</dd>
            </div>
          ))}
          {words.length === 0 && <p className="text-sm text-slate-500">찾는 말이 없어요. 다른 말로 찾아보거나 선생님께 물어보세요.</p>}
        </dl>
      </section>

      <section id="faq" className="mb-6 scroll-mt-24" aria-labelledby="h-faq">
        <h2 id="h-faq" className="text-lg font-extrabold">자주 묻는 질문</h2>
        <div className="mt-2 space-y-2">
          {FAQ.map((f) => <Qa key={f.q} q={f.q} a={f.a} />)}
        </div>
        <Link href="/account" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700"><HardDriveDownload className="h-4 w-4" aria-hidden /> 내 기록 백업 하러 가기</Link>
      </section>

      <section id="stuck" className="mb-6 scroll-mt-24" aria-labelledby="h-stuck">
        <h2 id="h-stuck" className="text-lg font-extrabold">막힐 때 (192학점 설계)</h2>
        <div className="mt-2 space-y-2">
          {STUCK.map((f) => <Qa key={f.q} q={f.q} a={f.a} />)}
        </div>
        <p className="mt-4 rounded-xl bg-brand-50 px-3 py-3 text-sm text-brand-900">
          그래도 모르겠으면 선생님께 이렇게 물어보세요: “제가 되고 싶은 직업은 ○○인데, 이 과목들을 이렇게 골라도 될까요?” 화면의 ‘학업설계서 인쇄’로 만든 종이를 같이 보면서 이야기하면 좋아요.
        </p>
      </section>
    </div>
  );
}

function Qa({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-xl border border-slate-200 bg-surface">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 font-semibold">
        <span>{q}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-180" aria-hidden />
      </summary>
      <p className="px-4 pb-3 text-sm leading-relaxed text-slate-600">{a}</p>
    </details>
  );
}
