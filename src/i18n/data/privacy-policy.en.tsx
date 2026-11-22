// 개인정보 처리 방침 영어 전문 (원문: src/app/privacy/PrivacyBody.tsx). 영어 모드에서만 불러온다.
// 한국어 원문이 바뀌면 이 파일도 같이 고친다. 법률 이름은 한국어 원어 + 영어 설명.
import Link from "next/link";

const EFFECTIVE = "November 22, 2026";

function H({ n, children }: { n: number; children: React.ReactNode }) {
  return <h2 className="mt-8 text-lg font-bold text-slate-900">{n}. {children}</h2>;
}

export function PrivacyPolicyEn() {
  return (
    <article lang="en" className="card text-[0.95rem] leading-relaxed text-slate-700 [&_li]:mt-1 [&_table]:mt-3 [&_td]:border [&_td]:border-slate-200 [&_td]:p-2 [&_td]:align-top [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:p-2 [&_th]:text-left">
      <p className="mb-4 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
        This is an English translation for reference. If there is any difference, the Korean version of this policy applies.
      </p>
      <p>
        <b>MyRoad Gyeongnam</b> (the &ldquo;Service&rdquo;) has this privacy policy to protect users&apos; personal information under the Personal Information Protection Act (<span data-keep-ko lang="ko">「개인정보 보호법」</span>) and to handle related complaints quickly.
      </p>

      <H n={1}>Basic principle: if you do not log in, we do not collect personal information</H>
      <ul className="list-disc pl-5">
        <li>You can use every feature of the Service without logging in. In that case, what you enter (interest test results, credit plans, portfolio, etc.) is <b>stored only on your device (browser)</b> and is not sent to the Service operator.</li>
        <li>To continue on another device without logging in, download a <Link href="/account" className="underline">backup file</Link> and move it. You keep the backup file yourself.</li>
        <li>We process the personal information below <b>only if you log in (optional)</b>. The purpose of logging in is to continue the same records on several devices, such as at school and at home.</li>
      </ul>

      <H n={2}>Personal information we process and why (if you log in)</H>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead><tr><th>Category</th><th>Items</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td>Login information</td><td>Google account identifier (unique number), email address, name (Google profile display name)</td><td>Identifying you, linking records across devices</td></tr>
            <tr><td>Service records</td><td>Career records you enter yourself (interest test answers and results, favorite jobs, majors and schools, credit plans, portfolio and reading records, profile entries such as school name and grade)</td><td>Syncing across devices, giving your records back to you</td></tr>
            <tr><td>Automatically created information</td><td>Last saved time, a random number to tell devices apart</td><td>Preventing sync conflicts</td></tr>
          </tbody>
        </table>
      </div>
      <ul className="mt-3 list-disc pl-5">
        <li>We do not collect resident registration numbers, phone numbers, addresses, or original grade documents. You may use a nickname instead of your real name in your profile.</li>
        <li>Please do not write sensitive information, such as health or family circumstances, in your records.</li>
      </ul>

      <H n={3}>Users under 14</H>
      <p className="mt-2">Users under 14 <b>cannot use the login feature</b>, but can use every feature without logging in (records are stored on the device, and can be moved to another device with a backup file). Before logging in, we ask you to confirm &ldquo;I am 14 or older.&rdquo; If we learn that a user under 14 has logged in, we delete that account and its records without delay.</p>

      <H n={4}>How long we keep information</H>
      <ul className="mt-2 list-disc pl-5">
        <li>When you delete your account, we <b>delete it immediately</b>. You can delete it yourself at any time with &ldquo;Delete account&rdquo; on the <Link href="/account" className="underline">My Record Backup</Link> page.</li>
        <li>For <b>accounts that have not logged in for 1 year</b>, we delete the login information and records together (checked automatically every month). Because we do not collect contact details, we do not send individual notices; this rule is always shown on the login screen.</li>
        <li>Even after you log out, records stored on a device stay on that device until you delete them yourself. On a shared computer, please use &ldquo;Log out and delete records on this device.&rdquo;</li>
      </ul>

      <H n={5}>Sharing with third parties</H>
      <p className="mt-2">We do not give users&apos; personal information to third parties. A &ldquo;share link&rdquo; that you create yourself can be viewed by anyone who receives it; this is your own choice.</p>

      <H n={6}>Outsourcing and transfer abroad</H>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead><tr><th>Processor</th><th>Outsourced work</th><th>Country and method of transfer</th><th>Retention period</th></tr></thead>
          <tbody>
            <tr>
              <td>Google LLC (Firebase Authentication, Cloud Firestore)</td>
              <td>Login authentication, storing records</td>
              <td>Records are stored on servers in the Republic of Korea (Seoul). Login authentication may be processed on Google&apos;s servers abroad (such as the United States). Sent over the network when you log in.</td>
              <td>Until the account is deleted or the outsourcing contract ends</td>
            </tr>
          </tbody>
        </table>
      </div>

      <H n={7}>Your rights</H>
      <p className="mt-2">You can ask at any time to view, correct, delete, or stop the processing of your personal information. You can edit your records or delete your account directly in the Service; if that is difficult, send a request to the contact below and we will handle it without delay.</p>

      <H n={8}>Security measures</H>
      <ul className="mt-2 list-disc pl-5">
        <li>Database security rules allow reading and writing <b>only your own account&apos;s records</b>.</li>
        <li>All transmission is encrypted (HTTPS).</li>
        <li>Admin keys and access rights are kept to a minimum.</li>
      </ul>

      <H n={9}>Cookies and automatic collection</H>
      <p className="mt-2">We do not use advertising or tracking cookies, or visitor analytics tools. We use browser storage to save data on your device and keep you logged in.</p>

      <H n={10}>Person in charge of personal information protection</H>
      <ul className="mt-2 list-disc pl-5">
        <li>Name: <span data-keep-ko lang="ko">윤용현</span> (teacher at <span data-keep-ko lang="ko">삼천포여자중학교</span> (Samcheonpo Girls&apos; Middle School), creator of the Service)</li>
        <li>Contact: the &ldquo;Contact&rdquo; email at the very bottom of the page</li>
        <li>The Service is an unofficial educational service made by an individual. It is not an official service of the Gyeongsangnam-do Office of Education.</li>
      </ul>
      <p className="mt-3 text-sm">Reporting and counseling on privacy violations: Personal Information Infringement Report Center (<span data-keep-ko lang="ko">개인정보침해신고센터</span>; call 118 with no area code, privacy.kisa.or.kr), Personal Information Dispute Mediation Committee (<span data-keep-ko lang="ko">개인정보분쟁조정위원회</span>; 1833-6972, www.kopico.go.kr)</p>

      <H n={11}>Effective date</H>
      <p className="mt-2">This policy applies from {EFFECTIVE}. If it changes, we will announce it on the Service screen from 7 days before the change takes effect.</p>
    </article>
  );
}
