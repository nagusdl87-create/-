// 영어 문장 속 괄호 안 한국어 원어(예: "Geoje (거제)", "Engineer Electricity (전기기사)")를
// data-keep-ko로 감싸 영어 검사에서 제외한다. 한국어 모드에서는 글을 그대로 둔다.
const PAREN_KO = /(\([^()]*[가-힣][^()]*\))/;

export function KeepKo({ text }: { text: string }) {
  if (!/[가-힣]/.test(text) || !/[A-Za-z]/.test(text)) return <>{text}</>;
  return (
    <>
      {text.split(PAREN_KO).map((part, i) => (i % 2 ? <span key={i} data-keep-ko>{part}</span> : part))}
    </>
  );
}
