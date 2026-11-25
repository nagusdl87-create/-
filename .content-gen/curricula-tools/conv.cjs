const grid=require('./dgrid.cjs');
const SEMS=["1-1","1-2","2-1","2-2","3-1","3-2"];
const clean=t=>{let s=(t||'').replace(/^user:.*?중 택1/,'').trim();
 s=s.replace(/\((\*|★|경남온|온|공동|온라인)\)/g,'').replace(/^\*+/,'').replace(/[*★]+$/,'').trim();
 if(s==='화법과언어')s='화법과 언어'; return s;};
const num=t=>{const m=String(t||'').trim().match(/^(\d+(?:\.\d+)?)$/);return m?+m[1]:null;};
function convert(file,school){
 const g=grid(file);
 // header
 let h=g.findIndex(r=>r.some(c=>c==='과목'||/^※과목명/.test(c)||c==='기본학점')&&r.some(c=>/운영학점/.test(c)));
 if(h<0)return{err:'헤더 없음'};
 const H=g[h];let cSub=H.findIndex(c=>c==='과목'||/^※과목명/.test(c));if(cSub<0){const b=H.indexOf('기본학점');if(b>0)cSub=b-1;}const cLab=Math.max(0,H.findIndex(c=>/^구\s*분$/.test(c)));const L=r=>r[cLab]||'';const cOp=H.findIndex(c=>/운영학점/.test(c));
 let sc=null;
 for(let k=h;k<=h+2;k++){const idx=g[k].map((c,i)=>/^[12]학기$/.test(c)?i:-1).filter(i=>i>=0);if(idx.length>=6){sc=idx.slice(0,6);break;}}
 if(!sc)return{err:'학기 칸 없음'};
 let start=h+1;while(g[start]&&g[start].some(c=>/^[12]학기$/.test(c)))start++;
 // total row
 const isTotal=r=>r.slice(0,5).some(c=>/총\s*교과/.test(c)&&!/창의|편성\s*학점\s*수/.test(c));
 let ti=g.findIndex((r,i)=>i>start&&isTotal(r));
 if(ti<0)return{err:'총 교과 행 없음'};
 const tot=sc.map(i=>num(g[ti][i]));
 if(tot.some(x=>x==null))return{err:'총 교과 학기값 없음 '+tot.join(',')};
 // fixed / group split
 let fixedEnd=-1;
 for(let i=start;i<ti;i++){if(/^선택군|^학생\s*선택/.test(L(g[i]))||/학교\s*지정\s*과목\s*교과/.test(L(g[i]))){fixedEnd=i;break;}}
 if(fixedEnd<0)return{err:'선택군 구분 못 찾음'};
 const sems={};SEMS.forEach(s=>sems[s]={f:[],g:[]});
 const o={};
 let lastArrow=null;
 const addFixedOrArrow=(r)=>{
  let name=clean(r[cSub]);if(!name){if(lastArrow&&SEMS.some((s,k)=>num(r[sc[k]])>0))name=lastArrow;else return;}
  if(name.includes('↔'))lastArrow=name;else lastArrow=null;
  SEMS.forEach((s,k)=>{const v=num(r[sc[k]]);if(v==null||v===0)return;
   if(name.includes('↔')){const opts=name.split('↔').map(x=>clean(x));const lab=opts.join('·')+' 택1';o[lab]=opts;sems[s].g.push([lab,1,v]);}
   else sems[s].f.push([name,v]);});
 };
 for(let i=start;i<fixedEnd;i++)addFixedOrArrow(g[i]);
 // groups
 let label=null,rows=[];const grp=[];let extra=false;
 for(let i=fixedEnd;i<ti;i++){const r=g[i];
  if(/학교\s*지정\s*과목\s*교과|학생\s*선택\s*과목\s*교과/.test(L(r)))continue;
  if(/^선택군/.test(L(r)))extra=false;else if(L(r).trim())extra=true;
  if(extra)continue;
  if(/^선택군/.test(L(r))){label=L(r).replace(/\s+/g,'');grp.push({label,rows:[]});}
  if(!grp.length)return{err:'선택군 앞 행'};
  grp[grp.length-1].rows.push(r);}
 for(const G of grp){
  const opts=[];const ops=new Set();
  for(const r of G.rows){const name=clean(r[cSub]);if(!name)continue;
   if(name.includes('↔'))return{err:'선택군 안 ↔ '+G.label};
   opts.push(name);const op0=num(r[cOp]);(G.by=G.by||{})[op0]=(G.by[op0]||[]);G.by[op0].push(name);const op=num(r[cOp]);if(op==null)return{err:'운영학점 없음 '+G.label+' '+name};ops.add(op);
   SEMS.forEach((s,k)=>{const v=num(r[sc[k]]);if(v!=null&&v>0){(G['m'+s]=G['m'+s]||[]).push([name,v,op]);}});}
  if(!opts.length)return{err:'빈 선택군 '+G.label};
  if(ops.size>1){ // 학점이 섞인 선택군: 학점별로 나눔
   for(const cr of [...ops].sort((a,b)=>b-a)){const lab=G.label+'('+cr+'학점)';let used=false;
    SEMS.forEach(s=>{const m=(G['m'+s]||[]).filter(x=>x[2]===cr);if(!m.length)return;if(m.some(x=>x[1]!==cr)){G.bad='표시값≠운영학점 '+lab+s;return;}used=true;sems[s].g.push([lab,m.length,cr]);});
    if(used)o[lab]=G.by[cr];}
   if(G.bad)return{err:G.bad};continue;}
  o[G.label]=opts;
  SEMS.forEach(s=>{const m=G['m'+s];if(!m)return;
   const cr=m[0][2];if(m.some(x=>x[1]!==cr))return G.bad='표시값≠운영학점 '+G.label+s;
   sems[s].g.push([G.label,m.length,cr]);});
  if(G.bad)return{err:G.bad};
 }
 // verify
 const sums=SEMS.map(s=>sems[s].f.reduce((a,x)=>a+x[1],0)+sems[s].g.reduce((a,x)=>a+x[1]*x[2],0));
 const total=tot.reduce((a,b)=>a+b,0);
 const ok=sums.every((v,i)=>v===tot[i])&&total===174;
 return{ok,sums,tot,total,rec:{school,sems,o},groups:grp.length};
}
module.exports=convert;
if(require.main===module){const r=convert(process.argv[2],process.argv[3]||'?');console.log(r.err?r:{ok:r.ok,sums:r.sums,tot:r.tot,total:r.total});if(r.rec&&process.argv[4])console.log(JSON.stringify(r.rec.sems['2-1']),JSON.stringify(r.rec.sems['1-1']));}
