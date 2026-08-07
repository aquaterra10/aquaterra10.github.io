'use strict';
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const $=(s,r=document)=>r.querySelector(s);
let lang=localStorage.getItem('aquaterraLang')||'fr';
const themeBtn=$('#themeBtn');
function applyLang(){document.documentElement.lang=lang;$$('[data-fr]').forEach(el=>{const v=el.dataset[lang];if(v!==undefined){if(el.dataset.html==='true')el.innerHTML=v;else el.textContent=v}});$$('.language-option').forEach(b=>{const active=b.dataset.lang===lang;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active)})}
$$('.language-option').forEach(b=>b.addEventListener('click',()=>{lang=b.dataset.lang;localStorage.setItem('aquaterraLang',lang);applyLang()}));
function syncTheme(){const dark=document.documentElement.dataset.theme==='dark';themeBtn.innerHTML=`<i class="fa-solid fa-${dark?'sun':'moon'}"></i>`}
document.documentElement.dataset.theme=localStorage.getItem('aquaterraTheme')||'dark';syncTheme();themeBtn.addEventListener('click',()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';localStorage.setItem('aquaterraTheme',document.documentElement.dataset.theme);syncTheme()});
const menuBtn=$('#menuBtn'),navLinks=$('#navLinks');if(menuBtn)menuBtn.addEventListener('click',()=>navLinks.classList.toggle('open'));
applyLang();
