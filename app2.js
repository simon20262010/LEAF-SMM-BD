/* ---------- REFERRAL ---------- */
async function loadRefLb(){
  if(S._rlb&&Date.now()-S._rlb<120000)return;S._rlb=Date.now();
  const j=await api('/u/reflb').catch(()=>({error:1}));if(j.error){S._rlb=0;return}
  $('#rLb').innerHTML=(j.prize?`<div class="notice" style="margin:0 0 10px">🎁 ${esc(j.prize)}</div>`:'')+(j.rows.length?j.rows.map((r,i)=>`<div class="lbr ${r.me?'me':''}"><div class="n">${['🥇','🥈','🥉'][i]||bnum(i+1)}</div><div class="w"><b>${lvB(r.lv)}${esc(r.name)}</b><small>${esc(j.month)}</small></div><div class="a">${bnum(r.count)} জন</div></div>`).join(''):'<div class="empty"><i class="fa-solid fa-user-plus"></i>এই মাসে এখনো কেউ রেফার করেনি</div>')+(j.me.rank?`<div class="notice" style="margin:6px 0 0">আপনার অবস্থান: <b>${bnum(j.me.rank)}</b> নম্বর (${bnum(j.me.count)} জন)</div>`:'');
}
function rRef(){
  if(!S.me)return;loadRefLb();const code=tgUser&&!S.bot?.tenant?tgUser.id:(tgUser?tgUser.id:S.uid);
  $('#rCode').textContent=code;$('#rPct').textContent=S.set.refPercent||0;$('#rEarn').textContent=tk(S.me.refEarned);numAnim([$('#rEarn')],'re');$('#rCnt').textContent=S.team.length+' জন রেফার';
  $('#rList').innerHTML=S.team.map(t=>`<div class="hi"><b>${esc(t.name)}</b><small style="color:var(--mu)">${fd(t.createdAt)}</small></div>`).join('')||'<div class="empty"><i class="fa-solid fa-user-plus"></i>এখনো কেউ রেফার হয়নি</div>';
}
const refLink=()=>{const bu=S.bot&&S.bot.bot,bl=S.set.botLink;return bu?'https://t.me/'+bu+'?start='+S.uid:(bl?bl+(bl.includes('?')?'&':'?')+'startapp='+S.uid:location.origin+location.pathname+'?ref='+S.uid)};
$('#rShare').onclick=async()=>{
  const c=document.createElement('canvas');c.width=1080;c.height=1350;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,1080,1350);g.addColorStop(0,'#1e88e5');g.addColorStop(1,'#0b3d91');x.fillStyle=g;x.fillRect(0,0,1080,1350);
  x.fillStyle='rgba(255,255,255,.08)';[[900,200,300],[150,1150,380],[980,1200,160]].forEach(([a,b,r])=>{x.beginPath();x.arc(a,b,r,0,7);x.fill()});
  x.textAlign='center';x.fillStyle='#fff';x.font="700 78px 'Hind Siliguri',sans-serif";x.fillText(S.set.siteName||'SMM Panel',540,260);
  x.font="600 52px 'Hind Siliguri',sans-serif";x.fillText('সহজে অর্ডার, কম দামে সেরা সার্ভিস',540,360);
  x.fillStyle='rgba(255,255,255,.16)';x.beginPath();x.roundRect?x.roundRect(120,470,840,330,40):x.rect(120,470,840,330);x.fill();
  x.fillStyle='#fff';x.font="600 46px 'Hind Siliguri',sans-serif";x.fillText('আমার লিংকে জয়েন করুন',540,560);
  x.font="700 120px Poppins,sans-serif";x.fillStyle='#fde047';x.fillText((S.set.refPercent||0)+'%',540,700);x.font="600 42px 'Hind Siliguri',sans-serif";x.fillStyle='#fff';x.fillText('কমিশন পান প্রতি ডিপোজিটে',540,770);
  x.font="700 54px Poppins,sans-serif";x.fillText('ID: '+(tgUser?tgUser.id:S.uid),540,950);
  x.font="500 34px Poppins,sans-serif";x.fillStyle='rgba(255,255,255,.9)';const l=refLink();x.fillText(l.length>44?l.slice(0,44)+'…':l,540,1030);
  x.font="600 40px 'Hind Siliguri',sans-serif";x.fillStyle='#fff';x.fillText('এখনই জয়েন করুন 👇',540,1180);
  const bl=await new Promise(r=>c.toBlob(r,'image/png')),f=new File([bl],'refer.png',{type:'image/png'});
  if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],text:l});return}catch{}}
  G(`<div class="sec"><i class="fa-solid fa-image"></i>শেয়ার ব্যানার</div><img src="${c.toDataURL('image/png')}" style="width:100%;border-radius:16px"><div class="how" style="margin-top:10px">ছবিটা চেপে ধরে সেভ করুন, তারপর বন্ধুদের পাঠান। নিচের বাটনে লিংকও শেয়ার করতে পারবেন।</div><button class="btn" id="rShL"><i class="fa-regular fa-paper-plane"></i> লিংক শেয়ার করুন</button>`);
  $('#rShL').onclick=()=>{const u='https://t.me/share/url?url='+encodeURIComponent(l)+'&text='+encodeURIComponent('জয়েন করুন, কম দামে সেরা সার্ভিস!');TG?TG.openTelegramLink(u):window.open(u)}};
$('#rCopy').onclick=async()=>{const l=refLink();try{await navigator.clipboard.writeText(l);toast('লিংক কপি হয়েছে','ok')}catch{if(TG)TG.openTelegramLink('https://t.me/share/url?url='+encodeURIComponent(l));else prompt('কপি করুন:',l)}};

/* ---------- SETTINGS ---------- */
function rSet(){
  const m=S.me;if(!m)return;const LV=lvl();const sp=m.totalSpent||0;
  let li=0;LV.forEach((l,i)=>{if(sp>=l[1])li=i});const nx=LV[li+1];
  const tn=tgUser?([tgUser.first_name,tgUser.last_name].filter(Boolean).join(' ')||tgUser.username||m.name):m.name,av=$('#sAv');
  if(tgUser&&tgUser.photo_url){av.innerHTML=`<img src="${esc(tgUser.photo_url)}" alt="" style="width:100%;height:100%;border-radius:50%;object-fit:cover" onerror="this.remove();this.parentNode.textContent='${esc((tn||'U')[0].toUpperCase())}'">`}else av.textContent=(tn||'U')[0].toUpperCase();
  $('#sName').textContent=tn;$('#sMail').innerHTML=tgUser?`${tgUser.username?'<i class="fa-brands fa-telegram" style="color:#2aabee"></i> @'+esc(tgUser.username)+' • ':''}<i class="fa-solid fa-id-badge"></i> ID: <b>${tgUser.id}</b>`:esc(m.email);$('#sLvl').innerHTML=lvB(li)+esc(LV[li][0])+' সদস্য';
  const days=m.createdAt?.toDate?Math.max(1,Math.ceil((Date.now()-m.createdAt.toDate())/864e5)):1;$('#sAge').textContent=days+' দিন';
  const pct=nx?Math.min(100,(sp-LV[li][1])/(nx[1]-LV[li][1])*100):100;$('#sBar').style.width=pct+'%';$('#sPct').textContent='অগ্রগতি: '+pct.toFixed(1)+'%';$('#sNext').textContent=nx?`পরবর্তী: ${nx[0]} যেতে ${tk(nx[1]-sp)} প্রয়োজন`:'সর্বোচ্চ লেভেল 🎉';
  const t0=new Date();t0.setHours(0,0,0,0);const td=S.orders.filter(o=>o.createdAt?.toDate&&o.createdAt.toDate()>=t0);
  const c=[['#10b981','fa-wallet','মেইন ব্যালেন্স',tk(m.balance)],['#0ea5e9','fa-circle-plus','মোট ডিপোজিট',tk(m.totalDeposit)],['#dc2626','fa-receipt','মোট খরচ',tk(sp)],['#7c3aed','fa-cart-shopping','মোট অর্ডার',(m.orderCount||0)+' টি'],['#4f46e5','fa-bolt','আজকের অর্ডার',td.length+' টি'],['#db2777','fa-fire','আজকের খরচ',tk(td.reduce((a,o)=>a+o.charge,0))],['#0d9488','fa-gift','মোট রেফার ব্যালেন্স',tk(m.refEarned)],['#ea580c','fa-coins','মোট XP',m.xp||0]];
  $('#stats').innerHTML=c.map(([bg,ic,l,v])=>`<div class="gc" style="background:${bg}"><small><i class="fa-solid ${ic}"></i> ${l}</small><b>${v}</b></div>`).join('');numAnim($$('#stats .gc b'),'st');
}
$('#mOut').onclick=()=>{const go=()=>signOut(auth);TG&&TG.showConfirm?TG.showConfirm('লগআউট করবেন?',ok=>{if(ok)go()}):(confirm('লগআউট করবেন?')&&go())};
$('#mPass').onclick=async()=>{try{await sendPasswordResetEmail(auth,S.me.email);toast('রিসেট লিংক ইমেইলে পাঠানো হয়েছে','ok')}catch(e){toast(errMsg(e),'er')}};
$('#mSup').onclick=()=>S.set.supportLink?openL(S.set.supportLink):toast('সাপোর্ট লিংক সেট করা নেই','er');
$('#mTicket').onclick=()=>$('#tModal').classList.remove('hide');$('#tClose').onclick=()=>$('#tModal').classList.add('hide');
$('#tSend').onclick=async()=>{const s=$('#tSub').value.trim(),m=$('#tMsg').value.trim();if(!S.me)return toast('প্রোফাইল লোড হচ্ছে','er');if(!s||!m)return toast('বিষয় ও মেসেজ লিখুন','er');
  try{const jt=await api('/u/ticket',{subject:s,message:m});if(jt.error)throw new Error(jt.error);syncNow(true);$('#tSub').value=$('#tMsg').value='';toast('টিকেট জমা হয়েছে','ok')}catch(e){toast(errMsg(e),'er')}};
function rTix(){$('#tList').innerHTML=S.tix.map(t=>`<div class="hi" style="display:block"><div style="display:flex;justify-content:space-between"><b>${esc(t.subject)}</b><span class="st ${t.status=='open'?'pending':'completed'}">${t.status}</span></div><div style="font-size:14px;margin-top:6px">${esc(t.message)}</div>${t.reply?`<div class="how" style="margin-top:8px"><b style="font-size:13px">অ্যাডমিন:</b> ${esc(t.reply)}</div>`:''}</div>`).join('')||'<div class="empty">কোনো টিকেট নেই</div>'}

/* ---------- EXTRA MENU ---------- */
const G=h=>{$('#gBody').innerHTML=h+'<button class="btn" id="gX" style="background:#64748b;box-shadow:none;margin-top:14px">বন্ধ করুন</button>';$('#gModal').classList.remove('hide');$('#gX').onclick=()=>{S._rq=null;$('#gModal').classList.add('hide')}};
$('#gModal').onclick=e=>{if(e.target.id=='gModal'){S._rq=null;$('#gModal').classList.add('hide')}};
$$('[data-go]').forEach(e=>e.onclick=()=>go(e.dataset.go));

function reqForm(type){
  const T=type=='refund'?'রিফান্ড ক্লেইম':'রিফিল রিকোয়েস্ট';
  const ok=type=='refund'?['pending','processing','partial']:['completed','partial'];
  const l=S.orders.filter(o=>ok.includes(o.status)).slice(0,40);
  G(`<div class="sec"><i class="fa-solid fa-life-ring"></i>${T}</div>
  <label class="l">অর্ডার সিলেক্ট করুন</label><select id="rqO">${l.map(o=>`<option value="${o._id}">#${o.orderNo} • ${esc(o.serviceName).slice(0,38)} • ${tk(o.charge)}</option>`).join('')||'<option value="">কোনো যোগ্য অর্ডার নেই</option>'}</select>
  <label class="l">কারণ (ঐচ্ছিক)</label><textarea id="rqN" rows="2" placeholder="সমস্যাটা লিখুন"></textarea>
  <button class="btn" id="rqS">জমা দিন</button><div class="sub" style="margin-top:20px">আপনার রিকোয়েস্ট</div><div id="rqL"></div>`);
  const list=()=>{$('#rqL').innerHTML=S.reqs.filter(r=>r.type==type).map(r=>`<div class="hi"><div><b>#${esc(r.orderNo)}</b><div style="font-size:12px;color:var(--mu)">${fd(r.createdAt)}</div></div><span class="st ${r.status=='pending'?'pending':r.status=='rejected'?'canceled':'completed'}">${r.status}</span></div>`).join('')||'<div class="empty" style="padding:14px">কোনো রিকোয়েস্ট নেই</div>'};
  list();S._rq=list;
  $('#rqS').onclick=async()=>{
    const o=S.orders.find(x=>x._id==$('#rqO').value);if(!o||!S.me)return toast('অর্ডার সিলেক্ট করুন','er');
    if(S.reqs.some(r=>r.orderId==o._id&&r.type==type&&r.status=='pending'))return toast('এই অর্ডারে আগের রিকোয়েস্ট এখনো পেন্ডিং','er');
    try{const jq=await api('/u/request',{type,orderId:o._id,note:$('#rqN').value.trim()});if(jq.error)throw new Error(jq.error);syncNow(true);toast('রিকোয়েস্ট জমা হয়েছে','ok');$('#rqN').value=''}catch(e){toast(errMsg(e),'er')}};
}
$('#mRf').onclick=()=>reqForm('refund');$('#mRl').onclick=()=>reqForm('refill');

$('#mVip').onclick=()=>{const sp=S.me?.totalSpent||0,LV=lvl();let li=0;LV.forEach((l,i)=>{if(sp>=l[1])li=i});
  G(`<div class="sec"><i class="fa-solid fa-crown"></i>ভিআইপি লেভেল ও সুবিধা</div><div class="how">মোট খরচ বাড়লে লেভেল বাড়ে, আর প্রতিটি অর্ডারে স্থায়ী ডিসকাউন্ট পাবেন।</div>
  ${LV.map((l,i)=>`<div class="hi" style="${i==li?'border:2px solid var(--p)':''}"><div><b>${esc(l[0])}</b> ${i==li?'<span class="st completed">আপনি এখানে</span>':''}<div style="font-size:12px;color:var(--mu)">মোট খরচ ${tk(l[1])}+</div></div><b style="color:var(--ok)">${l[2]}% ছাড়</b></div>`).join('')}`)};

$('#mXp').onclick=()=>{
  const rate=+S.set.xpPerBdt||0,min=+S.set.minXpConvert||0;if(!S.me)return;
  if(!rate)return toast('XP কনভার্ট এখন চালু নেই','er');
  G(`<div class="sec"><i class="fa-solid fa-arrows-rotate"></i>XP থেকে BDT</div><div class="how">আপনার XP: <b>${S.me.xp||0}</b><br>${rate} XP = ৳1${min?` • ন্যূনতম ${min} XP`:''}</div>
  <label class="l">কত XP কনভার্ট করবেন</label><input id="xpA" type="number" inputmode="numeric" placeholder="যেমন ${Math.max(min,rate)}">
  <div class="row"><span>আপনি পাবেন</span><b id="xpO">৳0.00</b></div><button class="btn" id="xpB">কনভার্ট করুন</button>`);
  const cv=()=>Math.floor((parseInt($('#xpA').value)||0)/rate*100)/100;
  $('#xpA').oninput=()=>$('#xpO').textContent=tk(cv());
  $('#xpB').onclick=async()=>{const x=parseInt($('#xpA').value)||0,bdt=cv();
    if(x<Math.max(min,rate))return toast(`কমপক্ষে ${Math.max(min,rate)} XP দিন`,'er');
    const b=$('#xpB');b.disabled=true;
    try{const jx=await api('/u/xp',{xp:x});if(jx.error)throw new Error(jx.error);syncNow(true);
      toast(`✅ ${tk(jx.bdt)} ব্যালেন্সে যোগ হয়েছে`,'ok');$('#gModal').classList.add('hide')}catch(e){toast(e.message,'er')}
    b.disabled=false}};

const bnum=x=>String(x).replace(/\d/g,d=>'০১২৩৪৫৬৭৮৯'[d]),btk=n=>bnum('৳'+(+n||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}));
$('#mLb').onclick=async()=>{
  G('<div class="empty"><i class="fa-solid fa-trophy"></i>লোড হচ্ছে...</div>');
  const j=await api('/lb').catch(()=>({error:1}));
  if(j.error){const l=S.lb;
    return G(`<div class="sec"><i class="fa-solid fa-trophy"></i>মাসিক লিডারবোর্ড ${l?.month?'— '+esc(l.month):''}</div>${(l?.rows||[]).map((r,i)=>`<div class="hi"><div><b>${['🥇','🥈','🥉'][i]||'#'+(i+1)} ${esc(r.name)}</b><div style="font-size:12px;color:var(--mu)">${r.orders} টি অর্ডার</div></div><b style="color:var(--p)">${tk(r.spent)}</b></div>`).join('')||'<div class="empty"><i class="fa-solid fa-trophy"></i>লিডারবোর্ড এখনো আপডেট হয়নি</div>'}`)}
  const rows=j.rows||[],top=rows.slice(0,3),m=j.me||{};
  G(`<div style="background:linear-gradient(135deg,#2196f3,#1565c0);color:#fff;border-radius:18px;padding:16px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center"><div><small style="opacity:.9">চলতি মাস</small><div style="font:700 22px 'Hind Siliguri'">${esc(j.month)}</div><small style="opacity:.9">শীর্ষ ১০ জন সফল ক্রেতার তালিকা</small></div><i class="fa-solid fa-trophy" style="font-size:34px;opacity:.9"></i></div>
  ${rows.length?`<div class="sec"><i class="fa-solid fa-medal"></i>শীর্ষ ৩ জন</div><div class="lbt">${top.map((r,i)=>`<div><div class="m">${['🥇','🥈','🥉'][i]}</div><b>${lvB(r.lv)}${esc(r.name)}</b><small style="color:var(--mu)">এই মাসে মোট খরচ</small><div class="v">${btk(r.spent)}</div></div>`).join('')}</div>
  <div class="sec"><i class="fa-solid fa-list-ol"></i>শীর্ষ তালিকা (১ থেকে ১০)</div>
  ${rows.map((r,i)=>`<div class="lbr ${r.me?'me':''}"><div class="n">${bnum(i+1)}</div><div class="w"><b>${lvB(r.lv)}${esc(r.name)}</b><small>এই মাসে মোট খরচ করেছে</small></div><div class="a">${btk(r.spent)}</div></div>`).join('')}`:'<div class="empty"><i class="fa-solid fa-trophy"></i>এই মাসে এখনো কোনো অর্ডার হয়নি। প্রথম হওয়ার সুযোগ আপনার!</div>'}
  <div class="pc" style="margin-top:6px">${m.inTop?`<b>✅ আপনি এখন ${bnum(m.rank)} নম্বরে আছেন</b><div style="font-size:13px;margin-top:6px">এই মাসে আপনার সফল খরচ: <b>${btk(m.spent)}</b></div>`:`<b>🎯 আপনি বর্তমানে এই টপ লিস্টে নেই</b><div style="font-size:13px;margin-top:6px">আপনার চলতি মাসের সফল খরচ: <b>${btk(m.spent)}</b></div>${m.need?`<div class="notice" style="margin:10px 0 0">টপ ১০ তালিকায় প্রবেশ করতে আপনাকে কমপক্ষে আরও <b>${btk(m.need)}</b> সফল অর্ডার করতে হবে।</div>`:''}`}
  <button class="btn" id="lbGo">অর্ডার করে তালিকায় আসুন</button></div>`);
  $('#lbGo').onclick=()=>{S._rq=null;$('#gModal').classList.add('hide');go('home')}};

$('#mApi').onclick=()=>apiPanel();
$('#mWl').onclick=async()=>{G('<div class="empty">লোড হচ্ছে...</div>');const j=await api('/u/wallet').catch(()=>({error:1}));
  if(j.error)return G('<div class="empty">লোড করা যায়নি</div>');
  G(`<div class="sec"><i class="fa-solid fa-clock-rotate-left"></i>ওয়ালেট ইতিহাস <small style="color:var(--mu);font-weight:400">(শেষ ৩০ দিন)</small></div>`+(j.items.map(x=>`<div class="wr"><div>${esc(x.n)}<small>${new Date(x.t*1000).toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</small></div><b class="${x.a>=0?'p':'m'}">${x.a>=0?'+':'−'}${tk(Math.abs(x.a))}</b></div>`).join('')||'<div class="empty">এখনো কোনো লেনদেন নেই</div>'))};
$('#mMs').onclick=async()=>{G('<div class="empty">লোড হচ্ছে...</div>');const j=await api('/u/missions').catch(()=>({error:1}));
  if(j.error)return G('<div class="empty">লোড করা যায়নি</div>');
  const K={orders:'অর্ডার',spend:'খরচ',deposit:'ডিপোজিট'},P={daily:'আজকের',weekly:'এই সপ্তাহের',once:'একবারের'};
  G(`<div class="sec"><i class="fa-solid fa-bullseye"></i>মিশন ও পুরস্কার</div>`+(j.items.map(m=>{const pc=Math.min(100,m.progress/m.target*100),ok=m.progress>=m.target;
    return `<div class="msn"><div style="display:flex;justify-content:space-between;gap:8px"><b>${esc(m.title)}</b><b style="color:#16a34a">+${tk(m.reward)}</b></div><small style="color:var(--mu)">${P[m.period]} ${K[m.kind]}: ${m.kind=='orders'?m.progress:tk(m.progress)} / ${m.kind=='orders'?m.target:tk(m.target)}</small><div class="pbar"><i style="width:${pc}%"></i></div>${m.claimed?'<span class="st completed">✓ পুরস্কার নেওয়া হয়েছে</span>':(ok?`<button class="rbtn" style="background:#16a34a;color:#fff;margin:0" data-mc="${m.id}">🎁 পুরস্কার নিন</button>`:'<small style="color:var(--mu)">লক্ষ্য পূরণ করুন</small>')}</div>`}).join('')||'<div class="empty">এখন কোনো মিশন নেই</div>'));
  $$('[data-mc]').forEach(b=>b.onclick=async()=>{const r=await api('/u/mission-claim',{id:b.dataset.mc});if(r.error)return toast(r.error,'er');toast('🎉 '+tk(r.reward)+' ব্যালেন্সে যোগ হয়েছে','ok');celebrate();syncNow(true);$('#mMs').click()})};
/* ডার্ক মোড */
const LS={g:k=>{try{return localStorage.getItem(k)}catch{return null}},s:(k,v)=>{try{localStorage.setItem(k,v)}catch{}}};
function setDark(on){document.documentElement.classList.toggle('dark',!!on);LS.s('dark',on?'1':'0');$('#mDkT').textContent=on?'ডার্ক মোড বন্ধ করুন':'ডার্ক মোড চালু করুন';try{TG&&TG.setBackgroundColor(on?'#0c1420':'#f3f7fc')}catch{}}
$('#mDk').onclick=()=>setDark(!document.documentElement.classList.contains('dark'));setDark(LS.g('dark')=='1');
/* ভাষা (বাংলা ↔ English): স্থির লেখাগুলো অনুবাদ হয় */
const EN={'সহজে অর্ডার, কম দামে সেরা সার্ভিস':'Easy orders, best services at low prices','লগইন':'Login','রেজিস্টার':'Register','আপনার নাম':'Your name','ইমেইল':'Email','পাসওয়ার্ড':'Password','লগইন করুন':'Log in','পাসওয়ার্ড ভুলে গেছেন?':'Forgot password?','নতুন অর্ডার':'New order','সার্ভিস আইডি / নাম দিয়ে সার্চ':'Search by service ID / name','1. ক্যাটাগরি':'1. Category','2. সার্ভিস':'2. Service','3. টার্গেট লিংক':'3. Target link','4. পরিমাণ':'4. Quantity','মোট চার্জ':'Total charge','ফান্ড অ্যাড করুন':'Add funds','প্রমো / গিফট কোড':'Promo / gift code','ব্যবহার করুন':'Apply','পেমেন্ট মেথড':'Payment method','টাকার পরিমাণ':'Amount','যে নাম্বার থেকে পাঠিয়েছেন':'Number you sent from','ব্যালেন্স যোগের ইতিহাস':'Deposit history','মোট রেফার ইনকাম':'Total referral income','রেফার লিংক কপি করুন':'Copy referral link','এই মাসের সেরা রেফারার':'Top referrers this month','আমার টিম':'My team','লেভেল:':'Level:','অ্যাকাউন্টের বয়স:':'Account age:','অ্যাকাউন্ট':'Account','আমার অর্ডারসমূহ':'My orders','রিফান্ড ক্লেইম করুন':'Claim refund','রিফিল রিকোয়েস্ট':'Refill request','ভিআইপি লেভেল ও সুবিধাসমূহ':'VIP levels & benefits','XP থেকে BDT কনভার্ট করুন':'Convert XP to BDT','মাসিক লিডারবোর্ড':'Monthly leaderboard','মিশন ও পুরস্কার':'Missions & rewards','ওয়ালেট ইতিহাস':'Wallet history','রিসেলার API':'Reseller API','রিসেলার বট তৈরি করুন':'Create reseller bot','ভিডিও টিউটোরিয়াল':'Video tutorial','সাপোর্ট টিকেট':'Support ticket','লাইভ সাপোর্ট':'Live support','পাসওয়ার্ড রিসেট ইমেইল':'Password reset email','লগআউট':'Logout','সাপোর্ট অ্যাসিস্ট্যান্ট':'Support assistant','পাঠান':'Send','বন্ধ':'Close','বন্ধ করুন':'Close','আপনার টিকেট':'Your tickets','ডার্ক মোড চালু করুন':'Turn on dark mode','ডার্ক মোড বন্ধ করুন':'Turn off dark mode','শেয়ার ব্যানার বানান':'Make share banner','সব':'All','প্যাক অফার':'Bundle offers','অর্ডার করুন':'Order now','আবার অর্ডার':'Reorder','⭐ রেটিং দিন':'⭐ Rate','বাতিলের অনুরোধ':'Request cancel','শিডিউল করা অর্ডার':'Scheduled orders','মেইন ব্যালেন্স':'Main balance','মোট ডিপোজিট':'Total deposit','মোট খরচ':'Total spent','মোট অর্ডার':'Total orders','আজকের অর্ডার':'Today\'s orders','আজকের খরচ':'Today\'s spend','মোট রেফার ব্যালেন্স':'Referral balance','মোট XP':'Total XP','কোনো অর্ডার নেই':'No orders','পুরস্কার নিন':'Claim reward','লোড হচ্ছে...':'Loading...'};
const BN2=Object.fromEntries(Object.entries(EN).map(([k,v])=>[v,k]));let LG=LS.g('lang')||'bn',_trb=false;
function trNode(n){const t=n.nodeValue;if(!t)return;const k=t.trim();if(!k)return;const m=(LG=='en'?EN:BN2)[k.replace(/^[^\p{L}\p{N}⭐]+/u,m=>m)]||(LG=='en'?EN:BN2)[k];if(m)n.nodeValue=t.replace(k,m)}
function trAll(r){const w=document.createTreeWalker(r,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode())trNode(n)}
new MutationObserver(ms=>{if(_trb||LG!='en')return;_trb=true;ms.forEach(m=>{m.addedNodes.forEach(a=>{a.nodeType==3?trNode(a):a.nodeType==1&&trAll(a)});if(m.type=='characterData')trNode(m.target)});_trb=false}).observe(document.body,{childList:true,subtree:true,characterData:true});
function setLang(l){LG=l;LS.s('lang',l);$('#mLgT').textContent=l=='en'?'বাংলায় ফিরুন':'Switch to English';_trb=true;trAll(document.body);_trb=false}
$('#mLg').onclick=()=>setLang(LG=='en'?'bn':'en');if(LG=='en')setLang('en');
const copyTxt=async t=>{try{await navigator.clipboard.writeText(t);toast('কপি হয়েছে','ok')}catch{const i=document.createElement('textarea');i.value=t;document.body.appendChild(i);i.select();try{document.execCommand('copy');toast('কপি হয়েছে','ok')}catch{toast('কপি হয়নি, চেপে ধরে কপি করুন','er')}i.remove()}};
async function apiPanel(act){
  G('<div class="empty"><i class="fa-solid fa-key"></i>লোড হচ্ছে...</div>');
  const j=await api('/u/apikey',{action:act||'get'}).catch(()=>({error:'সার্ভারে সংযোগ হয়নি'}));
  if(j.error)return G(`<div class="sec"><i class="fa-solid fa-key"></i>রিসেলার API</div><div class="empty">${esc(j.error)}</div>`);
  const has=!!j.key,u=j.url||'';
  const fld=(l,v,id)=>`<div style="font-size:12px;color:var(--mu);margin:12px 0 5px">${l}</div><div style="display:flex;gap:8px;align-items:center"><input readonly id="${id}" value="${esc(v)}" onclick="this.select()" style="flex:1;margin:0;font:600 13px ui-monospace,Menlo,monospace;letter-spacing:.2px"><button class="btn" data-cp="${id}" style="width:auto;padding:0 16px;height:46px;margin:0;box-shadow:none"><i class="fa-regular fa-copy"></i></button></div>`;
  const ex=(t,c)=>`<div style="background:#0f172a;color:#e2e8f0;border-radius:12px;padding:10px 12px;margin-top:8px;font:12.5px/1.6 ui-monospace,Menlo,monospace;word-break:break-all"><div style="color:#7dd3fc;font-weight:700;margin-bottom:2px">${t}</div>${c}</div>`;
  G(`<div style="background:linear-gradient(135deg,#2196f3,#1565c0);color:#fff;border-radius:18px;padding:16px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center"><div><div style="font:700 20px 'Hind Siliguri'">রিসেলার API</div><small style="opacity:.92">নিজের সাইট বা প্যানেল থেকে অর্ডার দিন</small></div><i class="fa-solid fa-code" style="font-size:32px;opacity:.9"></i></div>
  ${has?`<div style="display:flex;align-items:center;gap:8px;margin:12px 0 0"><span class="st ${j.active?'completed':'canceled'}">${j.active?'● চালু আছে':'● বন্ধ আছে'}</span><small style="color:var(--mu)">এই কী মিনি অ্যাপ ও বট দুই জায়গাতেই একই</small></div>
  ${fld('API URL',u,'apU')}${fld('API Key',j.key,'apK')}
  <div style="display:flex;gap:8px;margin-top:14px"><button class="btn" id="apN" style="margin:0;background:#f59e0b;box-shadow:none"><i class="fa-solid fa-rotate"></i> নতুন কী</button><button class="btn" id="apT" style="margin:0;background:${j.active?'#ef4444':'#16a34a'};box-shadow:none"><i class="fa-solid fa-power-off"></i> ${j.active?'বন্ধ করুন':'চালু করুন'}</button></div>
  <div class="sec" style="margin-top:20px"><i class="fa-solid fa-terminal"></i>কীভাবে ব্যবহার করবেন</div>
  ${ex('ব্যালেন্স','?key=<b>KEY</b>&amp;action=balance')}${ex('সার্ভিস তালিকা','?key=<b>KEY</b>&amp;action=services')}${ex('অর্ডার দিন','?key=<b>KEY</b>&amp;action=add&amp;service=<b>ID</b>&amp;link=<b>URL</b>&amp;quantity=<b>N</b>')}${ex('অর্ডার স্ট্যাটাস','?key=<b>KEY</b>&amp;action=status&amp;order=<b>ORDER_ID</b>')}
  <div style="font-size:12px;color:var(--mu);margin-top:10px;line-height:1.6">⚠️ কী কাউকে দেবেন না। নতুন কী বানালে পুরোনোটা সাথে সাথে অচল হয়ে যাবে।</div>`
  :`<div style="text-align:center;padding:24px 8px"><div style="font-size:46px">🔑</div><div style="font:700 17px 'Hind Siliguri';margin:8px 0 4px">আপনার এখনো API কী নেই</div><div style="font-size:13px;color:var(--mu);margin-bottom:16px;line-height:1.7">নিচের বাটনে চাপলেই কী তৈরি হবে। এটা দিয়ে আপনি নিজের সাইট থেকে সরাসরি অর্ডার দিতে পারবেন।</div><button class="btn" id="apG">কী তৈরি করুন</button></div>`}`);
  $$('[data-cp]').forEach(b=>b.onclick=()=>copyTxt($('#'+b.dataset.cp).value));
  if($('#apG'))$('#apG').onclick=()=>apiPanel('new');
  if($('#apN'))$('#apN').onclick=()=>{if(confirm('নতুন কী বানালে পুরোনোটা আর কাজ করবে না। নিশ্চিত?'))apiPanel('new')};
  if($('#apT'))$('#apT').onclick=()=>apiPanel('toggle');
}
$('#mTut').onclick=()=>S.set.tutorialLink?openL(S.set.tutorialLink):toast('টিউটোরিয়াল লিংক সেট করা নেই','er');

/* ---------- সার্ভিস/সেটিংস: বট সার্ভার থেকে (ফোনে জমা রেখে), ব্যর্থ হলে সরাসরি Firebase ---------- */
const CK='leafCatalog';
function applyCatalog(c){S.set=c.settings||{};S.raw=c.services||[];mergeBot();applyPrices();renderAll()}
async function fetchCatalog(){
  const bs=((await botServer())||'').replace(/\/$/,'');if(!bs||!auth.currentUser)throw new Error('no');
  const tok=await auth.currentUser.getIdToken(),ac=new AbortController(),t=setTimeout(()=>ac.abort(),9000);
  try{const r=await fetch(bs+'/public/catalog',{headers:{Authorization:'Bearer '+tok},signal:ac.signal});if(!r.ok)throw new Error('http');return await r.json()}finally{clearTimeout(t)}
}
function startCatalog(){
  let cached=null;try{cached=JSON.parse(localStorage.getItem(CK)||'null')}catch{}
  if(cached&&cached.c)applyCatalog(cached.c);
  const run=async()=>{
    try{const c=await fetchCatalog();try{localStorage.setItem(CK,JSON.stringify({t:Date.now(),c}))}catch{}S._catOk=true;applyCatalog(c)}
    catch(e){console.warn(e);if(!S._catOk&&!(cached&&cached.c)&&!S._ct)S._ct=setTimeout(()=>{S._ct=0;run()},4000)}
  };
  if(!cached||Date.now()-(cached.t||0)>120000)run();
  S._catT=setInterval(run,180000);
}

/* ---------- রিসেলার বট: সার্ভার কল, দাম, ম্যানেজ প্যানেল ---------- */



/* ---------- ফোর্স জয়েন গেট (অ্যাপের ভেতরেই) ---------- */
function hideGate(){S._gate=false;const g=$('#gate');if(g)g.remove()}
function showGate(j){
  S._gate=true;$('#load').classList.add('hide');
  let g=$('#gate');if(!g){g=document.createElement('div');g.id='gate';document.body.appendChild(g)}
  g.className='lt';
  const ch=(j.channels||[]).map(c=>({...c,ok:!!c.ok})),sp=j.support||'',un=sp.replace(/^https?:\/\/(t\.me|telegram\.me)\//,'@').replace(/\?.*$/,'');
  S._gch=ch;const all=ch.length>0&&ch.every(c=>c.ok);
  g.innerHTML=`<div class="gb"><div class="gi">${all?'🔓':'🔒'}</div><h2>${all?'সব চ্যানেলে জয়েন হয়েছে':'চ্যানেল জয়েন করুন'}</h2><p>${all?'নিচের বাটনে চাপ দিয়ে ভেরিফাই করুন।':bnum(ch.length)+'টি Telegram চ্যানেলে জয়েন করতে হবে। জয়েন করে অ্যাপে ফিরলে নিজে থেকেই যাচাই হবে।'}</p>
  ${ch.map((c,i)=>`<div class="gch${c.ok?' ok':''}" style="animation-delay:${i*.08}s"><span style="font-size:22px">📢</span><b>${esc(c.label)}</b>${c.ok?'<span class="jd">✓ Joined</span>':(c.link?`<button class="jn" data-gl="${esc(c.link)}">Join</button>`:'')}</div>`).join('')}
  <button class="gbtn${all?' go':''}" id="gOk">${all?'✅ ভেরিফাই করুন':'চ্যানেল জয়েন করুন'}</button>
  ${sp?`<button class="gs" data-gl="${esc(sp)}"><i class="fa-regular fa-comment-dots"></i> সাহায্য দরকার? ${esc(un)}</button>`:''}</div>`;
  $$('#gate [data-gl]').forEach(b=>b.onclick=()=>openL(b.dataset.gl));
  $('#gOk').onclick=async()=>{const b=$('#gOk');
    if(S._gok||all){S._gok=false;if(S.uid){hideGate();S._h='';syncNow(true)}else location.reload();return}
    b.disabled=true;b.textContent='যাচাই হচ্ছে...';
    if(S.uid){S._syncing=false;await syncNow(true);const x=$('#gOk');if(x){x.disabled=false;if(!S._gok){x.textContent='চ্যানেল জয়েন করুন';toast('এখনো সব চ্যানেলে জয়েন করেননি','er')}}}else location.reload()};
}
function gateAllOk(){S._gok=true;const j={channels:(S._gch||[]).map(c=>({...c,ok:true})),support:''};const sb=$('#gate .gs');showGate({...j,support:sb?sb.dataset.gl:''})}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&S._gate&&S.uid&&!S._gok)syncNow(true)});
//==END==
