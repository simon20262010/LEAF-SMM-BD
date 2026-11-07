/* ===== app6: ডিপোজিট — ম্যানুয়াল / অটো (bKash গেটওয়ে) ===== */
(function(){
  const css=document.createElement('style');css.textContent=`.dtabs{display:flex;gap:8px;background:#e8eef7;border-radius:16px;padding:5px;margin:4px 0 14px}.dtabs button{flex:1;border:0;background:transparent;border-radius:12px;padding:11px 6px;font:700 14px inherit;color:var(--mu);cursor:pointer}.dtabs button.on{background:#fff;color:var(--p);box-shadow:0 3px 10px rgba(15,42,80,.12)}
  .bkq{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:8px 0 12px}.bkq button{border:1.5px solid var(--bd);background:#fff;border-radius:12px;padding:10px 0;font:700 14px inherit;color:var(--tx);cursor:pointer}.bkq button.on{border-color:#e2136e;background:#fff0f6;color:#e2136e}
  .bkgo{width:100%;border:0;border-radius:16px;padding:15px;font:800 16px inherit;color:#fff;background:linear-gradient(135deg,#e2136e,#b80f58);box-shadow:0 8px 20px rgba(226,19,110,.35);cursor:pointer}.bkgo:disabled{opacity:.6}`;document.head.appendChild(css)})();
let _dtab=null,_bkW=null;
function bkInit(){
  const f=$('#v-funds'),pms=$('#pms');if(!f||!pms||!S.me)return;
  const on=!!S.set.bkAutoOn&&!String(S.uid||'').startsWith('rb');
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
//==END==
