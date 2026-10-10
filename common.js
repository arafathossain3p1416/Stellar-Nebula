const CHS=['ভৌত রাশি এবং তাদের পরিমাপ','গতি','বল','কাজ, ক্ষমতা ও শক্তি','পদার্থের অবস্থা ও চাপ','বস্তুর ওপর তাপের প্রভাব','তরঙ্গ ও শব্দ','আলোর প্রতিফলন','আলোর প্রতিসরণ','স্থির বিদ্যুৎ','চল বিদ্যুৎ','বিদ্যুতের চৌম্বক ক্রিয়া','তেজস্ক্রিয়তা ও ইলেকট্রনিক্স'];
const DONE=[1,2,3,4,5,6,7,8,9,10,11,12,13]; // যে অধ্যায়ের পেজ তৈরি হয়েছে
const pad=n=>String(n).padStart(2,'0'),PI=Math.PI,$=s=>document.querySelector(s),cl=(v,a,b)=>Math.min(b,Math.max(a,v));
const navHTML=cur=>CHS.map((c,i)=>DONE.includes(i+1)?`<a href="ch${pad(i+1)}.html" ${i+1==cur?'aria-current="page"':''}>${i+1}. ${c}</a>`:`<span>${i+1}. ${c}</span>`).join('');
let g,col={};
const ln=(a,b,c,d,k=col.ink,w=2,dash)=>{g.beginPath();g.setLineDash(dash?[6,5]:[]);g.strokeStyle=k;g.lineWidth=w;g.moveTo(a,b);g.lineTo(c,d);g.stroke();g.setLineDash([])};
const ci=(x,y,r,k)=>{g.beginPath();g.fillStyle=k;g.arc(x,y,r,0,7);g.fill()};
const tx=(s,x,y,k=col.ink,al='left')=>{g.fillStyle=k;g.textAlign=al;g.fillText(s,x,y)};
const rc=(x,y,w,h,k)=>{g.fillStyle=k;g.fillRect(x,y,w,h)};
const ar=(a,b,c,d,k)=>{ln(a,b,c,d,k,3);const t=Math.atan2(d-b,c-a);g.beginPath();g.fillStyle=k;g.moveTo(c,d);g.lineTo(c-10*Math.cos(t-.4),d-10*Math.sin(t-.4));g.lineTo(c-10*Math.cos(t+.4),d-10*Math.sin(t+.4));g.fill()};
const dt=(x1,y1,x2,y2,sp,t)=>{for(let k=0;k<6;k++){const u=(k/6+t*sp*.04)%1;ci(x1+(x2-x1)*u,y1+(y2-y1)*u,3.5,col.am)}};

let SC=0;
const BN='০১২৩৪৫৬৭৮৯',toBn=s=>String(s).replace(/\d/g,d=>BN[d]).replace('-','−'),fromBn=s=>+s.replace(/[০-৯]/g,d=>BN.indexOf(d)).replace('−','-');
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
// ২–৪টি পূর্ণসংখ্যার বিকল্পওয়ালা নিয়ন্ত্রণকে রেডিও বোতামে বদলায়; লেবেলের (০ = ..., ১ = ...) অংশ থেকে নাম নেয়
function parseOpts(c){const[k,l,mn,mx,v,st]=c;if(!(Number.isInteger(mn)&&Number.isInteger(mx)&&st>=1&&(mx-mn)/st<=3))return null;
 const vals=[];for(let x=mn;x<=mx;x+=st)vals.push(x);let base=l,txt={};const m=l.match(/^(.*?)\s*\((.*)\)\s*$/);
 if(m){const ps=m[2].split(/,\s*/).map(s=>s.split(/\s*=\s*/));if(ps.every(a=>a.length==2&&!isNaN(fromBn(a[0])))){base=m[1];ps.forEach(a=>txt[fromBn(a[0])]=a[1])}}
 return{base,vals,txt}}

// o: {t:শিরোনাম, c:[[key,লেবেল,min,max,মান,step]], f:(p,t,m)=>{}, dr:m=>({key:মান}) (ঐচ্ছিক)}
// f এ দ্বিতীয় প্যারামিটার (t) থাকলে সিমুলেশনটি চলমান ধরা হয় এবং থামান/আবার শুরু বোতাম আসে
function sim(o){
  const W=640,H=o.h||380,id='s'+(++SC),sec=document.createElement('section'),anim=o.f.length>1,info=typeof INFO!='undefined'?INFO[o.t]:null;sec.id=id;
  sec.innerHTML=`<h2>${o.t}</h2><div class="box"><canvas></canvas></div>`+(anim?`<div class="bar"><button type="button" class="pz">⏸ থামান</button><button type="button" class="rs">↺ আবার শুরু</button></div>`:'')+`<div class="ctl"></div><p class="hint">${o.dr?'ছবির উপর মাউস বা আঙুল টেনে নাড়িয়ে দেখুন।':''}</p>`
   +(info?`<div class="info"><b>সূত্র</b>${info.f.map(x=>`<div class="fm">${esc(x)}</div>`).join('')}<b>বর্ণনা</b><p>${esc(info.d)}</p></div>`:'');
  $('#sims').append(sec);
  const cv=sec.querySelector('canvas'),ctx=cv.getContext('2d'),P={},M={x:0,y:0,d:0},cs=o.c.map(c=>({c,op:parseOpts(c)}));let tc=0,last=performance.now(),paused=false;
  const rst=()=>{if(!paused)tc=0},R=k=>sec.querySelectorAll(`input[name="${id}${k}"]`);
  const sy=()=>cs.forEach(({c,op})=>{const k=c[0];if(op)R(k).forEach(r=>r.checked=+r.value==P[k]);else{sec.querySelector('#'+k+id).value=P[k];sec.querySelector('#v'+k+id).textContent=P[k]}});
  o.c.forEach(c=>P[c[0]]=c[4]);
  sec.querySelector('.ctl').innerHTML=cs.map(({c,op})=>op?`<fieldset class="opts"><legend>${op.base}</legend>${op.vals.map(v=>`<label><input type="radio" name="${id}${c[0]}" value="${v}"> ${op.txt[v]||toBn(v)}</label>`).join('')}</fieldset>`
   :`<label>${c[1]}: <b id="v${c[0]}${id}"></b><input type="range" id="${c[0]}${id}" min="${c[2]}" max="${c[3]}" step="${c[5]}" value="${c[4]}"></label>`).join('');
  cs.forEach(({c,op})=>{const k=c[0];if(op)R(k).forEach(r=>r.onchange=e=>{P[k]=+e.target.value;sy();rst()});else sec.querySelector('#'+k+id).oninput=e=>{P[k]=+e.target.value;sy();rst()}});sy();
  if(anim){const pz=sec.querySelector('.pz');pz.onclick=()=>{paused=!paused;pz.textContent=paused?'▶ চালু করুন':'⏸ থামান'};sec.querySelector('.rs').onclick=()=>{tc=0;paused=false;pz.textContent='⏸ থামান'}}
  const pt=e=>{const b=cv.getBoundingClientRect();M.x=(e.clientX-b.left)*W/b.width;M.y=(e.clientY-b.top)*H/b.height};
  cv.onpointerdown=e=>{M.d=1;pt(e);cv.setPointerCapture(e.pointerId)};cv.onpointermove=e=>{if(M.d)pt(e)};cv.onpointerup=cv.onpointercancel=()=>M.d=0;
  const lp=now=>{const dt=Math.min(.1,(now-last)/1000);last=now;if(!paused)tc+=dt;const cs_=getComputedStyle(document.documentElement);['ink','ac','am','ln','bg','pn'].forEach(k=>col[k]=cs_.getPropertyValue('--'+k).trim());
    const r=devicePixelRatio||1,w=Math.round(cv.clientWidth*r);if(cv.width!=w){cv.width=w;cv.height=Math.round(w*H/W)}
    g=ctx;g.setTransform(cv.width/W,0,0,cv.width/W,0,0);g.clearRect(0,0,W,H);g.font='600 16px "Hind Siliguri",sans-serif';
    if(M.d&&o.dr){Object.assign(P,o.dr(M));sy();rst()}
    o.f(P,tc,M);requestAnimationFrame(lp)};
  requestAnimationFrame(lp);
}
