const ROOT=require("path").resolve(__dirname,"../..").split("\\").join("/"); // 저장소 위치(컴퓨터마다 달라도 됨)
const fs=require('fs');
(async()=>{const post=process.argv[2];
const r=await fetch(`https://www.gne.go.kr/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=${post}`,{redirect:'manual'});
const t=await r.text();console.log(r.status,t.length,/error\.html/.test(t.slice(0,3000)));
if(r.status===200&&t.length>5000)fs.writeFileSync(ROOT+'/.content-gen/curricula-raw/p_'+post+'.html',t);
fs.writeFileSync('count.txt','1');})();
