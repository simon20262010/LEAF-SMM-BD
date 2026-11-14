/* ===== app5: থিম, অ্যাভাটার, চ্যালেঞ্জ, সর্ট, QR/কপি, লিংক ঠিক, স্মার্ট সহকারী, রিসেলার ব্যানার/র‍্যাংক ===== */
const _sleep=ms=>new Promise(r=>setTimeout(r,ms));
const _tgb=()=>window.Telegram&&window.Telegram.WebApp;

/* ---- থিম (১১) ---- */
const THEMES=[['blue','নীল','#1e88e5'],['green','সবুজ','#16a34a'],['purple','বেগুনি','#7c3aed'],['pink','গোলাপি','#ec4899'],['orange','কমলা','#f97316'],['teal','টিল','#0d9488']];
function setTheme(k){if(!THEMES.some(x=>x[0]==k))k='blue';document.documentElement.dataset.th=k=='blue'?'':k;LS.s('th',k)}
setTheme(LS.g('th')||'blue');
(function(){const d=$('#mDk');if(!d||$('#mTh'))return;const m=document.createElement('div');m.className='mi';m.id='mTh';
  m.innerHTML='<span class="i"><i class="fa-solid fa-palette"></i></span><span>অ্যাপের রং (থিম)</span><i class="fa-solid fa-chevron-right"></i>';d.insertAdjacentElement('afterend',m);
  m.onclick=()=>{const cur=LS.g('th')||'blue';G(`<div class="sec"><i class="fa-solid fa-palette"></i>পছন্দের রং বেছে নিন</div><div class="thg">${THEMES.map(x=>`<button data-t="${x[0]}" class="${x[0]==cur?'on':''}"><i style="background:${x[2]}"></i>${x[1]}</button>`).join('')}</div>`);
    $$('#gBody .thg button').forEach(b=>b.onclick=()=>{setTheme(b.dataset.t);$$('#gBody .thg button').forEach(x=>x.classList.toggle('on',x==b));toast('থিম বদলেছে 🎨','ok')})}})();

/* ---- অ্যাভাটার + লেভেল ফ্রেম (১২, ২০) ---- */
const AVE=['🦊','🐯','🦁','🐼','🐨','🐸','🦄','🐙','🦋','🐬','🦅','🐺','🐲','🤖','👑','🚀','⚡','🔥','💎','🌟','🎯','🎮','🍀','🌈','🦈','🐧','🐝','🎧','😎','🥷'];
const AVG=['linear-gradient(135deg,#42a5f5,#1565c0)','linear-gradient(135deg,#f472b6,#be185d)','linear-gradient(135deg,#34d399,#047857)','linear-gradient(135deg,#fbbf24,#b45309)','linear-gradient(135deg,#a78bfa,#5b21b6)','linear-gradient(135deg,#fb7185,#be123c)','linear-gradient(135deg,#22d3ee,#0e7490)','linear-gradient(135deg,#94a3b8,#334155)','linear-gradient(135deg,#f97316,#c2410c)','linear-gradient(135deg,#84cc16,#3f6212)'];
const LVE=['🌱','🥉','🥈','👑','💎'];
function avPaint(){const m=S.me,a=$('#sAv');if(!a||!m)return;const li=lvIdx(m.totalSpent||0);
  a.dataset.lv=LVE[li];a.className='av fr'+li;
  if(m.avatar&&m.avatar.e){a.style.background=AVG[m.avatar.g||0];if(!a.querySelector('.ave'))a.innerHTML=`<span class="ave">${m.avatar.e}</span>`}else a.style.background=''}
(function(){const a=$('#sAv');if(!a)return;new MutationObserver(()=>avPaint()).observe(a,{childList:true});
  a.onclick=()=>{const m=S.me||{},cur=m.avatar||{e:AVE[0],g:0};let e=cur.e,g=cur.g||0;
    G(`<div class="avp"><div class="sec"><i class="fa-solid fa-face-smile"></i>আপনার অ্যাভাটার</div><div class="av pv fr${lvIdx(m.totalSpent||0)}" id="avPv" data-lv="${LVE[lvIdx(m.totalSpent||0)]}"></div>
      <div class="avc">${AVG.map((x,i)=>`<i data-g="${i}" style="background:${x}" class="${i==g?'on':''}"></i>`).join('')}</div>
      <div class="avg">${AVE.map(x=>`<button data-e="${x}" class="${x==e?'on':''}">${x}</button>`).join('')}</div>
      <button class="btn" id="avSave">সেভ করুন</button><button class="btn" id="avTg" style="background:#fff;color:var(--p);border:1.5px solid var(--p);box-shadow:none;margin-top:10px">টেলিগ্রামের ছবি ব্যবহার করুন</button></div>`);
    const pv=()=>{const p=$('#avPv');p.style.background=AVG[g];p.innerHTML=`<span class="ave">${e}</span>`};pv();
    $$('#gBody .avg button').forEach(b=>b.onclick=()=>{e=b.dataset.e;$$('#gBody .avg button').forEach(x=>x.classList.toggle('on',x==b));pv()});
    $$('#gBody .avc i').forEach(b=>b.onclick=()=>{g=+b.dataset.g;$$('#gBody .avc i').forEach(x=>x.classList.toggle('on',x==b));pv()});
    const done=async r=>{if(r.error)return toast(r.error,'er');$('#gModal').classList.add('hide');S._h='';await syncNow(true);toast('অ্যাভাটার বদলেছে ✨','ok')};
    $('#avSave').onclick=async()=>done(await api('/u/avatar',{e,g}));
    $('#avTg').onclick=async()=>{const r=await api('/u/avatar',{clear:1});S.me&&(S.me.avatar=null);done(r)}}})();

/* ---- সাপ্তাহিক চ্যালেঞ্জ (৬) ---- */
(function(){const b=$('#banner');if(!b||$('#chalBox'))return;const w=document.createElement('div');w.id='chalBox';b.insertAdjacentElement('beforebegin',w)})();
let _chT=0;
async function loadChal(force){
  if(!S.me||(!force&&Date.now()-_chT<60000))return;_chT=Date.now();
  const j=await api('/u/challenge',{}).catch(()=>null),w=$('#chalBox');if(!w)return;
  if(!j||!j.on){w.innerHTML='';return}
  const p=Math.min(100,j.done/j.need*100),ok=j.done>=j.need;
  w.innerHTML=`<div class="chal ${ok?'done':''}"><b class="h">🎯 সাপ্তাহিক চ্যালেঞ্জ</b><div style="font-size:13px;margin-top:2px">এই সপ্তাহে <b>${bnum(j.need)}</b> টা অর্ডার দিলেই <b>${tk(j.prize)}</b> বোনাস!</div>
   <div class="pr"><i style="width:${p}%"></i></div><small>${bnum(Math.min(j.done,j.need))}/${bnum(j.need)} অর্ডার সম্পন্ন • আর ${bnum(j.daysLeft)} দিন বাকি</small>
   ${j.claimed?'<button disabled>✅ এই সপ্তাহের পুরস্কার নেওয়া হয়েছে</button>':ok?'<button id="chalGo">🎁 পুরস্কার নিন</button>':''}</div>`;
  const g=$('#chalGo');if(g)g.onclick=async()=>{g.disabled=true;const r=await api('/u/challenge-claim',{}).catch(()=>({error:'নেটওয়ার্ক সমস্যা'}));if(r.error){g.disabled=false;return toast(r.error,'er')}toast('🎉 '+tk(r.prize)+' বোনাস পেয়েছেন','ok');celebrate();S._h='';syncNow(true);loadChal(true)};
}
setInterval(()=>{try{loadChal()}catch{}},5000);

/* ---- সার্ভিস সর্ট (২৭) ---- */
(function(){const s=$('#svc');if(!s||$('#sortSel'))return;const w=document.createElement('select');w.id='sortSel';w.className='sortsel';
  w.innerHTML='<option value="">↕️ সাজান: ডিফল্ট</option><option value="lo">💰 দাম: কম থেকে বেশি</option><option value="hi">💎 দাম: বেশি থেকে কম</option><option value="no">🔢 নম্বর অনুযায়ী</option>';
  const row=s.parentElement;row.insertAdjacentElement('beforebegin',w);w.onchange=()=>{S.sort=w.value;fillSvcs()}})();

/* ---- আবার অর্ডার: এক ধাপে কনফার্ম (২৩) ---- */
document.addEventListener('click',e=>{const b=e.target.closest('[data-ro]');if(!b)return;
  setTimeout(()=>{const s=S.cur;if(!s)return;const q=+$('#qty').value||0;
    G(`<div class="sec"><i class="fa-solid fa-rotate-right"></i>আবার অর্ডার</div><div class="hi" style="display:block"><b>#${s.no||s.sid}</b> ${esc(s.name)}<br><small style="color:var(--mu)">${esc($('#link').value)}</small><br>পরিমাণ <b>${bnum(q)}</b> • মোট <b>${tk(q*s.rate/1000*(1-disc()/100))}</b></div><button class="btn" id="roGo">✅ এখনই অর্ডার করুন</button>`);
    $('#roGo').onclick=()=>{$('#gModal').classList.add('hide');$('#order').click()}},60)});

/* ---- ডিপোজিট: নাম্বার কপি, অ্যাপ/ডায়াল, QR (৩৮, ৩৯) ---- */
let _qrL=null;
function loadQR(){return _qrL||(_qrL=new Promise((ok,no)=>{if(window.QRCode)return ok();const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';s.onload=ok;s.onerror=()=>{_qrL=null;no()};document.head.appendChild(s)}))}
async function qrCanvas(text,size){await loadQR();const d=document.createElement('div');new QRCode(d,{text,width:size,height:size,correctLevel:QRCode.CorrectLevel.M});await _sleep(60);return d.querySelector('canvas')||d.querySelector('img')}
const _PAYAPP=[[/bkash|বিকাশ/i,'com.bKash.customerapp','*247#'],[/nagad|নগদ/i,'com.konasl.nagad','*167#'],[/rocket|রকেট/i,'com.dbbl.mbs.apps.main','*322#']];
function payExtra(){
  const h=$('#how');if(!h||h.querySelector('#payX')||S.pm==null)return;const x=(S.set.methods||[])[S.pm];if(!x)return;
  const ap=_PAYAPP.find(a=>a[0].test(x.name)),w=document.createElement('div');w.id='payX';
  w.innerHTML=`<div class="payx"><button id="pxCp">📋 নাম্বার কপি</button>${ap?`<button id="pxDl">☎️ ${esc(ap[2])} ডায়াল</button>`:''}<button id="pxQr">🔳 QR কোড</button></div><div class="qrb hide" id="pxQb"></div>`;
  h.appendChild(w);
  $('#pxCp').onclick=async()=>{try{await navigator.clipboard.writeText(x.number);toast('নাম্বার কপি হয়েছে ✅','ok')}catch{prompt('কপি করুন:',x.number)}};
  if(ap){$('#pxDl').onclick=()=>{const l=document.createElement('a');l.href='tel:'+encodeURIComponent(ap[2]);l.target='_blank';l.rel='noopener';document.body.appendChild(l);l.click();l.remove()}}
  $('#pxQr').onclick=async()=>{const b=$('#pxQb');if(!b.classList.contains('hide')){b.classList.add('hide');return}b.classList.remove('hide');b.innerHTML='লোড হচ্ছে...';
    try{if(x.qr){b.innerHTML=`<img src="${esc(x.qr)}" alt="QR">`}else{const c=await qrCanvas(String(x.number),170);b.innerHTML='';b.appendChild(c)}b.insertAdjacentHTML('beforeend',`<div style="font-size:12px;color:var(--mu);margin-top:6px">${esc(x.name)}: <b>${esc(x.number)}</b></div>`)}catch{b.innerHTML='QR লোড হয়নি (নেট চেক করুন)'}}
}
(function(){const h=$('#how');if(h)new MutationObserver(()=>payExtra()).observe(h,{childList:true})})();

/* ---- রেফারেল শেয়ার কার্ড (৫১) + টেলিগ্রামে ইনভাইট (৫৫) ---- */
(function(){const r=$('#rShare');if(!r)return;
  r.onclick=async()=>{
    const m=S.me||{},li=lvIdx(m.totalSpent||0),nm=(tgUser?[tgUser.first_name,tgUser.last_name].filter(Boolean).join(' '):m.name)||'',l=refLink();
    const c=document.createElement('canvas');c.width=1080;c.height=1440;const x=c.getContext('2d');
    const g=x.createLinearGradient(0,0,1080,1440);g.addColorStop(0,'#0b3d91');g.addColorStop(.55,'#1e88e5');g.addColorStop(1,'#7c4dff');x.fillStyle=g;x.fillRect(0,0,1080,1440);
    x.fillStyle='rgba(255,255,255,.07)';[[950,160,330],[90,1230,400],[1010,1320,170],[120,200,120]].forEach(([a,b,r])=>{x.beginPath();x.arc(a,b,r,0,7);x.fill()});
    x.textAlign='center';x.fillStyle='#fff';x.font="700 74px 'Hind Siliguri',sans-serif";x.fillText('☘️ '+(S.set.siteName||'SMM Panel'),540,170);
    x.font="500 40px 'Hind Siliguri',sans-serif";x.fillStyle='rgba(255,255,255,.88)';x.fillText('সহজে অর্ডার • কম দামে সেরা সার্ভিস',540,240);
    // গ্লাস কার্ড
    x.fillStyle='rgba(255,255,255,.14)';x.beginPath();x.roundRect?x.roundRect(90,310,900,640,56):x.rect(90,310,900,640);x.fill();
    x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=3;x.stroke();
    // অ্যাভাটার
    const av=m.avatar&&m.avatar.e?m.avatar:null,cg=x.createLinearGradient(440,350,640,550);cg.addColorStop(0,['#22c55e','#f59e0b','#cbd5e1','#fbbf24','#22d3ee'][li]);cg.addColorStop(1,['#86efac','#fde68a','#f8fafc','#fef08a','#a78bfa'][li]);
    x.fillStyle=cg;x.beginPath();x.arc(540,440,84,0,7);x.fill();x.fillStyle='#1e3a8a';x.beginPath();x.arc(540,440,72,0,7);x.fill();
    x.fillStyle='#fff';x.font="64px sans-serif";x.fillText(av?av.e:(nm[0]||'U').toUpperCase(),540,462);
    x.font="700 54px 'Hind Siliguri',sans-serif";x.fillText(nm.slice(0,22),540,600);x.font="600 38px 'Hind Siliguri',sans-serif";x.fillStyle='#fde68a';x.fillText(LVE[li]+' '+(lvl()[li][0])+' সদস্য',540,654);
    x.fillStyle='#fff';x.font="600 44px 'Hind Siliguri',sans-serif";x.fillText('আমার লিংকে জয়েন করুন, আর',540,740);
    x.fillStyle='#fde047';x.font="800 118px Poppins,sans-serif";x.fillText((S.set.refPercent||0)+'%',540,860);x.fillStyle='#fff';x.font="600 38px 'Hind Siliguri',sans-serif";x.fillText('কমিশন পান প্রতিটি ডিপোজিটে',540,925);
    // কোড + QR
    x.fillStyle='#fff';x.beginPath();x.roundRect?x.roundRect(90,1010,520,250,36):x.rect(90,1010,520,250);x.fill();
    x.fillStyle='#64748b';x.font="600 32px 'Hind Siliguri',sans-serif";x.fillText('রেফারেল কোড',350,1070);x.fillStyle='#0b3d91';x.font="800 62px Poppins,sans-serif";x.fillText(String(tgUser?tgUser.id:S.uid).slice(-12),350,1150);
    x.fillStyle='#1e88e5';x.font="600 28px Poppins,sans-serif";x.fillText(l.replace(/^https?:\/\//,'').slice(0,28),350,1215);
    try{const q=await qrCanvas(l,220);x.fillStyle='#fff';x.beginPath();x.roundRect?x.roundRect(650,1010,340,250,36):x.rect(650,1010,340,250);x.fill();x.drawImage(q,705,1025,220,220)}catch{x.fillStyle='rgba(255,255,255,.18)';x.fillRect(650,1010,340,250)}
    x.fillStyle='#fff';x.font="700 46px 'Hind Siliguri',sans-serif";x.fillText('স্ক্যান করুন বা লিংকে ক্লিক করুন 👆',540,1370);
    const bl=await new Promise(r=>c.toBlob(r,'image/png')),f=new File([bl],'refer.png',{type:'image/png'});
    if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],text:l});return}catch{}}
    G(`<div class="sec"><i class="fa-solid fa-image"></i>শেয়ার কার্ড</div><img src="${c.toDataURL('image/png')}" style="width:100%;border-radius:16px"><div class="how" style="margin-top:10px">ছবিটা চেপে ধরে সেভ করুন, তারপর যেখানে খুশি শেয়ার করুন।</div><button class="btn" id="rShL"><i class="fa-brands fa-telegram"></i> টেলিগ্রামে লিংক পাঠান</button>`);
    $('#rShL').onclick=()=>tgInvite()};
  const cp=$('#rCopy');if(cp&&!$('#rInv')){const b=document.createElement('button');b.id='rInv';b.className=cp.className;b.style.cssText=cp.style.cssText;b.innerHTML='<i class="fa-brands fa-telegram"></i> বন্ধুকে টেলিগ্রামে ইনভাইট';cp.insertAdjacentElement('afterend',b);b.onclick=()=>tgInvite()}})();
function tgInvite(){const l=refLink(),u='https://t.me/share/url?url='+encodeURIComponent(l)+'&text='+encodeURIComponent('🔥 কম দামে সেরা SMM সার্ভিস! আমার লিংকে জয়েন করুন 👇');const T=_tgb();T&&T.openTelegramLink?T.openTelegramLink(u):window.open(u)}

/* ---- লিংক স্মার্ট সংশোধন (৭৬) ---- */
const _DOM={facebook:/facebook\.com|fb\.com|fb\.watch/i,instagram:/instagram\.com/i,youtube:/youtube\.com|youtu\.be/i,tiktok:/tiktok\.com/i,telegram:/t\.me|telegram\.me/i,twitter:/twitter\.com|x\.com/i,whatsapp:/whatsapp\.com|wa\.me/i};
const _PN={facebook:'ফেসবুক',instagram:'ইনস্টাগ্রাম',youtube:'ইউটিউব',tiktok:'টিকটক',telegram:'টেলিগ্রাম',twitter:'টুইটার',whatsapp:'হোয়াটসঅ্যাপ'};
function linkFix(v,s){
  const notes=[];let x=String(v||'').trim().replace(/\s+/g,'');const pl=s&&s.platform;
  if(/^@[\w.]{2,40}$/.test(x)&&pl){const u=x.slice(1);const M={instagram:'https://instagram.com/'+u,tiktok:'https://tiktok.com/@'+u,twitter:'https://x.com/'+u,telegram:'https://t.me/'+u,facebook:'https://facebook.com/'+u,youtube:'https://youtube.com/@'+u};if(M[pl]){x=M[pl];notes.push('ইউজারনেম থেকে পুরো লিংক বানানো হয়েছে')}}
  else if(x&&!/^https?:\/\//i.test(x)&&/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(x)){x='https://'+x;notes.push('https:// যোগ করা হয়েছে')}
  try{const u=new URL(x);const del=[];[...u.searchParams.keys()].forEach(k=>{if(/^(utm_|fbclid|igshid|igsh|si$|feature|ref$|mibextid|share_id|_t$|_r$|is_from_webapp|sender_device|web_id|refer)/i.test(k))del.push(k)});
    if(del.length){del.forEach(k=>u.searchParams.delete(k));x=u.toString();notes.push('ট্র্যাকিং অংশ বাদ দেওয়া হয়েছে')}
    if(/youtube\.com$/i.test(u.hostname)&&u.pathname=='/watch'&&u.searchParams.get('v')&&[...u.searchParams.keys()].length>1){x='https://www.youtube.com/watch?v='+u.searchParams.get('v');notes.push('শুধু ভিডিও আইডি রাখা হয়েছে')}
    if(x.endsWith('?'))x=x.slice(0,-1)}catch{}
  let warn='';if(pl&&_DOM[pl]&&/^https?:\/\//i.test(x)&&!_DOM[pl].test(x)){const o=Object.keys(_DOM).find(k=>_DOM[k].test(x));warn=o?`⚠️ এই সার্ভিস ${_PN[pl]||pl} এর, কিন্তু লিংকটা ${_PN[o]||o} এর মনে হচ্ছে`:`⚠️ লিংকটা ${_PN[pl]||pl} এর বলে মনে হচ্ছে না`}
  return{fixed:x,notes,warn,changed:x!==String(v||'').trim()}
}
(function(){const l=$('#link');if(!l||$('#lnkH'))return;const h=document.createElement('div');h.id='lnkH';h.className='hide';l.insertAdjacentElement('afterend',h);
  let t;const run=()=>{clearTimeout(t);t=setTimeout(()=>{const v=l.value;if(!v.trim()){h.className='hide';return}const r=linkFix(v,S.cur);
    if(r.changed){h.className='lnkh';h.innerHTML=`💡 ${esc(r.notes.join(', ')||'লিংক ঠিক করা যায়')}: <b style="word-break:break-all">${esc(r.fixed.slice(0,70))}</b> <button id="lnkFx">ঠিক করুন</button>`;$('#lnkFx').onclick=()=>{l.value=r.fixed;l.dispatchEvent(new Event('input'));h.className='hide'}}
    else if(r.warn){h.className='lnkh w';h.textContent=r.warn}else h.className='hide'},350)};
  l.addEventListener('input',run);l.addEventListener('blur',run);const sv=$('#svc');if(sv)sv.addEventListener('change',run)})();

/* ---- স্মার্ট সহকারী: সার্ভিস সাজেস্ট, বাজেট কম্বো, FAQ, গাইড (৭১–৭৪) ---- */
function aiCards(j){
  const w=$('#aiMsgs'),d=document.createElement('div');d.className='ai-m bot';d.style.maxWidth='96%';
  const L=(j.combo||j.picks||[]);
  d.innerHTML=esc(j.text||'')+L.map(s=>`<div class="ai-card"><b>#${s.no} ${esc(s.name)}</b><small>${tk(s.rate)}/১০০০ • ${bnum(s.min||'')}–${bnum(s.max||'')}${s.time?' • ⏱ '+esc(s.time):''}${s.why?' • '+esc(s.why):''}</small>${s.qty?`<small><b>${bnum(s.qty)}</b> টা = <b>${tk(s.cost)}</b></small>`:''}<button data-id="${esc(s.id)}" data-q="${s.qty||''}">অর্ডার করুন</button></div>`).join('')+(j.total?`<div style="margin-top:8px;font-weight:700">মোট আনুমানিক: ${tk(j.total)}</div>`:'');
  d.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>{const s=S.svcs.find(x=>x._id==b.dataset.id);if(!s)return toast('সার্ভিসটি এখন নেই','er');$('#aiBox').classList.add('hide');go('home');_sel(s);if(b.dataset.q){$('#qty').value=b.dataset.q;calc()}toast('এখন লিংক দিয়ে কনফার্ম করুন','ok');setTimeout(()=>$('#link')&&$('#link').focus(),400)});
  w.appendChild(d);w.scrollTop=w.scrollHeight;
}
function aiBtns(text,opts,cb){const w=$('#aiMsgs'),d=document.createElement('div');d.className='ai-m bot';d.textContent=text;opts.forEach(([l,v])=>{const b=document.createElement('button');b.className='ai-a';b.textContent=l;b.onclick=()=>{d.querySelectorAll('button').forEach(x=>x.disabled=true);botSay(l,null,true);cb(v)};d.appendChild(b)});w.appendChild(d);w.scrollTop=w.scrollHeight}
async function aiServer(body){const j=await api('/u/assist',body).catch(()=>null);if(!j||j.error)return botSay('এই মুহূর্তে সাজেস্ট করতে পারছি না, একটু পরে চেষ্টা করুন।');
  if(j.type=='faq'||j.type=='ask')botSay(j.text);else aiCards(j)}
function aiWizard(){
  aiBtns('কোন প্ল্যাটফর্মের জন্য সার্ভিস চান?',[['ফেসবুক','facebook'],['ইনস্টাগ্রাম','instagram'],['ইউটিউব','youtube'],['টিকটক','tiktok'],['টেলিগ্রাম','telegram']],pl=>
    aiBtns('কী চান?',[['ফলোয়ার','follow'],['লাইক','like'],['ভিউ','view'],['সাবস্ক্রাইবার','sub'],['মেম্বার','member'],['কম্বো (সব মিলিয়ে)','']],gl=>
      aiBtns('আপনার বাজেট কত?',[['৳৫০',50],['৳১০০',100],['৳২০০',200],['৳৫০০',500],['৳১০০০',1000],['বাজেট নেই',0]],bd=>aiServer({plat:pl,goal:gl,budget:bd}))))}
const _botAsk0=botAsk;
botAsk=function(txt){txt=String(txt||'').trim();if(!txt)return;
  const looks=/ফেসবুক|facebook|\bfb\b|insta|ইনস্টা|ইন্সটা|youtube|ইউটিউব|tiktok|টিকটক|telegram|টেলিগ্রাম|ফলোয়ার|follower|ভিউ|view|সাবস্ক্রাইব|subscrib|মেম্বার|member|কম্বো|combo|বাজেট|budget|টাকায়|টাকা\s*দিয়ে/i.test(txt);
  const faqAsk=/(কিভাবে|কীভাবে|how)/i.test(txt)&&!/ফেসবুক|facebook|insta|youtube|tiktok/i.test(txt);
  if(looks&&!faqAsk){botSay(txt,null,true);$('#aiIn').value='';aiServer({q:txt});return}
  const r=botAnswer(txt);
  if(String(r.t).startsWith('দুঃখিত')){botSay(txt,null,true);$('#aiIn').value='';api('/u/assist',{q:txt}).then(j=>{if(j&&!j.error&&(j.type=='faq'))botSay(j.text);else botSay(r.t,r.a)}).catch(()=>botSay(r.t,r.a));return}
  _botAsk0(txt)};
(function(){const c=$('#aiChips');if(!c)return;new MutationObserver(()=>{if(c.querySelector('.ai-g'))return;
  [['🧭 সার্ভিস গাইড',aiWizard],['💰 বাজেটে সেরা কম্বো',()=>{botSay('বলুন কোন প্ল্যাটফর্মে কত টাকায় কী চান। যেমন: “ফেসবুকে ২০০ টাকায় লাইক ও ফলোয়ার”।')}]].forEach(([l,f])=>{const b=document.createElement('button');b.className='ai-c ai-g';b.textContent=l;b.onclick=f;c.insertBefore(b,c.firstChild)})}).observe(c,{childList:true})})();

/* ---- রিসেলার: নিজের ব্যানার (৮২) ও র‍্যাংক (৮৫, পুরস্কার গোপন) ---- */
const _rbx0=rbExtra;
rbExtra=async function(b){
  await _rbx0(b);const el=$('#rbX');if(!el||el.querySelector('#rkBox'))return;
  el.insertAdjacentHTML('beforeend',`<div class="sec"><i class="fa-solid fa-trophy"></i>রিসেলার র‍্যাংক (এই মাস)</div><div class="pc" id="rkBox">লোড হচ্ছে...</div>
   <div class="sec"><i class="fa-solid fa-image"></i>আমার অ্যাপের ব্যানার</div><div class="pc"><small style="color:var(--mu)">ছবির লিংক দিন (https://…, সর্বোচ্চ ৩টা)। ফাঁকা রাখলে ডিফল্ট ব্যানার দেখাবে।</small>
   ${[0,1,2].map(i=>`<input class="rbi rbn" placeholder="ব্যানার ${i+1} এর ছবির লিংক" style="margin-top:6px">`).join('')}<button class="btn" id="rbnSave" style="margin-top:10px">ব্যানার সেভ করুন</button></div>`);
  api('/rb/rank',{}).then(j=>{const bx=$('#rkBox');if(!bx)return;if(j.error){bx.textContent='লোড হয়নি';return}
    bx.innerHTML=(j.rank?`<div style="text-align:center;margin-bottom:10px"><div style="font:800 40px Poppins;color:var(--p)">#${bnum(j.rank)}</div><small style="color:var(--mu)">${bnum(j.total)} জন রিসেলারের মধ্যে • এই মাসে ${bnum(j.orders)} অর্ডার</small>${j.toNext?`<div style="font-size:13px;margin-top:4px">পরের র‍্যাংকে যেতে আরও ${tk(j.toNext)} বিক্রি দরকার 🔥</div>`:'<div style="font-size:13px;margin-top:4px">🏆 আপনি এখন সবার উপরে!</div>'}</div>`:'<div class="empty">এই মাসে এখনো অর্ডার নেই — প্রথম অর্ডার এলেই র‍্যাংকে ঢুকবেন</div>')+
      (j.top||[]).map(x=>`<div class="rbk ${x.me?'me':''}"><span>${['🥇','🥈','🥉'][x.rank-1]||'#'+x.rank} ${esc(x.name)}${x.me?' (আপনি)':''}</span><b>${bnum(x.orders)} অর্ডার</b></div>`).join('')}).catch(()=>{});
  api('/rb/banner',{}).then(j=>{$$('.rbn').forEach((e,i)=>e.value=(j.urls||[])[i]||'')}).catch(()=>{});
  $('#rbnSave').onclick=async()=>{const r=await api('/rb/banner',{urls:$$('.rbn').map(e=>e.value.trim()).filter(Boolean)}).catch(()=>({error:'নেটওয়ার্ক সমস্যা'}));r.error?toast(r.error,'er'):toast('✅ ব্যানার সেভ হয়েছে (ইউজারদের অ্যাপে কিছুক্ষণে দেখাবে)','ok')};
};
//==END==
