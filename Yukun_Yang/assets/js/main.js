// main.js - interactions & micro-animations (optimized for performance)

// Intersection fade / slide in - 使用被动监听避免阻塞滚动
const observer = new IntersectionObserver((entries)=>{
  requestAnimationFrame(()=>{
    entries.forEach(e=>{
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
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

// Magnetic hover logo - optimized with caching
function lerp(a,b,t){ return a + (b-a)*t; }
const mag = document.querySelector('[data-hover-magnet]');
if (mag) {
  let rx=0, ry=0, tx=0, ty=0, isActive=false, animationId;
  const maxDist = 0.5; // Cache threshold
  
  function loop(){
    tx = lerp(tx, rx, 0.12);
    ty = lerp(ty, ry, 0.12);
    mag.style.transform = `translate(${tx}px,${ty}px)`;
    // Stop animation when close to target
    if (Math.abs(tx - rx) < maxDist && Math.abs(ty - ry) < maxDist) {
      isActive = false;
    } else {
      animationId = requestAnimationFrame(loop);
    }
  }
  
  mag.addEventListener('pointermove', e=>{
    const r = mag.getBoundingClientRect();
    const newRx = (e.clientX - (r.left + r.width/2)) * 0.12;
    const newRy = (e.clientY - (r.top + r.height/2)) * 0.18;
    
    // Only update if significant change
    if (Math.abs(newRx - rx) > 1 || Math.abs(newRy - ry) > 1) {
      rx = newRx;
      ry = newRy;
      if (!isActive) {
        isActive = true;
        loop();
      }
    }
  });
  
  mag.addEventListener('pointerleave', ()=>{ 
    rx=0; ry=0;
    if (!isActive) {
      isActive = true;
      loop();
    }
  });
}

// Tilt effect - using CSS 3D transforms for better performance
const tiltEls = document.querySelectorAll('[data-tilt]');
tiltEls.forEach(card=>{
  let leaveTimeout; 
  card.addEventListener('pointermove', e=>{
    clearTimeout(leaveTimeout);
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left)/r.width;
    const y = (e.clientY - r.top)/r.height;
    const rx = (y - 0.5) * 10;
    const ry = (x - 0.5) * -12;
    card.style.transition = 'none';
    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    card.style.boxShadow = '0 28px 46px -18px rgba(0,0,0,0.65),0 0 0 1px rgba(90,210,255,0.35)';
  });
  
  card.addEventListener('pointerleave', ()=>{
    clearTimeout(leaveTimeout);
    card.style.transition = '.35s cubic-bezier(.65,.05,.36,1)';
    leaveTimeout = setTimeout(()=>{
      card.style.transform='';
      card.style.boxShadow='';
    },16);
  });
});

// Ripple effect - delegated & optimized
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

// Accessibility: trap focus when nav open (mobile)
document.addEventListener('keydown', e=>{
  if (e.key==='Escape' && navList && navList.classList.contains('open')) {
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
