/**
 * APP.JS - LÓGICA DE LA TIENDA E-COMMERCE (TIENDA ÚNICA)
 * Gestión reactiva de catálogo, carrito de compras, vista rápida y checkout.
 */

const app = {
  activeCategory: "all",
  searchQuery: "",
  cart: [],
  currentUser: null,
  selectedPaymentMethod: "Transferencia Bancaria / Móvil",

  init() {
    // 1. Read URL params if any
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("cat")) {
      this.activeCategory = urlParams.get("cat");
    }

    // 2. Load Cart and User from Storage
    this.cart = Storage.getCart();
    this.currentUser = Storage.getCurrentUser();

    // 3. Bind UI interactions
    this.bindEvents();

    // 4. Render initial view
    this.renderAll();
  },

  bindEvents() {
    // Search Input
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.renderProducts();
      });
    }

    // Cart Drawer openers & closers
    const openCartBtn = document.getElementById("openCartBtn");
    const closeCartBtn = document.getElementById("closeCartBtn");
    const cartOverlay = document.getElementById("cartOverlay");

    if (openCartBtn) openCartBtn.addEventListener("click", () => this.openCart());
    if (closeCartBtn) closeCartBtn.addEventListener("click", () => this.closeCart());
    if (cartOverlay) {
      cartOverlay.addEventListener("click", (e) => {
        if (e.target === cartOverlay) this.closeCart();
      });
    }

    // Checkout modal openers & form
    const proceedBtn = document.getElementById("proceedToCheckoutBtn");
    const closeCheckoutBtn = document.getElementById("closeCheckoutBtn");
    const checkoutModal = document.getElementById("checkoutModal");
    const checkoutForm = document.getElementById("checkoutForm");

    if (proceedBtn) {
      proceedBtn.addEventListener("click", () => {
        if (this.cart.length === 0) {
          this.showToast("⚠️ El carrito está vacío.");
          return;
        }
        this.closeCart();
        this.openCheckout();
      });
    }

    if (closeCheckoutBtn) closeCheckoutBtn.addEventListener("click", () => this.closeCheckout());
    if (checkoutModal) {
      checkoutModal.addEventListener("click", (e) => {
        if (e.target === checkoutModal) this.closeCheckout();
      });
    }

    if (checkoutForm) {
      checkoutForm.addEventListener("submit", (e) => this.handleCheckout(e));
    }

    // Payment method selector
    document.querySelectorAll(".payment-method-card").forEach((card) => {
      card.addEventListener("click", () => {
        document.querySelectorAll(".payment-method-card").forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");
        this.selectedPaymentMethod = card.getAttribute("data-method");
      });
    });

    // Close quick view
    const closeQuickBtn = document.getElementById("closeQuickViewBtn");
    const quickModal = document.getElementById("quickViewModal");
    if (closeQuickBtn) closeQuickBtn.addEventListener("click", () => this.closeQuickView());
    if (quickModal) {
      quickModal.addEventListener("click", (e) => {
        if (e.target === quickModal) this.closeQuickView();
      });
    }

    // Order Success receipt modal close
    const closeSuccessBtn = document.getElementById("closeSuccessBtn");
    const successModal = document.getElementById("orderSuccessModal");
    if (closeSuccessBtn) {
      closeSuccessBtn.addEventListener("click", () => {
        if (successModal) successModal.classList.remove("open");
      });
    }
  },

  renderAll() {
    this.renderStoreBranding();
    this.renderUserAuthStatus();
    this.renderCategories();
    this.renderProducts();
    this.renderCart();
  },

  /* ==========================================================================
     USER AUTHENTICATION & ROLE-BASED NAVIGATION (BUYER VS OWNER)
     ========================================================================== */
  renderUserAuthStatus() {
    this.currentUser = Storage.getCurrentUser();
    const topBarAdminWrap = document.getElementById("topBarAdminWrap");
    const userAuthContainer = document.getElementById("userAuthContainer");
    const footerAdminActionWrap = document.getElementById("footerAdminActionWrap");

    if (this.currentUser && this.currentUser.role === "admin") {
      // 1. ADMIN / OWNER MODE (Only store owner sees these controls)
      if (topBarAdminWrap) {
        topBarAdminWrap.style.display = "flex";
        const ind = topBarAdminWrap.querySelector(".admin-session-indicator");
        if (ind) ind.textContent = `👑 Modo Dueño (${this.currentUser.name || "Daniel Campos"})`;
      }

      if (userAuthContainer) {
        userAuthContainer.innerHTML = `
          <div class="user-session-pill admin" title="Sesión activa como Dueño del Negocio">
            <span class="user-session-avatar">👑</span>
            <span>${this.currentUser.name || "Daniel Campos"}</span>
          </div>
          <a href="admin.html" class="btn-user-admin-link" title="Ir al Panel Administrativo">
            <span>⚡ Panel Admin</span>
          </a>
          <button class="btn-user-logout-btn" onclick="app.logout()" title="Cerrar sesión de administrador (Desloguear)">
            <span>🚪 Salir</span>
          </button>
        `;
      }

      if (footerAdminActionWrap) {
        footerAdminActionWrap.innerHTML = `
          <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
            <a href="admin.html" class="btn-hero-primary" style="padding: 8px 14px; font-size: 0.82rem; text-decoration: none;">
              <span>⚡ Ir al Panel de Control</span>
            </a>
            <button onclick="app.logout()" class="btn-user-logout-btn" style="color: #cbd5e1; border-color: #475569;">
              <span>🚪 Cerrar Sesión</span>
            </button>
          </div>
        `;
      }
    } else if (this.currentUser && this.currentUser.role === "cliente") {
      // 2. CLIENT / BUYER MODE
      if (topBarAdminWrap) {
        topBarAdminWrap.style.display = "none";
      }

      if (userAuthContainer) {
        userAuthContainer.innerHTML = `
          <div class="user-session-pill" title="Sesión de Cliente Comprador">
            <span class="user-session-avatar">🛍️</span>
            <span>${this.currentUser.name || "Cliente"}</span>
          </div>
          <button class="btn-user-logout-btn" onclick="app.logout()" title="Cerrar sesión">
            <span>🚪 Salir</span>
          </button>
        `;
      }

      if (footerAdminActionWrap) {
        footerAdminActionWrap.innerHTML = `
          <p style="font-size: 0.78rem; color: #64748b; margin-bottom: 8px;">Conectado como comprador: ${this.currentUser.email}</p>
          <button onclick="app.logout()" class="btn-user-logout-btn" style="color: #cbd5e1; border-color: #475569;">
            <span>🚪 Cerrar Sesión</span>
          </button>
        `;
      }
    } else {
      // 3. ANONYMOUS VISITOR / BUYER
      // HIDE ALL ADMIN CONTROLS COMPLETELY!
      if (topBarAdminWrap) {
        topBarAdminWrap.style.display = "none";
      }

      if (userAuthContainer) {
        userAuthContainer.innerHTML = `
          <button class="btn-login-pill" onclick="app.openLoginModal()" title="Iniciar Sesión (Dueño o Cliente)">
            <span>👤 Iniciar Sesión</span>
          </button>
        `;
      }

      if (footerAdminActionWrap) {
        footerAdminActionWrap.innerHTML = `
          <button class="btn-user-logout-btn" onclick="app.openLoginModal()" style="color: #94a3b8; border-color: #334155;">
            <span>🔐 Acceso Dueño / Admin</span>
          </button>
        `;
      }
    }
  },

  openLoginModal() {
    const modal = document.getElementById("loginModal");
    if (modal) {
      modal.classList.add("open");
      const err = document.getElementById("loginAlertError");
      if (err) err.style.display = "none";
    }
  },

  closeLoginModal() {
    const modal = document.getElementById("loginModal");
    if (modal) modal.classList.remove("open");
  },

  setLoginFormRole(role) {
    const btnAdmin = document.getElementById("btnRoleTabAdmin");
    const btnCliente = document.getElementById("btnRoleTabCliente");
    const emailInput = document.getElementById("loginEmail");
    const passInput = document.getElementById("loginPassword");
    const submitBtnText = document.getElementById("loginSubmitBtnText");

    if (role === "admin") {
      if (btnAdmin) btnAdmin.classList.add("active");
      if (btnCliente) btnCliente.classList.remove("active");
      if (emailInput) emailInput.value = "admin@tienda.com";
      if (passInput) passInput.value = "admin123";
      if (submitBtnText) submitBtnText.textContent = "Ingresar como Dueño";
    } else {
      if (btnCliente) btnCliente.classList.add("active");
      if (btnAdmin) btnAdmin.classList.remove("active");
      if (emailInput) emailInput.value = "cliente@tienda.com";
      if (passInput) passInput.value = "123";
      if (submitBtnText) submitBtnText.textContent = "Ingresar como Comprador";
    }
  },

  handleLoginSubmit(e) {
    e.preventDefault();
    const emailInput = document.getElementById("loginEmail");
    const passInput = document.getElementById("loginPassword");
    const errAlert = document.getElementById("loginAlertError");
    const errText = document.getElementById("loginAlertErrorText");

    const email = emailInput ? emailInput.value : "";
    const pass = passInput ? passInput.value : "";

    const res = Storage.login(email, pass);
    if (res.success) {
      this.currentUser = res.user;
      this.closeLoginModal();
      this.renderUserAuthStatus();
      this.showToast(`¡Bienvenido, ${res.user.name}! (${res.user.role === 'admin' ? 'Dueño' : 'Cliente'})`);
      if (res.user.role === "admin") {
        this.showToast("👑 Modo Dueño activado: los botones de administración ahora son visibles.");
      }
    } else {
      if (errAlert) errAlert.style.display = "flex";
      if (errText) errText.textContent = res.message || "Credenciales incorrectas";
    }
  },

  logout() {
    Storage.logout();
    this.currentUser = null;
    this.renderUserAuthStatus();
    this.showToast("👋 Has cerrado sesión (deslogueado). Vista de comprador activa sin accesos de administración.");
  },

  /* ==========================================================================
     STORE BRANDING & PERSONALIZATION (ARCHETYPE-DRIVEN THEMING)
     ========================================================================== */
  renderStoreBranding(customConfig = null) {
    const config = customConfig || Storage.getStoreConfig();
    if (!config) return;

    // Detect active archetype
    const activeTemplate = Storage.getActiveTemplate();
    const archetype = config.template_archetype || (activeTemplate ? activeTemplate.archetype : "moderno");

    // Apply theme class to body
    document.body.className = `theme-${archetype}`;

    // 1. Dynamic Theme Colors & Styles
    if (config.primary_color) {
      document.documentElement.style.setProperty('--primary', config.primary_color);
      document.documentElement.style.setProperty('--primary-hover', config.primary_color);
      document.documentElement.style.setProperty('--primary-glow', `${config.primary_color}40`);
    }

    // 2. Button Corner Radius Style
    if (config.button_style === 'pill') {
      document.documentElement.style.setProperty('--radius-md', '9999px');
      document.documentElement.style.setProperty('--radius-sm', '9999px');
    } else if (config.button_style === 'square' || config.button_style === 'brutal') {
      document.documentElement.style.setProperty('--radius-md', '4px');
      document.documentElement.style.setProperty('--radius-sm', '2px');
    } else {
      document.documentElement.style.setProperty('--radius-md', '14px');
      document.documentElement.style.setProperty('--radius-sm', '8px');
    }

    // 3. Top Announcement Bar
    const topBar = document.querySelector('.top-bar');
    const topBarText = document.getElementById('topBarText');
    if (topBar) {
      topBar.style.display = config.announcement_enabled === false ? 'none' : 'flex';
    }
    if (topBarText) {
      if (config.announcement_text) {
        topBarText.textContent = config.announcement_text;
      } else if (archetype === 'ejecutivo') {
        topBarText.textContent = "✦ COLECCIÓN EJECUTIVA PRIVADA • ENVÍOS PRIORITARIOS • ATENCIÓN VIP EXCLUSIVA ✦";
      } else if (archetype === 'moda') {
        topBarText.textContent = "🔥 NUEVO DROP REVELADO • 20% OFF EN PRIMERA COMPRA • TENDENCIAS INTERNACIONALES 🔥";
      } else if (archetype === 'nordico') {
        topBarText.textContent = "🌿 MATERIALES SOSTENIBLES • ENVÍO NEUTRO EN CARBONO • CALIDAD ESCANDINAVA GARANTIZADA 🌿";
      } else if (archetype === 'neobrutal') {
        topBarText.textContent = "⚡ ¡OFERTAS RELÁMPAGO 2026! • 📦 ENVÍO SÚPER RÁPIDO • ¡COMPRA ANTES QUE SE AGOTE! ⚡";
      } else {
        topBarText.textContent = "⚡ SISTEMA DE INVENTARIO EN VIVO // LATENCIA CERO // DESPACHOS EXPRESS ⚡";
      }
    }

    // 4. Header & Brand Logo
    const storeBrandIcon = document.getElementById("storeBrandIcon");
    const storeBrandName = document.getElementById("storeBrandName");
    const storeBrandTagline = document.getElementById("storeBrandTagline");
    if (storeBrandIcon) storeBrandIcon.textContent = config.logo_icon || (activeTemplate ? activeTemplate.icon : "🛍️");
    if (storeBrandName) storeBrandName.textContent = config.name || "Mi Tienda Oficial";
    if (storeBrandTagline) storeBrandTagline.textContent = config.tagline || (archetype === 'ejecutivo' ? "Boutique Privada & Alta Gama" : archetype === 'moda' ? "Lookbook & Streetwear" : "Tecnología & Vanguardia");

    // 5. Render Hero Section specific to the archetype
    this.renderHeroSection(archetype, config);

    // 6. Footer Info
    const footerStoreName = document.getElementById("footerStoreName");
    const footerStoreDesc = document.getElementById("footerStoreDesc");
    const footerPhoneLink = document.getElementById("footerPhoneLink");
    const footerEmailLink = document.getElementById("footerEmailLink");
    const footerAddress = document.getElementById("footerAddress");

    if (footerStoreName) footerStoreName.textContent = config.name || "Mi Tienda Oficial";
    if (footerStoreDesc) footerStoreDesc.textContent = config.description || "Tu e-commerce de confianza.";
    if (footerPhoneLink) {
      footerPhoneLink.textContent = config.contact_phone || "+58 414 123 4567";
      footerPhoneLink.href = `tel:${(config.contact_phone || "").replace(/\s+/g, "")}`;
    }
    if (footerEmailLink) {
      footerEmailLink.textContent = config.contact_email || "contacto@mitienda.com";
      footerEmailLink.href = `mailto:${config.contact_email || "contacto@mitienda.com"}`;
    }
    if (footerAddress) footerAddress.textContent = config.contact_address || "Av. Principal Comercial, Local 4";

    // Dynamic document title
    document.title = `${config.name} — E-Commerce Oficial`;
  },

  /* Render Custom Architectural Hero Layout */
  renderHeroSection(archetype, config) {
    const heroSection = document.getElementById("heroSection");
    if (!heroSection) return;

    if (archetype === "ejecutivo") {
      heroSection.innerHTML = `
        <div class="hero-editorial-centered">
          <div class="luxury-crest-badge">
            <span>⚜️</span>
            <span id="heroTagText">${config.hero_tag || "✦ Colección Privada • Alta Gama ✦"}</span>
          </div>
          <h1 class="luxury-hero-title" id="heroTitle">
            ${config.hero_title || "Distinción, Precisión y Excelencia en Cada Pieza"}
          </h1>
          <p class="luxury-hero-desc" id="heroDesc">
            ${config.hero_desc || "Piezas selectas de tecnología de vanguardia, smartwatches en titanio y accesorios respaldados por certificación de autenticidad."}
          </p>
          <div class="luxury-hero-actions">
            <a href="#catalogo" class="btn-luxury-primary" id="heroPrimaryCta">
              <span>${config.hero_cta_text || "Adquirir de la Colección"}</span>
              <span>✦</span>
            </a>
            <a href="admin.html" class="btn-luxury-secondary">
              <span>Asesoría Ejecutiva VIP</span>
            </a>
          </div>
          <div class="luxury-trust-seals">
            <div class="luxury-seal-item"><span class="luxury-seal-icon">✦</span> <span>Certificado de Autenticidad</span></div>
            <div class="luxury-seal-item"><span class="luxury-seal-icon">💎</span> <span>Materiales Nobles CNC</span></div>
            <div class="luxury-seal-item"><span class="luxury-seal-icon">🛡️</span> <span>Garantía Vitalicia VIP</span></div>
            <div class="luxury-seal-item"><span class="luxury-seal-icon">✈️</span> <span>Envío Blindado Prioritario</span></div>
          </div>
        </div>
      `;
    } else if (archetype === "moda") {
      heroSection.innerHTML = `
        <div class="hero-fashion-lookbook">
          <div class="fashion-hero-grid">
            <div>
              <span class="fashion-hero-badge" id="heroTagText">${config.hero_tag || "🔥 NUEVO DROP REVELADO // SS26"}</span>
              <h1 class="fashion-hero-heading" id="heroTitle">
                ${config.hero_title || "THE NEW ERA OF <span class=\"fashion-italic\">Streetwear & Style</span>"}
              </h1>
              <p class="fashion-hero-desc" id="heroDesc">
                ${config.hero_desc || "Colección de archivo, mochilas urbanas de alta durabilidad y piezas de tendencia seleccionadas de pasarela internacional."}
              </p>
              <div class="fashion-cta-row">
                <a href="#catalogo" class="btn-fashion-primary" id="heroPrimaryCta">
                  <span>${config.hero_cta_text || "COMPRAR EL DROP AHORA"}</span>
                </a>
                <a href="#catalogo" class="btn-fashion-secondary">
                  <span>VER LOOKBOOK SS26</span>
                </a>
              </div>
            </div>
            <div>
              <div class="fashion-lookbook-card">
                <img src="img/catalog/boutique_bolso.jpg" alt="Lookbook Drop">
                <div class="fashion-lookbook-overlay">
                  <span style="font-family: 'Syne', sans-serif; font-size: 0.72rem; font-weight: 900; letter-spacing: 2px;">LOOKBOOK // PIEZA 01</span>
                  <div style="font-weight: 800; font-size: 1.1rem; margin-top: 4px;">Urban Explorer Tactical Gear</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (archetype === "nordico") {
      heroSection.innerHTML = `
        <div class="hero-nordic-warm">
          <div class="hero-nordic-card">
            <span class="hero-nordic-badge">
              <span>🌿</span>
              <span id="heroTagText">${config.hero_tag || "🌿 Diseño Consciente & Sustentable"}</span>
            </span>
            <h1 class="hero-nordic-title" id="heroTitle">${config.hero_title || "Mobiliario Cálido y Armonía para tu Espacio"}</h1>
            <p class="hero-nordic-desc" id="heroDesc">${config.hero_desc || "Materiales orgánicos certificados, iluminación tenue y artículos de diseño ergonómico para transformar tu entorno en un santuario de paz."}</p>
            <a href="#catalogo" class="btn-nordic-primary" id="heroPrimaryCta">
              <span>${config.hero_cta_text || "Descubrir Colección Hogar"}</span>
              <span>→</span>
            </a>
            <div class="nordic-trust-row">
              <div class="nordic-trust-chip"><span>🌱</span> <span>100% Madera Sostenible</span></div>
              <div class="nordic-trust-chip"><span>☕</span> <span>Filosofía Hygge</span></div>
              <div class="nordic-trust-chip"><span>🪵</span> <span>Garantía de Por Vida</span></div>
              <div class="nordic-trust-chip"><span>🚚</span> <span>Envío Cuidado & Seguro</span></div>
            </div>
          </div>
        </div>
      `;
    } else if (archetype === "neobrutal") {
      heroSection.innerHTML = `
        <div class="hero-brutal-punch">
          <div class="hero-brutal-box">
            <div class="hero-brutal-stickers">
              <span class="brutal-sticker" id="heroTagText">${config.hero_tag || "★ 100% VIRAL & SÚPER RECOMENDADO ★"}</span>
              <span class="brutal-sticker alt">🔥 STOCK LIMITADO</span>
              <span class="brutal-sticker">⚡ ENVÍO EN 24H</span>
            </div>
            <h1 class="hero-brutal-title" id="heroTitle">${config.hero_title || "¡LOS PRODUCTOS MÁS VIRALES DEL MOMENTO!"}</h1>
            <p class="hero-brutal-desc" id="heroDesc">${config.hero_desc || "Diseños fuera de lo común, colores explosivos, entrega inmediata y garantía sin rodeos."}</p>
            <a href="#catalogo" class="btn-brutal-primary" id="heroPrimaryCta">
              <span>${config.hero_cta_text || "¡CONSEGUIR EL MÍO YA!"}</span>
              <span>💥</span>
            </a>
          </div>
        </div>
      `;
    } else {
      // Default: Moderno Tech Split
      heroSection.innerHTML = `
        <div class="hero-tech-split">
          <div class="hero-tech-left">
            <div class="tech-telemetry-badge">
              <span>⚡</span>
              <span id="heroTagText">${config.hero_tag || "⚡ Protocolo Oficial 2026 // V2.6"}</span>
            </div>
            <h1 class="tech-hero-title" id="heroTitle">
              ${config.hero_title || "Hardware de Próxima Generación para Creadores"}
            </h1>
            <p class="tech-hero-desc" id="heroDesc">
              ${config.hero_desc || "Auriculares Hi-Fi inalámbricos, teclados mecánicos personalizados y telemetría de inventario en tiempo real con latencia cero."}
            </p>
            <div class="tech-action-row">
              <a href="#catalogo" class="btn-tech-primary" id="heroPrimaryCta">
                <span>${config.hero_cta_text || "⚡ Equipar Mi Setup"}</span>
                <span>↓</span>
              </a>
              <a href="admin.html" class="btn-tech-secondary">
                <span>📊 Telemetría y Métricas</span>
              </a>
            </div>
            <div class="tech-stats-grid">
              <div class="tech-stat-chip">
                <span class="val">0ms</span>
                <span class="lbl">Latencia en Vivo</span>
              </div>
              <div class="tech-stat-chip">
                <span class="val">48h</span>
                <span class="lbl">Carga GaN Pro</span>
              </div>
              <div class="tech-stat-chip">
                <span class="val">24M</span>
                <span class="lbl">Cobertura Directa</span>
              </div>
            </div>
          </div>
          <div class="hero-tech-right">
            <div class="tech-showcase-box">
              <div class="showcase-header">
                <span class="showcase-tag">HARDWARE DESTACADO</span>
                <span style="font-size: 0.72rem; color: #10b981; font-weight: 800;">● DISPONIBLE</span>
              </div>
              <div class="showcase-img-wrap">
                <img src="img/catalog/tech_auriculares.jpg" alt="Showcase Tech">
              </div>
              <div class="tech-spec-pills-row">
                <span class="spec-pill-item">WiFi 6E</span>
                <span class="spec-pill-item">ANC 45dB</span>
                <span class="spec-pill-item">Titanio CNC</span>
                <span class="spec-pill-item">Hi-Res Audio</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  },

  /* ==========================================================================
     CATEGORIES FILTER BAR RENDERING
     ========================================================================== */
  renderCategories() {
    const container = document.getElementById("categoryFilterBar");
    if (!container) return;

    const categories = Storage.getCategories();
    container.innerHTML = categories.map((cat) => {
      const isActive = this.activeCategory === cat.id;
      return `
        <button 
          class="category-filter-btn ${isActive ? 'active' : ''}" 
          onclick="app.filterCategory('${cat.id}')"
          type="button"
        >
          <span class="cat-icon">${cat.icon}</span>
          <span class="cat-name">${cat.name}</span>
        </button>
      `;
    }).join("");

    // Update active filter badge if not 'all'
    const badge = document.getElementById("activeFilterBadge");
    if (badge) {
      if (this.activeCategory !== "all") {
        const found = categories.find(c => c.id === this.activeCategory);
        badge.style.display = "inline-flex";
        badge.innerHTML = `Filtro: ${found ? found.name : this.activeCategory} <span style="margin-left:6px; cursor:pointer;" onclick="app.filterCategory('all')">✕</span>`;
      } else {
        badge.style.display = "none";
      }
    }
  },

  filterCategory(catId) {
    this.activeCategory = catId;
    this.renderCategories();
    this.renderProducts();
  },

  /* ==========================================================================
     PRODUCTS CATALOG RENDERING (ARCHETYPE-SPECIFIC CARD ARCHITECTURE)
     ========================================================================== */
  renderProducts() {
    const container = document.getElementById("productsGrid");
    const emptyState = document.getElementById("emptyCatalogState");
    if (!container) return;

    const config = Storage.getStoreConfig();
    const activeTemplate = Storage.getActiveTemplate();
    const archetype = config?.template_archetype || (activeTemplate ? activeTemplate.archetype : "moderno");

    let products = Storage.getProducts();

    // 1. Filter by Category
    if (this.activeCategory !== "all") {
      products = products.filter((p) => p.category === this.activeCategory);
    }

    // 2. Filter by Search Query
    if (this.searchQuery) {
      products = products.filter((p) =>
        p.name.toLowerCase().includes(this.searchQuery) ||
        (p.brand && p.brand.toLowerCase().includes(this.searchQuery)) ||
        (p.categoryLabel && p.categoryLabel.toLowerCase().includes(this.searchQuery)) ||
        (p.sku && p.sku.toLowerCase().includes(this.searchQuery))
      );
    }

    if (products.length === 0) {
      container.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";

    container.innerHTML = products.map((product) => {
      const inStock = product.stock > 0;
      const isLowStock = inStock && product.stock <= 10;

      // 1. ESTILO EJECUTIVO
      if (archetype === "ejecutivo") {
        return `
          <div class="product-card card-ejecutivo">
            <div class="product-media-wrap" onclick="app.openQuickView(${product.id})">
              <span class="luxury-pill-badge">✦ ALTA GAMA</span>
              <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
            </div>
            <div class="product-content">
              <div class="luxury-collection-name">${product.brand || "COLECCIÓN PRIVADA"}</div>
              <h3 class="product-name" onclick="app.openQuickView(${product.id})">${product.name}</h3>
              <p class="luxury-desc-excerpt">${product.description ? product.description.substring(0, 80) + "..." : "Manufactura con materiales certificados y precisión de autor."}</p>
              <div class="luxury-price-row">
                <span class="luxury-price-val">USD $${Number(product.price).toFixed(2)}</span>
                <span style="font-size: 0.72rem; color: #b45309; font-weight: 700;">Garantía Vitalicia</span>
              </div>
              <button 
                class="btn-luxury-buy" 
                onclick="app.addToCart(${product.id}, 1)"
                ${!inStock ? 'disabled style="opacity: 0.4; cursor: not-allowed;"' : ""}
              >
                <span>${inStock ? "Adquirir de la Selección ✦" : "Pieza Agotada"}</span>
              </button>
            </div>
          </div>
        `;
      }

      // 2. ESTILO A LA MODA (LOOKBOOK 3:4 PORTRAIT)
      if (archetype === "moda") {
        return `
          <div class="product-card card-moda">
            <div class="product-media-wrap fashion-portrait" onclick="app.openQuickView(${product.id})">
              <span class="fashion-drop-tag">HOT DROP</span>
              <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
              <div class="fashion-sizes-hover">
                <span class="size-label">TALLAS DISPONIBLES</span>
                <div class="size-pills">
                  <span>S</span><span>M</span><span>L</span><span>XL</span>
                </div>
              </div>
            </div>
            <div class="product-content">
              <div class="fashion-collection-label">SS26 DROP // EDITORIAL</div>
              <h3 class="product-name" onclick="app.openQuickView(${product.id})">${product.name}</h3>
              <div class="fashion-price-row">
                <span class="fashion-price">$${Number(product.price).toFixed(2)}</span>
                <button 
                  class="btn-fashion-buy" 
                  onclick="app.addToCart(${product.id}, 1)"
                  ${!inStock ? 'disabled style="opacity: 0.4; cursor: not-allowed;"' : ""}
                >
                  ${inStock ? "COMPRAR DROP" : "SOLD OUT"}
                </button>
              </div>
            </div>
          </div>
        `;
      }

      // 3. ESTILO NÓRDICO (COZY LIVING)
      if (archetype === "nordico") {
        return `
          <div class="product-card card-nordico">
            <div class="product-media-wrap" onclick="app.openQuickView(${product.id})">
              <span class="nordic-eco-badge">🌿 100% Sostenible</span>
              <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
            </div>
            <div class="product-content">
              <div class="nordic-cat-text">${product.categoryLabel || "Hogar & Confort"}</div>
              <h3 class="product-name" onclick="app.openQuickView(${product.id})">${product.name}</h3>
              <p class="nordic-desc">Diseño ergonómico y acabados orgánicos suaves para el día a día.</p>
              <div class="nordic-price-row">
                <span class="nordic-price">$${Number(product.price).toFixed(2)}</span>
                <button 
                  class="btn-nordic-buy" 
                  onclick="app.addToCart(${product.id}, 1)"
                  ${!inStock ? 'disabled style="opacity: 0.4; cursor: not-allowed;"' : ""}
                >
                  ${inStock ? "Añadir al Hogar" : "Agotado"}
                </button>
              </div>
            </div>
          </div>
        `;
      }

      // 4. ESTILO NEO-BRUTALIST (POP TREND)
      if (archetype === "neobrutal") {
        return `
          <div class="product-card card-neobrutal">
            <div class="product-media-wrap" onclick="app.openQuickView(${product.id})">
              <span class="brutal-badge-pop">★ ¡SÚPER VIRAL!</span>
              <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
            </div>
            <div class="product-content">
              <div class="brutal-cat-label">${(product.categoryLabel || "PRODUCTO").toUpperCase()}</div>
              <h3 class="product-name" onclick="app.openQuickView(${product.id})">${product.name.toUpperCase()}</h3>
              <div class="brutal-price-box">
                <span class="brutal-price">$${Number(product.price).toFixed(2)}</span>
                <span class="brutal-stock-tag">¡${product.stock} DISPONIBLES!</span>
              </div>
              <button 
                class="btn-brutal-buy" 
                onclick="app.addToCart(${product.id}, 1)"
                ${!inStock ? 'disabled style="opacity: 0.4; cursor: not-allowed;"' : ""}
              >
                ${inStock ? "🛒 ¡AGREGAR YA!" : "¡AGOTADO!"}
              </button>
            </div>
          </div>
        `;
      }

      // 5. DEFAULT: ESTILO MODERNO (TECH MATRIX)
      return `
        <div class="product-card card-moderno">
          <div class="product-media-wrap" onclick="app.openQuickView(${product.id})">
            <span class="tech-badge-glow">${product.badge || "TECH PRO"}</span>
            <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
          </div>
          <div class="product-content">
            <div class="tech-cat-chip">${product.categoryLabel || "HARDWARE"}</div>
            <h3 class="product-name" onclick="app.openQuickView(${product.id})">${product.name}</h3>
            <div class="tech-chips-row">
              <span class="spec-chip">WiFi 6E</span>
              <span class="spec-chip">CNC Alloy</span>
              <span class="spec-chip">Ultra-Fast</span>
            </div>
            <div class="tech-stock-bar">
              <span>● EN LÍNEA: ${product.stock} UNIDADES</span>
            </div>
            <div class="product-price-row">
              <div class="price-box">
                <span class="price-main">$${Number(product.price).toFixed(2)}</span>
                ${product.compareAtPrice ? `<span class="price-compare">$${Number(product.compareAtPrice).toFixed(2)}</span>` : ""}
              </div>
              <button 
                class="btn-tech-buy" 
                title="Añadir al Carrito" 
                onclick="app.addToCart(${product.id}, 1)"
                ${!inStock ? 'disabled style="opacity: 0.4; cursor: not-allowed;"' : ""}
              >
                <span>⚡ Comprar</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  },

  /* ==========================================================================
     CART MANAGEMENT
     ========================================================================== */
  addToCart(productId, qty = 1) {
    const products = Storage.getProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (product.stock <= 0) {
      this.showToast("⚠️ Este producto no tiene existencias disponibles.");
      return;
    }

    const existingIndex = this.cart.findIndex((item) => item.id === productId);

    if (existingIndex > -1) {
      const newQty = this.cart[existingIndex].qty + qty;
      if (newQty > product.stock) {
        this.showToast(`⚠️ Has alcanzado el límite de existencias (${product.stock}).`);
        return;
      }
      this.cart[existingIndex].qty = newQty;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        stock: product.stock,
        qty: qty
      });
    }

    Storage.saveCart(this.cart);
    this.renderCart();
    this.showToast(`✅ "${product.name.slice(0, 24)}..." añadido al carrito`);
  },

  updateCartQty(productId, delta) {
    const item = this.cart.find((i) => i.id === productId);
    if (!item) return;

    const newQty = item.qty + delta;
    if (newQty <= 0) {
      this.removeCartItem(productId);
      return;
    }
    if (newQty > item.stock) {
      this.showToast(`⚠️ Stock máximo alcanzado (${item.stock} unidades).`);
      return;
    }

    item.qty = newQty;
    Storage.saveCart(this.cart);
    this.renderCart();
  },

  removeCartItem(productId) {
    this.cart = this.cart.filter((i) => i.id !== productId);
    Storage.saveCart(this.cart);
    this.renderCart();
    this.showToast("🗑️ Producto retirado del carrito.");
  },

  renderCart() {
    // 1. Badge counters
    const totalQty = this.cart.reduce((sum, item) => sum + item.qty, 0);
    const cartCountBadge = document.getElementById("cartCountBadge");
    const cartDrawerCount = document.getElementById("cartDrawerCount");
    if (cartCountBadge) cartCountBadge.textContent = totalQty;
    if (cartDrawerCount) cartDrawerCount.textContent = `${totalQty} item${totalQty === 1 ? "" : "s"}`;

    // 2. Totals calculations
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const freeShippingThreshold = 100.00;
    const isFreeShipping = subtotal >= freeShippingThreshold && subtotal > 0;
    const shipping = subtotal === 0 ? 0 : (isFreeShipping ? 0 : 12.00);
    const total = subtotal + shipping;

    // Free shipping progress meter
    const shippingMeterLabel = document.getElementById("shippingMeterLabel");
    const shippingMeterDiff = document.getElementById("shippingMeterDiff");
    const shippingProgressFill = document.getElementById("shippingProgressFill");

    if (shippingProgressFill) {
      const percentage = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
      shippingProgressFill.style.width = `${percentage}%`;

      if (isFreeShipping) {
        if (shippingMeterLabel) shippingMeterLabel.textContent = "🎉 ¡Felicidades! Tienes Envío Gratis";
        if (shippingMeterDiff) {
          shippingMeterDiff.textContent = "Ahorras $12.00";
          shippingMeterDiff.style.color = "var(--emerald)";
        }
      } else {
        const remaining = freeShippingThreshold - subtotal;
        if (shippingMeterLabel) shippingMeterLabel.textContent = "Envío Gratis desde $100.00";
        if (shippingMeterDiff) {
          shippingMeterDiff.textContent = `Faltan $${remaining.toFixed(2)}`;
          shippingMeterDiff.style.color = "var(--primary)";
        }
      }
    }

    // Texts
    const cartSubtotalText = document.getElementById("cartSubtotalText");
    const cartShippingText = document.getElementById("cartShippingText");
    const cartTotalText = document.getElementById("cartTotalText");
    const checkoutTotalAmount = document.getElementById("checkoutTotalAmount");

    if (cartSubtotalText) cartSubtotalText.textContent = `$${subtotal.toFixed(2)}`;
    if (cartShippingText) cartShippingText.textContent = isFreeShipping ? "¡GRATIS!" : (subtotal === 0 ? "$0.00" : `$${shipping.toFixed(2)}`);
    if (cartTotalText) cartTotalText.textContent = `$${total.toFixed(2)}`;
    if (checkoutTotalAmount) checkoutTotalAmount.textContent = `$${total.toFixed(2)}`;

    // 3. Render Items
    const container = document.getElementById("cartItemsContainer");
    if (!container) return;

    if (this.cart.length === 0) {
      container.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon">🛒</div>
          <h4 style="color: var(--slate-800); font-size: 1.1rem; font-weight: 700; margin-bottom: 4px;">Tu carrito está vacío</h4>
          <p style="font-size: 0.85rem; color: var(--slate-500);">Agrega productos del catálogo para continuar con tu compra.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.cart.map((item) => `
      <div class="cart-item-row">
        <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
        <div class="cart-item-details">
          <h4 class="cart-item-name">${item.name}</h4>
          <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
        </div>
        <div class="cart-qty-ctrl">
          <button class="btn-qty" onclick="app.updateCartQty(${item.id}, -1)">-</button>
          <span class="qty-number">${item.qty}</span>
          <button class="btn-qty" onclick="app.updateCartQty(${item.id}, 1)">+</button>
        </div>
        <button class="btn-remove-item" title="Eliminar" onclick="app.removeCartItem(${item.id})">🗑️</button>
      </div>
    `).join("");
  },

  openCart() {
    document.getElementById("cartOverlay")?.classList.add("open");
  },

  closeCart() {
    document.getElementById("cartOverlay")?.classList.remove("open");
  },

  /* ==========================================================================
     QUICK VIEW MODAL
     ========================================================================== */
  openQuickView(productId) {
    const products = Storage.getProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const modal = document.getElementById("quickViewModal");
    const content = document.getElementById("quickViewContent");
    if (!modal || !content) return;

    const specsRows = Object.entries(product.specs || {}).map(([key, val]) => `
      <tr>
        <td>${key}</td>
        <td><strong>${val}</strong></td>
      </tr>
    `).join("");

    content.innerHTML = `
      <div>
        <img src="${product.image}" alt="${product.name}" class="quick-view-img">
        <div style="margin-top: 14px; display: flex; gap: 8px; justify-content: center;">
          <span class="badge-status active">✓ Garantía Oficial</span>
          <span class="badge-status" style="background: #f1f5f9; color: #475569;">SKU: ${product.sku}</span>
        </div>
      </div>

      <div style="display: flex; flex-direction: column;">
        <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--primary); margin-bottom: 4px;">
          ${product.categoryLabel || "Producto"}
        </span>
        <h2 style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 900; line-height: 1.25; margin-bottom: 12px;">
          ${product.name}
        </h2>
        
        <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 16px;">
          <span style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 900; color: var(--slate-900);">
            $${Number(product.price).toFixed(2)}
          </span>
          ${product.compareAtPrice ? `<span style="font-size: 1rem; color: var(--slate-400); text-decoration: line-through;">$${Number(product.compareAtPrice).toFixed(2)}</span>` : ""}
          <span class="stock-indicator in-stock" style="margin-left: auto;">
            <span class="dot-indicator"></span>
            <span>${product.stock} disponibles</span>
          </span>
        </div>

        <p style="font-size: 0.88rem; color: var(--slate-600); line-height: 1.6; margin-bottom: 16px;">
          ${product.description}
        </p>

        <h4 style="font-size: 0.82rem; font-weight: 800; text-transform: uppercase; color: var(--slate-500); margin-bottom: 6px;">
          Ficha Técnica & Detalles
        </h4>
        <table class="specs-table">
          <tbody>
            ${specsRows || '<tr><td colspan="2">Consulte disponibilidad y garantías adicionales.</td></tr>'}
          </tbody>
        </table>

        <div style="margin-top: auto; padding-top: 16px; display: flex; gap: 12px;">
          <button 
            class="btn-primary-action" 
            style="flex: 1; justify-content: center; padding: 14px; font-size: 0.95rem;"
            onclick="app.addToCart(${product.id}, 1); app.closeQuickView(); app.openCart();"
            ${product.stock <= 0 ? "disabled" : ""}
          >
            🛒 Añadir al Carrito
          </button>
        </div>
      </div>
    `;

    modal.classList.add("open");
  },

  closeQuickView() {
    document.getElementById("quickViewModal")?.classList.remove("open");
  },

  /* ==========================================================================
     CHECKOUT FLOW
     ========================================================================== */
  openCheckout() {
    if (this.currentUser) {
      const custName = document.getElementById("custName");
      const custEmail = document.getElementById("custEmail");
      const custPhone = document.getElementById("custPhone");
      const custAddress = document.getElementById("custAddress");

      if (custName && !custName.value) custName.value = this.currentUser.name || "";
      if (custEmail && !custEmail.value) custEmail.value = this.currentUser.email || "";
      if (custPhone && !custPhone.value) custPhone.value = this.currentUser.phone || "";
      if (custAddress && !custAddress.value) custAddress.value = this.currentUser.address || "";
    }
    document.getElementById("checkoutModal")?.classList.add("open");
  },

  closeCheckout() {
    document.getElementById("checkoutModal")?.classList.remove("open");
  },

  handleCheckout(e) {
    e.preventDefault();

    if (this.cart.length === 0) return;

    const name = document.getElementById("custName")?.value.trim();
    const phone = document.getElementById("custPhone")?.value.trim();
    const email = document.getElementById("custEmail")?.value.trim();
    const address = document.getElementById("custAddress")?.value.trim();

    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const shipping = subtotal >= 100 ? 0 : 12.00;
    const total = subtotal + shipping;

    // Generate unique order ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `PED-${randomNum}`;

    const config = Storage.getStoreConfig();

    const newOrder = {
      id: orderId,
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      customer_address: address,
      store_name: config.name || "Mi Tienda Oficial",
      total: Number(total.toFixed(2)),
      status: "Pendiente",
      payment_method: this.selectedPaymentMethod,
      items: this.cart.map((item) => ({
        name: item.name,
        qty: item.qty,
        price: item.price
      }))
    };

    // Save order
    const existingOrders = Storage.getOrders();
    existingOrders.unshift(newOrder);
    Storage.saveOrders(existingOrders);

    // Deduct stock in products
    const products = Storage.getProducts();
    this.cart.forEach((cartItem) => {
      const prod = products.find((p) => p.id === cartItem.id);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - cartItem.qty);
      }
    });
    Storage.saveProducts(products);

    // Clear cart
    this.cart = [];
    Storage.saveCart(this.cart);
    this.renderCart();
    this.renderProducts();

    // Close checkout and show receipt modal
    this.closeCheckout();
    document.getElementById("checkoutForm")?.reset();

    const successOrderId = document.getElementById("successOrderId");
    if (successOrderId) successOrderId.textContent = orderId;

    document.getElementById("orderSuccessModal")?.classList.add("open");
  },

  /* ==========================================================================
     TOAST SYSTEM
     ========================================================================== */
  showToast(message) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
};

// Expose app globally for iframe integration and live customizers
window.app = app;

// Listen for cross-frame branding updates from Wix customizer
window.addEventListener("message", (e) => {
  if (e.data && e.data.type === "UPDATE_BRANDING" && e.data.config) {
    app.renderStoreBranding(e.data.config);
  }
});

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  app.init();
});
