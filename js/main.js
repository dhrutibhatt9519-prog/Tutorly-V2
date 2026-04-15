/**
 * GLOBAL APP STATE
 * --------------------------------------------------
 * Centralized data store for the entire application.
 * Controls tutors data, filters, favourites, and map state.
 */
const state = {
  tutors: [],
  filteredTutors: [],
  favourites: getStoredFavourites(),
  filters: {
    search: "",
    price: 150,
    subjects: new Set(),
    locations: new Set(),
    availability: new Set()
  },
  map: null,
  markersLayer: null
};

/**
 * Page Initialization
 * --------------------------------------------------
 * Runs when DOM is ready.
 * Initializes UI, loads data, and triggers rendering.
 */
document.addEventListener("DOMContentLoaded", async () => {
  setupNavigation();
  setupRevealAnimations();
  setupStaticForms();

  try {
    state.tutors = await loadTutors();
  } catch (error) {
    console.error("Unable to load tutors:", error);
  }

  setupDirectory();
  renderTutorDetail();
  renderFavourites();
});

/**
 * DATA LOADING (API FETCH)
 * --------------------------------------------------
 * Fetches tutor data from JSON.
 * Handles errors.
 */
async function loadTutors() {
  const response = await fetch("data/tutors.json");
  if (!response.ok) {
    throw new Error("Failed to load tutor data");
  }
  return response.json();
}

/**
 * NAVIGATION SETUP
 * --------------------------------------------------
 * Controls mobile menu toggle and accessibility state.
 */
function setupNavigation() {
  const navToggle = document.getElementById("nav-toggle");
  const siteNav = document.getElementById("site-nav");
  if (!navToggle || !siteNav) return;

  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/**
 * SCROLL ANIMATIONS
 * --------------------------------------------------
 * when they enter the viewport (performance-friendly).
 */
function setupRevealAnimations() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach((item) => observer.observe(item));
}

/**
 * TUTOR DIRECTORY SETUP
 * --------------------------------------------------
 * Prepares tutor listing page:
 * - Builds filters dynamically
 * - Syncs search from URL
 * - Triggers initial filtering
 */
function setupDirectory() {
  const tutorList = document.getElementById("tutor-list");
  if (!tutorList || !state.tutors.length) return;

  populateFilterOptions();
  bindFilterEvents();

  const query = new URLSearchParams(window.location.search).get("q");
  if (query) {
    const searchInput = document.getElementById("directory-search");
    const heroSearch = document.getElementById("hero-search");
    state.filters.search = query.trim().toLowerCase();
    if (searchInput) searchInput.value = query;
    if (heroSearch) heroSearch.value = query;
  }

  applyFilters();
}

/**
 * FILTER UI
 * --------------------------------------------------
 * Extracts unique values from tutor data
 * and builds filter controls dynamically.
 */
function populateFilterOptions() {
  const subjectValues = uniqueValues(state.tutors.flatMap((tutor) => tutor.subject));
  const locationValues = uniqueValues(state.tutors.map((tutor) => tutor.location));
  const availabilityValues = uniqueValues(state.tutors.flatMap((tutor) => tutor.availability));

  populateCheckboxGroup("subject-filters", subjectValues, "subject");
  populateCheckboxGroup("location-filters", locationValues, "location");
  populateChipGroup("availability-filters", availabilityValues);
  populateSelect("mobile-subject", subjectValues, "All subjects");
  populateSelect("mobile-location", locationValues, "All locations");
  populateSelect("mobile-availability", availabilityValues, "Any day");
}

function populateCheckboxGroup(containerId, values, type) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = values.map((value) => `
    <label>
      <input type="checkbox" data-filter-type="${type}" value="${escapeHtml(value)}">
      <span>${escapeHtml(value)}</span>
    </label>
  `).join("");
}

function populateChipGroup(containerId, values) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = values.map((value) => `
    <button type="button" class="chip-toggle" data-availability="${escapeHtml(value)}">${escapeHtml(value)}</button>
  `).join("");
}

function populateSelect(selectId, values, placeholder) {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.innerHTML = `<option value="">${placeholder}</option>` + values.map((value) => `
    <option value="${escapeHtml(value)}">${escapeHtml(value)}</option>
  `).join("");
}

function bindFilterEvents() {
  const searchInput = document.getElementById("directory-search");
  const heroSearch = document.getElementById("hero-search");
  const priceRange = document.getElementById("price-range");
  const resetButton = document.getElementById("reset-filters");
  const mobileSubject = document.getElementById("mobile-subject");
  const mobileLocation = document.getElementById("mobile-location");
  const mobileAvailability = document.getElementById("mobile-availability");

  searchInput?.addEventListener("input", (event) => {
    const value = event.target.value.trim();
    state.filters.search = value.toLowerCase();
    if (heroSearch && heroSearch.value !== value) heroSearch.value = value;
    applyFilters();
  });

  heroSearch?.addEventListener("input", (event) => {
    const value = event.target.value.trim();
    state.filters.search = value.toLowerCase();
    if (searchInput && searchInput.value !== value) searchInput.value = value;
    applyFilters();
  });

  priceRange?.addEventListener("input", (event) => {
    state.filters.price = Number(event.target.value);
    updatePriceOutput();
    applyFilters();
  });

  document.querySelectorAll('input[data-filter-type="subject"]').forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      toggleSetValue(state.filters.subjects, checkbox.value, checkbox.checked);
      if (mobileSubject && checkbox.checked) mobileSubject.value = checkbox.value;
      if (mobileSubject && !state.filters.subjects.size) mobileSubject.value = "";
      applyFilters();
    });
  });

  document.querySelectorAll('input[data-filter-type="location"]').forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      toggleSetValue(state.filters.locations, checkbox.value, checkbox.checked);
      if (mobileLocation && checkbox.checked) mobileLocation.value = checkbox.value;
      if (mobileLocation && !state.filters.locations.size) mobileLocation.value = "";
      applyFilters();
    });
  });

  document.querySelectorAll("[data-availability]").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.availability;
      if (state.filters.availability.has(value)) {
        state.filters.availability.delete(value);
        button.classList.remove("is-active");
      } else {
        state.filters.availability.add(value);
        button.classList.add("is-active");
      }
      if (mobileAvailability) mobileAvailability.value = state.filters.availability.size === 1 ? [...state.filters.availability][0] : "";
      applyFilters();
    });
  });

  mobileSubject?.addEventListener("change", (event) => {
    const value = event.target.value;
    state.filters.subjects = value ? new Set([value]) : new Set();
    syncCheckboxGroup('input[data-filter-type="subject"]', state.filters.subjects);
    applyFilters();
  });

  mobileLocation?.addEventListener("change", (event) => {
    const value = event.target.value;
    state.filters.locations = value ? new Set([value]) : new Set();
    syncCheckboxGroup('input[data-filter-type="location"]', state.filters.locations);
    applyFilters();
  });

  mobileAvailability?.addEventListener("change", (event) => {
    const value = event.target.value;
    state.filters.availability = value ? new Set([value]) : new Set();
    syncAvailabilityChips();
    applyFilters();
  });

  resetButton?.addEventListener("click", resetFilters);

  updatePriceOutput();
}

/**
 * FILTER APPLICATION
 * --------------------------------------------------
 * Applies all active filters to tutor data.
 * Combines search, subject, location, availability, and price.
 * Returns only matching tutors.
 */
function applyFilters() {
  state.filteredTutors = state.tutors.filter((tutor) => {
    const searchHaystack = [
      tutor.name,
      tutor.location,
      tutor.city,
      tutor.bio,
      ...tutor.subject
    ].join(" ").toLowerCase();

    const matchesSearch = !state.filters.search || searchHaystack.includes(state.filters.search);
    const matchesSubject = !state.filters.subjects.size || tutor.subject.some((item) => state.filters.subjects.has(item));
    const matchesLocation = !state.filters.locations.size || state.filters.locations.has(tutor.location);
    const matchesAvailability = !state.filters.availability.size || tutor.availability.some((slot) => state.filters.availability.has(slot));
    const matchesPrice = tutor.price <= state.filters.price;

    return matchesSearch && matchesSubject && matchesLocation && matchesAvailability && matchesPrice;
  });

  renderTutorCards(state.filteredTutors, document.getElementById("tutor-list"));
  renderResultsCopy();
  renderEmptyState();
  renderMap(state.filteredTutors);
}

/**
 * RENDERING TUTOR CARDS
 * --------------------------------------------------
 * Converts tutor data into HTML UI components.
 * Handles card creation and event binding.
 */
function renderTutorCards(tutors, container) {
  if (!container) return;

  container.innerHTML = tutors.map((tutor) => createTutorCardMarkup(tutor)).join("");

  container.querySelectorAll("[data-save-id]").forEach((button) => {
    button.addEventListener("click", () => toggleFavourite(Number(button.dataset.saveId)));
  });
}

function createTutorCardMarkup(tutor) {
  const isSaved = state.favourites.includes(tutor.id);
  return `
    <article class="tutor-card">
      <div class="tutor-card-body">
        <div class="tutor-card-top">
          <div class="avatar-wrap">
            <img class="tutor-avatar" src="${escapeAttribute(tutor.image)}" alt="${escapeAttribute(tutor.name)}">
            <span class="verified-badge" aria-hidden="true">${iconBadge()}</span>
          </div>
          <div>
            <h3>${escapeHtml(tutor.name)}</h3>
            <div class="meta-row">
              <span class="rating-stars">${renderStars(tutor.rating)}</span>
              <span>${tutor.rating.toFixed(1)} (${tutor.reviews} reviews)</span>
            </div>
            <p class="location-row">${iconLocation()}${escapeHtml(tutor.location)}</p>
          </div>
          <button class="favourite-button ${isSaved ? "is-saved" : ""}" type="button" data-save-id="${tutor.id}" aria-label="Save ${escapeAttribute(tutor.name)}">
            ${isSaved ? "&#9829;" : "&#9825;"}
          </button>
        </div>
        <p class="tutor-bio">${escapeHtml(tutor.bio)}</p>
        <div class="tag-row">
          ${tutor.subject.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}
        </div>
        <div class="stat-strip">
          <div class="stat-item">${iconClock()}<div><span>Experience</span><strong>${tutor.experience} years</strong></div></div>
          <div class="stat-item">${iconDollar()}<div><span>Price/Hour</span><strong>$${tutor.price}</strong></div></div>
        </div>
        <div class="availability-row">
          ${tutor.availability.map((slot) => `<span class="availability-pill">${escapeHtml(slot)}</span>`).join("")}
        </div>
        <div class="card-actions">
          <a class="button button-secondary" href="tutor-details.html?id=${tutor.id}">View Profile</a>
        </div>
      </div>
    </article>
  `;
}

/**
 * FILTER RESULTS UI
 * --------------------------------------------------
 * For accessibility, shows a summary of how many tutors match current filters.
 */
function renderResultsCopy() {
  const target = document.getElementById("results-copy");
  if (!target) return;

  const count = state.filteredTutors.length;
  target.textContent = `Found ${count} tutor${count === 1 ? "" : "s"} matching your criteria`;
}

function renderEmptyState() {
  const emptyState = document.getElementById("empty-state");
  const tutorList = document.getElementById("tutor-list");
  if (!emptyState || !tutorList) return;

  const hasResults = state.filteredTutors.length > 0;
  emptyState.classList.toggle("hidden", hasResults);
  tutorList.classList.toggle("hidden", !hasResults);
}

/**
 * MAP (Leaflet Integration)
 * --------------------------------------------------
 * Displays tutor locations on map.
 * Updates markers dynamically based on filters.
 */
function renderMap(tutors) {
  const mapElement = document.getElementById("directory-map");
  if (!mapElement || typeof L === "undefined") return;

  if (!state.map) {
    state.map = L.map(mapElement, {
      scrollWheelZoom: false,
      zoomControl: true
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 19
    }).addTo(state.map);

    state.markersLayer = L.layerGroup().addTo(state.map);
  }

  state.markersLayer.clearLayers();

  if (!tutors.length) {
    state.map.setView([43.45, -80.49], 9);
    return;
  }

  const bounds = [];

  tutors.forEach((tutor) => {
    const icon = L.divIcon({
      className: "",
      html: '<div class="map-pin"></div>',
      iconSize: [26, 26],
      iconAnchor: [13, 24]
    });

    const marker = L.marker([tutor.lat, tutor.lng], { icon });
    marker
      .bindPopup(`<strong>${escapeHtml(tutor.name)}</strong><br>${escapeHtml(tutor.location)}, ${escapeHtml(tutor.city)}`)
      .bindTooltip(`${escapeHtml(tutor.location)}`, {
        permanent: true,
        direction: "top",
        className: "map-tooltip",
        offset: [0, -18]
      });

    marker.addTo(state.markersLayer);
    bounds.push([tutor.lat, tutor.lng]);
  });

  state.map.fitBounds(bounds, {
    padding: [36, 36],
    maxZoom: 10
  });
}

/**
 * TUTOR DETAIL PAGE RENDERING
 * --------------------------------------------------
 * Turns tutor profile data into detailed HTML view.
 */
function renderTutorDetail() {
  const container = document.getElementById("tutor-detail-view");
  if (!container || !state.tutors.length) return;

  const params = new URLSearchParams(window.location.search);
  const requestedId = Number(params.get("id")) || 1;
  const tutor = state.tutors.find((item) => item.id === requestedId);

  if (!tutor) {
    container.innerHTML = '<div class="shell detail-empty"><h2>Tutor not found</h2><p>We couldn\'t find that tutor profile. Try returning to the tutor directory.</p></div>';
    return;
  }

  document.title = `Tutorly | ${tutor.name}`;

  container.innerHTML = `
    <section class="detail-hero">
      <div class="shell detail-hero-shell">
        <div class="detail-avatar-wrap">
          <img class="detail-avatar" src="${escapeAttribute(tutor.image)}" alt="${escapeAttribute(tutor.name)}">
          <span class="detail-avatar-badge" aria-hidden="true">${iconBadge()}</span>
        </div>
        <div class="detail-hero-copy">
          <h1>${escapeHtml(tutor.name)}</h1>
          <div class="detail-meta">
            <span class="rating-stars">${renderStars(tutor.rating)}</span>
            <span>${tutor.rating.toFixed(1)} (${tutor.reviews} reviews)</span>
            <span class="location-row">${iconLocation()}${escapeHtml(tutor.location)}</span>
            <span class="location-row">${iconClock()}${tutor.experience} years experience</span>
            <span class="location-row">${iconDollar()}$${tutor.price}/hour</span>
          </div>
          <div class="subject-row detail-subjects">
            ${tutor.subject.map((item) => `<span class="subject-pill">${escapeHtml(item)}</span>`).join("")}
          </div>
        </div>
      </div>
    </section>
    <section class="detail-shell">
      <div class="detail-main">
        <article class="detail-card"><h3 class="detail-card-title">${iconBook()}<span>About Me</span></h3><p>${escapeHtml(tutor.about)}</p></article>
        <article class="detail-card"><h3 class="detail-card-title">${iconAward()}<span>Education</span></h3><ul>${tutor.education.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article>
        <article class="detail-card"><h3 class="detail-card-title">${iconStar()}<span>Achievements</span></h3><ul>${tutor.achievements.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article>
        <article class="detail-card"><h3 class="detail-card-title">${iconSpark()}<span>Specialties</span></h3><div class="subject-row">${tutor.specialties.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}</div></article>
        <article class="detail-card"><h3 class="detail-card-title">${iconMessage()}<span>Student Reviews</span></h3><div class="reviews-list">${tutor.reviewsList.map((review) => `
          <div class="review-item">
            <div class="review-head">
              <div><p class="review-name">${escapeHtml(review.name)}</p><div class="rating-stars">${renderStars(review.rating)}</div></div>
              <span class="review-date">${escapeHtml(review.date)}</span>
            </div>
            <p>${escapeHtml(review.text)}</p>
          </div>`).join("")}</div></article>
      </div>
      <aside class="contact-card">
        <h2>Contact ${escapeHtml(tutor.name.split(" ")[0])}</h2>
        <p>Fill out the form below to get started.</p>
        <form id="contact-form">
          <div class="field-group"><label for="contact-name">Your Name</label><input id="contact-name" name="name" type="text" placeholder="John Doe" required></div>
          <div class="field-group"><label for="contact-email">Email Address</label><input id="contact-email" name="email" type="email" placeholder="john@example.com" required></div>
          <div class="field-group"><label for="contact-phone">Phone Number</label><input id="contact-phone" name="phone" type="tel" placeholder="(555) 123-4567" required></div>
          <div class="field-group"><label for="contact-subject">Subject of Interest</label><select id="contact-subject" name="subject" required><option value="">Select a subject</option>${tutor.subject.map((item) => `<option value="${escapeAttribute(item)}">${escapeHtml(item)}</option>`).join("")}</select></div>
          <div class="field-group"><label for="contact-date">Preferred Date</label><input id="contact-date" name="date" type="date" required></div>
          <div class="field-group"><label for="contact-message">Message</label><textarea id="contact-message" name="message" rows="5" placeholder="Tell us about your learning goals..." required></textarea></div>
          <button class="button button-primary" type="submit">Send Message</button>
          <p id="contact-form-message" class="form-message" aria-live="polite"></p>
        </form>
        <div class="contact-note"><p>${iconCalendar()}<span>Available: ${escapeHtml(tutor.availability.join(", "))}</span></p><p>${iconClock()}<span>Response time: ${escapeHtml(tutor.responseTime)}</span></p></div>
      </aside>
    </section>
  `;

  bindFormMessage("contact-form", "contact-form-message", `Message prepared for ${tutor.name}. We'll be in touch soon.`);
}

/**
 * FAVOURITES PAGE RENDERING
 * --------------------------------------------------
 * Filters tutors to only those in favourites list(LocalStorage) and renders them.
 */
function renderFavourites() {
  const container = document.getElementById("fav-list");
  if (!container || !state.tutors.length) return;

  const favouriteTutors = state.tutors.filter((tutor) => state.favourites.includes(tutor.id));
  if (!favouriteTutors.length) {
    container.innerHTML = '<div class="favourite-empty"><h2>No favourite tutors yet.</h2><p>Save tutors from the directory and they\'ll appear here for quick access.</p><a class="button button-primary" href="tutors.html">Browse Tutors</a></div>';
    return;
  }

  renderTutorCards(favouriteTutors, container);
}

/**
 * FORM MESSAGES
 * --------------------------------------------------
 * For static forms (contact, application), shows a success message on submit.
 */
function setupStaticForms() {
  bindFormMessage("become-tutor-form", "apply-form-message", "Application submitted. We'll review your profile and email you soon.");
}

function bindFormMessage(formId, messageId, successMessage) {
  const form = document.getElementById(formId);
  const message = document.getElementById(messageId);
  if (!form || !message) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    message.textContent = successMessage;
    form.reset();
  });
}

/**
 * FAVOURITES BUTTONS
 * --------------------------------------------------
 * Allows users to save/remove tutors.
 * Data persists using localStorage.
 */
function toggleFavourite(id) {
  const index = state.favourites.indexOf(id);
  if (index >= 0) {
    state.favourites.splice(index, 1);
  } else {
    state.favourites.push(id);
  }

  localStorage.setItem("tutorly-favourites", JSON.stringify(state.favourites));

  const tutorList = document.getElementById("tutor-list");
  if (tutorList) renderTutorCards(state.filteredTutors, tutorList);
  if (document.getElementById("fav-list")) renderFavourites();
}

function getStoredFavourites() {
  try {
    const raw = localStorage.getItem("tutorly-favourites");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * RESET FILTERS
 * --------------------------------------------------
 * Resets all filters to default state and re-applies filtering.
 */
function resetFilters() {
  state.filters.search = "";
  state.filters.price = 150;
  state.filters.subjects = new Set();
  state.filters.locations = new Set();
  state.filters.availability = new Set();

  const searchInput = document.getElementById("directory-search");
  const heroSearch = document.getElementById("hero-search");
  const priceRange = document.getElementById("price-range");
  const mobileSubject = document.getElementById("mobile-subject");
  const mobileLocation = document.getElementById("mobile-location");
  const mobileAvailability = document.getElementById("mobile-availability");

  if (searchInput) searchInput.value = "";
  if (heroSearch) heroSearch.value = "";
  if (priceRange) priceRange.value = "150";
  if (mobileSubject) mobileSubject.value = "";
  if (mobileLocation) mobileLocation.value = "";
  if (mobileAvailability) mobileAvailability.value = "";

  syncCheckboxGroup('input[data-filter-type="subject"]', state.filters.subjects);
  syncCheckboxGroup('input[data-filter-type="location"]', state.filters.locations);
  syncAvailabilityChips();
  updatePriceOutput();
  applyFilters();
}

function syncCheckboxGroup(selector, values) {
  document.querySelectorAll(selector).forEach((checkbox) => {
    checkbox.checked = values.has(checkbox.value);
  });
}

function syncAvailabilityChips() {
  document.querySelectorAll("[data-availability]").forEach((button) => {
    button.classList.toggle("is-active", state.filters.availability.has(button.dataset.availability));
  });
}

function updatePriceOutput() {
  const output = document.getElementById("price-output");
  if (!output) return;
  output.textContent = `$${state.filters.price}/hr max`;
}

function toggleSetValue(set, value, shouldAdd) {
  if (shouldAdd) {
    set.add(value);
  } else {
    set.delete(value);
  }
}
/**
 * REUSABLE VARIABLES AND FUNCTIONS
 * --------------------------------------------------
 * Reusable helpers for data manipulation and UI.
 */
function uniqueValues(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function renderStars(rating) {
  const rounded = Math.round(rating);
  return "&#9733;".repeat(rounded) + "&#9734;".repeat(5 - rounded);
}

function iconWrap(svg) {
  return `<span class="meta-icon" aria-hidden="true">${svg}</span>`;
}

function iconLocation() {
  return iconWrap('<svg class="icon-svg" viewBox="0 0 24 24"><path d="M12 21s-6-4.6-6-10a6 6 0 1 1 12 0c0 5.4-6 10-6 10z"></path><circle cx="12" cy="11" r="2.5"></circle></svg>');
}

function iconClock() {
  return iconWrap('<svg class="icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"></circle><path d="M12 8v4l2.5 2"></path></svg>');
}

function iconDollar() {
  return iconWrap('<svg class="icon-svg" viewBox="0 0 24 24"><path d="M12 3v14"></path><path d="M15.5 7.5c0-1.4-1.6-2.5-3.5-2.5S8.5 6.1 8.5 7.5 10.1 10 12 10s3.5 1.1 3.5 2.5S13.9 15 12 15s-3.5-1.1-3.5-2.5"></path></svg>');
}

function iconBadge() {
  return '<svg class="icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="4.5"></circle><path d="M9.5 13l-1 7 3.5-2 3.5 2-1-7"></path></svg>';
}

function iconBook() {
  return iconWrap('<svg class="icon-svg" viewBox="0 0 24 24"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v15.5a.5.5 0 0 1-.5.5h-13A2.5 2.5 0 0 1 4 17.5v-11z"></path><path d="M8 4v16"></path></svg>');
}

function iconAward() {
  return iconWrap('<svg class="icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"></circle><path d="M9.5 12.5 8 20l4-2 4 2-1.5-7.5"></path></svg>');
}

function iconStar() {
  return iconWrap('<svg class="icon-svg" viewBox="0 0 24 24"><path d="M12 4l2.4 4.8 5.3.8-3.8 3.7.9 5.2L12 16l-4.8 2.5.9-5.2L4.3 9.6l5.3-.8L12 4z"></path></svg>');
}

function iconSpark() {
  return iconWrap('<svg class="icon-svg" viewBox="0 0 24 24"><path d="M12 4l1.8 4.2L18 10l-4.2 1.8L12 16l-1.8-4.2L6 10l4.2-1.8L12 4z"></path><path d="M18 4l.8 2 .2.2 2 .8-2 .8-.2.2-.8 2-.8-2-.2-.2-2-.8 2-.8.2-.2.8-2z"></path></svg>');
}

function iconMessage() {
  return iconWrap('<svg class="icon-svg" viewBox="0 0 24 24"><path d="M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3v-3H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"></path></svg>');
}

function iconCalendar() {
  return iconWrap('<svg class="icon-svg" viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="14" rx="2"></rect><path d="M8 4v4M16 4v4M4 11h16"></path></svg>');
}

/**
 * SECURE HTML
 * --------------------------------------------------
 * Prevents XSS by escaping unsafe characters
 * before injecting into HTML.
 */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}





