/* ===== app6: ডিপোজিট — ম্যানুয়াল / অটো (bKash গেটওয়ে) ===== */
(function(){
  const css=document.createElement('style');css.textContent=`.dtabs{display:flex;gap:8px;background:#e8eef7;border-radius:16px;padding:5px;margin:4px 0 14px}.dtabs button{flex:1;border:0;background:transparent;border-radius:12px;padding:11px 6px;font:700 14px inherit;color:var(--mu);cursor:pointer}.dtabs button.on{background:#fff;color:var(--p);box-shadow:0 3px 10px rgba(15,42,80,.12)}
  .bkq{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:8px 0 12px}.bkq button{border:1.5px solid var(--bd);background:#fff;border-radius:12px;padding:10px 0;font:700 14px inherit;color:var(--tx);cursor:pointer}.bkq button.on{border-color:#e2136e;background:#fff0f6;color:#e2136e}
  .bkgo{width:100%;border:0;border-radius:16px;padding:15px;font:800 16px inherit;color:#fff;background:linear-gradient(135deg,#e2136e,#b80f58);box-shadow:0 8px 20px rgba(226,19,110,.35);cursor:pointer}.bkgo:disabled{opacity:.6}`;document.head.appendChild(css)})();
let _dtab=null,_bkW=null;
function bkInit(){
  const f=$('#v-funds'),pms=$('#pms');if(!f||!pms||!S.me)return;
  const on=!!S.set.autoDepOn&&!!S.set.bkAutoOn&&!String(S.uid||'').startsWith('rb');
  const tabs=$('#depTabs');
  if(!on){if(tabs){tabs.remove();$('#bkBox')&&$('#bkBox').remove();pms.previousElementSibling&&pms.previousElementSibling.classList.remove('hide');pms.classList.remove('hide')}return}
  if(tabs)return;
  const sec=pms.previousElementSibling,w=document.createElement('div');w.id='depTabs';w.className='dtabs';
  w.innerHTML='<button data-t="auto">⚡ অটো (bKash)</button><button data-t="man">✋ ম্যানুয়াল</button>';sec.insertAdjacentElement('beforebegin',w);
  const box=document.createElement('div');box.id='bkBox';
  box.innerHTML=`<div class="sec" style="margin-top:0"><i class="fa-solid fa-bolt" style="color:#e2136e"></i>অটো ডিপোজিট</div><div class="how">টাকার পরিমাণ লিখে নিচের বাটনে চাপুন। bKash এর নিজের পেজে নাম্বার, OTP ও PIN দিলেই ব্যালেন্স <b>নিজে নিজে</b> যোগ হবে — TrxID লাগবে না।</div>
   <label class="l">টাকার পরিমাণ</label><input id="bkAmt" type="number" inputmode="decimal" placeholder="যেমন: 200"><div class="bkq">${[100,200,500,1000].map(x=>`<button data-a="${x}">৳${bnum(x)}</button>`).join('')}</div>
   <button class="bkgo" id="bkGo"><i class="fa-solid fa-bolt"></i> bKash দিয়ে এখনই পে করুন</button>`;
  $('#payForm').insertAdjacentElement('afterend',box);
  const show=t=>{_dtab=t;LS.s('dtab',t);$$('#depTabs button').forEach(b=>b.classList.toggle('on',b.dataset.t==t));const a=t=='auto';box.classList.toggle('hide',!a);sec.classList.toggle('hide',a);pms.classList.toggle('hide',a);if(a)$('#payForm').classList.add('hide')};
  $$('#depTabs button').forEach(b=>b.onclick=()=>show(b.dataset.t));show(_dtab||LS.g('dtab')||'auto');
  $$('#bkBox .bkq button').forEach(b=>b.onclick=()=>{$('#bkAmt').value=b.dataset.a;$$('#bkBox .bkq button').forEach(x=>x.classList.toggle('on',x==b))});
  $('#bkGo').onclick=async()=>{const amount=+$('#bkAmt').value;if(!amount||amount<=0)return toast('টাকার পরিমাণ দিন','er');const g=$('#bkGo');g.disabled=true;
    const r=await api('/u/bk-create',{amount}).catch(()=>({error:'নেটওয়ার্ক সমস্যা'}));g.disabled=false;if(r.error)return toast(r.error,'er');
    _bkW={bal:+(S.me.balance||0),t:Date.now()};const T=window.Telegram&&window.Telegram.WebApp;
    if(T&&T.openLink)T.openLink(r.url);else window.open(r.url,'_blank')};
}
setInterval(()=>{try{bkInit()}catch{}},1200);
// পেমেন্ট শেষে অ্যাপে ফিরলে ব্যালেন্স যাচাই
document.addEventListener('visibilitychange',async()=>{if(document.hidden||!_bkW)return;
  for(let i=0;i<8&&_bkW;i++){S._h='';await syncNow(true);if(+(S.me&&S.me.balance||0)>_bkW.bal+0.001){toast('✅ পেমেন্ট সফল! ব্যালেন্স যোগ হয়েছে','ok');celebrate();_bkW=null;break}await _sleep(2500)}
  if(_bkW&&Date.now()-_bkW.t>120000)_bkW=null});

/* ===== 💻 কোড/ওয়েবসাইট স্লট ===== */
(function(){
  const lk=$('#link'),qt=$('#qty');if(!lk||!qt||$('#reqBox'))return;
  const ln=lk.previousElementSibling,qn=qt.previousElementSibling,qc=$('#qChips'),sc=document.querySelector('.schl');
  const box=document.createElement('div');box.id='reqBox';box.className='hide';
  box.innerHTML='<div class="sub">3. আপনার চাহিদা লিখুন</div><textarea id="req" rows="5" maxlength="600" placeholder="কী ধরনের ওয়েবসাইট চান? যেমন: ইকমার্স সাইট, রঙ নীল, পেজ: হোম/প্রোডাক্ট/কনট্যাক্ট..." style="width:100%;border:1px solid var(--bd);border-radius:12px;padding:12px;font:inherit;background:var(--card,#fff);color:inherit;resize:vertical"></textarea><div class="notice" style="margin:8px 0">📦 অর্ডার কমপ্লিট হলে ফাইল সরাসরি আপনার টেলিগ্রামে এই বটে চলে আসবে। অর্ডার লিস্ট থেকে আবার পাঠানোও যাবে।</div>';
  lk.parentNode.insertBefore(box,ln);
  const gal=document.createElement('div');gal.id='codeGal';gal.style.cssText='display:none;gap:10px;overflow-x:auto;padding:4px 0 10px;scroll-snap-type:x mandatory';
  const info=$('#info');info.parentNode.insertBefore(gal,info.nextSibling);
  const isCode=()=>S.cur&&S.cur.platform=='code';
  const rGal=()=>{const L=(isCode()&&S.cur.imgs||[]).filter(u=>/^https?:\/\//i.test(u));gal.innerHTML=L.map(u=>`<img src="${esc(u)}" loading="lazy" referrerpolicy="no-referrer" style="height:170px;max-width:78%;border-radius:14px;border:1px solid var(--bd);object-fit:cover;scroll-snap-align:start;flex:0 0 auto;cursor:zoom-in" onerror="this.remove()">`).join('');gal.style.display=L.length?'flex':'none';
    gal.querySelectorAll('img').forEach(i=>i.onclick=()=>window.open(i.src,'_blank'))};
  const show=on=>{[ln,lk,qn,qt,qc,sc,$('#schAt')].forEach(e=>{if(e)e.style.display=on?'none':''});box.classList.toggle('hide',!on);
    if(on){qt.value=1;if($('#schOn')&&$('#schOn').checked){$('#schOn').checked=false}}else if(box._on){qt.value=''}box._on=on};
  const _pk=pick;
  pick=function(id){_pk(id);const on=isCode();show(on);rGal();
    if(on){const s=S.cur;$('#iRate').textContent=tk(s.rate/1000*(1-disc()/100));const r=$('#info .row span');if(r)r.textContent='PRICE';$('#iLim').textContent='১ টি (ফিক্সড দাম)';calc()}
    else{const r=$('#info .row span');if(r)r.textContent='RATE (1000)'}};
  const _oo=$('#order').onclick;
  $('#order').onclick=async function(ev){
    if(!isCode())return _oo.call(this,ev);
    const s=S.cur,rq=$('#req').value.trim();
    if(!S.me)return toast('প্রোফাইল লোড হচ্ছে, কয়েক সেকেন্ড পর আবার চেষ্টা করুন','er');
    if(rq.length<8)return toast('কী ধরনের ওয়েবসাইট/কোড চান সংক্ষেপে লিখুন','er');
    const b=$('#order');b.disabled=true;
    try{const jo=await api('/u/order',{serviceId:s._id,req:rq,quantity:1});if(jo.error)throw new Error(jo.error);syncNow(true);
      toast('✅ অর্ডার সফল! কমপ্লিট হলে ফাইল টেলিগ্রামে পাবেন','ok');celebrate();$('#req').value='';go('orders')}
    catch(e){toast(e.message,'er')}
    b.disabled=false};
  document.addEventListener('click',async e=>{const b=e.target.closest('[data-fr]');if(!b)return;b.disabled=true;
    const r=await api('/u/files-resend',{orderId:b.dataset.fr}).catch(()=>({error:'নেটওয়ার্ক সমস্যা'}));b.disabled=false;
    r.error?toast(r.error,'er'):toast('📎 ফাইল আপনার টেলিগ্রামে পাঠানো হচ্ছে','ok')});
})();

/* ===== সার্ভিস কার্ড-লিস্ট (ড্রপডাউনের বদলে) ===== */
(function(){
  const sel=$('#svc');if(!sel||$('#svcBox'))return;
  const st=document.createElement('style');st.textContent=`
  #svcBox{margin:2px 0 10px;border:1.5px solid var(--bd);border-radius:18px;background:var(--card);overflow:hidden}
  #svcBox .sh{display:flex;align-items:center;gap:10px;padding:13px 14px;cursor:pointer;background:linear-gradient(180deg,#f2f8ff,#e9f3ff)}
  #svcBox .sh .bd{flex:0 0 auto}.sbd{background:var(--p);color:#fff;font-weight:800;font-size:13px;border-radius:12px;padding:5px 11px;min-width:46px;text-align:center}
  #svcBox .sh .nm{flex:1;font-weight:700;font-size:14px;line-height:1.35;color:var(--tx);overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
  #svcBox .sh i{color:var(--p);transition:.2s}#svcBox.op .sh i{transform:rotate(180deg)}
  #svcL{display:none;max-height:min(62vh,520px);overflow-y:auto;padding:10px;gap:9px;flex-direction:column;border-top:1px solid var(--bd);background:#f8fbff;-webkit-overflow-scrolling:touch}
  #svcBox.op #svcL{display:flex}
  .svi{border:1.5px solid var(--bd);background:#eaf3ff;border-radius:16px;padding:12px 13px;cursor:pointer;position:relative}
  .svi .tp{display:flex;gap:10px;align-items:flex-start}.svi .tp .sbd{background:#fff;color:var(--p);border:1px solid var(--bd)}
  .svi .nm{font-weight:700;font-size:14px;line-height:1.4;color:var(--tx);flex:1;word-break:break-word}
  .svi .pr{margin-top:8px;font-weight:800;font-size:16px;color:var(--er)}.svi .pr small{font-weight:600;color:var(--mu);font-size:12px}
  .svi .pr s{color:#94a3b8;font-weight:500;font-size:13px;margin-right:6px}
  .svi.on{background:linear-gradient(135deg,#2196f3,#1565c0);border-color:#1565c0;box-shadow:0 8px 20px #1e88e555}
  .svi.on .nm,.svi.on .pr,.svi.on .pr small{color:#fff}.svi.on .sbd{background:rgba(255,255,255,.22);color:#fff;border-color:transparent}
  .svi .tg{font-size:11px;font-weight:700;margin-left:4px}
  #info .sdh{font-weight:800;font-size:15px;margin:0 0 8px;display:flex;align-items:center;gap:8px;color:var(--tx)}#info .sdh i{color:var(--wa)}
  #iDesc{white-space:pre-line;line-height:1.7}`;document.head.appendChild(st);
  sel.style.display='none';const fb=$('#favBtn'),sp=sel.parentNode;
  const box=document.createElement('div');box.id='svcBox';
  box.innerHTML='<div class="sh" id="svcH"><span class="bd sbd" id="svcHb">—</span><span class="nm" id="svcHn">সার্ভিস বেছে নিন</span><i class="fa-solid fa-chevron-down"></i></div><div id="svcL"></div>';
  sp.parentNode.insertBefore(box,sp);
  if(fb){fb.style.margin='0';fb.addEventListener('click',e=>e.stopPropagation());box.querySelector('.sh').insertBefore(fb,box.querySelector('.sh i'))}
  sp.style.display='none';
  const inf=$('#info');if(inf&&!inf.querySelector('.sdh')){const h=document.createElement('div');h.className='sdh';h.innerHTML='<i class="fa-solid fa-bolt"></i> Service Details';inf.insertBefore(h,inf.firstChild)}
  const price=s=>{const d=disc();return tk(s.rate*(1-d/100))};
  const paint=()=>{const L=$('#svcL'),fv=favs(),cur=S.cur&&S.cur._id;
    L.innerHTML=[...sel.options].map(o=>{const s=S.svcs.find(x=>x._id==o.value);if(!s)return '';
      return `<div class="svi${s._id==cur?' on':''}" data-id="${s._id}"><div class="tp"><span class="sbd">${s.no||s.sid}</span><div class="nm">${fv.includes(s._id)?'⭐ ':''}${s.pop?'🔥 ':''}${s.isNew?'🆕 ':''}${s.sale?'💥 ':''}${esc(s.name)}</div></div>
      <div class="pr">${s.rateOld?`<s>${tk(s.rateOld*(1-disc()/100))}</s>`:''}${price(s)} <small>per 1000</small></div></div>`}).join('')||'<div class="empty">এই ক্যাটাগরিতে সার্ভিস নেই</div>';
    const s=S.cur;$('#svcHb').textContent=s?(s.no||s.sid):'—';$('#svcHn').textContent=s?s.name:'সার্ভিস বেছে নিন';
    L.querySelectorAll('.svi').forEach(e=>e.onclick=()=>{sel.value=e.dataset.id;pick(e.dataset.id);box.classList.remove('op');box.scrollIntoView({block:'nearest',behavior:'smooth'})})};
  $('#svcH').onclick=()=>{box.classList.toggle('op');if(box.classList.contains('op')){const o=box.querySelector('.svi.on');if(o)o.scrollIntoView({block:'center'})}};
  const _pk2=pick;pick=function(id){_pk2(id);paint()};
  const _fs=fillSvcs;fillSvcs=function(){_fs();paint()};
  paint();
})();
/* ---- টেলিগ্রাম অটো পোস্ট ভিউ/রিয়্যাকশন ---- */
(function(){
  const m=document.querySelector('#v-set .mi#mTut');if(!m||$('#mAp'))return;
  m.insertAdjacentHTML('beforebegin','<div class="mi" id="mAp"><span class="i"><i class="fa-brands fa-telegram"></i></span>টেলিগ্রাম অটো-পোস্ট ভিউ রিয়্যাকশন<i class="fa-solid fa-chevron-right"></i></div>');
  const draw=async(j)=>{
    if(!j)j=await api('/u/ap-info',{}).catch(()=>({error:1}));
    if(j.error)return G('<div class="empty">লোড করা যায়নি</div>');
    const rows=(j.rows||[]).map(r=>`<div class="pc" style="margin-top:8px"><div style="display:flex;justify-content:space-between;gap:6px"><b>${esc(r.chan)}</b><span class="st ${r.on?'completed':'canceled'}">${r.on?'চালু':'বন্ধ'}</span></div><small style="color:var(--mu)">👁 ${r.vmin} - ${r.vmax} ভিউ ${r.react?'• 👍 রিয়্যাকশন':''} • পোস্ট ${r.posts} • খরচ ${tk(r.spent)}</small><div style="display:flex;gap:8px;margin-top:8px"><button class="rbtn" style="margin:0" data-ap="toggle" data-id="${r.id}">${r.on?'বন্ধ করুন':'চালু করুন'}</button><button class="rbtn" style="margin:0;background:#ef4444;color:#fff" data-ap="del" data-id="${r.id}">মুছুন</button></div></div>`).join('');
    G(`<div class="sec"><i class="fa-solid fa-bolt"></i>অটো সার্ভিস বিবরণী</div><div class="pc"><small>চ্যানেল যুক্ত করার পর যখনই নতুন পোস্ট করবেন, অটোমেটিক সেই পোস্টে ভিউ${j.rrate?' ও রিয়্যাকশন':''} যাবে এবং ব্যালেন্স থেকে টাকা কেটে নেওয়া হবে।</small></div>
    ${j.on?`<div class="pc" style="margin-top:8px"><b>এডমিন রিকোয়ারমেন্ট</b><br><small>চ্যানেল যুক্ত করার আগে বটকে চ্যানেলে <b>Admin</b> বানান:</small><div style="display:flex;gap:8px;align-items:center;margin-top:6px"><code id="apBot">@${esc(j.botUser)}</code><button class="rbtn" style="margin:0" id="apCp">কপি</button></div></div>
    <div class="pc" style="margin-top:8px"><b>নতুন চ্যানেল যুক্ত করুন</b>
    <input id="apCh" placeholder="@my_channel_username" style="margin-top:6px"><div style="display:flex;gap:8px;margin-top:6px"><input id="apMn" type="number" placeholder="Min ভিউ (${j.vlimit[0]}+)"><input id="apMx" type="number" placeholder="Max ভিউ (${j.vlimit[1]} পর্যন্ত)"></div>
    ${j.rrate?`<label style="display:flex;gap:8px;align-items:center;margin-top:8px"><input type="checkbox" id="apRe"> 👍 রিয়্যাকশনও চাই (${j.rmin}-${j.rmax} টা প্রতি পোস্টে)</label>`:''}
    <small style="color:var(--mu);display:block;margin-top:6px">দাম: ভিউ ${tk(j.vrate)}/১০০০${j.rrate?' • রিয়্যাকশন '+tk(j.rrate)+'/১০০০':''}</small>
    <button class="btn" id="apGo" style="margin-top:8px">চ্যানেল ভেরিফাই ও সেভ করুন</button></div>`:'<div class="pc" style="margin-top:8px">এই সার্ভিস এখন বন্ধ আছে।'+(j.why?'<br><small style="color:var(--mu)">কারণ: '+esc(j.why)+'</small>':'')+'</div>'}
    <div class="sec" style="margin-top:12px"><i class="fa-solid fa-list"></i>সংরক্ষিত চ্যানেলসমূহ (${(j.rows||[]).length})</div>${rows||'<div class="empty">কোনো চ্যানেল নেই</div>'}`);
    const gb=$('#gBody');gb.style.cssText='height:100vh;max-height:100vh;border-radius:0;max-width:none;padding:18px 16px 90px';$('#gModal').style.alignItems='stretch';
    const gx=$('#gX');if(gx){const o=gx.onclick;gx.onclick=()=>{gb.style.cssText='';$('#gModal').style.alignItems='';o()}}
    const cp=$('#apCp');if(cp)cp.onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText('@'+j.botUser);toast('কপি হয়েছে','ok')};
    const go=$('#apGo');if(go)go.onclick=async()=>{go.disabled=true;const r=await api('/u/ap-add',{chan:$('#apCh').value,vmin:$('#apMn').value,vmax:$('#apMx').value,react:$('#apRe')?$('#apRe').checked:false}).catch(e=>({error:'নেটওয়ার্ক সমস্যা'}));go.disabled=false;if(r.error)return toast(r.error,'er');toast('✅ চ্যানেল যুক্ত হয়েছে','ok');j.rows=r.rows;draw(j)};
    $$('[data-ap]').forEach(b=>b.onclick=async()=>{if(b.dataset.ap=='del'&&!confirm('চ্যানেলটি মুছবেন?'))return;const r=await api('/u/ap-act',{id:b.dataset.id,op:b.dataset.ap});if(r.error)return toast(r.error,'er');j.rows=r.rows;draw(j)});
  };
  $('#mAp').onclick=()=>{G('<div class="empty">লোড হচ্ছে...</div>');draw()};
})();
//==END==
