'use strict';
const $=id=>document.getElementById(id);
const KEY='arena26FootballEntries';
const DEADLINE=new Date('2026-11-01T23:59:59+05:30');
const START=new Date('2026-10-12T00:00:00+05:30');
const SECTIONS=['A','B','C','D','E','F','G','H','I','J'];
const NAMES={
1:['Campus Strikers','Goal Diggers','Net Breakers','Thunder Boots','Pitch Pirates','Rapid Rovers','Blue Blitz','The Kickoff Crew','Goal Guardians','First XI Futures'],
2:['Midfield Mavericks','Crimson Cleats','Counter Attack FC','Urban Falcons','The Pressing Unit','Northside United','Iron Boots','Offside Legends','Tactical Titans','Second Wind FC'],
3:['Penalty Kings','Velocity United','Golden Boot Club','The High Press','Shadow Strikers','Crossbar Collective','Stormfront FC','Third Half Heroes','Elite Eleven','Final Third FC'],
4:['Veteran Voyagers','Last-Minute Legends','The Invincibles','Legacy United','Captain’s XI','Prime Time FC','Crown Chasers','Top Corner FC','Fourth Gear','The Final Whistle']
};
const REGISTERED=new Set(['1-A','1-B','1-C','1-D','1-E','1-F','2-A','2-B','2-C','2-D','2-E','2-F','3-A','3-B','3-C','3-D','3-E','3-F','4-A','4-B','4-C','4-D','4-E','4-F']);
let teams=[];
for(let y=1;y<=4;y++)for(let i=0;i<10;i++){let id=y+'-'+SECTIONS[i];teams.push({id,year:y,section:SECTIONS[i],name:NAMES[y][i],status:REGISTERED.has(id)?'Registered':'Awaiting entry',players:REGISTERED.has(id)?(5+(i%4))+' players':'Entry pending'});}
function getEntries(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return []}}
function allTeams(){const entries=getEntries();return teams.map(t=>{const e=entries.find(x=>x.year===String(t.year)&&x.section===t.section);return e?{...t,name:e.team,status:'Demo entry saved',players:e.squadSize,custom:true}:t;});}
function renderTeams(filter='all'){
 const data=allTeams().filter(t=>filter==='all'||filter==='registered'&&t.status!=='Awaiting entry'||String(t.year)===filter);
 $('teamGrid').innerHTML=data.map(t=>`<article class="teamCard"><div class="teamTop"><span class="teamNum">YEAR ${t.year} / SECTION ${t.section}</span><span class="status">${t.status}</span></div><h3>${escapeHTML(t.name)}</h3><p>${t.custom?'Demo registration saved in this browser.':'Sample team slot for the tournament prototype.'}</p><footer><span>${t.custom?'DEMO ENTRY':t.status==='Registered'?'SAMPLE ENTRY':'OPEN SLOT'}</span><span>${escapeHTML(t.players)}</span></footer></article>`).join('');
 $('visibleTeams').textContent=data.length;$('registeredCount').textContent=allTeams().filter(t=>t.status!=='Awaiting entry').length;
}
function escapeHTML(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
renderTeams();
document.querySelectorAll('[data-year]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-year]').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderTeams(b.dataset.year);}));
function openForm(){if(Date.now()>DEADLINE.getTime()){notify('The sample registration deadline has passed. Update the demo deadline to test registration.');return;}$('regForm').reset();$('formMsg').textContent='';$('sectionSelect').innerHTML='<option value="">Choose section</option>'+SECTIONS.map(s=>`<option value="${s}">Section ${s}</option>`).join('');$('regDialog').showModal();}
document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',openForm));
$('closeDialog').addEventListener('click',()=>$('regDialog').close());
$('regDialog').addEventListener('click',e=>{if(e.target===$('regDialog'))$('regDialog').close();});
function notify(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600);}
const FIXTURES=[
[['09:00 AM','Team check-in & verification','Captains confirm squads and review the playing rules.','ALL TEAMS'],['10:00 AM','Opening briefing','Tournament draw, match format and fair-play reminder.','MAIN PITCH'],['11:00 AM','Group-stage matches — Block A','Opening round of the sample group-stage fixtures.','GROUP STAGE'],['02:00 PM','Group-stage matches — Block B','Afternoon games and initial standings update.','GROUP STAGE']],
[['09:00 AM','Group-stage matches — final round','Final pool games and qualification calculations.','GROUP STAGE'],['11:30 AM','Quarterfinals','Top qualifying teams advance to the knockout bracket.','KNOCKOUT'],['02:00 PM','Semifinals','Four teams compete for a place in the final.','KNOCKOUT'],['04:00 PM','Fair-play review & final briefing','Officials confirm finalists and match-day procedures.','MATCH CENTRE']],
[['10:00 AM','Third-place match','Optional placement fixture, subject to organizer approval.','PLACEMENT'],['12:00 PM','Championship final','The finalists compete for the ARENA 26 trophy.','THE FINAL'],['02:00 PM','Awards & closing ceremony','Trophy presentation and recognition of participating teams.','CEREMONY']]
];
function renderDay(d){$('matchList').innerHTML=FIXTURES[d].map(x=>`<article class="rowMatch"><div class="time">${x[0]}<small>PROPOSED TIME</small></div><div class="matchTitle"><i class="dot"></i><div><h3>${x[1]}</h3><p>${x[2]}</p></div></div><span class="tag">${x[3]}</span></article>`).join('');}
document.querySelectorAll('[data-day]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-day]').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderDay(Number(b.dataset.day));}));
renderDay(0);
function tick(){let n=Math.max(0,DEADLINE.getTime()-Date.now()),d=Math.floor(n/86400000);n%=86400000;let h=Math.floor(n/3600000);n%=3600000;let m=Math.floor(n/60000),s=Math.floor(n%60000/1000);$('days').textContent=String(d).padStart(2,'0');$('hours').textContent=String(h).padStart(2,'0');$('minutes').textContent=String(m).padStart(2,'0');$('seconds').textContent=String(s).padStart(2,'0');$('progress').style.width=Math.max(0,Math.min(100,(Date.now()-START.getTime())/(DEADLINE.getTime()-START.getTime())*100))+'%';$('timerNote').textContent=Date.now()>DEADLINE.getTime()?'Sample deadline passed. Update the date in this file to test registration.':d<=3?'Final days in the sample registration window.':'The countdown uses the sample deadline.';}
tick();setInterval(tick,1000);
$('yearSelect').addEventListener('change',()=>{$('sectionSelect').value='';});
$('regForm').addEventListener('submit',e=>{e.preventDefault();if(!$('regForm').reportValidity())return;if(Date.now()>DEADLINE.getTime()){$('formMsg').textContent='Sample registration deadline has passed.';return;}const d=Object.fromEntries(new FormData($('regForm')).entries());if(!d.consent)return;const entries=getEntries();if(entries.some(x=>x.year===d.year&&x.section===d.section)){ $('formMsg').textContent='A demo entry already exists for this year and section in this browser.';return;}if(teams.some(t=>t.year===Number(d.year)&&t.section===d.section&&REGISTERED.has(t.id))){$('formMsg').textContent='This sample section is already marked registered. Choose another section for this demo.';return;}d.ref='A26-'+Date.now().toString(36).toUpperCase();d.savedAt=new Date().toISOString();entries.push(d);localStorage.setItem(KEY,JSON.stringify(entries));$('formMsg').textContent='Demo entry saved. Reference: '+d.ref;$('formMsg').style.color='#4d7610';renderTeams(document.querySelector('[data-year].active')?.dataset.year||'all');notify('Demo entry saved in this browser.');setTimeout(()=>$('regDialog').close(),1500);});
$('exportBtn').addEventListener('click',()=>{const entries=getEntries();if(!entries.length){notify('No submitted demo registrations to export yet.');return;}const cols=['ref','captain','email','phone','year','section','team','squadSize','savedAt'];const csv=[cols.join(','),...entries.map(r=>cols.map(k=>'"'+String(r[k]??'').replace(/"/g,'""')+'"').join(','))].join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));const a=document.createElement('a');a.href=url;a.download='arena26-football-demo-registrations.csv';a.click();URL.revokeObjectURL(url);notify('CSV export started.');});
$('menuBtn').addEventListener('click',()=>{const open=$('nav').classList.toggle('open');$('menuBtn').textContent=open?'×':'☰';$('menuBtn').setAttribute('aria-expanded',String(open));});
document.querySelectorAll('#nav a').forEach(a=>a.addEventListener('click',()=>$('nav').classList.remove('open')));
