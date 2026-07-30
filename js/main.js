'use strict';

// ── Navbar Scroll ───────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });
navbar.classList.toggle('scrolled', window.scrollY > 40);

// ── Mobile Menu ─────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link, .mobile-btn-gold').forEach(el => {
  el.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

document.addEventListener('click', e => {
  if (mobileMenu.classList.contains('open')
    && !mobileMenu.contains(e.target)
    && !hamburger.contains(e.target)) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ── Active Nav on Scroll ─────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const t = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      if (t) t.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' }).observe;

sections.forEach(s => {
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const t = document.querySelector(`.nav-link[href="#${s.id}"]`);
      if (t) t.classList.add('active');
    }
  }, { rootMargin: '-40% 0px -55% 0px' }).observe(s);
});

// ── Smooth Scroll ────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH - 16, behavior: 'smooth' });
  });
});

// ── Scroll-reveal ────────────────────────────────
new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 }).observe;

document.querySelectorAll('[data-aos]').forEach((el, i) => {
  new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting) {
      setTimeout(() => el.classList.add('visible'), i % 4 * 80);
      obs.unobserve(el);
    }
  }, { threshold: 0.1 }).observe(el);
});

// ── FAQ Accordion ────────────────────────────────
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq-q').forEach(b => b.setAttribute('aria-expanded', 'false'));
    if (!expanded) btn.setAttribute('aria-expanded', 'true');
  });
});

// ── Contact Form ─────────────────────────────────
const form    = document.getElementById('contactForm');
const formOk  = document.getElementById('formSuccess');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending...';
    setTimeout(() => {
      formOk.hidden = false;
      form.reset();
      btn.disabled = false;
      btn.textContent = 'Send Message';
    }, 1400);
  });
}

// ── Star Canvas ──────────────────────────────────
(function initStars() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars, shooters;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function mkStar() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.2 + 0.2,
      alpha: Math.random() * 0.8 + 0.1,
      twinkle: Math.random() * 0.02 + 0.003,
      dir:   Math.random() > 0.5 ? 1 : -1,
    };
  }

  function mkShooter() {
    return {
      x:   Math.random() * W,
      y:   Math.random() * H * 0.5,
      len: Math.random() * 120 + 60,
      spd: Math.random() * 8 + 5,
      alpha: 0.8,
      fade: Math.random() * 0.015 + 0.008,
      ang: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
      active: false,
      timer: Math.random() * 300,
    };
  }

  function init() {
    resize();
    stars    = Array.from({ length: 200 }, mkStar);
    shooters = Array.from({ length: 4  }, mkShooter);
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    // Stars
    stars.forEach(s => {
      s.alpha += s.twinkle * s.dir;
      if (s.alpha >= 0.9 || s.alpha <= 0.05) s.dir *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
      ctx.fill();
    });

    // Gold star cluster
    for (let i = 0; i < 30; i++) {
      const s = stars[i];
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${s.alpha * 0.6})`;
      ctx.fill();
    }

    // Shooting stars
    shooters.forEach(s => {
      s.timer--;
      if (s.timer <= 0 && !s.active) {
        s.active = true;
        s.x = Math.random() * W;
        s.y = Math.random() * H * 0.4;
        s.alpha = 0.9;
        s.timer = Math.random() * 400 + 200;
      }
      if (!s.active) return;

      const tx = s.x + Math.cos(s.ang) * s.len;
      const ty = s.y + Math.sin(s.ang) * s.len;

      const grad = ctx.createLinearGradient(s.x, s.y, tx, ty);
      grad.addColorStop(0, `rgba(201,168,76,0)`);
      grad.addColorStop(0.7, `rgba(255,255,255,${s.alpha * 0.6})`);
      grad.addColorStop(1, `rgba(255,255,255,${s.alpha})`);

      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(tx, ty);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      s.x += Math.cos(s.ang) * s.spd;
      s.y += Math.sin(s.ang) * s.spd;
      s.alpha -= s.fade;

      if (s.alpha <= 0 || s.x > W + 50 || s.y > H + 50) {
        s.active = false;
      }
    });

    requestAnimationFrame(drawFrame);
  }

  window.addEventListener('resize', () => { resize(); }, { passive: true });
  init();
  drawFrame();
})();

// ── Block Card 3D Tilt ───────────────────────────
document.querySelectorAll('.block-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) / r.width  * 8;
    const y = (e.clientY - r.top  - r.height / 2) / r.height * 8;
    card.style.transform = `translateY(-6px) perspective(700px) rotateX(${-y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ── Gold glow pulse on Buy buttons ──────────────
document.querySelectorAll('.btn-hero-gold, .btn-gold-solid').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    btn.style.transition = 'box-shadow 0.15s ease, transform 0.25s ease, background 0.25s ease';
  });
});
