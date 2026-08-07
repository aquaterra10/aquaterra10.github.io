'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
let lang=localStorage.getItem('aquaterraLang')||'fr';
const themeBtn=$('#themeBtn');
const data={
solutions:[['mobile-screen-button','Collecte terrain','KoboToolbox, GPS, photos, QR, validations et contrôle qualité.'],['truck-fast','Suivi GPS et logistique','Flotte, convois, étapes, géofences, retards et alertes.'],['map-location-dot','Cartographie SIG web','Leaflet, filtres, itinéraires, couches et exports.'],['chart-line','Tableaux de bord','KPI, progression multisite, anomalies et reporting.'],['triangle-exclamation','Analyse territoriale','Risques, accessibilité, vulnérabilité et télédétection.'],['water','Hydrologie et infrastructures','Bassins, pluies, débits, irrigation et ouvrages.']],
products:[['AQUATRACK','Suivi GPS'],['AQUAFORMS','Collecte mobile'],['AQUAMAPS','Cartographie web'],['AQUADASH','Tableaux de bord'],['AQUAHYDRO','Hydrologie'],['AQUARISK','Analyse des risques'],['AQUAQR','Traçabilité QR'],['AQUATRAIN','Formation']],
sectors:[['seedling','Agriculture et irrigation'],['hand-holding-heart','Humanitaire'],['heart-pulse','Santé publique'],['truck','Logistique'],['person-booth','Opérations électorales'],['road','Infrastructures'],['leaf','Environnement'],['house-flood-water','Gestion des risques'],['chart-pie','Suivi-évaluation']],
training:[['KoboToolbox et collecte mobile','Formulaires, logique conditionnelle, GPS, médias, contrôle et déploiement.'],['SIG et cartographie web','QGIS, ArcGIS Pro, Leaflet, filtres, symbologie et publication.'],['Automatisation des données','Google Apps Script, API KoboToolbox, Sheets et tableaux de bord.'],['Hydrologie appliquée','Bassins versants, pluies, courbes IDF, débits et modélisation.'],['Drone et topographie','Protocoles de vol, orthomosaïques, MNT, volumes et précision.'],['Télédétection','Indices de végétation, classifications et analyse diachronique.']],
values:[['bullseye','Utilité opérationnelle'],['shield-halved','Confidentialité'],['plug','Interopérabilité'],['graduation-cap','Transfert de capacités']]
};
function renderStatic(){
 $('#solutionGrid').innerHTML=data.solutions.map(x=>`<article class="card reveal"><div class="card-icon"><i class="fa-solid fa-${x[0]}"></i></div><h3>${x[1]}</h3><p>${x[2]}</p></article>`).join('');
 $('#productGrid').innerHTML=data.products.map((x,i)=>`<article class="card product-card reveal"><span class="product-code">${x[0]}</span><h3>${x[1]}</h3><p>Module AquaTerra ${i+1} prêt à être adapté aux besoins opérationnels.</p><a class="btn btn-secondary" href="#demos">Démo</a></article>`).join('');
 $('#sectorCloud').innerHTML=data.sectors.map(x=>`<span><i class="fa-solid fa-${x[0]}"></i>${x[1]}</span>`).join('');
 $('#trainingGrid').innerHTML=data.training.map(x=>`<article class="card reveal"><h3>${x[0]}</h3><p>${x[1]}</p><span class="duration">Atelier pratique</span></article>`).join('');
 $('#valueGrid').innerHTML=data.values.map(x=>`<div class="value"><i class="fa-solid fa-${x[0]}"></i><b>${x[1]}</b></div>`).join('');
}
function applyLang(){const t=TRANSLATIONS[lang];document.documentElement.lang=lang;$$('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(t[k])el.textContent=t[k]});$$('[data-i18n-html]').forEach(el=>{const k=el.dataset.i18nHtml;if(t[k])el.innerHTML=t[k]});$$('[data-i18n-placeholder]').forEach(el=>{const k=el.dataset.i18nPlaceholder;if(t[k])el.placeholder=t[k]});$$('.language-option').forEach(b=>{const a=b.dataset.lang===lang;b.classList.toggle('active',a);b.setAttribute('aria-pressed',a)});renderSelects();renderDemo(currentDemo)}
$$('.language-option').forEach(b=>b.addEventListener('click',()=>{lang=b.dataset.lang;localStorage.setItem('aquaterraLang',lang);applyLang()}));
function syncTheme(){const dark=document.documentElement.dataset.theme==='dark';themeBtn.innerHTML=`<i class="fa-solid fa-${dark?'sun':'moon'}"></i>`}
const savedTheme=localStorage.getItem('aquaterraTheme')||'dark';document.documentElement.dataset.theme=savedTheme;syncTheme();themeBtn.addEventListener('click',()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';localStorage.setItem('aquaterraTheme',document.documentElement.dataset.theme);syncTheme()});
$('#menuBtn').addEventListener('click',()=>$('#navLinks').classList.toggle('open'));
$$('#navLinks a').forEach(a=>a.addEventListener('click',()=>$('#navLinks').classList.remove('open')));
function initMap(){const map=L.map('heroMap',{zoomControl:false,scrollWheelZoom:false}).setView([19.0,-72.7],7);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(map);[[18.54,-72.34],[19.75,-72.2],[19.45,-72.69],[19.1,-72.35],[18.65,-74.12]].forEach((p,i)=>L.circleMarker(p,{radius:6+i,weight:2,fillOpacity:.9}).addTo(map));setTimeout(()=>map.invalidateSize(),200)}
let currentDemo='track', chart;
const demos={track:'AquaTrack',forms:'AquaForms',dash:'AquaDash',maps:'AquaMaps',hydro:'AquaHydro',qr:'AquaQR'};
function initDemos(){const tabs=$('#demoTabs');tabs.innerHTML=Object.entries(demos).map(([k,v])=>`<button class="demo-tab" data-demo="${k}">${v}</button>`).join('');$$('.demo-tab').forEach(b=>b.addEventListener('click',()=>{currentDemo=b.dataset.demo;renderDemo(currentDemo)}));renderDemo(currentDemo)}
function renderDemo(k){$$('.demo-tab').forEach(b=>b.classList.toggle('active',b.dataset.demo===k));const stage=$('#demoStage');if(chart){chart.destroy();chart=null}if(k==='track')stage.innerHTML=`<div class="demo-head"><div><span class="product-code">AQUATRACK</span><h3>Suivi GPS opérationnel</h3></div><span class="badge">LIVE DEMO</span></div><div class="dashboard-demo"><div class="route-canvas"><span class="route-line"></span><i style="left:12%;top:65%"></i><i style="left:42%;top:42%"></i><i style="left:72%;top:24%"></i></div><div class="demo-kpis"><div><b>8</b><span>Actifs</span></div><div><b>2</b><span>Alertes</span></div><div><b>94%</b><span>Couverture</span></div></div></div>`;else if(k==='forms')stage.innerHTML=`<div class="demo-head"><div><span class="product-code">AQUAFORMS</span><h3>Formulaire terrain intelligent</h3></div><span class="badge">OFFLINE READY</span></div><div class="mock-form"><label>Zone<select><option>Nord</option></select></label><label>Point GPS<input value="19.7421, -72.2014"></label><label>État de la route<select><option>Praticable</option></select></label><label class="full">Observation<textarea>Collecte simulée et contrôle qualité automatique.</textarea></label></div>`;else if(k==='dash'){stage.innerHTML=`<div class="demo-head"><div><span class="product-code">AQUADASH</span><h3>Tableau de bord multisite</h3></div><span class="badge">KPI</span></div><canvas id="demoChart" height="140"></canvas>`;requestAnimationFrame(()=>chart=new Chart($('#demoChart'),{type:'bar',data:{labels:['Nord','Nord-Est','Centre','Sud','Ouest'],datasets:[{label:'Progression %',data:[82,67,91,74,88]}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,max:100}}}}));}else if(k==='maps')stage.innerHTML=`<div class="demo-head"><div><span class="product-code">AQUAMAPS</span><h3>Carte filtrable et exportable</h3></div><span class="badge">WEB GIS</span></div><div class="map-placeholder"><i class="fa-solid fa-map-location-dot"></i><b>Filtres · couches · itinéraires · exports</b></div>`;else if(k==='hydro')stage.innerHTML=`<div class="demo-head"><div><span class="product-code">AQUAHYDRO</span><h3>Analyse hydrologique</h3></div><span class="badge">MODELING</span></div><div class="hydro-grid"><div><b>245 km²</b><span>Bassin versant</span></div><div><b>128 m³/s</b><span>Débit de pointe</span></div><div><b>25 ans</b><span>Période de retour</span></div></div>`;else stage.innerHTML=`<div class="demo-head"><div><span class="product-code">AQUAQR</span><h3>Traçabilité des équipements</h3></div><span class="badge">SCAN</span></div><div class="qr-demo"><div class="fake-qr">▦</div><div><h3>KIT-HT-0248</h3><p>Départ confirmé · destination validée · réception conforme.</p></div></div>`}
const SERVICE_CATALOG=[
 {code:'AT-FRM-01',key:'formDesign',price:350},
 {code:'AT-FRM-02',key:'collectionSystem',price:1200},
 {code:'AT-TRK-01',key:'gpsTracking',price:2500},
 {code:'AT-QR-01',key:'qrTraceability',price:1500},
 {code:'AT-MAP-01',key:'webMap',price:700},
 {code:'AT-DASH-01',key:'geoDashboard',price:600},
 {code:'AT-AUTO-01',key:'automation',price:500},
 {code:'AT-RISK-01',key:'riskMapping',price:1200},
 {code:'AT-RS-01',key:'remoteSensing',price:800},
 {code:'AT-HYD-01',key:'hydrologyStudy',price:1200},
 {code:'AT-HYD-02',key:'hydraulicDesign',price:1000},
 {code:'AT-DRN-01',key:'droneMapping',price:900},
 {code:'AT-TRN-01',key:'technicalTraining',price:400},
 {code:'AT-MNT-01',key:'maintenanceService',price:150}
];
function tr(key,fallback=''){return (TRANSLATIONS[lang]&&TRANSLATIONS[lang][key])||fallback||key}
function renderSelects(){
 const sectors=lang==='fr'?['Agriculture et irrigation','Humanitaire','Santé publique','Logistique','Infrastructures','Environnement','Gestion des risques','Suivi-évaluation','Autre']:lang==='en'?['Agriculture and irrigation','Humanitarian','Public health','Logistics','Infrastructure','Environment','Risk management','Monitoring and evaluation','Other']:['Agricultura y riego','Humanitario','Salud pública','Logística','Infraestructura','Medio ambiente','Gestión de riesgos','Monitoreo y evaluación','Otro'];
 $('#qSector').innerHTML=`<option value="">${tr('selectOption','Sélectionnez')}</option>`+sectors.map(x=>`<option value="${x}">${x}</option>`).join('');
 const deadlines=lang==='fr'?['Urgent — moins de 2 semaines','2 à 4 semaines','1 à 3 mois','Plus de 3 mois','À définir']:lang==='en'?['Urgent — under 2 weeks','2 to 4 weeks','1 to 3 months','More than 3 months','To be defined']:['Urgente — menos de 2 semanas','2 a 4 semanas','1 a 3 meses','Más de 3 meses','Por definir'];
 $('#qDeadline').innerHTML=deadlines.map(x=>`<option value="${x}">${x}</option>`).join('');
 const budgets=lang==='fr'?['Moins de 1 000 USD','1 000 à 3 000 USD','3 000 à 7 500 USD','7 500 à 15 000 USD','Plus de 15 000 USD','À définir']:lang==='en'?['Under USD 1,000','USD 1,000 to 3,000','USD 3,000 to 7,500','USD 7,500 to 15,000','Over USD 15,000','To be defined']:['Menos de 1 000 USD','1 000 a 3 000 USD','3 000 a 7 500 USD','7 500 a 15 000 USD','Más de 15 000 USD','Por definir'];
 $('#qBudget').innerHTML=budgets.map(x=>`<option value="${x}">${x}</option>`).join('');
 renderServiceSelector();
}
function renderServiceSelector(){
 const selected=new Set($$('.service-check:checked').map(x=>x.value));
 $('#serviceSelector').innerHTML=SERVICE_CATALOG.map(s=>`<label class="service-choice"><input class="service-check" type="checkbox" value="${s.code}" data-price="${s.price}" ${selected.has(s.code)?'checked':''}><span class="service-box"><b>${s.code}</b><strong>${tr(s.key)}</strong><small>${tr('startingAt','À partir de')} ${s.price.toLocaleString('fr-FR')} USD</small></span></label>`).join('');
 $$('.service-check').forEach(x=>x.addEventListener('change',estimate));
 estimate();
}
function estimate(){
 const selected=$$('.service-check:checked');
 const users=Math.max(1,Number($('#qUsers').value||1));
 const maintenance=Number($('#qMaintenance').value||0);
 let low=selected.reduce((sum,x)=>sum+Number(x.dataset.price||0),0);
 if(low>0) low+=Math.max(0,users-10)*20+maintenance;
 const high=low?Math.round(low*1.55):0;
 const text=low?`${low.toLocaleString('fr-FR')} – ${high.toLocaleString('fr-FR')} USD`:'0 USD';
 $('#quoteTotal').textContent=text;
 $('#qEstimateValue').value=text;
 $('#estimateStatus').classList.toggle('ready',low>0);
}
['qUsers','qMaintenance'].forEach(id=>$('#'+id).addEventListener('input',estimate));
function createClientRequestId(){const d=new Date();const ds=`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;return `ATS-${ds}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(36).slice(0,6).toUpperCase()}`}
function getSelectedServices(){return $$('.service-check:checked').map(x=>{const item=SERVICE_CATALOG.find(s=>s.code===x.value);return `${x.value} — ${tr(item.key)}`})}
function showFormMessage(type,text){const el=$('#quoteMessage');el.className=`form-message ${type}`;el.innerHTML=text}
$('#quoteForm').addEventListener('submit',async e=>{
 e.preventDefault();
 const form=e.currentTarget;
 const button=$('#submitQuoteBtn');
 const services=getSelectedServices();
 if(!form.reportValidity())return;
 if(!services.length){showFormMessage('error',`<i class="fa-solid fa-circle-exclamation"></i>${tr('selectServiceError','Sélectionnez au moins un service.')}`);return}
 if($('#qWebsite').value)return;
 if(!CONFIG.apiUrl||CONFIG.apiUrl.includes('COLLEZ_ICI')){showFormMessage('error',`<i class="fa-solid fa-link-slash"></i>${tr('apiNotConfigured','L’API Google Sheets n’est pas encore configurée.')}`);return}
 const requestId=createClientRequestId();
 $('#qRequestId').value=requestId;$('#qLanguage').value=lang;
 const params=new URLSearchParams({
  requestId,language:lang,contactName:$('#qContactName').value,organization:$('#qOrg').value,email:$('#qEmail').value,phone:$('#qPhone').value,country:$('#qCountry').value,sector:$('#qSector').value,services:services.join(' | '),users:$('#qUsers').value,deadline:$('#qDeadline').value,budget:$('#qBudget').value,maintenance:$('#qMaintenance').value==='0'?'Non':'Oui',estimate:$('#qEstimateValue').value,details:$('#qDetails').value,consent:$('#qConsent').checked?'Oui':'Non',website:$('#qWebsite').value,userAgent:navigator.userAgent
 });
 button.disabled=true;button.classList.add('loading');button.innerHTML=`<i class="fa-solid fa-circle-notch fa-spin"></i><span>${tr('sending','Envoi en cours...')}</span>`;
 try{
  await fetch(CONFIG.apiUrl,{method:'POST',mode:'no-cors',body:params});
  showFormMessage('success',`<i class="fa-solid fa-circle-check"></i><div><b>${tr('requestSent','Demande transmise avec succès.')}</b><span>${tr('requestNumber','Numéro de dossier')} : <strong>${requestId}</strong></span></div>`);
  form.reset();renderSelects();estimate();
 }catch(err){console.error(err);showFormMessage('error',`<i class="fa-solid fa-triangle-exclamation"></i>${tr('sendError','Échec de la transmission. Vérifiez votre connexion puis réessayez.')}`)}finally{
  button.disabled=false;button.classList.remove('loading');button.innerHTML=`<i class="fa-solid fa-paper-plane"></i><span>${tr('sendRequest','Envoyer la demande')}</span>`;
 }
});
function reveal(){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});$$('.reveal').forEach(x=>io.observe(x))}
function network(){const c=$('#networkCanvas'),ctx=c.getContext('2d');let pts=[];function resize(){c.width=c.clientWidth*devicePixelRatio;c.height=c.clientHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);pts=Array.from({length:30},()=>({x:Math.random()*c.clientWidth,y:Math.random()*c.clientHeight,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18}))}function draw(){ctx.clearRect(0,0,c.clientWidth,c.clientHeight);ctx.fillStyle='rgba(49,189,255,.45)';pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>c.clientWidth)p.vx*=-1;if(p.y<0||p.y>c.clientHeight)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,2,0,Math.PI*2);ctx.fill()});ctx.strokeStyle='rgba(49,189,255,.08)';pts.forEach((a,i)=>pts.slice(i+1).forEach(b=>{const d=Math.hypot(a.x-b.x,a.y-b.y);if(d<150){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}));requestAnimationFrame(draw)}resize();addEventListener('resize',resize);draw()}
renderStatic();applyLang();initMap();initDemos();estimate();reveal();network();
