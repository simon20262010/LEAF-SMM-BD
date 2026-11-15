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
    const rows=(j.rows||[]).map(r=>`<div class="pc" style="margin-top:8px"><div style="display:flex;justify-content:space-between;gap:6px"><b>${esc(r.chan)}</b><span class="st ${r.on?'completed':'canceled'}">${r.on?'চালু':'বন্ধ'}</span></div><small style="color:var(--mu)">👁 ${r.vmin} - ${r.vmax} ভিউ ${r.react?'• 👍 '+r.rmin+'-'+r.rmax:''} • পোস্ট ${r.posts} • খরচ ${tk(r.spent)}</small><div style="display:flex;gap:8px;margin-top:8px"><button class="rbtn" style="margin:0" data-ap="toggle" data-id="${r.id}">${r.on?'বন্ধ করুন':'চালু করুন'}</button><button class="rbtn" style="margin:0;background:#ef4444;color:#fff" data-ap="del" data-id="${r.id}">মুছুন</button></div></div>`).join('');
    G(`<div class="sec"><i class="fa-solid fa-bolt"></i>অটো সার্ভিস বিবরণী</div><div class="pc"><small>চ্যানেল যুক্ত করার পর যখনই নতুন পোস্ট করবেন, অটোমেটিক সেই পোস্টে ভিউ${j.rrate?' ও রিয়্যাকশন':''} যাবে এবং ব্যালেন্স থেকে টাকা কেটে নেওয়া হবে।</small></div>
    ${j.on?`<div class="pc" style="margin-top:8px"><b>এডমিন রিকোয়ারমেন্ট</b><br><small>চ্যানেল যুক্ত করার আগে বটকে চ্যানেলে <b>Admin</b> বানান:</small><div style="display:flex;gap:8px;align-items:center;margin-top:6px"><code id="apBot">@${esc(j.botUser)}</code><button class="rbtn" style="margin:0" id="apCp">কপি</button></div></div>
    <div class="pc" style="margin-top:8px"><b>নতুন চ্যানেল যুক্ত করুন</b>
    <input id="apCh" placeholder="@my_channel_username" style="margin-top:6px"><div style="display:flex;gap:8px;margin-top:6px"><input id="apMn" type="number" placeholder="Min ভিউ (${j.vlimit[0]}+)"><input id="apMx" type="number" placeholder="Max ভিউ (${j.vlimit[1]} পর্যন্ত)"></div>
    ${j.rrate?`<label style="display:flex;gap:8px;align-items:center;margin-top:8px"><input type="checkbox" id="apRe"> 👍 রিয়্যাকশনও চাই</label><div id="apRb" class="hide" style="display:none;gap:8px;margin-top:6px"><input id="apRn" type="number" placeholder="Min রিয়্যাকশন (${j.rlimit[0]}+)"><input id="apRx" type="number" placeholder="Max রিয়্যাকশন (${j.rlimit[1]} পর্যন্ত)"></div>`:''}
    <small style="color:var(--mu);display:block;margin-top:6px">দাম: ভিউ ${tk(j.vrate)}/১০০০${j.rrate?' • রিয়্যাকশন '+tk(j.rrate)+'/১০০০':''}</small>
    <button class="btn" id="apGo" style="margin-top:8px">চ্যানেল ভেরিফাই ও সেভ করুন</button></div>`:'<div class="pc" style="margin-top:8px">এই সার্ভিস এখন বন্ধ আছে।'+(j.why?'<br><small style="color:var(--mu)">কারণ: '+esc(j.why)+'</small>':'')+'</div>'}
    <div class="sec" style="margin-top:12px"><i class="fa-solid fa-list"></i>সংরক্ষিত চ্যানেলসমূহ (${(j.rows||[]).length})</div>${rows||'<div class="empty">কোনো চ্যানেল নেই</div>'}`);
    const gb=$('#gBody');gb.style.cssText='height:100vh;max-height:100vh;border-radius:0;max-width:none;padding:18px 16px 90px';$('#gModal').style.alignItems='stretch';
    const gx=$('#gX');if(gx){const o=gx.onclick;gx.onclick=()=>{gb.style.cssText='';$('#gModal').style.alignItems='';o()}}
    const cp=$('#apCp');if(cp)cp.onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText('@'+j.botUser);toast('কপি হয়েছে','ok')};
    const re=$('#apRe');if(re)re.onchange=()=>{$('#apRb').style.display=re.checked?'flex':'none'};
    const go=$('#apGo');if(go)go.onclick=async()=>{go.disabled=true;const r=await api('/u/ap-add',{chan:$('#apCh').value,vmin:$('#apMn').value,vmax:$('#apMx').value,react:$('#apRe')?$('#apRe').checked:false,rmin:$('#apRn')?$('#apRn').value:0,rmax:$('#apRx')?$('#apRx').value:0}).catch(e=>({error:'নেটওয়ার্ক সমস্যা'}));go.disabled=false;if(r.error)return toast(r.error,'er');toast('✅ চ্যানেল যুক্ত হয়েছে','ok');j.rows=r.rows;draw(j)};
    $$('[data-ap]').forEach(b=>b.onclick=async()=>{if(b.dataset.ap=='del'&&!confirm('চ্যানেলটি মুছবেন?'))return;const r=await api('/u/ap-act',{id:b.dataset.id,op:b.dataset.ap});if(r.error)return toast(r.error,'er');j.rows=r.rows;draw(j)});
  };
  $('#mAp').onclick=()=>{G('<div class="empty">লোড হচ্ছে...</div>');draw()};
})();
/* ---- মিনি অ্যাপ অ্যানিমেশন প্যাক (ফোন হালকা রাখতে শুধু transform/opacity) ---- */
(function(){
  const red=()=>matchMedia('(prefers-reduced-motion:reduce)').matches||localStorage.getItem('animOff')=='1';
  const st=document.createElement('style');st.textContent=`
  .pgin{animation:pgIn .32s cubic-bezier(.2,.8,.2,1) both}@keyframes pgIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
  .nav a.tapb i{animation:tapB .45s cubic-bezier(.3,1.6,.5,1)}@keyframes tapB{0%{transform:scale(1)}35%{transform:scale(1.5) translateY(-6px)}100%{transform:scale(1)}}
  .balFlash{animation:balRed .9s}@keyframes balRed{0%,100%{filter:none}25%{filter:hue-rotate(150deg) saturate(2)}}
  .cpOk{background:#16a34a!important;color:#fff!important;transform:scale(1.06);transition:.15s}
  #info.expd{animation:infoIn .38s cubic-bezier(.2,.8,.2,1) both;transform-origin:top}@keyframes infoIn{from{opacity:0;transform:scaleY(.6)}to{opacity:1;transform:none}}
  #link.lkOk{border-color:#16a34a!important;box-shadow:0 0 0 3px rgba(22,163,74,.15)}
  #link.lkBad{border-color:#ef4444!important;animation:shk .4s}@keyframes shk{20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
  .lkTick{position:absolute;right:14px;color:#16a34a;font-size:18px;pointer-events:none;animation:pop .3s both}
  #order.busy{pointer-events:none;opacity:.9}#order.busy i{display:none}#order.busy::before{content:"";display:inline-block;width:16px;height:16px;border:3px solid rgba(255,255,255,.45);border-top-color:#fff;border-radius:50%;margin-right:8px;vertical-align:-3px;animation:s .7s linear infinite}
  #order.shk{animation:shk .45s;background:linear-gradient(135deg,#ef4444,#b91c1c)!important}
  .svSw{animation:fadeUp .3s both}
  .st.processing::before{content:"";display:inline-block;width:9px;height:9px;border:2px solid rgba(255,255,255,.45);border-top-color:#fff;border-radius:50%;margin-right:5px;vertical-align:-1px;animation:s .8s linear infinite}
  .st.completed{position:relative;overflow:hidden}.st.completed::after{content:"";position:absolute;top:0;bottom:0;width:40%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.7),transparent);animation:cmpS 1.1s .4s 1 both}@keyframes cmpS{from{transform:translateX(-120%) skewX(-20deg)}to{transform:translateX(380%) skewX(-20deg)}}
  .lbt>div:first-child .m{position:relative}.lbt>div:first-child .m::before{content:"👑";position:absolute;top:-20px;left:50%;margin-left:-11px;font-size:20px;animation:crwn 2.4s ease-in-out infinite;transform-origin:50% 100%}@keyframes crwn{0%,100%{transform:rotate(-12deg) translateY(0)}50%{transform:rotate(12deg) translateY(-3px)}}
  .fxP{position:fixed;z-index:130;pointer-events:none;animation:fxFly var(--d,1s) ease-out forwards}@keyframes fxFly{0%{opacity:1;transform:translate(0,0) scale(1) rotate(0)}100%{opacity:0;transform:translate(var(--x),var(--y)) scale(.4) rotate(var(--r,0deg))}}
  .fxRain{position:fixed;top:-30px;z-index:130;pointer-events:none;font-size:24px;animation:fxFall 1.8s ease-in forwards}@keyframes fxFall{to{transform:translateY(105vh) rotate(360deg);opacity:.9}}
  .failB{position:fixed;inset:0;z-index:120;display:flex;align-items:center;justify-content:center;pointer-events:none}.failB .c{width:96px;height:96px;border-radius:50%;background:#ef4444;display:flex;align-items:center;justify-content:center;box-shadow:0 14px 40px rgba(239,68,68,.5);animation:pop .4s both,shk .5s .35s}.failB path{stroke:#fff;stroke-width:6;fill:none;stroke-linecap:round;stroke-dasharray:50;stroke-dashoffset:50;animation:draw .4s .2s ease forwards}
  .gift{position:fixed;inset:0;z-index:125;display:flex;align-items:center;justify-content:center;pointer-events:none}.gift .b{font-size:84px;animation:gBox 1.5s both}@keyframes gBox{0%{transform:scale(.3) rotate(0);opacity:0}20%{transform:scale(1.1);opacity:1}35%{transform:rotate(-12deg)}50%{transform:rotate(12deg)}65%{transform:rotate(-8deg) scale(1.15)}80%{transform:scale(1.5);opacity:1}100%{transform:scale(2.2);opacity:0}}
  .ptr{position:fixed;top:-50px;left:50%;margin-left:-20px;width:40px;height:40px;border-radius:50%;background:#fff;box-shadow:0 6px 18px rgba(0,0,0,.2);z-index:140;display:flex;align-items:center;justify-content:center;font-size:20px;transition:top .2s}
  .ptr.sp i{animation:s .7s linear infinite;display:inline-block;font-style:normal}
  #mDk .i i{transition:transform .5s}.pwW{position:relative}.pwE{position:absolute;right:14px;top:50%;margin-top:-12px;cursor:pointer;font-size:17px;color:#64748b;transition:transform .3s}.pwE.on{transform:rotateY(360deg);color:var(--p)}
  `;document.head.appendChild(st);
  const fly=(x,y,txt,n,spread,col)=>{if(red())return;for(let i=0;i<n;i++){const e=document.createElement('i');e.className='fxP';e.textContent=txt;e.style.cssText=`left:${x}px;top:${y}px;font-style:normal;font-size:${14+Math.random()*10}px;--x:${(Math.random()-.5)*spread}px;--y:${-Math.random()*spread*.9-10}px;--r:${(Math.random()-.5)*300}deg;--d:${.7+Math.random()*.5}s;${col?'color:'+col:''}`;document.body.appendChild(e);setTimeout(()=>e.remove(),1300)}};
  const rain=(arr)=>{if(red())return;for(let i=0;i<20;i++){const e=document.createElement('i');e.className='fxRain';e.textContent=arr[i%arr.length];e.style.cssText=`left:${Math.random()*95}vw;animation-delay:${Math.random()*.7}s;font-style:normal`;document.body.appendChild(e);setTimeout(()=>e.remove(),2800)}};
  const failB=()=>{if(red())return;const d=document.createElement('div');d.className='failB';d.innerHTML='<div class="c"><svg width="56" height="56" viewBox="0 0 60 60"><path d="M16 16 L44 44 M44 16 L16 44"/></svg></div>';document.body.appendChild(d);setTimeout(()=>d.remove(),1300);try{TG&&TG.HapticFeedback&&TG.HapticFeedback.notificationOccurred('error')}catch{}};
  const giftB=()=>{if(red())return;const d=document.createElement('div');d.className='gift';d.innerHTML='<div class="b">🎁</div>';document.body.appendChild(d);setTimeout(()=>{d.remove();fly(innerWidth/2,innerHeight/2,'✨',16,260)},1300)};
  /* ৩ পেজ ট্রানজিশন */
  const _go=go;go=function(v){_go(v);const s=$('#v-'+v);if(s&&!red()){s.classList.remove('pgin');void s.offsetWidth;s.classList.add('pgin')}};
  /* ৪ নেভ ট্যাপ */
  $$('.nav a').forEach(a=>a.addEventListener('click',()=>{if(red())return;a.classList.remove('tapb');void a.offsetWidth;a.classList.add('tapb')}));
  /* ৯/১৪/১০ ব্যালেন্স বাড়লে টাকার বৃষ্টি + সোনালি তারা, কমলে লাল ঝলক */
  let lb=null;setInterval(()=>{const b=S.me&&S.me.balance;if(b==null)return;const v=+b;if(lb!==null&&Math.abs(v-lb)>=0.01){
    if(v>lb){rain(['💰','🪙','💵','⭐','✨']);try{TG&&TG.HapticFeedback&&TG.HapticFeedback.notificationOccurred('success')}catch{}}
    else if(!red()){$$('.bal,#fBal').forEach(e=>{e.classList.remove('balFlash');void e.offsetWidth;e.classList.add('balFlash')})}}
    lb=v},1200);
  /* ১২ কপি বাটনে টিক */
  document.addEventListener('click',e=>{const b=e.target.closest('[data-cp],#rCopy,#pxCp,#apCp');if(!b||b._cp)return;b._cp=1;const o=b.innerHTML;b.innerHTML='✔ কপি';b.classList.add('cpOk');setTimeout(()=>{b.innerHTML=o;b.classList.remove('cpOk');b._cp=0},1400)},true);
  /* ১৬ সার্ভিস বিস্তারিত খোলা, ২৪ ক্যাটাগরি বদলে ফেড */
  const info=$('#info');if(info){let wh=info.classList.contains('hide');new MutationObserver(()=>{const h=info.classList.contains('hide');if(wh&&!h&&!red()){info.classList.remove('expd');void info.offsetWidth;info.classList.add('expd')}wh=h}).observe(info,{attributes:true,attributeFilter:['class']})}
  const cat=$('#cat');if(cat)cat.addEventListener('change',()=>{if(red())return;const r=$('#svcBox')||$('#svc');if(r){r.classList.remove('svSw');void r.offsetWidth;r.classList.add('svSw')}});
  /* ১৭ মোট চার্জ নরমভাবে বদলানো */
  const tot=$('#total');if(tot){let own=false,cur=0;new MutationObserver(()=>{if(own||red())return;const m=tot.textContent.match(/^(\D*)([\d.]+)(.*)$/);if(!m)return;const to=parseFloat(m[2]),from=cur;cur=to;if(from===to)return;const dec=(m[2].split('.')[1]||'').length,t0=performance.now();own=true;const f=t=>{const p=Math.min(1,(t-t0)/450),e=1-Math.pow(1-p,3);own=true;tot.textContent=m[1]+(from+(to-from)*e).toFixed(dec)+m[3];own=p<1;if(p<1)requestAnimationFrame(f);else setTimeout(()=>own=false,0)};requestAnimationFrame(f)}).observe(tot,{childList:true,characterData:true,subtree:true})}
  /* ১৮ লিংক ঠিক/ভুল */
  const lk=$('#link');if(lk){lk.parentNode.style.position='relative';const t=document.createElement('span');t.className='lkTick hide';t.textContent='✔';lk.parentNode.insertBefore(t,lk.nextSibling);
    const ok=v=>/^https?:\/\/[^\s.]+\.[^\s]{2,}$/i.test(v.trim());
    lk.addEventListener('input',()=>{const v=lk.value;lk.classList.remove('lkBad');const g=ok(v);lk.classList.toggle('lkOk',g);t.classList.toggle('hide',!g);t.style.top=(lk.offsetTop+lk.offsetHeight/2-11)+'px'});
    lk.addEventListener('blur',()=>{if(lk.value&&!ok(lk.value)&&!red()){lk.classList.remove('lkBad');void lk.offsetWidth;lk.classList.add('lkBad')}})}
  /* ১৯/২১ অর্ডার বাটন: ঘূর্ণি → সফল টিক / ব্যর্থ লাল ✖ */
  const ob=$('#order');if(ob){const _o=ob.onclick;ob.onclick=async function(ev){ob.classList.add('busy');ob.classList.remove('shk');const tc=$('#toast');tc.className='toast';let err=null;try{await _o.call(this,ev)}catch(e){err=e}
    ob.classList.remove('busy');const bad=err||/\ber\b/.test(tc.className);if(bad&&!red()){ob.classList.add('shk');failB();setTimeout(()=>ob.classList.remove('shk'),900)}if(err)throw err}}
  /* ২৩ ফেভারিটে তারার বিস্ফোরণ */
  const fv=$('#favBtn');if(fv)fv.addEventListener('click',()=>{const r=fv.getBoundingClientRect();setTimeout(()=>{if(fv.classList.contains('on'))fly(r.left+r.width/2,r.top+r.height/2,'⭐',9,110)},60)});
  /* ৩৫ উপহার বাক্স: কোড/মিশন/বোনাসে ব্যালেন্স যোগ হলে */
  const _t=toast;toast=function(m,t){_t(m,t);if(t=='ok'&&/🎉/.test(m||'')&&/যোগ হয়েছে/.test(m||''))giftB()};
  /* ২৮ টেনে রিফ্রেশ (পাতা ঘোরে) */
  (function(){let y0=null,dy=0;const p=document.createElement('div');p.className='ptr';p.innerHTML='<i>🍀</i>';document.body.appendChild(p);
    document.addEventListener('touchstart',e=>{y0=(scrollY<=0&&!document.querySelector('.modal:not(.hide)'))?e.touches[0].clientY:null;dy=0},{passive:true});
    document.addEventListener('touchmove',e=>{if(y0==null)return;dy=e.touches[0].clientY-y0;if(dy>0&&scrollY<=0){p.style.top=Math.min(dy/2.2-40,60)+'px';p.firstChild.style.transform='rotate('+(dy*3)+'deg)'}},{passive:true});
    document.addEventListener('touchend',async()=>{if(y0==null)return;const go_=dy>130;y0=null;if(go_){p.classList.add('sp');p.style.top='70px';try{S._h='';await syncNow(true)}catch{}setTimeout(()=>{p.classList.remove('sp');p.style.top='-50px'},500)}else p.style.top='-50px'})})();
  /* ৪৩ ডার্ক মোড সূর্য/চাঁদ */
  const dk=$('#mDk');if(dk)dk.addEventListener('click',()=>{const ic=dk.querySelector('i.fa-solid');if(!ic)return;ic.style.transform='rotate(360deg) scale(1.3)';setTimeout(()=>{const d=document.documentElement.classList.contains('dark');ic.className='fa-solid '+(d?'fa-sun':'fa-moon');ic.style.transform=''},250)});
  /* ৪৯ পাসওয়ার্ড চোখ */
  $$('input[type=password]').forEach(i=>{if(i._pw)return;i._pw=1;const w=document.createElement('div');w.className='pwW';i.parentNode.insertBefore(w,i);w.appendChild(i);const e=document.createElement('span');e.className='pwE';e.textContent='👁';w.appendChild(e);i.style.paddingRight='44px';e.onclick=()=>{const s=i.type=='password';i.type=s?'text':'password';e.textContent=s?'🙈':'👁';e.classList.toggle('on',s)}});
})();
/* ---- নাম বদলানো, সাপ্তাহিক দাম-কমা তালিকা, অফলাইনে আগের অর্ডার তালিকা ---- */
(function(){
  const m=$('#mAp')||document.querySelector('#v-set .mi#mTut');if(!m||$('#mNm'))return;
  m.insertAdjacentHTML('beforebegin','<div class="mi" id="mNm"><span class="i"><i class="fa-solid fa-pen"></i></span>নাম বদলান<i class="fa-solid fa-chevron-right"></i></div><div class="mi" id="mDr"><span class="i"><i class="fa-solid fa-arrow-trend-down"></i></span>এই সপ্তাহে দাম কমেছে<i class="fa-solid fa-chevron-right"></i></div>');
  $('#mNm').onclick=()=>{G(`<div class="sec"><i class="fa-solid fa-pen"></i>নাম বদলান</div><div class="pc"><small style="color:var(--mu)">২–২৪ অক্ষর, লিংক বা @ ছাড়া। ৭ দিনে একবারই বদলানো যায়।</small><input id="nmI" maxlength="24" value="${esc((S.me&&S.me.name)||'')}" style="margin-top:8px"><button class="btn" id="nmGo">সেভ করুন</button></div>`);
    $('#nmGo').onclick=async()=>{const b=$('#nmGo');b.disabled=true;const r=await api('/u/name',{name:$('#nmI').value}).catch(()=>({error:'নেটওয়ার্ক সমস্যা'}));b.disabled=false;if(r.error)return toast(r.error,'er');toast('✅ নাম বদলেছে','ok');S._h='';syncNow(true);$('#gModal').classList.add('hide')}};
  $('#mDr').onclick=async()=>{G('<div class="empty">লোড হচ্ছে...</div>');const j=await api('/u/drops',{}).catch(()=>({error:1}));
    if(j.error)return G('<div class="empty">লোড করা যায়নি</div>');
    G(`<div class="sec"><i class="fa-solid fa-arrow-trend-down"></i>এই সপ্তাহে দাম কমেছে</div>`+((j.rows||[]).length?j.rows.map(r=>`<div class="hi" data-dr="${r.id}" style="cursor:pointer"><div><b>#${r.sid} ${esc(r.name)}</b><div style="font-size:12px;color:var(--mu)"><s>${tk(r.old)}</s> → <b style="color:#16a34a">${tk(r.now)}</b> / ১০০০</div></div><span class="st completed">-${r.pct}%</span></div>`).join(''):`<div class="empty">${esc(j.note||'এই সপ্তাহে কোনো সার্ভিসের দাম কমেনি')}</div>`));
    $$('[data-dr]').forEach(e=>e.onclick=()=>{const s=(S.svcs||[]).find(x=>x._id==e.dataset.dr);$('#gModal').classList.add('hide');go('home');if(s){const pl=$('#plat div[data-k="'+s.platform+'"]');if(pl)pl.click();setTimeout(()=>{try{$('#cat').value=s.category;$('#cat').dispatchEvent(new Event('change'));fillSvcs();$('#svc').value=s._id;pick(s._id)}catch(e){}},150)}})};
  /* অফলাইন: শেষ অর্ডার তালিকা ফোনে জমিয়ে রাখা */
  const key=()=>'ordc_'+S.uid,rep=(k,v)=>(v&&typeof v=='object'&&typeof v.toDate=='function')?{__ts:v.seconds}:v;
  const _sn=syncNow;syncNow=async function(f){await _sn(f);try{if(S.orders&&S.orders.length){localStorage.setItem(key(),JSON.stringify(S.orders.slice(0,40),rep))}
    else if(S.uid&&(!S.orders||!S.orders.length)){const c=localStorage.getItem(key());if(c&&!S._offl){S._offl=1;S.orders=fx(JSON.parse(c));rOrders();toast('📴 ইন্টারনেট সমস্যা — আগের অর্ডার তালিকা দেখাচ্ছি','er')}}}catch{}};
})();
/* ---- ১০৫ পেমেন্টের সময়-গণনা (রিমাইন্ডার) ---- */
(function(){
  const pf=$('#payForm');if(!pf||$('#payTm'))return;const d=document.createElement('div');d.id='payTm';d.style.cssText='background:#fff7ed;color:#c2410c;border-radius:12px;padding:10px 12px;font-size:13px;font-weight:600;margin-bottom:10px';pf.insertBefore(d,pf.firstChild);
  let t0=0,iv=null;const tick=()=>{const r=900-Math.floor((Date.now()-t0)/1000);if(r>0){const m=Math.floor(r/60),s=r%60;d.innerHTML='⏳ টাকা পাঠিয়ে <b>'+m+':'+String(s).padStart(2,'0')+'</b> মিনিটের মধ্যে TrxID জমা দিন, দ্রুত জমা দিলে দ্রুত অনুমোদন হয়'}else{d.innerHTML='⏰ সময় পেরিয়েছে। টাকা পাঠিয়ে থাকলে এখনই TrxID জমা দিন'}};
  let was=pf.classList.contains('hide');new MutationObserver(()=>{const h=pf.classList.contains('hide');if(was&&!h){t0=Date.now();clearInterval(iv);tick();iv=setInterval(tick,1000)}if(h)clearInterval(iv);was=h}).observe(pf,{attributes:true,attributeFilter:['class']});
})();
/* ---- সাপ্তাহিক চ্যালেঞ্জ: হোমের ওপর থেকে সরিয়ে সেটিংসের সবার ওপরের বাটনে ---- */
(function(){
  const box=$('#chalBox'),first=document.querySelector('#v-set .mi');if(!box||!first||$('#mCh'))return;
  box.remove();
  first.insertAdjacentHTML('beforebegin','<div class="mi" id="mCh"><span class="i"><i class="fa-solid fa-flag-checkered"></i></span>সাপ্তাহিক চ্যালেঞ্জ<i class="fa-solid fa-chevron-right"></i></div>');
  $('#mCh').onclick=()=>{G('<div id="chW"><div class="empty">লোড হচ্ছে...</div></div>');const w=$('#chW');w.innerHTML='';w.appendChild(box);loadChal(true);setTimeout(()=>{if(!box.innerHTML.trim())w.innerHTML='<div class="empty">এখন কোনো চ্যালেঞ্জ চালু নেই</div>'},1500)};
})();
/* ---- আরও ছোট অ্যানিমেশন: চাপলে নরম সংকোচন, তালিকার ধাপে ধাপে আসা, ইনপুটে আলো, নিচ থেকে মডাল ওঠা ---- */
(function(){
  if(matchMedia('(prefers-reduced-motion:reduce)').matches||localStorage.getItem('animOff')=='1')return;
  const st=document.createElement('style');let d='';for(let i=1;i<=8;i++)d+=`#olist>:nth-child(${i}),#dHist>:nth-child(${i}),#rList>:nth-child(${i}),#v-set .mi:nth-of-type(${i}){animation-delay:${i*45}ms}`;
  st.textContent=`
  .btn,.mi,.pc,.hi,.svi,.rbtn,.pmo button{transition:transform .12s ease,box-shadow .2s}
  .btn:active,.mi:active,.hi:active,.svi:active,.rbtn:active,.pmo button:active{transform:scale(.96)}
  #olist>*,#dHist>*,#rList>*,.pgin .mi{animation:lstIn .4s cubic-bezier(.2,.8,.2,1) both}@keyframes lstIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
  ${d}
  input:focus,select:focus,textarea:focus{box-shadow:0 0 0 4px rgba(30,136,229,.16);transition:box-shadow .2s}
  #gModal:not(.hide) #gBody{animation:shtUp .38s cubic-bezier(.2,1.1,.4,1) both}@keyframes shtUp{from{transform:translateY(60px);opacity:0}to{transform:none;opacity:1}}
  `;document.head.appendChild(st);
})();
/* ---- ক্যাটাগরি বাছাই: সুন্দর কার্ড-তালিকা (ফোনের সাধারণ সাদা-কালো ডায়ালগের বদলে) ---- */
(function(){
  const sel=$('#cat');if(!sel||$('#catBox'))return;
  const st=document.createElement('style');st.textContent=`
  #catBox{margin:2px 0 10px;border:1.5px solid var(--p);border-radius:18px;background:var(--card);overflow:hidden;box-shadow:0 0 0 3px rgba(30,136,229,.1)}
  #catBox .sh{display:flex;align-items:center;gap:12px;padding:13px 14px;cursor:pointer;background:linear-gradient(180deg,#f2f8ff,#e9f3ff)}
  #catBox .sh .nm{flex:1;font-weight:700;font-size:14.5px;line-height:1.35;color:var(--tx);word-break:break-word}
  #catBox .sh>i{color:var(--p);transition:.2s}#catBox.op .sh>i{transform:rotate(180deg)}
  .cci{flex:0 0 auto;width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:19px;box-shadow:0 4px 10px rgba(0,0,0,.15)}
  #catL{display:none;max-height:min(60vh,480px);overflow-y:auto;padding:10px;gap:9px;flex-direction:column;border-top:1px solid var(--bd);background:#f8fbff;-webkit-overflow-scrolling:touch}
  #catBox.op #catL{display:flex}
  .cai{display:flex;align-items:center;gap:12px;border:1.5px solid var(--bd);background:#eaf3ff;border-radius:16px;padding:10px 12px;cursor:pointer}
  .cai .nm{flex:1;font-weight:600;font-size:14px;line-height:1.4;color:var(--tx);word-break:break-word}
  .cai.on{background:linear-gradient(135deg,#2196f3,#1565c0);border-color:#1565c0;box-shadow:0 8px 20px #1e88e555}.cai.on .nm{color:#fff}
  .cai .ck{color:#fff;font-size:15px}`;document.head.appendChild(st);
  const box=document.createElement('div');box.id='catBox';
  box.innerHTML='<div class="sh" id="catH"><span class="cci" id="catHi"></span><span class="nm" id="catHn">ক্যাটাগরি বেছে নিন</span><i class="fa-solid fa-chevron-down"></i></div><div id="catL"></div>';
  sel.parentNode.insertBefore(box,sel);sel.style.display='none';
  const ico=cat=>{const s=(S.svcs||[]).find(x=>x.category==cat),p=(typeof PLATS!='undefined'&&PLATS.find(x=>x[0]==(s&&s.platform)))||['','fa-solid fa-layer-group','#1e88e5'];return `<span class="cci" style="background:${p[2]}"><i class="${p[1]}"></i></span>`};
  const paint=()=>{const L=$('#catL'),cur=sel.value,opts=[...sel.options].filter(o=>o.value||o.text);
    L.innerHTML=opts.map(o=>`<div class="cai${o.text==cur||o.value==cur?' on':''}" data-c="${esc(o.value||o.text)}">${ico(o.value||o.text)}<span class="nm">${esc(o.text)}</span>${o.text==cur||o.value==cur?'<i class="fa-solid fa-check ck"></i>':''}</div>`).join('')||'<div class="empty">কোনো ক্যাটাগরি নেই</div>';
    const h=$('#catHi');h.outerHTML=ico(cur).replace('class="cci"','class="cci" id="catHi"');$('#catHn').textContent=cur||'ক্যাটাগরি বেছে নিন';
    L.querySelectorAll('.cai').forEach(e=>e.onclick=()=>{sel.value=e.dataset.c;sel.dispatchEvent(new Event('change'));box.classList.remove('op');paint();box.scrollIntoView({block:'nearest',behavior:'smooth'})})};
  $('#catH').onclick=()=>{box.classList.toggle('op');if(box.classList.contains('op')){const o=box.querySelector('.cai.on');if(o)o.scrollIntoView({block:'center'})}};
  const _fc=fillCats;fillCats=function(){_fc();paint()};
  new MutationObserver(paint).observe(sel,{childList:true});
  paint();
})();
//==END==
