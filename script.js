// Scroll reveal animation
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => observer.observe(el));

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  document.body.classList.toggle('menu-open');
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
  });
});

// 3D Photo Flip Carousel Logic
const photoWrap = document.getElementById('flipCard');
const photoContainer = photoWrap.closest('.about-img-wrap');
const imgFront = document.getElementById('imgFront');
const imgBack = document.getElementById('imgBack');

const photoList = [
  'assets/photo_2026-08-20_11-53-44.jpg',
  'assets/olha-2.jpg',
  'assets/olha-color.jpg'
];

let currentPhotoIndex = 0;
let isFlipped = false;
let isAnimating = false;

photoContainer.addEventListener('click', () => {
  if (isAnimating) return;
  isAnimating = true;

  currentPhotoIndex = (currentPhotoIndex + 1) % photoList.length;
  isFlipped = !isFlipped;

  photoContainer.classList.toggle('flipped');

  setTimeout(() => {
    const nextImageIndex = (currentPhotoIndex + 1) % photoList.length;
    if (isFlipped) {
      imgFront.src = photoList[nextImageIndex];
    } else {
      imgBack.src = photoList[nextImageIndex];
    }
    isAnimating = false;
  }, 350);
});

// Periodic Scramble Typewriter Text Animation for Hero Name
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const length = newText.length;
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = '';
      const to = newText[i];
      const start = i * 3 + Math.floor(Math.random() * 3);
      const end = start + 8 + Math.floor(Math.random() * 6);
      this.queue.push({ from, to, start, end, char: '' });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.35) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += char;
      } else {
        output += '';
      }
    }
    this.el.textContent = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frame++;
      setTimeout(() => {
        this.frameRequest = requestAnimationFrame(this.update);
      }, 35);
    }
  }
}

const elOlha = document.querySelector('.scramble-olha');
const elVilkhova = document.querySelector('.scramble-vilkhova');
if (elOlha && elVilkhova) {
  const fxOlha = new TextScramble(elOlha);
  const fxVilkhova = new TextScramble(elVilkhova);

  function triggerScramble() {
    fxOlha.setText('Olha');
    setTimeout(() => fxVilkhova.setText('Vilkhova'), 250);
  }

  // Initial decode on load
  setTimeout(triggerScramble, 200);

  // Periodically re-scramble every 5 seconds for a clean effect
  setInterval(triggerScramble, 5000);
}

// Canvas Particles Animation
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Mouse interaction for interactive constellation
const mouse = { x: null, y: null, radius: 150 };
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.45;
    this.vy = (Math.random() - 0.5) * 0.45;
    this.radius = Math.random() * 2 + 0.8;
    this.alpha = Math.random() * 0.5 + 0.3;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;

    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius && dist > 0) {
        const force = (mouse.radius - dist) / mouse.radius;
        const dirX = dx / dist;
        const dirY = dy / dist;
        this.x -= dirX * force * 4;
        this.y -= dirY * force * 4;
      }
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.fill();
  }
}

const particleCount = window.innerWidth < 768 ? 28 : 80;
for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.25 * (1 - dist / 130)})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
    }

    if (mouse.x !== null && mouse.y !== null) {
      const mdx = mouse.x - particles[i].x;
      const mdy = mouse.y - particles[i].y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < mouse.radius) {
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(particles[i].x, particles[i].y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.45 * (1 - mdist / mouse.radius)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}
animate();

