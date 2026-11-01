/* ---------- অ্যানিমেশন হেল্পার ---------- */
function celebrate(){
  const d=document.createElement('div');d.className='ok-burst';
  const cols=['#f59e0b','#3b82f6','#ec4899','#10b981','#8b5cf6','#ef4444'];
  let h='<div class="c"><svg viewBox="0 0 60 60"><path d="M14 31 L26 42 L47 19"/></svg></div>';
  for(let i=0;i<22;i++){const a=Math.random()*6.28,r=90+Math.random()*110;h+=`<i class="p" style="background:${cols[i%6]};--x:${Math.cos(a)*r}px;--y:${Math.sin(a)*r}px;animation-delay:${.15+Math.random()*.15}s"></i>`}
  d.innerHTML=h;document.body.appendChild(d);setTimeout(()=>d.remove(),1500);
  try{TG&&TG.HapticFeedback&&TG.HapticFeedback.notificationOccurred('success')}catch{}
}
function numAnim(els,key){
  S._nv=S._nv||{};const red=matchMedia('(prefers-reduced-motion:reduce)').matches;
  [...els].forEach((el,i)=>{if(!el)return;const m=el.textContent.match(/^(\D*?)(\d[\d,]*\.?\d*)(.*)$/);if(!m)return;
    const dec=(m[2].split('.')[1]||'').length,to=parseFloat(m[2].replace(/,/g,'')),k=key+i,from=S._nv[k]??0;S._nv[k]=to;
    if(from===to||red)return;const t0=performance.now(),D=850;
    const f=t=>{const p=Math.min(1,(t-t0)/D),e=1-Math.pow(1-p,3);el.textContent=m[1]+(from+(to-from)*e).toFixed(dec)+m[3];if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)});
}
function countUp(el,to,dec=2){
  const from=+el._v||0;el._v=to;if(from===to){el.textContent=to.toFixed(dec);return}
  const t0=performance.now(),D=700;
  const f=t=>{const k=Math.min(1,(t-t0)/D),e=1-Math.pow(1-k,3);el.textContent=(from+(to-from)*e).toFixed(dec);if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f);
}

/* ---------- ইউজারের ডাটা: বট সার্ভার থেকে (১৫ সেকেন্ডে একবার, কিছু বদলালে তবেই) ---------- */
async function initProfile(){
  if(S._mk)return;S._mk=true;
  try{const u=auth.currentUser,j=await api('/u/init',{name:u.displayName||'',tg:tgUser?{id:tgUser.id,username:tgUser.username||''}:null});
    if(j.error)toast('প্রোফাইল তৈরি হয়নি: '+j.error,'er');else{S._mk=false;syncNow(true)}}catch(e){toast('প্রোফাইল তৈরি হয়নি','er')}
  S._mk=false;
}
async function syncNow(fresh){
  if(!auth.currentUser||S._syncing)return;S._syncing=true;
  try{const j=await api('/u/sync',{h:fresh?'':(S._h||''),fresh:!!fresh});
    if(j.need_init){S._syncing=false;return initProfile()}
    if(j.join){showGate(j.join);return}
    if(S._gate&&!S._gok&&S._gch&&S._gch.length&&$('#gate')){gateAllOk();return}
    if(S._gate)hideGate();
    if(j.error||j.same)return;
    S._h=j.h;const x=fx(j);S.me=x.me;S.orders=x.orders;S.deps=x.deps;S.tix=x.tix;S.reqs=x.reqs;S.team=x.team;
    renderAll();rOrders();rSet();rDeps();rTix();rRef();if(S._rq)S._rq();lvUp();loadBundles();loadSched();
  }catch(e){console.warn(e)}finally{S._syncing=false}
}
function lvUp(){
  try{const k='lv_'+S.uid,li=lvIdx(S.me.totalSpent||0);let p=null;try{p=localStorage.getItem(k)}catch{}
    try{localStorage.setItem(k,li)}catch{}
    if(p!==null&&li>+p){const L=lvl()[li];celebrate();G(`<div style="text-align:center;padding:10px 6px"><div style="transform:scale(2.6);display:inline-block;margin:26px 0 22px">${lvB(li)}</div><div style="font:700 22px 'Hind Siliguri'">🎉 অভিনন্দন!</div><div style="font-size:15px;margin-top:8px;line-height:1.7">আপনি এখন <b>${esc(L[0])} সদস্য</b>${L[2]?`<br>সব অর্ডারে <b>${L[2]}%</b> ছাড় পাচ্ছেন`:''}</div></div>`)}}catch{}
}
function startSync(){syncNow(true);clearInterval(S._pt);S._pt=setInterval(()=>{if(!document.hidden)syncNow()},15000)}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncNow()});
async function api(path,body){
  const bs=((await botServer())||'').replace(/\/$/,'');if(!bs)return{error:'বট সার্ভারের ঠিকানা পাওয়া যায়নি'};
  const tok=await auth.currentUser.getIdToken();
  const r=await fetch(bs+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+tok},body:JSON.stringify(body||{})});
  const j=await r.json().catch(()=>({error:'সার্ভারের উত্তর বোঝা যায়নি'}));if(!r.ok&&!j.error)j.error='ত্রুটি '+r.status;return j;
}
const botRate=s=>{const B=S.bot||{},p=(B.prices||{})[s.sid];return p!=null&&!isNaN(+p)?Math.max(+s.rate,+p):+(s.rate*(1+(+B.margin||0)/100)+(+B.flat||0)).toFixed(4)};
function applyPrices(){const t=S.bot&&S.bot.tenant;S.svcs=(S.raw||[]).map(s=>t?{...s,rate:botRate(s)}:s).sort((a,b)=>a.sid-b.sid);fillCats()}
function mergeBot(){const B=S.bot;if(!B||!B.tenant)return;S.set={...S.set,methods:B.methods||[],supportLink:B.supportLink||'',siteName:B.siteName||S.set.siteName,notice:B.notice||'',banners:[],tutorialLink:''}}
async function loadBot(){
  try{const j=await api('/bot/config');if(j.error)return;S.bot=j;mergeBot();
    $('#mApi').classList.toggle('hide',!!j.tenant);
    $('#mRb').classList.toggle('hide',!(j.manager||j.canCreate));$('#mRbT').textContent=j.manager?'রিসেলার অ্যাডমিন ম্যানেজ':'রিসেলার বট তৈরি করুন';
    applyPrices();renderAll();
    if(RP&&j.manager){document.body.classList.add('rpm');if(!S._rpOpen){S._rpOpen=true;openRb()}}
  }catch(e){console.warn(e)}
}
$('#mRb').onclick=()=>openRb();
async function openRb(){
  go('rbp');const el=$('#rbpBody');el.innerHTML='<div class="empty">লোড হচ্ছে...</div>';
  const j=await api('/rb/me');if(j.error){el.innerHTML=`<div class="empty">${esc(j.error)}</div>`;return}
  j.bot?rbManage(j.bot):rbCreate(j);
}
const rbBack=()=>RP?`<button class="btn" id="rbBk" style="background:#64748b;box-shadow:none;margin:0 0 14px">✖ অ্যাডমিন প্যানেল বন্ধ করুন</button>`:`<button class="btn" id="rbBk" style="background:#64748b;box-shadow:none;margin:0 0 14px">⬅️ Account এ ফিরুন</button>`;
const rbBkGo=()=>{if(RP){try{TG.close();return}catch{}}go('set')};
function rbCreate(j){
  $('#rbpBody').innerHTML=rbBack()+`<div class="pc"><h3 style="margin:0 0 8px">🤖 রিসেলার বট তৈরি করুন</h3><div style="font-size:14px;line-height:1.7">নিজের নামে আলাদা টেলিগ্রাম বট চালু করুন। দেখতে এই বটের মতই হবে, আলাদা অ্যাকাউন্ট ও ব্যালেন্স থাকবে, আর আপনি নিজের দাম, লাভ, পেমেন্ট নাম্বার, চ্যানেল সব এডিট করতে পারবেন।<br>💲 চার্জ: <b>${tk(j.charge)}</b> (একবারই) • 💰 আপনার ব্যালেন্স: <b>${tk(j.balance)}</b></div></div>
  <label class="l">বট টোকেন (@BotFather থেকে নতুন বট বানিয়ে)</label><input id="rbT" placeholder="123456789:AAxxxxxxxx" autocomplete="off">
  <label class="l">অ্যাডমিনের টেলিগ্রাম আইডি</label><input id="rbA" inputmode="numeric" value="${esc(S.me?.tgId||'')}">
  <button class="btn" id="rbGo">তৈরি করুন</button>`;
  $('#rbBk').onclick=rbBkGo;
  $('#rbGo').onclick=async()=>{const b=$('#rbGo');b.disabled=true;
    const r=await api('/rb/create',{token:$('#rbT').value.trim(),adminId:$('#rbA').value.trim()});b.disabled=false;
    if(r.error)return toast(r.error,'er');toast('🎉 @'+r.username+' চালু হয়েছে','ok');loadBot();openRb()};
}
async function rbManage(b){
  const m=(b.methods||[]).map(x=>[x.name,x.number,x.note||''].join('|')).join('\n');
  $('#rbpBody').innerHTML=rbBack()+`<div class="pc"><h3 style="margin:0">🛠 @${esc(b.username)} ${b.active?'✅':'⛔'}</h3>
  <div class="grid" style="margin-top:12px"><div class="pc" style="margin:0"><small>ইউজার</small><h3>${b.users}</h3></div><div class="pc" style="margin:0"><small>অর্ডার</small><h3>${b.orders}</h3></div><div class="pc" style="margin:0"><small>বিক্রি</small><h3>${tk(b.sales)}</h3></div><div class="pc" style="margin:0"><small>লাভ</small><h3>${tk(b.profit)}</h3></div></div>
  ${(+S.set.resellerMonthlyFee>0)?`<div class="notice" style="margin:12px 0 0">💳 মাসিক ফি <b>৳${S.set.resellerMonthlyFee}</b> — মূল ব্যালেন্স থেকে কাটা হয়${b.paidUntil?`। পরের তারিখ: <b>${new Date(b.paidUntil*1000).toLocaleDateString('bn-BD',{day:'numeric',month:'long'})}</b>`:''}। ব্যালেন্স না থাকলে বট বন্ধ হয়ে যায়।</div>`:''}
  <button class="btn" id="rbTg" style="background:${b.active?'#dc2626':'#16a34a'};box-shadow:none">${b.active?'বট বন্ধ করুন':'বট চালু করুন'}</button></div>

  <div class="sec"><i class="fa-solid fa-chart-line"></i>আপনার লাভ</div>
  <div class="pc" id="rbPf"><div class="empty">লোড হচ্ছে...</div></div>
  <div class="sec"><i class="fa-solid fa-percent"></i>দাম ও লাভ</div>
  <div class="pc"><div style="font-size:13px;color:var(--mu);line-height:1.6">আপনার খরচ = LEAF এর রেট। কাস্টমারের দাম = খরচ + লাভ % + নির্দিষ্ট ৳। দুটো একসাথেও দেওয়া যায়, যেকোনো একটাও। আলাদা দাম দিলে সেটা ওই সার্ভিসের জন্য সবার ওপরে চলবে। খরচের নিচে দাম দেওয়া যায় না।</div>
  <label class="l">সব সার্ভিসে লাভ (%)</label><input id="rbM" type="number" step="0.1" min="0" value="${b.margin||0}">
  <label class="l">সব সার্ভিসে নির্দিষ্ট ৳ বাড়ান (প্রতি ১০০০ এ)</label><input id="rbF" type="number" step="0.01" min="0" value="${b.flat||0}" placeholder="যেমন 5">
  <label style="display:flex;gap:8px;align-items:center;font-size:13px;margin-top:10px"><input type="checkbox" id="rbKeep" style="width:auto"> আলাদা করে দেওয়া দামগুলো না মুছে রাখুন</label>
  <button class="btn" id="rbMb">সব সার্ভিসে প্রয়োগ করুন</button></div>
  <label class="l">সার্ভিস খুঁজুন (ID / নাম / ক্যাটাগরি)</label><input id="rbQ" placeholder="যেমন: instagram followers"><div id="rbPl" style="margin-top:10px"><div class="empty">লোড হচ্ছে...</div></div>

  <div class="sec"><i class="fa-solid fa-wallet"></i>পেমেন্ট মেথড (কাস্টমারের ডিপোজিট)</div>
  <div class="pc"><div style="font-size:13px;color:var(--mu);margin-bottom:6px">প্রতি লাইনে একটি: <b>নাম|নাম্বার|নোট</b><br>যেমন: bKash|01XXXXXXXXX|Send Money<br>কাস্টমার ডিপোজিট করলে আপনার বটে অ্যাপ্রুভ/রিজেক্ট বাটনসহ মেসেজ যাবে।</div>
  <textarea id="rbMt" rows="4" class="rbi">${esc(m)}</textarea>
  <label class="l">সাপোর্ট লিংক</label><input id="rbSl" class="rbi" value="${esc(b.supportLink||'')}" placeholder="https://t.me/yourusername">
  <label class="l">নোটিশ (হোম ও বটে দেখাবে, খালি রাখলে লুকাবে)</label><textarea id="rbNt" rows="2" class="rbi" maxlength="300">${esc(b.notice||'')}</textarea>
  <button class="btn" id="rbPs">সেভ করুন</button></div>

  <div class="sec"><i class="fa-solid fa-bolt"></i>অটো পেমেন্ট</div>
  <div class="pc"><div style="font-size:13px;color:var(--mu);line-height:1.7;margin-bottom:10px">কাস্টমার ডিপোজিট করলে TrxID, টাকা ও নাম্বার আপনার এসএমএসের সাথে মিললে নিজে থেকে ব্যালেন্স যোগ হবে। না মিললে আগের মতো আপনার বটে অ্যাপ্রুভ/রিজেক্ট আসবে। এসএমএস ফরওয়ার্ড আপনি নিজে সেট করবেন।</div>
  <div id="rbAuS" style="font-size:13px;margin-bottom:8px"></div><button class="btn" id="rbAu" style="background:linear-gradient(135deg,#f59e0b,#d97706)"><i class="fa-solid fa-bolt"></i> অটো পেমেন্ট</button></div>

  <div class="sec"><i class="fa-solid fa-bullhorn"></i>চ্যানেল</div>
  <div class="pc"><label class="l" style="margin-top:0">অর্ডার চ্যানেল (@নাম বা -100…)</label><input id="rbOc" class="rbi" value="${esc(b.orderChannel||'')}">
  <label class="l">ফোর্স জয়েন চ্যানেল (প্রতি লাইনে একটি)</label><textarea id="rbFc" rows="3" class="rbi" placeholder="@channel&#10;-100123|https://t.me/+invite">${esc((b.forceChannels||[]).join('\n'))}</textarea>
  <div style="font-size:12px;color:var(--mu);margin-top:6px">⚠️ @${esc(b.username)} বটকে চ্যানেলের অ্যাডমিন বানাতে হবে।</div>
  <button class="btn" id="rbCs">সেভ করুন</button><button class="btn" id="rbTp" style="background:#64748b;box-shadow:none">🧪 টেস্ট পোস্ট</button></div>

  <div class="sec"><i class="fa-regular fa-image"></i>অর্ডার পোস্টের ছবি</div>
  <div class="pc"><label class="l" style="margin-top:0">অর্ডার ছবি ${b.hasOrderPhoto?'✅':'❌'}</label><input type="file" accept="image/*" id="rbPo" class="rbi">
  <label class="l">XP কনভার্ট ছবি ${b.hasXpPhoto?'✅':'❌'}</label><input type="file" accept="image/*" id="rbPx" class="rbi"></div>

  <div class="sec"><i class="fa-solid fa-paper-plane"></i>ব্রডকাস্ট</div>
  <div class="pc"><textarea id="rbBc" rows="3" class="rbi" placeholder="আপনার বটের সব ইউজারকে মেসেজ"></textarea><button class="btn" id="rbBs">পাঠান</button></div>`;
  $('#rbBk').onclick=rbBkGo;
  const upd=async(body,ok)=>{const r=await api('/rb/update',body);if(r.error)return toast(r.error,'er');toast(ok||'সেভ হয়েছে','ok');loadBot();return true};
  $('#rbTg').onclick=async()=>{if(await upd({active:!b.active}))openRb()};
  $('#rbPs').onclick=()=>upd({methods:$('#rbMt').value.split('\n').map(l=>l.split('|').map(x=>x.trim())).filter(a=>a[0]&&a[1]).map(a=>({name:a[0],number:a[1],note:a[2]||''})),supportLink:$('#rbSl').value.trim(),notice:$('#rbNt').value.trim()});
  $('#rbCs').onclick=()=>upd({orderChannel:$('#rbOc').value.trim(),forceChannels:$('#rbFc').value.split('\n').map(x=>x.trim()).filter(Boolean)});
  $('#rbTp').onclick=async()=>{const r=await api('/rb/test');r.error?toast(r.error,'er'):toast('✅ টেস্ট পোস্ট গেছে','ok')};
  rbAuto();$('#rbAu').onclick=()=>rbAutoOpen();
  $('#rbBs').onclick=async()=>{const t=$('#rbBc').value.trim();if(!t)return toast('মেসেজ লিখুন','er');const r=await api('/rb/broadcast',{text:t});r.error?toast(r.error,'er'):(toast('ব্রডকাস্ট শুরু হয়েছে','ok'),$('#rbBc').value='')};
  const ph=(id,key)=>$(id).onchange=async e=>{const f=e.target.files[0];if(!f)return;toast('আপলোড হচ্ছে...');try{const r=await api('/rb/photo',{key,image:await img64(f)});r.error?toast(r.error,'er'):(toast('✅ ছবি সেভ হয়েছে','ok'),loadBot())}catch{toast('ছবি পড়া যায়নি','er')}};
  ph('#rbPo','orderPhoto');ph('#rbPx','xpPhoto');
  $('#rbMb').onclick=async()=>{const v=+$('#rbM').value,fl=+$('#rbF').value||0;if(isNaN(v)||v<0||fl<0)return toast('সঠিক লাভ দিন','er');if(!confirm(`সব সার্ভিসে ${v}%${fl?' + ৳'+fl+' (প্রতি ১০০০)':''} লাভ বসবে${$('#rbKeep').checked?'':' এবং আলাদা দামগুলো মুছে যাবে'}। নিশ্চিত?`))return;
    const r=await api('/rb/prices/bulk',{margin:v,flat:fl,keepCustom:$('#rbKeep').checked});if(r.error)return toast(r.error,'er');toast('✅ সব সার্ভিসের দাম আপডেট হয়েছে','ok');loadBot();rbPrices()};
  $('#rbQ').oninput=()=>{S.prN=40;rbPrList()};
  rbPrices();
  api('/rb/profit').then(r=>{const el=$('#rbPf');if(!el)return;if(r.error)return el.innerHTML='<div class="empty">'+esc(r.error)+'</div>';
    const c=(t,x)=>`<div class="pc" style="margin:0"><small>${t}</small><h3 style="margin:2px 0">${btk(x.profit)}</h3><small style="color:var(--mu)">${bnum(x.orders)} অর্ডার • বিক্রি ${btk(x.sales)}</small></div>`;
    el.innerHTML=`<div class="grid">${c('আজকের লাভ',r.today)}${c('৭ দিনের লাভ',r.week)}</div><div class="pc" style="margin:10px 0 0;background:#ecfdf5"><small>মোট লাভ (শুরু থেকে)</small><h3 style="margin:2px 0;color:#059669">${btk(r.all.profit)}</h3><small style="color:var(--mu)">${bnum(r.all.orders)} অর্ডার • কাস্টমার ${bnum(r.customers)} জন • আপনার খরচ ${btk(r.all.cost)}</small></div>`}).catch(()=>{})
}
async function rbAuto(){const r=await api('/rb/auto',{op:'status'});const e=$('#rbAuS');if(!e||r.error)return;
  e.innerHTML=r.on?`✅ <b>চালু আছে</b> • এসএমএস এসেছে ${r.smsCount} বার${r.lastSmsAt?' • সর্বশেষ '+new Date(r.lastSmsAt*1000).toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}):' • এখনো কোনো এসএমএস আসেনি'} • অটো অ্যাপ্রুভ ${r.autoCount} টি`:'⛔ বন্ধ আছে'}
async function rbAutoOpen(op){
  const r=await api('/rb/auto',{op:op||'enable'});if(r.error)return toast(r.error,'er');
  G(`<div class="sec"><i class="fa-solid fa-bolt"></i>অটো পেমেন্ট ${r.on?'✅ চালু':'⛔ বন্ধ'}</div>
  <div style="font-size:13.5px;line-height:1.8">যে ফোনে আপনার bKash/Nagad/Rocket-এ টাকা আসার এসএমএস আসে, সেই ফোনে একটা <b>SMS ফরওয়ার্ডার</b> অ্যাপ (Play Store এ "SMS Forwarder" / "HTTP SMS" / "SMS to URL") ইনস্টল করে নিচের মতো সেট করুন:</div>
  <label class="l">১) Webhook URL (POST)</label><input id="aU" readonly value="${esc(r.url)}" style="font-size:12px"><button class="btn" id="aUc" style="background:#64748b;box-shadow:none"><i class="fa-regular fa-copy"></i> URL কপি করুন</button>
  <label class="l">২) বডি (JSON) — Content-Type: application/json</label><input id="aB" readonly value='${esc(r.body)}' style="font-size:12px"><button class="btn" id="aBc" style="background:#64748b;box-shadow:none"><i class="fa-regular fa-copy"></i> বডি কপি করুন</button>
  <div style="font-size:12.5px;color:var(--mu);line-height:1.8;margin:10px 0">• অ্যাপে শুধু পেমেন্ট এসএমএস (bKash/Nagad নাম্বার) ফরওয়ার্ড করুন।<br>• %text% এর জায়গায় অ্যাপ নিজে এসএমএসের লেখা বসাবে (অ্যাপভেদে লেখাটা {sms}/%m ইত্যাদি হতে পারে)।<br>• সেট করে নিজের নাম্বারে ছোট টাকা পাঠিয়ে টেস্ট করুন: এসএমএস এলে এই পেজে "এসএমএস এসেছে" সংখ্যা বাড়বে।<br>• এই URL গোপন রাখুন। কেউ জেনে গেলে "নতুন কী" চাপুন।<br>• ডিপোজিটে লেখা নাম্বার, TrxID ও টাকা এসএমএসের সাথে হুবহু না মিললে অটো হবে না, আপনার বটে ম্যানুয়াল অ্যাপ্রুভ আসবে।</div>
  <button class="btn" id="aNk" style="background:#f59e0b;box-shadow:none">🔄 নতুন কী</button>
  <button class="btn" id="aOf" style="background:${r.on?'#dc2626':'#16a34a'};box-shadow:none">${r.on?'অটো পেমেন্ট বন্ধ করুন':'আবার চালু করুন'}</button>`);
  const cp=async(id)=>{try{await navigator.clipboard.writeText($(id).value);toast('কপি হয়েছে','ok')}catch{$(id).select();document.execCommand('copy');toast('কপি হয়েছে','ok')}};
  $('#aUc').onclick=()=>cp('#aU');$('#aBc').onclick=()=>cp('#aB');
  $('#aNk').onclick=()=>{if(confirm('নতুন কী নিলে আগের URL আর কাজ করবে না, ফরওয়ার্ডারে নতুন URL বসাতে হবে। নিশ্চিত?'))rbAutoOpen('regen')};
  $('#aOf').onclick=async()=>{if(r.on){await api('/rb/auto',{op:'disable'});toast('বন্ধ হয়েছে','ok');$('#gModal').classList.add('hide');rbAuto()}else rbAutoOpen('enable')};
  rbAuto();
}
function img64(f){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,1280/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.85))};im.onerror=rej;im.src=r.result};r.onerror=rej;r.readAsDataURL(f)})}
async function rbPrices(){const j=await api('/rb/prices');if(j.error){$('#rbPl').innerHTML=`<div class="empty">${esc(j.error)}</div>`;return}S.pr=j.services;S.prN=40;rbPrList()}
function rbPrList(){
  const q=($('#rbQ')?.value||'').trim().toLowerCase(),all=(S.pr||[]).filter(x=>!q||String(x.sid)==q||x.name.toLowerCase().includes(q)||(x.category||'').toLowerCase().includes(q));
  const l=all.slice(0,S.prN||40),el=$('#rbPl');if(!el)return;
  el.innerHTML=l.map(x=>`<div class="hi" style="display:block"><b>#${x.sid} ${esc(x.name)}</b><div style="font-size:12px;color:var(--mu);margin-top:3px">${esc(x.category||'')} • আপনার খরচ <b>${tk(x.cost)}</b>/১০০০ • লাভ <b>${x.cost?((x.price-x.cost)/x.cost*100).toFixed(1):0}%</b> ${x.custom?'• <span style="color:#d97706;font-weight:700">আলাদা দাম</span>':''}</div>
  <div style="display:flex;gap:8px;margin-top:8px;align-items:center"><input type="number" step="0.01" min="${x.cost}" value="${x.price}" data-p="${x.sid}" style="margin:0;flex:1"><button class="btn" data-ps="${x.sid}" style="width:auto;margin:0;padding:11px 16px;font-size:14px">সেভ</button>${x.custom?`<button class="btn" data-pr="${x.sid}" style="width:auto;margin:0;padding:11px 14px;font-size:14px;background:#64748b;box-shadow:none">রিসেট</button>`:''}</div></div>`).join('')||'<div class="empty">কোনো সার্ভিস পাওয়া যায়নি</div>';
  if(all.length>l.length)el.insertAdjacentHTML('beforeend',`<button class="btn" id="rbMore" style="background:#64748b;box-shadow:none">আরও দেখান (${all.length-l.length})</button>`);
  $('#rbMore')&&($('#rbMore').onclick=()=>{S.prN+=40;rbPrList()});
  const set=async(sid,price)=>{const r=await api('/rb/prices/set',{sid,price});if(r.error)return toast(r.error,'er');const x=S.pr.find(y=>y.sid==sid);x.price=r.price;x.custom=r.custom;toast('✅ দাম সেভ হয়েছে','ok');loadBot();rbPrList()};
  $$('[data-ps]').forEach(b=>b.onclick=()=>set(+b.dataset.ps,$(`[data-p="${b.dataset.ps}"]`).value));
  $$('[data-pr]').forEach(b=>b.onclick=()=>set(+b.dataset.pr,null));
}

/* ---------- SUPPORT BOT ---------- */
const BOT_CHIPS=['আমার ব্যালেন্স','আমার অর্ডার','ফান্ড কীভাবে অ্যাড করব','রেফার','রিফান্ড','সাপোর্ট'];
const has=(q,arr)=>arr.some(k=>q.includes(k));
function botAnswer(raw){
  const q=String(raw||'').toLowerCase().replace(/[?!।,.]/g,' ').replace(/\s+/g,' ').trim();
  const me=S.me||{};
  const A_T=['টিকেট খুলুন','ticket'],A_S=['লাইভ সাপোর্ট','support'];
  // অ্যাডমিনের নিজের লেখা FAQ আগে
  for(const f of (S.set.faq||[])){if((f.k||[]).some(k=>k&&q.includes(String(k).toLowerCase())))return{t:f.a,a:[]}}
  if(!q)return{t:'আপনার প্রশ্নটি লিখুন।',a:[]};
  if(has(q,['hi','hello','হ্যালো','হাই','সালাম','assalamu','হেলো'])&&q.length<25)return{t:`হ্যালো ${me.name||''}! 👋 আমি আপনার সাপোর্ট অ্যাসিস্ট্যান্ট। ব্যালেন্স, অর্ডার, ডিপোজিট বা রেফার নিয়ে জিজ্ঞেস করতে পারেন।`,a:[]};
  const num=(q.match(/\d{6,}/)||[])[0];
  if(num){const o=S.orders.find(x=>String(x.orderNo)==num);
    return o?{t:`অর্ডার #${o.orderNo}\n${o.serviceName}\nপরিমাণ: ${o.quantity} • চার্জ: ${tk(o.charge)}\nস্ট্যাটাস: ${o.status.toUpperCase()}`,a:o.status=='completed'||o.status=='partial'?[['রিফিল রিকোয়েস্ট','refill']]:o.status=='pending'||o.status=='processing'?[['রিফান্ড ক্লেইম','refund']]:[]}:{t:`#${num} নম্বরে আপনার কোনো অর্ডার পাইনি। অর্ডার ID ঠিক আছে কি দেখুন।`,a:[]}}
  if(has(q,['ব্যালেন্স','balance','blance','বালেন্স','কত টাকা']))return{t:`আপনার বর্তমান ব্যালেন্স ${tk(me.balance)}।\nমোট ডিপোজিট ${tk(me.totalDeposit)}, মোট খরচ ${tk(me.totalSpent)}।`,a:[['ফান্ড অ্যাড করুন','funds']]};
  if(has(q,['রিফান্ড','refund','ফেরত','টাকা কেটে']))return{t:'অর্ডার পেন্ডিং বা প্রসেসিং থাকলে রিফান্ড ক্লেইম করতে পারবেন। Settings → "রিফান্ড ক্লেইম করুন" থেকে অর্ডার বেছে জমা দিন, অ্যাডমিন যাচাই করে ব্যালেন্সে টাকা ফেরত দেবে।',a:[['রিফান্ড ক্লেইম','refund']]};
  if(has(q,['রিফিল','refill','ড্রপ','কমে গেছে','কমে গেল']))return{t:'অর্ডার সম্পন্ন হওয়ার পর সংখ্যা কমে গেলে রিফিল রিকোয়েস্ট দিন। Settings → "রিফিল রিকোয়েস্ট" থেকে অর্ডার বেছে জমা দিন।',a:[['রিফিল রিকোয়েস্ট','refill']]};
  if(has(q,['ডিপোজিট','deposit','ফান্ড','fund','টাকা যোগ','পেমেন্ট','payment','বিকাশ','bkash','নগদ','nagad','add fund']))
    {const l=S.deps[0],m=(S.set.methods||[]).map(x=>x.name).join(', ');
     let t=`ফান্ড অ্যাড করতে Funds পেজে যান → পেমেন্ট মেথড বেছে নিন${m?` (${m})`:''} → দেখানো নাম্বারে Send Money করুন → টাকা, আপনার নাম্বার ও TrxID দিয়ে সাবমিট করুন। অ্যাডমিন যাচাই করলে ব্যালেন্সে যোগ হবে। ন্যূনতম ডিপোজিট ৳${S.set.minDeposit||10}।`;
     if(l)t+=`\n\nআপনার সর্বশেষ ডিপোজিট: ${tk(l.amount)} (${l.method}) — ${l.status}`;
     return{t,a:[['Funds পেজে যান','funds']]}}
  if(has(q,['অর্ডার','order','স্ট্যাটাস','status','কোথায়','এখনো আসেনি','আসে নাই']))
    {const l=S.orders.slice(0,3);return{t:l.length?'আপনার সর্বশেষ অর্ডার:\n'+l.map(o=>`#${o.orderNo} • ${o.serviceName.slice(0,32)} • ${o.status.toUpperCase()}`).join('\n')+'\n\nনির্দিষ্ট অর্ডারের ID লিখলে বিস্তারিত বলতে পারব।':'আপনি এখনো কোনো অর্ডার করেননি।',a:[['সব অর্ডার দেখুন','orders']]}}
  if(has(q,['রেফার','refer','কমিশন','commission','টিম']))return{t:`বন্ধুদের রেফার করলে তারা ডিপোজিট করলে আপনি ${S.set.refPercent||0}% কমিশন পাবেন। আপনার মোট রেফার ইনকাম ${tk(me.refEarned)}, রেফার করেছেন ${S.team.length} জন।`,a:[['রেফার লিংক নিন','ref']]};
  if(has(q,['xp','এক্সপি']))return{t:`আপনার XP: ${me.xp||0}।${+S.set.xpPerBdt?` ${S.set.xpPerBdt} XP = ৳1। Settings → "XP থেকে BDT কনভার্ট" থেকে ব্যালেন্সে নিতে পারবেন।`:' XP কনভার্ট এখন চালু নেই।'}`,a:[]};
  if(has(q,['লেভেল','level','ডিসকাউন্ট','discount','vip','ভিআইপি']))return{t:`মোট খরচ বাড়লে লেভেল বাড়ে ও অর্ডারে ডিসকাউন্ট পান। আপনার বর্তমান ডিসকাউন্ট ${disc()}%। Settings → "ভিআইপি লেভেল" থেকে সব লেভেল দেখুন।`,a:[]};
  if(has(q,['সাপোর্ট','support','এডমিন','অ্যাডমিন','admin','যোগাযোগ','টিকেট','ticket','সমস্যা','কথা বলতে','মানুষ']))return{t:'আপনার সমস্যাটা টিকেট আকারে জানান, অ্যাডমিন উত্তর দেবে। জরুরি হলে লাইভ সাপোর্টে যোগাযোগ করুন।',a:[A_T,A_S]};
  if(has(q,['ধন্যবাদ','thanks','thank','শুকরিয়া']))return{t:'আপনাকেও ধন্যবাদ! আর কিছু জানার থাকলে জিজ্ঞেস করুন। 😊',a:[]};
  return{t:'দুঃখিত, প্রশ্নটা পুরোপুরি বুঝতে পারিনি। নিচের বিষয়গুলো থেকে বেছে নিন, অথবা টিকেট খুলে অ্যাডমিনকে জানান।',a:[A_T,A_S]};
}
function botAct(k){
  if(k=='funds'||k=='orders'||k=='ref'){go(k);$('#aiBox').classList.add('hide')}
  else if(k=='refund'||k=='refill'){$('#aiBox').classList.add('hide');go('set');reqForm(k)}
  else if(k=='ticket'){$('#aiBox').classList.add('hide');go('set');$('#mTicket').click()}
  else if(k=='support'){$('#mSup').click()}
}
function botSay(t,acts,me){
  const w=$('#aiMsgs'),d=document.createElement('div');d.className='ai-m '+(me?'me':'bot');d.textContent=t;
  (acts||[]).forEach(([l,k])=>{const b=document.createElement('button');b.className='ai-a';b.textContent=l;b.onclick=()=>botAct(k);d.appendChild(b)});
  w.appendChild(d);w.scrollTop=w.scrollHeight;
}
function botAsk(txt){
  txt=String(txt||'').trim();if(!txt)return;botSay(txt,null,true);$('#aiIn').value='';
  const r=botAnswer(txt);setTimeout(()=>botSay(r.t,r.a),350);
}
let botInit=false;
$('#aiBtn').onclick=()=>{const b=$('#aiBox');b.classList.toggle('hide');
  if(!b.classList.contains('hide')&&!botInit){botInit=true;botSay(`হ্যালো ${S.me?.name||''}! 👋 আমি আপনার সাপোর্ট অ্যাসিস্ট্যান্ট। অর্ডার স্ট্যাটাস, ব্যালেন্স বা যেকোনো বিষয়ে জিজ্ঞেস করুন।`);
    $('#aiChips').innerHTML=BOT_CHIPS.map(c=>`<button class="ai-c">${esc(c)}</button>`).join('');
    $$('#aiChips .ai-c').forEach(x=>x.onclick=()=>botAsk(x.textContent))}};
$('#aiX').onclick=()=>$('#aiBox').classList.add('hide');
$('#aiSend').onclick=()=>botAsk($('#aiIn').value);
$('#aiIn').addEventListener('keydown',e=>{if(e.key=='Enter')botAsk($('#aiIn').value)});
//==END==
