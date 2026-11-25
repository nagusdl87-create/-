const ROOT=require("path").resolve(__dirname,"../..").split("\\").join("/"); // 저장소 위치(컴퓨터마다 달라도 됨)
// 사용: node reg.cjs <post> <sheetfile> <학교이름> [note]  → r_<post>.json 저장(요청 없음), merge는 merge2.cjs
const fs=require('fs');const path=require('path');const conv=require('./conv.cjs');
const RAW=ROOT+'/.content-gen/curricula-raw';
const [post,sheet,school,note]=process.argv.slice(2);
const p=fs.readFileSync(path.join(RAW,'p_'+post+'.html'),'utf8');
const files=[...p.matchAll(/class="file"><img[^>]*alt="([a-z]+) 이미지">\s*([^<]*)<\/a>/g)].map(m=>({ext:m[1],name:m[2].trim()})).filter(f=>/^xls/.test(f.ext));
let pick=files.filter(f=>/2026/.test(f.name));if(!pick.length)pick=files;
const res=conv(path.join(RAW,sheet),school);
if(res.err||!res.ok){console.log(school,'실패',res.err||JSON.stringify([res.sums,res.tot]));process.exit(1);}
res.rec.id='x'+post.slice(0,14);res.rec.post=post;res.rec.file=pick[0].name;if(note)res.rec.note=note;
fs.writeFileSync(path.join(RAW,'r_'+post+'.json'),JSON.stringify(res.rec));
console.log(school,'저장',res.rec.file,JSON.stringify(res.sums));
