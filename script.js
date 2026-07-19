document.addEventListener('DOMContentLoaded', () => {

  /* ============ DARK MODE: botão no hero ============ */
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleIcon = document.getElementById('themeToggleIcon');
  const root = document.documentElement;

  const applyIcon = (isDark) => {
    if (!themeToggleIcon) return;
    themeToggleIcon.classList.toggle('fa-moon', !isDark);
    themeToggleIcon.classList.toggle('fa-sun', isDark);
  };

  applyIcon(root.getAttribute('data-theme') === 'dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';

      if (next === 'dark') {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }

      themeToggle.setAttribute('aria-pressed', String(next === 'dark'));
      applyIcon(next === 'dark');

      try {
        localStorage.setItem('theme', next);
      } catch (e) {
        /* segue sem salvar a preferência */
      }
    });
  }

  /* ============ HEADER: sombra ao rolar ============ */
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ============ MENU MOBILE ============ */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ============ ACCORDION (FAQ) ============ */
  const accordionItems = document.querySelectorAll('.accordion__item');

  accordionItems.forEach((item) => {
    const header = item.querySelector('.accordion__header');
    const panel = item.querySelector('.accordion__panel');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // fecha todos
      accordionItems.forEach((other) => {
        other.classList.remove('active');
        other.querySelector('.accordion__panel').style.maxHeight = null;
      });

      // abre o clicado, se não estava aberto
      if (!isActive) {
        item.classList.add('active');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ============ SCROLL REVEAL (IntersectionObserver) ============ */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ============ ANIMAÇÃO: avião voando na curva do hero ============ */
  const path = document.getElementById('flightCurve');
  const planeGroup = document.getElementById('planeGroup');

  if (path && planeGroup && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const pathLength = path.getTotalLength();
    const duration = 6000; // ms
    let startTime = null;

    function animatePlane(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) % duration;
      const progress = elapsed / duration;
      const point = path.getPointAtLength(progress * pathLength);

      // Calcula ângulo de rotação olhando um pouco à frente na curva
      const nextPoint = path.getPointAtLength(Math.min(progress * pathLength + 1, pathLength));
      const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);

      planeGroup.setAttribute(
        'transform',
        `translate(${point.x}, ${point.y}) rotate(${angle})`
      );

      requestAnimationFrame(animatePlane);
    }

    requestAnimationFrame(animatePlane);
  }

  /* ============ SMOOTH SCROLL fallback para navegadores antigos ============ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

});
