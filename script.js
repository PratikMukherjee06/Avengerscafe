/* =========================================================
   THE AVENGERS CAFE — MAIN SCRIPT
   WITH FIXED BLUE ARC REACTOR
   ========================================================= */

(function () {
  'use strict';

  const body = document.body;
  const html = document.documentElement;
  const root = document.documentElement;

  const toastEl = document.getElementById('toast');
  const isTouch = matchMedia('(hover: none)').matches || 'ontouchstart' in window;
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, ctx = document) { return ctx.querySelector(sel); }
  function $$(sel, ctx = document) { return Array.from(ctx.querySelectorAll(sel)); }

  function showToast(msg, ms = 3200) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toastEl.classList.remove('show'), ms);
  }

  function rafThrottle(fn) {
    let ticking = false;
    return function (...args) {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { fn.apply(this, args); ticking = false; });
    };
  }

  function hexToRgba(hex, a) {
    const h = String(hex).replace('#', '');
    const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
    const r = parseInt(full.substring(0, 2), 16) || 0;
    const g = parseInt(full.substring(2, 4), 16) || 0;
    const b = parseInt(full.substring(4, 6), 16) || 0;
    return `rgba(${r},${g},${b},${a})`;
  }

  function refreshLucide() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }

  /* =================== SVG ICONS =================== */
  const ICONS = {
    ironman: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="ironHelm" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#e51e25"/>
            <stop offset="1" stop-color="#7a0d11"/>
          </linearGradient>
          <linearGradient id="ironFace" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#ffd54a"/>
            <stop offset="1" stop-color="#a87708"/>
          </linearGradient>
          <radialGradient id="ironGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stop-color="#7dd3fc" stop-opacity="1"/>
            <stop offset="1" stop-color="#0ea5e9" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <path d="M100 12 C60 12 42 42 42 82 L42 132 C42 168 68 188 100 188 C132 188 158 168 158 132 L158 82 C158 42 140 12 100 12 Z" fill="url(#ironHelm)" stroke="#2a0a0d" stroke-width="2"/>
        <path d="M100 28 C72 28 58 52 58 88 L58 130 C58 158 76 172 100 172 C124 172 142 158 142 130 L142 88 C142 52 128 28 100 28 Z" fill="url(#ironFace)" stroke="#5a3d05" stroke-width="2"/>
        <path d="M62 88 L92 88 L92 100 L62 100 Z" fill="#7dd3fc" stroke="#0c4a6e" stroke-width="1.5"/>
        <path d="M108 88 L138 88 L138 100 L108 100 Z" fill="#7dd3fc" stroke="#0c4a6e" stroke-width="1.5"/>
        <ellipse cx="77" cy="94" rx="8" ry="5" fill="url(#ironGlow)"/>
        <ellipse cx="123" cy="94" rx="8" ry="5" fill="url(#ironGlow)"/>
        <rect x="82" y="128" width="36" height="4" fill="#3a2803"/>
        <rect x="82" y="136" width="36" height="4" fill="#3a2803"/>
        <rect x="82" y="144" width="36" height="4" fill="#3a2803"/>
        <circle cx="100" cy="112" r="10" fill="#7dd3fc" stroke="#fff" stroke-width="2"/>
        <circle cx="100" cy="112" r="4" fill="#fff"/>
      </svg>`,
    cap: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <radialGradient id="capRed" cx="50%" cy="30%" r="70%">
            <stop offset="0" stop-color="#ff2a2a"/>
            <stop offset="1" stop-color="#8a0a0a"/>
          </radialGradient>
          <radialGradient id="capBlue" cx="50%" cy="50%" r="60%">
            <stop offset="0" stop-color="#2b4fd6"/>
            <stop offset="1" stop-color="#0d1f6e"/>
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="88" fill="url(#capRed)" stroke="#3a0505" stroke-width="3"/>
        <circle cx="100" cy="100" r="72" fill="#e8ecf3" stroke="#2a2a2a" stroke-width="1"/>
        <circle cx="100" cy="100" r="56" fill="url(#capRed)"/>
        <circle cx="100" cy="100" r="40" fill="#e8ecf3"/>
        <circle cx="100" cy="100" r="26" fill="url(#capBlue)"/>
        <path d="M100 62 L107 80 L126 80 L111 92 L117 111 L100 99 L83 111 L89 92 L74 80 L93 80 Z" fill="#e8ecf3" stroke="#0d1f6e" stroke-width="1.5"/>
      </svg>`,
    thor: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="hamHead" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#e5e7eb"/>
            <stop offset="0.5" stop-color="#9ca3af"/>
            <stop offset="1" stop-color="#4b5563"/>
          </linearGradient>
          <linearGradient id="hamHandle" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#8b5a2b"/>
            <stop offset="1" stop-color="#4a2c12"/>
          </linearGradient>
          <linearGradient id="lightning" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#7dd3fc"/>
            <stop offset="1" stop-color="#1d4ed8"/>
          </linearGradient>
        </defs>
        <rect x="25" y="42" width="150" height="72" rx="6" fill="url(#hamHead)" stroke="#1f2937" stroke-width="2"/>
        <rect x="25" y="42" width="150" height="18" rx="6" fill="#e5e7eb" opacity="0.6"/>
        <line x1="25" y1="88" x2="175" y2="88" stroke="#374151" stroke-width="2"/>
        <line x1="25" y1="96" x2="175" y2="96" stroke="#374151" stroke-width="2"/>
        <rect x="90" y="114" width="20" height="68" rx="3" fill="url(#hamHandle)" stroke="#2a1508" stroke-width="2"/>
        <rect x="88" y="114" width="24" height="10" fill="#9ca3af"/>
        <rect x="88" y="172" width="24" height="10" fill="#9ca3af"/>
        <path d="M178 60 L160 60 L172 78 L152 78 L182 118 L172 90 L192 90 Z" fill="url(#lightning)" stroke="#fff" stroke-width="1"/>
        <path d="M22 60 L40 60 L28 78 L48 78 L18 118 L28 90 L8 90 Z" fill="url(#lightning)" stroke="#fff" stroke-width="1"/>
      </svg>`,
    hulk: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="hulkSkin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#4ade80"/>
            <stop offset="0.5" stop-color="#22c55e"/>
            <stop offset="1" stop-color="#15803d"/>
          </linearGradient>
        </defs>
        <path d="M35 180 L35 110 Q35 85 60 85 L140 85 Q165 85 165 110 L165 180 Z" fill="url(#hulkSkin)" stroke="#064e2e" stroke-width="2.5"/>
        <path d="M35 100 L35 55 Q35 40 50 40 L62 40 Q74 40 74 55 L74 62 L84 62 L84 45 Q84 32 96 32 L108 32 Q120 32 120 45 L120 62 L130 62 L130 55 Q130 40 142 40 L154 40 Q165 40 165 55 L165 100 Z" fill="url(#hulkSkin)" stroke="#064e2e" stroke-width="2.5"/>
        <path d="M50 55 Q58 48 66 55" stroke="#064e2e" stroke-width="2" fill="none"/>
        <path d="M96 45 Q102 40 108 45" stroke="#064e2e" stroke-width="2" fill="none"/>
        <path d="M134 55 Q142 48 150 55" stroke="#064e2e" stroke-width="2" fill="none"/>
        <path d="M60 130 L75 130 M60 140 L75 140" stroke="#064e2e" stroke-width="2.5"/>
        <path d="M125 130 L140 130 M125 140 L140 140" stroke="#064e2e" stroke-width="2.5"/>
      </svg>`,
    thanos: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="gauntGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#fcd34d"/>
            <stop offset="0.5" stop-color="#d4a017"/>
            <stop offset="1" stop-color="#7a5a05"/>
          </linearGradient>
        </defs>
        <path d="M60 185 L60 110 Q60 90 80 90 L140 90 Q160 90 160 110 L160 185 Z" fill="url(#gauntGold)" stroke="#3a2803" stroke-width="2.5"/>
        <path d="M60 100 L40 100 Q28 100 28 88 L28 55 Q28 42 40 42 L52 42 Q64 42 64 55 L64 90 Z" fill="url(#gauntGold)" stroke="#3a2803" stroke-width="2.5"/>
        <path d="M100 100 L90 100 Q80 100 80 90 L80 30 Q80 18 92 18 L100 18 Q112 18 112 30 L112 90 Z" fill="url(#gauntGold)" stroke="#3a2803" stroke-width="2.5"/>
        <path d="M140 100 L160 100 Q172 100 172 88 L172 55 Q172 42 160 42 L148 42 Q136 42 136 55 L136 90 Z" fill="url(#gauntGold)" stroke="#3a2803" stroke-width="2.5"/>
        <circle cx="45" cy="75" r="8" fill="#9333ea" stroke="#fff" stroke-width="1.5"/>
        <circle cx="96" cy="40" r="8" fill="#3b82f6" stroke="#fff" stroke-width="1.5"/>
        <circle cx="155" cy="75" r="8" fill="#ef4444" stroke="#fff" stroke-width="1.5"/>
        <circle cx="80" cy="135" r="8" fill="#f97316" stroke="#fff" stroke-width="1.5"/>
        <circle cx="120" cy="135" r="8" fill="#eab308" stroke="#fff" stroke-width="1.5"/>
        <circle cx="100" cy="170" r="8" fill="#22c55e" stroke="#fff" stroke-width="1.5"/>
      </svg>`,
  };

  /* =================== HEROES DATA =================== */
  const HEROES = [
    { id: 'ironman', name: 'IRON MAN', tag: 'THE TECH HERO',
      desc: 'Genius. Billionaire. Playboy. Philanthropist. The armored Avenger who built his way to heroism — one arc reactor at a time.',
      color: '#b91c1c', color2: '#d4a017',
      bg: 'radial-gradient(circle at 30% 50%, rgba(185,28,28,0.35) 0%, transparent 60%)',
      power: 'Repulsors', weapon: 'Mark Suit', dish: 'IRON BURGER' },
    { id: 'cap', name: 'CAPTAIN AMERICA', tag: 'THE SHIELD HERO',
      desc: "The First Avenger. A man out of time who never stopped believing in doing what's right. I can do this all day.",
      color: '#1e3a8a', color2: '#dc2626',
      bg: 'radial-gradient(circle at 30% 50%, rgba(30,58,138,0.4) 0%, transparent 60%)',
      power: 'Vibranium', weapon: 'Shield', dish: 'SHIELD CLASSIC' },
    { id: 'thor', name: 'THOR', tag: 'THE THUNDER HERO',
      desc: 'God of Thunder. King of Asgard. The storm that walks. His hammer speaks for the heavens, and his heart for his friends.',
      color: '#4a90e2', color2: '#c0c6d0',
      bg: 'radial-gradient(circle at 30% 50%, rgba(74,144,226,0.35) 0%, transparent 60%)',
      power: 'Lightning', weapon: 'Mjolnir', dish: 'THUNDER FRIES' },
    { id: 'hulk', name: 'HULK', tag: 'THE SMASH HERO',
      desc: 'The strongest Avenger. The angrier he gets, the stronger he becomes. Big, green, and always hungry.',
      color: '#2ecc71', color2: '#16a34a',
      bg: 'radial-gradient(circle at 30% 50%, rgba(46,204,113,0.35) 0%, transparent 60%)',
      power: 'Gamma Rage', weapon: 'Fists', dish: 'HULK SMASH BURGER' },
    { id: 'thanos', name: 'THANOS', tag: 'THE TITAN',
      desc: 'The Mad Titan. Wielder of the Infinity Gauntlet. Balanced the universe once. Now he just wants a good meal.',
      color: '#8a2be2', color2: '#d4a017',
      bg: 'radial-gradient(circle at 30% 50%, rgba(138,43,226,0.4) 0%, transparent 60%)',
      power: 'Infinity Stones', weapon: 'Gauntlet', dish: 'INFINITY SHAKE' },
  ];

  /* =================== INTRO =================== */
  (function initIntro() {
    const intro = $('#intro');
    if (!intro) return;

    const skipBtn = $('#skipIntro');
    const canvas = $('#intro-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    const flashesContainer = $('#introFlashes');
    const logoEl = $('#introLogo');

    let particles = [];
    let animId = null;
    let phase = 'start';
    let finished = false;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth * DPR;
      canvas.height = window.innerHeight * DPR;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    function createParticles() {
      particles = [];
      if (!canvas) return;
      const colors = ['#ec1d24', '#4a90e2', '#8a2be2', '#2ecc71', '#d4a017', '#ffffff'];
      const W = window.innerWidth, H = window.innerHeight;
      const count = W < 640 ? 120 : 220;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * Math.max(W, H) * 0.7;
        particles.push({
          x: W / 2 + Math.cos(angle) * radius,
          y: H / 2 + Math.sin(angle) * radius,
          size: Math.random() * 1.8 + 0.4,
          speed: Math.random() * 0.6 + 0.2,
          color: colors[(Math.random() * colors.length) | 0],
          alpha: Math.random() * 0.7 + 0.15,
          angle,
        });
      }
    }

    function animate() {
      if (!ctx) return;
      const W = window.innerWidth, H = window.innerHeight;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      for (const p of particles) {
        if (phase === 'converge' || phase === 'logo') {
          p.x += (cx - p.x) * 0.012 * p.speed;
          p.y += (cy - p.y) * 0.012 * p.speed;
        } else {
          p.x += Math.cos(p.angle) * p.speed * 0.4;
          p.y += Math.sin(p.angle) * p.speed * 0.4;
          if (Math.random() < 0.008) p.angle += Math.PI;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(animate);
    }

    function flashIcons() {
      if (!flashesContainer || prefersReduced) return;
      const ids = ['ironman', 'cap', 'thor', 'hulk', 'thanos'];
      let i = 0;
      const interval = setInterval(() => {
        if (finished || i >= ids.length) { clearInterval(interval); return; }
        const hero = HEROES.find(h => h.id === ids[i]);
        if (!hero) { i++; return; }
        const el = document.createElement('div');
        el.className = 'flash-icon';
        el.innerHTML = ICONS[ids[i]];
        el.style.color = hero.color;
        flashesContainer.appendChild(el);

        const start = performance.now();
        const dur = 750;
        function anim(now) {
          const t = Math.min((now - start) / dur, 1);
          const opacity = t < 0.5 ? t * 2 : (1 - t) * 2;
          const scale = 0.9 + t * 0.4;
          const rot = -8 + t * 16;
          el.style.opacity = String(Math.max(0, opacity));
          el.style.transform = `scale(${scale}) rotate(${rot}deg)`;
          if (t < 1) requestAnimationFrame(anim);
          else el.remove();
        }
        requestAnimationFrame(anim);
        i++;
      }, 280);
    }

    function finish() {
      if (finished) return;
      finished = true;
      if (animId) cancelAnimationFrame(animId);
      intro.classList.add('hidden');
      body.classList.remove('intro-active');
      html.style.overflow = '';
      setTimeout(() => { intro.style.display = 'none'; }, 1000);
    }

    createParticles();
    animate();

    setTimeout(() => { phase = 'converge'; }, 800);
    setTimeout(() => { flashIcons(); }, 1200);
    setTimeout(() => { phase = 'logo'; if (logoEl) logoEl.classList.add('show'); }, 2400);
    setTimeout(() => { intro.classList.add('pulse'); }, 3600);
    setTimeout(finish, 4300);

    if (skipBtn) skipBtn.addEventListener('click', finish);
    setTimeout(finish, 7000);
  })();

  /* =================== NAVBAR =================== */
  (function initNavbar() {
    const navbar = $('#navbar');
    const mobileToggle = $('#mobileToggle');
    const navLinks = $('#navLinks');
    if (!navbar) return;

    const links = $$('.nav-link');
    let lastActive = '';

    const onScroll = rafThrottle(() => {
      const y = window.scrollY;
      if (y > 40) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');

      const sections = $$('section[id]');
      let current = '';
      for (const s of sections) {
        if (y >= s.offsetTop - 140) current = s.id;
      }
      if (current !== lastActive) {
        lastActive = current;
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
      }
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (mobileToggle && navLinks) {
      mobileToggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        mobileToggle.classList.toggle('open', open);
        mobileToggle.setAttribute('aria-expanded', String(open));
        body.style.overflow = open ? 'hidden' : '';
      });
      links.forEach(l => l.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
      }));
    }
  })();

  /* =================== SCROLL PROGRESS =================== */
  (function initScrollProgress() {
    const progress = $('#scrollProgress');
    if (!progress) return;
    const onScroll = rafThrottle(() => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  /* =================== HERO PARALLAX =================== */
  (function initHeroParallax() {
    if (isTouch || prefersReduced) return;
    const heroBg = $('#heroBg');
    const parallaxEls = $$('[data-parallax]');
    if (!heroBg && !parallaxEls.length) return;

    let mx = 0, my = 0, tx = 0, ty = 0, running = false;

    document.addEventListener('mousemove', (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!running) { running = true; requestAnimationFrame(tick); }
    }, { passive: true });

    function tick() {
      tx += (mx - tx) * 0.08;
      ty += (my - ty) * 0.08;
      if (heroBg) heroBg.style.transform = `translate3d(${tx * 22}px, ${ty * 22}px, 0) scale(1.06)`;
      parallaxEls.forEach(el => {
        const s = parseFloat(el.dataset.parallax) * 100;
        el.style.transform = `translate3d(${tx * s}px, ${ty * s}px, 0)`;
      });
      if (Math.abs(mx - tx) > 0.001 || Math.abs(my - ty) > 0.001) requestAnimationFrame(tick);
      else running = false;
    }
  })();

  /* =========================================================
     HERO SELECTION — Reactor stays BLUE (not changed by hero)
     ========================================================= */
  (function initHeroSelection() {
    const selector = $('#heroSelector');
    if (!selector) return;

    const displayIcon = $('#heroDisplayIcon');
    const infoTag = $('#heroInfoTag');
    const infoName = $('#heroInfoName');
    const infoDesc = $('#heroInfoDesc');
    const infoStats = $('#heroInfoStats');
    const stageBg = $('#heroStageBg');
    const heroesBg = $('#heroesBg');

    HEROES.forEach(hero => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'hero-chip';
      chip.dataset.id = hero.id;
      chip.setAttribute('aria-label', `Select ${hero.name}`);
      chip.style.setProperty('--chip-accent', hero.color);
      chip.innerHTML = `
        <div class="hero-chip-icon">${ICONS[hero.id]}</div>
        <div class="hero-chip-name">${hero.name}</div>
        <div class="hero-chip-bar"></div>
      `;
      chip.addEventListener('click', () => selectHero(hero));
      selector.appendChild(chip);
    });

    function selectHero(hero) {
      $$('.hero-chip').forEach(c => {
        const isActive = c.dataset.id === hero.id;
        c.classList.toggle('active', isActive);
        c.setAttribute('aria-pressed', String(isActive));
      });

      if (displayIcon) {
        displayIcon.innerHTML = ICONS[hero.id];
        displayIcon.style.animation = 'none';
        void displayIcon.offsetWidth;
        displayIcon.style.animation = '';
      }

      if (infoTag) infoTag.textContent = hero.tag;
      if (infoName) infoName.textContent = hero.name;
      if (infoDesc) infoDesc.textContent = hero.desc;
      if (infoStats) {
        infoStats.innerHTML = `
          <div class="info-stat"><span class="info-stat-label">POWER</span><span class="info-stat-value">${hero.power}</span></div>
          <div class="info-stat"><span class="info-stat-label">WEAPON</span><span class="info-stat-value">${hero.weapon}</span></div>
          <div class="info-stat"><span class="info-stat-label">SIGNATURE</span><span class="info-stat-value">${hero.dish}</span></div>
        `;
      }

      if (stageBg) stageBg.style.background = hero.bg;
      if (heroesBg) {
        heroesBg.style.background = `
          radial-gradient(circle at 50% 40%, ${hexToRgba(hero.color, 0.15)} 0%, transparent 55%),
          linear-gradient(180deg, #05060a 0%, #0a0c12 50%, #05060a 100%)
        `;
      }

      // Site accent changes with hero
      root.style.setProperty('--accent', hero.color);
      root.style.setProperty('--accent-2', hero.color2);

      // ✅ Reactor stays BLUE — just a subtle pulse to acknowledge
      const core = $('#reactorCore');
      if (core) {
        core.animate(
          [{ transform: 'scale(1)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }],
          { duration: 400, easing: 'ease-out' }
        );
      }
    }

    selectHero(HEROES[0]);
  })();

  /* =================== MENU =================== */
  (function initMenu() {
    const grid = $('#menuGrid');
    const catsContainer = $('#menuCategories');
    if (!grid || !catsContainer) return;

    const items = [
      { name: 'IRON BURGER', price: '₹250', desc: 'Double patty, molten cheddar, signature arc-reactor sauce.', cat: 'BURGERS', tag: 'SIGNATURE', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80' },
      { name: 'HULK SMASH BURGER', price: '₹280', desc: 'Triple patty, jalapeños, smoked cheese, smash sauce.', cat: 'BURGERS', tag: 'SPICY', img: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&q=80' },
      { name: 'SHIELD CLASSIC', price: '₹220', desc: 'The original. Beef-style patty, lettuce, tomato, shield sauce.', cat: 'BURGERS', tag: 'CLASSIC', img: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80' },
      { name: 'THUNDER FRIES', price: '₹150', desc: 'Crispy golden fries with electric cheese drizzle.', cat: 'FRIES', tag: 'POPULAR', img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80' },
      { name: 'AVENGERS LOADED PIZZA', price: '₹350', desc: 'Pepperoni, chicken, bell peppers, extra mozzarella.', cat: 'PIZZA', tag: 'POPULAR', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80' },
      { name: 'HAWKEYE PIZZA', price: '₹300', desc: 'Precision-cut pepperoni and thin-crust perfection.', cat: 'PIZZA', tag: 'NEW', img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80' },
      { name: 'BLACK WIDOW PASTA', price: '₹260', desc: 'Red sauce pasta with a slow-burn chilli kick.', cat: 'PASTA', tag: 'SPICY', img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80' },
      { name: 'WHITE SAUCE PASTA', price: '₹240', desc: 'Creamy alfredo, herbs, parmesan. Comfort in a bowl.', cat: 'PASTA', tag: 'CLASSIC', img: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=600&q=80' },
      { name: 'ARC REACTOR SHAKE', price: '₹180', desc: 'Blueberry shake with glowing cream and popping candy.', cat: 'SHAKES', tag: 'SIGNATURE', img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=80' },
      { name: 'INFINITY SHAKE', price: '₹220', desc: 'All-flavor shake topped with rainbow sprinkles and stones.', cat: 'SHAKES', tag: 'PREMIUM', img: 'https://images.unsplash.com/photo-1553787499-6f9133860278?w=600&q=80' },
      { name: 'CHILLI CHICKEN', price: '₹200', desc: 'Dry chilli chicken, wok-tossed with peppers.', cat: 'DRINKS', tag: 'HOT', img: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80' },
      { name: 'CHOCOLATE BROWNIE', price: '₹150', desc: 'Warm brownie with vanilla ice cream. A classic.', cat: 'DESSERTS', tag: 'POPULAR', img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80' },
    ];

    const cats = ['ALL', 'BURGERS', 'PIZZA', 'PASTA', 'FRIES', 'SHAKES', 'DRINKS', 'DESSERTS'];
    let active = 'ALL';

    function renderCats() {
      catsContainer.innerHTML = '';
      cats.forEach(c => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = `category-btn ${c === active ? 'active' : ''}`;
        b.textContent = c;
        b.addEventListener('click', () => { active = c; renderCats(); render(); });
        catsContainer.appendChild(b);
      });
    }

    function render() {
      grid.innerHTML = '';
      const list = active === 'ALL' ? items : items.filter(i => i.cat === active);
      const frag = document.createDocumentFragment();
      list.forEach(i => {
        const el = document.createElement('article');
        el.className = 'menu-item';
        el.innerHTML = `
          <div class="menu-item-img-wrap">
            <img class="menu-item-img" src="${i.img}" alt="${i.name}" loading="lazy" decoding="async" width="600" height="200" />
            <span class="menu-item-tag">${i.tag}</span>
          </div>
          <div class="menu-item-info">
            <div class="menu-item-header">
              <span class="menu-item-name">${i.name}</span>
              <span class="menu-item-price">${i.price}</span>
            </div>
            <p class="menu-item-desc">${i.desc}</p>
          </div>
        `;
        frag.appendChild(el);
      });
      grid.appendChild(frag);
    }

    renderCats();
    render();
  })();

  /* =================== SHOWCASE PARALLAX =================== */
  (function initShowcase() {
    const bg = $('#showcaseBg');
    if (!bg || prefersReduced) return;
    const onScroll = rafThrottle(() => {
      const rect = bg.parentElement.getBoundingClientRect();
      const p = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      bg.style.transform = `scale(1.12) translate3d(0, ${(p - 0.5) * 50}px, 0)`;
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  /* =========================================================
     ARC REACTOR — FIXED BLUE THEME
     ========================================================= */
  (function initReactor() {
    const container = $('#reactorContainer');
    const core = $('#reactorCore');
    const ticks = $('#reactorTicks');
    const level = $('#powerLevel');
    const bar = $('#reactorBarFill');
    const hint = $('#reactorHint');
    if (!container || !core) return;

    if (isTouch && hint) hint.textContent = 'Tap the reactor to release a pulse.';

    function buildTicks() {
      if (!ticks) return;
      ticks.innerHTML = '';
      const size = container.offsetWidth;
      if (!size) return;
      const count = size < 300 ? 32 : 48;
      const radius = size / 2 - 10;
      const frag = document.createDocumentFragment();
      for (let i = 0; i < count; i++) {
        const angle = (i * 360) / count;
        const t = document.createElement('div');
        t.className = 'reactor-tick';
        t.style.transform = `translate(-50%, 0) rotate(${angle}deg) translateY(${-radius}px)`;
        frag.appendChild(t);
      }
      ticks.appendChild(frag);
    }

    buildTicks();

    if (window.ResizeObserver) {
      new ResizeObserver(rafThrottle(buildTicks)).observe(container);
    } else {
      window.addEventListener('resize', rafThrottle(buildTicks));
    }

    let power = 0;
    let isPulsing = false;
    let mx = 0, my = 0, cx = 0, cy = 0;

    function setCoreTransform() {
      core.style.transform = `translate3d(${cx * 22}px, ${cy * 22}px, 0) scale(1.05)`;
    }

    let moveRaf = null;
    function moveLoop() {
      cx += (mx - cx) * 0.1;
      cy += (my - cy) * 0.1;
      setCoreTransform();
      if (Math.abs(mx - cx) > 0.001 || Math.abs(my - cy) > 0.001) {
        moveRaf = requestAnimationFrame(moveLoop);
      } else {
        moveRaf = null;
      }
    }

    function handleMove(clientX, clientY) {
      const r = container.getBoundingClientRect();
      mx = (clientX - r.left) / r.width - 0.5;
      my = (clientY - r.top) / r.height - 0.5;
      if (mx < -0.75 || mx > 0.75 || my < -0.75 || my > 0.75) { mx = 0; my = 0; }
      if (!moveRaf && !prefersReduced) moveRaf = requestAnimationFrame(moveLoop);
    }

    function handleLeave() {
      mx = 0; my = 0;
      if (!moveRaf && !prefersReduced) moveRaf = requestAnimationFrame(moveLoop);
    }

    container.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY), { passive: true });
    container.addEventListener('mouseleave', handleLeave);
    container.addEventListener('touchmove', (e) => {
      const t = e.touches[0];
      if (t) handleMove(t.clientX, t.clientY);
    }, { passive: true });
    container.addEventListener('touchend', handleLeave, { passive: true });

    if (!document.getElementById('pulseRingKf')) {
      const style = document.createElement('style');
      style.id = 'pulseRingKf';
      style.textContent = `
        @keyframes pulseRing {
          0% { transform: scale(0.4); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes screenShake {
          0%,100% { transform: translate3d(0,0,0); }
          15% { transform: translate3d(-5px,-4px,0); }
          30% { transform: translate3d(4px,4px,0); }
          45% { transform: translate3d(-4px,5px,0); }
          60% { transform: translate3d(4px,-5px,0); }
          75% { transform: translate3d(-3px,3px,0); }
          90% { transform: translate3d(3px,-3px,0); }
        }
      `;
      document.head.appendChild(style);
    }

    function pulse() {
      if (isPulsing) return;
      isPulsing = true;

      const main = $('#mainWrap');
      if (main && !prefersReduced) {
        main.style.animation = 'screenShake 0.45s ease';
        setTimeout(() => { main.style.animation = ''; }, 480);
      }

      // ✅ Blue pulse ring
      const pr = document.createElement('div');
      pr.style.cssText = `position:absolute;inset:0;border-radius:50%;border:3px solid #38bdf8;animation:pulseRing 0.9s ease-out forwards;pointer-events:none;z-index:5;box-shadow:0 0 30px #38bdf8;`;
      container.appendChild(pr);
      setTimeout(() => pr.remove(), 950);

      const start = performance.now();
      const dur = 1600;
      const startPower = power;

      function anim(now) {
        const t = Math.min((now - start) / dur, 1);
        power = Math.floor(startPower + (100 - startPower) * t);
        if (level) level.textContent = power + '%';
        if (bar) bar.style.width = power + '%';

        // ✅ Blue glow, scales with power
        const scale = 1 + t * 0.6;
        core.style.boxShadow = `
          0 0 ${60 * scale}px ${25 * scale}px rgba(56, 189, 248, 0.7),
          0 0 ${120 * scale}px ${60 * scale}px rgba(74, 144, 226, 0.45),
          0 0 ${200 * scale}px ${100 * scale}px rgba(30, 58, 138, 0.25)
        `;

        if (t < 1) requestAnimationFrame(anim);
        else {
          isPulsing = false;
          setTimeout(() => {
            power = 0;
            if (level) level.textContent = '0%';
            if (bar) bar.style.width = '0%';
          }, 2200);
        }
      }
      requestAnimationFrame(anim);
    }

    container.addEventListener('click', pulse);
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pulse(); }
    });
  })();

  /* =================== INSIDE HQ =================== */
  (function initHQ() {
    const scroll = $('#hqScroll');
    if (!scroll) return;
    const items = [
      { num: '01 / SPACE', label: 'THE SPACE', img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80' },
      { num: '02 / FOOD', label: 'THE FOOD', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80' },
      { num: '03 / VIBE', label: 'THE VIBE', img: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80' },
      { num: '04 / PEOPLE', label: 'THE PEOPLE', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80' },
    ];
    const frag = document.createDocumentFragment();
    items.forEach(i => {
      const el = document.createElement('article');
      el.className = 'hq-item';
      el.innerHTML = `
        <img src="${i.img}" alt="${i.label}" loading="lazy" decoding="async" width="800" height="440" />
        <div class="hq-content">
          <div class="hq-num">${i.num}</div>
          <div class="hq-label">${i.label}</div>
        </div>
      `;
      frag.appendChild(el);
    });
    scroll.appendChild(frag);
  })();

  /* =================== GALLERY =================== */
  (function initGallery() {
    const grid = $('#galleryGrid');
    if (!grid) return;
    const items = [
      { img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=700&q=80', label: 'SODEPUR • 01', title: 'THE SPACE' },
      { img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&q=80', label: 'SODEPUR • 02', title: 'THE FOOD' },
      { img: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=700&q=80', label: 'SODEPUR • 03', title: 'THE EXPERIENCE' },
      { img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&q=80', label: 'SODEPUR • 04', title: 'THE VIBE' },
      { img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=700&q=80', label: 'SODEPUR • 05', title: 'THE BURGER' },
      { img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=700&q=80', label: 'SODEPUR • 06', title: 'THE PIZZA' },
    ];
    const frag = document.createDocumentFragment();
    items.forEach(i => {
      const el = document.createElement('figure');
      el.className = 'gallery-item';
      el.innerHTML = `
        <img src="${i.img}" alt="${i.title}" loading="lazy" decoding="async" width="700" height="700" />
        <figcaption class="gallery-item-overlay">
          <span class="gallery-item-label">${i.label}</span>
          <span class="gallery-item-title">${i.title}</span>
        </figcaption>
      `;
      frag.appendChild(el);
    });
    grid.appendChild(frag);
  })();

  /* =================== BOOKING MODAL =================== */
  (function initBooking() {
    const modal = $('#bookingModal');
    const closeBtn = $('#modalClose');
    const form = $('#bookingForm');
    if (!modal) return;

    const openers = [$('#navBookBtn'), $('#heroBookBtn'), $('#locationBookBtn'), $('#bookingCtaBtn')].filter(Boolean);
    let lastFocused = null;

    function open() {
      lastFocused = document.activeElement;
      modal.classList.add('open');
      body.style.overflow = 'hidden';
      const d = $('#date');
      if (d && !d.value) {
        const t = new Date();
        t.setDate(t.getDate() + 1);
        d.value = t.toISOString().split('T')[0];
        d.min = new Date().toISOString().split('T')[0];
      }
      setTimeout(() => { const f = $('#name'); if (f) f.focus(); }, 100);
    }
    function close() {
      modal.classList.remove('open');
      body.style.overflow = '';
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    openers.forEach(b => b.addEventListener('click', open));
    if (closeBtn) closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = $('#name'), phone = $('#phone'), date = $('#date'), time = $('#time'), guests = $('#guests');

        if (!name.value.trim() || !phone.value.trim() || !date.value || !time.value) {
          showToast('⚠ Please fill all required fields');
          return;
        }
        if (phone.value.trim().length < 8) {
          showToast('⚠ Please enter a valid phone number');
          return;
        }

        const data = {
          name: name.value.trim(), phone: phone.value.trim(),
          date: date.value, time: time.value, guests: guests.value,
          ts: new Date().toISOString(),
        };

        try {
          const arr = JSON.parse(localStorage.getItem('avengersBookings') || '[]');
          arr.push(data);
          localStorage.setItem('avengersBookings', JSON.stringify(arr));
        } catch (err) {}

        showToast('✓ Booking confirmed! We will contact you shortly.');
        form.reset();
        close();
      });
    }
  })();

  /* =================== FINAL PARTICLES =================== */
  (function initFinalParticles() {
    const canvas = $('#finalCanvas');
    const section = $('#final');
    if (!canvas || !section || prefersReduced) return;
    const ctx = canvas.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    let parts = [], running = false, accentColor = '#ec1d24';

    function readAccent() {
      const v = getComputedStyle(root).getPropertyValue('--accent').trim();
      if (v) accentColor = v;
    }
    readAccent();
    new MutationObserver(readAccent).observe(root, { attributes: true, attributeFilter: ['style'] });

    function resize() {
      const w = section.offsetWidth, h = section.offsetHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      makeParts(w, h);
    }

    function makeParts(w, h) {
      parts = [];
      const count = w < 640 ? 30 : 55;
      for (let i = 0; i < count; i++) {
        parts.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -Math.random() * 0.5 - 0.1,
          size: Math.random() * 1.6 + 0.4,
          alpha: Math.random() * 0.6 + 0.15,
        });
      }
    }

    function loop() {
      if (!running) return;
      const w = section.offsetWidth, h = section.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(loop);
    }

    resize();
    const rt = rafThrottle(resize);
    window.addEventListener('resize', rt);
    if (window.ResizeObserver) new ResizeObserver(rt).observe(section);

    new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (en.isIntersecting) { if (!running) { running = true; loop(); } }
        else running = false;
      }
    }, { threshold: 0.05 }).observe(section);
  })();

  /* =================== FINAL CTA =================== */
  (function initFinalCTA() {
    const btn = $('#enterHqBtn');
    if (btn) btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  })();

  /* =================== SCROLL REVEAL =================== */
  (function initReveal() {
    if (!('IntersectionObserver' in window)) return;
    const els = $$('.section-title, .section-subtitle, .menu-item, .gallery-item, .hq-item, .hero-chip, .location-info, .location-map');
    if (!els.length) return;
    els.forEach(e => e.classList.add('reveal'));
    const obs = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); }
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    els.forEach(e => obs.observe(e));
  })();

  /* =================== SMOOTH ANCHORS =================== */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
  });

  /* =================== LUCIDE INIT =================== */
  function bootLucide() { refreshLucide(); }
  if (document.readyState === 'complete') bootLucide();
  else window.addEventListener('load', bootLucide);
  setTimeout(bootLucide, 800);
  setTimeout(bootLucide, 2000);

})();