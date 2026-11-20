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
  }catch(e){console.warn(e)}finally{S._syncing=false;if(!S._booted){S._booted=true;clearTimeout(S._bt);if(!S._gate||!$('#gate'))$('#load').classList.add('hide')}}
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
  const r=await fetch(bs+path,{method:'POST',headers:Object.assign({'Content-Type':'application/json',Authorization:'Bearer '+tok},S.rbAs&&/^\/rb\//.test(path)?{'X-Rb-As':S.rbAs}:{}),body:JSON.stringify(body||{})});
  const j=await r.json().catch(()=>({error:'সার্ভারের উত্তর বোঝা যায়নি'}));if(!r.ok&&!j.error)j.error='ত্রুটি '+r.status;return j;
}
const botRate=s=>{const B=S.bot||{},p=(B.prices||{})[s.sid];return p!=null&&!isNaN(+p)?Math.max(+s.rate,+p):+(s.rate*(1+(+B.margin||0)/100)+(+B.flat||0)).toFixed(4)};
function applyPrices(){const t=S.bot&&S.bot.tenant;S.svcs=(S.raw||[]).map(s=>t?{...s,rate:botRate(s)}:s).sort((a,b)=>a.sid-b.sid);fillCats()}
function mergeBot(){const B=S.bot;if(!B||!B.tenant)return;S.set={...S.set,methods:B.methods||[],supportLink:B.supportLink||'',siteName:B.siteName||S.set.siteName,notice:B.notice||'',banners:B.banners||[],tutorialLink:''}}
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
  if(j.owner&&(j.all||[]).length&&!j.asBot){S.rbAs='';return rbPick(j)}
  j.bot?rbManage(j.bot):rbCreate(j);
}
function rbPick(j){
  $('#rbpBody').innerHTML=rbBack()+`<div class="pc"><h3 style="margin:0 0 6px">👑 মালিক: রিসেলার বট ম্যানেজ</h3><div style="font-size:13px;color:var(--mu);line-height:1.7;margin-bottom:10px">যেকোনো রিসেলার বট বেছে তার পুরো সেটিং (দাম, পেমেন্ট, নোটিশ, সাপোর্ট, চ্যানেল ইত্যাদি) আপনি নিজেই করতে পারবেন।</div>
  <input id="rbPq" placeholder="বটের নাম / @username খুঁজুন">
  <div id="rbPl" style="margin-top:10px"></div>
  ${j.bot?'<button class="btn" id="rbMine" style="background:#64748b;box-shadow:none">আমার নিজের বট</button>':''}</div>`;
  const L=j.all;const draw=()=>{const q=($('#rbPq').value||'').toLowerCase();$('#rbPl').innerHTML=L.filter(b=>!q||(b.username+' '+b.name).toLowerCase().includes(q)).map(b=>`<div class="pc" data-ab="${esc(b.id)}" style="margin:8px 0;cursor:pointer;display:flex;justify-content:space-between;align-items:center"><div><b>@${esc(b.username)}</b><br><small>${esc(b.name||'')}</small></div><span>${b.active?'✅':'⛔'} ›</span></div>`).join('')||'<div class="empty">কিছু পাওয়া যায়নি</div>';
    $$('#rbPl [data-ab]').forEach(e=>e.onclick=async()=>{S.rbAs=e.dataset.ab;const r=await api('/rb/me');if(r.error){S.rbAs='';return toast(r.error,'er')}r.bot?rbManage(r.bot):toast('বট পাওয়া যায়নি','er')})};
  $('#rbBk').onclick=rbBkGo;$('#rbPq').oninput=draw;draw();
  const m=$('#rbMine');if(m)m.onclick=()=>{S.rbAs='';api('/rb/me').then(r=>r.bot?rbManage(r.bot):rbCreate(r))};
}
const rbBack=()=>RP?`<button class="btn" id="rbBk" style="background:#64748b;box-shadow:none;margin:0 0 14px">✖ অ্যাডমিন প্যানেল বন্ধ করুন</button>`:`<button class="btn" id="rbBk" style="background:#64748b;box-shadow:none;margin:0 0 14px">⬅️ Account এ ফিরুন</button>`;
const rbBkGo=()=>{S.rbAs='';if(RP){try{TG.close();return}catch{}}go('set')};
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
  const sw=S.rbAs?`<button class="btn" id="rbSw" style="background:#7c3aed;box-shadow:none;margin:0 0 14px">👑 অন্য রিসেলার বট বেছে নিন</button>`:'';
  const m=(b.methods||[]).map(x=>[x.name,x.number,x.note||''].join('|')).join('\n');
  $('#rbpBody').innerHTML=rbBack()+sw+`<div class="pc"><h3 style="margin:0">🛠 @${esc(b.username)} ${b.active?'✅':'⛔'}</h3>
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

  <div id="rbX"></div>
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
  const sw_=$('#rbSw');if(sw_)sw_.onclick=()=>{S.rbAs='';openRb()};
  const upd=async(body,ok)=>{const r=await api('/rb/update',body);if(r.error)return toast(r.error,'er');toast(ok||'সেভ হয়েছে','ok');loadBot();return true};
  $('#rbTg').onclick=async()=>{if(await upd({active:!b.active}))openRb()};
  $('#rbPs').onclick=()=>upd({methods:$('#rbMt').value.split('\n').map(l=>l.split('|').map(x=>x.trim())).filter(a=>a[0]&&a[1]).map(a=>({name:a[0],number:a[1],note:a[2]||''})),supportLink:$('#rbSl').value.trim(),notice:$('#rbNt').value.trim()});
  $('#rbCs').onclick=()=>upd({orderChannel:$('#rbOc').value.trim(),forceChannels:$('#rbFc').value.split('\n').map(x=>x.trim()).filter(Boolean)});
  $('#rbTp').onclick=async()=>{const r=await api('/rb/test');r.error?toast(r.error,'er'):toast('✅ টেস্ট পোস্ট গেছে','ok')};
  rbAuto();$('#rbAu').onclick=()=>rbAutoOpen();if(typeof rbExtra=='function')rbExtra(b);
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
  const f=await api('/rb/auto-info',{}).catch(()=>({}));const ap=f.apk||{},um=f.unmatched||[];
  const row=(l,v,id)=>`<label class="l">${l}</label><div style="display:flex;gap:8px;align-items:center"><input id="${id}" readonly value="${esc(v)}" onclick="this.select()" style="flex:1;margin:0;font:600 12px ui-monospace,Menlo,monospace"><button class="btn" data-cp="${id}" style="width:auto;margin:0;padding:11px 14px;font-size:13px;background:#64748b;box-shadow:none"><i class="fa-regular fa-copy"></i></button></div>`;
  G(`<div class="sec"><i class="fa-solid fa-bolt"></i>অটো পেমেন্ট ${r.on?'✅ চালু':'⛔ বন্ধ'}</div>
  <div style="font-size:13px;color:var(--mu);line-height:1.7">কাস্টমার ডিপোজিট দিলে তার TrxID, টাকা ও নাম্বার আপনার ফোনের SMS-এর সাথে মিললে ব্যালেন্স নিজে যোগ হবে। না মিললে আপনার বটে আগের মতো অ্যাপ্রুভ/রিজেক্ট বাটন আসবে।</div>
  <div class="pc" style="margin:12px 0"><b>ধাপ ১ — অ্যাপ নিন</b>
  <div style="font-size:13px;line-height:1.7;margin:6px 0">যে ফোনে bKash/Nagad-এর টাকা পাওয়ার SMS আসে, সেই ফোনে এই অ্যাপ ইনস্টল করুন (SMS পড়ার অনুমতি দেবেন):</div>
  ${ap.has?`<button class="btn" id="aApk"><i class="fa-solid fa-download"></i> SMS ফরওয়ার্ডার অ্যাপ নিন${ap.kb?' ('+ap.kb+' KB)':''}</button><div style="font-size:12px;color:var(--mu)">অ্যাপটি আপনার টেলিগ্রামে এই বটে ফাইল হিসেবে চলে আসবে।</div>`:ap.link?`<button class="btn" id="aApk"><i class="fa-solid fa-download"></i> অ্যাপ ডাউনলোড</button>`:`<div class="empty" style="padding:8px">অ্যাপ এখনো যোগ হয়নি — সাপোর্টে জানান</div>`}</div>
  <div class="pc" style="margin:12px 0"><b>ধাপ ২ — অ্যাপে নতুন রুল বানান</b>
  <div style="font-size:13px;line-height:1.8;margin:6px 0">অ্যাপে <b>+</b> চেপে নতুন রুল খুলুন, তারপর নিচের ঘরগুলো এভাবে ভরুন (কপি বাটন চাপলেই কপি হবে):</div>
  ${row('Sender (SMS যার নামে আসে)','bKash|NAGAD','aS')}
  <div style="font-size:12px;color:var(--mu);margin:4px 0">• "Sender is a regular expression" চালু করুন।<br>• আপনার ইনবক্সে টাকার SMS কার নামে আসে দেখে নিন, নাম ভিন্ন হলে সেটা লিখুন।<br>• Text filter ফাঁকা রাখুন।</div>
  ${row('Webhook URL','','aU').replace('value=""','value="'+esc(r.url)+'"')}
  <div style="font-size:12px;color:var(--mu);margin:4px 0">• ⚠️ এই URL শুধু আপনার। কাউকে দেবেন না।</div>
  <div style="font-size:12.5px;margin:10px 0 2px"><b>ADVANCED PARAMETERS</b> খুলুন:</div>
  ${row('Json Payload Template','{"from":"%from%","text":"%text%"}','aB')}
  ${row('Headers','{"Content-Type":"application/json"}','aH')}
  <div style="font-size:12px;color:var(--mu);margin:6px 0;line-height:1.7">• Sim Slot: any • Number of retries: 10<br>• বাকি সব সুইচ (SSL ignore, Chunked, HMAC) বন্ধ রাখুন।<br>• প্রথমে <b>TEST</b> চাপুন, তারপর <b>SAVE</b>।</div></div>
  <div class="pc" style="margin:12px 0"><b>ধাপ ৩ — ফোন ঠিক রাখুন</b>
  <div style="font-size:13px;line-height:1.8;margin-top:6px">• ফোনের Settings → Apps → অ্যাপটি → Battery → <b>Unrestricted</b>।<br>• ফোনে মোবাইল ডাটা/ওয়াইফাই চালু থাকতে হবে।<br>• অ্যাপ ফোর্স-স্টপ বা টাস্ক-কিল করবেন না।</div></div>
  <div class="pc" style="margin:12px 0"><b>ধাপ ৪ — টেস্ট করুন</b>
  <div style="font-size:13px;line-height:1.8;margin:6px 0">অন্য নাম্বার থেকে ১০ টাকা পাঠান → কাস্টমার হিসেবে বটে ওই টাকা, ওই নাম্বার ও TrxID দিয়ে ডিপোজিট দিন → ব্যালেন্স নিজে যোগ হলে কাজ করছে। এসএমএস এলে নিচের সংখ্যা বাড়বে।</div>
  <div id="aSt" style="font-size:13px"></div></div>
  <div class="pc" style="margin:12px 0"><b>🧪 SMS পরীক্ষা</b>
  <div style="font-size:12.5px;color:var(--mu);margin:6px 0">টাকা পাওয়ার একটা আসল SMS এখানে পেস্ট করুন, সিস্টেম বুঝতে পারছে কিনা দেখুন:</div>
  <textarea id="aT" rows="3" placeholder="You have received Tk 500.00 from 01XXXXXXXXX. TrxID ..." maxlength="600"></textarea>
  <button class="btn" id="aTb" style="background:#64748b;box-shadow:none">পরীক্ষা করুন</button><div id="aTr" style="font-size:13px;line-height:1.7"></div></div>
  ${um.length?`<div class="pc" style="margin:12px 0"><b>📥 SMS এসেছে কিন্তু মেলেনি</b><div style="font-size:12px;color:var(--mu);margin:4px 0">এই টাকাগুলোর জন্য কাস্টমার এখনো ডিপোজিট দেয়নি (৩ দিনের মধ্যে)</div>${um.map(x=>`<div class="hi" style="padding:6px 0"><span>${esc(x.trx)} • ${tk(x.amount)} • ${esc(x.sender||'—')}</span></div>`).join('')}</div>`:''}
  <button class="btn" id="aNk" style="background:#f59e0b;box-shadow:none">🔄 নতুন কী (URL বদলাবে)</button>
  <button class="btn" id="aOf" style="background:${r.on?'#dc2626':'#16a34a'};box-shadow:none">${r.on?'অটো পেমেন্ট বন্ধ করুন':'আবার চালু করুন'}</button>`);
  $$('[data-cp]').forEach(b=>b.onclick=async()=>{const i=$('#'+b.dataset.cp);try{await navigator.clipboard.writeText(i.value)}catch{i.select();document.execCommand('copy')}toast('কপি হয়েছে','ok')});
  const ak=$('#aApk');if(ak)ak.onclick=async()=>{if(!ap.has){window.open(ap.link,'_blank');return}ak.disabled=true;const x=await api('/rb/apk',{});ak.disabled=false;if(x.error)return toast(x.error,'er');x.link?window.open(x.link,'_blank'):toast('✅ অ্যাপ আপনার টেলিগ্রামে পাঠানো হয়েছে','ok')};
  $('#aTb').onclick=async()=>{const t=$('#aT').value.trim();if(!t)return toast('SMS পেস্ট করুন','er');const x=await api('/rb/auto-info',{text:t});const p=x.parsed;
    $('#aTr').innerHTML=p?`✅ TrxID: <b>${esc(p.trx)}</b> • টাকা: <b>${tk(p.amount)}</b> • নাম্বার: <b>${esc(p.sender||'পাওয়া যায়নি')}</b>${x.hint?'<br><span style="color:#d97706">'+esc(x.hint)+'</span>':'<br>সিস্টেম এই SMS ঠিকমতো বুঝতে পারছে।'}`:`<span style="color:#dc2626">❌ ${esc(x.hint||'বোঝা যায়নি')}</span>`};
  $('#aNk').onclick=()=>{if(confirm('নতুন কী নিলে আগের URL আর কাজ করবে না, অ্যাপে নতুন URL বসাতে হবে। নিশ্চিত?'))rbAutoOpen('regen')};
  $('#aOf').onclick=async()=>{if(r.on){await api('/rb/auto',{op:'disable'});toast('বন্ধ হয়েছে','ok');$('#gModal').classList.add('hide');rbAuto()}else rbAutoOpen('enable')};
  api('/rb/auto',{op:'status'}).then(s=>{const e=$('#aSt');if(e&&!s.error)e.innerHTML=`এসএমএস এসেছে <b>${s.smsCount}</b> বার${s.lastSmsAt?' • সর্বশেষ '+new Date(s.lastSmsAt*1000).toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}):' • এখনো কোনো এসএমএস আসেনি'} • অটো অ্যাপ্রুভ <b>${s.autoCount}</b> টি`});
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
const BOT_CHIPS=['কীভাবে অর্ডার করব','ফান্ড কীভাবে অ্যাড করব','আমার ব্যালেন্স','আমার অর্ডার','সার্ভিসের নামের মানে কী','রিফিল','রিফান্ড','রেফার','সাপোর্ট'];
const has=(q,arr)=>arr.some(k=>q.includes(k));
/* গোপনীয় বিষয়: এগুলোর উত্তর কখনো দেওয়া হবে না */
const PRIV=[/(অ্যাডমিন|এডমিন|admin|owner|মালিক)[^ ]*\s*(এর|er|র)?\s*(নাম্বার|নম্বর|number|ফোন|phone|ঠিকানা|address|পাসওয়ার্ড|password|আইডি|id|ছবি|নাম|name|কে|কোথায়)/i,
 /(অন্য|অন্যের|onner|others?|অমুক|কারো|কারও|সবার)\s*(ইউজার|user|ব্যালেন্স|balance|অর্ডার|order|ডিপোজিট|deposit|তথ্য|ডাটা|data|নাম্বার|নম্বর)/i,
 /(user|ইউজার)\s*(list|লিস্ট|তালিকা|কতজন|কত জন)/i,
 /(api\s*key|এপিআই\s*কী|secret|সিক্রেট|token|টোকেন|firebase|mongo|database|ডাটাবেস|ডেটাবেস|render|github|source\s*code|সোর্স\s*কোড|server|সার্ভার|admin\s*panel|অ্যাডমিন\s*প্যানেল|এডমিন\s*প্যানেল|backend|hack|হ্যাক|bypass|crack)/i,
 /(প্রোভাইডার|provider|supplier|সাপ্লাইয়ার|কোথা\s*থেকে\s*(সার্ভিস|কিনেন|আনেন)|কত\s*টাকায়\s*(কিনেন|কেনেন|কিনে)|মূল\s*রেট|মূল\s*দাম|ক্রয়\s*মূল্য|cost\s*price|wholesale|হোলসেল|লাভ\s*কত|কত\s*লাভ|profit|মার্জিন|margin|মার্কআপ|markup|আয়\s*কত|ইনকাম\s*কত\s*করেন|কত\s*টাকা\s*কামান)/i];
const PRIV_R='🔒 দুঃখিত, এটা গোপনীয় তথ্য—আমি দিতে পারি না। 🙏\nতবে সার্ভিস, দাম, অর্ডার, ডিপোজিট, রিফিল, রেফার সহ আপনার নিজের অ্যাকাউন্টের সবকিছু নিয়ে সাহায্য করতে পারি।';
const SAFE_T='\n\n⚠️ সতর্কতা: পাসওয়ার্ড, OTP বা কোড আমরা কখনো চাই না—কাউকে দেবেন না।';
function kbList(){
  const S_=S.set||{},m=(S_.methods||[]).map(x=>x.name).filter(Boolean).join(', '),lv=(S_.levels||[]).map(l=>`${l.name}: ৳${l.min}+ → ${l.disc}%`).join('\n');
  const T=['টিকেট খুলুন','ticket'],SP=['লাইভ সাপোর্ট','support'];
  return [
  {k:['কীভাবে অর্ডার','কিভাবে অর্ডার','কিভাবে অর্ডার','how to order','order kivabe','order korbo','অর্ডার করব','অর্ডার করতে','অর্ডার দিব','অর্ডার দেব','প্রথম অর্ডার','শুরু করব'],
   t:'📦 অর্ডার করার ধাপ:\n১) Home পেজে প্ল্যাটফর্ম বেছে নিন (Facebook/Instagram/TikTok…)\n২) ক্যাটাগরি, তারপর সার্ভিস বেছে নিন\n৩) পোস্ট/প্রোফাইলের লিংক দিন (পাবলিক হতে হবে)\n৪) পরিমাণ লিখুন—নিচে দাম নিজে দেখাবে\n৫) "অর্ডার করুন" চাপুন, ব্যালেন্স থেকে টাকা কাটবে।\n\nব্যালেন্স না থাকলে আগে Funds থেকে টাকা যোগ করুন।',a:[['ফান্ড অ্যাড করুন','funds']]},
  {k:['লিংক','link','url','ইউআরএল','private','প্রাইভেট','পাবলিক','public','লিঙ্ক','ভুল লিংক','লিংক ভুল'],
   t:'🔗 লিংকের নিয়ম:\n• প্রোফাইল/পোস্ট/চ্যানেল অবশ্যই পাবলিক হতে হবে (প্রাইভেট বা লক থাকলে অর্ডার হবে না)\n• সম্পূর্ণ লিংক দিন (https:// সহ), কপি করে পেস্ট করুন\n• সার্ভিস অনুযায়ী প্রোফাইল লিংক নাকি পোস্ট লিংক—সার্ভিসের নামে/বিবরণে দেখুন\n• ভুল লিংকে অর্ডার চলে গেলে বদলানো যায় না, তাই দেওয়ার আগে দুবার দেখুন; ভুল হলে সাথে সাথে টিকেট দিন।'},
  {k:['নামের মানে','মানে কী','মানে কি','no drop','nodrop','non drop','nr ','r30','r60','r90','lifetime','instant','hq','mq ','lq ','real','speed','স্পিড','গ্যারান্টি','guarantee','কোয়ালিটি','quality','কোনটা ভালো','কোনটা নিব','কোনটা নেব'],
   t:'🏷 সার্ভিসের নামের শব্দগুলোর মানে:\n• No Drop / NR — সংখ্যা কমার সম্ভাবনা খুব কম\n• Refill / R30 / R60 / Lifetime — কমে গেলে ওই দিনের মধ্যে রিফিল পাবেন\n• Instant / Fast — সাথে সাথে বা দ্রুত শুরু\n• Speed 10K/Day — দিনে প্রায় এত সংখ্যা যোগ হয়\n• HQ / Real / Premium — ভালো মানের/আসল দেখতে অ্যাকাউন্ট\n• MQ / LQ — মাঝারি/সাধারণ মান (দাম কম, ড্রপ বেশি হতে পারে)\n• Min / Max — একবারে সর্বনিম্ন ও সর্বোচ্চ পরিমাণ\n\nনিশ্চিন্ত থাকতে "♻ রিফিল গ্যারান্টি" ব্যাজ থাকা সার্ভিস নিন।'},
  {k:['রেট','rate','দাম','price','প্রাইস','১০০০','1000','কত টাকা পড়বে','দাম কেন','দাম কম','দাম বেশি','খরচ কত'],
   t:'💰 দাম প্রতি ১০০০ হিসাবে দেখানো থাকে। আপনি যত পরিমাণ লিখবেন, নিচে মোট দাম নিজে হিসাব হয়ে যায়।\nআপনার লেভেল অনুযায়ী ডিসকাউন্ট ('+(typeof disc=='function'?disc():0)+'%) অর্ডারে নিজে থেকেই কাটা হয়।\nঅফার/ফ্ল্যাশ সেল চললে 🔥 চিহ্নসহ কম দাম দেখাবে।',a:[]},
  {k:['মিনিমাম','minimum','min ','ম্যাক্স','maximum','max ','সর্বনিম্ন','সর্বোচ্চ','কমপক্ষে','কত পর্যন্ত','কতটা অর্ডার'],
   t:'📏 প্রতিটি সার্ভিসের সর্বনিম্ন ও সর্বোচ্চ পরিমাণ আলাদা। সার্ভিস বেছে নিলে "Min - Max" লেখা থাকে—ওই সীমার মধ্যে পরিমাণ দিতে হবে।'},
  {k:['স্ট্যাটাস','status','pending','পেন্ডিং','processing','প্রসেসিং','completed','কমপ্লিট','partial','পার্শিয়াল','canceled','cancel','বাতিল','in progress','মানে কী'],
   t:'📊 অর্ডারের অবস্থা:\n• PENDING — অর্ডার জমা হয়েছে, শুরুর অপেক্ষায়\n• PROCESSING — কাজ চলছে\n• COMPLETED — সম্পূর্ণ হয়েছে\n• PARTIAL — আংশিক হয়েছে, বাকিটার টাকা সাধারণত ব্যালেন্সে ফেরত আসে\n• CANCELED — বাতিল, টাকা ফেরত আসে\nঅর্ডারের নম্বর লিখলে আমি স্ট্যাটাস বলে দেব।'},
  {k:['শুরু হয়নি','শুরু হয় নাই','শুরু হচ্ছে না','দেরি','slow','ধীর','কখন','কতক্ষণ','কতদিন','এখনো আসেনি','আসে নাই','আসেনি','বাড়ছে না','বাড়েনি','চলছে না','কাজ করছে না','not start','not working','not started'],
   t:'⏱ অর্ডার সাধারণত কিছু মিনিট থেকে কয়েক ঘণ্টার মধ্যে শুরু হয়। সার্ভিসের "AVERAGE TIME" এ আনুমানিক সময় দেখতে পাবেন।\nযা দেখে নিন:\n• লিংক পাবলিক আছে কিনা\n• অর্ডারের স্ট্যাটাস PENDING নাকি PROCESSING\n• একই লিংকে আগের অর্ডার চলছে কিনা (শেষ না হওয়া পর্যন্ত নতুন অর্ডার দেবেন না)\nতবুও না এলে অর্ডার নম্বরসহ টিকেট দিন।',a:[T]},
  {k:['ডিপোজিট','deposit','ফান্ড','fund','টাকা যোগ','টাকা অ্যাড','পেমেন্ট','payment','বিকাশ','bkash','নগদ','nagad','রকেট','rocket','add fund','trxid','ট্রানজেকশন','trx','টাকা পাঠালাম','টাকা পাঠিয়েছি','টাকা আসেনি','টাকা আসে নাই','ব্যালেন্স আসেনি','ব্যালেন্স যোগ হয়নি','taka pathai','pathaisi','pathaise','ashe nai','asheni','asenai','ase nai','balance ashe','balance asheni','taka dilam'],
   t:`💳 ডিপোজিট করার নিয়ম:\n১) Funds পেজে যান\n২) পেমেন্ট মেথড বেছে নিন${m?` (${m})`:''}\n৩) দেখানো নাম্বারে Send Money করুন (ন্যূনতম ৳${S_.minDeposit||10})\n৪) টাকার পরিমাণ, আপনার নাম্বার ও TrxID দিয়ে সাবমিট করুন\n${S_.autoDepOn||S_.bkAutoOn?'অটো পেমেন্ট চালু থাকলে TrxID মিলে গেলে সাথে সাথে ব্যালেন্স যোগ হয়ে যায়।':'অ্যাডমিন যাচাই করলে ব্যালেন্সে যোগ হবে।'}\n\nটাকা পাঠিয়ে ব্যালেন্স না এলে: TrxID ঠিক আছে কিনা দেখুন, ১০-৩০ মিনিট অপেক্ষা করুন, তবুও না এলে TrxID ও স্ক্রিনশটসহ টিকেট দিন।`+SAFE_T,a:[['Funds পেজে যান','funds'],T]},
  {k:['রিফান্ড','refund','ফেরত','টাকা কেটে','টাকা কাটা','টাকা কেটেছে','ক্যান্সেল','cancel করব','বাতিল করব','অর্ডার বাতিল'],
   t:'↩ রিফান্ড/বাতিল:\n• অর্ডার ব্যর্থ বা বাতিল হলে টাকা নিজে থেকেই ব্যালেন্সে ফিরে আসে\n• PENDING/PROCESSING অর্ডার বাতিল চাইলে অর্ডার কার্ডের "বাতিলের অনুরোধ" বা Settings → "রিফান্ড ক্লেইম" থেকে অনুরোধ দিন; যাচাই হলে টাকা ফেরত আসবে\n• যে অংশ আগেই সম্পন্ন হয়ে গেছে তার টাকা ফেরত হয় না',a:[['রিফান্ড ক্লেইম','refund']]},
  {k:['রিফিল','refill','ড্রপ','drop','কমে গেছে','কমে গেল','কমে যাচ্ছে','কমে যায়','কমছে','নেমে গেছে'],
   t:'♻ রিফিল:\n• "♻ রিফিল গ্যারান্টি" ব্যাজ থাকা সার্ভিসে সংখ্যা কমে গেলে ফ্রি রিফিল পাবেন\n• অর্ডার COMPLETED হলে অর্ডার কার্ডে "♻ রিফিল চান" বাটন আসে—চাপলেই রিকোয়েস্ট সরাসরি চলে যায়\n• সার্ভিসের রিফিল মেয়াদ (যেমন ৩০ দিন) শেষ হলে রিফিল পাওয়া যায় না\n• রিফিল না থাকা সার্ভিসে Settings → "রিফিল রিকোয়েস্ট" দিলে অ্যাডমিন দেখবে।',a:[['রিফিল রিকোয়েস্ট','refill']]},
  {k:['রেফার','refer','কমিশন','commission','টিম','invite','ইনভাইট','বন্ধুকে','বন্ধু'],
   t:`🤝 রেফার: Commission পেজ থেকে নিজের রেফারেল লিংক নিন। বন্ধু আপনার লিংকে জয়েন করে ডিপোজিট করলে আপনি ${S_.refPercent||0}% কমিশন পাবেন, যা সরাসরি ব্যালেন্সে জমা হয়। আপনার রেফার ইনকাম: ${tk((S.me||{}).refEarned)}, টিম: ${(S.team||[]).length} জন।`,a:[['Commission পেজ','ref']]},
  {k:['xp','এক্সপি','পয়েন্ট','point'],
   t:`⭐ XP: অর্ডার ও ডিপোজিট করলে XP জমে। ${+S_.xpPerBdt?`${S_.xpPerBdt} XP = ৳1 হিসেবে Settings → "XP কনভার্ট" থেকে ব্যালেন্সে নিতে পারবেন।`:'XP কনভার্ট এখন চালু নেই।'}\nআপনার XP: ${(S.me||{}).xp||0}`},
  {k:['লেভেল','level','ডিসকাউন্ট','discount','vip','ভিআইপি','র‍্যাংক','rank'],
   t:`👑 মোট খরচ বাড়লে লেভেল বাড়ে ও প্রতি অর্ডারে ডিসকাউন্ট পান। বর্তমান ডিসকাউন্ট: ${typeof disc=='function'?disc():0}%।${lv?'\n\nলেভেল তালিকা:\n'+lv:''}\nSettings → "ভিআইপি লেভেল" এ বিস্তারিত দেখুন।`},
  {k:['লিডারবোর্ড','leaderboard','র‍্যাঙ্কিং','সেরা','top user'],
   t:'🏆 Settings → "লিডারবোর্ড" এ সেরা ইউজারদের তালিকা দেখতে পাবেন। বেশি অর্ডার করলে ওপরে ওঠা যায়, আর কিছু সময়ে পুরস্কারও থাকে।'},
  {k:['মিশন','mission','চ্যালেঞ্জ','challenge','টাস্ক','task','বোনাস','bonus','ডেইলি','daily'],
   t:'🎯 Settings → "মিশন" এ প্রতিদিনের/সাপ্তাহিক কাজ থাকে—সম্পন্ন করলে বোনাস বা XP পাবেন। প্রমো কোড থাকলে Funds বা প্রোফাইল অংশে বসাতে পারেন।'},
  {k:['ট্রান্সফার','transfer','ব্যালেন্স পাঠা','টাকা পাঠা','অন্যকে টাকা'],
   t:'🔁 ব্যালেন্স ট্রান্সফার চালু থাকলে Settings এ "ব্যালেন্স ট্রান্সফার" অপশন দেখাবে (ফি থাকতে পারে)। না দেখালে এটা এখন বন্ধ আছে।'},
  {k:['api','এপিআই','নিজের প্যানেল','panel বানা','রিসেলার প্যানেল'],
   t:'🔌 নিজের প্যানেল/বটে আমাদের সার্ভিস ব্যবহার করতে Settings → "API" থেকে আপনার API কী নিন। কী কাউকে দেবেন না—এটা আপনার ব্যালেন্সের চাবি।'+SAFE_T},
  {k:['রিসেলার','reseller','বট বানা','নিজের বট','bot বানা','বট তৈরি','নিজের বট'],
   t:'🤖 নিজের রিসেলার বট বানাতে: Settings → "রিসেলার বট তৈরি করুন" → @BotFather থেকে নতুন বট বানিয়ে টোকেন দিন। নিজের বটে নিজের দাম, ব্যানার, নোটিশ ও পেমেন্ট মেথড সেট করে ব্যবসা করা যায়।\nবট চালু থাকতে আপনার মূল অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স রাখতে হয়—না থাকলে কাস্টমারদের অর্ডার আটকে থাকবে।'},
  {k:['পাসওয়ার্ড','password','পাসওয়ার্ড ভুলে','লগইন','login','লগিন','সাইন ইন','ঢুকতে পারছি না','অ্যাকাউন্ট খুলতে'],
   t:'🔐 পাসওয়ার্ড বদলাতে Settings → "পাসওয়ার্ড পরিবর্তন"। ভুলে গেলে লগইন পেজে "পাসওয়ার্ড ভুলে গেছি" দিন—ইমেইলে রিসেট লিংক যাবে।'+SAFE_T},
  {k:['ভাষা','language','english','ইংরেজি','বাংলা','dark','ডার্ক','মোড','theme','থিম'],
   t:'🌗 Settings এ "ডার্ক মোড" ও "Switch to English" বাটন আছে—সেখান থেকে থিম ও ভাষা বদলাতে পারবেন।'},
  {k:['ব্লক','block','ban','ব্যান','সাসপেন্ড','suspend','অ্যাকাউন্ট বন্ধ'],
   t:'🚫 অ্যাকাউন্ট ব্লক হলে সাধারণত নিয়ম ভাঙার কারণে হয়। ভুলবশত হলে টিকেটে আপনার ইউজার নাম লিখে জানান, অ্যাডমিন যাচাই করবে।',a:[T,SP]},
  {k:['সুরক্ষিত','নিরাপদ','safe','secure','নিরাপত্তা','scam','প্রতারণা','ভরসা','trusted','বিশ্বস্ত','ফেক','fake'],
   t:'🛡 আপনার তথ্য ও ব্যালেন্স অ্যাকাউন্টে সুরক্ষিত থাকে। আমরা কখনো পাসওয়ার্ড/OTP চাই না। সন্দেহজনক কেউ টাকা চাইলে বিশ্বাস করবেন না—শুধু অ্যাপের Funds পেজ থেকে ডিপোজিট করুন।'},
  {k:['একই লিংকে','একই লিঙ্কে','দুইবার অর্ডার','আবার অর্ডার','দুটো অর্ডার','duplicate'],
   t:'⚠️ একই লিংকে আগের অর্ডার শেষ না হওয়া পর্যন্ত নতুন অর্ডার দেবেন না—দুটো মিলে গিয়ে সংখ্যা ঠিকমতো না বাড়তে পারে। আগেরটা COMPLETED হলে তারপর দিন।'},
  {k:['অর্ডার বদলা','এডিট','edit','ঠিকানা বদলা','লিংক বদলা','পরিমাণ বদলা','ভুল অর্ডার'],
   t:'✏️ অর্ডার একবার জমা হলে লিংক বা পরিমাণ বদলানো যায় না। ভুল হলে PENDING থাকা অবস্থায় বাতিলের অনুরোধ দিন, তারপর সঠিক তথ্য দিয়ে নতুন অর্ডার করুন।',a:[['রিফান্ড ক্লেইম','refund']]},
  {k:['টিউটোরিয়াল','tutorial','ভিডিও','কীভাবে ব্যবহার','কিভাবে ব্যবহার','গাইড','guide','শিখব','শেখা'],
   t:'🎬 Settings → "টিউটোরিয়াল" এ ব্যবহারের গাইড আছে।'+(S_.tutorialLink?'':'\nসরাসরি কিছু জানতে এখানেই প্রশ্ন করুন।')},
  {k:['আপনি কে','তুমি কে','কে তুমি','who are you','তুমি কি','কী করতে পারো','কি করতে পারো','কী পারো','হেল্প','help','সাহায্য','কী জিজ্ঞেস','মেনু'],
   t:'🤖 আমি এই বটের সাপোর্ট সহকারী। আমি বলতে পারি: অর্ডার করার নিয়ম, সার্ভিসের মানে, দাম ও ডিসকাউন্ট, ডিপোজিট, রিফান্ড, রিফিল, রেফার, XP/লেভেল, API, রিসেলার বট—এবং আপনার নিজের ব্যালেন্স ও অর্ডারের অবস্থা।\nনিচের বোতাম থেকে বা সরাসরি লিখে জিজ্ঞেস করুন।'},
  {k:['সাপোর্ট','support','যোগাযোগ','এডমিনের সাথে','অ্যাডমিনের সাথে','কথা বলতে','মানুষ','হিউম্যান','অভিযোগ','complain','কমপ্লেইন','সমস্যা','problem','টিকেট','ticket'],
   t:'🆘 আপনার সমস্যা টিকেট আকারে জানান—অ্যাডমিন উত্তর দিলে আপনার বটে সাথে সাথে মেসেজ আসবে। জরুরি হলে লাইভ সাপোর্টে যোগাযোগ করুন।',a:[T,SP]}
  ];
}
function botAnswer(raw){
  const q=String(raw||'').toLowerCase().replace(/[০-৯]/g,d=>'০১২৩৪৫৬৭৮৯'.indexOf(d)).replace(/[?!।,.:;]/g,' ').replace(/\s+/g,' ').trim();
  const me=S.me||{};
  const A_T=['টিকেট খুলুন','ticket'],A_S=['লাইভ সাপোর্ট','support'];
  for(const f of (S.set.faq||[])){if((f.k||[]).some(k=>k&&q.includes(String(k).toLowerCase())))return{t:f.a,a:[]}}
  if(!q)return{t:'আপনার প্রশ্নটি লিখুন।',a:[]};
  const nm=q.match(/(\S+?)(?:ের|এর|er)\s+(?:ব্যালেন্স|balance|বালেন্স)/);
  if(PRIV.some(r=>r.test(raw)||r.test(q))||(nm&&!/(অ্যাকাউন্ট|একাউন্ট|ওয়ালেট|account|wallet|নিজ|আমার|আমি|আপনার|my)/.test(nm[1])))return{t:PRIV_R,a:[A_T]};
  if(has(q,['hi','hello','হ্যালো','হাই','সালাম','assalamu','হেলো'])&&q.length<25)return{t:`হ্যালো ${me.name||''}! 👋 আমি আপনার সাপোর্ট সহকারী। অর্ডার, ডিপোজিট, রিফিল, রেফার—যা জানতে চান লিখুন বা নিচের বোতাম চাপুন।`,a:[]};
  if(has(q,['ধন্যবাদ','thanks','thank','শুকরিয়া','জাযাকাল্লাহ']))return{t:'আপনাকেও ধন্যবাদ! আর কিছু জানার থাকলে জিজ্ঞেস করুন। 😊',a:[]};
  /* আপনার নিজের তথ্য */
  const num=(q.match(/(?:^|\D)(\d{3,})(?:\D|$)/)||[])[1];
  if(num){const o=S.orders.find(x=>String(x.orderNo)==num||String(x.origNo||'')==num);
    if(o)return{t:`অর্ডার #${o.orderNo}\n${o.serviceName}\nপরিমাণ: ${o.quantity} • চার্জ: ${tk(o.charge)}\nস্ট্যাটাস: ${String(o.status).toUpperCase()}${o.status=='completed'?'\n\nসংখ্যা কমে গেলে (রিফিল থাকলে) অর্ডার কার্ড থেকে রিফিল চান।':''}`,a:o.status=='completed'||o.status=='partial'?[['রিফিল রিকোয়েস্ট','refill']]:o.status=='pending'||o.status=='processing'?[['রিফান্ড ক্লেইম','refund']]:[]};
    if(/^#?\s*\d+$/.test(q)||has(q,['অর্ডার','order']))return{t:`#${num} নম্বরের কোনো অর্ডার আপনার অ্যাকাউন্টে পাইনি। নম্বরটা ঠিক আছে কিনা দেখুন—শুধু নিজের অর্ডারই আমি দেখাতে পারি।`,a:[]}}
  if(has(q,['আমার ব্যালেন্স','আমার balance','ব্যালেন্স কত','balance koto','কত টাকা আছে','বালেন্স','blance','my balance']))return{t:`আপনার বর্তমান ব্যালেন্স ${tk(me.balance)}।\nমোট ডিপোজিট ${tk(me.totalDeposit)}, মোট খরচ ${tk(me.totalSpent)}।`,a:[['ফান্ড অ্যাড করুন','funds']]};
  if(has(q,['আমার অর্ডার','my order','সর্বশেষ অর্ডার','অর্ডার স্ট্যাটাস','আমার সব অর্ডার','অর্ডার কোথায়'])){const l=S.orders.slice(0,3);return{t:l.length?'আপনার সর্বশেষ অর্ডার:\n'+l.map(o=>`#${o.orderNo} • ${o.serviceName.slice(0,32)} • ${String(o.status).toUpperCase()}`).join('\n')+'\n\nনির্দিষ্ট অর্ডারের নম্বর লিখলে বিস্তারিত বলতে পারব।':'আপনি এখনো কোনো অর্ডার করেননি।',a:[['সব অর্ডার','orders']]}}
  /* জ্ঞানভান্ডার: সবচেয়ে মিলে যাওয়া উত্তর */
  let best=null,bs=0;
  for(const e of kbList()){let sc=0;for(const k of e.k){if(q.includes(k.trim().toLowerCase()))sc+=k.trim().length}if(sc>bs){bs=sc;best=e}}
  if(best&&bs>=3){let t=typeof best.t=='function'?best.t():best.t;return{t,a:best.a||[]}}
  return{t:'দুঃখিত, প্রশ্নটা পুরোপুরি বুঝতে পারিনি। 🙏 নিচের বিষয়গুলো চেষ্টা করুন—যেমন "কীভাবে অর্ডার করব", "ডিপোজিট", "রিফিল", "রেফার", "সার্ভিসের নামের মানে কী"—অথবা টিকেট খুলে অ্যাডমিনকে জানান।',a:[A_T,A_S]};
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
