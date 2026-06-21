/* ══════════════════════════════════════════════════
   Luna de Limón — script.js
   SPA Router + Carrito + Carruseles + Modal de pedido
   ══════════════════════════════════════════════════ */

/* ──────────────────────────────────────────
   1. CONFIGURACIÓN — edita aquí tus datos
   ────────────────────────────────────────── */
const CONFIG = {
  waNumber: '573000000000',   // ← tu número: 57 + celular sin espacios
  businessName: 'Luna de Limón',
};

/* ──────────────────────────────────────────
   2. BASE DE DATOS DE PRODUCTOS
   Campos: id, name, cat, price, priceNum, desc, emoji, badge, img
   cat: 'closets' | 'comida'
   img: '' para usar emoji, o 'assets/images/foto.jpg'
   ────────────────────────────────────────── */
const PRODUCTS = [
  // CLOSETS
  {
    id: 1, cat: 'closets',
    name: 'Closet corredizo',
    price: 'Desde $1.200.000', priceNum: 1200000,
    desc: 'Fabricado a medida con madera de calidad. Puertas corredizas con riel premium.',
    emoji: '🚪', badge: 'Popular', img: '',
  },
  {
    id: 2, cat: 'closets',
    name: 'Closet empotrado',
    price: 'Desde $1.800.000', priceNum: 1800000,
    desc: 'Aprovecha el espacio al máximo. Diseño completamente personalizado.',
    emoji: '🗄️', badge: '', img: '',
  },
  {
    id: 3, cat: 'closets',
    name: 'Closet plegable',
    price: 'Desde $850.000', priceNum: 850000,
    desc: 'Ideal para espacios pequeños. Fácil instalación y diseño moderno.',
    emoji: '📦', badge: '', img: '',
  },
  {
    id: 4, cat: 'closets',
    name: 'Organizador de madera',
    price: 'Desde $320.000', priceNum: 320000,
    desc: 'Módulo adicional para interior de closet. Personalizable en medidas.',
    emoji: '🪵', badge: 'Nuevo', img: '',
  },
  // COMIDA
  {
    id: 5, cat: 'comida',
    name: 'Picada familiar',
    price: 'Desde $45.000', priceNum: 45000,
    desc: 'Chorizos, salchipapas, patacones, chicharrón y más. Para 4–6 personas.',
    emoji: '🥘', badge: 'Popular', img: '',
  },
  {
    id: 6, cat: 'comida',
    name: 'Picada pequeña',
    price: 'Desde $25.000', priceNum: 25000,
    desc: 'Perfecta para 2–3 personas. Variedad de frituras y aderezos incluidos.',
    emoji: '🍽️', badge: '', img: '',
  },
  {
    id: 7, cat: 'comida',
    name: 'Empanadas x docena',
    price: '$28.000', priceNum: 28000,
    desc: 'Rellenas de carne, pollo o mixtas. Crujientes y caseras. Pedido con anticipación.',
    emoji: '🥟', badge: '', img: '',
  },
  {
    id: 8, cat: 'comida',
    name: 'Empanadas x media',
    price: '$15.000', priceNum: 15000,
    desc: 'Media docena de empanadas caseras. Perfectas para compartir.',
    emoji: '🫓', badge: '', img: '',
  },
];

/* Productos "destacados" para el home (máx 3 por categoría) */
const FEATURED = {
  closets: PRODUCTS.filter(p => p.cat === 'closets').slice(0, 3),
  comida:  PRODUCTS.filter(p => p.cat === 'comida').slice(0, 3),
};

/* ──────────────────────────────────────────
   3. ESTADO GLOBAL
   ────────────────────────────────────────── */
let cart = loadCart();   // array de { product, qty }

/* ──────────────────────────────────────────
   4. ROUTER — SPA sin recarga
   ────────────────────────────────────────── */
const routes = {
  '/':       renderHome,
  '/closets': renderClosets,
  '/comida':  renderComida,
};

function navigate(path) {
  history.pushState({}, '', path);
  render(path);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function render(path) {
  const app  = document.getElementById('app');
  const fn   = routes[path] || renderHome;

  // Quita la clase para reiniciar la animación
  app.innerHTML = '';
  const page = document.createElement('div');
  page.className = 'page';
  page.innerHTML = fn();
  app.appendChild(page);

  updateNavActive(path);
  bindPageEvents(path);
  initCarousels();
  renderFooter();
}

// Escuchar el botón atrás/adelante del navegador
window.addEventListener('popstate', () => render(location.pathname));

// Interceptar clicks en <a data-link>
document.addEventListener('click', e => {
  const a = e.target.closest('[data-link]');
  if (!a) return;
  e.preventDefault();
  navigate(a.getAttribute('href'));
});

function updateNavActive(path) {
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === path);
  });
}

/* ──────────────────────────────────────────
   5. TEMPLATES DE PÁGINAS
   ────────────────────────────────────────── */

function renderHome() {
  return `
    <!-- HERO -->
    <section class="hero">
      <div class="hero-glow hero-glow-1"></div>
      <div class="hero-glow hero-glow-2"></div>
      <div class="hero-inner">
        <div class="hero-text">
          <div class="hero-badge">✦ Negocio colombiano con corazón</div>
          <h1>Tu hogar y tu mesa<br/>en <em>un solo lugar</em></h1>
          <p class="hero-sub">Closets fabricados a medida y comida casera lista para compartir. Con la calidez de siempre.</p>
          <div class="hero-actions">
            <a href="/closets" class="btn-primary" data-link>Ver closets</a>
            <a href="/comida" class="btn-ghost" data-link>Ver comida</a>
          </div>
        </div>
        <div class="hero-cards">
          <div class="hero-card" onclick="navigate('/closets')">
            <div class="hero-card-icon">🚪</div>
            <h4>Closets y Muebles</h4>
            <p>Diseñados a medida para tu espacio</p>
          </div>
          <div class="hero-card" onclick="navigate('/comida')">
            <div class="hero-card-icon">🥘</div>
            <h4>Picadas y Empanadas</h4>
            <p>Recetas caseras para compartir</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CARRUSEL CLOSETS -->
    <section class="section carousel-section" id="sec-closets">
      <div class="section-inner">
        <div class="section-header" style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;">
          <div>
            <p class="section-eyebrow">Muebles</p>
            <h2>Closets a medida</h2>
          </div>
          <a href="/closets" class="btn-vermas" data-link>
            Ver catálogo completo
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
        ${buildCarousel(FEATURED.closets, 'closets-carousel', 'closets')}
        <p class="carousel-hint">← Desliza automáticamente · Toca para pausar →</p>
      </div>
    </section>

    <!-- CARRUSEL COMIDA -->
    <section class="section carousel-section" id="sec-comida">
      <div class="section-inner">
        <div class="section-header" style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;">
          <div>
            <p class="section-eyebrow">Comestibles</p>
            <h2>Picadas y empanadas</h2>
          </div>
          <a href="/comida" class="btn-vermas" data-link>
            Ver catálogo completo
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
        ${buildCarousel(FEATURED.comida, 'comida-carousel', 'comida')}
        <p class="carousel-hint">← Desliza automáticamente · Toca para pausar →</p>
      </div>
    </section>

    <!-- SOBRE NOSOTROS -->
    <section class="section about-home">
      <div class="section-inner">
        <div class="about-grid">
          <div class="about-visual">
            <div class="about-blob" role="img" aria-label="Luna de Limón">🌙</div>
          </div>
          <div class="about-text">
            <p class="section-eyebrow">Nuestra historia</p>
            <h2>Somos <em>Luna de Limón</em></h2>
            <p>Un negocio colombiano nacido del amor por el detalle y la calidad. Empezamos fabricando closets con alma, y la misma dedicación la llevamos a nuestra comida.</p>
            <p>Cada producto lo fabricamos o preparamos con cuidado, pensando en que llegue a tu hogar con la misma ilusión.</p>
            <div class="stats">
              <div class="stat">
                <div class="stat-num">3+</div>
                <div class="stat-label">Años de experiencia</div>
              </div>
              <div class="stat">
                <div class="stat-num">200+</div>
                <div class="stat-label">Clientes felices</div>
              </div>
              <div class="stat">
                <div class="stat-num">2</div>
                <div class="stat-label">Líneas de productos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    ${buildFooter()}
  `;
}

function renderClosets() {
  return `
    <div class="cat-hero">
      <div class="cat-hero-glow closets"></div>
      <div class="cat-hero-inner">
        <p class="section-eyebrow">Catálogo</p>
        <h1>Closets y Muebles</h1>
        <p>Fabricamos a medida según tu espacio, gusto y presupuesto. Coordinamos visita técnica sin costo.</p>
      </div>
    </div>
    <div class="products-section">
      <div class="products-inner">
        <div class="products-grid">
          ${PRODUCTS.filter(p => p.cat === 'closets').map(p => buildProductCard(p)).join('')}
        </div>
      </div>
    </div>
    ${buildFooter()}
  `;
}

function renderComida() {
  return `
    <div class="cat-hero">
      <div class="cat-hero-glow comida"></div>
      <div class="cat-hero-inner">
        <p class="section-eyebrow">Catálogo</p>
        <h1>Picadas y Empanadas</h1>
        <p>Comida casera lista para compartir. Pedidos con mínimo 24 horas de anticipación.</p>
      </div>
    </div>
    <div class="products-section">
      <div class="products-inner">
        <div class="products-grid">
          ${PRODUCTS.filter(p => p.cat === 'comida').map(p => buildProductCard(p)).join('')}
        </div>
      </div>
    </div>
    ${buildFooter()}
  `;
}

/* ──────────────────────────────────────────
   6. BUILDERS — piezas reutilizables
   ────────────────────────────────────────── */

function buildProductCard(p) {
  const visual = p.img
    ? `<img src="${p.img}" alt="${p.name}" loading="lazy" />`
    : `<span role="img" aria-label="${p.name}">${p.emoji}</span>`;

  return `
    <div class="product-card">
      <div class="product-img bg-${p.cat}">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        ${visual}
      </div>
      <div class="product-body">
        <p class="product-cat">${p.cat === 'closets' ? 'Closets y Muebles' : 'Comida'}</p>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-footer">
          <span class="product-price">${p.price}</span>
          <button class="btn-cart" onclick="addToCart(${p.id})">
            + Agregar
          </button>
        </div>
      </div>
    </div>
  `;
}

function buildCarousel(products, id, cat) {
  // Duplicamos los productos para lograr el loop infinito
  const cards = [...products, ...products]
    .map(p => `
      <div class="carousel-card">
        <div class="carousel-card-img bg-${cat}">
          <span role="img" aria-label="${p.name}">${p.emoji}</span>
        </div>
        <div class="carousel-card-body">
          <h4>${p.name}</h4>
          <p>${p.desc}</p>
          <div class="carousel-card-footer">
            <span class="carousel-price">${p.price}</span>
            <button class="btn-add" onclick="addToCart(${p.id})">+ Agregar</button>
          </div>
        </div>
      </div>
    `).join('');

  return `
    <div class="carousel-wrapper" id="${id}" data-paused="false">
      <div class="carousel-track">${cards}</div>
    </div>
  `;
}

function buildFooter() {
  return `
    <footer>
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="footer-logo">Luna de Limón</span>
          <p>Negocio colombiano con amor en cada producto. Closets a medida y comida casera.</p>
        </div>
        <div class="footer-col">
          <h5>Productos</h5>
          <ul>
            <li><a href="/closets" data-link>Closets y Muebles</a></li>
            <li><a href="/comida" data-link>Picadas</a></li>
            <li><a href="/comida" data-link>Empanadas</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Contacto</h5>
          <ul>
            <li><a href="https://wa.me/${CONFIG.waNumber}" target="_blank" rel="noopener">WhatsApp</a></li>
            <li><a href="https://facebook.com/TU-PAGINA" target="_blank" rel="noopener">Facebook</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2025 Luna de Limón · Colombia 🇨🇴</span>
        <div class="footer-social">
          <a href="https://facebook.com/TU-PAGINA" target="_blank" rel="noopener">Facebook</a>
          <a href="https://wa.me/${CONFIG.waNumber}" target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </div>
    </footer>
  `;
}

function renderFooter() {} // el footer se inyecta dentro de cada página

/* ──────────────────────────────────────────
   7. CARRUSELES — auto-scroll + pausa por toque
   ────────────────────────────────────────── */

function initCarousels() {
  document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
    let resumeTimer = null;

    function pause() {
      wrapper.classList.add('paused');
      clearTimeout(resumeTimer);
      // Reanuda después de 40 segundos
      resumeTimer = setTimeout(() => {
        wrapper.classList.remove('paused');
      }, 40000);
    }

    // Solo pausar si el toque/click es DENTRO del carrusel
    wrapper.addEventListener('mousedown', pause);
    wrapper.addEventListener('touchstart', pause, { passive: true });
    // El scroll de la página o clicks fuera no pausan el carrusel
  });
}

/* ──────────────────────────────────────────
   8. CARRITO
   ────────────────────────────────────────── */

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(i => i.product.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ product, qty: 1 });
  }

  saveCart();
  updateCartUI();
  showToast(`${product.emoji} ${product.name} agregado`);
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.product.id !== productId);
  saveCart();
  updateCartUI();
}

function changeQty(productId, delta) {
  const item = cart.find(i => i.product.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(productId);
  else { saveCart(); updateCartUI(); }
}

function cartTotal() {
  return cart.reduce((sum, i) => sum + i.product.priceNum * i.qty, 0);
}

function cartCount() {
  return cart.reduce((sum, i) => sum + i.qty, 0);
}

function updateCartUI() {
  const count = cartCount();

  // Badge del navbar
  const badge = document.getElementById('cartCount');
  if (badge) {
    badge.textContent = count;
    badge.classList.toggle('visible', count > 0);
  }

  // Contenido del drawer
  const itemsEl  = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  if (!itemsEl || !footerEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>Tu carrito está vacío</p>
      </div>
    `;
    footerEl.innerHTML = '';
    return;
  }

  itemsEl.innerHTML = cart.map(i => `
    <div class="cart-item">
      <div class="cart-item-icon bg-${i.product.cat}">${i.product.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${i.product.name}</div>
        <div class="cart-item-price">${i.product.price}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty(${i.product.id}, -1)">−</button>
          <span class="qty-val">${i.qty}</span>
          <button class="qty-btn" onclick="changeQty(${i.product.id}, +1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${i.product.id})" aria-label="Eliminar">✕</button>
    </div>
  `).join('');

  footerEl.innerHTML = `
    <div class="cart-total-row">
      <span class="cart-total-label">Total estimado</span>
      <span class="cart-total-val">${formatCOP(cartTotal())}</span>
    </div>
    <button class="btn-checkout" onclick="openModal()">
      Finalizar pedido →
    </button>
    <p class="cart-note">Confirmaremos precio final por WhatsApp</p>
  `;
}

/* Drawer abrir/cerrar */
function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ──────────────────────────────────────────
   9. MODAL DE PEDIDO (último paso)
   ────────────────────────────────────────── */

function openModal() {
  closeCart();

  // Rellena el resumen del pedido
  const summary = document.getElementById('modalSummary');
  if (summary) {
    summary.innerHTML = `
      <div class="modal-summary-title">Resumen de tu pedido</div>
      ${cart.map(i => `
        <div class="modal-summary-item">
          <span>${i.product.emoji} ${i.product.name} ×${i.qty}</span>
          <span>${i.product.price}</span>
        </div>
      `).join('')}
      <div class="modal-summary-total">
        <span>Total estimado</span>
        <span>${formatCOP(cartTotal())}</span>
      </div>
    `;
  }

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function sendToWhatsApp() {
  const name  = document.getElementById('fname').value.trim();
  const phone = document.getElementById('fphone').value.trim();
  const city  = document.getElementById('fcity').value.trim();
  const notes = document.getElementById('fnotes').value.trim();

  if (!name || !phone || !city) {
    alert('Por favor completa nombre, WhatsApp y ciudad.');
    return;
  }

  const phoneClean = phone.replace(/\s/g, '');
  if (!/^3\d{9}$/.test(phoneClean)) {
    alert('Ingresa un celular colombiano válido (ej: 314 456 7890).');
    return;
  }

  const itemLines = cart.map(i => `• ${i.product.emoji} ${i.product.name} ×${i.qty} — ${i.product.price}`).join('\n');

  const msg = encodeURIComponent(
    `¡Hola ${CONFIG.businessName}! 🌙\n\n` +
    `*Nombre:* ${name}\n` +
    `*WhatsApp:* ${phoneClean}\n` +
    `*Ciudad:* ${city}\n\n` +
    `*Pedido:*\n${itemLines}\n\n` +
    `*Total estimado:* ${formatCOP(cartTotal())}\n` +
    (notes ? `\n*Notas:* ${notes}` : '')
  );

  window.open(`https://wa.me/${CONFIG.waNumber}?text=${msg}`, '_blank');
  closeModal();
  cart = [];
  saveCart();
  updateCartUI();
  showToast('¡Pedido enviado! Te contactaremos pronto 💜');
}

/* ──────────────────────────────────────────
   10. PERSISTENCIA — localStorage
   ────────────────────────────────────────── */

function saveCart() {
  try {
    localStorage.setItem('ldl_cart', JSON.stringify(
      cart.map(i => ({ id: i.product.id, qty: i.qty }))
    ));
  } catch(_) {}
}

function loadCart() {
  try {
    const raw = localStorage.getItem('ldl_cart');
    if (!raw) return [];
    return JSON.parse(raw)
      .map(({ id, qty }) => {
        const product = PRODUCTS.find(p => p.id === id);
        return product ? { product, qty } : null;
      })
      .filter(Boolean);
  } catch(_) {
    return [];
  }
}

/* ──────────────────────────────────────────
   11. HELPERS
   ────────────────────────────────────────── */

function formatCOP(n) {
  return '$' + n.toLocaleString('es-CO');
}

let toastTimer;
function showToast(msg) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

/* ──────────────────────────────────────────
   12. BIND DE EVENTOS POR PÁGINA
   ────────────────────────────────────────── */

function bindPageEvents(path) {
  // Nada específico por página en este punto
  // (los onclick inline de los botones ya funcionan globalmente)
}

/* ──────────────────────────────────────────
   13. INICIALIZACIÓN
   ────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  // Navbar scroll
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
  });

  // Hamburger menú móvil
  document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
  });

  // Carrito — abrir
  document.getElementById('cartBtn').addEventListener('click', () => {
    updateCartUI();
    openCart();
  });

  // Carrito — cerrar
  document.getElementById('cartClose').addEventListener('click', closeCart);
  document.getElementById('cartOverlay').addEventListener('click', closeCart);

  // Modal — cerrar
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });

  // Modal — enviar
  document.getElementById('btnSendWA').addEventListener('click', sendToWhatsApp);

  // Render inicial
  render(location.pathname);
  updateCartUI();
});
