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

// Language toggle (simple placeholder logic)
const langButtons = document.querySelectorAll('.lang-switch button');
const i18nMap = {
  zh: {
    tagline: '正在积极寻找 HCI / 人机智能交互 方向的博士机会',
    sub: '我研究人与AI的协同与自适应界面，以水球团队的动态协作为灵感。',
    seeResearch: '研究方向',
    contactMe: '联系我',
    about1: '我关注人在复杂、创意或高压情境下与AI系统的协同与共适应，希望界面像水一样：灵活、支持且透明。',
    about2: '目前正在寻找博士机会，结合用户研究、原型设计与计算建模推进 Human-AI 协作。',
    contact1: '我正在寻找 HCI 或 Human-AI Interaction 相关博士导师 / 团队，如果有共鸣欢迎联系。'
  }
};
langButtons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    langButtons.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const lang = btn.dataset.lang;
    if (lang==='zh') applyLang(lang); else applyLang('en');
  });
});
function applyLang(l){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.dataset.i18n;
    if (l==='en') {
      // Fallback to original HTML (English already there)
      return;
    }
    if (i18nMap[l] && i18nMap[l][key]) {
      el.innerHTML = i18nMap[l][key];
    }
  });
}

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
