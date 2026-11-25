import fs from "node:fs";
const auto = JSON.parse(fs.readFileSync("src/data/videos-auto.json","utf8"));
const vt = fs.readFileSync("src/data/videos.ts","utf8");
const staticJobs = {}; const staticMajors={};
let cur=null;
for (const line of vt.split("\n")) {
  if (line.startsWith("export const JOB_VIDEOS")) cur=staticJobs; else if (line.startsWith("export const MAJOR_VIDEOS")) cur=staticMajors; else if (line.startsWith("};")) cur=null;
  if(!cur) continue;
  const k = line.match(/^  "?([\w-]+)"?: \[/); if (k) { cur.__k=k[1]; cur[k[1]]=[]; }
  for (const m of line.matchAll(/id: "([^"]+)", title: "([^"]*)", channel: "([^"]*)"/g)) cur[cur.__k].push({id:m[1],title:m[2],channel:m[3]});
}
delete staticJobs.__k; delete staticMajors.__k;
const jobDirect = (id)=>[...(staticJobs[id]||[]),...(auto.jobs[id]||[])];
const majorDirect = (id)=>[...(staticMajors[id]||[]),...(auto.majors[id]||[])];
const jobRel = (id)=>auto.jobsRelated?.[id]?.videos ?? [];
const gen = JSON.parse(fs.readFileSync("src/data/gen/majors.json","utf8"));
const base = [...fs.readFileSync("src/data/majors.ts","utf8").matchAll(/M\("([^"]+)", "([^"]+)", "(\w+)",.*?\[([^\]]*)\], \[[^\]]*\]\),?\s*$/gm)].map(m=>({id:m[1],name:m[2],track:m[3],jobs:[...m[4].matchAll(/"([^"]+)"/g)].map(x=>x[1])}));
const majors=[...base,...gen.map(g=>({id:g.id,name:g.name,track:g.track,jobs:g.jobs}))];
console.log("majors",majors.length,"base",base.length);
let t1=0,t2=0,t3=0,none=[];
for (const m of majors){
  if(majorDirect(m.id).length){t1++;continue;}
  if(m.jobs.some(j=>jobDirect(j).length)){t2++;continue;}
  if(m.jobs.some(j=>jobRel(j).length)){t3++;continue;}
  none.push(m);
}
console.log({t1,t2,t3,none:none.length});
export {majors,none,majorDirect,jobDirect,jobRel,auto,staticJobs,staticMajors};
