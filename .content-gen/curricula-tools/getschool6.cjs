const ROOT=require("path").resolve(__dirname,"../..").split("\\").join("/"); // 저장소 위치(컴퓨터마다 달라도 됨)
// 사용: node getschool.cjs <post> <학교이름>  — 요청 사이 3초 이상, 차단 신호 시 즉시 중단
const fs=require('fs');const path=require('path');
const RAW=ROOT+'/.content-gen/curricula-raw';
const S=__dirname;const CNT=path.join(S,'count6.txt');
const conv=require('./conv.cjs');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let n=+(fs.existsSync(CNT)?fs.readFileSync(CNT,'utf8'):0);
async function get(url,file){
 await sleep(3200);
 if(n>=60){console.log('LIMIT 60');process.exit(8);}n++;fs.writeFileSync(CNT,String(n));
 const r=await fetch(url,{redirect:'manual'});
 const t=await r.text();
 if(r.status===429||r.status===403||(r.status>=300&&r.status<400)||/error\.html/.test(t.slice(0,3000))&&r.status!==200){console.log('BLOCK_SIGNAL',r.status,url);process.exit(9);}
 if(/<title>SERVER ERROR<\/title>/.test(t)){console.log('SERVER ERROR page',url);return null;}
 fs.writeFileSync(path.join(RAW,file),t);return t;
}
(async()=>{
 const [post,school]=process.argv.slice(2);
 const B='https://www.gne.go.kr';
 let pf=path.join(RAW,'p_'+post+'.html');
 let p=fs.existsSync(pf)?fs.readFileSync(pf,'utf8'):await get(`${B}/h-creditsystem/education/schul/BD_selectSchulBbs.do?q_bbsDocNo=${post}`,'p_'+post+'.html');
 if(!p){process.exit(2);}
 const files=[...p.matchAll(/class="file"><img[^>]*alt="([a-z]+) 이미지">\s*([^<]*)<\/a>[\s\S]{0,400}?filePreview\('(\d+)',\s*'([^']+)'\)/g)].map(m=>({ext:m[1],name:m[2].trim(),sn:m[3],id:m[4]}));
 const xl=files.filter(f=>/^xls/.test(f.ext));
 if(!xl.length){console.log(school,'엑셀 없음',files.map(f=>f.ext+':'+f.name).join(' ; '));return;}
 let pick=xl.filter(f=>/2026/.test(f.name));if(!pick.length)pick=xl;
 const f=pick[0];
 const vt=await get(`${B}/user/bbs/ND_filePreview.do?q_fileSn=${f.sn}&q_fileId=${f.id}`,`v_${post}.html`);
 if(!vt)return;
 const fn=(vt.match(/doc\.html\?fn=([0-9a-f]+)&rs=([^"]+)"/)||[]);
 if(!fn[1]){console.log(school,'뷰어 주소 없음');return;}
 const rs=fn[2];
 const ix=await get(`${B}${rs}/${fn[1]}.xml`,`i_${post}.xml`);
 if(!ix)return;
 const sheets=[...ix.matchAll(/<sheet>\s*<id>(\d+)<\/id>\s*<title>([^<]*)<\/title>/g)].map(m=>({id:m[1],title:m[2].trim()})).filter((s,i,a)=>a.findIndex(x=>x.id===s.id)===i);
 const rank=s=>{const t=s.title;let r=0;if(/2026/.test(t))r+=4;if(/2025|2024|2023/.test(t)&&!/2026/.test(t))r-=5;if(/입학생|3개년/.test(t))r+=2;if(/1학년/.test(t))r+=1;if(/전학년/.test(t))r-=1;if(/목록|과목|안내|표지|교과/.test(t)&&!/편성/.test(t))r-=3;if(/편성|교육과정/.test(t))r+=1;return r;};
 sheets.sort((a,b)=>rank(b)-rank(a));
 console.log(school,'시트:',sheets.map(s=>s.id+'='+s.title+'('+rank(s)+')').join(' | '));
 const s0=sheets[0];
 const st=await get(`${B}${rs}/${fn[1]}.files/${s0.id}.xhtml`,`t_x${post.slice(0,14)}_${s0.id}.xhtml`);
 if(!st)return;
 const res=conv(path.join(RAW,`t_x${post.slice(0,14)}_${s0.id}.xhtml`),school);
 if(res.err){console.log(school,'변환 실패:',res.err);return;}
 console.log(school,res.ok?'검증 통과':'검증 불일치',JSON.stringify(res.sums),JSON.stringify(res.tot),res.total);
 if(res.ok){res.rec.id='x'+post.slice(0,14);res.rec.post=post;res.rec.file=f.name;fs.writeFileSync(path.join(RAW,'r_'+post+'.json'),JSON.stringify(res.rec));console.log(school,'저장');}
 console.log('요청 누계(이 세션 추정):',n);
})().catch(e=>{console.log('ERR',e.message);process.exit(3);});
