const ROOT=require("path").resolve(__dirname,"../..").split("\\").join("/"); // 저장소 위치(컴퓨터마다 달라도 됨)
const fs=require('fs');const R=ROOT+'/.content-gen/curricula-raw/';
const s=fs.readFileSync(R+'list200.html','utf8');
const m=[...s.matchAll(/<td>([^<]+)<\/td>\s*<td class="bbs_title"><a[^>]*opView\('(\d+)'\)[^>]*>([^<]*)</g)];
const have=new Set(fs.readdirSync(R).filter(f=>/^p_/.test(f)).map(f=>f.slice(2,-5)));
const reg=fs.readFileSync(ROOT+'/src/data/curricula/xlsx-schools.ts','utf8');
const idx=m.map(x=>({school:x[1],post:x[2],title:x[3],cached:have.has(x[2]),done:reg.includes(x[2].slice(0,14))}));
fs.writeFileSync(R+'../curricula-tools/list.json',JSON.stringify(idx));
console.log(idx.length);idx.forEach(x=>console.log(x.post,x.school,x.cached?'C':'',x.done?'DONE':''));
