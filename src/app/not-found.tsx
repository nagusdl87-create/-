import Link from "next/link";
export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <div className="text-5xl">🧭</div>
      <h1 className="mt-3 text-xl font-bold">길을 잃었어요</h1>
      <Link href="/" className="btn-primary mt-4">홈으로</Link>
    </div>
  );
}
