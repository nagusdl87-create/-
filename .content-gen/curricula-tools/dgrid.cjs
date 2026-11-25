const fs=require('fs');
const dec=t=>t.replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&apos;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#(\d+);/g,(m,n)=>String.fromCharCode(+n)).replace(/\s+/g,' ').trim();
function grid(file){
 const s=fs.readFileSync(file,'utf8');
 const i=s.indexOf('id="mainTable"'); const body=s.slice(i);
 const trs=body.split(/<div class="tr"[^>]*>/).slice(0,-1);
 return trs.map(tr=>tr.split(/<div class="td[ "]/).slice(1).map(c=>dec(c.replace(/^[^>]*>/,''))));
}
module.exports=grid;
if(require.main===module){const g=grid(process.argv[2]);const lim=+process.argv[3]||300;console.log(g.length,'rows; cols',[...new Set(g.map(r=>r.length))].join(','));g.slice(0,lim).forEach((r,i)=>console.log(i+': '+r.join('|')));}
