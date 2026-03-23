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
  const r = await fetch(`${SUPA_URL}/rest/v1/${table}`, {
    method: 'POST',
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
}

/* ── Shared header ── */
function renderHeader(activePage) {
  const pages = [
    { href: '/', label: 'Home' },
    { href: '/products.html', label: 'Shop' },
    { href: '/blog.html', label: 'Blog' },
    { href: '/river-reports.html', label: 'River Reports' },
    { href: '/contact.html', label: 'Contact' }
  ];
  const nav = pages.map(p =>
    `<a href="${p.href}" ${activePage === p.label ? 'class="active"' : ''}>${p.label}</a>`
  ).join('');

  return `
  <header id="site-header" role="banner">
    <div class="header-main">
      <a href="/" class="logo-wrap" aria-label="Trout Pro Store Home">
        <img src="/images/troutprostorelogo.png" alt="Trout Pro Store" height="54" />
      </a>
      <button class="hamburger" id="hambBtn" aria-label="Open navigation" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <nav role="navigation" aria-label="Main navigation">
        ${nav}
        <a href="/cart.html" class="cart-icon" aria-label="Cart">
          🛒 <span id="cart-badge" style="display:none;background:var(--gold);color:var(--forest);border-radius:50%;width:18px;height:18px;font-size:.65rem;font-weight:700;align-items:center;justify-content:center;margin-left:4px;">0</span>
        </a>
        <a href="/products.html" class="nav-cta">Shop Now</a>
      </nav>
    </div>
    <div class="mobile-nav" id="mobileNav">
      ${nav}
      <a href="/cart.html">🛒 Cart</a>
      <a href="/products.html" style="color:var(--gold-light);margin-top:6px;">Shop Now →</a>
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
        <p>America's destination for fly fishing flies, rods, gear, and 200+ river reports.</p>
        <div class="social-links">
          <a href="https://www.facebook.com/TroutProStore" aria-label="Facebook" target="_blank" rel="noopener">fb</a>
          <a href="https://twitter.com/troutprostore" aria-label="Twitter" target="_blank" rel="noopener">tw</a>
          <a href="https://www.instagram.com/troutprostore" aria-label="Instagram" target="_blank" rel="noopener">ig</a>
          <a href="https://www.youtube.com/user/troutuprof" aria-label="YouTube" target="_blank" rel="noopener">yt</a>
        </div>
      </div>
      <div class="footer-col"><h4>Shop</h4><ul>
        <li><a href="/products.html?cat=flies">Flies</a></li>
        <li><a href="/products.html?cat=rods">Fly Rods</a></li>
        <li><a href="/products.html?cat=line">Fly Line</a></li>
        <li><a href="/products.html?cat=accessories">Accessories</a></li>
        <li><a href="/products.html">All Products</a></li>
      </ul></div>
      <div class="footer-col"><h4>Learn</h4><ul>
        <li><a href="/blog.html">Blog</a></li>
        <li><a href="/#river-reports">River Reports</a></li>
        <li><a href="/about.html">About Us</a></li>
        <li><a href="/contact.html">Contact</a></li>
      </ul></div>
      <div class="footer-col"><h4>Help</h4><ul>
        <li><a href="/faq.html">FAQ</a></li>
        <li><a href="/shipping.html">Shipping</a></li>
        <li><a href="/returns.html">Returns</a></li>
        <li><a href="/terms.html">Terms of Use</a></li>
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
