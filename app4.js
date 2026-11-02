/* ===== app4: নতুন ফিচার (কম্পেয়ার, সাজেশন, ট্রান্সফার, রিপিট, রিসেলার টুল) ===== */
const _n=x=>x==null?'':x;
const _sv=id=>S.svcs.find(x=>x._id==id);
const _sel=s=>{S.plat='all';rPlat();fillCats();$('#cat').value=s.category;fillSvcs();$('#svc').value=s._id;pick(s._id);window.scrollTo({top:0,behavior:'smooth'})};

/* ---- রিপিট শিডিউল (২৪) ---- */
(function(){
  const at=$('#schAt');if(!at)return;
  const w=document.createElement('div');w.id='repBox';w.className='hide';
  w.innerHTML='<label class="schl"><input type="checkbox" id="repOn"> 🔁 রিপিট করুন</label><div id="repIn" class="hide" style="display:none;gap:8px;margin-top:6px"><input type="number" id="repD" min="1" max="30" value="1" placeholder="প্রতি কত দিন পর" style="flex:1"><input type="number" id="repT" min="2" max="12" value="3" placeholder="মোট কতবার" style="flex:1"></div><small id="repH" style="color:var(--mu)"></small>';
  at.insertAdjacentElement('afterend',w);
  const sync=()=>{const on=$('#schOn').checked;w.classList.toggle('hide',!on);if(!on)$('#repOn').checked=false;rep()};
  const rep=()=>{const o=$('#repOn').checked,i=$('#repIn');i.style.display=o?'flex':'none';$('#repH').textContent=o?`প্রতি ${$('#repD').value||1} দিন পর, মোট ${$('#repT').value||2} বার একই অর্ডার (লিংক একই থাকবে)`:''};
  $('#schOn').addEventListener('change',sync);$('#repOn').onchange=rep;$('#repD').oninput=rep;$('#repT').oninput=rep;
})();

/* ---- কম্পেয়ার (৩৬) ---- */
function cmpOpen(){
  const s=S.cur;if(!s)return toast('আগে একটা সার্ভিস বেছে নিন','er');
  const l=S.svcs.filter(x=>x.category==s.category).sort((a,b)=>a.rate-b.rate).slice(0,12);
  const best=Math.min(...l.map(x=>x.rate));
  G(`<div class="sec"><i class="fa-solid fa-scale-balanced"></i>কম্পেয়ার — ${esc(s.category)}</div>`+l.map(x=>`<div class="hi" data-c="${x._id}" style="${x._id==s._id?'border-color:var(--p)':''}"><div style="min-width:0"><b>#${x.no||x.sid}</b> ${esc(x.name.slice(0,40))}<br><small style="color:var(--mu)">${x.min}–${x.max} · ⏱ ${esc(x.avgTime||'N/A')}${x.rcnt?' · ★ '+(x.rsum/x.rcnt).toFixed(1):''}</small></div><b style="white-space:nowrap">${tk(x.rate*(1-disc()/100))}${x.rate==best?' 🏆':''}</b></div>`).join('')||'<div class="empty">কিছু নেই</div>');
  $$('#gBody [data-c]').forEach(e=>e.onclick=()=>{$('#gModal').classList.add('hide');_sel(_sv(e.dataset.c))});
}
(function(){const i=$('#info');if(!i||$('#cmpBtn'))return;const b=document.createElement('button');b.id='cmpBtn';b.type='button';b.textContent='⚖️ একই ক্যাটাগরির সার্ভিস কম্পেয়ার';b.style.cssText='width:100%;margin-top:8px;padding:10px;border-radius:12px;border:1px dashed var(--p);background:transparent;color:var(--p);font:600 13px inherit;cursor:pointer';b.onclick=cmpOpen;i.appendChild(b)})();

/* ---- স্মার্ট সাজেশন (৩৭) ---- */
let _sgT=0;
async function loadSuggest(){
  if(!S.me||Date.now()-_sgT<300000||!S.svcs.length)return;_sgT=Date.now();
  const j=await api('/u/suggest',{}).catch(()=>({}));const L=(j.items||[]).map(x=>({..._sv(x.id),why:x.why})).filter(x=>x._id).slice(0,8);
  let b=$('#sugRow');if(!b){const f=$('#favRow');if(!f)return;b=document.createElement('div');b.id='sugRow';f.insertAdjacentElement('beforebegin',b)}
  const W={again:'🔁 আবার',also:'👥 অনেকে নেয়',trend:'🔥 ট্রেন্ডিং'};
  b.className=L.length?'':'hide';
  b.innerHTML=L.length?`<div style="font:700 13px inherit;margin:8px 0 6px">✨ আপনার জন্য সাজেশন</div><div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:6px">`+L.map(s=>`<div data-sg="${s._id}" style="flex:0 0 auto;min-width:150px;max-width:190px;background:#fff;border:1px solid var(--bd);border-radius:14px;padding:10px;cursor:pointer"><small style="color:var(--p)">${W[s.why]||''}</small><div style="font-size:13px;font-weight:600;margin:2px 0">${esc(s.name.slice(0,34))}</div><small style="color:var(--mu)">#${s.no||s.sid} · ${tk(s.rate*(1-disc()/100))}/১০০০</small></div>`).join('')+'</div>':'';
  $$('#sugRow [data-sg]').forEach(e=>e.onclick=()=>_sel(_sv(e.dataset.sg)));
}
setInterval(()=>{try{loadSuggest()}catch{}},4000);

/* ---- ব্যালেন্স ট্রান্সফার (৪৪) ---- */
(function(){
  const w=$('#mWl');if(!w||$('#mTr'))return;
  const m=document.createElement('div');m.className='mi hide';m.id='mTr';m.innerHTML='<span class="i"><i class="fa-solid fa-money-bill-transfer"></i></span>ব্যালেন্স ট্রান্সফার<i class="fa-solid fa-chevron-right"></i>';
  w.insertAdjacentElement('afterend',m);
  const chk=async()=>{if(!S.me||S.uid&&String(S.uid).startsWith('rb'))return;const j=await api('/u/transfer-info',{}).catch(()=>({}));S._tr=j;m.classList.toggle('hide',!j.on)};
  setInterval(()=>{if(S.me&&S._trU!==S.uid){S._trU=S.uid;chk()}},3000);
  m.onclick=()=>{const j=S._tr||{};
    G(`<div class="sec"><i class="fa-solid fa-money-bill-transfer"></i>ব্যালেন্স ট্রান্সফার</div><div class="notice" style="margin:0 0 10px">ফি ${j.fee}% · ন্যূনতম ৳${j.min} · ট্রান্সফারের জন্য মোট ডিপোজিট ৳${j.needDep} লাগবে</div><label class="l">প্রাপকের টেলিগ্রাম আইডি (সংখ্যা)</label><input id="trTo" inputmode="numeric" placeholder="যেমন 123456789"><label class="l">টাকা</label><input id="trAm" type="number" inputmode="decimal" placeholder="৳"><div id="trF" style="font-size:13px;margin-top:8px;color:var(--mu)"></div><button class="btn" id="trGo">ট্রান্সফার করুন</button>`);
    const f=()=>{const a=+$('#trAm').value||0;$('#trF').textContent=a?`ফি ${tk(a*j.fee/100)} · মোট কাটবে ${tk(a*(1+j.fee/100))}`:''};$('#trAm').oninput=f;
    $('#trGo').onclick=async e=>{const to=$('#trTo').value.trim(),amount=+$('#trAm').value;if(!to||!amount)return toast('সব ঘর পূরণ করুন','er');
      if(!confirm(`${to} কে ${tk(amount)} পাঠাবেন? (ফি ${tk(amount*j.fee/100)})`))return;
      e.target.disabled=true;const r=await api('/u/transfer',{to,amount}).catch(()=>({error:'নেটওয়ার্ক সমস্যা'}));e.target.disabled=false;
      if(r.error)return toast(r.error,'er');toast('✅ ট্রান্সফার হয়েছে','ok');$('#gModal').classList.add('hide');syncNow(true)}};
})();

/* ---- রিসেলার এক্সট্রা (৪৮,৪৯,৫২,৫৩,৫৪,৫৫) ---- */
const _dt=t=>t?new Date(t*1000).toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}):'';
async function rbExtra(b){
  const el=$('#rbX');if(!el)return;
  el.innerHTML=`<div class="sec"><i class="fa-solid fa-chart-line"></i>লাভের চার্ট (১৪ দিন)</div><div class="pc" id="rxCh">লোড হচ্ছে...</div>
  <div class="sec"><i class="fa-solid fa-ranking-star"></i>সার্ভিস লাভ র‍্যাংক (৩০ দিন)</div><div class="pc" id="rxRk">লোড হচ্ছে...</div>
  <div class="sec"><i class="fa-solid fa-users"></i>কাস্টমার ম্যানেজ</div><div class="pc"><input id="rxQ" class="rbi" placeholder="নাম / আইডি / @ইউজারনেম দিয়ে খুঁজুন"><div id="rxCu" style="margin-top:8px"></div></div>
  <div class="sec"><i class="fa-solid fa-ticket"></i>আমার প্রোমো কোড</div><div class="pc"><div style="display:flex;gap:6px"><input id="rxPc" class="rbi" placeholder="কোড" style="flex:2"><input id="rxPa" class="rbi" type="number" placeholder="৳ বোনাস" style="flex:1"></div><div style="display:flex;gap:6px;margin-top:6px"><input id="rxPm" class="rbi" type="number" placeholder="সর্বোচ্চ ব্যবহার (০=অসীম)" style="flex:1"><input id="rxPd" class="rbi" type="number" placeholder="কত দিন (০=সীমা নেই)" style="flex:1"></div><button class="btn" id="rxPa2" style="margin-top:8px">কোড বানান</button><div id="rxPl" style="margin-top:10px"></div></div>
  <div class="sec"><i class="fa-solid fa-clock"></i>ব্রডকাস্ট শিডিউল</div><div class="pc"><textarea id="rxBt" rows="3" class="rbi" placeholder="মেসেজ"></textarea><input id="rxBa" type="datetime-local" class="rbi" style="margin-top:6px"><button class="btn" id="rxBs" style="margin-top:8px">শিডিউল করুন</button><div id="rxBl" style="margin-top:10px"></div></div>
  <div class="sec"><i class="fa-solid fa-share-nodes"></i>রেফারেল কমিশন</div><div class="pc"><small style="color:var(--mu)">রেফার করা কাস্টমার ডিপোজিট করলে রেফারার এই % কমিশন পাবে (০–২০)। খরচ আপনার লাভ থেকে নয়, ইউজারকে বাড়তি বোনাস।</small><div style="display:flex;gap:6px;margin-top:6px"><input id="rxRf" class="rbi" type="number" min="0" max="20" step="0.5" value="${+b.refPercent||0}" style="flex:1"><button class="btn" id="rxRs" style="margin-top:0;width:auto;padding:0 22px">সেভ</button></div></div>`;
  // চার্ট
  api('/rb/chart',{}).then(j=>{const d=j.days||[];if(!d.length){$('#rxCh').textContent='ডাটা নেই';return}
    const mx=Math.max(1,...d.map(x=>Math.max(x.sales,0))),W=300,H=110,bw=W/d.length;
    $('#rxCh').innerHTML=`<svg viewBox="0 0 ${W} ${H+16}" style="width:100%">${d.map((x,i)=>{const h=x.sales/mx*H,p=Math.max(0,x.profit)/mx*H;return `<rect x="${i*bw+2}" y="${H-h}" width="${bw-4}" height="${h}" rx="2" fill="#93c5fd"/><rect x="${i*bw+2}" y="${H-p}" width="${bw-4}" height="${p}" rx="2" fill="#16a34a"/><text x="${i*bw+bw/2}" y="${H+11}" font-size="6" text-anchor="middle" fill="#94a3b8">${x.d.slice(3)}</text>`}).join('')}</svg><div style="font-size:12px;color:var(--mu)">🟦 বিক্রি ${tk(d.reduce((a,x)=>a+x.sales,0))} · 🟩 লাভ ${tk(d.reduce((a,x)=>a+x.profit,0))} · অর্ডার ${d.reduce((a,x)=>a+x.orders,0)}</div>`}).catch(()=>{$('#rxCh').textContent='লোড হয়নি'});
  api('/rb/svc-rank',{}).then(j=>{const l=j.items||[];$('#rxRk').innerHTML=l.map((x,i)=>`<div class="wr"><div>${i+1}. ${esc(x.name)}<small>${x.orders} অর্ডার · বিক্রি ${tk(x.sales)}</small></div><b class="p">${tk(x.profit)}</b></div>`).join('')||'<div class="empty">এখনো অর্ডার নেই</div>'}).catch(()=>{$('#rxRk').textContent='লোড হয়নি'});
  // কাস্টমার
  const cu=async()=>{const j=await api('/rb/customers',{q:$('#rxQ').value.trim()}).catch(()=>({items:[]}));
    $('#rxCu').innerHTML=(j.items||[]).map(u=>`<div class="hi" style="display:block"><b>${esc(u.name||'—')}</b> ${u.user?'@'+esc(u.user):''} <small style="color:var(--mu)">#${u.tg||''}</small>${u.banned?' 🚫':''}<br><small>ব্যালেন্স ${tk(u.balance)} · খরচ ${tk(u.spent)} · ${u.orders} অর্ডার</small><div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap"><button data-a="add" data-i="${u.id}" class="rxb">➕ যোগ</button><button data-a="sub" data-i="${u.id}" class="rxb">➖ কাটুন</button><button data-a="${u.banned?'unban':'ban'}" data-i="${u.id}" class="rxb">${u.banned?'✅ আনব্লক':'🚫 ব্লক'}</button></div></div>`).join('')||'<div class="empty">কাস্টমার পাওয়া যায়নি</div>';
    $$('#rxCu .rxb').forEach(b=>b.onclick=async()=>{const a=b.dataset.a;let amount,reason='';
      if(a=='add'||a=='sub'){amount=prompt('কত টাকা?');if(!amount)return;reason=prompt('কারণ (ঐচ্ছিক)')||''}else if(!confirm('নিশ্চিত?'))return;
      const r=await api('/rb/customer-act',{id:b.dataset.i,action:a,amount,reason});r.error?toast(r.error,'er'):(toast('✅ হয়েছে','ok'),cu())})};
  let _t;$('#rxQ').oninput=()=>{clearTimeout(_t);_t=setTimeout(cu,400)};cu();
  // প্রোমো
  const pl=async()=>{const j=await api('/rb/promo',{op:'list'}).catch(()=>({items:[]}));
    $('#rxPl').innerHTML=(j.items||[]).map(p=>`<div class="wr"><div><b>${esc(p._id||p.id)}</b> ${p.active===false?'⛔':'✅'}<small>৳${p.amount} · ব্যবহার ${p.used||0}${p.maxUses?'/'+p.maxUses:''}</small></div><div><button class="rxb" data-pt="${esc(p._id||p.id)}">⏯</button> <button class="rxb" data-pd="${esc(p._id||p.id)}">🗑</button></div></div>`).join('')||'<div class="empty">কোনো কোড নেই</div>';
    $$('#rxPl [data-pt]').forEach(b=>b.onclick=async()=>{await api('/rb/promo',{op:'toggle',code:b.dataset.pt});pl()});
    $$('#rxPl [data-pd]').forEach(b=>b.onclick=async()=>{if(confirm('মুছবেন?')){await api('/rb/promo',{op:'delete',code:b.dataset.pd});pl()}})};
  $('#rxPa2').onclick=async()=>{const r=await api('/rb/promo',{op:'add',code:$('#rxPc').value,amount:$('#rxPa').value,maxUses:$('#rxPm').value||0,days:$('#rxPd').value||0});r.error?toast(r.error,'er'):(toast('✅ কোড তৈরি হয়েছে','ok'),$('#rxPc').value='',pl())};pl();
  // ব্রডকাস্ট শিডিউল
  const bl=async()=>{const j=await api('/rb/bc-sched',{op:'list'}).catch(()=>({items:[]}));
    $('#rxBl').innerHTML=(j.items||[]).map(x=>`<div class="wr"><div>${esc(x.text)}<small>${_dt(x.t)} · ${x.status=='wait'?'⏳ অপেক্ষায়':x.status=='done'?'✅ পাঠানো হয়েছে':'❌ বাতিল'}</small></div>${x.status=='wait'?`<button class="rxb" data-bx="${x.id}">বাতিল</button>`:''}</div>`).join('')||'<div class="empty">কোনো শিডিউল নেই</div>';
    $$('#rxBl [data-bx]').forEach(b=>b.onclick=async()=>{await api('/rb/bc-sched',{op:'cancel',id:b.dataset.bx});bl()})};
  $('#rxBs').onclick=async()=>{const t=new Date($('#rxBa').value).getTime();if(!t||!$('#rxBt').value.trim())return toast('মেসেজ ও সময় দিন','er');const r=await api('/rb/bc-sched',{op:'add',text:$('#rxBt').value.trim(),at:t/1000});r.error?toast(r.error,'er'):(toast('✅ শিডিউল হয়েছে','ok'),$('#rxBt').value='',bl())};bl();
  $('#rxRs').onclick=async()=>{const r=await api('/rb/ref-set',{pct:$('#rxRf').value});r.error?toast(r.error,'er'):toast('✅ সেভ হয়েছে ('+r.pct+'%)','ok')};
}
//==END==
