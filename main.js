/* ═══════════════════════════════════════════════
   CURSOR
═══════════════════════════════════════════════ */
const dot  = document.getElementById('cur-dot');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left  = mx + 'px';
  dot.style.top   = my + 'px';
});

const interactors = 'a, button, .proj-card, .skill-card, .cert-card, .reco-card, .edu-card, .lang-card, .interest-pill, .tag';
document.querySelectorAll(interactors).forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('big'));
  el.addEventListener('mouseleave', () => ring.classList.remove('big'));
});

(function animateRing() {
  rx += (mx - rx) * 0.10;
  ry += (my - ry) * 0.10;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animateRing);
})();

/* ═══════════════════════════════════════════════
   SCROLL PROGRESS BAR
═══════════════════════════════════════════════ */
const prog = document.getElementById('scroll-prog');
function updateProg() {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  prog.style.width = Math.min(pct, 100) + '%';
}
window.addEventListener('scroll', updateProg, { passive: true });

/* ═══════════════════════════════════════════════
   ACTIVE NAV
═══════════════════════════════════════════════ */
const sectionOrder = ['about','skills','projects','experience','education','certifications','recommendations','contact'];
const navLinks     = document.querySelectorAll('#navPills a[data-s], #mobileMenu a[data-s]');

function updateNav() {
  const mid    = window.scrollY + window.innerHeight * 0.4;
  let active   = -1;
  sectionOrder.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= mid) active = i;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.dataset.s === sectionOrder[active]);
  });
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ═══════════════════════════════════════════════
   MOBILE MENU
═══════════════════════════════════════════════ */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close on link click
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ═══════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════ */
const rvEls = document.querySelectorAll('.rv');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
rvEls.forEach(el => observer.observe(el));

/* ═══════════════════════════════════════════════
   LANGUAGE BARS — animate when visible
═══════════════════════════════════════════════ */
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const fill = e.target.querySelector('.lang-bar-fill');
      if (fill) fill.style.width = fill.dataset.w;
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.lang-bar-bg').forEach(el => barObs.observe(el));

/* ═══════════════════════════════════════════════
   LANGUAGE TOGGLE
═══════════════════════════════════════════════ */
const htmlEl = document.documentElement;
document.querySelectorAll('.lang-sw button').forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.l;
    htmlEl.lang = lang;
    document.querySelectorAll('.lang-sw button').forEach(b =>
      b.classList.toggle('active', b.dataset.l === lang)
    );
  });
});

/* ═══════════════════════════════════════════════
   TYPEWRITER EFFECT
═══════════════════════════════════════════════ */
function typewriter(el, phrases, speed = 70, pause = 1800) {
  let pi = 0, ci = 0, deleting = false;
  el.classList.add('typewriter');

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) {
        deleting = true;
        setTimeout(tick, pause);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? speed / 2 : speed);
  }
  tick();
}

const twEl = document.getElementById('typewriter-target');
if (twEl) {
  const phrasesFr = [ "Développeur Full-Stack",
    "Assurance qualité (QA)",
    "Étudiant en Master MQL",
    
    "Agile & DevOps"];
  const phrasesEn = ["Full-Stack Developer",
    "Quality Assurance (QA)",
    "Master's Student in Software Quality",
    "Agile & DevOps"];
  typewriter(twEl, htmlEl.lang === 'en' ? phrasesEn : phrasesFr);

  // Update phrases on language switch
  document.querySelectorAll('.lang-sw button').forEach(btn => {
    btn.addEventListener('click', () => {
      // typewriter will cycle through next; we don't reset to keep it smooth
    });
  });
}

/* ═══════════════════════════════════════════════
   SMOOTH TITLE ENTRANCE (hero)
═══════════════════════════════════════════════ */
document.querySelectorAll('.hero-name').forEach(el => {
  el.style.clipPath = 'inset(0 100% 0 0)';
  el.style.transition = 'clip-path 1s cubic-bezier(.16,1,.3,1) .2s';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { el.style.clipPath = 'inset(0 0% 0 0)'; });
  });
});