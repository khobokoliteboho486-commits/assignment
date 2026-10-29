/* =========================================================
   KINGDOM IN THE SKY — gallery.js
   Gallery filtering + accessible lightbox.
   Only runs on gallery.html.
   ========================================================= */

(function () {
  'use strict';

  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  const filterButtons = Array.from(document.querySelectorAll('.gallery-filters .filter-btn'));
  const galleryEmpty = document.getElementById('galleryEmpty');
  const allItems = Array.from(grid.querySelectorAll('.gallery-item'));

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentFilter = 'all';
  let activeList = [];          // Currently-visible items after filtering
  let currentLightboxIndex = 0;
  let lastFocusedTrigger = null;

  /* ---------- FILTERING ---------- */
  function applyFilter(filter) {
    currentFilter = filter;
    let visibleCount = 0;

    allItems.forEach((item) => {
      const category = (item.dataset.category || '').toLowerCase();
      const show = filter === 'all' || category === filter;

      if (show) {
        item.classList.remove('hidden');
        visibleCount++;
      } else {
        item.classList.add('hidden');
      }
    });

    if (galleryEmpty) {
      galleryEmpty.hidden = visibleCount > 0;
    }

    filterButtons.forEach((btn) => {
      const isActive = btn.dataset.filter === filter;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    // Refresh activeList
    refreshActiveList();
  }

  function refreshActiveList() {
    activeList = allItems.filter((item) => !item.classList.contains('hidden'));
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      applyFilter(btn.dataset.filter);
    });
  });

  /* ---------- LIGHTBOX ---------- */
  if (!lightbox) return;

  function getImageData(item) {
    const img = item.querySelector('img');
    const caption = item.dataset.caption || '';
    return {
      src: img ? img.src : '',
      alt: img ? img.alt : '',
      caption: caption
    };
  }

  function renderLightbox(index) {
    if (!activeList.length) return;

    // Wrap around
    const total = activeList.length;
    const safeIndex = ((index % total) + total) % total;
    currentLightboxIndex = safeIndex;

    const item = activeList[safeIndex];
    const data = getImageData(item);

    if (lightboxImage) {
      lightboxImage.classList.add('loading');
      lightboxImage.src = data.src;
      lightboxImage.alt = data.alt;

      // Remove loading class once loaded
      if (lightboxImage.complete) {
        lightboxImage.classList.remove('loading');
      } else {
        lightboxImage.onload = () => {
          lightboxImage.classList.remove('loading');
        };
      }
    }

    if (lightboxCaption) {
      lightboxCaption.textContent = data.caption || '';
    }

    if (lightboxCounter) {
      lightboxCounter.textContent =
        String(safeIndex + 1) + ' / ' + String(total);
    }
  }

  function openLightbox(item, trigger) {
    refreshActiveList();
    const index = activeList.indexOf(item);
    if (index === -1) return;

    lastFocusedTrigger = trigger || null;

    renderLightbox(index);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Move focus to close button (best first stop for screen readers)
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Restore focus to the trigger that opened it
    if (lastFocusedTrigger) {
      lastFocusedTrigger.focus();
      lastFocusedTrigger = null;
    }
  }

  function nextImage() {
    if (!activeList.length) return;
    renderLightbox(currentLightboxIndex + 1);
  }

  function prevImage() {
    if (!activeList.length) return;
    renderLightbox(currentLightboxIndex - 1);
  }

  /* ---------- ATTACH OPENERS ---------- */
  allItems.forEach((item) => {
    const trigger = item.querySelector('.gallery-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      openLightbox(item, trigger);
    });
  });

  /* ---------- CONTROLS ---------- */
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', nextImage);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', prevImage);
  }

  // Close when clicking the backdrop
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  /* ---------- KEYBOARD CONTROLS ---------- */
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowRight':
        e.preventDefault();
        nextImage();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        prevImage();
        break;
      case 'Tab':
        // Focus trap: keep focus inside lightbox
        trapFocus(e);
        break;
      default:
        break;
    }
  });

  function trapFocus(e) {
    const focusable = [lightboxClose, lightboxPrev, lightboxNext].filter(Boolean);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  /* ---------- SWIPE SUPPORT (touch) ---------- */
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const threshold = 50;
    const diff = touchEndX - touchStartX;

    if (Math.abs(diff) < threshold) return;

    if (diff < 0) {
      // Swiped left → next
      nextImage();
    } else {
      // Swiped right → previous
      prevImage();
    }
  }

  /* ---------- INIT ---------- */
  function init() {
    applyFilter('all');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();