/* ===== admin2: নতুন পেজ — সুরক্ষা ও লগ, নতুন ফিচার সেটিং ===== */
const A=()=>window.__A,$=s=>document.querySelector(s);
const ago=t=>{if(!t)return'';const m=Math.max(0,(Date.now()/1000-t)/60|0);return m<1?'এইমাত্র':m<60?m+' মি আগে':m<1440?(m/60|0)+' ঘ আগে':(m/1440|0)+' দিন আগে'};

/* ---------- 🛡 সুরক্ষা ও লগ ---------- */
window.__X.ops=function(){
  const {esc,tk}=A(),el=$('#v-ops');if(el._on)return;el._on=true;
  el.innerHTML=`<h2 class="t">🛡 সুরক্ষা ও লগ</h2>
  <div class="card"><h2 class="t sub">🐞 এরর লগ <span><button class="btn s gr" id="oEr">রিফ্রেশ</button> <button class="btn s r" id="oEc">সব মুছুন</button></span></h2><div id="oErL" class="empty">লোড হচ্ছে...</div><small class="mu">একই এরর বারবার হলে একবারই দেখায় (×সংখ্যা)। ১৪ দিন পর নিজে মুছে যায়। টেলিগ্রামে /errors লিখলেও দেখা যায়।</small></div>
  <div class="card"><h2 class="t sub">🔎 ইউজারের ব্যালেন্স ইতিহাস</h2><div style="display:flex;gap:8px"><input id="ubQ" placeholder="ইউজার আইডি / টেলিগ্রাম আইডি / নাম" style="flex:1"><button class="btn s" id="ubG">দেখুন</button></div><div id="ubL" class="empty" style="margin-top:10px">কারও ব্যালেন্স কেন বাড়ল দেখতে নাম/আইডি দিন</div></div>
  <div class="card"><h2 class="t sub">📈 সাম্প্রতিক ব্যালেন্স বৃদ্ধি <span><button class="btn s gr" id="bfA">সব</button> <button class="btn s r" id="bfU">শুধু অজানা</button></span></h2><div id="bfL" class="empty">“সব” বা “শুধু অজানা” চাপুন। বট প্রতি ১.৫ মিনিটে সবার ব্যালেন্স মিলিয়ে দেখে।</div></div>
  <div class="card"><h2 class="t sub">🧮 ব্যালেন্স অডিট <button class="btn s gr" id="oAu">চালান</button></h2><div id="oAuL" class="empty">“চালান” চাপুন</div></div>
  <div class="card"><h2 class="t sub">📱 একই ডিভাইস/আইপিতে একাধিক অ্যাকাউন্ট <button class="btn s gr" id="oDv">দেখুন</button></h2><div id="oDvL" class="empty">“দেখুন” চাপুন</div><small class="mu">মোবাইল নেটওয়ার্কে অনেকে একই আইপি শেয়ার করে, তাই এটা শুধু সন্দেহের ইঙ্গিত — সরাসরি ব্যান করার আগে যাচাই করুন।</small></div>`;
  const er=async()=>{const j=await A().srv('/adm/errors',{}).catch(()=>({error:1}));const b=$('#oErL');if(j.error){b.textContent='লোড হয়নি';return}
    b.className='';b.innerHTML=(j.items||[]).map(x=>`<div class="lr ${x.lvl=='ERROR'||x.lvl=='CRITICAL'?'bad':'warn'}"><div><b>${esc(x.lvl)}</b> ×${x.n} <small>${ago(x.t)}</small></div><code>${esc(x.msg.slice(0,300))}</code></div>`).join('')||'<div class="empty">✅ কোনো এরর নেই</div>'};
  $('#oEr').onclick=er;$('#oEc').onclick=async()=>{if(!confirm('সব এরর লগ মুছবেন?'))return;await A().srv('/adm/errors',{op:'clear'});er()};er();
  $('#oAu').onclick=async()=>{const b=$('#oAuL');b.textContent='হিসাব হচ্ছে...';const j=await A().srv('/adm/audit',{}).catch(()=>({error:1}));if(j.error){b.textContent='লোড হয়নি';return}
    b.className='';b.innerHTML=`<div class="stats" style="margin-bottom:10px"><div class="sc" style="background:#1e88e5"><small>ইউজারদের মোট ব্যালেন্স</small><b>${tk(j.totalBalance)}</b></div><div class="sc" style="background:#16a34a"><small>মোট ডিপোজিট</small><b>${tk(j.totalDeposit)}</b></div></div>`+
      `<h3 class="h3">🔴 নেগেটিভ ব্যালেন্স (${j.negative.length})</h3>`+(j.negative.map(u=>`<div class="lr bad"><div>${esc(u.name)} <small>${esc(u.id)}</small></div><b>${tk(u.balance)}</b></div>`).join('')||'<div class="empty" style="padding:8px">নেই ✅</div>')+
      `<h3 class="h3">🟠 অস্বাভাবিক বেশি ব্যালেন্স (${j.odd.length})</h3>`+(j.odd.map(u=>`<div class="lr warn"><div>${esc(u.name)} <small>${esc(u.id)}</small><br><small>উৎস ≈ ${tk(u.src)}</small></div><b>${tk(u.balance)}</b></div>`).join('')||'<div class="empty" style="padding:8px">নেই ✅</div>')+`<small class="mu">${esc(j.note||'')}</small>`};
  const dt=t=>t?new Date(t*1000).toLocaleString('bn-BD',{timeZone:'Asia/Dhaka',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}):'';
  const lg=x=>`<div class="lr ${x.unk?'bad':''}"><div>${x.name!==undefined?esc(x.name)+' <small>'+esc(x.uid)+'</small><br>':''}<small>${dt(x.t)}</small> ${x.unk?'<b style="color:#dc2626">⚠ কারণ অজানা</b>':''}<br><small>${(x.why||[]).map(esc).join(' • ')}</small></div><b style="color:${x.d>0?'#16a34a':'#dc2626'}">${x.d>0?'+':''}${tk(x.d)}</b></div>`;
  const bf=async unk=>{const b=$('#bfL');b.textContent='লোড হচ্ছে...';const j=await A().srv('/adm/balfeed',{unk}).catch(()=>({error:1}));if(j.error){b.textContent='লোড হয়নি';return}
    b.className='';b.innerHTML=(j.items.length?j.items.map(lg).join(''):'কিছু পাওয়া যায়নি (নজরদারি চলছে: '+j.watching+' ইউজার)')};
  $('#bfA').onclick=()=>bf(false);$('#bfU').onclick=()=>bf(true);
  $('#ubG').onclick=async()=>{const b=$('#ubL');b.textContent='খোঁজা হচ্ছে...';const j=await A().srv('/adm/ubal',{q:$('#ubQ').value}).catch(e=>({error:e.message||'লোড হয়নি'}));if(j.error){b.textContent=j.error;return}
    const u=j.user;b.className='';b.innerHTML=`<div class="lr"><div><b>${esc(u.name)}</b> <small>${esc(u.id)}</small><br><small>মোট ডিপোজিট ${tk(u.totalDeposit)} • খরচ ${tk(u.totalSpent)} • রেফার ${tk(u.refEarned)} • প্রমো ${tk(u.promoBonus)}</small></div><b>${tk(u.balance)}</b></div>`+
    `<h3 class="h3">📈 ব্যালেন্স পরিবর্তন (বট ধরেছে)</h3>`+(j.log.map(lg).join('')||'<div class="empty">এখনো কিছু নেই</div>')+
    `<h3 class="h3">💳 ডিপোজিট</h3>`+(j.deposits.map(d=>`<div class="lr ${d.flag?'warn':''}"><div><small>${dt(d.t)}</small> ${esc(d.status)} ${d.auto?'⚡অটো':''} ${d.flag?'⚠':''}<br><small>${esc(d.trx||'')}${d.bonus?' • বোনাস '+d.bonus:''}</small></div><b>${tk(d.amount)}</b></div>`).join('')||'<div class="empty">নেই</div>')+
    `<h3 class="h3">📒 লেজার</h3>`+(j.ledger.map(l=>`<div class="lr"><div><small>${dt(l.t)}</small> ${esc(l.type)}<br><small>${esc(l.note||'')}</small></div><b>${tk(l.amount)}</b></div>`).join('')||'<div class="empty">নেই</div>')+
    `<h3 class="h3">🧾 অর্ডার</h3>`+(j.orders.map(o=>`<div class="lr"><div><small>${dt(o.t)}</small> #${esc(o.no)} ${esc(o.status)} ${o.refunded?'↩ রিফান্ডেড':''}</div><b>${tk(o.charge)}</b></div>`).join('')||'<div class="empty">নেই</div>')};
  $('#oDv').onclick=async()=>{const b=$('#oDvL');b.textContent='লোড হচ্ছে...';const j=await A().srv('/adm/suspects-more',{}).catch(()=>({error:1}));if(j.error){b.textContent='লোড হয়নি';return}
    b.className='';b.innerHTML=(j.devices||[]).map(d=>`<div class="lr warn" style="display:block"><b>${d.users.length} অ্যাকাউন্ট</b> <small>${esc(d.ip||'')}</small><br>${d.users.map(u=>`<span class="chip">${esc(u.name)}${u.banned?' 🚫':''}</span>`).join('')}</div>`).join('')||'<div class="empty">কোনো সন্দেহজনক ডিভাইস নেই ✅</div>'};
};

/* ---------- ✨ নতুন ফিচার সেটিং ---------- */
window.__X.feat=function(){
  const {esc,toast,dbw,S}=A(),el=$('#v-feat');if(el._on)return;el._on=true;const s=S.set||{};
  const ck=(id,v,t,h)=>`<label class="ck"><input type="checkbox" id="${id}" ${v?'checked':''}><span><b>${t}</b>${h?`<small>${h}</small>`:''}</span></label>`;
  const nm=(id,v,t,h,st='1')=>`<div><label>${t}</label><input id="${id}" type="number" min="0" step="${st}" value="${v??''}">${h?`<small class="mu">${h}</small>`:''}</div>`;
  el.innerHTML=`<h2 class="t">✨ নতুন ফিচার সেটিং <button class="btn" id="fSave">💾 সব সেভ করুন</button></h2>
  <div class="card"><h2 class="t sub">🛡 অর্ডার সুরক্ষা</h2>
   ${ck('fRef',s.autoRefundFail!==false,'প্রোভাইডার রিজেক্ট করলে অটো রিফান্ড','প্রোভাইডার অর্ডার ফিরিয়ে দিলে ইউজার নিজে থেকে টাকা ফেরত পাবে')}
   <small class="mu">ℹ️ একই লিংকে বারবার অর্ডার চলবে, তবে আগের অর্ডার শেষ না হলে নতুনটা যাবে না — এটা “টুলস → অর্ডার সুরক্ষা” এর প্রথম টিকবক্সে চালু/বন্ধ হয়।</small>
   ${ck('fLive',s.linkLive!==false,'লিংক জীবিত কিনা চেক','YouTube/TikTok ভিডিও লিংক মরা (ডিলিটেড) হলে অর্ডার আটকাবে। চেক না হলে অর্ডার যেতে দেয়')}
   <div class="fg">${nm('fNo',s.newUserOrders??3,'নতুন ইউজার (প্রথম কয়টা অর্ডার)','এই কয়টা অর্ডার পর্যন্ত নিচের সীমা খাটবে')}
   ${nm('fNc',s.newUserCap??0,'নতুন ইউজারের সর্বোচ্চ অর্ডার মূল্য (৳)','০ = সীমা নেই। বড় অর্ডার আটকে অ্যাডমিনকে জানায়','0.01')}</div></div>
  <div class="card"><h2 class="t sub">🔥 ফ্ল্যাশ সেল স্টক</h2><div class="fg">${nm('fFl',s.flashLeft,'ফ্ল্যাশ সেলে বাকি অর্ডার সংখ্যা','ফাঁকা = সীমাহীন। প্রতি অর্ডারে ১ কমে, ০ হলে ছাড় বন্ধ। ইউজার “শেষ N টা” দেখবে')}</div></div>
  <div class="card"><h2 class="t sub">💰 মাসিক ক্যাশব্যাক</h2><div class="fg">${nm('fCb',s.cashbackPct??0,'ক্যাশব্যাক (%)','০ = বন্ধ। প্রতি মাসের ১ তারিখে গত মাসের খরচের উপর','0.1')}${nm('fCm',s.cashbackMin??5000,'ন্যূনতম মাসিক খরচ (৳)','এর কম খরচ করলে ক্যাশব্যাক নেই')}</div></div>
  <div class="card"><h2 class="t sub">💸 ব্যালেন্স ট্রান্সফার</h2>${ck('fTr',!!s.transferOn,'ট্রান্সফার চালু','মূল বটের ইউজাররা একে অপরকে টাকা পাঠাতে পারবে (ফি আপনার)')}
   <div class="fg">${nm('fTf',s.transferFeePct??2,'ফি (%)','','0.1')}${nm('fTm',s.transferMin??10,'ন্যূনতম পরিমাণ (৳)')}${nm('fTd',s.transferNeedDep??50,'পাঠাতে মোট ডিপোজিট লাগবে (৳)','ফ্রড ঠেকাতে')}${nm('fTx',s.transferDailyMax??5000,'দৈনিক সর্বোচ্চ (৳)')}</div></div>
  <div class="card"><h2 class="t sub">🎫 টিকেট অটো-রিপ্লাই</h2><label>অটো উত্তর (প্রতি লাইনে: কীওয়ার্ড১,কীওয়ার্ড২|উত্তর)</label><textarea id="fFq" rows="5" placeholder="refund,টাকা ফেরত|রিফান্ড ২৪ ঘণ্টার মধ্যে ব্যালেন্সে যোগ হয়।&#10;slow,দেরি|অর্ডার শুরু হতে ১-২ ঘণ্টা লাগতে পারে।">${esc(s.faqAuto||'')}</textarea>
   <label>কীওয়ার্ড না মিললে যে উত্তর যাবে ({ticketEta} ব্যবহার করা যায়)</label><input id="fEt" value="${esc(s.ticketEta||'')}" placeholder="যেমন: ২৪ ঘণ্টার মধ্যে উত্তর পাবেন"></div>
  <div class="card"><h2 class="t sub">⚡ bKash অটো গেটওয়ে (মার্চেন্ট API)</h2>${ck('fBk',!!s.bkAutoOn,'অটো ডিপোজিট চালু','ডিপোজিট পেজে “⚡ অটো” ও “✋ ম্যানুয়াল” দুটো ট্যাব থাকবে। আগে নিচের তথ্য সেভ করে “সংযোগ টেস্ট” দিন')}
   <label>মোড</label><select id="fBm"><option value="sandbox" ${(s.bkGw||{}).mode!='live'?'selected':''}>Sandbox (টেস্ট, আসল টাকা কাটে না)</option><option value="live" ${(s.bkGw||{}).mode=='live'?'selected':''}>Live (আসল)</option></select>
   <div class="fg"><div><label>App Key</label><input id="fBa" value="${esc((s.bkGw||{}).appKey||'')}"></div><div><label>App Secret</label><input id="fBs" type="password" value="${esc((s.bkGw||{}).appSecret||'')}"></div>
   <div><label>Username</label><input id="fBu" value="${esc((s.bkGw||{}).user||'')}"></div><div><label>Password</label><input id="fBp" type="password" value="${esc((s.bkGw||{}).pass||'')}"></div>
   ${nm('fBx',(s.bkGw||{}).max||30000,'সর্বোচ্চ ডিপোজিট (৳)')}</div>
   <button class="btn s gr" id="fBtest" style="margin-top:10px">🔌 সংযোগ টেস্ট</button><div id="fBres" class="mu"></div></div>
  <div class="card"><h2 class="t sub">🎯 সাপ্তাহিক চ্যালেঞ্জ</h2>${ck('fCh',!!s.chalOn,'চ্যালেঞ্জ চালু','ইউজার হোমে প্রোগ্রেস বার দেখবে; শেষ হলে “পুরস্কার নিন” বাটন। সপ্তাহ শুরু সোমবার (বাংলাদেশ সময়)')}
   <div class="fg">${nm('fCo',s.chalOrders??5,'সপ্তাহে কয়টা অর্ডার দিলে পুরস্কার','বাতিল অর্ডার গোনা হয় না')}${nm('fCp',s.chalPrize??10,'পুরস্কার (৳)','','0.01')}</div></div>
  <div class="card"><h2 class="t sub">🏆 আজকের সেরা ক্রেতা (অটো পোস্ট)</h2>${ck('fBb',!!s.bestBuyerOn,'প্রতিদিন রাত ৯টায় পোস্ট','সেরা ৩ জনের নাম আংশিক ঢেকে (R***m) ও খরচ পোস্ট হবে')}
   <label>চ্যানেল/গ্রুপ (@username বা -100… আইডি)</label><input id="fBc" value="${esc(s.bestBuyerChat||'')}" placeholder="@mychannel"><small class="mu">বটকে ওই চ্যানেল/গ্রুপে অবশ্যই অ্যাডমিন বানাতে হবে।</small>
   <button class="btn s gr" id="fBt" style="margin-top:8px">এখনই টেস্ট পোস্ট করুন</button></div>
  <div class="card"><h2 class="t sub">🖼 অর্ডার সম্পন্নের ছবি কার্ড</h2>${ck('fDc',s.doneCard!==false,'সম্পন্ন হলে ইউজারকে ছবিসহ নোটিফিকেশন','সার্ভারে pillow ইনস্টল থাকতে হবে (requirements.txt এ আছে); না থাকলে সাধারণ মেসেজ যায়')}</div>
  <div class="card"><h2 class="t sub">📊 রিপোর্ট</h2>${ck('fDr',s.dailyReport!==false,'দৈনিক লাভ রিপোর্ট','প্রতিদিন রাত ১১:৫০ এ অ্যাডমিনদের টেলিগ্রামে আজকের বিক্রি, খরচ ও লাভ')}</div>`;
  $('#fBt').onclick=async()=>{try{const r=await A().srv('/adm/bb-test',{});toast(r.error||'✅ পোস্ট হয়েছে','ok')}catch(e){toast(e.message,'er')}};
  $('#fBtest').onclick=async()=>{const b=$('#fBres');b.textContent='টেস্ট হচ্ছে... (আগে “সব সেভ করুন” চেপে নিন)';try{const r=await A().srv('/adm/bk-test',{});b.innerHTML=r.error?'❌ '+esc(r.error):'✅ সংযোগ ঠিক আছে ('+esc(r.mode)+')<br>bKash কে এই Callback URL দিন: <b style="word-break:break-all">'+esc(r.callback)+'</b>'}catch(e){b.textContent='❌ '+e.message}};
  $('#fSave').onclick=async()=>{const n=id=>{const v=$(id).value.trim();return v===''?null:+v};
    const v={autoRefundFail:$('#fRef').checked,linkLive:$('#fLive').checked,newUserOrders:n('#fNo')??3,newUserCap:n('#fNc')||0,flashLeft:n('#fFl'),cashbackPct:n('#fCb')||0,cashbackMin:n('#fCm')??5000,
      transferOn:$('#fTr').checked,transferFeePct:n('#fTf')??2,transferMin:n('#fTm')??10,transferNeedDep:n('#fTd')??50,transferDailyMax:n('#fTx')??5000,faqAuto:$('#fFq').value.trim(),ticketEta:$('#fEt').value.trim(),dailyReport:$('#fDr').checked,chalOn:$('#fCh').checked,chalOrders:n('#fCo')??5,chalPrize:n('#fCp')??10,bestBuyerOn:$('#fBb').checked,bestBuyerChat:$('#fBc').value.trim(),doneCard:$('#fDc').checked,bkAutoOn:$('#fBk').checked,bkGw:{mode:$('#fBm').value,appKey:$('#fBa').value.trim(),appSecret:$('#fBs').value.trim(),user:$('#fBu').value.trim(),pass:$('#fBp').value.trim(),max:n('#fBx')||30000}};
    try{await dbw('set','settings','main',v,true);Object.assign(S.set,v);toast('✅ সেভ হয়েছে','ok')}catch(e){toast(e.message,'er')}};
};

/* ---------- 🏆 রিসেলার র‍্যাংক ও পুরস্কার (পুরস্কার শুধু এখানে, রিসেলাররা দেখে না) ---------- */
window.__X.rbr=function(){
  const {esc,tk,toast,srv}=A(),el=$('#v-rbr');if(!el._on){el._on=true;el.innerHTML='<h2 class="t">🏆 রিসেলার র‍্যাংক ও পুরস্কার</h2><div class="card"><div style="display:flex;gap:8px;align-items:center;margin-bottom:12px"><label style="margin:0">মাস</label><input id="rkYm" type="month" style="max-width:190px"><button class="btn s" id="rkGo">দেখুন</button></div><div id="rkL" class="empty">লোড হচ্ছে...</div><small class="mu">পুরস্কার দিলে রিসেলারের মূল ব্যালেন্সে টাকা যোগ হয় ও টেলিগ্রামে অভিনন্দন যায়। রিসেলাররা শুধু নিজের র‍্যাংক দেখে, পুরস্কারের পরিমাণ দেখে না।</small></div>';
    const ld=async()=>{const ym=($('#rkYm').value||'').replace('-','');const j=await srv('/adm/rb-rank',{ym}).catch(()=>({error:1}));const b=$('#rkL');if(j.error){b.textContent='লোড হয়নি';return}
      b.className='';b.innerHTML=(j.items||[]).map(x=>`<div class="lr" style="align-items:center"><div><b>${['🥇','🥈','🥉'][x.rank-1]||'#'+x.rank} ${esc(x.username?'@'+x.username:x.name||x.botId)}</b><br><small>${x.orders} অর্ডার • বিক্রি ${tk(x.sales)} • লাভ ${tk(x.profit)}${x.awarded?' • 🎁 পুরস্কার দেওয়া '+tk(x.awarded):''}</small></div><button class="btn s" data-b="${esc(x.botId)}">🎁 পুরস্কার</button></div>`).join('')||'<div class="empty">এই মাসে কোনো অর্ডার নেই</div>';
      b.querySelectorAll('[data-b]').forEach(e=>e.onclick=async()=>{const a=prompt('কত টাকা পুরস্কার দেবেন?');if(!a)return;const note=prompt('নোট (ঐচ্ছিক, রিসেলার দেখবে)')||'';const r=await srv('/adm/rb-award',{botId:e.dataset.b,amount:a,note});r.error?toast(r.error,'er'):(toast('✅ পুরস্কার দেওয়া হয়েছে','ok'),ld())})};
    $('#rkYm').value=new Date().toISOString().slice(0,7);$('#rkGo').onclick=ld;ld()}};
//==END==
