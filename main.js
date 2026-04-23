/* ============================================================
   PORTFOLIO — main.js
   ============================================================ */

'use strict';

/* ----------------------------------------------------------
   THEME TOGGLE
   ---------------------------------------------------------- */
(function initTheme() {
  const html = document.documentElement;
  const btn  = document.getElementById('theme-toggle');
  if (!btn) return;

  function setTheme(theme) {
    // Brief transition class for smooth color swap
    document.body.classList.add('theme-transitioning');
    html.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    setTimeout(() => document.body.classList.remove('theme-transitioning'), 420);
  }

  btn.addEventListener('click', () => {
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });

  // Keyboard support
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
})();

/* ----------------------------------------------------------
   PAGE INTRO LOADER
   ---------------------------------------------------------- */
(function initIntro() {
  const intro = document.createElement('div');
  intro.className = 'page-intro';
  intro.id = 'page-intro';
  const text = document.createElement('span');
  text.className = 'page-intro-text';
  text.textContent = 'jpag.';
  intro.appendChild(text);
  document.body.prepend(intro);

  window.addEventListener('load', () => {
    setTimeout(() => {
      intro.classList.add('fade-out');
      intro.addEventListener('animationend', () => {
        intro.remove();
        // trigger hero reveals after intro
        requestAnimationFrame(triggerInitialReveals);
      }, { once: true });
    }, 900);
  });
})();

/* ----------------------------------------------------------
   CUSTOM CURSOR
   ---------------------------------------------------------- */
(function initCursor() {
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursor-dot');
  if (!cursor || !cursorDot) return;

  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;
  let raf;

  function lerp(a, b, t) { return a + (b - a) * t; }

  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  function animateCursor() {
    dotX = lerp(dotX, cursorX, 0.18);
    dotY = lerp(dotY, cursorY, 0.18);

    cursor.style.left    = cursorX + 'px';
    cursor.style.top     = cursorY + 'px';
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top  = dotY + 'px';

    raf = requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // hover state on interactive elements
  const hoverTargets = 'a, button, [data-hover]';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('is-hovered');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('is-hovered');
    }
  });

  // click flash
  document.addEventListener('mousedown', () => cursor.classList.add('is-clicked'));
  document.addEventListener('mouseup',   () => cursor.classList.remove('is-clicked'));

  // hide on leave/enter
  document.addEventListener('mouseleave', () => {
    cursor.classList.add('is-hidden');
    cursorDot.classList.add('is-hidden');
  });
  document.addEventListener('mouseenter', () => {
    cursor.classList.remove('is-hidden');
    cursorDot.classList.remove('is-hidden');
  });
})();

/* ----------------------------------------------------------
   NAV SCROLL BEHAVIOUR
   ---------------------------------------------------------- */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 60) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ----------------------------------------------------------
   SMOOTH ANCHOR SCROLL
   ---------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ----------------------------------------------------------
   SCROLL REVEAL (IntersectionObserver)
   ---------------------------------------------------------- */
function triggerInitialReveals() {
  // immediately reveal hero elements that are in viewport
  document.querySelectorAll('.hero .reveal').forEach(el => {
    el.classList.add('in-view');
  });
}

(function initReveal() {
  const options = {
    root: null,
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  // projects have their own class
  document.querySelectorAll('.project').forEach(el => observer.observe(el));

  // all generic reveal elements outside hero (hero handled separately)
  document.querySelectorAll('.reveal').forEach(el => {
    if (!el.closest('.hero')) {
      observer.observe(el);
    }
  });
})();

/* ----------------------------------------------------------
   ANIMATED STAT COUNTERS
   ---------------------------------------------------------- */
(function initCounters() {
  const stats = document.querySelectorAll('.stat-num[data-target]');
  if (!stats.length) return;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutCubic(progress);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
})();

/* ----------------------------------------------------------
   FOOTER — LOCAL TIME
   ---------------------------------------------------------- */
(function initClock() {
  const el = document.getElementById('footer-time');
  if (!el) return;

  function tick() {
    const now = new Date();
    const opts = {
      hour:     '2-digit',
      minute:   '2-digit',
      second:   '2-digit',
      hour12:   false,
      timeZoneName: 'short',
    };
    el.textContent = now.toLocaleTimeString('en-IN', opts);
  }

  tick();
  setInterval(tick, 1000);
})();

/* ----------------------------------------------------------
   MARQUEE – pause on hover
   ---------------------------------------------------------- */
(function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;

  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
})();

/* ----------------------------------------------------------
   PROJECT ROW – tilt subtle effect on mouse move
   ---------------------------------------------------------- */
(function initProjectTilt() {
  document.querySelectorAll('.project').forEach(project => {
    const inner = project.querySelector('.project-inner');
    if (!inner) return;

    project.addEventListener('mousemove', (e) => {
      const rect   = project.getBoundingClientRect();
      const x      = (e.clientX - rect.left) / rect.width  - 0.5;
      const y      = (e.clientY - rect.top)  / rect.height - 0.5;
      inner.style.transform = `perspective(800px) rotateX(${(-y * 1.5).toFixed(2)}deg) rotateY(${(x * 1.5).toFixed(2)}deg)`;
    });

    project.addEventListener('mouseleave', () => {
      inner.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
      inner.style.transition = `transform 0.5s cubic-bezier(0.16,1,0.3,1)`;
    });

    project.addEventListener('mouseenter', () => {
      inner.style.transition = 'transform 0.12s ease';
    });
  });
})();

/* ----------------------------------------------------------
   TEXT SCRAMBLE on nav logo hover
   ---------------------------------------------------------- */
(function initScramble() {
  const logo = document.querySelector('.logo-text');
  if (!logo) return;

  const chars  = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const original = logo.textContent;
  let interval = null;

  logo.closest('a').addEventListener('mouseenter', () => {
    let iteration = 0;
    clearInterval(interval);
    interval = setInterval(() => {
      logo.textContent = original
        .split('')
        .map((char, idx) => {
          if (idx < iteration) return original[idx];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      if (iteration >= original.length) clearInterval(interval);
      iteration += 0.35;
    }, 40);
  });

  logo.closest('a').addEventListener('mouseleave', () => {
    clearInterval(interval);
    logo.textContent = original;
  });
})();

/* ----------------------------------------------------------
   POST LIST – highlight interaction refinement
   ---------------------------------------------------------- */
(function initPosts() {
  const list = document.querySelector('.post-list');
  if (!list) return;
  // Handled entirely in CSS via :hover on .post-list
})();
