/* =========================================================
   KINGDOM IN THE SKY — slideshow.js
   Hero slideshow for the homepage.
   Features:
   - Automatic progression
   - Prev / next controls
   - Clickable indicators
   - Slide counter
   - Pause / resume (button + hover + focus)
   - Keyboard controls (left / right arrows, space to pause)
   - Prevents multiple running timers
   ========================================================= */

(function () {
  'use strict';

  const hero = document.getElementById('heroSlideshow');
  if (!hero) return;

  const slides = Array.from(hero.querySelectorAll('.slide'));
  const indicators = Array.from(hero.querySelectorAll('.indicator'));
  const prevBtn = document.getElementById('slidePrev');
  const nextBtn = document.getElementById('slideNext');
  const pauseBtn = document.getElementById('slidePause');
  const counterEl = document.getElementById('slideCounter');

  if (slides.length === 0) return;

  const AUTOPLAY_MS = 7000;
  let currentIndex = 0;
  let timerId = null;
  let isPaused = false;
  let isHovering = false;

  /* ---------- RENDER ---------- */
  function updateCounter(index) {
    if (!counterEl) return;
    const total = slides.length;
    const current = String(index + 1).padStart(2, '0');
    const overall = String(total).padStart(2, '0');
    counterEl.textContent = current + ' / ' + overall;
  }

  function updateIndicators(index) {
    indicators.forEach((ind, i) => {
      const active = i === index;
      ind.classList.toggle('active', active);
      ind.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function showSlide(index) {
    // Wrap-around index
    const total = slides.length;
    const nextIndex = ((index % total) + total) % total;

    slides.forEach((slide, i) => {
      const isActive = i === nextIndex;
      slide.classList.toggle('active', isActive);
      // Accessible: hide off-screen slides from assistive tech
      slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });

    currentIndex = nextIndex;
    updateIndicators(currentIndex);
    updateCounter(currentIndex);
  }

  /* ---------- NAVIGATION ---------- */
  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  function goToSlide(index) {
    showSlide(index);
  }

  /* ---------- AUTOPLAY ---------- */
  function clearTimer() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function startTimer() {
    clearTimer();
    // Do not autoplay if paused by user or hovered or reduced motion
    if (isPaused || isHovering || prefersReducedMotion()) return;
    timerId = setInterval(nextSlide, AUTOPLAY_MS);
  }

  function restartTimer() {
    clearTimer();
    startTimer();
  }

  function prefersReducedMotion() {
    return window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ---------- PAUSE / PLAY ---------- */
  function setPaused(state) {
    isPaused = state;

    if (pauseBtn) {
      pauseBtn.setAttribute('aria-label', state ? 'Play slideshow' : 'Pause slideshow');
      const icon = pauseBtn.querySelector('i');
      if (icon) {
        icon.className = state ? 'bi bi-play-fill' : 'bi bi-pause-fill';
      }
    }

    if (state) {
      clearTimer();
    } else {
      startTimer();
    }
  }

  function togglePause() {
    setPaused(!isPaused);
  }

  /* ---------- EVENTS ---------- */
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      restartTimer();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      restartTimer();
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener('click', togglePause);
  }

  indicators.forEach((ind, i) => {
    ind.addEventListener('click', () => {
      goToSlide(i);
      restartTimer();
    });

    ind.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goToSlide(i);
        restartTimer();
      }
    });
  });

  /* Pause on hover / focus within the hero */
  hero.addEventListener('mouseenter', () => {
    isHovering = true;
    clearTimer();
  });

  hero.addEventListener('mouseleave', () => {
    isHovering = false;
    startTimer();
  });

  hero.addEventListener('focusin', () => {
    isHovering = true;
    clearTimer();
  });

  hero.addEventListener('focusout', (event) => {
    // Only re-start if focus truly left the hero
    if (!hero.contains(event.relatedTarget)) {
      isHovering = false;
      startTimer();
    }
  });

  /* Keyboard controls when hero has focus */
  hero.setAttribute('tabindex', '-1');

  hero.addEventListener('keydown', (e) => {
    // Ignore if the event came from a form field
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        prevSlide();
        restartTimer();
        break;
      case 'ArrowRight':
        e.preventDefault();
        nextSlide();
        restartTimer();
        break;
      case ' ':
      case 'Spacebar':
        // Only intercept space when focus is on the hero container or slide
        if (e.target === hero || e.target.classList.contains('slide')) {
          e.preventDefault();
          togglePause();
        }
        break;
      default:
        break;
    }
  });

  /* Pause when page becomes hidden (tab switch) */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearTimer();
    } else if (!isPaused && !isHovering) {
      startTimer();
    }
  });

  /* ---------- INIT ---------- */
  function init() {
    showSlide(0);
    startTimer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();