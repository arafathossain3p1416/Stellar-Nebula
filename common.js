const CHS=['ভৌত রাশি এবং তাদের পরিমাপ','গতি','বল','কাজ, ক্ষমতা ও শক্তি','পদার্থের অবস্থা ও চাপ','বস্তুর ওপর তাপের প্রভাব','তরঙ্গ ও শব্দ','আলোর প্রতিফলন','আলোর প্রতিসরণ','স্থির বিদ্যুৎ','চল বিদ্যুৎ','বিদ্যুতের চৌম্বক ক্রিয়া','তেজস্ক্রিয়তা ও ইলেকট্রনিক্স'];
const DONE=[1,2,3,4,5,6,7,8,9,10,11]; // যে অধ্যায়ের পেজ তৈরি হয়েছে
const pad=n=>String(n).padStart(2,'0'),PI=Math.PI,$=s=>document.querySelector(s),cl=(v,a,b)=>Math.min(b,Math.max(a,v));
const navHTML=cur=>CHS.map((c,i)=>DONE.includes(i+1)?`<a href="ch${pad(i+1)}.html" ${i+1==cur?'aria-current="page"':''}>${i+1}. ${c}</a>`:`<span>${i+1}. ${c}</span>`).join('');
let g,col={};
const ln=(a,b,c,d,k=col.ink,w=2,dash)=>{g.beginPath();g.setLineDash(dash?[6,5]:[]);g.strokeStyle=k;g.lineWidth=w;g.moveTo(a,b);g.lineTo(c,d);g.stroke();g.setLineDash([])};
const ci=(x,y,r,k)=>{g.beginPath();g.fillStyle=k;g.arc(x,y,r,0,7);g.fill()};
const tx=(s,x,y,k=col.ink,al='left')=>{g.fillStyle=k;g.textAlign=al;g.fillText(s,x,y)};
const rc=(x,y,w,h,k)=>{g.fillStyle=k;g.fillRect(x,y,w,h)};
const ar=(a,b,c,d,k)=>{ln(a,b,c,d,k,3);const t=Math.atan2(d-b,c-a);g.beginPath();g.fillStyle=k;g.moveTo(c,d);g.lineTo(c-10*Math.cos(t-.4),d-10*Math.sin(t-.4));g.lineTo(c-10*Math.cos(t+.4),d-10*Math.sin(t+.4));g.fill()};
const dt=(x1,y1,x2,y2,sp,t)=>{for(let k=0;k<6;k++){const u=(k/6+t*sp*.04)%1;ci(x1+(x2-x1)*u,y1+(y2-y1)*u,3.5,col.am)}};

// o: {t:শিরোনাম, c:[[key,লেবেল,min,max,মান,step]], f:(p,t,m)=>{}, dr:m=>({key:মান}) (ঐচ্ছিক)}
function sim(o){
  const W=640,H=o.h||380,sec=document.createElement('section');
  sec.innerHTML=`<h2>${o.t}</h2><div class="box"><canvas></canvas></div><div class="ctl"></div><p class="hint">${o.dr?'ছবির উপর মাউস বা আঙুল টেনে নাড়িয়ে দেখুন।':''}</p>`;
  $('#sims').append(sec);
  const cv=sec.querySelector('canvas'),ctx=cv.getContext('2d'),P={},M={x:0,y:0,d:0},ids=[];let t0=performance.now();
  const sy=()=>o.c.forEach(c=>{sec.querySelector('#'+c[0]+sec.id).value=P[c[0]];sec.querySelector('#v'+c[0]+sec.id).textContent=P[c[0]]});
  sec.id='s'+document.querySelectorAll('section').length;
  o.c.forEach(c=>P[c[0]]=c[4]);
  sec.querySelector('.ctl').innerHTML=o.c.map(c=>`<label>${c[1]}: <b id="v${c[0]}${sec.id}"></b><input type="range" id="${c[0]}${sec.id}" min="${c[2]}" max="${c[3]}" step="${c[5]}" value="${c[4]}"></label>`).join('');
  o.c.forEach(c=>sec.querySelector('#'+c[0]+sec.id).oninput=e=>{P[c[0]]=+e.target.value;sy();t0=performance.now()});sy();
  const pt=e=>{const b=cv.getBoundingClientRect();M.x=(e.clientX-b.left)*W/b.width;M.y=(e.clientY-b.top)*H/b.height};
  cv.onpointerdown=e=>{M.d=1;pt(e);cv.setPointerCapture(e.pointerId)};cv.onpointermove=e=>{if(M.d)pt(e)};cv.onpointerup=cv.onpointercancel=()=>M.d=0;
  const lp=now=>{const cs=getComputedStyle(document.documentElement);['ink','ac','am','ln','bg'].forEach(k=>col[k]=cs.getPropertyValue('--'+k).trim());
    const r=devicePixelRatio||1,w=Math.round(cv.clientWidth*r);if(cv.width!=w){cv.width=w;cv.height=Math.round(w*H/W)}
    g=ctx;g.setTransform(cv.width/W,0,0,cv.width/W,0,0);g.clearRect(0,0,W,H);g.font='600 16px "Hind Siliguri",sans-serif';
    if(M.d&&o.dr){Object.assign(P,o.dr(M));sy();t0=now}
    o.f(P,(now-t0)/1000,M);requestAnimationFrame(lp)};
  requestAnimationFrame(lp);
}
