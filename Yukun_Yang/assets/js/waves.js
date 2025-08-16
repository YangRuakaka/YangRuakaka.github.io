// waves.js - procedural multi-layer wave background using canvas
// Goal: light-weight, no external deps, supports resize & prefers-reduced-motion

const canvas = document.getElementById('waves');
const ctx = canvas.getContext('2d');
let dpr = window.devicePixelRatio || 1;
let width, height;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.scale(dpr, dpr);
}

// Wave layers configuration
const layers = [
  { amp: 38, len: 1.2, speed: 0.18, color: 'rgba(40,160,255,0.12)' },
  { amp: 70, len: 0.8, speed: 0.08, color: 'rgba(0,120,255,0.10)' },
  { amp: 140, len: 0.45, speed: 0.045, color: 'rgba(0,90,220,0.07)' },
  { amp: 280, len: 0.25, speed: 0.022, color: 'rgba(0,70,180,0.05)' }
];

let start = performance.now();

function draw(ts) {
  const t = (ts - start) / 1000;
  ctx.clearRect(0,0,width,height);

  for (let i=0; i<layers.length; i++) {
    const L = layers[i];
    ctx.beginPath();
    const yBase = height * (0.35 + i * 0.12);
    for (let x=0; x<=width; x+= 8) {
      const theta = (x/width) * Math.PI * 2 * L.len + t * L.speed * 4;
      const y = yBase + Math.sin(theta) * L.amp * Math.sin(t * L.speed + i);
      if (x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = L.color;
    ctx.fill();
  }
  if (!reduceMotion) requestAnimationFrame(draw);
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

resize();
if (!reduceMotion) requestAnimationFrame(draw);
window.addEventListener('resize', resize, { passive:true });
