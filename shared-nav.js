/* ============================================================
   NEXCOD DEVELOPERS — shared-nav.js
   Auto-injects navbar, footer, cursor, reveal, counters
   ============================================================ */
'use strict';

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 58" fill="none">
  <g transform="translate(0,3)">
    <path d="M6 48V12H14L33 37V12H41V48H33L14 23V48H6Z" fill="url(#g1)"/>
    <path d="M68 30C68 21 61.5 14.5 53 14.5C44.5 14.5 38 21 38 30C38 39 44.5 45.5 53 45.5C59.2 45.5 64.5 42.2 67.2 37H58.8C57.5 39 55.4 40.3 53 40.3C47.4 40.3 43.3 35.7 43.3 30C43.3 24.3 47.4 19.7 53 19.7C55.4 19.7 57.5 21 58.8 23H67.2C64.5 17.8 59.2 14.5 53 14.5Z" fill="url(#g2)"/>
  </g>
  <text x="78" y="34" font-family="Georgia,serif" font-size="17" font-weight="700" fill="#0f0f0f" letter-spacing="0.5">NexCod</text>
  <text x="79" y="48" font-family="Outfit,sans-serif" font-size="8" fill="#b8944a" letter-spacing="3.5" font-weight="600">DEVELOPERS</text>
  <defs>
    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e8c878"/><stop offset="100%" stop-color="#b8944a"/></linearGradient>
    <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#c8c8c8"/><stop offset="100%" stop-color="#909090"/></linearGradient>
  </defs>
</svg>`;

const NAV_PAGES = [
  { href:'index.html',     label:'Home',      key:'home'      },
  { href:'about.html',     label:'About',     key:'about'     },
  { href:'services.html',  label:'Services',  key:'services'  },
  { href:'portfolio.html', label:'Portfolio', key:'portfolio' },
  { href:'team.html',      label:'Team',      key:'team'      },
  { href:'contact.html',   label:'Contact',   key:'contact'   },
];

function currentKey() {
  const p = location.pathname.split('/').pop().replace('.html','') || 'index';
  return p === 'index' || p === '' ? 'home' : p;
}

function buildLinks(mobile) {
  return NAV_PAGES.map(n => {
    const active = n.key === currentKey();
    if (mobile) {
      return `<a href="${n.href}" class="mob-link${active?' active':''}">${n.label}<span style="font-size:14px;color:var(--gold-bdr)">→</span></a>`;
    }
    return `<a href="${n.href}" class="nav-link${active?' active':''}">${n.label}</a>`;
  }).join('');
}

function injectNavbar() {
  const nav = document.createElement('header');
  nav.className = 'navbar'; nav.id = 'navbar';
  nav.innerHTML = `
    <div class="nav-inner">
      <a href="index.html" class="nav-logo" aria-label="NexCod Developers Home">${LOGO_SVG}</a>
      <nav class="nav-links">${buildLinks(false)}</nav>
      <a href="contact.html" class="nav-cta">
        <span>Get a Quote</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>
      <button class="hamburger" id="ham" aria-label="Menu">
        <span class="ham-bar"></span><span class="ham-bar"></span><span class="ham-bar"></span>
      </button>
    </div>
    <div class="nav-scroll-bar" id="scrollBar"></div>
  `;
  document.body.insertBefore(nav, document.body.firstChild);

  const overlay = document.createElement('div');
  overlay.className = 'mob-overlay'; overlay.id = 'mobOverlay';
  overlay.innerHTML = `
    <nav class="mob-nav">${buildLinks(true)}</nav>
    <div class="mob-foot">
      <p style="margin-bottom:6px;">📧 <a href="mailto:nexcod.developer@gmail.com">nexcod.developer@gmail.com</a></p>
      <p>📞 <a href="tel:+917319833790" style="color:var(--gold)">+91 7319833790</a></p>
    </div>
  `;
  document.body.appendChild(overlay);

  // Scroll behaviour
  const navbar = nav, sb = document.getElementById('scrollBar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    if (sb) sb.style.width = Math.min(pct, 100) + '%';
  }, { passive:true });

  // Active link updates
  const sections = document.querySelectorAll('section[id]');
  if (sections.length) {
    const linkMap = {};
    nav.querySelectorAll('.nav-link').forEach(l => {
      const key = l.getAttribute('href').replace('.html','').replace('index','home');
      linkMap[key.replace('/','').replace('#','')] = l;
    });
    const secObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          nav.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          const match = linkMap[e.target.id];
          if (match) match.classList.add('active');
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(s => secObs.observe(s));
  }

  // Hamburger
  const ham = document.getElementById('ham');
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    overlay.classList.toggle('open');
    document.body.style.overflow = overlay.classList.contains('open') ? 'hidden' : '';
  });
  overlay.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', () => {
    ham.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      ham.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

function injectFooter() {
  const f = document.createElement('footer');
  f.className = 'footer';
  f.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <div style="filter:invert(1) brightness(2)">${LOGO_SVG}</div>
          <p class="footer-brand-desc">NexCod Developers is a premium software studio engineering world-class digital products since 2019. 10,000+ projects delivered across India and globally.</p>
          <div class="footer-email">
            <a href="mailto:nexcod.developer@gmail.com">nexcod.developer@gmail.com</a><br>
            <a href="tel:+917319833790" style="margin-top:6px;display:inline-block;color:rgba(255,255,255,0.5)">+91 7319833790</a>
          </div>
        </div>
        <div class="fl">
          <h4>Company</h4>
          <a href="index.html">Home</a>
          <a href="about.html">About Us</a>
          <a href="team.html">Our Team</a>
          <a href="portfolio.html">Portfolio</a>
          <a href="contact.html">Contact</a>
        </div>
        <div class="fl">
          <h4>Services</h4>
          <a href="services.html">Website Development</a>
          <a href="services.html">Web App Development</a>
          <a href="services.html">Mobile Apps</a>
          <a href="services.html">UI/UX Design</a>
          <a href="services.html">Custom Software</a>
        </div>
        <div class="fl">
          <h4>Quick Links</h4>
          <a href="services.html">Pricing</a>
          <a href="contact.html">Get a Quote</a>
          <a href="portfolio.html">Case Studies</a>
          <a href="team.html">Meet the Team</a>
          <a href="contact.html">Support</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 <strong>NexCod Developers</strong>. All rights reserved. Crafted with precision.</p>
        <p>10,000+ Projects · 48+ Clients · 6+ Years</p>
      </div>
    </div>
  `;
  document.body.appendChild(f);
}

// ── REVEAL ──
function initReveal() {
  const all = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!all.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const delay = parseInt(e.target.dataset.delay || 0);
      setTimeout(() => e.target.classList.add('in'), delay);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  all.forEach(el => obs.observe(el));
}

// ── COUNTERS ──
function initCounters() {
  const els = document.querySelectorAll('.counter');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target);
      const dur = 2200, start = performance.now();
      const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(ease * target).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(el => obs.observe(el));
}

// ── CURSOR ──
function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;
  const dot  = document.createElement('div'); dot.className  = 'c-dot'; dot.id = 'cDot';
  const ring = document.createElement('div'); ring.className = 'c-ring'; ring.id = 'cRing';
  document.body.append(dot, ring);
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx+'px'; dot.style.top = my+'px'; });
  (function anim() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx+'px'; ring.style.top = ry+'px';
    requestAnimationFrame(anim);
  })();
  document.addEventListener('mouseleave', () => { dot.style.opacity='0'; ring.style.opacity='0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity='1'; ring.style.opacity='1'; });
  document.querySelectorAll('a,button,.card,.service-card,.port-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('c-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('c-hover'));
  });
}

// ── TOAST ──
window.showToast = function(msg, type='') {
  let t = document.getElementById('_toast');
  if (!t) { t = document.createElement('div'); t.id = '_toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.className = `toast${type==='gold'?' gold-t':''}`;
  t.innerHTML = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 4200);
};

document.addEventListener('DOMContentLoaded', () => {
  injectNavbar();
  injectFooter();
  initReveal();
  initCounters();
  initCursor();
});
