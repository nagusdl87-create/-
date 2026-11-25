import { SUBJECT_MAP } from "../src/data/subjects";
import { writeFileSync } from "node:fs";
writeFileSync(".content-gen/valid-subjects.txt", Object.keys(SUBJECT_MAP).join("\n"));
console.log(Object.keys(SUBJECT_MAP).length);
