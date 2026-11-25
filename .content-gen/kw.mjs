import { readFileSync } from "node:fs";
import { buildKeywords } from "../scripts/video-match.mjs";
const R = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
const k = buildKeywords(R);
for (const id of process.argv.slice(2)) console.log(id, JSON.stringify(k.majorKw[id] ?? k.jobKw[id]));
