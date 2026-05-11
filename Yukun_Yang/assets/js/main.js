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

// --- Advanced Scrollytelling Engine ---
// True scrubbable, reversible, physics-free scroll tracking

const scrollyData = {
  waterpolo_ball: {
    section: '#miscellaneous',
    frames: [
      { p: -0.1, x: -20, y: 110, rot: -180, scale: 0.3, op: 0 },
      { p: 0.4,  x: 15,  y: 60,  rot: -45,  scale: 0.9, op: 0.5 },
      { p: 0.8,  x: 25,  y: 20,  rot: 45,   scale: 1.2, op: 0.5 },
      { p: 1.2,  x: 50,  y: -30, rot: 180,  scale: 1.6, op: 0 }
    ]
  },
  waterpolo_pic: {
    section: '#miscellaneous',
    frames: [
      { p: -0.1, x: 110, y: 100, rot: 45,  scale: 0.4, op: 0 },
      { p: 0.5,  x: 85,  y: 40,  rot: 0,   scale: 1.0, op: 0.35 },
      { p: 1.1,  x: 70,  y: -20, rot: -30, scale: 1.4, op: 0 }
    ]
  },
  lol_icon: {
    section: '#miscellaneous',
    frames: [
      { p: -0.2, x: 120, y: 130, rot: 180,  scale: 0.4, op: 0 },
      { p: 0.5,  x: 80,  y: 70,  rot: 0,    scale: 1.0, op: 0.5 },
      { p: 1.2,  x: 40,  y: -40, rot: -180, scale: 1.5, op: 0 }
    ]
  }
};

const scrollyElements = document.querySelectorAll('.scroll-deco');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Cache DOM lookups for performance
const sections = {};
for (const id in scrollyData) {
  const sec = document.querySelector(scrollyData[id].section);
  if (sec) sections[scrollyData[id].section] = sec;
}

function lerpVal(a, b, t) {
  return a + (b - a) * t;
}

function getInterpolatedState(frames, progress) {
  // Clamp progress to frames
  if (progress <= frames[0].p) return frames[0];
  if (progress >= frames[frames.length - 1].p) return frames[frames.length - 1];

  // Find surrounding frames
  for (let i = 0; i < frames.length - 1; i++) {
    const f1 = frames[i];
    const f2 = frames[i + 1];
    if (progress >= f1.p && progress <= f2.p) {
      const t = (progress - f1.p) / (f2.p - f1.p);
      return {
        x: lerpVal(f1.x, f2.x, t),
        y: lerpVal(f1.y, f2.y, t),
        rot: lerpVal(f1.rot, f2.rot, t),
        scale: lerpVal(f1.scale, f2.scale, t),
        op: lerpVal(f1.op, f2.op, t)
      };
    }
  }
  return frames[0]; // fallback
}

let ticking = false;

function renderScrolly() {
  const vh = window.innerHeight;
  const scrollY = window.scrollY;

  scrollyElements.forEach(el => {
    const id = el.getAttribute('data-id');
    if (!scrollyData[id]) return;

    const data = scrollyData[id];
    const section = sections[data.section];
    if (!section) return;

    // Use absolute coordinates in document for progress
    const rect = section.getBoundingClientRect();
    const absoluteTop = scrollY + rect.top;
    
    // Total distance of the effect: from when top of section enters bottom of viewport
    // to when bottom of section leaves top of viewport
    const totalDistance = vh + rect.height;
    
    // Current distance scrolled past the start point
    const scrolledPastStart = scrollY + vh - absoluteTop;
    
    // progress: 0 -> 1
    const progress = scrolledPastStart / totalDistance;

    // Output visibility
    let currentOp = 0;

    // Apply reduced motion or interpolate
    if (prefersReducedMotion) {
      if (progress > 0 && progress < 1) {
        currentOp = 0.1;
        el.style.transform = `translate(10vw, 10vh) scale(1)`;
      }
    } else {
      // Get the exact state for this scroll position
      const state = getInterpolatedState(data.frames, progress);
      currentOp = state.op;
      
      // Use fixed viewport units for transform
      el.style.transform = `translate3d(${state.x}vw, ${state.y}vh, 0) rotate(${state.rot}deg) scale(${state.scale})`;
    }
    
    el.style.opacity = currentOp;
    
    // Only render shadow if it is visible to improve perf
    if (currentOp <= 0.01) {
        el.style.display = 'none';
    } else {
        el.style.display = 'block';
    }
  });

  ticking = false;
}

if (scrollyElements.length > 0) {
  // Initial render
  renderScrolly();

  // Scroll listener optimized with rAF
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(renderScrolly);
      ticking = true;
    }
  }, { passive: true });
  
  // Resize listener to recalculate VH dependencies smoothly
  window.addEventListener('resize', () => {
     if (!ticking) {
      window.requestAnimationFrame(renderScrolly);
      ticking = true;
    }
  }, { passive: true });
}
