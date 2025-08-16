// main.js - interactions & micro-animations

// Intersection fade / slide in
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
},{ threshold:0.18 });

document.querySelectorAll('[data-animate]').forEach(el=>observer.observe(el));

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.site-nav ul');
if (toggle) {
  toggle.addEventListener('click', ()=>{
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    navList.classList.toggle('open');
  });
}

// Year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Magnetic hover logo & tilt cards
function lerp(a,b,t){ return a + (b-a)*t; }
const mag = document.querySelector('[data-hover-magnet]');
if (mag) {
  let rx=0, ry=0, tx=0, ty=0;
  function loop(){
    tx = lerp(tx, rx, 0.12);
    ty = lerp(ty, ry, 0.12);
    mag.style.transform = `translate(${tx}px,${ty}px)`;
    requestAnimationFrame(loop);
  }
  loop();
  mag.addEventListener('pointermove', e=>{
    const r = mag.getBoundingClientRect();
    rx = (e.clientX - (r.left + r.width/2)) * 0.12;
    ry = (e.clientY - (r.top + r.height/2)) * 0.18;
  });
  mag.addEventListener('pointerleave', ()=>{ rx=0; ry=0; });
}

// Simple parallax tilt
const tiltEls = document.querySelectorAll('[data-tilt]');
tiltEls.forEach(card=>{
  let px=0, py=0; let leaveTimeout; 
  card.addEventListener('pointermove', e=>{
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left)/r.width; // 0..1
    const y = (e.clientY - r.top)/r.height;
    const rx = (y - 0.5) * 10; // max tilt
    const ry = (x - 0.5) * -12;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    card.style.boxShadow = '0 28px 46px -18px rgba(0,0,0,0.65),0 0 0 1px rgba(90,210,255,0.35)';
  });
  card.addEventListener('pointerleave', ()=>{
    clearTimeout(leaveTimeout);
    leaveTimeout = setTimeout(()=>{
      card.style.transform='';
      card.style.boxShadow='';
    },80);
  });
});

// Ripple effect on project cards
const rippleCards = document.querySelectorAll('[data-ripple]');
rippleCards.forEach(card=>{
  card.addEventListener('pointerdown', e=>{
    const ripple = document.createElement('span');
    ripple.className='ripple';
    const r = card.getBoundingClientRect();
    const size = Math.max(r.width,r.height)*1.2;
    ripple.style.width = ripple.style.height = size+'px';
    ripple.style.left = (e.clientX - r.left - size/2)+'px';
    ripple.style.top = (e.clientY - r.top - size/2)+'px';
    card.appendChild(ripple);
    setTimeout(()=>ripple.remove(), 900);
  });
});

// Language toggle (enhanced i18n)
const langButtons = document.querySelectorAll('.lang-switch button');
// Key = token, values = { en, zh }
const i18nMap = {
  hi: { en: "Hi, I'm", zh: '你好，我是' },
  tagline: { en: 'Actively seeking a PhD position in <strong>HCI / Human–AI Interaction</strong>.', zh: '正在积极寻找 <strong>HCI / 人机智能交互</strong> 方向博士机会。' },
  sub: { en: 'I design & study adaptive, fluid, and trustworthy human-AI collaboration – inspired by the dynamics of water polo teamwork.', zh: '我研究与设计自适应、流动且可信的人与AI协作界面，灵感来自水球团队的动态配合。' },
  seeResearch: { en: 'Explore Research', zh: '研究方向' },
  contactMe: { en: 'Contact Me', zh: '联系我' },
  about1: { en: "I'm a researcher focusing on how humans and AI systems co-adapt in complex, creative, or high-pressure environments. I strive to build interfaces that feel like water: responsive, supportive, and transparent.", zh: '我关注人在复杂、创意或高压情境下与 AI 系统的协同共适应，希望界面像水一样：灵活、支持、透明。' },
  about2: { en: 'Currently seeking a PhD opportunity where I can merge empirical user studies, prototyping, and computational modeling to advance human-AI collaboration.', zh: '目前寻求博士机会，将用户研究、原型设计与计算建模结合，推进 Human-AI 协作。' },
  contact1: { en: "I'm actively looking for a PhD advisor / lab in HCI or Human-AI Interaction. If my focus resonates, I'd love to connect.", zh: '正在寻找 HCI 或 Human-AI Interaction 相关博士导师/团队，如果研究方向契合欢迎联系。' },
  avatarCaption: { en: 'Portrait of Yukun Yang', zh: '杨昱鲲的头像' },
  name: { en: 'Yukun Yang', zh: '杨昱鲲' }
};
let currentLang = 'en';

langButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    if (lang === currentLang) return;
    currentLang = lang;
    langButtons.forEach(b => b.classList.toggle('active', b === btn));
    applyLang();
  });
});

function applyLang(){
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const pack = i18nMap[key];
    if (pack && pack[currentLang]) {
      el.innerHTML = pack[currentLang];
    }
  });
  // Special: name inside display (avoid overwriting wave accent)
  const display = document.querySelector('[data-i18n-display="name"]');
  if (display && i18nMap.name) {
    if (currentLang === 'zh') {
      display.innerHTML = `${i18nMap.name.zh} <span class="wave-accent" aria-hidden="true">∿</span>`;
    } else {
      display.innerHTML = `${i18nMap.name.en.split(' ')[0]} <span class="wave-accent" aria-hidden="true">∿</span> ${i18nMap.name.en.split(' ')[1]}`;
    }
  }
}

// Optional: remember language (localStorage)
try {
  const saved = localStorage.getItem('lang');
  if (saved && ['en','zh'].includes(saved)) { currentLang = saved; }
} catch {}
applyLang();
langButtons.forEach(b=> b.classList.toggle('active', b.dataset.lang===currentLang));
langButtons.forEach(b=> b.addEventListener('click', ()=>{ try { localStorage.setItem('lang', currentLang); } catch {} }));

// Accessibility: trap focus when nav open (mobile)
document.addEventListener('keydown', e=>{
  if (e.key==='Escape' && navList.classList.contains('open')) {
    toggle.click();
  }
});

// Minimal focus ring handling
function handleFocusVisible(){
  document.body.classList.add('using-kb');
  window.removeEventListener('keydown', handleFocusVisible);
}
window.addEventListener('keydown', handleFocusVisible);

// Add ripple style dynamically
const style = document.createElement('style');
style.innerHTML = `.ripple{position:absolute;border-radius:50%;pointer-events:none;background:radial-gradient(circle at 30% 30%,rgba(255,255,255,0.6),rgba(59,181,255,0.05) 60%,transparent 70%);transform:scale(.2);opacity:.65;animation:ripple .9s ease-out forwards;mix-blend-mode:screen;}@keyframes ripple{to{transform:scale(1);opacity:0}}`;
document.head.appendChild(style);
