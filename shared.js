/* shared.js - loaded by every page */
const SUPA_URL  = 'https://elvbbqozynshrebfqkgf.supabase.co';
const SUPA_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsdmJicW96eW5zaHJlYmZxa2dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMDA0ODgsImV4cCI6MjA4OTg3NjQ4OH0.JKGHgZlhSmecWufvlMavTlkgmFK3e9s9Vp2AR1rJalo';
const SQ_APP_ID = 'sq0idp-ogFF-CjPfsDzVr7BBJ1CBQ';
const SQ_LOC_ID = 'LX8ETWHYGZQK9';

/* ── Supabase helpers ── */
async function sbGet(table, params = '') {
  const r = await fetch(`${SUPA_URL}/rest/v1/${table}?${params}`, {
    headers: { 'apikey': SUPA_ANON, 'Authorization': `Bearer ${SUPA_ANON}` }
  });
  if (!r.ok) throw new Error('DB error ' + r.status);
  return r.json();
}

async function sbPost(table, body) {
  /* Use minimal headers for anon inserts — no return=representation
     which requires SELECT permission the anon role may not have */
  const r = await fetch(`${SUPA_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'apikey': SUPA_ANON,
      'Authorization': `Bearer ${SUPA_ANON}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error('DB error ' + r.status);
  /* return=minimal gives 204 with no body — handle safely */
  const text = await r.text();
  if (!text || text.trim() === '') return {};
  try { return JSON.parse(text); } catch(e) { return {}; };
}

async function sbPatch(table, id, body) {
  const r = await fetch(`${SUPA_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPA_ANON,
      'Authorization': `Bearer ${SUPA_ANON}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error('DB error ' + r.status);
  return r.json();
}

async function sbDelete(table, id) {
  const r = await fetch(`${SUPA_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'DELETE',
    headers: { 'apikey': SUPA_ANON, 'Authorization': `Bearer ${SUPA_ANON}` }
  });
  if (!r.ok) throw new Error('DB error ' + r.status);
}

/* ── Cart (localStorage) ── */
function getCart() { return JSON.parse(localStorage.getItem('tps_cart') || '[]'); }
function saveCart(c) { localStorage.setItem('tps_cart', JSON.stringify(c)); updateCartBadge(); }
function addToCart(product, qty = 1) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) { existing.qty += qty; } else { cart.push({ ...product, qty }); }
  saveCart(cart);
}
function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const total = getCart().reduce((s, i) => s + i.qty, 0);
  badge.textContent = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
  /* also update any cart-count spans */
  document.querySelectorAll('.cart-count').forEach(function(el) {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}

/* ── Shared header ── */
function renderHeader(activePage) {
  const pages = [
    { href: '/', label: 'Home' },
    { href: '/products.html', label: 'Shop' },
    { href: '/learn.html', label: 'Learn' },
    { href: '/contact.html', label: 'Contact' }
  ];
  const nav = pages.map(p =>
    `<a href="${p.href}" ${activePage === p.label ? 'class="active"' : ''} ${p.external ? 'target="_blank" rel="noopener"' : ''}>${p.label}</a>`
  ).join('');

  return `
  <header id="site-header" role="banner">
    <div class="header-main">
      <a href="/" class="logo-wrap" aria-label="Trout Pro Store Home">
        <img src="/images/troutprostorelogo.png" alt="Trout Pro Store" height="54" />
      </a>
      <nav role="navigation" aria-label="Main navigation">
        ${nav}
      </nav>
      <div style="display:flex;align-items:center;gap:8px;height:100%">
        <a href="tel:8005944726" style="font-family:'Fira Mono',monospace;font-size:.72rem;color:var(--stone);text-decoration:none;white-space:nowrap;line-height:1" class="hide-on-mobile">&#128222; 800-594-4726</a>
        <a href="/cart.html" class="cart-btn" aria-label="Shopping cart" style="display:flex;align-items:center;justify-content:center;width:44px;height:44px;position:relative">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" xmlns="http://www.w3.org/2000/svg" style="stroke:var(--cream);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61H19a2 2 0 001.98-1.72L22 6H6"/></svg>
          <span class="cart-count" id="cart-badge">0</span>
        </a>
        <button class="hamburger" id="hambBtn" aria-label="Open navigation" aria-expanded="false" style="display:none;flex-direction:column;justify-content:center;align-items:center;gap:5px;width:44px;height:44px;background:none;border:none;cursor:pointer;padding:0">
          <span style="display:block;width:22px;height:2px;background:var(--cream);border-radius:2px;transition:all .3s"></span>
          <span style="display:block;width:22px;height:2px;background:var(--cream);border-radius:2px;transition:all .3s"></span>
          <span style="display:block;width:22px;height:2px;background:var(--cream);border-radius:2px;transition:all .3s"></span>
        </button>
      </div>
    </div>
    <div class="mobile-nav" id="mobileNav">
      ${nav}
      <a href="/cart.html">🛒 Cart</a>
    </div>
  </header>`;
}

/* ── Shared footer ── */
function renderFooter() {
  return `
  <footer role="contentinfo">
    <div class="footer-inner">
      <div class="footer-brand">
        <img src="/images/troutprostorelogo.png" alt="Trout Pro Store" />
        <p>America's destination for fly fishing flies, rods, and gear.</p>
        <p style="font-family:'Fira Mono',monospace;font-size:.8rem;margin-top:8px">
          <a href="tel:8005944726" style="color:rgba(255,255,255,.6)">&#128222; 800-594-4726</a>
        </p>
      </div>
      <div class="footer-col"><h4>Shop</h4><ul>
        <li><a href="/products.html?cat=flies">Flies</a></li>
        <li><a href="/products.html?cat=rods">Fly Rods</a></li>
        <li><a href="/products.html?cat=line">Fly Line</a></li>
        <li><a href="/products.html?cat=accessories">Accessories</a></li>
        <li><a href="/products.html">All Products</a></li>
      </ul></div>
      <div class="footer-col"><h4>Company</h4><ul>
        <li><a href="/about.html">About Us</a></li>
        <li><a href="/contact.html">Contact Us</a></li>
        <li><a href="/blog.html">Blog</a></li>
      </ul></div>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2026 Trout Pro Store. All rights reserved.</span>
      <span style="color:rgba(255,255,255,.3)">SSL Secured &middot; Secure Checkout</span>
    </div>
  </footer>`;
}

/* ── Header scroll/mobile behaviour ── */
function initHeader() {
  const hambBtn   = document.getElementById('hambBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (hambBtn) {
    hambBtn.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      hambBtn.setAttribute('aria-expanded', open);
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
    }));
  }
  let lastScroll = 0;
  const hdr = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    const cur = window.scrollY;
    if (hdr) hdr.classList.toggle('hidden', cur > lastScroll && cur > 80);
    lastScroll = cur;
  }, { passive: true });
  updateCartBadge();
}
