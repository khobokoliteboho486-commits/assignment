/* =========================================================
   KINGDOM IN THE SKY — destinations.js
   Destination search, category filtering, details modal.
   Only runs on destinations.html.
   ========================================================= */

(function () {
  'use strict';

  const grid = document.getElementById('destinationsGrid');
  if (!grid) return;

  const searchInput = document.getElementById('destinationSearch');
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn[data-category]'));
  const resetBtn = document.getElementById('resetFilters');
  const emptyResetBtn = document.getElementById('emptyResetBtn');
  const emptyState = document.getElementById('emptyState');
  const resultsCount = document.getElementById('resultsCount');
  const items = Array.from(grid.querySelectorAll('.destination-item'));

  const state = {
    category: 'all',
    query: ''
  };

  /* ---------- DESTINATION DATA FOR MODALS ---------- */
  const destinationsData = {
    maletsunyane: {
      name: 'Maletsunyane Falls',
      badge: 'Nature',
      image: 'assets/images/maletsunyane.jpg',
      alt: 'Maletsunyane Falls cascading into a gorge',
      description: 'Maletsunyane Falls is one of the highest single-drop waterfalls in Africa, plunging approximately 192 metres into a dramatic basalt gorge near Semonkong. The falls are the centrepiece of a popular adventure area, offering hiking, pony trekking, and one of the world\'s longest commercially operated abseils.',
      location: 'Near Semonkong, Maseru District',
      bestFor: 'Hiking, abseiling, photography, pony trekking',
      access: 'Road access via Semonkong; 4x4 recommended for some routes',
      highlights: '192-metre drop, gorge views, guided abseils'
    },
    katse: {
      name: 'Katse Dam',
      badge: 'Adventure',
      image: 'assets/images/katse.jpg',
      alt: 'Katse Dam reservoir surrounded by mountains',
      description: 'Katse Dam is the highest dam in Africa at 185 metres, forming the centrepiece of the Lesotho Highlands Water Project. Guided tours of the dam wall are available, and the surrounding highlands offer spectacular driving, hiking, and birdwatching. The nearby Katse Botanical Garden showcases the region\'s alpine flora.',
      location: 'Thaba-Tseka District, central highlands',
      bestFor: 'Scenic drives, engineering tours, photography',
      access: 'Paved road access from Maseru (approx. 3-4 hours)',
      highlights: 'Africa\'s tallest dam, reservoir views, botanical garden'
    },
    sani: {
      name: 'Sani Pass',
      badge: 'Adventure',
      image: 'assets/images/sani-pass.jpg',
      alt: 'Sani Pass winding mountain road',
      description: 'Sani Pass is a legendary mountain pass climbing over 1,300 metres through the Drakensberg escarpment, connecting KwaZulu-Natal in South Africa with the Lesotho highlands. The pass is famous for its steep switchbacks, dramatic views, and the highest pub in Africa at the summit. A 4x4 vehicle and valid passports are essential.',
      location: 'Eastern Lesotho / KwaZulu-Natal border',
      bestFor: '4x4 touring, dramatic scenery, photography',
      access: '4x4 required; passports needed for border crossing',
      highlights: 'Highest pub in Africa, switchback road, mountain vistas'
    },
    sehlabathebe: {
      name: 'Sehlabathebe National Park',
      badge: 'Nature',
      image: 'assets/images/sehlabathebe.jpg',
      alt: 'Sehlabathebe National Park wilderness',
      description: 'Sehlabathebe National Park is Lesotho\'s oldest protected area and part of the UNESCO-listed Maloti-Drakensberg Park. It protects rare Afro-Alpine species, dramatic sandstone formations, and ancient San rock art. The park is remote and accessible mainly on foot or by 4x4, rewarding visitors with pristine wilderness.',
      location: 'Qacha\'s Nek District, south-east Lesotho',
      bestFor: 'Hiking, wildlife, rock art, wilderness camping',
      access: 'Remote; 4x4 recommended; guided hikes available',
      highlights: 'UNESCO World Heritage, rock art, bearded vulture habitat'
    },
    thababosiu: {
      name: 'Thaba Bosiu',
      badge: 'Heritage',
      image: 'assets/images/thaba-bosiu.jpg',
      alt: 'Thaba Bosiu mountain plateau at dusk',
      description: 'Thaba Bosiu is the sacred mountain fortress where King Moshoeshoe I united the Basotho nation in the early 19th century. The plateau is a national monument with ruins, royal graves, and guided cultural tours. It is one of Lesotho\'s most historically significant sites.',
      location: 'About 24 km east of Maseru',
      bestFor: 'Cultural tourism, history, guided tours',
      access: 'Paved road from Maseru; guided tours at the visitor centre',
      highlights: 'Royal graves, historic ruins, Basotho heritage'
    },
    afriski: {
      name: 'Afriski Mountain Resort',
      badge: 'Adventure',
      image: 'assets/images/afriski.jpg',
      alt: 'Afriski Mountain Resort ski slopes',
      description: 'Afriski is one of only two ski resorts in Southern Africa, located at 3,222 metres in the Maluti Mountains. During winter (typically June to August), visitors can ski, snowboard, and enjoy snow activities. In summer, the resort offers hiking, mountain biking, and other outdoor adventures.',
      location: 'Near Butha-Buthe, northern Lesotho',
      bestFor: 'Skiing, snowboarding, mountain biking',
      access: 'Paved road access via Butha-Buthe; check seasonal conditions',
      highlights: 'Ski slopes, snow activities, high-altitude trails'
    },
    morija: {
      name: 'Morija',
      badge: 'Culture',
      image: 'assets/images/morija.jpg',
      alt: 'Historic Morija mission buildings',
      description: 'Morija is Lesotho\'s historic mission town, founded in 1833 by French Protestant missionaries. It is home to the Morija Museum & Archives, which preserves the country\'s literary and cultural heritage, as well as the historic Morija Church. It is a peaceful and rewarding stop for travellers interested in Basotho history.',
      location: 'About 40 km south of Maseru',
      bestFor: 'History, culture, museum visits',
      access: 'Paved road from Maseru',
      highlights: 'Oldest mission in Lesotho, museum, historic church'
    },
    tsehlanyane: {
      name: 'Ts\'ehlanyane National Park',
      badge: 'Nature',
      image: 'assets/images/tsehlanyane.jpg',
      alt: 'Ts\'ehlanyane National Park forest',
      description: 'Ts\'ehlanyane National Park is Lesotho\'s largest national park, protecting rare indigenous woodland and crystal-clear streams in the Maluti foothills. Hiking trails range from easy walks to full-day routes, and the park is a haven for birdwatchers and nature lovers.',
      location: 'Butha-Buthe District, northern Lesotho',
      bestFor: 'Hiking, birdwatching, nature walks',
      access: 'Paved road access; trails marked within the park',
      highlights: 'Indigenous woodland, streams, hiking trails'
    },
    maseru: {
      name: 'Maseru',
      badge: 'Culture',
      image: 'assets/images/maseru.jpg',
      alt: 'Maseru city street scene',
      description: 'Maseru is Lesotho\'s capital and largest city, set on the Caledon River. It offers a mix of markets, craft shops, museums, and restaurants, and serves as the main gateway to the rest of the country. The city is a good base for exploring nearby Thaba Bosiu and Morija.',
      location: 'North-west Lesotho, on the South African border',
      bestFor: 'Markets, museums, urban exploring',
      access: 'International airport nearby; border crossing at Maseru Bridge',
      highlights: 'Markets, craft shops, cultural museums'
    }
  };

  /* ---------- FILTERING ---------- */
  function matchesCategory(item, category) {
    if (category === 'all') return true;
    const itemCategories = (item.dataset.category || '').toLowerCase().split(/\s+/);
    return itemCategories.includes(category);
  }

  function matchesQuery(item, query) {
    if (!query) return true;
    const name = (item.dataset.name || '').toLowerCase();
    const text = (item.textContent || '').toLowerCase();
    return name.includes(query) || text.includes(query);
  }

  function applyFilters() {
    const query = state.query.trim().toLowerCase();
    let visibleCount = 0;

    items.forEach((item) => {
      const show = matchesCategory(item, state.category) && matchesQuery(item, query);

      if (show) {
        item.style.display = '';
        item.classList.remove('hidden');
        visibleCount++;
      } else {
        item.style.display = 'none';
        item.classList.add('hidden');
      }
    });

    // Empty state
    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.hidden = false;
      } else {
        emptyState.hidden = true;
      }
    }

    // Results count
    if (resultsCount) {
      if (visibleCount === 0) {
        resultsCount.textContent = 'No destinations match your filters.';
      } else if (visibleCount === items.length) {
        resultsCount.textContent = 'Showing all ' + items.length + ' destinations.';
      } else {
        resultsCount.textContent = 'Showing ' + visibleCount + ' of ' + items.length + ' destinations.';
      }
    }
  }

  function setCategory(category) {
    state.category = category;
    filterButtons.forEach((btn) => {
      const isActive = btn.dataset.category === category;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function resetAll() {
    state.category = 'all';
    state.query = '';
    if (searchInput) searchInput.value = '';
    setCategory('all');
    applyFilters();
    if (searchInput) searchInput.focus();
  }

  /* ---------- EVENT LISTENERS ---------- */
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.query = e.target.value;
      applyFilters();
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      setCategory(btn.dataset.category);
      applyFilters();
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', resetAll);
  }

  if (emptyResetBtn) {
    emptyResetBtn.addEventListener('click', resetAll);
  }

  /* ---------- MODAL ---------- */
  const modal = document.getElementById('destinationModal');

  if (modal) {
    const modalTitle = document.getElementById('destinationModalTitle');
    const modalImage = document.getElementById('modalImage');
    const modalBadge = document.getElementById('modalBadge');
    const modalDescription = document.getElementById('modalDescription');
    const modalLocation = document.getElementById('modalLocation');
    const modalBestFor = document.getElementById('modalBestFor');
    const modalAccess = document.getElementById('modalAccess');
    const modalHighlights = document.getElementById('modalHighlights');

    modal.addEventListener('show.bs.modal', (event) => {
      // The button that triggered the modal
      const trigger = event.relatedTarget;
      if (!trigger) return;

      const key = trigger.getAttribute('data-destination');
      if (!key) return;

      const data = destinationsData[key];
      if (!data) return;

      if (modalTitle) modalTitle.textContent = data.name;
      if (modalImage) {
        modalImage.src = data.image;
        modalImage.alt = data.alt || data.name;
      }
      if (modalBadge) modalBadge.textContent = data.badge;
      if (modalDescription) modalDescription.textContent = data.description;
      if (modalLocation) modalLocation.textContent = data.location;
      if (modalBestFor) modalBestFor.textContent = data.bestFor;
      if (modalAccess) modalAccess.textContent = data.access;
      if (modalHighlights) modalHighlights.textContent = data.highlights;
    });

    // When modal is hidden, clear image src to prevent stale state
    modal.addEventListener('hidden.bs.modal', () => {
      if (modalImage) {
        modalImage.src = '';
        modalImage.alt = '';
      }
    });
  }

  /* ---------- INIT ---------- */
  function init() {
    setCategory('all');
    applyFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();