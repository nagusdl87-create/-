"use client";

// 이 컴포넌트가 화면에 붙었는지(하이드레이션이 끝났는지). 처음 그릴 때는 false.
// 공용 상태(기록 불러옴, 언어)는 레이아웃이 먼저 붙으면서 바뀔 수 있다. 페이지 코드가 늦게 도착하면
// React가 바뀐 값으로 페이지를 붙이려다 서버 HTML과 달라 화면 불일치 오류(#418)가 났다.
// 각 컴포넌트가 스스로 붙기 전까지는 처음 값을 쓰게 해서 막는다.
import { useEffect, useState } from "react";

export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}
