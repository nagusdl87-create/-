// 다문화 학생·보호자용 영어 요약 (결정 D2=A: 홈·고교 유형·고입 일정)
import { Globe } from "lucide-react";
import { ADMISSION_SCHEDULE } from "@/data/gn";

function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="card group" lang="en">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2">
        <span className="flex items-center gap-2 font-bold">
          <Globe className="h-4 w-4 text-sky-600" aria-hidden /> {title}
        </span>
        <span className="text-xs text-slate-500" lang="ko">영어 안내 · 펼치기</span>
      </summary>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700">{children}</div>
    </details>
  );
}

export function EnglishHome() {
  return (
    <Box title="In English: for students and parents">
      <p>
        <b>MyRoad Gyeongnam</b> is a free career and study planning site for middle and high school students in Gyeongsangnam-do. It is not an official site of the Gyeongsangnam-do Office of Education.
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li><b>Step 1. Know yourself</b>: a 30-question interest test suggests jobs that may suit you.</li>
        <li><b>Step 2. Jobs and majors</b>: read what each job does, how to prepare, and related university majors.</li>
        <li><b>Step 3. High school choice</b>: compare high school types and find schools in Gyeongnam on a map.</li>
        <li><b>Step 4. Course plan</b>: high school students plan 192 credits over three years (Korea&apos;s credit-based high school system).</li>
        <li><b>Step 5. Record</b>: keep a plan and portfolio, and print a report.</li>
      </ul>
      <p>
        You can use everything <b>without logging in</b>. Your records stay only on this device. To continue on another device, download a backup file from the &ldquo;내 기록 백업&rdquo; page and upload it later. Your browser&apos;s translate feature (or a translation app) can help with the Korean pages.
      </p>
    </Box>
  );
}

const ROUND: Record<string, string> = { 전기: "Early round", 후기: "Late round", 추가: "Additional round" };

export function EnglishHighschool() {
  return (
    <Box title="In English: high school types and admission in Gyeongnam">
      <p>After middle school, students apply to a high school. In Gyeongnam there are two main rounds: the <b>early round (전기)</b> for science, arts, sports, meister and specialized (vocational) high schools, and the <b>late round (후기)</b> for general, autonomous and foreign language high schools. In the early round you can apply to only one school, and if you are accepted you cannot apply in the late round (even if you do not register).</p>
      <ul className="list-disc space-y-1 pl-5">
        <li><b>General high school (일반고)</b>: most students; broad academic subjects for university. In some cities (equalization areas, 평준화) students list preferences and the Office of Education assigns schools.</li>
        <li><b>Autonomous public high school (자율형 공립고)</b>: a general school with its own special programs (4 schools in Gyeongnam).</li>
        <li><b>Science / Foreign language / Arts / Sports high schools</b>: special-purpose schools with their own selection process.</li>
        <li><b>Meister high school (마이스터고)</b>: trains skilled technicians for specific industries; strong links to jobs after graduation.</li>
        <li><b>Specialized (vocational) high school (특성화고)</b>: learn job skills (e.g., IT, mechanics, cooking, nursing); many students work or go to college later.</li>
        <li><b>Alternative specialized school (대안 특성화고)</b>: experience-based education with small classes.</li>
      </ul>
      <div>
        <b>2027 admission schedule (for current 3rd-year middle school students)</b>
        <div className="mt-1 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-xs">
            <thead><tr className="bg-slate-50 text-left"><th className="border border-slate-200 p-1.5">Round</th><th className="border border-slate-200 p-1.5">Schools (Korean names)</th><th className="border border-slate-200 p-1.5">Application</th><th className="border border-slate-200 p-1.5">Result</th></tr></thead>
            <tbody>
              {ADMISSION_SCHEDULE.map((x) => (
                <tr key={x.who}>
                  <td className="border border-slate-200 p-1.5">{ROUND[x.round] ?? x.round}</td>
                  <td className="border border-slate-200 p-1.5" lang="ko">{x.who}</td>
                  <td className="border border-slate-200 p-1.5">{x.apply}</td>
                  <td className="border border-slate-200 p-1.5" lang="ko">{x.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p>Dates can change. Always confirm with the official Gyeongnam high school admission portal and ask your homeroom teacher, who helps with the application process.</p>
    </Box>
  );
}
