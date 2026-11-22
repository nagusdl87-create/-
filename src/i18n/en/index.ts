// 영어 사전 모음(영어 모드에서만 불러옴). 영역별 파일을 합친다.
import { COMMON } from "./common";
import { HOME } from "./home";
import { EXPLORE } from "./explore";
import { CREDITS } from "./credits";
import { SCHOOLS } from "./schools";
import { JOBS } from "./jobs";
import { MAJORS } from "./majors";
import { MISC } from "./misc";

export const EN: Record<string, string> = { ...COMMON, ...HOME, ...EXPLORE, ...CREDITS, ...SCHOOLS, ...JOBS, ...MAJORS, ...MISC };
