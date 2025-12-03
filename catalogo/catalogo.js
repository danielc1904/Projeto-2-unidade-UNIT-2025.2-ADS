/* ========== Helpers ========== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ========== Elements ========== */
const productsGrid = $('#productsGrid');
const productCards = $$('.card', productsGrid);
const resultsCount = $('#resultsCount');
const clearFiltersBtn = $('#clearFilters');
const searchInput = $('#searchInput');
const sortSelect = $('#sortSelect');
const backToTop = $('#backToTop');
const header = document.querySelector('.site-header');
const favKey = 'relicario_favs';

/* ========== State ========== */
let favorites = JSON.parse(localStorage.getItem(favKey) || '{}');

/* ========== Utility: update results count ========== */
function updateCount() {
  const visibleCount = $$('.card', productsGrid).filter(c => c.style.display !== 'none').length;
  resultsCount.textContent = visibleCount;
}

/* ========== Filtering logic ========== */
function getActiveFilters() {
  const categories = $$('input[name="category"]:checked').map(i => i.value);
  const conditions = $$('input[name="condition"]:checked').map(i => i.value);
  const priceRadio = $('input[name="price"]:checked');
  const priceRange = priceRadio ? priceRadio.value : null;
  const q = (searchInput.value || '').trim().toLowerCase();
  return { categories, conditions, priceRange, q };
}

function inPriceRange(price, range) {
  const p = Number(price);
  if (!range) return true;
  if (range === '0-50') return p <= 50;
  if (range === '50-200') return p >= 50 && p <= 200;
  if (range === '200-1000') return p >= 200 && p <= 1000;
  if (range === '1000+') return p >= 1000;
  return true;
}

function applyFilters() {
  const { categories, conditions, priceRange, q } = getActiveFilters();

  productCards.forEach(card => {
    const title = card.dataset.title.toLowerCase();
    const category = card.dataset.category;
    const condition = card.dataset.condition;
    const price = card.dataset.price;

    // search text match
    const matchesSearch = !q || title.includes(q) || category.toLowerCase().includes(q) || card.dataset.vendor.toLowerCase().includes(q) || card.dataset.city.toLowerCase().includes(q);

    // category filter
    const matchesCategory = categories.length === 0 || categories.includes(category);

    // condition filter
    const matchesCondition = conditions.length === 0 || conditions.includes(condition);

    // price filter
    const matchesPrice = inPriceRange(price, priceRange);

    const show = matchesSearch && matchesCategory && matchesCondition && matchesPrice;
    card.style.display = show ? '' : 'none';
  });

  updateCount();
}

/* ========== Sorting ========== */
function sortProducts() {
  const mode = sortSelect.value;
  const cards = $$('.card', productsGrid).slice(); // copy
  const grid = productsGrid;

  // set order using numeric price
  cards.sort((a, b) => {
    const pa = Number(a.dataset.price);
    const pb = Number(b.dataset.price);
    if (mode === 'price-asc') return pa - pb;
    if (mode === 'price-desc') return pb - pa;
    // default: relevance -> preserve DOM order (we'll use data-id)
    return Number(a.dataset.id) - Number(b.dataset.id);
  });

  // re-append in order
  cards.forEach(c => grid.appendChild(c));
}

/* ========== Clear filters ========== */
function clearFilters() {
  $$('input[name="category"]').forEach(i => i.checked = false);
  $$('input[name="condition"]').forEach(i => i.checked = false);
  $$('input[name="price"]').forEach(i => i.checked = false);
  searchInput.value = '';
  sortSelect.value = 'relevance';
  sortProducts();
  applyFilters();
}

/* ========== Favorites (persist) ========== */
function updateFavUI() {
  $$('.fav-btn', productsGrid).forEach(btn => {
    const card = btn.closest('.card');
    const id = card.dataset.id;
    if (favorites[id]) btn.classList.add('faved'), btn.textContent = '♥';
    else btn.classList.remove('faved'), btn.textContent = '♡';
  });
}

function toggleFav(id) {
  if (favorites[id]) delete favorites[id];
  else favorites[id] = true;
  localStorage.setItem(favKey, JSON.stringify(favorites));
  updateFavUI();
}

/* ========== Event listeners ========== */
// filters inputs
$$('input[name="category"]').forEach(i => i.addEventListener('change', applyFilters));
$$('input[name="condition"]').forEach(i => i.addEventListener('change', applyFilters));
$$('input[name="price"]').forEach(i => i.addEventListener('change', applyFilters));
searchInput.addEventListener('input', () => { applyFilters(); });

// sort
sortSelect.addEventListener('change', () => { sortProducts(); applyFilters(); });

// clear filters
clearFiltersBtn.addEventListener('click', () => { clearFilters(); });

// favorites
$$('.fav-btn', productsGrid).forEach(btn => {
  btn.addEventListener('click', (ev) => {
    ev.stopPropagation();
    const id = btn.closest('.card').dataset.id;
    toggleFav(id);
  });
});

// card details demo (open modal or alert for now)
$$('.btn-details', productsGrid).forEach(b => {
  b.addEventListener('click', (ev) => {
    ev.stopPropagation();
    const card = b.closest('.card');
    const title = card.dataset.title;
    const price = card.dataset.price;
    alert(`${title}\nPreço: R$ ${price}\nDetalhes do produto (demo).`);
  });
});

// back to top
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) backToTop.style.display = 'block';
  else backToTop.style.display = 'none';

  // header blur
  if (window.scrollY > 80) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});
backToTop.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));

/* ========== Initial setup ========== */
document.addEventListener('DOMContentLoaded', () => {
  // restore favs
  updateFavUI();

  // initial sort + apply
  sortProducts();
  applyFilters();

  // update count in case some items hidden by default
  updateCount();
});

/* ========== Fade-in intersection observer ========== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('visible');
      observer.unobserve(en.target);
    }
  });
}, {threshold: 0.12});

$$('.fade-in').forEach(el => observer.observe(el));
