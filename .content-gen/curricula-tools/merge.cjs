const ROOT=require("path").resolve(__dirname,"../..").split("\\").join("/"); // 저장소 위치(컴퓨터마다 달라도 됨)
const fs=require('fs');const R=ROOT+'/.content-gen/curricula-raw/';
const F=ROOT+'/src/data/curricula/xlsx-schools.ts';
let s=fs.readFileSync(F,'utf8');
const add=['20260619145439841','20260305083224911','20260304154653814','20260304125411727','20260304122208702','20260304112657033','20260304105801313'];
let lines='';
for(const p of add){const r=JSON.parse(fs.readFileSync(R+'r_'+p+'.json','utf8'));if(s.includes('"post":"'+p+'"'))continue;r.checked='2026-11-24';lines+='  '+JSON.stringify(r)+',\n';}
const end=s.indexOf('\n];\n',s.indexOf('const RAW'));
s=s.slice(0,end+1)+lines+s.slice(end+1);
s=s.replace('id: string; school: string; post: string; file: string;','id: string; school: string; post: string; file: string; checked?: string;');
s=s.replace('checked: CHECKED }','checked: r.checked ?? CHECKED }');
fs.writeFileSync(F,s);
