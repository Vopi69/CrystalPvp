
(() => {
const $=id=>document.getElementById(id);
const assets='https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.4/assets/minecraft/textures/';
const imgs={
anchor:assets+'item/respawn_anchor.png',glowstone:assets+'item/glowstone.png',totem:assets+'item/totem_of_undying.png',
crystal:assets+'item/end_crystal.png'
};
const defaultBinds={anchor:'q',glowstone:'e',totem:'r',break:'mouse0',place:'mouse2',cTotem:'f'};
let binds={...defaultBinds,...load('cp-binds',{})}, theme=load('cp-theme','dark'), lang=load('cp-lang','cs');
let a={phase:'empty',charge:0,cycles:0,errors:0,anchorExplodes:0,glowExplodes:0,running:false,end:0,timer:null,last:0,best:Number(load('cp-abest',0))||0,selected:''};
let c={running:false,end:0,timer:null,startAt:0,placed:0,broken:0,misses:0,clicks:0,events:[],best:Number(load('cp-cbest',0))||0,last:0};
let records=load('cp-records',[]);
const dict={
cs:{home:'Domů',leaderboard:'Leaderboard',settings:'Nastavení',tagline:'Trénuj. Zlepšuj se.',welcome:'Vítej v Crystal Practice',choose:'Vyber si trénink a zlepšuj svoji rychlost i přesnost.',anchorDesc:'Nabíjej anchory, trénuj odpaly a dokončuj cykly za 10 sekund.',crystalDesc:'Měř crystaly za sekundu, rychlost klikání a přesnost.',open:'Otevřít trénink →',recent:'Tvoje statistiky',bestAnchor:'Nejlepší anchor run',bestCps:'Nejlepší CPS',totalCycles:'Celkem cyklů',anchorSubtitle:'Dokonči co nejvíce kompletních cyklů za 10 sekund.',cycles:'Kompletní cykly',time:'Čas',record:'Osobní rekord',binds:'Bindy',bindTip:'Klikni na změnu a stiskni novou klávesu. Akce lze provést i myší.',anchorStats:'Statistiky odpalů',anchorShots:'Odpaly anchorem',glowShots:'Odpaly glowstonem',errors:'Chyby',arenaNote:'Klávesy vybírají item. Pravý klik myši nebo mezerník provede použití v simulaci.',step1:'Polož anchor do prázdné arény.',step2:'Nabij anchor až na 4/4.',step3:'Odpaly se počítají podle použitého itemu.',crystalSubtitle:'Měř rychlost pokládání krystalů a přesnost klikání.',cps:'Crystaly / sekundu',crystals:'Položené crystaly',accuracy:'Přesnost',crystalNote:'Web měří akce v simulaci, ne skutečné akce uvnitř Minecraftu.',mouseTip:'Doporučeno: levé tlačítko pro ničení, pravé pro pokládání. Fungují i boční tlačítka X1/X2.',crystalStats:'Statistiky',placed:'Položené crystaly',broken:'Zničené crystaly',misses:'Neplatné akce',localDesc:'Lokální výsledky uložené v tomto prohlížeči.',saveRecord:'Uložit poslední výsledek',player:'Hráč',globalNote:'Pro globální žebříček všech hráčů je potřeba externí databáze.',settingsDesc:'Přizpůsob si vzhled a ovládání.',theme:'Vzhled',themeDesc:'Přepni mezi tmavým a světlým režimem.',language:'Jazyk',languageDesc:'Vyber jazyk rozhraní.',resetSettings:'Reset lokálních dat',resetDesc:'Smaže uložené bindy, osobní rekordy a lokální výsledky.',reset:'Resetovat',privacy:'Data zůstávají v tomto prohlížeči. Stránka neovládá přímo Minecraft klienta.'},
en:{home:'Home',leaderboard:'Leaderboard',settings:'Settings',tagline:'Practice. Improve.',welcome:'Welcome to Crystal Practice',choose:'Choose a mode and improve your speed and accuracy.',anchorDesc:'Charge anchors, practise detonations and complete cycles in 10 seconds.',crystalDesc:'Measure crystals per second, clicking speed and accuracy.',open:'Open practice →',recent:'Your statistics',bestAnchor:'Best anchor run',bestCps:'Best CPS',totalCycles:'Total cycles',anchorSubtitle:'Complete as many full cycles as possible in 10 seconds.',cycles:'Complete cycles',time:'Time',record:'Personal best',binds:'Keybinds',bindTip:'Click Change and press a new key. Actions can also be performed with the mouse.',anchorStats:'Detonation stats',anchorShots:'Anchor detonations',glowShots:'Glowstone detonations',errors:'Errors',arenaNote:'Keys select items. Right-click or Space performs the action in this simulation.',step1:'Place an anchor in the empty arena.',step2:'Charge the anchor up to 4/4.',step3:'Detonations are counted by the item used.',crystalSubtitle:'Measure crystal placement speed and clicking accuracy.',cps:'Crystals / second',crystals:'Crystals placed',accuracy:'Accuracy',crystalNote:'The website measures simulated actions, not actions inside Minecraft.',mouseTip:'Recommended: left mouse to break, right mouse to place. Side buttons X1/X2 are also supported.',crystalStats:'Statistics',placed:'Crystals placed',broken:'Crystals broken',misses:'Invalid actions',localDesc:'Local results saved in this browser.',saveRecord:'Save last result',player:'Player',globalNote:'A global leaderboard requires an external database.',settingsDesc:'Customize appearance and controls.',theme:'Appearance',themeDesc:'Switch between light and dark mode.',language:'Language',languageDesc:'Choose the interface language.',resetSettings:'Reset local data',resetDesc:'Deletes saved binds, personal records and local results.',reset:'Reset',privacy:'Data stays in this browser. The page does not control the Minecraft client.'},
de:{home:'Startseite',leaderboard:'Bestenliste',settings:'Einstellungen',tagline:'Trainieren. Verbessern.',welcome:'Willkommen bei Crystal Practice',choose:'Wähle einen Modus und verbessere Tempo und Genauigkeit.',anchorDesc:'Lade Anchors auf und absolviere Zyklen in 10 Sekunden.',crystalDesc:'Miss Kristalle pro Sekunde, Klicktempo und Genauigkeit.',open:'Training öffnen →',recent:'Deine Statistiken',bestAnchor:'Bester Anchor-Lauf',bestCps:'Beste CPS',totalCycles:'Zyklen insgesamt',anchorSubtitle:'Schließe in 10 Sekunden so viele vollständige Zyklen wie möglich ab.',cycles:'Vollständige Zyklen',time:'Zeit',record:'Persönlicher Rekord',binds:'Tastenbelegung',bindTip:'Klicke auf Ändern und drücke eine neue Taste. Aktionen sind auch per Maus möglich.',anchorStats:'Detonationsstatistik',anchorShots:'Anchor-Detonationen',glowShots:'Glowstone-Detonationen',errors:'Fehler',arenaNote:'Tasten wählen Items. Rechtsklick oder Leertaste führt die Aktion in der Simulation aus.',step1:'Platziere einen Anchor in der leeren Arena.',step2:'Lade den Anchor bis 4/4 auf.',step3:'Detonationen werden nach verwendetem Item gezählt.',crystalSubtitle:'Miss Kristall-Platzierungsgeschwindigkeit und Klickgenauigkeit.',cps:'Kristalle / Sekunde',crystals:'Platzierte Kristalle',accuracy:'Genauigkeit',crystalNote:'Die Website misst simulierte Aktionen, nicht Aktionen in Minecraft.',mouseTip:'Empfohlen: linke Maustaste zum Zerstören, rechte zum Platzieren. Seitentasten X1/X2 funktionieren auch.',crystalStats:'Statistiken',placed:'Platzierte Kristalle',broken:'Zerstörte Kristalle',misses:'Ungültige Aktionen',localDesc:'Lokal in diesem Browser gespeicherte Ergebnisse.',saveRecord:'Letztes Ergebnis speichern',player:'Spieler',globalNote:'Eine globale Bestenliste benötigt eine externe Datenbank.',settingsDesc:'Passe Darstellung und Steuerung an.',theme:'Darstellung',themeDesc:'Zwischen hellem und dunklem Modus wechseln.',language:'Sprache',languageDesc:'Wähle die Sprache der Oberfläche.',resetSettings:'Lokale Daten zurücksetzen',resetDesc:'Löscht Tastenbelegungen, Rekorde und lokale Ergebnisse.',reset:'Zurücksetzen',privacy:'Daten bleiben in diesem Browser. Die Seite steuert den Minecraft-Client nicht.'},
sk:{home:'Domov',leaderboard:'Rebríček',settings:'Nastavenia',tagline:'Trénuj. Zlepšuj sa.',welcome:'Vitaj v Crystal Practice',choose:'Vyber si tréning a zlepšuj rýchlosť aj presnosť.',anchorDesc:'Nabíjaj anchory a dokončuj cykly za 10 sekúnd.',crystalDesc:'Meraj crystaly za sekundu, rýchlosť klikania a presnosť.',open:'Otvoriť tréning →',recent:'Tvoje štatistiky',bestAnchor:'Najlepší anchor run',bestCps:'Najlepšie CPS',totalCycles:'Celkom cyklov',anchorSubtitle:'Dokonči čo najviac úplných cyklov za 10 sekúnd.',cycles:'Úplné cykly',time:'Čas',record:'Osobný rekord',binds:'Bindy',bindTip:'Klikni na zmenu a stlač novú klávesu. Akcie možno vykonať aj myšou.',anchorStats:'Štatistiky odpalov',anchorShots:'Odpaly anchorom',glowShots:'Odpaly glowstonom',errors:'Chyby',arenaNote:'Klávesy vyberajú item. Pravé tlačidlo alebo medzerník vykoná akciu v simulácii.',step1:'Polož anchor do prázdnej arény.',step2:'Nabi anchor až na 4/4.',step3:'Odpaly sa počítajú podľa použitého itemu.',crystalSubtitle:'Meraj rýchlosť pokladania crystalov a presnosť klikania.',cps:'Crystaly / sekundu',crystals:'Položené crystaly',accuracy:'Presnosť',crystalNote:'Web meria akcie v simulácii, nie skutočné akcie v Minecrafte.',mouseTip:'Odporúčané: ľavé tlačidlo na ničenie, pravé na pokladanie. Fungujú aj bočné tlačidlá X1/X2.',crystalStats:'Štatistiky',placed:'Položené crystaly',broken:'Zničené crystaly',misses:'Neplatné akcie',localDesc:'Lokálne výsledky uložené v tomto prehliadači.',saveRecord:'Uložiť posledný výsledok',player:'Hráč',globalNote:'Globálny rebríček vyžaduje externú databázu.',settingsDesc:'Prispôsob si vzhľad a ovládanie.',theme:'Vzhľad',themeDesc:'Prepni medzi svetlým a tmavým režimom.',language:'Jazyk',languageDesc:'Vyber jazyk rozhrania.',resetSettings:'Reset lokálnych dát',resetDesc:'Vymaže bindy, osobné rekordy a lokálne výsledky.',reset:'Resetovať',privacy:'Dáta zostávajú v tomto prehliadači. Stránka neovláda Minecraft klienta.'}
};
function load(k,f){try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
function tr(k){return (dict[lang]||dict.cs)[k]||dict.cs[k]||k}
function applyLang(){document.documentElement.lang=lang;document.querySelectorAll('[data-i]').forEach(el=>{const k=el.dataset.i;if(tr(k))el.textContent=tr(k)});$('language').value=lang;$('language2').value=lang;renderBinds();renderRecords()}
function setTheme(){document.body.classList.toggle('light',theme==='light');save('cp-theme',theme)}
function navigate(page){document.querySelectorAll('main>section').forEach(s=>s.classList.add('hidden'));$('page-'+page).classList.remove('hidden');document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===page));$('sidebar').classList.remove('open');if(page==='home')updateHome()}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>navigate(b.dataset.page));
document.querySelectorAll('[data-goto]').forEach(el=>el.onclick=()=>navigate(el.dataset.goto));
$('menuBtn').onclick=()=>$('sidebar').classList.toggle('open');
$('themeBtn').onclick=$('themeSetting').onclick=()=>{theme=theme==='dark'?'light':'dark';setTheme()};
$('language').onchange=$('language2').onchange=e=>{lang=e.target.value;save('cp-lang',lang);applyLang()};
setTheme();applyLang();

function bindLabel(k){return ({anchor:'Anchor',glowstone:'Glowstone',totem:'Totem',break:'Crystal (ničení)',place:'Crystal (pokládání)',cTotem:'Totem'})[k]}
function keyLabel(k){return k==='mouse0'?'LMB':k==='mouse2'?'RMB':k==='mouse1'?'MMB':k==='mouse3'?'X1':k==='mouse4'?'X2':k.toUpperCase()}
let waiting=null;
function renderBinds(){
 for(const [container,keys] of [['anchorBinds',['anchor','glowstone','totem']],['crystalBinds',['break','place','cTotem']]]){
  const root=$(container);root.innerHTML='';
  keys.forEach(k=>{const row=document.createElement('div');row.className='bindrow';const img=document.createElement('img');img.className='itemimg';img.src=k==='anchor'?imgs.anchor:k==='glowstone'?imgs.glowstone:k==='totem'||k==='cTotem'?imgs.totem:imgs.crystal;img.alt='';
   const name=document.createElement('div');name.textContent=bindLabel(k);const key=document.createElement('span');key.className='key';key.textContent=keyLabel(binds[k]);const btn=document.createElement('button');btn.textContent=waiting===k?'Stiskni…':'Změnit';btn.onclick=()=>{waiting=k;renderBinds()};row.append(img,name,key,btn);root.append(row);
  });
 }
}
document.addEventListener('keydown',e=>{
 if(waiting){e.preventDefault();if(e.key==='Escape'){waiting=null;renderBinds();return}const k=e.key.toLowerCase();if(Object.entries(binds).some(([id,v])=>id!==waiting&&v===k)){return}binds[waiting]=k;waiting=null;save('cp-binds',binds);renderBinds();return}
 if(/INPUT|SELECT/.test(document.activeElement.tagName))return;
 const k=e.key.toLowerCase();const found=Object.keys(binds).find(id=>binds[id]===k);
 if(found){e.preventDefault();if(['anchor','glowstone','totem'].includes(found)){a.selected=found;setAStatus('Vybrán: '+bindLabel(found))}else if(found==='place')crystalAction('place');else if(found==='break')crystalAction('break');else if(found==='cTotem')setCStatus('Totem bind aktivován (tréninková zkratka).')}
 if(e.code==='Space'&&!$('page-anchor').classList.contains('hidden')){e.preventDefault();anchorUse()}
});
function setAStatus(s){$('aStatus').textContent=s}
function renderAnchor(){const el=$('anchorVisual');el.style.display=a.phase==='empty'?'none':'flex';$('charge').textContent=a.charge+'/4';const img=el.querySelector('img');img.src=assets+'block/respawn_anchor_'+Math.max(0,a.charge)+'.png';$('aCycles').textContent=a.cycles;$('aBest').textContent=a.best;$('anchorExplodes').textContent=a.anchorExplodes;$('glowExplodes').textContent=a.glowExplodes;$('aErrors').textContent=a.errors}
function anchorUse(itemOverride){
 if(!a.running&&a.end>0)return;
 const item=itemOverride||a.selected;
 if(!item){setAStatus('Nejdřív vyber item bindem.');return}
 if(a.phase==='empty'){
  if(item==='anchor'){a.phase='placed';a.charge=0;setAStatus('Anchor položený · 0/4 nabití')}
  else{a.errors++;setAStatus('Chyba: nejdřív polož anchor.')}
 }else if(item==='glowstone'){
  if(a.charge<4){a.charge++;setAStatus('Anchor nabitý · '+a.charge+'/4')}
  else{a.errors++;setAStatus('Anchor už je plně nabitý (4/4).')}
 }else if(item==='anchor'){
  if(a.phase==='placed'&&a.charge>0){a.anchorExplodes++;completeCycle('anchor')}
  else{a.errors++;setAStatus('Anchor lze odpálit až po nabití.')}
 }else if(item==='totem'){
  setAStatus('Totem vybrán · vrať se k anchoru nebo glowstonu.')
 }
 renderAnchor();
}
function completeCycle(by){a.cycles++;a.phase='empty';a.charge=0;a.selected='';setAStatus('Odpáleno: '+(by==='anchor'?'anchor':'glowstone')+' · cyklus '+a.cycles)}
function anchorExplodeGlow(){if(a.phase==='placed'&&a.charge===4){a.glowExplodes++;completeCycle('glowstone')}else{a.errors++;setAStatus('Glowstonem lze odpálit pouze plně nabitý anchor (4/4).')}renderAnchor()}
$('aUse').onclick=()=>anchorUse();
$('aReset').onclick=resetAnchor;
function resetAnchor(){clearInterval(a.timer);a.running=false;a.phase='empty';a.charge=0;a.cycles=0;a.errors=0;a.anchorExplodes=0;a.glowExplodes=0;a.selected='';a.end=0;$('aTime').textContent='10.00';$('aStart').disabled=false;setAStatus('Aréna prázdná · vyber anchor a klikni pravým tlačítkem');renderAnchor()}
function startAnchor(){resetAnchor();a.running=true;a.end=performance.now()+10000;$('aStart').disabled=true;setAStatus('Challenge běží!');a.timer=setInterval(()=>{const left=Math.max(0,a.end-performance.now());$('aTime').textContent=(left/1000).toFixed(2);if(left<=0){clearInterval(a.timer);a.running=false;a.last=a.cycles;if(a.cycles>a.best){a.best=a.cycles;save('cp-abest',a.best)}$('aStart').disabled=false;setAStatus('Konec! '+a.cycles+' kompletních cyklů.');renderAnchor();updateHome()}},20)}
$('aStart').onclick=startAnchor;
document.addEventListener('contextmenu',e=>{
 if(!$('page-anchor').classList.contains('hidden') && $('anchorArena').contains(e.target)){
  e.preventDefault();
  if(a.selected==='glowstone'&&a.phase==='placed'&&a.charge===4)anchorExplodeGlow();else anchorUse();
 }
 if(!$('page-crystal').classList.contains('hidden') && $('crystalArena').contains(e.target)) e.preventDefault();
});
document.addEventListener('mousedown',e=>{
 if($('page-crystal').classList.contains('hidden'))return;
 if(e.button===2){e.preventDefault();crystalAction('place')}
 else if(e.button===0)crystalAction('break');
 else if(e.button===3||e.button===4){e.preventDefault();crystalAction(e.button===3?'place':'break')}
});
function setCStatus(s){$('cStatus').textContent=s}
function crystalAction(type){
 if(!c.running){return}
 c.clicks++;
 if(type==='place'){c.placed++;c.events.push(performance.now());const obj=document.createElement('img');obj.src=imgs.crystal;obj.alt='';obj.style.cssText=`position:absolute;width:38px;height:48px;object-fit:contain;left:${20+Math.random()*60}%;top:${20+Math.random()*55}%;image-rendering:pixelated`; $('crystalObjects').append(obj)}
 else {if(c.placed>c.broken)c.broken++;else c.misses++}
 updateCrystalStats();
}
function updateCrystalStats(){const elapsed=Math.min(10,Math.max(.01,(performance.now()-c.startAt)/1000));const cps=c.placed/elapsed;$('cCps').textContent=cps.toFixed(2);$('cCount').textContent=c.placed;$('cAccuracy').textContent=Math.round(100*c.placed/Math.max(1,c.clicks))+'%';$('cPlaced').textContent=c.placed;$('cBroken').textContent=c.broken;$('cMisses').textContent=c.misses;$('cBest').textContent=c.best.toFixed(2)}
function resetCrystal(){clearInterval(c.timer);c.running=false;c.placed=0;c.broken=0;c.misses=0;c.clicks=0;c.events=[];$('crystalObjects').innerHTML='';$('cCps').textContent='0.00';$('cCount').textContent='0';$('cAccuracy').textContent='100%';$('cPlaced').textContent='0';$('cBroken').textContent='0';$('cMisses').textContent='0';$('cStatus').textContent='Stiskni Start a pokládej / nič crystaly.';$('cStart').disabled=false}
function startCrystal(){resetCrystal();c.running=true;c.startAt=performance.now();c.end=c.startAt+10000;$('cStart').disabled=true;$('cStatus').textContent='Měření běží…';c.timer=setInterval(()=>{const left=Math.max(0,c.end-performance.now());$('cCps').textContent=(c.placed/Math.max(.01,(performance.now()-c.startAt)/1000)).toFixed(2);if(left<=0){clearInterval(c.timer);c.running=false;$('cStart').disabled=false;c.last=c.placed/10;if(c.last>c.best){c.best=c.last;save('cp-cbest',c.best)}$('cBest').textContent=c.best.toFixed(2);$('cStatus').textContent='Hotovo · '+c.last.toFixed(2)+' CPS';updateHome()}},20)}
$('cStart').onclick=startCrystal;$('cReset').onclick=resetCrystal;$('cPlace').onclick=()=>crystalAction('place');$('cBreak').onclick=()=>crystalAction('break');
function renderRecords(){const body=$('records');if(!body)return;body.innerHTML='';const sorted=records.slice().sort((a,b)=>b.score-a.score).slice(0,20);if(!sorted.length){const tr=document.createElement('tr');const td=document.createElement('td');td.colSpan=3;td.textContent='Zatím žádné lokální rekordy.';td.className='small';tr.append(td);body.append(tr);return}sorted.forEach((r,i)=>{const tr=document.createElement('tr');[i+1,r.name,r.score].forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.append(td)});body.append(tr)})}
$('recordForm').onsubmit=e=>{e.preventDefault();if(a.last<=0){alert('Nejdřív dokonči 10sekundový Anchor challenge.');return}records.push({name:$('nick').value.trim().slice(0,16),score:a.last});save('cp-records',records);renderRecords();$('nick').value=''};
$('clearData').onclick=()=>{if(confirm('Opravdu smazat lokální bindy a rekordy?')){['cp-binds','cp-theme','cp-lang','cp-abest','cp-cbest','cp-records'].forEach(k=>localStorage.removeItem(k));location.reload()}};
function updateHome(){$('homeAnchor').textContent=a.best;$('homeCps').textContent=c.best.toFixed(2);$('homeCycles').textContent=a.cycles}
renderBinds();renderRecords();renderAnchor();updateHome();
})();
