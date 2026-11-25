const fs=require('fs');const conv=require('./conv.cjs');const R='../curricula-raw/';
for(const f of fs.readdirSync(R).filter(f=>/^t_x/.test(f)).sort()){const r=conv(R+f,'X');console.log(f,r.err?('ERR '+r.err):(r.ok?'OK':'BAD')+JSON.stringify(r.rec?r.rec.sems:'').length+' '+require('crypto').createHash('md5').update(JSON.stringify(r.rec||'')).digest('hex').slice(0,8));}
