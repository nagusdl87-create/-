"use client";

// 개인정보 처리 방침 본문. 영어 모드에서는 영어 전문(src/i18n/data/privacy-policy.en.tsx)을 보여 준다.
import Link from "next/link";
import { PageHead } from "@/components/ui";
import { useEnData, useT } from "@/lib/i18n";
import { useCloud } from "@/lib/cloud";

// 원문: docs/privacy-draft.md (결정 D3=A 반영, 2026-11-22 게시). 바꿀 때는 시행 7일 전 공지.
const EFFECTIVE = "2026년 11월 22일";

function H({ n, children }: { n: number; children: React.ReactNode }) {
  return <h2 className="mt-8 text-lg font-bold text-slate-900">{n}. {children}</h2>;
}

/** 교사·관리자 열람 기능 안내(초안). 이 기능이 숨겨져 있는 동안에는 보이지 않는다. 게시 전에 사용자·법적 확인이 필요하다. */
function StaffSection() {
  const t = useT();
  const { teacherFeature } = useCloud();
  if (!teacherFeature) return null;
  return (
    <article className="card mt-6 text-[0.95rem] leading-relaxed text-slate-700" aria-labelledby="staff-priv">
      <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900" role="note">{t("초안: 교사·관리자 열람 기능 문안이에요. 사용자(제작자)와 법적 확인을 거친 뒤에 확정해요.")}</p>
      <h2 id="staff-priv" className="mt-4 text-lg font-bold text-slate-900">{t("12. 교사·관리자의 열람 (선택 동의)")}</h2>
      <ul className="mt-2 list-disc pl-5">
        <li>{t("이용자가 계정 화면에서 ‘교사·관리자에게 내 포트폴리오 공개’를 직접 켠 경우에만, 이용자의 기록 사본을 마스터와 관리자(교사)가 읽을 수 있어요. 기본값은 꺼짐이에요.")}</li>
        <li>{t("목적: 진로 상담과 지도, 학생 진로 현황 파악. 그 밖의 목적으로 쓰지 않아요.")}</li>
        <li>{t("공개되는 항목: 구글 표시 이름, 프로필(이름·학교·학년), 흥미 탐색 결과, 찜한 직업·학과·학교, 진로 활동·독서 기록, 학기별 계획·목표, 포트폴리오에 쓴 글, 192학점 설계. 이메일 주소, 내신 성적, 학교 편제표는 공개용 사본에 넣지 않아요.")}</li>
        <li>{t("철회: 같은 화면에서 언제든 끌 수 있고, 끄면 공개용 사본이 바로 삭제되어 더는 볼 수 없어요. 이미 인쇄하거나 복사해 간 내용은 교사가 직접 안전하게 보관·파기해야 해요.")}</li>
        <li>{t("읽는 사람: 마스터(제작자가 지정한 구글 계정 1개)와, 마스터가 지정한 관리자(교사). 관리자는 읽기만 할 수 있고 기록을 고치거나 다른 관리자를 지정할 수 없어요. 관리자 지정을 위해 로그인한 사용자의 이름·이메일이 별도 목록(members)에 저장돼요.")}</li>
        <li>{t("교사는 학생이 입력한 기록을 이 기기의 브라우저 안에서만 분석하고, 세특 초안도 같은 방식으로 만들어요. 학생 기록을 외부 AI 서비스로 보내지 않아요. 세특 초안은 학교 기재 요령과 교사의 관찰에 따라 교사가 직접 고쳐 써야 해요.")}</li>
        <li>{t("만 14세 이상만 로그인할 수 있어요. 보호자 안내와 학교 지침에 따라 이 기능을 사용해 주세요.")}</li>
      </ul>
    </article>
  );
}

export function PrivacyBody() {
  const t = useT();
  const en = useEnData(() => import("@/i18n/data/privacy-policy.en"), "privacy-policy");
  return (
    <div className="mx-auto max-w-3xl">
      <PageHead tone="sky" eyebrow="안내" title="개인정보 처리 방침" desc={t("시행일 {date}", { date: t(EFFECTIVE) })} />
      {en ? <en.PrivacyPolicyEn /> : <article className="card text-[0.95rem] leading-relaxed text-slate-700 [&_li]:mt-1 [&_table]:mt-3 [&_td]:border [&_td]:border-slate-200 [&_td]:p-2 [&_td]:align-top [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:p-2 [&_th]:text-left">
        <p>
          <b>마이로드 경남</b>(이하 &ldquo;서비스&rdquo;)은 「개인정보 보호법」에 따라 이용자의 개인정보를 보호하고, 관련 고충을 신속하게 처리하기 위해 다음과 같이 개인정보 처리 방침을 둡니다.
        </p>

        <H n={1}>기본 원칙: 로그인하지 않으면 개인정보를 받지 않아요</H>
        <ul className="list-disc pl-5">
          <li>서비스의 모든 기능은 로그인 없이 쓸 수 있어요. 이때 입력한 내용(흥미 탐색 결과, 학점 설계, 포트폴리오 등)은 <b>이용자의 기기(브라우저)에만 저장</b>되고 서비스 운영자에게 전송되지 않아요.</li>
          <li>로그인하지 않고 다른 기기에서 이어 쓰려면 <Link href="/account" className="underline">백업 파일</Link>을 내려받아 옮기면 돼요. 백업 파일은 이용자가 직접 보관해요.</li>
          <li><b>로그인(선택)</b>을 하는 경우에만 아래 개인정보를 처리해요. 로그인의 목적은 학교·집 등 여러 기기에서 같은 기록을 이어 쓰기 위한 것이에요.</li>
        </ul>

        <H n={2}>처리하는 개인정보 항목과 목적 (로그인한 경우)</H>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead><tr><th>구분</th><th>항목</th><th>목적</th></tr></thead>
            <tbody>
              <tr><td>로그인 정보</td><td>구글 계정 식별자(고유 번호), 이메일 주소, 이름(구글 프로필 표시 이름)</td><td>본인 확인, 기기 간 기록 연결</td></tr>
              <tr><td>서비스 기록</td><td>이용자가 직접 입력한 진로 기록(흥미 탐색 응답·결과, 관심 직업·학과·학교, 학점 설계, 포트폴리오·독서 기록, 학교명·학년 등 프로필 입력값)</td><td>기기 간 동기화, 이용자 본인에게 기록 제공</td></tr>
              <tr><td>자동 생성 정보</td><td>마지막 저장 시각, 기기 구분용 임의 번호</td><td>동기화 충돌 방지</td></tr>
            </tbody>
          </table>
        </div>
        <ul className="mt-3 list-disc pl-5">
          <li>주민등록번호, 연락처, 주소, 성적 원본 서류 등은 수집하지 않아요. 프로필에는 실명 대신 별명을 써도 돼요.</li>
          <li>기록에 건강, 가정 형편 같은 민감한 내용은 적지 않도록 해 주세요.</li>
        </ul>

        <H n={3}>만 14세 미만 이용자</H>
        <p className="mt-2">만 14세 미만은 <b>로그인 기능을 쓸 수 없고</b>, 로그인 없이 모든 기능을 이용할 수 있어요(기록은 기기에 저장, 다른 기기로는 백업 파일로 이동). 로그인 전에 &ldquo;만 14세 이상이에요&rdquo;를 확인받아요. 만 14세 미만이 로그인한 사실을 알게 되면 해당 계정과 기록을 지체 없이 삭제해요.</p>

        <H n={4}>보유 및 이용 기간</H>
        <ul className="mt-2 list-disc pl-5">
          <li>계정을 삭제하면 <b>즉시 삭제</b>해요. <Link href="/account" className="underline">내 기록 백업</Link> 화면의 &ldquo;계정 삭제&rdquo;에서 언제든 직접 삭제할 수 있어요.</li>
          <li><b>1년 동안 로그인하지 않은 계정</b>은 로그인 정보와 기록을 함께 삭제해요(매월 자동 점검). 연락처를 받지 않아 개별 통지는 하지 않고, 이 기준을 로그인 화면에 늘 안내해요.</li>
          <li>로그아웃해도 기기에 저장된 기록은 이용자가 직접 지울 때까지 그 기기에 남아요. 공용 컴퓨터에서는 &ldquo;로그아웃하고 이 기기 기록 지우기&rdquo;를 써 주세요.</li>
        </ul>

        <H n={5}>제3자 제공</H>
        <p className="mt-2">이용자의 개인정보를 제3자에게 제공하지 않아요. 이용자가 직접 만든 &ldquo;공유 링크&rdquo;는 링크를 받은 사람이 볼 수 있으며, 이는 이용자 본인의 선택이에요.</p>

        <H n={6}>처리 위탁 및 국외 이전</H>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead><tr><th>수탁자</th><th>위탁 업무</th><th>이전 국가·방법</th><th>보유 기간</th></tr></thead>
            <tbody>
              <tr>
                <td>Google LLC (Firebase Authentication, Cloud Firestore)</td>
                <td>로그인 인증, 기록 저장</td>
                <td>기록은 대한민국(서울) 지역 서버에 저장. 로그인 인증은 Google의 해외 서버(미국 등)에서 처리될 수 있음. 로그인할 때 네트워크로 전송</td>
                <td>계정 삭제 또는 위탁 계약 종료 시까지</td>
              </tr>
            </tbody>
          </table>
        </div>

        <H n={7}>이용자의 권리</H>
        <p className="mt-2">이용자는 언제든지 개인정보 열람·정정·삭제·처리 정지를 요구할 수 있어요. 서비스 안에서 기록을 직접 고치거나 계정을 삭제할 수 있고, 어려운 경우 아래 연락처로 요청하면 지체 없이 처리해요.</p>

        <H n={8}>안전성 확보 조치</H>
        <ul className="mt-2 list-disc pl-5">
          <li>데이터베이스 보안 규칙으로 <b>본인 계정의 기록만</b> 읽고 쓸 수 있게 제한해요.</li>
          <li>모든 전송은 암호화(HTTPS)돼요.</li>
          <li>관리용 키와 접근 권한은 최소한으로 관리해요.</li>
        </ul>

        <H n={9}>쿠키 등 자동 수집</H>
        <p className="mt-2">광고·추적용 쿠키나 방문 분석 도구를 쓰지 않아요. 기기 저장과 로그인 상태 유지를 위해 브라우저 저장소를 사용해요.</p>

        <H n={10}>개인정보 보호책임자</H>
        <ul className="mt-2 list-disc pl-5">
          <li>성명: 윤용현 (삼천포여자중학교 교사, 서비스 제작자)</li>
          <li>연락처: 페이지 맨 아래 &ldquo;이용 문의&rdquo; 이메일</li>
          <li>서비스는 개인이 만든 비공식 교육용 서비스이며, 경상남도교육청의 공식 서비스가 아니에요.</li>
        </ul>
        <p className="mt-3 text-sm">개인정보 침해 신고·상담: 개인정보침해신고센터(국번 없이 118, privacy.kisa.or.kr), 개인정보분쟁조정위원회(1833-6972, www.kopico.go.kr)</p>

        <H n={11}>시행일</H>
        <p className="mt-2">이 방침은 {EFFECTIVE}부터 적용해요. 내용이 바뀌면 시행 7일 전부터 서비스 화면에 알려요.</p>
      </article>}
      <StaffSection />
    </div>
  );
}
