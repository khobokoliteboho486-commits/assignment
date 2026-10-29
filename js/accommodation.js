/* =========================================================
   KINGDOM IN THE SKY — accommodation.js
   Search, filtering, sorting, and modal details for
   accommodation.html only.
   ========================================================= */

(function () {
  'use strict';

  const grid = document.getElementById('accommodationGrid');
  if (!grid) return;

  const items = Array.from(grid.querySelectorAll('.accommodation-item'));
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn[data-accom-filter]'));
  const sortSelect = document.getElementById('accomSort');
  const emptyState = document.getElementById('accomEmpty');
  const emptyResetBtn = document.getElementById('accomEmptyResetBtn');
  const resultsCount = document.getElementById('accomResultsCount');

  const categoryLinks = Array.from(document.querySelectorAll('[data-cat-link]'));

  // Search form (top section)
  const searchForm = document.getElementById('accommodationSearchForm');
  const locationInput = document.getElementById('accLocation');
  const typeSelect = document.getElementById('accType');
  const guestsInput = document.getElementById('accGuests');
  const checkinInput = document.getElementById('accCheckin');
  const checkoutInput = document.getElementById('accCheckout');
  const resetBtn = document.getElementById('accResetBtn');
  const searchFeedback = document.getElementById('accSearchFeedback');

  // Modal
  const modal = document.getElementById('accommodationModal');
  const modalTitle = document.getElementById('accommodationModalTitle');
  const modalImage = document.getElementById('accomModalImage');
  const modalBadge = document.getElementById('accomModalBadge');
  const modalLocation = document.getElementById('accomModalLocation');
  const modalDescription = document.getElementById('accomModalDescription');
  const modalType = document.getElementById('accomModalType');
  const modalLocationInfo = document.getElementById('accomModalLocationInfo');
  const modalBestFor = document.getElementById('accomModalBestFor');
  const modalAmenities = document.getElementById('accomModalAmenities');

  /* ---------- STATE ---------- */
  const state = {
    location: '',
    type: '',       // matches data-category
    sort: 'default'
  };

  /* ---------- DATA FOR MODALS ---------- */
  const accommodationsData = {
    'avani': {
      name: 'Avani Lesotho Hotel & Casino',
      badge: 'Luxury Hotel',
      image: 'assets/images/accommodation/avani-maseru.jpg',
      alt: 'Avani Lesotho Hotel & Casino, Maseru',
      description: 'A full-service hotel in the heart of Maseru, Lesotho\'s capital. Avani Lesotho is well known for its central location, dining options, and conference facilities. A reliable choice for business travellers, city stays, and visitors wanting easy access to Maseru Bridge, government offices, and nearby heritage sites such as Thaba Bosiu and Morija.',
      type: 'Luxury hotel',
      location: 'Maseru',
      bestFor: 'Business travel, city stays, conferences',
      amenities: 'Restaurants, conference facilities, pool, Wi-Fi (confirm with hotel)',
      keywords: 'maseru luxury hotel city business conference'
    },
    'semonkong': {
      name: 'Semonkong Lodge',
      badge: 'Mountain Lodge',
      image: 'assets/images/accommodation/semonkong-lodge.jpg',
      alt: 'Semonkong Lodge near Maletsunyane Falls',
      description: 'A well-established mountain lodge in Semonkong, close to Maletsunyane Falls. Popular with travellers seeking abseiling, pony trekking, hiking, and photography. Semonkong Lodge offers a rustic mountain character and access to some of Lesotho\'s most dramatic landscapes.',
      type: 'Mountain lodge',
      location: 'Semonkong',
      bestFor: 'Adventure, hiking, abseiling, photography',
      amenities: 'Restaurant, fireplace, activity bookings, guided excursions (confirm with lodge)',
      keywords: 'semonkong maletsunyane adventure lodge hiking abseil'
    },
    'maliba': {
      name: 'Maliba Mountain Lodge',
      badge: 'Mountain Lodge',
      image: 'assets/images/accommodation/maliba-lodge.jpg',
      alt: 'Maliba Mountain Lodge in Ts\'ehlanyane National Park',
      description: 'A mountain lodge set inside Ts\'ehlanyane National Park, in the northern Maluti foothills. Maliba is known for its mountain scenery, access to hiking trails, and its location within a protected area. A strong choice for travellers wanting wilderness, hiking, and quiet mountain views.',
      type: 'Mountain lodge',
      location: 'Ts\'ehlanyane National Park',
      bestFor: 'Hiking, nature, mountain scenery',
      amenities: 'Restaurant, hiking trail access, park location (confirm with lodge)',
      keywords: 'tsehlanyane maliba national park mountain lodge hiking'
    },
    'afriski': {
      name: 'Afriski Mountain Lodge',
      badge: 'Mountain Lodge',
      image: 'assets/images/accommodation/afriski-lodge.jpg',
      alt: 'Afriski Mountain Lodge ski resort accommodation',
      description: 'Ski-in accommodation at Afriski Mountain Resort, at 3,222 metres. In winter the lodge is a base for skiing and snowboarding; in summer it becomes a base for hiking and mountain biking. Book early in the ski season — winter capacity is limited.',
      type: 'Mountain lodge (ski resort)',
      location: 'Afriski, Butha-Buthe',
      bestFor: 'Skiing, snowboarding, mountain biking',
      amenities: 'Ski access, restaurant, heating, equipment hire nearby (confirm with lodge)',
      keywords: 'afriski skiing snow snowboard butha-buthe lodge winter'
    },
    'malealea': {
      name: 'Malealea Lodge',
      badge: 'Guesthouse & Lodge',
      image: 'assets/images/accommodation/malealea-lodge.jpg',
      alt: 'Malealea Lodge in the western highlands of Lesotho',
      description: 'A well-known lodge and cultural base in western Lesotho, near the village of Malealea. Popular for pony trekking, hiking, and interaction with local Basotho villages. Malealea is often recommended for travellers wanting a blend of scenery and culture.',
      type: 'Guesthouse / lodge',
      location: 'Malealea',
      bestFor: 'Pony trekking, culture, hiking',
      amenities: 'Restaurant, pony trekking, cultural activities (confirm with lodge)',
      keywords: 'malealea pony trekking culture lodge western lesotho'
    },
    'maseru-apartments': {
      name: 'Maseru Self-Catering Apartments',
      badge: 'Self-Catering',
      image: 'assets/images/accommodation/maseru-apartments.jpg',
      alt: 'Self-catering apartment accommodation in Maseru',
      description: 'A style of accommodation available in Maseru — apartment-style stays with kitchen facilities. Self-catering is a good option for families, longer visits, or travellers who prefer to cook for themselves. Multiple providers offer this format; confirm details with each property.',
      type: 'Self-catering apartment',
      location: 'Maseru',
      bestFor: 'Families, longer stays, independent travellers',
      amenities: 'Kitchen, Wi-Fi, parking (confirm with provider)',
      keywords: 'maseru self catering apartment family kitchen'
    },
    'sehlabathebe-camp': {
      name: 'Sehlabathebe Campsite',
      badge: 'Campsite',
      image: 'assets/images/accommodation/sehlabathebe-camp.jpg',
      alt: 'Campsite in Sehlabathebe National Park',
      description: 'Basic camping in Sehlabathebe National Park, Lesotho\'s oldest protected area and part of the UNESCO-listed Maloti-Drakensberg Park. Remote and adventurous — suited to self-sufficient travellers with their own equipment and a reliable 4x4 vehicle.',
      type: 'Campsite',
      location: 'Sehlabathebe National Park',
      bestFor: 'Wilderness camping, hiking, adventure travel',
      amenities: 'Basic facilities (confirm with park management)',
      keywords: 'sehlabathebe campsite camping national park unesco 4x4'
    },
    'cultural-village': {
      name: 'Basotho Cultural Village Stay',
      badge: 'Cultural Stay',
      image: 'assets/images/accommodation/cultural-village.jpg',
      alt: 'Traditional Basotho cultural village stay',
      description: 'Cultural stays give visitors a chance to learn about Basotho customs, food, music, and traditional architecture. These experiences vary by host community and are usually arranged through reputable local operators. Ask specifically what is included before booking.',
      type: 'Cultural homestay',
      location: 'Thaba Bosiu area',
      bestFor: 'Cultural immersion, traditional food, storytelling',
      amenities: 'Traditional meals, cultural activities, storytelling (varies by host)',
      keywords: 'cultural basotho village thaba bosiu homestay tradition'
    },
    'morija-guesthouse': {
      name: 'Morija Guesthouse',
      badge: 'Guesthouse',
      image: 'assets/images/accommodation/morija-guesthouse.jpg',
      alt: 'Guesthouse in the historic mission town of Morija',
      description: 'A quiet guesthouse option in Lesotho\'s historic mission town of Morija. Ideal for travellers interested in Morija\'s museum, church, and literary heritage, and for anyone wanting a peaceful base outside Maseru.',
      type: 'Guesthouse',
      location: 'Morija',
      bestFor: 'Heritage, museums, quiet stays',
      amenities: 'Breakfast, Wi-Fi, parking (confirm with guesthouse)',
      keywords: 'morija guesthouse museum heritage mission history'
    }
  };

  /* ---------- FILTER HELPERS ---------- */
  function normalize(str) {
    return (str || '').toLowerCase().trim();
  }

  function itemMatches(item) {
    const itemLoc = normalize(item.dataset.location);
    const itemCat = normalize(item.dataset.category);
    const itemName = normalize(item.dataset.name);

    // Location match — search across name, location, and textContent
    if (state.location) {
      const q = normalize(state.location);
      const haystack = itemName + ' ' + itemLoc + ' ' + normalize(item.textContent);
      if (!haystack.includes(q)) return false;
    }

    // Type match — map type value to category
    if (state.type && itemCat !== normalize(state.type)) {
      return false;
    }

    return true;
  }

  /* ---------- RENDER ---------- */
  function sortItems(list) {
    const copy = list.slice();

    switch (state.sort) {
      case 'name-asc':
        copy.sort((a, b) => normalize(a.dataset.name).localeCompare(normalize(b.dataset.name)));
        break;
      case 'name-desc':
        copy.sort((a, b) => normalize(b.dataset.name).localeCompare(normalize(a.dataset.name)));
        break;
      case 'location-asc':
        copy.sort((a, b) => normalize(a.dataset.location).localeCompare(normalize(b.dataset.location)));
        break;
      default:
        break;
    }
    return copy;
  }

  function applyFilters() {
    let visibleCount = 0;
    const visibleItems = [];

    items.forEach((item) => {
      const visible = itemMatches(item);
      if (visible) {
        visibleItems.push(item);
        item.style.display = '';
        item.classList.remove('hidden');
        visibleCount++;
      } else {
        item.style.display = 'none';
        item.classList.add('hidden');
      }
    });

    // Reorder DOM based on sort
    if (state.sort !== 'default') {
      const sorted = sortItems(visibleItems);
      sorted.forEach((el) => grid.appendChild(el));
    } else {
      // Restore original order — because appended items moved to end.
      // Sort all items by original index using dataset if needed.
      // Simple approach: sort items array back to DOM original order.
      items.forEach((el) => grid.appendChild(el));
    }

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }

    if (resultsCount) {
      if (visibleCount === 0) {
        resultsCount.textContent = 'No accommodation matches your filters.';
      } else if (visibleCount === items.length) {
        resultsCount.textContent = 'Showing all ' + items.length + ' accommodation options.';
      } else {
        resultsCount.textContent = 'Showing ' + visibleCount + ' of ' + items.length + ' accommodation options.';
      }
    }
  }

  function setActiveFilterButton(value) {
    filterButtons.forEach((btn) => {
      const isActive = btn.dataset.accomFilter === value;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  /* ---------- FILTER BUTTONS ---------- */
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const value = btn.dataset.accomFilter;
      state.type = value === 'all' ? '' : value;
      setActiveFilterButton(value);
      applyFilters();
    });
  });

  /* ---------- SORT ---------- */
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      state.sort = sortSelect.value;
      applyFilters();
    });
  }

  /* ---------- SEARCH FORM ---------- */
  function setMinDates() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const iso = yyyy + '-' + mm + '-' + dd;

    if (checkinInput) checkinInput.min = iso;

    // Checkout min depends on check-in
    if (checkinInput && checkoutInput) {
      checkinInput.addEventListener('change', () => {
        if (checkinInput.value) {
          checkoutInput.min = checkinInput.value;
          if (checkoutInput.value && checkoutInput.value < checkinInput.value) {
            checkoutInput.value = '';
          }
        }
      });
    }
  }

  function setError(input, errorEl, message) {
    if (!input || !errorEl) return;
    if (message) {
      input.classList.add('is-invalid');
      errorEl.textContent = message;
      errorEl.classList.add('show');
    } else {
      input.classList.remove('is-invalid');
      errorEl.textContent = '';
      errorEl.classList.remove('show');
    }
  }

  function clearFeedback() {
    if (!searchFeedback) return;
    searchFeedback.textContent = '';
    searchFeedback.classList.remove('show', 'success', 'error');
  }

  function showFeedback(message, type) {
    if (!searchFeedback) return;
    searchFeedback.textContent = message;
    searchFeedback.classList.add('show', type);
  }

  function validateSearch() {
    let valid = true;

    // Guests
    const guests = Number(guestsInput && guestsInput.value);
    const guestsError = document.getElementById('accGuestsError');
    if (guestsInput) {
      if (!guests || guests < 1) {
        setError(guestsInput, guestsError, 'Please enter at least 1 guest.');
        valid = false;
      } else if (guests > 20) {
        setError(guestsInput, guestsError, 'Please contact us for groups larger than 20.');
        valid = false;
      } else {
        setError(guestsInput, guestsError, '');
      }
    }

    // Dates
    const checkinError = document.getElementById('accCheckinError');
    const checkoutError = document.getElementById('accCheckoutError');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkinInput && checkinInput.value) {
      const checkin = new Date(checkinInput.value + 'T00:00:00');
      if (checkin < today) {
        setError(checkinInput, checkinError, 'Check-in cannot be in the past.');
        valid = false;
      } else {
        setError(checkinInput, checkinError, '');
      }
    }

    if (checkoutInput && checkoutInput.value) {
      const checkout = new Date(checkoutInput.value + 'T00:00:00');
      if (checkout < today) {
        setError(checkoutInput, checkoutError, 'Check-out cannot be in the past.');
        valid = false;
      } else if (checkinInput && checkinInput.value) {
        const checkin = new Date(checkinInput.value + 'T00:00:00');
        if (checkout <= checkin) {
          setError(checkoutInput, checkoutError, 'Check-out must be after check-in.');
          valid = false;
        } else {
          setError(checkoutInput, checkoutError, '');
        }
      } else {
        setError(checkoutInput, checkoutError, '');
      }
    }

    return valid;
  }

  if (searchForm) {
    setMinDates();

    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearFeedback();

      if (!validateSearch()) {
        showFeedback('Please correct the highlighted fields and try again.', 'error');
        return;
      }

      state.location = locationInput ? locationInput.value : '';
      state.type = typeSelect ? typeSelect.value : '';

      // Sync filter buttons if a type was picked
      if (typeSelect) {
        setActiveFilterButton(typeSelect.value || 'all');
      }

      applyFilters();

      // Scroll to featured section so user sees results
      const section = document.getElementById('featured-stays');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      showFeedback(
        'Search applied. Remember: this is a demonstration — no availability is checked.',
        'success'
      );
    });
  }

  /* ---------- RESET ---------- */
  function resetAll() {
    state.location = '';
    state.type = '';
    state.sort = 'default';

    if (locationInput) locationInput.value = '';
    if (typeSelect) typeSelect.value = '';
    if (guestsInput) guestsInput.value = 2;
    if (checkinInput) checkinInput.value = '';
    if (checkoutInput) checkoutInput.value = '';
    if (sortSelect) sortSelect.value = 'default';

    setActiveFilterButton('all');

    // Clear errors
    [
      ['accGuestsError', guestsInput],
      ['accCheckinError', checkinInput],
      ['accCheckoutError', checkoutInput]
    ].forEach(([id, input]) => {
      const errorEl = document.getElementById(id);
      setError(input, errorEl, '');
    });

    clearFeedback();
    applyFilters();
  }

  if (resetBtn) resetBtn.addEventListener('click', resetAll);
  if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAll);

  /* ---------- CATEGORY CARD LINKS ---------- */
  categoryLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const cat = link.dataset.catLink;
      if (!cat) return;
      state.type = cat;
      if (typeSelect) typeSelect.value = cat;
      setActiveFilterButton(cat);
      applyFilters();
    });
  });

  /* ---------- MODAL ---------- */
  if (modal) {
    modal.addEventListener('show.bs.modal', (event) => {
      const trigger = event.relatedTarget;
      if (!trigger) return;
      const key = trigger.getAttribute('data-accommodation');
      if (!key) return;
      const data = accommodationsData[key];
      if (!data) return;

      if (modalTitle) modalTitle.textContent = data.name;
      if (modalImage) {
        modalImage.src = data.image;
        modalImage.alt = data.alt || data.name;
      }
      if (modalBadge) modalBadge.textContent = data.badge;
      if (modalLocation) modalLocation.textContent = data.location;
      if (modalDescription) modalDescription.textContent = data.description;
      if (modalType) modalType.textContent = data.type;
      if (modalLocationInfo) modalLocationInfo.textContent = data.location;
      if (modalBestFor) modalBestFor.textContent = data.bestFor;
      if (modalAmenities) modalAmenities.textContent = data.amenities;
    });

    modal.addEventListener('hidden.bs.modal', () => {
      if (modalImage) {
        modalImage.src = '';
        modalImage.alt = '';
      }
    });
  }

  /* ---------- INIT ---------- */
  function init() {
    setActiveFilterButton('all');
    applyFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();