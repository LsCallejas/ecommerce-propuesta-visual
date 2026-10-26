/**
 * ADMIN.JS - LÓGICA DEL PANEL DE ADMINISTRACIÓN (TIENDA E-COMMERCE)
 * Control de vistas, métricas en tiempo real, catálogo de productos con costos y márgenes,
 * gestión de pedidos, análisis de mercancía/rentabilidad, módulo de proveedores e inversión.
 */

const admin = {
  activeView: "dashboard",
  searchProductQuery: "",
  searchOrderQuery: "",
  currentUser: null,

  init() {
    this.currentUser = Storage.getCurrentUser();
    if (!this.checkAccess()) {
      return;
    }
    this.populateSupplierSelects();
    this.bindEvents();
    this.renderAll();
  },

  checkAccess() {
    this.currentUser = Storage.getCurrentUser();
    const gateModal = document.getElementById("adminLoginGateModal");
    if (!this.currentUser || this.currentUser.role !== "admin") {
      if (gateModal) {
        gateModal.style.display = "flex";
        gateModal.classList.add("open");
      }
      return false;
    }
    if (gateModal) {
      gateModal.style.display = "none";
      gateModal.classList.remove("open");
    }
    const nameElem = document.getElementById("adminSidebarName");
    if (nameElem && this.currentUser) nameElem.textContent = this.currentUser.name;
    return true;
  },

  handleGateLogin(e) {
    e.preventDefault();
    const emailInput = document.getElementById("gateEmail");
    const passInput = document.getElementById("gatePassword");
    const alertElem = document.getElementById("adminGateAlert");

    const email = emailInput ? emailInput.value : "";
    const pass = passInput ? passInput.value : "";

    const res = Storage.login(email, pass);
    if (res.success && res.user.role === "admin") {
      this.currentUser = res.user;
      const gateModal = document.getElementById("adminLoginGateModal");
      if (gateModal) {
        gateModal.style.display = "none";
        gateModal.classList.remove("open");
      }
      const nameElem = document.getElementById("adminSidebarName");
      if (nameElem) nameElem.textContent = this.currentUser.name;
      this.populateSupplierSelects();
      this.bindEvents();
      this.renderAll();
      this.showToast(`¡Bienvenido al Panel, ${res.user.name}!`);
    } else {
      if (alertElem) {
        alertElem.style.display = "block";
        alertElem.textContent = res.message ? res.message : "Acceso denegado: solo cuentas de Administrador autorizadas.";
      }
    }
  },

  logout() {
    Storage.logout();
    this.currentUser = null;
    window.location.href = "index.html";
  },

  bindEvents() {
    // Navigation items click
    document.querySelectorAll(".admin-nav-item").forEach((item) => {
      item.addEventListener("click", () => {
        const view = item.getAttribute("data-view");
        this.switchView(view);
      });
    });

    // Product search
    const prodSearch = document.getElementById("adminProdSearch");
    if (prodSearch) {
      prodSearch.addEventListener("input", (e) => {
        this.searchProductQuery = e.target.value.trim().toLowerCase();
        this.renderProductsTable();
      });
    }

    // Order search
    const orderSearch = document.getElementById("adminOrderSearch");
    if (orderSearch) {
      orderSearch.addEventListener("input", (e) => {
        this.searchOrderQuery = e.target.value.trim().toLowerCase();
        this.renderOrdersTable();
      });
    }

    // Modal Product events
    const closeProdModalBtn = document.getElementById("closeProdModalBtn");
    const productModal = document.getElementById("productModal");
    if (closeProdModalBtn) closeProdModalBtn.addEventListener("click", () => this.closeProductModal());
    if (productModal) {
      productModal.addEventListener("click", (e) => {
        if (e.target === productModal) this.closeProductModal();
      });
    }

    // Live margin calculator in product modal
    const costInput = document.getElementById("prodFormCostPrice");
    const priceInput = document.getElementById("prodFormPrice");
    if (costInput && priceInput) {
      costInput.addEventListener("input", () => this.calculateModalProfitability());
      priceInput.addEventListener("input", () => this.calculateModalProfitability());
    }

    // Product form submit
    const prodForm = document.getElementById("productForm");
    if (prodForm) {
      prodForm.addEventListener("submit", (e) => this.handleSaveProduct(e));
    }

    // Modal Purchase events
    const closePurchaseModalBtn = document.getElementById("closePurchaseModalBtn");
    const purchaseModal = document.getElementById("purchaseModal");
    if (closePurchaseModalBtn) closePurchaseModalBtn.addEventListener("click", () => this.closePurchaseModal());
    if (purchaseModal) {
      purchaseModal.addEventListener("click", (e) => {
        if (e.target === purchaseModal) this.closePurchaseModal();
      });
    }

    const purchaseForm = document.getElementById("purchaseForm");
    if (purchaseForm) {
      purchaseForm.addEventListener("submit", (e) => this.handleSavePurchase(e));
    }

    // Modal Supplier events
    const closeSupplierModalBtn = document.getElementById("closeSupplierModalBtn");
    const supplierModal = document.getElementById("supplierModal");
    if (closeSupplierModalBtn) closeSupplierModalBtn.addEventListener("click", () => this.closeSupplierModal());
    if (supplierModal) {
      supplierModal.addEventListener("click", (e) => {
        if (e.target === supplierModal) this.closeSupplierModal();
      });
    }

    const supplierForm = document.getElementById("supplierForm");
    if (supplierForm) {
      supplierForm.addEventListener("submit", (e) => this.handleSaveSupplier(e));
    }

    // Wix-Style Store Customizer: Color picker & Hex text sync
    const colorPicker = document.getElementById("settingsStoreColorPicker");
    const colorText = document.getElementById("settingsStoreColorText");

    if (colorPicker && colorText) {
      colorPicker.addEventListener("input", (e) => {
        colorText.value = e.target.value;
        this.syncWixPreview();
      });
      colorText.addEventListener("input", (e) => {
        colorPicker.value = e.target.value;
        this.syncWixPreview();
      });
    }

    // Real-time live sync for all Wix Inspector inputs
    const wixInputsToSync = [
      "settingsStoreName",
      "settingsStoreTagline",
      "settingsAnnouncementText",
      "settingsHeroTag",
      "settingsHeroTitle",
      "settingsHeroDesc",
      "settingsHeroCtaText",
      "settingsStorePhone",
      "settingsStoreEmail",
      "settingsStoreAddress"
    ];

    wixInputsToSync.forEach((id) => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener("input", () => this.syncWixPreview());
      }
    });

    // Sync when iframe finishes loading
    const wixIframe = document.getElementById("wixStorePreviewIframe");
    if (wixIframe) {
      wixIframe.addEventListener("load", () => {
        this.syncWixPreview();
      });
    }
  },

  switchView(viewName) {
    if (viewName === "plantillas") {
      this.activeView = "plantillas";
      document.querySelectorAll(".admin-nav-item").forEach((item) => {
        item.classList.toggle("active", item.getAttribute("data-view") === "plantillas");
      });
      const panels = {
        dashboard: document.getElementById("viewDashboard"),
        productos: document.getElementById("viewProductos"),
        ordenes: document.getElementById("viewOrdenes"),
        inventario: document.getElementById("viewInventario"),
        proveedores: document.getElementById("viewProveedores"),
        personalizar: document.getElementById("viewPersonalizar"),
        auditoria: document.getElementById("viewAuditoria")
      };
      Object.keys(panels).forEach((key) => {
        if (panels[key]) panels[key].style.display = key === "personalizar" ? "block" : "none";
      });
      this.switchCustomizerTab("templates");
      return;
    }

    this.activeView = viewName;

    // Update active class on sidebar items
    document.querySelectorAll(".admin-nav-item").forEach((item) => {
      item.classList.toggle("active", item.getAttribute("data-view") === viewName);
    });

    // Hide all view panels and show target panel
    const panels = {
      dashboard: document.getElementById("viewDashboard"),
      productos: document.getElementById("viewProductos"),
      ordenes: document.getElementById("viewOrdenes"),
      inventario: document.getElementById("viewInventario"),
      proveedores: document.getElementById("viewProveedores"),
      personalizar: document.getElementById("viewPersonalizar"),
      auditoria: document.getElementById("viewAuditoria")
    };

    Object.keys(panels).forEach((key) => {
      if (panels[key]) panels[key].style.display = key === viewName ? "block" : "none";
    });

    // Render corresponding view
    if (viewName === "dashboard") this.renderDashboard();
    if (viewName === "productos") this.renderProductsTable();
    if (viewName === "ordenes") this.renderOrdersTable();
    if (viewName === "inventario") this.renderInventoryTable();
    if (viewName === "proveedores") this.renderSuppliersAndPurchases();
    if (viewName === "personalizar") this.loadStoreSettingsToForm();
    if (viewName === "auditoria") this.renderAuditoriaView();
  },

  renderAuditoriaView() {
    try {
      let totalChars = 0;
      for (let x in localStorage) {
        if (localStorage.hasOwnProperty(x)) {
          totalChars += (localStorage[x].length + x.length) * 2;
        }
      }
      const kb = (totalChars / 1024).toFixed(1);
      const sizeElem = document.getElementById("auditStorageSize");
      if (sizeElem) sizeElem.textContent = `${kb} KB`;
    } catch (e) {}
  },

  handleImportDatabase(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = Storage.importDatabaseJson(event.target.result);
      if (res.success) {
        this.showToast("✅ Base de datos restaurada correctamente desde el archivo JSON.");
        setTimeout(() => window.location.reload(), 800);
      } else {
        alert("Error al importar respaldo: " + res.error);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  },

  confirmFactoryReset() {
    if (confirm("⚠️ ¿Estás seguro de que deseas restablecer los datos de fábrica? Se reiniciarán todos los productos, proveedores y órdenes a la configuración de demostración limpia.")) {
      Storage.resetToFactoryDefaults();
      this.showToast("🔄 Sistema restablecido a los datos de fábrica.");
      setTimeout(() => window.location.reload(), 800);
    }
  },

  renderAll() {
    this.updateHeaderBrand();
    this.updateSidebarBadges();
    this.renderDashboard();
    this.renderProductsTable();
    this.renderOrdersTable();
    this.renderInventoryTable();
    this.renderSuppliersAndPurchases();
    this.loadStoreSettingsToForm();
  },

  updateHeaderBrand() {
    const config = Storage.getStoreConfig();
    const pill = document.getElementById("adminStoreHeaderName");
    if (pill) {
      pill.textContent = `${config.logo_icon || "🛍️"} ${config.name || "Mi Tienda Oficial"}`;
    }
    const sideBrand = document.getElementById("sideBrandName");
    if (sideBrand && config.name) {
      sideBrand.textContent = config.name;
    }
  },

  updateSidebarBadges() {
    const products = Storage.getProducts();
    const orders = Storage.getOrders();
    const suppliers = Storage.getSuppliers();

    const sideProdCount = document.getElementById("sideProdCount");
    const sideOrdersCount = document.getElementById("sideOrdersCount");
    const sideSuppliersCount = document.getElementById("sideSuppliersCount");

    if (sideProdCount) sideProdCount.textContent = products.length;
    if (sideOrdersCount) sideOrdersCount.textContent = orders.length;
    if (sideSuppliersCount) sideSuppliersCount.textContent = suppliers.length;
  },

  /* ==========================================================================
     DASHBOARD VIEW
     ========================================================================== */
  renderDashboard() {
    this.updateHeaderBrand();
    const products = Storage.getProducts();
    const orders = Storage.getOrders();

    // 1. Sales Calculation
    const ordersRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const baseRevenue = 25618.31;
    const totalSales = baseRevenue + ordersRevenue;

    // 2. Stock Cost & Profit Calculations
    const totalStockUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const totalStockCost = products.reduce((sum, p) => sum + ((p.costPrice || (p.price * 0.45)) * (p.stock || 0)), 0);
    const totalStockRevenue = products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);
    const totalStockProfit = totalStockRevenue - totalStockCost;
    const avgMargin = totalStockRevenue > 0 ? ((totalStockProfit / totalStockRevenue) * 100).toFixed(1) : "54.2";

    const kpiSales = document.getElementById("kpiSales");
    const kpiOrders = document.getElementById("kpiOrders");
    const kpiStockCost = document.getElementById("kpiStockCost");
    const kpiStockProfit = document.getElementById("kpiStockProfit");
    const kpiStockUnitsText = document.getElementById("kpiStockUnitsText");
    const kpiAvgMarginText = document.getElementById("kpiAvgMarginText");

    if (kpiSales) kpiSales.textContent = `$${totalSales.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (kpiOrders) kpiOrders.textContent = (orders.length + 142).toString();
    if (kpiStockCost) kpiStockCost.textContent = `$${totalStockCost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (kpiStockProfit) kpiStockProfit.textContent = `$${totalStockProfit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (kpiStockUnitsText) kpiStockUnitsText.textContent = `${totalStockUnits} unidades en stock`;
    if (kpiAvgMarginText) kpiAvgMarginText.textContent = `↑ ${avgMargin}% margen prom`;

    // Render Recent Orders Mini Table
    const recentTable = document.getElementById("recentOrdersTableBody");
    if (recentTable) {
      const recent = orders.slice(0, 5);
      recentTable.innerHTML = recent.map((o) => {
        const itemsSummary = o.items && o.items.length
          ? o.items.map((it) => `${it.qty}x ${it.name}`).join(", ")
          : "Artículos del Catálogo";

        return `
          <tr>
            <td><strong style="color: var(--admin-primary); font-family: monospace;">${o.id}</strong></td>
            <td style="font-size: 0.8rem; color: var(--admin-text-muted);">${o.date}</td>
            <td><strong>${o.customer_name}</strong></td>
            <td><span style="font-size: 0.8rem; color: var(--admin-text-muted); display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;" title="${itemsSummary}">${itemsSummary}</span></td>
            <td><strong style="font-family: var(--font-display);">$${Number(o.total).toFixed(2)}</strong></td>
            <td>
              <span class="badge-status ${o.status.toLowerCase().replace(/\s+/g, "")}">
                ${o.status}
              </span>
            </td>
          </tr>
        `;
      }).join("");
    }
  },

  /* ==========================================================================
     PRODUCTS VIEW
     ========================================================================== */
  renderProductsTable() {
    const tbody = document.getElementById("adminProductsTableBody");
    const totalText = document.getElementById("adminProdTotalText");
    if (!tbody) return;

    let products = Storage.getProducts();

    if (this.searchProductQuery) {
      products = products.filter((p) =>
        p.name.toLowerCase().includes(this.searchProductQuery) ||
        (p.brand && p.brand.toLowerCase().includes(this.searchProductQuery)) ||
        (p.categoryLabel && p.categoryLabel.toLowerCase().includes(this.searchProductQuery)) ||
        (p.sku && p.sku.toLowerCase().includes(this.searchProductQuery))
      );
    }

    if (totalText) totalText.textContent = `${products.length}`;

    tbody.innerHTML = products.map((p) => {
      const cost = p.costPrice || (p.price * 0.45);
      const profitUnit = p.price - cost;
      const marginPct = ((profitUnit / p.price) * 100).toFixed(1);
      const isZero = p.stock === 0;
      const isCritical = p.stock > 0 && p.stock <= 20;
      const statusClass = isZero ? "agotado" : (isCritical ? "low-stock" : "active");

      return `
        <tr>
          <td>
            <div class="product-cell">
              <img src="${p.image}" alt="${p.name}" class="product-thumb-sm" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'">
              <div class="product-cell-name">
                <strong>${p.name}</strong>
                <span class="product-cell-sub">${p.brand || "Oficial"}</span>
              </div>
            </div>
          </td>
          <td><code>${p.sku}</code></td>
          <td><span style="font-size: 0.8rem; text-transform: capitalize; font-weight: 600; color: var(--admin-primary);">${p.categoryLabel}</span></td>
          <td><span style="color: var(--admin-text-muted); font-weight: 600;">$${cost.toFixed(2)}</span></td>
          <td><strong style="font-family: var(--font-display); font-size: 1rem;">$${Number(p.price).toFixed(2)}</strong></td>
          <td>
            <div style="color: var(--admin-emerald); font-weight: 700; font-size: 0.9rem;">
              +$${profitUnit.toFixed(2)}
              <span style="font-size: 0.72rem; color: var(--admin-text-muted); font-weight: normal; display: block;">(${marginPct}%)</span>
            </div>
          </td>
          <td>
            <span class="badge-status ${statusClass}">${p.stock} unids</span>
          </td>
          <td>
            <span style="font-size: 0.78rem; font-weight: 600; color: #475569; background: #f1f5f9; padding: 3px 8px; border-radius: 6px; white-space: nowrap;">
              ${p.supplierName ? p.supplierName.split(' ')[0] + ' ' + (p.supplierName.split(' ')[1] || '') : 'Proveedor Directo'}
            </span>
          </td>
          <td style="text-align: right;">
            <div style="display: inline-flex; gap: 6px;">
              <button class="btn-action-icon" title="Editar Producto" onclick="admin.openEditProductModal(${p.id})">✏️</button>
              <button class="btn-action-icon delete" title="Eliminar Producto" onclick="admin.deleteProduct(${p.id})">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  },

  /* ==========================================================================
     ORDERS VIEW (INTERACTIVE STATUS CHANGE)
     ========================================================================== */
  renderOrdersTable() {
    const tbody = document.getElementById("adminOrdersTableBody");
    if (!tbody) return;

    let orders = Storage.getOrders();

    if (this.searchOrderQuery) {
      orders = orders.filter((o) =>
        o.id.toLowerCase().includes(this.searchOrderQuery) ||
        o.customer_name.toLowerCase().includes(this.searchOrderQuery) ||
        (o.customer_email && o.customer_email.toLowerCase().includes(this.searchOrderQuery))
      );
    }

    tbody.innerHTML = orders.map((o) => `
      <tr>
        <td><strong style="color: var(--admin-primary); font-family: monospace; font-size: 0.95rem;">${o.id}</strong></td>
        <td style="font-size: 0.8rem; color: var(--admin-text-muted);">${o.date}</td>
        <td>
          <strong>${o.customer_name}</strong>
          ${o.customer_email ? `<div style="font-size: 0.75rem; color: var(--admin-text-muted);">${o.customer_email}</div>` : ""}
        </td>
        <td style="font-size: 0.8rem;">
          <div>${o.customer_phone || "N/A"}</div>
          <span style="font-size: 0.72rem; color: var(--admin-text-muted);">${o.customer_address || "Envío a domicilio"}</span>
        </td>
        <td><strong style="font-family: var(--font-display); font-size: 1.05rem;">$${Number(o.total).toFixed(2)}</strong></td>
        <td><span style="font-size: 0.8rem; font-weight: 600;">${o.payment_method || "Pago Móvil"}</span></td>
        <td>
          <select 
            style="padding: 4px 8px; border-radius: var(--radius-sm); border: 1px solid var(--admin-border); font-size: 0.78rem; font-weight: 700; background: white; cursor: pointer;"
            onchange="admin.updateOrderStatus('${o.id}', this.value)"
          >
            <option value="Pendiente" ${o.status === "Pendiente" ? "selected" : ""}>⏳ Pendiente</option>
            <option value="En Preparación" ${o.status === "En Preparación" ? "selected" : ""}>📦 En Preparación</option>
            <option value="Enviado" ${o.status === "Enviado" ? "selected" : ""}>🚚 Enviado</option>
            <option value="Entregado" ${o.status === "Entregado" ? "selected" : ""}>✅ Entregado</option>
          </select>
        </td>
      </tr>
    `).join("");
  },

  updateOrderStatus(orderId, newStatus) {
    Storage.updateOrderStatus(orderId, newStatus);
    this.renderOrdersTable();
    this.renderDashboard();
    this.showToast(`📑 Orden ${orderId} actualizada a "${newStatus}"`);
  },

  simulateNewOrder() {
    const products = Storage.getProducts();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const p1 = products[Math.floor(Math.random() * products.length)];
    const p2 = products[Math.floor(Math.random() * products.length)];
    const qty1 = Math.floor(Math.random() * 2) + 1;
    const qty2 = p1.id !== p2.id ? 1 : 0;

    const items = [{ name: p1.name, qty: qty1, price: p1.price }];
    if (qty2 > 0) items.push({ name: p2.name, qty: qty2, price: p2.price });
    const total = items.reduce((sum, it) => sum + (it.price * it.qty), 0);

    const customers = [
      { name: "Andrés Colmenares", email: "andres.c@gmail.com", phone: "+58 412 345 6789" },
      { name: "Lucía Paredes", email: "lucia.p@outlook.com", phone: "+58 424 555 1234" },
      { name: "Agencia BrandStudio", email: "hola@brandstudio.com", phone: "+58 414 789 0123" }
    ];
    const client = customers[Math.floor(Math.random() * customers.length)];
    const payments = ["Pago Móvil", "Transferencia Bancaria", "Tarjeta de Débito"];
    const payment = payments[Math.floor(Math.random() * payments.length)];

    const mockOrder = {
      id: `ORD-${randomNum}`,
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      customer_name: client.name,
      customer_email: client.email,
      customer_phone: client.phone,
      customer_address: "Av. Principal Comercial, Edif. Centro, Caracas",
      total: Number(total.toFixed(2)),
      status: "Pendiente",
      payment_method: payment,
      items: items
    };

    const orders = Storage.getOrders();
    orders.unshift(mockOrder);
    Storage.saveOrders(orders);

    this.renderOrdersTable();
    this.renderDashboard();
    this.updateSidebarBadges();
    this.showToast(`🎉 ¡Nuevo pedido simulado recibido: ${mockOrder.id}!`);
  },

  /* ==========================================================================
     MERCANCÍA & RENTABILIDAD VIEW (COSTOS, PRECIOS, GANANCIA)
     ========================================================================== */
  renderInventoryTable() {
    const tbody = document.getElementById("adminInventoryTableBody");
    if (!tbody) return;

    const products = Storage.getProducts();

    // Aggregations
    const totalUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const totalCost = products.reduce((sum, p) => sum + ((p.costPrice || (p.price * 0.45)) * (p.stock || 0)), 0);
    const totalRevenue = products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);
    const totalProfit = totalRevenue - totalCost;
    const avgMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : "0.0";

    // Update KPI Elements
    const invTotalUnits = document.getElementById("invTotalUnits");
    const invTotalCost = document.getElementById("invTotalCost");
    const invTotalRevenue = document.getElementById("invTotalRevenue");
    const invTotalProfit = document.getElementById("invTotalProfit");
    const invProfitMarginTrend = document.getElementById("invProfitMarginTrend");

    if (invTotalUnits) invTotalUnits.textContent = `${totalUnits} unids`;
    if (invTotalCost) invTotalCost.textContent = `$${totalCost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (invTotalRevenue) invTotalRevenue.textContent = `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (invTotalProfit) invTotalProfit.textContent = `$${totalProfit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (invProfitMarginTrend) invProfitMarginTrend.innerHTML = `<span>Margen prom: <strong>${avgMargin}%</strong></span>`;

    // Render Table Rows
    tbody.innerHTML = products.map((p) => {
      const cost = p.costPrice || (p.price * 0.45);
      const profitUnit = p.price - cost;
      const marginPct = ((profitUnit / p.price) * 100).toFixed(1);
      const totalStockCost = cost * p.stock;
      const totalStockProfit = profitUnit * p.stock;
      const isCritical = p.stock < 20;
      const isZero = p.stock === 0;

      return `
        <tr>
          <td>
            <div class="product-cell">
              <img src="${p.image}" alt="${p.name}" class="product-thumb-sm" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'">
              <div class="product-cell-name">
                <strong>${p.name}</strong>
                <span class="product-cell-sub">SKU: ${p.sku}</span>
              </div>
            </div>
          </td>
          <td>
            <span style="font-size: 0.78rem; font-weight: 600; color: #334155;">
              ${p.supplierName || "Proveedor Aliado"}
            </span>
          </td>
          <td>
            <span class="badge-status ${isZero ? "agotado" : (isCritical ? "low-stock" : "active")}">
              ${p.stock} unids
            </span>
          </td>
          <td>
            <strong style="color: #64748b;">$${cost.toFixed(2)}</strong>
          </td>
          <td>
            <strong style="font-family: var(--font-display);">$${Number(p.price).toFixed(2)}</strong>
          </td>
          <td>
            <div style="color: var(--admin-emerald); font-weight: 800; font-family: var(--font-display);">
              +$${profitUnit.toFixed(2)}
            </div>
          </td>
          <td>
            <span style="font-size: 0.78rem; font-weight: 800; color: #166534; background: #dcfce7; padding: 2px 8px; border-radius: var(--radius-full);">
              ${marginPct}%
            </span>
          </td>
          <td>
            <strong style="color: var(--admin-text-main);">$${totalStockCost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </td>
          <td>
            <strong style="color: var(--admin-emerald); font-family: var(--font-display);">$${totalStockProfit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </td>
          <td style="text-align: right;">
            <div style="display: inline-flex; gap: 4px;">
              <button 
                class="btn-action-icon" 
                title="Restar 5 unidades" 
                onclick="admin.adjustStock(${p.id}, -5)"
              >
                -5
              </button>
              <button 
                class="btn-action-icon" 
                title="Sumar 10 unidades" 
                onclick="admin.adjustStock(${p.id}, 10)"
              >
                +10
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  },

  adjustStock(productId, delta) {
    const products = Storage.getProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    product.stock = Math.max(0, product.stock + delta);
    Storage.saveProducts(products);
    this.renderInventoryTable();
    this.renderProductsTable();
    this.renderDashboard();
    this.showToast(`📦 Stock de "${product.name.slice(0, 20)}..." actualizado a ${product.stock} unids`);
  },

  /* ==========================================================================
     PROVEEDORES & INVERSIONES VIEW
     ========================================================================== */
  renderSuppliersAndPurchases() {
    const suppliers = Storage.getSuppliers();
    const purchases = Storage.getPurchases();

    // 1. Calculations
    const totalInvestedInPurchases = purchases.reduce((sum, pu) => sum + (pu.amount || 0), 0);
    const historicalBaseInvested = 11000.00;
    const totalInvested = historicalBaseInvested + totalInvestedInPurchases;

    // ROI calculation: (Estimated sales value / total stock cost)
    const products = Storage.getProducts();
    const totalStockCost = products.reduce((sum, p) => sum + ((p.costPrice || (p.price * 0.45)) * (p.stock || 0)), 0);
    const totalStockRevenue = products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);
    const roiPct = totalStockCost > 0 ? (((totalStockRevenue - totalStockCost) / totalStockCost) * 100).toFixed(1) : "112.7";

    // 2. Update KPI Elements
    const kpiTotalInvested = document.getElementById("kpiTotalInvested");
    const kpiActiveSuppliers = document.getElementById("kpiActiveSuppliers");
    const kpiTotalPurchasesCount = document.getElementById("kpiTotalPurchasesCount");
    const kpiROI = document.getElementById("kpiROI");

    if (kpiTotalInvested) kpiTotalInvested.textContent = `$${totalInvested.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (kpiActiveSuppliers) kpiActiveSuppliers.textContent = suppliers.length.toString();
    if (kpiTotalPurchasesCount) kpiTotalPurchasesCount.textContent = (purchases.length + 6).toString();
    if (kpiROI) kpiROI.textContent = `+${roiPct}%`;

    // 3. Render Suppliers Table
    const suppliersTbody = document.getElementById("adminSuppliersTableBody");
    if (suppliersTbody) {
      suppliersTbody.innerHTML = suppliers.map((s) => `
        <tr>
          <td>
            <div>
              <strong style="color: var(--admin-text-main); font-size: 0.95rem;">${s.name}</strong>
              <div style="font-size: 0.78rem; color: var(--admin-text-muted);">Contacto: ${s.contact_person}</div>
            </div>
          </td>
          <td>
            <div style="font-size: 0.85rem; font-weight: 600;">${s.phone}</div>
            <div style="font-size: 0.75rem; color: var(--admin-primary);">${s.email}</div>
          </td>
          <td>
            <span style="font-size: 0.8rem; font-weight: 700; color: #475569; background: #f1f5f9; padding: 3px 8px; border-radius: 6px;">
              ${s.category}
            </span>
          </td>
          <td>
            <span style="font-size: 0.8rem; color: var(--admin-text-muted); font-weight: 600;">${s.terms || "Contado"}</span>
          </td>
          <td>
            <strong style="font-family: var(--font-display); font-size: 0.95rem; color: var(--admin-primary);">
              $${Number(s.total_invested || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </strong>
          </td>
          <td>
            <span style="font-size: 0.8rem; font-weight: 700; color: #f59e0b;">${s.rating || "4.8 ★"}</span>
          </td>
          <td style="text-align: right;">
            <button 
              class="btn-table-action" 
              onclick="admin.openNewPurchaseModal('${s.id}')"
              title="Registrar Compra a este proveedor"
            >
              + Comprar Lote
            </button>
          </td>
        </tr>
      `).join("");
    }

    // 4. Render Purchases Table
    const purchasesTbody = document.getElementById("adminPurchasesTableBody");
    if (purchasesTbody) {
      purchasesTbody.innerHTML = purchases.map((pu) => `
        <tr>
          <td>
            <strong style="color: var(--admin-primary); font-family: monospace;">${pu.id}</strong>
            ${pu.receipt ? `<div style="font-size: 0.72rem; color: var(--admin-text-muted);">${pu.receipt}</div>` : ""}
          </td>
          <td style="font-size: 0.8rem; color: var(--admin-text-muted);">${pu.date}</td>
          <td><strong>${pu.supplier_name}</strong></td>
          <td>
            <span style="font-size: 0.85rem; color: var(--admin-text-main); font-weight: 500;">
              ${pu.description}
            </span>
          </td>
          <td>
            <span class="badge-status active">${pu.units} unids</span>
          </td>
          <td>
            <strong style="font-family: var(--font-display); font-size: 1rem; color: #b45309;">
              $${Number(pu.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </strong>
          </td>
          <td>
            <span class="badge-status active">✓ ${pu.status || "Recibido & Pagado"}</span>
          </td>
        </tr>
      `).join("");
    }
  },

  populateSupplierSelects() {
    const suppliers = Storage.getSuppliers();
    const prodSupplierSelect = document.getElementById("prodFormSupplier");
    const purchaseSupplierSelect = document.getElementById("purchaseFormSupplier");

    const optionsHtml = suppliers.map((s) => `<option value="${s.id}">${s.name} (${s.category})</option>`).join("");

    if (prodSupplierSelect) prodSupplierSelect.innerHTML = optionsHtml;
    if (purchaseSupplierSelect) purchaseSupplierSelect.innerHTML = optionsHtml;
  },

  /* ==========================================================================
     PURCHASE / INVERSIÓN MODAL HANDLER
     ========================================================================== */
  openNewPurchaseModal(preselectedSupplierId = null) {
    this.populateSupplierSelects();
    const select = document.getElementById("purchaseFormSupplier");
    if (select && preselectedSupplierId) {
      select.value = preselectedSupplierId;
    }
    document.getElementById("purchaseForm")?.reset();
    const modal = document.getElementById("purchaseModal");
    if (modal) {
      modal.style.display = "flex";
      modal.classList.add("open");
    }
  },

  closePurchaseModal() {
    const modal = document.getElementById("purchaseModal");
    if (modal) {
      modal.style.display = "none";
      modal.classList.remove("open");
    }
  },

  handleSavePurchase(e) {
    e.preventDefault();
    const supplierId = document.getElementById("purchaseFormSupplier")?.value;
    const desc = document.getElementById("purchaseFormDesc")?.value.trim();
    const amount = parseFloat(document.getElementById("purchaseFormAmount")?.value) || 0;
    const units = parseInt(document.getElementById("purchaseFormUnits")?.value) || 0;
    const receipt = document.getElementById("purchaseFormReceipt")?.value.trim() || `FAC-${Math.floor(1000 + Math.random() * 9000)}`;
    const status = document.getElementById("purchaseFormStatus")?.value || "Recibido & Pagado";

    const suppliers = Storage.getSuppliers();
    const supplier = suppliers.find((s) => s.id === supplierId) || suppliers[0];

    const randomId = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newPurchase = {
      id: randomId,
      date: new Date().toISOString().substring(0, 10),
      supplier_id: supplier.id,
      supplier_name: supplier.name,
      description: desc,
      units: units,
      amount: amount,
      status: status,
      receipt: receipt
    };

    // 1. Save purchase
    const purchases = Storage.getPurchases();
    purchases.unshift(newPurchase);
    Storage.savePurchases(purchases);

    // 2. Accumulate in supplier total invested
    if (supplier) {
      supplier.total_invested = (supplier.total_invested || 0) + amount;
      Storage.saveSuppliers(suppliers);
    }

    this.closePurchaseModal();
    this.renderSuppliersAndPurchases();
    this.renderDashboard();
    this.showToast(`💼 ¡Inversión de $${amount.toFixed(2)} registrada exitosamente con "${supplier.name}"!`);
  },

  /* ==========================================================================
     SUPPLIER MODAL HANDLER
     ========================================================================== */
  openNewSupplierModal() {
    document.getElementById("supplierForm")?.reset();
    const modal = document.getElementById("supplierModal");
    if (modal) {
      modal.style.display = "flex";
      modal.classList.add("open");
    }
  },

  closeSupplierModal() {
    const modal = document.getElementById("supplierModal");
    if (modal) {
      modal.style.display = "none";
      modal.classList.remove("open");
    }
  },

  handleSaveSupplier(e) {
    e.preventDefault();
    const name = document.getElementById("supplierFormName")?.value.trim();
    const contact = document.getElementById("supplierFormContact")?.value.trim();
    const category = document.getElementById("supplierFormCategory")?.value.trim();
    const phone = document.getElementById("supplierFormPhone")?.value.trim();
    const email = document.getElementById("supplierFormEmail")?.value.trim() || "";
    const terms = document.getElementById("supplierFormTerms")?.value.trim() || "Contado";

    const suppliers = Storage.getSuppliers();
    const newId = `sup-${suppliers.length + 1}`;

    const newSupplier = {
      id: newId,
      name: name,
      contact_person: contact,
      phone: phone,
      email: email,
      category: category,
      terms: terms,
      rating: "5.0 ★ (Nuevo Aliado)",
      total_invested: 0,
      active_products: 0,
      status: "Activo"
    };

    suppliers.push(newSupplier);
    Storage.saveSuppliers(suppliers);

    this.populateSupplierSelects();
    this.closeSupplierModal();
    this.renderSuppliersAndPurchases();
    this.updateSidebarBadges();
    this.showToast(`🏢 Proveedor "${name}" agregado correctamente.`);
  },

  /* ==========================================================================
     WIX-STYLE SITE BUILDER & LIVE VISUAL CUSTOMIZER
     ========================================================================== */
  currentCustomizerDevice: "desktop",
  currentButtonStyle: "rounded",

  setCustomizerDevice(device) {
    this.currentCustomizerDevice = device;
    const btnDesktop = document.getElementById("btnDeviceDesktop");
    const btnMobile = document.getElementById("btnDeviceMobile");
    const container = document.getElementById("wixViewportContainer");
    const urlSpan = document.getElementById("wixCanvasUrl");
    const speaker = document.getElementById("mobileSpeaker");

    if (device === "mobile") {
      btnDesktop?.classList.remove("active");
      btnMobile?.classList.add("active");
      container?.classList.remove("desktop-mode");
      container?.classList.add("mobile-mode");
      if (speaker) speaker.style.display = "block";
      if (urlSpan) urlSpan.textContent = "https://m.mitienda.com/catalogo";
    } else {
      btnMobile?.classList.remove("active");
      btnDesktop?.classList.add("active");
      container?.classList.remove("mobile-mode");
      container?.classList.add("desktop-mode");
      if (speaker) speaker.style.display = "none";
      if (urlSpan) urlSpan.textContent = "https://mitienda.com/catalogo";
    }
  },

  toggleWixAccordion(accordionId) {
    const item = document.getElementById(accordionId);
    if (item) {
      item.classList.toggle("open");
    }
  },

  applyColorPreset(colorHex, btn) {
    const picker = document.getElementById("settingsStoreColorPicker");
    const text = document.getElementById("settingsStoreColorText");
    if (picker) picker.value = colorHex;
    if (text) text.value = colorHex;

    document.querySelectorAll(".palette-preset-btn").forEach((b) => b.classList.remove("active"));
    if (btn) btn.classList.add("active");

    this.syncWixPreview();
  },

  setCustomizerButtonStyle(style, btn) {
    this.currentButtonStyle = style;
    document.querySelectorAll(".wix-style-btn").forEach((b) => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    this.syncWixPreview();
  },

  selectStoreIcon(icon, btn) {
    const input = document.getElementById("settingsStoreLogoIcon");
    if (input) input.value = icon;

    document.querySelectorAll(".emoji-chip").forEach((chip) => chip.classList.remove("active"));
    if (btn) chip.classList.add("active");

    this.syncWixPreview();
  },

  refreshWixIframe() {
    const iframe = document.getElementById("wixStorePreviewIframe");
    if (iframe) {
      iframe.src = `index.html?refresh=${Date.now()}`;
      this.showToast("🔄 Vista previa recargada.");
    }
  },

  getCurrentCustomizerConfig() {
    const prevConfig = Storage.getStoreConfig() || {};
    const name = document.getElementById("settingsStoreName")?.value.trim() || prevConfig.name || "Mi Tienda Oficial";
    const tagline = document.getElementById("settingsStoreTagline")?.value.trim() || prevConfig.tagline || "Tecnología, Accesorios y Estilo de Vida";
    const icon = document.getElementById("settingsStoreLogoIcon")?.value || prevConfig.logo_icon || "🛍️";
    const color = document.getElementById("settingsStoreColorText")?.value.trim() || prevConfig.primary_color || "#2563eb";
    const phone = document.getElementById("settingsStorePhone")?.value.trim() || prevConfig.contact_phone || "+58 414 123 4567";
    const email = document.getElementById("settingsStoreEmail")?.value.trim() || prevConfig.contact_email || "contacto@mitienda.com";
    const address = document.getElementById("settingsStoreAddress")?.value.trim() || prevConfig.contact_address || "Av. Principal Comercial, Local 4";
    const announcementEnabled = document.getElementById("settingsAnnouncementEnabled")?.checked ?? true;
    const announcementText = document.getElementById("settingsAnnouncementText")?.value.trim() ?? prevConfig.announcement_text ?? "";
    const heroTag = document.getElementById("settingsHeroTag")?.value.trim() || prevConfig.hero_tag || "Colección Oficial 2026";
    const heroTitle = document.getElementById("settingsHeroTitle")?.value.trim() || prevConfig.hero_title || "Productos Exclusivos para un Estilo de Vida Moderno";
    const heroDesc = document.getElementById("settingsHeroDesc")?.value.trim() || prevConfig.hero_desc || "";
    const heroCtaText = document.getElementById("settingsHeroCtaText")?.value.trim() || prevConfig.hero_cta_text || "Explorar Catálogo";

    return {
      ...prevConfig,
      name,
      tagline,
      description: heroDesc,
      logo_icon: icon,
      primary_color: color,
      contact_phone: phone,
      contact_email: email,
      contact_address: address,
      announcement_text: announcementText,
      announcement_enabled: announcementEnabled,
      hero_tag: heroTag,
      hero_title: heroTitle,
      hero_desc: heroDesc,
      hero_cta_text: heroCtaText,
      button_style: this.currentButtonStyle || prevConfig.button_style || "rounded",
      template_id: prevConfig.template_id || Storage.getActiveTemplateId() || "moderno-tech",
      template_archetype: prevConfig.template_archetype || "moderno"
    };
  },

  syncWixPreview() {
    const config = this.getCurrentCustomizerConfig();
    const iframe = document.getElementById("wixStorePreviewIframe");
    if (!iframe) return;

    // 1. PostMessage to iframe
    try {
      iframe.contentWindow?.postMessage({ type: "UPDATE_BRANDING", config }, "*");
    } catch (e) {}

    // 2. Direct call to app on window
    try {
      if (iframe.contentWindow?.app?.renderStoreBranding) {
        iframe.contentWindow.app.renderStoreBranding(config);
      }
    } catch (e) {}

    // 3. Direct DOM & style property sync in iframe document for zero-lag instant feedback
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        if (config.primary_color) {
          doc.documentElement.style.setProperty('--primary', config.primary_color);
          doc.documentElement.style.setProperty('--primary-hover', config.primary_color);
          doc.documentElement.style.setProperty('--primary-glow', `${config.primary_color}40`);
        }
        if (config.button_style === 'pill') {
          doc.documentElement.style.setProperty('--radius-md', '9999px');
          doc.documentElement.style.setProperty('--radius-sm', '9999px');
        } else if (config.button_style === 'square') {
          doc.documentElement.style.setProperty('--radius-md', '4px');
          doc.documentElement.style.setProperty('--radius-sm', '2px');
        } else {
          doc.documentElement.style.setProperty('--radius-md', '14px');
          doc.documentElement.style.setProperty('--radius-sm', '8px');
        }

        const brandIcon = doc.getElementById("storeBrandIcon");
        const brandName = doc.getElementById("storeBrandName");
        const brandTagline = doc.getElementById("storeBrandTagline");
        if (brandIcon && config.logo_icon) brandIcon.textContent = config.logo_icon;
        if (brandName && config.name) brandName.textContent = config.name;
        if (brandTagline && config.tagline) brandTagline.textContent = config.tagline;

        const topBar = doc.querySelector('.top-bar');
        const topBarText = doc.getElementById('topBarText');
        if (topBar) topBar.style.display = config.announcement_enabled === false ? 'none' : 'flex';
        if (topBarText && config.announcement_text) topBarText.textContent = config.announcement_text;

        const tagText = doc.getElementById("heroTagText");
        const titleEl = doc.getElementById("heroTitle");
        const descEl = doc.getElementById("heroDesc");
        const ctaEl = doc.getElementById("heroPrimaryCta");

        if (tagText && config.hero_tag) tagText.textContent = config.hero_tag;
        if (descEl && config.hero_desc) descEl.textContent = config.hero_desc;
        if (ctaEl && config.hero_cta_text) ctaEl.innerHTML = `<span>${config.hero_cta_text}</span> <span>↓</span>`;

        if (titleEl && config.hero_title) {
          if (config.hero_title.includes('<')) {
            titleEl.innerHTML = config.hero_title;
          } else {
            const words = config.hero_title.trim().split(/\s+/);
            if (words.length <= 2) {
              titleEl.innerHTML = `<span class="gradient-text">${config.hero_title}</span>`;
            } else {
              const splitPoint = Math.max(1, Math.floor(words.length * 0.55));
              const firstPart = words.slice(0, splitPoint).join(' ');
              const secondPart = words.slice(splitPoint).join(' ');
              titleEl.innerHTML = `${firstPart} <br><span class="gradient-text">${secondPart}</span>`;
            }
          }
        }
      }
    } catch (e) {}
  },

  loadStoreSettingsToForm() {
    const config = Storage.getStoreConfig();

    const nameInput = document.getElementById("settingsStoreName");
    const taglineInput = document.getElementById("settingsStoreTagline");
    const picker = document.getElementById("settingsStoreColorPicker");
    const colorText = document.getElementById("settingsStoreColorText");
    const phoneInput = document.getElementById("settingsStorePhone");
    const emailInput = document.getElementById("settingsStoreEmail");
    const addrInput = document.getElementById("settingsStoreAddress");
    const iconInput = document.getElementById("settingsStoreLogoIcon");
    const annSwitch = document.getElementById("settingsAnnouncementEnabled");
    const annText = document.getElementById("settingsAnnouncementText");
    const heroTag = document.getElementById("settingsHeroTag");
    const heroTitle = document.getElementById("settingsHeroTitle");
    const heroDesc = document.getElementById("settingsHeroDesc");
    const heroCta = document.getElementById("settingsHeroCtaText");

    if (nameInput) nameInput.value = config.name || "Mi Tienda Oficial";
    if (taglineInput) taglineInput.value = config.tagline || "Tecnología, Accesorios y Estilo de Vida";
    if (picker) picker.value = config.primary_color || "#2563eb";
    if (colorText) colorText.value = config.primary_color || "#2563eb";
    if (phoneInput) phoneInput.value = config.contact_phone || "+58 414 123 4567";
    if (emailInput) emailInput.value = config.contact_email || "contacto@mitienda.com";
    if (addrInput) addrInput.value = config.contact_address || "Av. Principal Comercial, Local 4";
    if (iconInput) iconInput.value = config.logo_icon || "🛍️";
    if (annSwitch) annSwitch.checked = config.announcement_enabled !== false;
    if (annText) annText.value = config.announcement_text || "";
    if (heroTag) heroTag.value = config.hero_tag || "Colección Oficial 2026";
    if (heroTitle) heroTitle.value = config.hero_title || "Productos Exclusivos para un Estilo de Vida Moderno";
    if (heroDesc) heroDesc.value = config.hero_desc || "";
    if (heroCta) heroCta.value = config.hero_cta_text || "Explorar Catálogo";

    // Set button style
    this.currentButtonStyle = config.button_style || "rounded";
    document.querySelectorAll(".wix-style-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-style") === this.currentButtonStyle);
    });

    // Set active palette preset if matching
    document.querySelectorAll(".palette-preset-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-color").toLowerCase() === (config.primary_color || "").toLowerCase());
    });

    // Set active emoji chip
    document.querySelectorAll(".emoji-chip").forEach((chip) => {
      chip.classList.toggle("active", chip.textContent.trim() === (config.logo_icon || "🛍️"));
    });

    // Ensure desktop mode is default
    this.setCustomizerDevice(this.currentCustomizerDevice || "desktop");

    // Sync live iframe
    this.syncWixPreview();
  },

  handleSaveStoreSettingsFromWix() {
    const config = this.getCurrentCustomizerConfig();
    Storage.saveStoreConfig(config);
    this.updateHeaderBrand();
    this.syncWixPreview();

    // Visual button feedback on both top & bottom buttons
    const btnTop = document.getElementById("btnSaveWixCustomizer");
    const btnBottom = document.getElementById("btnSaveWixCustomizerBottom");

    [btnTop, btnBottom].forEach((btn) => {
      if (btn) {
        btn.classList.add("saved");
        btn.innerHTML = `<span>✅ ¡Cambios Guardados con Éxito!</span>`;
      }
    });

    this.showToast(`✅ ¡Tienda actualizada! Cambios para "${config.name}" guardados y en vivo.`);

    setTimeout(() => {
      if (btnTop) {
        btnTop.classList.remove("saved");
        btnTop.innerHTML = `<span>🚀 Guardar & Publicar</span>`;
      }
      if (btnBottom) {
        btnBottom.classList.remove("saved");
        btnBottom.innerHTML = `<span>💾 Guardar Cambios de la Tienda</span>`;
      }
    }, 2800);
  },

  resetStoreCustomizerDefaults() {
    if (!confirm("¿Deseas restablecer todos los textos, colores y estilos a los valores predeterminados?")) return;
    Storage.saveStoreConfig(INITIAL_STORE_CONFIG);
    this.loadStoreSettingsToForm();
    this.updateHeaderBrand();
    this.syncWixPreview();
    this.showToast("🔄 Configuración restablecida a los valores de fábrica.");
  },

  /* ==========================================================================
     TEMPLATES GALLERY & BLOGGER-STYLE CODE EDITOR METHODS
     ========================================================================== */
  activeCustomizerTab: "visual",

  switchCustomizerTab(tab) {
    this.activeCustomizerTab = tab;

    const btnVisual = document.getElementById("tabBtnVisual");
    const btnTemplates = document.getElementById("tabBtnTemplates");
    const btnCode = document.getElementById("tabBtnCode");

    const viewVisual = document.getElementById("customizerTabVisual");
    const viewTemplates = document.getElementById("customizerTabTemplates");
    const viewCode = document.getElementById("customizerTabCode");

    btnVisual?.classList.toggle("active", tab === "visual");
    btnTemplates?.classList.toggle("active", tab === "templates");
    btnCode?.classList.toggle("active", tab === "code");

    if (viewVisual) viewVisual.style.display = tab === "visual" ? "block" : "none";
    if (viewTemplates) viewTemplates.style.display = tab === "templates" ? "block" : "none";
    if (viewCode) viewCode.style.display = tab === "code" ? "block" : "none";

    if (tab === "visual") {
      this.loadStoreSettingsToForm();
    } else if (tab === "templates") {
      this.renderTemplatesGrid();
    } else if (tab === "code") {
      this.loadTemplateCodeToEditor();
    }
  },

  renderTemplatesGrid() {
    const container = document.getElementById("templatesGridContainer");
    const activeBadge = document.getElementById("activeTemplateBadgeName");
    if (!container) return;

    const templates = Storage.getTemplates();
    const activeId = Storage.getActiveTemplateId();
    const activeTemplate = templates.find((t) => t.id === activeId) || templates[0];

    if (activeBadge) activeBadge.textContent = activeTemplate.name;

    container.innerHTML = templates.map((tmpl) => {
      const isActive = tmpl.id === activeId;
      
      // Wireframe mockup generator based on archetype
      let mockupHtml = "";
      if (tmpl.archetype === "ejecutivo") {
        mockupHtml = `
          <div class="mockup-wireframe-box mockup-ejecutivo">
            <div class="mockup-bar luxury-bar">✦ COLECCIÓN PRIVADA • ATENCIÓN VIP ✦</div>
            <div class="mockup-hero-centered">
              <span class="mockup-crest">⚜️</span>
              <div class="mockup-title-serif">Distinción & Lujo</div>
              <div class="mockup-dual-btn">
                <span class="m-btn gold">Adquirir</span>
                <span class="m-btn white">Asesoría</span>
              </div>
            </div>
            <div class="mockup-cards-row">
              <div class="m-card luxury"><span>💎</span><small>$320</small></div>
              <div class="m-card luxury"><span>⌚</span><small>$450</small></div>
              <div class="m-card luxury"><span>💼</span><small>$280</small></div>
            </div>
          </div>
        `;
      } else if (tmpl.archetype === "moda") {
        mockupHtml = `
          <div class="mockup-wireframe-box mockup-moda">
            <div class="mockup-bar fashion-bar">🔥 NUEVO DROP SS26 • STREETWEAR LOOKBOOK 🔥</div>
            <div class="mockup-hero-fashion">
              <div class="mockup-title-fashion">NEW ERA <br><em>Style & Drop</em></div>
              <span class="m-btn red">COMPRAR DROP</span>
            </div>
            <div class="mockup-cards-row">
              <div class="m-card portrait"><span>HOT</span><small>S M L XL</small></div>
              <div class="m-card portrait"><span>NEW</span><small>S M L XL</small></div>
              <div class="m-card portrait"><span>DROP</span><small>S M L XL</small></div>
            </div>
          </div>
        `;
      } else if (tmpl.archetype === "nordico") {
        mockupHtml = `
          <div class="mockup-wireframe-box mockup-nordico">
            <div class="mockup-bar nordic-bar">🌿 DISEÑO SOSTENIBLE • CONFORT HYGGE 🌿</div>
            <div class="mockup-hero-curved">
              <span class="mockup-leaf">🌿</span>
              <div class="mockup-title-nordic">Mobiliario & Armonía</div>
              <span class="m-btn orange">Descubrir Hogar</span>
            </div>
            <div class="mockup-cards-row">
              <div class="m-card soft"><span>🛋️</span><small>Eco</small></div>
              <div class="m-card soft"><span>☕</span><small>Hygge</small></div>
              <div class="m-card soft"><span>🌱</span><small>Paz</small></div>
            </div>
          </div>
        `;
      } else if (tmpl.archetype === "neobrutal") {
        mockupHtml = `
          <div class="mockup-wireframe-box mockup-neobrutal">
            <div class="mockup-bar brutal-bar">⚡ ¡OFERTAS RELÁMPAGO 2026! ⚡</div>
            <div class="mockup-hero-brutal">
              <span class="m-sticker">★ VIRAL</span>
              <div class="mockup-title-brutal">¡MÁS VENDIDOS!</div>
              <span class="m-btn yellow">¡COMPRAR YA!</span>
            </div>
            <div class="mockup-cards-row">
              <div class="m-card brutal"><span>💥</span><small>POP</small></div>
              <div class="m-card brutal"><span>🚀</span><small>HOT</small></div>
              <div class="m-card brutal"><span>🔥</span><small>TOP</small></div>
            </div>
          </div>
        `;
      } else if (tmpl.archetype === "industrial") {
        mockupHtml = `
          <div class="mockup-wireframe-box mockup-industrial">
            <div class="mockup-bar industrial-bar">🛡️ CERTIFICACIÓN ANSI Z89.1 • DOTACIÓN B2B 🛡️</div>
            <div class="mockup-hero-industrial">
              <span class="m-shield">🛡️</span>
              <div class="mockup-title-industrial">EQUIPOS EPP</div>
              <span class="m-btn amber">VER CATÁLOGO PRO</span>
            </div>
            <div class="mockup-cards-row">
              <div class="m-card industrial"><span>👷</span><small>ANSI</small></div>
              <div class="m-card industrial"><span>🥾</span><small>200J</small></div>
              <div class="m-card industrial"><span>🥽</span><small>UV400</small></div>
            </div>
          </div>
        `;
      } else {
        // Moderno Tech
        mockupHtml = `
          <div class="mockup-wireframe-box mockup-moderno">
            <div class="mockup-bar tech-bar">⚡ TELEMETRÍA 0ms • STOCK EN VIVO ⚡</div>
            <div class="mockup-hero-split">
              <div class="split-left">
                <span class="m-badge-pill">V2.6 TECH</span>
                <div class="mockup-title-tech">Hardware Pro</div>
                <span class="m-btn blue">⚡ Equipar Setup</span>
              </div>
              <div class="split-right">
                <div class="m-hologram-box">
                  <span>🎧 ANC</span>
                </div>
              </div>
            </div>
            <div class="mockup-cards-row">
              <div class="m-card tech"><span>⚡</span><small>WiFi 6E</small></div>
              <div class="m-card tech"><span>🔋</span><small>48h GaN</small></div>
              <div class="m-card tech"><span>🛡️</span><small>24M Pro</small></div>
            </div>
          </div>
        `;
      }

      return `
        <div class="template-card ${isActive ? "active" : ""}">
          <div class="template-card-preview" style="background: linear-gradient(135deg, ${tmpl.color}, #090d16);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span class="template-preview-badge">${tmpl.icon} ${tmpl.category}</span>
              ${isActive ? '<span style="background: #10b981; color: white; padding: 2px 10px; border-radius: 12px; font-size: 0.72rem; font-weight: 800; box-shadow: 0 0 10px rgba(16,185,129,0.5);">✓ Activa</span>' : ''}
            </div>
            ${mockupHtml}
          </div>
          <div class="template-card-body">
            <div class="template-card-title">
              <span>${tmpl.name}</span>
            </div>
            <p class="template-card-desc">${tmpl.description}</p>
            
            <div class="template-structure-tags">
              ${(tmpl.structure_tags || []).map(tag => `<span class="structure-tag-chip">📐 ${tag}</span>`).join("")}
            </div>

            <div class="template-card-features">
              <span class="template-feature-chip">🎨 Color: ${tmpl.color}</span>
              <span class="template-feature-chip">🔘 Botones: ${tmpl.button_style}</span>
              <span class="template-feature-chip">🔤 ${tmpl.font_display ? tmpl.font_display.split(",")[0].replace(/'/g, "") : "Inter"}</span>
            </div>

            <button 
              type="button" 
              class="btn-apply-template ${isActive ? "current" : ""}" 
              onclick="admin.applyTemplate('${tmpl.id}')"
            >
              ${isActive ? "✅ Estructura Activa en tu Tienda" : "🚀 Aplicar Esta Estructura y Plantilla"}
            </button>
          </div>
        </div>
      `;
    }).join("");
  },

  applyTemplate(templateId) {
    const templates = Storage.getTemplates();
    const tmpl = templates.find((t) => t.id === templateId);
    if (!tmpl) return;

    Storage.setActiveTemplateId(templateId);

    const config = Storage.getStoreConfig();
    config.template_id = tmpl.id;
    config.template_archetype = tmpl.archetype;
    config.primary_color = tmpl.color;
    config.button_style = tmpl.button_style;

    // Respetar SIEMPRE los textos que el usuario ya tenga escritos
    // Solo asignar texto de la plantilla si el campo estuviese vacío
    if (!config.hero_tag) config.hero_tag = tmpl.hero_tag;
    if (!config.hero_title) config.hero_title = tmpl.hero_title;
    if (!config.hero_desc) config.hero_desc = tmpl.hero_desc;
    if (!config.hero_cta_text) config.hero_cta_text = tmpl.hero_cta_text;

    Storage.saveStoreConfig(config);
    this.updateHeaderBrand();
    this.renderTemplatesGrid();
    this.loadStoreSettingsToForm();

    // Reload iframe to cleanly apply the new structure and layout
    const iframe = document.getElementById("wixStorePreviewIframe");
    if (iframe) {
      iframe.src = "index.html?t=" + Date.now();
    }

    this.showToast(`🎉 ¡Estructura "${tmpl.name}" activada! El diseño, tipografía y tarjetas cambiaron respetando tus textos.`);
    
    // Switch to visual customizer after short delay so the user sees the live result
    setTimeout(() => {
      this.switchCustomizerTab("visual");
    }, 1200);
  },

  /* Blogger Developer Guide Toggle */
  toggleBloggerGuide() {
    const body = document.getElementById("bloggerGuideBody");
    const arrow = document.getElementById("guideArrow");
    if (!body) return;
    const isHidden = body.style.display === "none";
    body.style.display = isHidden ? "block" : "none";
    if (arrow) arrow.textContent = isHidden ? "▾" : "▸";
  },

  /* Insert Tag at cursor position */
  insertTagIntoCode(tag) {
    const textarea = document.getElementById("templateCodeEditor");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    textarea.value = text.substring(0, start) + tag + text.substring(end);
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = start + tag.length;

    this.showToast(`✨ Etiqueta "${tag}" insertada en el código.`);
  },

  /* Load template code to textarea */
  loadTemplateCodeToEditor() {
    const editor = document.getElementById("templateCodeEditor");
    if (!editor) return;

    const customHtml = Storage.getCustomTemplateHtml();
    if (customHtml) {
      editor.value = customHtml;
      const status = document.getElementById("codeEditorStatus");
      if (status) status.textContent = "📄 Plantilla personalizada cargada desde almacenamiento";
      return;
    }

    // Load default starter template with Blogger tags
    const starterTemplate = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{store_name}} — Tienda Oficial</title>
  <link rel="stylesheet" href="styles.css">
  <style>
    :root {
      --primary: {{primary_color}};
    }
  </style>
</head>
<body>

  <!-- Barra Superior de Anuncios -->
  <div class="top-bar">
    <div class="top-bar-content">
      <span class="badge-pulse">Oficial</span>
      <span id="topBarText">{{announcement_text}}</span>
    </div>
  </div>

  <!-- Cabecera Principal / Marca -->
  <header class="main-header">
    <div class="nav-container">
      <a href="index.html" class="brand-wrap">
        <div class="brand-icon" id="storeBrandIcon">{{store_logo}}</div>
        <div class="brand-title">
          <span id="storeBrandName">{{store_name}}</span>
          <span class="brand-subtitle" id="storeBrandTagline">{{store_tagline}}</span>
        </div>
      </a>
      <div class="nav-actions">
        <button id="openCartBtn" class="btn-icon-badge">🛒 Carrito</button>
      </div>
    </div>
  </header>

  <!-- Banner Hero Principal -->
  <section id="heroSection" class="hero-section">
    <div class="hero-inner">
      <div id="heroTag" class="hero-tag">
        <span id="heroTagText">{{hero_tag}}</span>
      </div>
      <h1 id="heroTitle" class="hero-title">{{hero_title}}</h1>
      <p id="heroDesc" class="hero-desc">{{hero_desc}}</p>
      <div class="hero-ctas">
        <a href="#catalogo" class="btn-hero-primary" id="heroPrimaryCta">{{hero_cta}}</a>
      </div>
    </div>
  </section>

  <!-- Pie de Página & Contacto -->
  <footer class="main-footer">
    <div class="footer-bottom">
      <p>Contacto: WhatsApp {{contact_phone}} | Email: {{contact_email}}</p>
      <p>Dirección: {{contact_address}}</p>
    </div>
  </footer>

  <script src="data.js"><\/script>
  <script src="app.js"><\/script>
</body>
</html>`;

    editor.value = starterTemplate;
  },

  /* Handle Upload File .html */
  handleUploadTemplateFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const editor = document.getElementById("templateCodeEditor");
      if (editor) {
        editor.value = content;
      }
      Storage.saveCustomTemplateHtml(content);
      const status = document.getElementById("codeEditorStatus");
      if (status) status.textContent = `📁 Archivo "${file.name}" cargado (${(file.size / 1024).toFixed(1)} KB)`;
      this.showToast(`📁 Plantilla "${file.name}" subida con éxito.`);
    };
    reader.readAsText(file);
  },

  /* Download current template code */
  downloadTemplateCode() {
    const editor = document.getElementById("templateCodeEditor");
    const code = editor ? editor.value : "";
    if (!code) {
      this.showToast("⚠️ No hay código para descargar.");
      return;
    }

    const blob = new Blob([code], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla_ecommerce_personalizada.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showToast("⬇ Descargando plantilla HTML...");
  },

  /* Reset template code to default */
  resetTemplateCodeToDefault() {
    if (!confirm("¿Deseas restablecer el código de la plantilla al estándar original?")) return;
    Storage.saveCustomTemplateHtml("");
    this.loadTemplateCodeToEditor();
    const status = document.getElementById("codeEditorStatus");
    if (status) status.textContent = "🔄 Plantilla restablecida al código original";
    this.showToast("🔄 Código de plantilla restablecido.");
  },

  /* Save and compile template code */
  saveAndCompileTemplateCode() {
    const editor = document.getElementById("templateCodeEditor");
    const code = editor ? editor.value.trim() : "";

    if (!code) {
      this.showToast("⚠️ El código de la plantilla está vacío.");
      return;
    }

    Storage.saveCustomTemplateHtml(code);

    const status = document.getElementById("codeEditorStatus");
    if (status) {
      status.innerHTML = `<span style="color: #10b981; font-weight: 700;">✅ Plantilla guardada y compilada (${new Date().toLocaleTimeString()})</span>`;
    }

    this.showToast("💾 ¡Plantilla compilada y guardada con éxito!");

    // Also update preview iframe if applicable
    const iframe = document.getElementById("wixStorePreviewIframe");
    if (iframe) {
      try {
        const config = Storage.getStoreConfig();
        let compiled = code
          .replace(/\{\{store_name\}\}/g, config.name || "Mi Tienda Oficial")
          .replace(/\{\{store_tagline\}\}/g, config.tagline || "")
          .replace(/\{\{store_logo\}\}/g, config.logo_icon || "🛍️")
          .replace(/\{\{primary_color\}\}/g, config.primary_color || "#2563eb")
          .replace(/\{\{announcement_text\}\}/g, config.announcement_text || "")
          .replace(/\{\{hero_tag\}\}/g, config.hero_tag || "")
          .replace(/\{\{hero_title\}\}/g, config.hero_title || "")
          .replace(/\{\{hero_desc\}\}/g, config.hero_desc || "")
          .replace(/\{\{hero_cta\}\}/g, config.hero_cta_text || "")
          .replace(/\{\{contact_phone\}\}/g, config.contact_phone || "")
          .replace(/\{\{contact_email\}\}/g, config.contact_email || "")
          .replace(/\{\{contact_address\}\}/g, config.contact_address || "");
        
        iframe.srcdoc = compiled;
      } catch (e) {}
    }
  },

  /* ==========================================================================
     PRODUCT MODAL & CRUD
     ========================================================================== */
  calculateModalProfitability() {
    const cost = parseFloat(document.getElementById("prodFormCostPrice")?.value) || 0;
    const price = parseFloat(document.getElementById("prodFormPrice")?.value) || 0;

    const profit = price - cost;
    const margin = price > 0 ? ((profit / price) * 100).toFixed(1) : "0.0";

    const profitUnit = document.getElementById("modalProfitUnit");
    const profitMargin = document.getElementById("modalProfitMargin");

    if (profitUnit) {
      profitUnit.textContent = `${profit >= 0 ? "+" : ""}$${profit.toFixed(2)}`;
      profitUnit.style.color = profit >= 0 ? "#166534" : "#b91c1c";
    }
    if (profitMargin) {
      profitMargin.textContent = `${margin}%`;
    }
  },

  openNewProductModal() {
    this.populateSupplierSelects();
    document.getElementById("editProductId").value = "";
    document.getElementById("prodModalTitle").textContent = "Nuevo Producto en Catálogo";
    document.getElementById("productForm")?.reset();
    this.calculateModalProfitability();
    const modal = document.getElementById("productModal");
    if (modal) {
      modal.style.display = "flex";
      modal.classList.add("open");
    }
  },

  openEditProductModal(productId) {
    this.populateSupplierSelects();
    const products = Storage.getProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    document.getElementById("editProductId").value = product.id;
    document.getElementById("prodModalTitle").textContent = "Editar Producto & Costos";
    document.getElementById("prodFormName").value = product.name;
    document.getElementById("prodFormCategory").value = product.category;
    document.getElementById("prodFormSku").value = product.sku;
    document.getElementById("prodFormCostPrice").value = product.costPrice || (product.price * 0.45).toFixed(2);
    document.getElementById("prodFormPrice").value = product.price;
    document.getElementById("prodFormSupplier").value = product.supplierId || "sup-1";
    document.getElementById("prodFormStock").value = product.stock;
    document.getElementById("prodFormBrand").value = product.brand || "";
    document.getElementById("prodFormImage").value = product.image;
    document.getElementById("prodFormDesc").value = product.description || "";

    this.calculateModalProfitability();
    const modal = document.getElementById("productModal");
    if (modal) {
      modal.style.display = "flex";
      modal.classList.add("open");
    }
  },

  closeProductModal() {
    const modal = document.getElementById("productModal");
    if (modal) {
      modal.style.display = "none";
      modal.classList.remove("open");
    }
  },

  handleSaveProduct(e) {
    e.preventDefault();
    const id = document.getElementById("editProductId").value;
    const name = document.getElementById("prodFormName").value.trim();
    const category = document.getElementById("prodFormCategory").value;
    const sku = document.getElementById("prodFormSku").value.trim();
    const costPrice = parseFloat(document.getElementById("prodFormCostPrice").value) || 0;
    const price = parseFloat(document.getElementById("prodFormPrice").value) || 0;
    const supplierId = document.getElementById("prodFormSupplier").value;
    const stock = parseInt(document.getElementById("prodFormStock").value) || 0;
    const brand = document.getElementById("prodFormBrand").value.trim();
    const image = document.getElementById("prodFormImage").value.trim();
    const description = document.getElementById("prodFormDesc").value.trim();

    const catObj = INITIAL_CATEGORIES.find((c) => c.id === category);
    const categoryLabel = catObj ? catObj.name : "General";

    const suppliers = Storage.getSuppliers();
    const supplier = suppliers.find((s) => s.id === supplierId);
    const supplierName = supplier ? supplier.name : "Proveedor Aliado";

    let products = Storage.getProducts();

    let target = null;
    if (id) {
      // Update existing
      const prod = products.find((p) => p.id === parseInt(id));
      if (prod) {
        prod.name = name;
        prod.category = category;
        prod.categoryLabel = categoryLabel;
        prod.sku = sku;
        prod.costPrice = costPrice;
        prod.price = price;
        prod.supplierId = supplierId;
        prod.supplierName = supplierName;
        prod.stock = stock;
        prod.brand = brand;
        prod.image = image;
        prod.description = description;
        target = prod;
      }
      this.showToast(`✅ Producto "${name}" actualizado con margen calculado.`);
    } else {
      // Create new
      const newId = Math.max(...products.map((p) => p.id), 0) + 1;
      const newProduct = {
        id: newId,
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        sku,
        category,
        categoryLabel,
        brand,
        costPrice,
        price,
        compareAtPrice: Number((price * 1.25).toFixed(2)),
        stock,
        supplierId,
        supplierName,
        badge: "Nuevo",
        image,
        rating: 5.0,
        reviewsCount: 1,
        description,
        specs: {
          "Disponibilidad": "Inmediata",
          "Garantía": "12 Meses Oficial",
          "Proveedor": supplierName
        }
      };
      products.unshift(newProduct);
      target = newProduct;
      this.showToast(`🎉 ¡Nuevo producto "${name}" registrado con éxito!`);
    }

    Storage.saveProducts(products, null, target);
    this.closeProductModal();
    this.renderProductsTable();
    this.renderInventoryTable();
    this.renderDashboard();
    this.updateSidebarBadges();
  },

  deleteProduct(productId) {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto del catálogo?")) return;

    let products = Storage.getProducts();
    products = products.filter((p) => p.id !== productId);
    Storage.saveProducts(products, productId);

    this.renderProductsTable();
    this.renderInventoryTable();
    this.renderDashboard();
    this.updateSidebarBadges();
    this.showToast("🗑️ Producto eliminado del catálogo.");
  },

  /* ==========================================================================
     TOAST SYSTEM
     ========================================================================== */
  showToast(message) {
    const container = document.getElementById("adminToastContainer");
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

// Initialize Admin on load
document.addEventListener("DOMContentLoaded", () => {
  admin.init();
});
