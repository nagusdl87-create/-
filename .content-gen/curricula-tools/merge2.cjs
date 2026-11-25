const ROOT=require("path").resolve(__dirname,"../..").split("\\").join("/"); // 저장소 위치(컴퓨터마다 달라도 됨)
const fs=require('fs');const R=ROOT+'/.content-gen/curricula-raw/';
const F=ROOT+'/src/data/curricula/xlsx-schools.ts';
let s=fs.readFileSync(F,'utf8');let lines='';
for(const p of process.argv.slice(2)){const r=JSON.parse(fs.readFileSync(R+'r_'+p+'.json','utf8'));if(s.includes('"post":"'+p+'"')){console.log('이미 있음',p);continue;}r.checked='2026-11-24';lines+='  '+JSON.stringify(r)+',\n';}
const end=s.indexOf('\n];\n',s.indexOf('const RAW'));
s=s.slice(0,end+1)+lines+s.slice(end+1);
fs.writeFileSync(F,s);
