/* ============ 🔧 এখানে আপনার Firebase কনফিগ বসান ============ */
const firebaseConfig = {
  apiKey: "AIzaSyAR8SaD21V3i5OMPP44KWejhlUHG5__QSA",
  authDomain: "leaf-smm-bd.firebaseapp.com",
  databaseURL: "https://leaf-smm-bd-default-rtdb.firebaseio.com",
  projectId: "leaf-smm-bd",
  storageBucket: "leaf-smm-bd.firebasestorage.app",
  messagingSenderId: "815648491674",
  appId: "1:815648491674:web:817ad958496f39c12f7723",
  measurementId: "G-YKGNLGJEHL"
};
/* ============================================================ */
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getAuth,signInWithCustomToken,onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,updateProfile,sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const app=initializeApp(firebaseConfig),auth=getAuth(app);
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tk=n=>'৳'+(+n||0).toFixed(2);
const fd=t=>t?.toDate?t.toDate().toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}):'...';
const fx=o=>{if(Array.isArray(o))return o.map(fx);if(o&&typeof o=='object'){if('__ts' in o){const s=o.__ts;return{seconds:s,toDate:()=>new Date(s*1000)}}const r={};for(const k in o)r[k]=fx(o[k]);return r}return o};
function toast(m,t=''){const e=$('#toast');e.textContent=m;e.className='toast show '+t;clearTimeout(e._t);e._t=setTimeout(()=>e.className='toast',3200)}

const PLATS=[['all','fa-solid fa-table-cells-large','#fff'],['facebook','fa-brands fa-facebook','#1877f2'],['instagram','fa-brands fa-instagram','#e1306c'],['youtube','fa-brands fa-youtube','#ff0000'],['tiktok','fa-brands fa-tiktok','#000'],['telegram','fa-brands fa-telegram','#2aabee'],['twitter','fa-brands fa-x-twitter','#000'],['whatsapp','fa-brands fa-whatsapp','#25d366'],['other','fa-solid fa-chart-simple','#f97316']];
const LEVELS_DEF=[['Starter',0,0],['Bronze',500,2],['Silver',2000,4],['Gold',5000,6],['Diamond',15000,10]];
const SHP='M16 2 28 6V15C28 22 23 27 16 30 9 27 4 22 4 15V6Z';
const LVSVG=[
 `<circle cx="16" cy="16" r="14" fill="url(#gGr)" stroke="#166534" stroke-width="1.5"/><path d="M16 25V15" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="M16 18C16 12 11 11 8 12 8 17 11 19 16 18Z" fill="#fff"/><path d="M16 15C16 9 21 8 24 9 24 14 21 16 16 15Z" fill="#dcfce7"/>@@c0@@`,
 `<path d="${SHP}" fill="url(#gBr)" stroke="#6b3410" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 14 16 20 22 14" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>@@c1@@`,
 `<path d="${SHP}" fill="url(#gSi)" stroke="#475569" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 11 16 16 22 11M10 17 16 22 22 17" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="16" cy="7.5" r="1.4" fill="#fff"/>@@c1@@`,
 `<path d="M3 25 5 9l6 7 5-10 5 10 6-7 2 16Z" fill="url(#gGo)" stroke="#92400e" stroke-width="1.3" stroke-linejoin="round"/><path d="M4 25h24v4H4Z" fill="url(#gGo)" stroke="#92400e" stroke-width="1.3" stroke-linejoin="round"/><circle cx="5" cy="8" r="2" fill="#fff"/><circle cx="16" cy="5" r="2" fill="#fff"/><circle cx="27" cy="8" r="2" fill="#fff"/><circle cx="16" cy="19" r="2.6" fill="#ef4444" stroke="#fff" stroke-width=".8"/>@@c3@@`,
 `<path d="M9 4h14l7 8-14 18L2 12Z" fill="url(#gDi)" stroke="#1e3a8a" stroke-width="1.4" stroke-linejoin="round"/><path d="M2 12h28M9 4l3 8 4 18M23 4l-3 8-4 18M12 12l4-8 4 8" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="1"/><path class="sp" d="M26 3v6M23 6h6" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>@@c4@@`
];
const lvB=i=>{i=Math.max(0,Math.min(+i||0,4));return `<span class="lvb l${i}"><svg viewBox="0 0 32 32">${LVSVG[i].replace(/@@(c\d)@@/,'<g clip-path="url(#$1)"><rect class="sh" x="-14" y="0" width="9" height="32" fill="url(#gSh)"/></g>')}</svg></span>`};
const lvIdx=sp=>{let k=0;lvl().forEach((l,i)=>{if((sp||0)>=l[1])k=i});return k};
const lvl=()=>{const a=(S.set.levels||[]).map(x=>[x.name,+x.min||0,+x.disc||0]);return a.length?a:LEVELS_DEF};
const disc=()=>{const sp=S.me?.totalSpent||0;let d=0;lvl().forEach(l=>{if(sp>=l[1])d=l[2]});return d};
const ST=['pending','processing','completed','partial','canceled'];
const S={uid:null,me:null,set:{},svcs:[],orders:[],deps:[],tix:[],reqs:[],lb:null,team:[],plat:'all',cur:null,pm:null,of:'all',unsub:[]};

/* ---------- AUTH UI ---------- */
let mode='login';
const TG=window.Telegram?.WebApp||null;
if(TG){try{TG.ready();TG.expand();TG.setHeaderColor('#1e88e5');TG.setBackgroundColor('#f3f7fc');TG.disableVerticalSwipes&&TG.disableVerticalSwipes()}catch(e){}}
const tgUser=(TG&&TG.initDataUnsafe&&TG.initDataUnsafe.user)||null,tgStart=(TG&&TG.initDataUnsafe&&TG.initDataUnsafe.start_param)||'';
const openL=u=>{if(TG&&/^https:\/\/t\.me\//.test(u))TG.openTelegramLink(u);else if(TG)TG.openLink(u);else open(u,'_blank')};
const refParam=new URLSearchParams(location.search).get('ref')||tgStart;
const BOTID=(new URLSearchParams(location.search).get('b')||'').replace(/\D/g,''),RP=new URLSearchParams(location.search).get('rp')=='1';
if(tgUser)setTimeout(()=>{const n=[tgUser.first_name,tgUser.last_name].filter(Boolean).join(' ');if(n&&!$('#aName').value)$('#aName').value=n},0);
if(refParam)$('#aRef').value=refParam;
function setMode(m){mode=m;$('#tl').classList.toggle('on',m=='login');$('#tr').classList.toggle('on',m!='login');$('#nameBox').classList.toggle('hide',m=='login');$('#refBox').classList.toggle('hide',m=='login');$('#aBtn span').textContent=m=='login'?'লগইন করুন':'অ্যাকাউন্ট খুলুন';$('#aPass').autocomplete=m=='login'?'current-password':'new-password'}
$('#tl').onclick=()=>setMode('login');$('#tr').onclick=()=>setMode('reg');if(refParam)setMode('reg');
$('#aBtn').onclick=async()=>{
  const em=$('#aEmail').value.trim(),pw=$('#aPass').value,b=$('#aBtn');
  if(!em||pw.length<6)return toast('সঠিক ইমেইল ও কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন','er');
  b.disabled=true;
  try{
    if(mode=='login')await signInWithEmailAndPassword(auth,em,pw);
    else{
      const name=$('#aName').value.trim();if(!name){b.disabled=false;return toast('আপনার নাম দিন','er')}
      S._mk=true;const c=await createUserWithEmailAndPassword(auth,em,pw);
      await updateProfile(c.user,{displayName:name});
      let rb=$('#aRef').value.trim();if(rb===c.user.uid)rb='';
      const tgi=tgUser?{id:tgUser.id,username:tgUser.username||''}:null;const ji=await api('/u/init',{name,ref:rb,tg:tgi});S._mk=false;if(ji.error)throw new Error(ji.error);syncNow(true);
    }
  }catch(e){toast(errMsg(e),'er')}
  b.disabled=false;
};
$('#forgot').onclick=async()=>{const em=$('#aEmail').value.trim();if(!em)return toast('আগে ইমেইল লিখুন','er');try{await sendPasswordResetEmail(auth,em);toast('রিসেট লিংক ইমেইলে পাঠানো হয়েছে','ok')}catch(e){toast(errMsg(e),'er')}};
function errMsg(e){const c=e.code||'';if(c.includes('invalid-credential')||c.includes('wrong-password')||c.includes('user-not-found'))return'ইমেইল বা পাসওয়ার্ড ভুল';if(c.includes('email-already'))return'এই ইমেইল আগে থেকেই আছে';if(c.includes('weak'))return'পাসওয়ার্ড দুর্বল';if(c.includes('network'))return'ইন্টারনেট সংযোগ নেই';return e.message||'কিছু ভুল হয়েছে'}

/* ---------- টেলিগ্রাম অটো-লগইন (বট সার্ভার দরকার) ---------- */
const BOT_SERVER='';
async function botServer(){
  if(S._bs)return S._bs;if(BOT_SERVER)return S._bs=BOT_SERVER;
  let c='';try{c=localStorage.getItem('leafBS')||''}catch{}
  if(!c){try{const ac0=new AbortController(),tm0=setTimeout(()=>ac0.abort(),12000);const r=await fetch('https://firestore.googleapis.com/v1/projects/'+firebaseConfig.projectId+'/databases/(default)/documents/public/config?key='+firebaseConfig.apiKey,{signal:ac0.signal}),j=await r.json();clearTimeout(tm0);window.__T=window.__T||[];window.__T.push('cfg:'+r.status);c=j.fields?.botServer?.stringValue||'';if(c){try{localStorage.setItem('leafBS',c)}catch{}}}catch{}}
  if(c)S._bs=c;return c}
async function tgLogin(){
  try{window.__T=window.__T||[];window.__T.push('tg1');const bs=await botServer();window.__T=window.__T||[];window.__T.push('bs:'+(bs?'ok':'empty'));if(!bs)return false;
    const ac=new AbortController(),tm=setTimeout(()=>ac.abort(),20000);
    const r=await fetch(bs.replace(/\/$/,'')+'/auth/telegram',{method:'POST',signal:ac.signal,headers:{'Content-Type':'application/json'},body:JSON.stringify({initData:TG.initData})});clearTimeout(tm);window.__T=window.__T||[];window.__T.push('auth:'+r.status);
    const j=await r.json();
    if(j.error==='join'){showGate({channels:j.channels||[],support:j.support||''});return true}
    if(j.error==='banned'){document.body.innerHTML='<div class="empty" style="padding-top:30vh">আপনার অ্যাকাউন্টটি ব্লক করা হয়েছে।</div>';return true}
    if(!j.token)return false;
    await signInWithCustomToken(auth,j.token);window.__T=window.__T||[];window.__T.push('signed');return true}catch(e){console.warn(e);window.__T=window.__T||[];window.__T.push('err:'+String(e&&e.message||e).slice(0,80));return false}
}

/* ---------- SESSION (একবার লগইন করলেই থাকবে) ---------- */
window.__boot=1;window.__T=window.__T||[];window.__T.push('boot');
onAuthStateChanged(auth,u=>{window.__T=window.__T||[];window.__T.push('auth-cb:'+(u?'user':'null'));
  S.unsub.forEach(f=>f());S.unsub=[];clearInterval(S._catT);clearInterval(S._pt);S._h='';
  $('#load').classList.add('hide');
  if(u&&TG&&TG.initData&&tgUser&&!S._fix){const ex=BOTID?`rb${BOTID}_${tgUser.id}`:`tg${tgUser.id}`;
    if(u.uid!==ex&&(BOTID||/^(tg|rb)/.test(u.uid))){S._fix=true;S._tgTry=false;$('#load').classList.remove('hide');signOut(auth);return}}
  if(!u){S.uid=null;
    if(TG&&TG.initData&&!S._tgTry){S._tgTry=true;$('#load').classList.remove('hide');tgLogin().then(ok=>{if(!ok){$('#load').classList.add('hide');$('#app').classList.add('hide');$('#auth').classList.remove('hide')}});return}
    $('#app').classList.add('hide');$('#auth').classList.remove('hide');return}
  S.uid=u.uid;S.bot=null;$('#auth').classList.add('hide');$('#app').classList.remove('hide');loadBot();
  startCatalog();startSync();
});

/* ---------- NAV ---------- */
function go(v){$$('section').forEach(s=>s.classList.add('hide'));$('#v-'+v).classList.remove('hide');$$('.nav a').forEach(a=>a.classList.toggle('on',a.dataset.v==v));scrollTo(0,0)}
$$('.nav a').forEach(a=>a.onclick=()=>go(a.dataset.v));

function renderAll(){
  const sn=S.set.siteName||'SMM Panel';document.title=sn;$$('.sn').forEach(e=>e.textContent=sn);
  if(S.me?.banned){document.body.innerHTML='<div class="empty" style="padding-top:30vh"><i class="fa-solid fa-ban"></i>আপনার অ্যাকাউন্টটি ব্লক করা হয়েছে।<br>সাপোর্টে যোগাযোগ করুন।</div>';return}
  rNotice();rSale();rBanner();rPlat();rFunds();rSet();rRef();rPms();
}
function rNotice(){const n=S.set.notice;$('#noticeBox').innerHTML=n?`<div class="notice"><i class="fa-solid fa-bullhorn"></i><div>${esc(n)}</div></div>`:'';$('#bdot').classList.toggle('hide',!n)}
$('#bell').onclick=()=>toast(S.set.notice||'কোনো নতুন নোটিশ নেই');

/* banner */
let bi=0,bt;
function rBanner(){
  const imgs=(S.set.banners||[]).filter(Boolean);
  let h=imgs.length?imgs.map(u=>`<div class="slide"><img src="${esc(u)}" alt=""></div>`).join(''):
  `<div class="slide"><h3>${esc(S.set.siteName||'SMM Panel')}</h3><p>এক প্যানেলে সবকিছু 🚀</p><ul><li>সহজে অর্ডার, দামে কম মানে সেরা</li><li>রিসেলারদের জন্য বেস্ট প্যানেল</li></ul></div>
   <div class="slide"><h3>দ্রুত ডেলিভারি ⚡</h3><p>২৪/৭ সাপোর্ট ও অটো সার্ভিস</p><ul><li>নিরাপদ পেমেন্ট</li><li>রেফার করে ইনকাম করুন</li></ul></div>`;
  const n=imgs.length||2;
  $('#banner').innerHTML=h+`<div class="dots">${'<i></i>'.repeat(n)}</div>`;
  clearInterval(bt);const sl=$$('.slide'),ds=$$('.dots i');
  const show=()=>{sl.forEach((s,i)=>s.classList.toggle('on',i==bi%n));ds.forEach((d,i)=>d.classList.toggle('on',i==bi%n))};show();
  bt=setInterval(()=>{bi++;show()},3800);
}

/* platforms */
function rPlat(){$('#plat').innerHTML=PLATS.map(([k,ic,c])=>`<div data-k="${k}" class="${S.plat==k?'on':''}"><i class="${ic}" style="color:${S.plat==k?'#fff':(k=='all'?'#1e88e5':c)}"></i></div>`).join('');$$('#plat div').forEach(d=>d.onclick=()=>{S.plat=d.dataset.k;rPlat();fillCats()})}
function fillCats(){
  const list=S.svcs.filter(s=>S.plat=='all'||s.platform==S.plat);
  const cats=[...new Set(list.map(s=>s.category))];
  $('#cat').innerHTML=cats.length?cats.map(c=>`<option>${esc(c)}</option>`).join(''):'<option value="">কোনো সার্ভিস নেই</option>';
  fillSvcs();
}
function fillSvcs(){
  const list=S.svcs.filter(s=>s.category==$('#cat').value&&(S.plat=='all'||s.platform==S.plat));
  const fv=favs();list.sort((a,b)=>(fv.includes(b._id)-fv.includes(a._id)));
  $('#svc').innerHTML=list.map(s=>`<option value="${s._id}">${fv.includes(s._id)?'⭐ ':''}${s.pop?'🔥 ':''}${s.isNew?'🆕 ':''}${s.sale?'💥 ':''}${s.sid} - ${esc(s.name)}</option>`).join('');
  pick($('#svc').value);
}
function pick(id){
  const s=S.svcs.find(x=>x._id==id);S.cur=s||null;$('#info').classList.toggle('hide',!s);if(!s){calc();return}
  $('#iRate').innerHTML=(s.rateOld?`<s style="color:#94a3b8;font-weight:400">${tk(s.rateOld*(1-disc()/100))}</s> `:'')+tk(s.rate*(1-disc()/100))+(disc()?` (−${disc()}%)`:'')+(s.sale?` 🔥 -${s.sale}%`:'');
  $('#iRatR').classList.toggle('hide',!s.rcnt);if(s.rcnt)$('#iRat').textContent='★ '+(s.rsum/s.rcnt).toFixed(1)+' ('+s.rcnt+')';
  qSug(s);$('#iLim').textContent=s.min+' - '+s.max;$('#iAvg').textContent=s.avgTime||'N/A';
  const d=$('#iDesc');d.classList.toggle('hide',!s.desc);d.textContent=s.desc||'';$('#qty').placeholder=`e.g. ${s.min}`;calc();
}
const favs=()=>S.me?.favs||[];
function qSug(s){const L=[100,250,500,1000,2500,5000,10000,25000,50000,100000].filter(x=>x>=s.min&&x<=s.max);if(!L.includes(s.min))L.unshift(+s.min);
  const r=$('#qChips');r.innerHTML=L.slice(0,7).map(x=>`<span data-q="${x}">${x}</span>`).join('');r.querySelectorAll('[data-q]').forEach(e=>e.onclick=()=>{$('#qty').value=e.dataset.q;calc()})}
const LINKD={facebook:['facebook.com','fb.com','fb.watch','fb.me'],instagram:['instagram.com','instagr.am'],youtube:['youtube.com','youtu.be'],tiktok:['tiktok.com'],telegram:['t.me','telegram.me','telegram.org'],twitter:['twitter.com','x.com','t.co'],whatsapp:['whatsapp.com','wa.me']};
function linkOk(s,l){if(S.set.linkCheck===false)return true;const d=LINKD[String(s.platform||'').toLowerCase()];if(!d)return true;try{const h=new URL(l).hostname.toLowerCase();return d.some(x=>h==x||h.endsWith('.'+x))}catch{return false}}
let _sT;function rSale(){const p=+S.set.flashPct||0,en=(+S.set.flashEnd||0)*1000,b=$('#saleBox');clearInterval(_sT);
  if(!(p>0)||(en&&en<Date.now())){b.innerHTML='';return}
  const f=n=>String(n).padStart(2,'0'),upd=()=>{const l=Math.max(0,en-Date.now());if(en&&l<=0){clearInterval(_sT);b.innerHTML='';fetchCatalog&&fetchCatalog();return}const e=document.getElementById('saleCd');if(e)e.textContent=f(Math.floor(l/36e5))+':'+f(Math.floor(l/6e4)%60)+':'+f(Math.floor(l/1e3)%60)};
  b.innerHTML=`<div class="saleb"><div><b>🔥 ফ্ল্যাশ সেল — ${p}% ছাড়</b><br><small>${esc(S.set.flashScope&&S.set.flashScope!='all'?S.set.flashScope+' সার্ভিসে':'সব সার্ভিসে')}</small></div>${en?'<div class="cd" id="saleCd">--:--:--</div>':''}</div>`;
  if(en){upd();_sT=setInterval(upd,1000)}}
function rFav(){
  const fv=favs(),l=fv.map(id=>S.svcs.find(x=>x._id==id)).filter(Boolean).slice(0,10),r=$('#favRow');
  r.classList.toggle('hide',!l.length);r.innerHTML=l.map(s=>`<span data-f="${s._id}">⭐ ${s.sid} ${esc(s.name.slice(0,22))}</span>`).join('');
  $$('#favRow [data-f]').forEach(e=>e.onclick=()=>{const s=S.svcs.find(x=>x._id==e.dataset.f);S.plat='all';rPlat();fillCats();$('#cat').value=s.category;fillSvcs();$('#svc').value=s._id;pick(s._id)});
  const on=S.cur&&fv.includes(S.cur._id),b=$('#favBtn');b.textContent=on?'★':'☆';b.classList.toggle('on',!!on);
}
$('#favBtn').onclick=async()=>{if(!S.cur||!S.me)return;const on=!favs().includes(S.cur._id);S.me.favs=on?[S.cur._id,...favs()].slice(0,40):favs().filter(x=>x!=S.cur._id);rFav();
  const r=await api('/u/fav',{id:S.cur._id,on}).catch(()=>({error:1}));if(r.error){toast('ফেভারিট সেভ হয়নি','er');syncNow(true)}else{toast(on?'⭐ ফেভারিটে যোগ হয়েছে':'ফেভারিট থেকে সরানো হয়েছে','ok');S._h=''}};
function calc(){const q=+$('#qty').value||0,c=S.cur?S.cur.rate*q/1000*(1-disc()/100):0;$('#total').textContent=S.cur?tk(c):'৳0.00';
  const bal=+(S.me?.balance||0),lb=$('#lowB');if(c>0&&S.me&&bal<c){$('#lowT').textContent=`ব্যালেন্স কম — আরও ${tk(c-bal)} লাগবে`;lb.classList.remove('hide')}else lb.classList.add('hide');rFav()}
$('#lowGo').onclick=()=>{const c=S.cur?S.cur.rate*(+$('#qty').value||0)/1000*(1-disc()/100):0;go('funds');setTimeout(()=>{const a=$('#dAmt');if(a&&c){a.value=Math.ceil(c-(S.me?.balance||0))}},300)};
$('#cat').onchange=fillSvcs;$('#svc').onchange=e=>pick(e.target.value);$('#qty').oninput=calc;
$('#q').oninput=e=>{
  const v=e.target.value.trim().toLowerCase(),box=$('#sr');if(!v){box.classList.add('hide');return}
  const r=S.svcs.filter(s=>String(s.sid)==v||String(s.sid).startsWith(v)||s.name.toLowerCase().includes(v)).slice(0,20);
  box.innerHTML=r.map(s=>`<div data-id="${s._id}"><span class="idb">${s.sid}</span>${esc(s.name)}</div>`).join('')||'<div>কিছু পাওয়া যায়নি</div>';box.classList.remove('hide');
  $$('#sr div[data-id]').forEach(d=>d.onclick=()=>{const s=S.svcs.find(x=>x._id==d.dataset.id);S.plat='all';rPlat();fillCats();$('#cat').value=s.category;fillSvcs();$('#svc').value=s._id;pick(s._id);box.classList.add('hide');$('#q').value=''});
};
$('#schOn').onchange=e=>{const i=$('#schAt');i.classList.toggle('hide',!e.target.checked);if(e.target.checked&&!i.value){const d=new Date(Date.now()+36e5);d.setMinutes(d.getMinutes()-d.getTimezoneOffset());i.value=d.toISOString().slice(0,16)}};
$('#order').onclick=async()=>{
  const s=S.cur,link=$('#link').value.trim(),q=parseInt($('#qty').value);
  if(!S.me)return toast('প্রোফাইল লোড হচ্ছে, কয়েক সেকেন্ড পর আবার চেষ্টা করুন','er');
  if(!s)return toast('সার্ভিস সিলেক্ট করুন','er');
  if(!/^https?:\/\/.+/i.test(link))return toast('সঠিক লিংক দিন (https://...)','er');
  if(!linkOk(s,link))return toast('এই সার্ভিসের জন্য '+(s.platform||'')+' এর লিংক দিন','er');
  if(!q||q<s.min||q>s.max)return toast(`পরিমাণ ${s.min} থেকে ${s.max} এর মধ্যে হতে হবে`,'er');
  const b=$('#order');b.disabled=true;
  try{
    if($('#schOn').checked){
      const t=new Date($('#schAt').value).getTime();if(!t)throw new Error('সময় বেছে নিন');
      const js=await api('/u/schedule',{serviceId:s._id,link,quantity:q,runAt:t/1000});if(js.error)throw new Error(js.error);
      toast('⏰ অর্ডার শিডিউল হয়েছে','ok');$('#schOn').checked=false;$('#schAt').classList.add('hide');
    }else{
      const jo=await api('/u/order',{serviceId:s._id,link,quantity:q});if(jo.error)throw new Error(jo.error);syncNow(true);
      toast('✅ অর্ডার সফল হয়েছে','ok');celebrate();
    }
    $('#link').value='';$('#qty').value='';calc();go('orders');S._sch=0;loadSched();
  }catch(e){toast(e.message,'er')}
  b.disabled=false;
};

/* ---------- ORDERS ---------- */
function rOrders(){
  const cnt=k=>k=='all'?S.orders.length:S.orders.filter(o=>o.status==k).length;
  $('#chips').innerHTML=['all',...ST].map(k=>`<div class="chip ${S.of==k?'on':''}" data-k="${k}"><b>${cnt(k)}</b>${k=='all'?'সব':k.toUpperCase()}</div>`).join('');
  numAnim($$('#chips .chip b'),'ch');$$('.chip').forEach(c=>c.onclick=()=>{S.of=c.dataset.k;rOrders()});
  const q=$('#oq').value.trim().toLowerCase();
  const l=S.orders.filter(o=>(S.of=='all'||o.status==S.of)&&(!q||o.orderNo.includes(q)||o.serviceName.toLowerCase().includes(q)));
  $('#olist').innerHTML=l.map(o=>`<div class="oc"><div class="h"><div><small>#${o.sid}</small><h4>${esc(o.serviceName)}</h4></div><span class="st ${o.status}">${o.status}</span></div>
  <div style="font-size:12px;color:var(--mu);margin-top:8px"><i class="fa-regular fa-calendar"></i> ${fd(o.createdAt)}</div>
  <div class="meta"><span>QUANTITY<b>${o.quantity}</b></span><span>CHARGE<b>${tk(o.charge)}</b></span><span>ORDER ID<b>${o.orderNo}</b></span></div>
  <div class="lk"><i class="fa-solid fa-link"></i> ${esc(o.link)}</div>${(o.status=='pending'||o.status=='processing')&&o.progress?`<div style="font-size:12px;margin-top:10px;display:flex;justify-content:space-between"><span>⏳ চলছে</span><b>${o.progress}%</b></div><div class="pbar" style="margin-top:4px"><i style="width:${o.progress}%"></i></div>`:''}<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="rbtn" data-ro="${o._id}"><i class="fa-solid fa-rotate-right"></i> আবার অর্ডার</button>${(o.status=='completed'||o.status=='partial')?(o.rated?`<span class="rbtn" style="background:#fff7e0;color:#d97706;cursor:default">★ ${o.rated}</span>`:`<button class="rbtn" style="background:#fff7e0;color:#d97706" data-rt="${o._id}">⭐ রেটিং দিন</button>`):''}${o.status=='pending'?`<button class="rbtn" style="background:#fee2e2;color:#dc2626" data-cx="${o._id}">বাতিলের অনুরোধ</button>`:''}</div>${o.note?`<div class="notice" style="margin:10px 0 0">${esc(o.note)}</div>`:''}</div>`).join('')||'<div class="empty"><i class="fa-solid fa-box-open"></i>কোনো অর্ডার নেই</div>';
}
$('#oq').oninput=rOrders;
document.addEventListener('click',e=>{const b=e.target.closest('[data-ro]');if(!b)return;const o=S.orders.find(x=>x._id==b.dataset.ro),s=o&&S.svcs.find(x=>x._id==o.serviceId);
  if(!s)return toast('সার্ভিসটি এখন নেই','er');S.plat='all';rPlat();fillCats();$('#cat').value=s.category;fillSvcs();$('#svc').value=s._id;pick(s._id);$('#link').value=o.link;$('#qty').value=o.quantity;calc();go('home');toast('তথ্য বসানো হয়েছে, কনফার্ম করুন','ok')});

document.addEventListener('click',async e=>{
  const t=e.target.closest('[data-rt]');
  if(t){const id=t.dataset.rt;let st=0;G(`<div class="sec"><i class="fa-solid fa-star"></i>সার্ভিসটি কেমন লাগল?</div><div class="stars" id="stR">${[1,2,3,4,5].map(i=>`<span data-s="${i}">⭐</span>`).join('')}</div><button class="btn" id="stGo">রেটিং দিন</button>`);
    $$('#stR span').forEach(x=>x.onclick=()=>{st=+x.dataset.s;$$('#stR span').forEach(y=>y.classList.toggle('on',+y.dataset.s<=st))});
    $('#stGo').onclick=async()=>{if(!st)return toast('তারা বেছে নিন','er');const r=await api('/u/rate',{orderId:id,stars:st});if(r.error)return toast(r.error,'er');toast('ধন্যবাদ! ⭐','ok');$('#gModal').classList.add('hide');S._h='';syncNow(true)};return}
  const c=e.target.closest('[data-cx]');
  if(c){if(!confirm('এই অর্ডার বাতিলের অনুরোধ পাঠাবেন? অ্যাডমিন দেখে টাকা ফেরত দেবেন।'))return;const r=await api('/u/request',{type:'refund',orderId:c.dataset.cx,note:'ইউজার অর্ডার বাতিল চান'});r.error?toast(r.error,'er'):(toast('অনুরোধ পাঠানো হয়েছে','ok'),syncNow(true))}
});
async function loadSched(){
  if(S._sch&&Date.now()-S._sch<60000)return;S._sch=Date.now();
  const j=await api('/u/schedule',{op:'list'}).catch(()=>({items:[]}));const l=(j.items||[]).filter(x=>x.status=='wait'||x.status=='failed').slice(0,5);
  $('#schBox').innerHTML=l.length?`<div class="sec" style="margin-top:0"><i class="fa-solid fa-clock"></i>শিডিউল করা অর্ডার</div>`+l.map(x=>`<div class="hi"><div><b>${esc((x.name||'').slice(0,34))}</b><div style="font-size:12px;color:var(--mu)">${new Date(x.t*1000).toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})} • ${x.qty}${x.status=='failed'?' • ❌ '+esc(x.err):''}</div></div>${x.status=='wait'?`<button class="rbtn" style="margin:0;background:#fee2e2;color:#dc2626" data-sc="${x.id}">বাতিল</button>`:'<span class="st canceled">failed</span>'}</div>`).join(''):'';
  $$('[data-sc]').forEach(b=>b.onclick=async()=>{await api('/u/schedule',{op:'cancel',id:b.dataset.sc});S._sch=0;loadSched()})}
async function loadBundles(){
  if(S._bun&&Date.now()-S._bun<120000)return;S._bun=Date.now();
  const j=await api('/u/bundles').catch(()=>({items:[]}));S._buns=j.items||[];
  $('#bunBox').innerHTML=S._buns.length?`<div class="sec" style="margin-top:22px"><i class="fa-solid fa-box-open"></i>প্যাক অফার</div>`+S._buns.map(b=>`<div class="bun"><h4>${esc(b.name)}${b.discount?` <span class="st completed" style="font-size:11px">−${b.discount}%</span>`:''}</h4>${b.desc?`<small style="color:var(--mu)">${esc(b.desc)}</small>`:''}<ul>${b.items.map(i=>`<li>${esc(i)}</li>`).join('')}</ul><div class="pr"><div>${b.discount?`<s>${tk(b.old)}</s>`:''}<b>${tk(b.price)}</b></div><button class="rbtn" style="margin:0;background:var(--p);color:#fff" data-bn="${b._id}">অর্ডার করুন</button></div></div>`).join(''):'';
  $$('[data-bn]').forEach(x=>x.onclick=()=>{const b=S._buns.find(y=>y._id==x.dataset.bn);
    G(`<div class="sec"><i class="fa-solid fa-box-open"></i>${esc(b.name)}</div><div style="font-size:13px;color:var(--mu)">${b.items.map(esc).join('<br>')}</div><div style="font:700 20px Poppins;color:var(--p);margin:10px 0">${tk(b.price)}</div><label class="l">টার্গেট লিংক</label><input id="bnL" placeholder="https://..."><button class="btn" id="bnGo">অর্ডার নিশ্চিত করুন</button>`);
    $('#bnGo').onclick=async()=>{const l=$('#bnL').value.trim();if(!/^https?:\/\/.+/i.test(l))return toast('সঠিক লিংক দিন','er');const bt=$('#bnGo');bt.disabled=true;const r=await api('/u/bundle-order',{id:b._id,link:l});bt.disabled=false;if(r.error)return toast(r.error,'er');$('#gModal').classList.add('hide');toast('✅ '+r.count+'টি অর্ডার হয়েছে','ok');celebrate();syncNow(true);go('orders')}})}

/* ---------- FUNDS ---------- */
$('#pmB').onclick=async()=>{const c=$('#pmC').value.trim();if(c.length<3)return toast('কোড লিখুন','er');const b=$('#pmB');b.disabled=true;
  const r=await api('/u/promo',{code:c}).catch(()=>({error:'সংযোগ হয়নি'}));b.disabled=false;
  if(r.error)return toast(r.error,'er');$('#pmC').value='';toast('🎉 ৳'+r.amount+' ব্যালেন্সে যোগ হয়েছে','ok');celebrate();syncNow(true)};
function rFunds(){countUp($('#fBal'),+(S.me?.balance||0));
  const rl=String(S.set.depBonusRules||'').split('\n').map(l=>l.match(/^\s*(\d+(?:\.\d+)?)\s*[=:]\s*(\d+(?:\.\d+)?)/)).filter(Boolean).map(m=>`${bnum(m[1])}৳+ → ${bnum(m[2])}%`),fp=+S.set.firstDepBonus||0;
  $('#bonusBox').innerHTML=(rl.length||fp)&&!S.bot?.tenant?`<div class="notice" style="margin:0 0 12px;line-height:1.7">🎁 <b>ডিপোজিট বোনাস</b>${rl.length?'<br>'+rl.join(' • '):''}${fp?`<br>প্রথম ডিপোজিটে বাড়তি <b>${bnum(fp)}%</b>`:''}</div>`:''}
function rPms(){
  const m=S.set.methods||[];
  $('#pms').innerHTML=m.map((x,i)=>`<div class="pm ${S.pm===i?'on':''}" data-i="${i}"><div class="ico"><i class="fa-solid fa-mobile-screen-button"></i></div><div><b style="font-size:17px">${esc(x.name)}</b><div style="font-size:13px;color:var(--mu)">${esc(x.note||'Send Money')}</div></div><span class="r"></span></div>`).join('')||'<div class="empty">অ্যাডমিন এখনো পেমেন্ট মেথড যোগ করেননি</div>';
  $$('.pm').forEach(p=>p.onclick=()=>{S.pm=+p.dataset.i;rPms();const x=m[S.pm];$('#payForm').classList.remove('hide');$('#how').innerHTML=`${esc(x.name)} এ নিচের নাম্বারে <b>Send Money</b> করুন:<br><b>${esc(x.number)}</b><br>এরপর নিচের ফর্মে Transaction ID দিন। ন্যূনতম ডিপোজিট: <b>৳${S.set.minDeposit||10}</b>`});
}
$('#dBtn').onclick=async()=>{
  const m=(S.set.methods||[])[S.pm],amt=+$('#dAmt').value,from=$('#dFrom').value.trim(),trx=$('#dTrx').value.trim().toUpperCase(),min=+S.set.minDeposit||10;
  if(!S.me)return toast('প্রোফাইল লোড হচ্ছে, কয়েক সেকেন্ড পর আবার চেষ্টা করুন','er');
  if(!m)return toast('পেমেন্ট মেথড সিলেক্ট করুন','er');
  if(!amt||amt<min)return toast(`ন্যূনতম ডিপোজিট ৳${min}`,'er');
  if(from.length<6||trx.length<6)return toast('নাম্বার ও TrxID সঠিকভাবে দিন','er');
  const b=$('#dBtn');b.disabled=true;
  try{const jd=await api('/u/deposit',{method:m.name,amount:amt,from,trx});if(jd.error)throw new Error(jd.error);syncNow(true);
    toast('✅ রিকোয়েস্ট জমা হয়েছে, অ্যাডমিন যাচাই করে ব্যালেন্স যোগ করবেন','ok');celebrate();$('#dAmt').value=$('#dFrom').value=$('#dTrx').value='';$('#payForm').classList.add('hide');S.pm=null;rPms();
  }catch(e){toast(errMsg(e),'er')}b.disabled=false;
};
function rDeps(){$('#dHist').innerHTML=S.deps.map(d=>`<div class="hi"><div><b>${tk(d.amount)}</b> <small style="color:var(--mu)">${esc(d.method)}</small><div style="font-size:12px;color:var(--mu)">${esc(d.trx)} • ${fd(d.createdAt)}</div></div><span class="st ${d.status=='approved'?'completed':d.status=='rejected'?'canceled':'pending'}">${d.status}</span></div>`).join('')||'<div class="empty"><i class="fa-solid fa-receipt"></i>কোনো ইতিহাস নেই</div>'}
//==END==
