/* =========================================================
   KINGDOM IN THE SKY — main.js
   Shared interactive features across all pages.
   ========================================================= */

(function () {
  'use strict';

  /* ---------- SAFE QUERY HELPERS ---------- */
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  /* ---------- FOOTER YEAR ---------- */
  function initFooterYear() {
    const yearEl = $('#footerYear');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  /* ---------- NAVBAR SCROLL STATE ---------- */
  function initNavbarScroll() {
    const navbar = $('#siteNavbar');
    if (!navbar) return;

    // If page starts at top (hero pages), start transparent.
    // Inner pages already carry .scrolled in their markup.
    const updateNavbar = () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        // Only remove if the page has a hero slideshow (homepage)
        const hasHero = document.querySelector('.hero-slideshow');
        if (hasHero) {
          navbar.classList.remove('scrolled');
        }
      }
    };

    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });
  }

  /* ---------- MOBILE NAV: close menu after clicking a link ---------- */
  function initMobileNavClose() {
    const navCollapse = $('#mainNav');
    if (!navCollapse) return;

    const navLinks = $$('.nav-links a', navCollapse);

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        const isOpen = navCollapse.classList.contains('show');
        const isMobile = window.innerWidth < 992;

        if (isOpen && isMobile && window.bootstrap) {
          const bsCollapse = bootstrap.Collapse.getInstance(navCollapse)
            || new bootstrap.Collapse(navCollapse, { toggle: false });
          bsCollapse.hide();
        }
      });
    });
  }

  /* ---------- SMOOTH SCROLLING FOR IN-PAGE ANCHORS ---------- */
  function initSmoothScroll() {
    const anchors = $$('a[href^="#"]');
    anchors.forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#' || href.length < 2) return;

        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();

        const navHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '88',
          10
        );

        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: top,
          behavior: 'smooth'
        });

        // Update focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  }

  /* ---------- SCROLL REVEAL VIA INTERSECTION OBSERVER ---------- */
  function initScrollReveal() {
    const revealEls = $$('.reveal');
    if (!revealEls.length) return;

    // Fallback: if IntersectionObserver is unavailable, just reveal.
    if (!('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
      }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  /* ---------- BACK TO TOP BUTTON ---------- */
  function initBackToTop() {
    const btn = $('#backToTop');
    if (!btn) return;

    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    };

    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ---------- IMAGE FALLBACK ---------- */
  function initImageFallback() {
    const images = $$('img');

    images.forEach((img) => {
      // If an image errors before this runs, replace it now.
      if (img.complete && img.naturalWidth === 0) {
        img.style.background = '#355B45';
      }

      img.addEventListener('error', () => {
        img.style.background = '#355B45';
        img.style.objectFit = 'cover';
      });
    });
  }

  /* ---------- HERO SLIDE COUNTER INIT (guard for slideshow.js) ---------- */
  function initHeroA11y() {
    const hero = $('#heroSlideshow');
    if (!hero) return;

    // Make sure indicators can be focused
    $$('.indicator', hero).forEach((ind) => {
      if (!ind.getAttribute('tabindex')) {
        ind.setAttribute('tabindex', '0');
      }
    });
  }

  /* ---------- INIT ---------- */
  function init() {
    try {
      initFooterYear();
      initNavbarScroll();
      initMobileNavClose();
      initSmoothScroll();
      initScrollReveal();
      initBackToTop();
      initImageFallback();
      initHeroA11y();
    } catch (error) {
      // Fail silently but log in development
      if (window.console && console.error) {
        console.error('main.js init error:', error);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();