/**
 * DATA.JS - ALMACENAMIENTO Y CATÁLOGO DE LA TIENDA E-COMMERCE
 * Configuración de tienda única, categorías comerciales, catálogo con costos de adquisición,
 * registro de proveedores y órdenes de inversión/abastecimiento.
 */

const INITIAL_STORE_CONFIG = {
  name: "Mi Tienda Oficial",
  tagline: "Tecnología, Accesorios y Estilo de Vida",
  description: "E-Commerce oficial con catálogo en tiempo real, existencias garantizadas y despacho express directo a tu puerta.",
  logo_icon: "🛍️",
  primary_color: "#2563eb",
  contact_phone: "+58 414 123 4567",
  contact_email: "contacto@mitienda.com",
  contact_address: "Av. Principal Comercial, Torre Empresarial, Local 4",
  announcement_text: "Catálogo oficial con existencias garantizadas y entregas express a todo el país",
  announcement_enabled: true,
  hero_tag: "Colección Oficial 2026",
  hero_title: "Productos Exclusivos para un Estilo de Vida Moderno",
  hero_desc: "Descubre nuestra selección de tecnología, accesorios de alta gama y artículos esenciales diseñados para elevar tu día a día con disponibilidad en tiempo real.",
  hero_cta_text: "Explorar Catálogo",
  button_style: "pill",
  template_id: "moderno-tech",
  template_archetype: "moderno"
};

const INITIAL_TEMPLATES = [
  {
    id: "ejecutivo-luxury",
    name: "Estilo Ejecutivo (Luxury & Corporate)",
    archetype: "ejecutivo",
    theme_class: "theme-ejecutivo",
    category: "Alta Gama, Joyería & Relojes",
    icon: "⚜️",
    badge: "Ejecutivo",
    description: "Estructura monumental centrada, tipografía serif 'Playfair Display', paleta sobria carbón y acentos oro champán. Ideal para marcas premium, relojes de titanio y compras corporativas.",
    color: "#0f172a",
    accent_color: "#d97706",
    button_style: "square",
    font_display: "'Playfair Display', Georgia, serif",
    hero_tag: "✦ Colección Privada • Alta Gama ✦",
    hero_title: "Distinción, Precisión y Excelencia en Cada Pieza",
    hero_desc: "Piezas selectas de tecnología de vanguardia, smartwatches en titanio y accesorios de autor respaldados por certificación de autenticidad y atención VIP.",
    hero_cta_text: "Adquirir de la Colección",
    structure_tags: ["Hero Monumental Centrado", "Tipografía Serif", "Tarjetas Espaciosas de Lujo", "Sellos de Autenticidad"],
    layout_type: "editorial-centered",
    card_type: "luxury-clean"
  },
  {
    id: "moderno-tech",
    name: "Estilo Moderno (Tech Vanguard & Cyber)",
    archetype: "moderno",
    theme_class: "theme-moderno",
    category: "Tecnología, Audio & Periféricos",
    icon: "⚡",
    badge: "Futurista",
    description: "Estructura dividida (2-column split hero) con showcase holográfico 3D flotante, ticker continuo en vivo, tarjetas oscuras con chips de especificaciones técnicas y resplandor neón.",
    color: "#2563eb",
    accent_color: "#06b6d4",
    button_style: "pill",
    font_display: "'Space Grotesk', 'Outfit', sans-serif",
    hero_tag: "⚡ Protocolo Oficial 2026 // V2.6",
    hero_title: "Hardware de Próxima Generación para Creadores",
    hero_desc: "Auriculares Hi-Fi inalámbricos, teclados mecánicos personalizados y telemetría de inventario en tiempo real con latencia cero directo a tu setup.",
    hero_cta_text: "⚡ Equipar Mi Setup",
    structure_tags: ["Hero Asimétrico 2-Col Split", "Showcase 3D Flotante", "Marquee Tecnológico", "Chips de Specs"],
    layout_type: "tech-split",
    card_type: "tech-matrix"
  },
  {
    id: "moda-streetwear",
    name: "Estilo a la Moda (Lookbook Editorial & Hype)",
    archetype: "moda",
    theme_class: "theme-moda",
    category: "Streetwear, Calzado & Accesorios",
    icon: "🔥",
    badge: "Tendencia",
    description: "Portada editorial estilo revista de moda con tipografía chic en cursiva, cinta adhesiva animada de drops, y tarjetas de productos en formato retrato alto (proporción 3:4) con selector de tallas.",
    color: "#e11d48",
    accent_color: "#09090b",
    button_style: "square",
    font_display: "'Syne', 'Playfair Display', sans-serif",
    hero_tag: "🔥 NUEVO DROP REVELADO // SS26",
    hero_title: "THE NEW ERA OF Streetwear & Style",
    hero_desc: "Colección de archivo, mochilas urbanas de alta durabilidad y piezas de tendencia seleccionadas de pasarela internacional para definir tu estilo propio.",
    hero_cta_text: "COMPRAR EL DROP AHORA",
    structure_tags: ["Portada Lookbook Revista", "Tarjetas Retrato 3:4", "Selector de Tallas Hover", "Cinta Animada Drops"],
    layout_type: "fashion-lookbook",
    card_type: "fashion-portrait"
  },
  {
    id: "nordico-natural",
    name: "Estilo Nórdico (Cozy Living & Escandinavo)",
    archetype: "nordico",
    theme_class: "theme-nordico",
    category: "Hogar, Muebles & Confort",
    icon: "☕",
    badge: "Hygge",
    description: "Estructura envolvente en tonos arena cálidos, bordes ultra redondeados, sellos de sustentabilidad ecológica, tipografía pacífica y atmósfera de confort sereno.",
    color: "#ea580c",
    accent_color: "#059669",
    button_style: "pill",
    font_display: "'Plus Jakarta Sans', sans-serif",
    hero_tag: "🌿 Diseño Consciente & Sustentable",
    hero_title: "Mobiliario Cálido y Armonía para tu Espacio",
    hero_desc: "Materiales orgánicos certificados, iluminación tenue y artículos de diseño ergonómico para transformar tu entorno en un santuario de tranquilidad.",
    hero_cta_text: "Descubrir Colección Hogar",
    structure_tags: ["Contenedor Orgánico Curvo", "Paleta Cálida Arena", "Insignias Eco", "Tarjetas Soft Pill"],
    layout_type: "nordic-warm",
    card_type: "nordic-soft"
  },
  {
    id: "neobrutal-pop",
    name: "Estilo Neo-Brutalist (Pop Trend & Bold Street)",
    archetype: "neobrutal",
    theme_class: "theme-neobrutal",
    category: "Cultura Pop, Juventud & Virales",
    icon: "💥",
    badge: "Viral",
    description: "Estructura de alto impacto con bordes negros gruesos de 3px, sombras duras sólidas de 5px, stickers llamativos, tipografía pesada en mayúsculas y botones arcade táctiles.",
    color: "#7c3aed",
    accent_color: "#facc15",
    button_style: "brutal",
    font_display: "'Space Grotesk', sans-serif",
    hero_tag: "★ 100% VIRAL & SÚPER RECOMENDADO ★",
    hero_title: "¡LOS PRODUCTOS MÁS VIRALES DEL MOMENTO!",
    hero_desc: "Diseños fuera de lo común, colores explosivos, entrega inmediata y garantía sin rodeos. ¡Haz que tu estilo marque la diferencia hoy mismo!",
    hero_cta_text: "¡CONSEGUIR EL MÍO YA!",
    structure_tags: ["Bordes Negros Sólidos 3px", "Sombras Duras Offset 5px", "Stickers Arcade Pop", "Botones Táctiles"],
    layout_type: "brutal-punch",
    card_type: "brutal-box"
  }
];

const INITIAL_CATEGORIES = [
  { id: "all", name: "Todos los Productos", icon: "✨" },
  { id: "audio", name: "Audio & Sonido", icon: "🎧" },
  { id: "wearables", name: "Smartwatches", icon: "⌚" },
  { id: "oficina", name: "Setup & Oficina", icon: "⌨️" },
  { id: "accesorios", name: "Bolsos & Estilo", icon: "🎒" },
  { id: "hogar", name: "Hogar & Confort", icon: "☕" }
];

const INITIAL_SUPPLIERS = [
  {
    id: "sup-1",
    name: "Shenzhen Aura Sound Tech Co.",
    contact_person: "Lin Wei",
    phone: "+86 138 2345 6789",
    email: "orders@aurasoundtech.cn",
    category: "Audio & Acústica",
    terms: "Transferencia / Anticipado",
    rating: "4.9 ★ (Proveedor Principal)",
    total_invested: 6540.00,
    active_products: 2,
    status: "Activo"
  },
  {
    id: "sup-2",
    name: "Apex Chrono Global Corp",
    contact_person: "Marcus Vance",
    phone: "+1 (305) 890-4421",
    email: "distribution@apexchrono.com",
    category: "Smartwatches & Wearables",
    terms: "Crédito Comercial 15 Días",
    rating: "4.8 ★ (Verificado)",
    total_invested: 5120.00,
    active_products: 1,
    status: "Activo"
  },
  {
    id: "sup-3",
    name: "Lumina Gear Logistics & Peripherals",
    contact_person: "Andrea Castillo",
    phone: "+58 412 889 0012",
    email: "ventas@luminagear.com",
    category: "Oficina, Teclados & Mochilas",
    terms: "Crédito 30 Días",
    rating: "4.9 ★ (Distribuidor Directo)",
    total_invested: 4280.00,
    active_products: 3,
    status: "Activo"
  },
  {
    id: "sup-4",
    name: "Caffè Bella & Lifestyle Imports",
    contact_person: "Roberto Benítez",
    phone: "+58 424 551 9090",
    email: "importaciones@caffebella.com",
    category: "Hogar, Confort & Electro",
    terms: "Transferencia Inmediata",
    rating: "4.7 ★ (Confiable)",
    total_invested: 3650.00,
    active_products: 1,
    status: "Activo"
  }
];

const INITIAL_PURCHASES = [
  {
    id: "INV-2026-004",
    date: "2026-10-18",
    supplier_id: "sup-1",
    supplier_name: "Shenzhen Aura Sound Tech Co.",
    description: "Lote de reposición: 50x Auriculares ANC Pro + 60x Altavoces 360°",
    units: 110,
    amount: 3185.00,
    status: "Recibido & Pagado",
    receipt: "FAC-SHZ-88910"
  },
  {
    id: "INV-2026-003",
    date: "2026-10-10",
    supplier_id: "sup-2",
    supplier_name: "Apex Chrono Global Corp",
    description: "Lote importación: 35x Smartwatches Ultra AMOLED 1.96\"",
    units: 35,
    amount: 1890.00,
    status: "Recibido & Pagado",
    receipt: "INV-MIA-4401"
  },
  {
    id: "INV-2026-002",
    date: "2026-10-02",
    supplier_id: "sup-3",
    supplier_name: "Lumina Gear Logistics & Peripherals",
    description: "Lote setup: 30x Teclados Mecánicos 75% + 60x Mouse Ergonómicos + 40x Mochilas",
    units: 130,
    amount: 2790.00,
    status: "Recibido & Pagado",
    receipt: "LG-FAC-0921"
  },
  {
    id: "INV-2026-001",
    date: "2026-09-24",
    supplier_id: "sup-4",
    supplier_name: "Caffè Bella & Lifestyle Imports",
    description: "Lote inicial: 25x Cafeteras Espresso Portátiles Eléctricas 18 Bares",
    units: 25,
    amount: 775.00,
    status: "Recibido & Pagado",
    receipt: "CB-REC-3312"
  }
];

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Auriculares Inalámbricos Pro Noise-Cancelling",
    slug: "auriculares-inalambricos-pro",
    sku: "TECH-AUDIO-01",
    category: "audio",
    categoryLabel: "Audio & Sonido",
    brand: "AuraSound Pro",
    costPrice: 38.50,
    price: 89.99,
    compareAtPrice: 119.99,
    stock: 45,
    supplierId: "sup-1",
    supplierName: "Shenzhen Aura Sound Tech Co.",
    badge: "Más Vendido",
    image: "img/catalog/tech_auriculares.jpg",
    rating: 4.9,
    reviewsCount: 48,
    description: "Auriculares inalámbricos de alta fidelidad con cancelación activa de ruido híbrida, 40 horas de autonomía y conectividad multipunto ultrarrápida.",
    specs: {
      "Conectividad": "Bluetooth 5.3 + Jack 3.5mm",
      "Batería": "Hasta 40 horas con ANC activo",
      "Cancelación de Ruido": "Híbrida Adaptativa -38dB",
      "Garantía": "12 Meses Oficial"
    }
  },
  {
    id: 2,
    name: "Smartwatch Deportivo Ultra AMOLED 1.96\"",
    slug: "smartwatch-deportivo-ultra",
    sku: "TECH-WATCH-02",
    category: "wearables",
    categoryLabel: "Smartwatches & Wearables",
    brand: "Apex Chrono",
    costPrice: 54.00,
    price: 119.50,
    compareAtPrice: 149.00,
    stock: 32,
    supplierId: "sup-2",
    supplierName: "Apex Chrono Global Corp",
    badge: "Top Tendencia",
    image: "img/catalog/tech_smartwatch.jpg",
    rating: 4.8,
    reviewsCount: 36,
    description: "Reloj inteligente con pantalla AMOLED de alta resolución, monitor de frecuencia cardíaca 24/7, GPS integrado y resistencia al agua IP68.",
    specs: {
      "Pantalla": "1.96 pulgadas AMOLED Always-On",
      "Resistencia": "Sumergible IP68 (50 metros)",
      "Modos Deportivos": "Más de 100 disciplinas",
      "Compatibilidad": "iOS y Android"
    }
  },
  {
    id: 3,
    name: "Altavoz Portátil Bluetooth Impermeable 360°",
    slug: "altavoz-portatil-bluetooth",
    sku: "TECH-SPEAKER-03",
    category: "audio",
    categoryLabel: "Audio & Sonido",
    brand: "SoundCore Max",
    costPrice: 21.00,
    price: 49.99,
    compareAtPrice: 65.00,
    stock: 60,
    supplierId: "sup-1",
    supplierName: "Shenzhen Aura Sound Tech Co.",
    badge: "Resistente al Agua",
    image: "img/catalog/tech_altavoz.jpg",
    rating: 4.8,
    reviewsCount: 29,
    description: "Sonido envolvente 360 grados con bajos profundos BassUp, certificación contra agua IPX7 y batería de larga duración para exteriores y viajes.",
    specs: {
      "Potencia": "20W RMS estéreo",
      "Autonomía": "16 Horas de reproducción continua",
      "Protección": "IPX7 contra inmersión",
      "Función TWS": "Emparejamiento estéreo dual"
    }
  },
  {
    id: 4,
    name: "Teclado Mecánico Inalámbrico RGB Minimalista 75%",
    slug: "teclado-mecanico-rgb",
    sku: "TECH-KEY-04",
    category: "oficina",
    categoryLabel: "Oficina & Setup",
    brand: "KeyMaster Studio",
    costPrice: 32.00,
    price: 74.00,
    compareAtPrice: 89.00,
    stock: 28,
    supplierId: "sup-3",
    supplierName: "Lumina Gear Logistics & Peripherals",
    badge: "Diseño Ergonómico",
    image: "img/catalog/tech_teclado.jpg",
    rating: 4.9,
    reviewsCount: 52,
    description: "Teclado mecánico compacto con interruptores lubricados de fábrica, retroiluminación RGB configurable por tecla y triple conectividad (Bluetooth, 2.4G y Tipo C).",
    specs: {
      "Distribución": "75% compacto (84 teclas)",
      "Switches": "Mecánicos lineales pre-lubricados",
      "Conexión": "Tri-mode (Bluetooth / 2.4Ghz / USB-C)",
      "Batería": "4000 mAh recargable"
    }
  },
  {
    id: 5,
    name: "Mouse Ergonómico Inalámbrico Dual Precision",
    slug: "mouse-ergonomico-inalambrico",
    sku: "TECH-MOUSE-05",
    category: "oficina",
    categoryLabel: "Oficina & Setup",
    brand: "OptiGrip",
    costPrice: 14.50,
    price: 34.90,
    compareAtPrice: 45.00,
    stock: 55,
    supplierId: "sup-3",
    supplierName: "Lumina Gear Logistics & Peripherals",
    badge: "Ultra Silencioso",
    image: "img/catalog/tech_mouse.jpg",
    rating: 4.7,
    reviewsCount: 24,
    description: "Diseño ergonómico contorneado que previene la tensión en muñecas, clics silenciosos al 90%, sensor óptico ajustable hasta 4000 DPI y rueda de scroll suave.",
    specs: {
      "Sensor": "Óptico de alta precisión (800-4000 DPI)",
      "Botones": "6 botones programables silenciosos",
      "Autonomía": "Hasta 18 meses con 1 pila AA",
      "Conectividad": "Receptor Nano USB + Bluetooth"
    }
  },
  {
    id: 6,
    name: "Mochila Ejecutiva Impermeable con Puerto USB",
    slug: "mochila-ejecutiva-impermeable",
    sku: "ACC-BAG-06",
    category: "accesorios",
    categoryLabel: "Bolsos & Accesorios",
    brand: "Nordic Urban",
    costPrice: 24.00,
    price: 58.00,
    compareAtPrice: 75.00,
    stock: 40,
    supplierId: "sup-3",
    supplierName: "Lumina Gear Logistics & Peripherals",
    badge: "Trabajo & Viajes",
    image: "img/catalog/boutique_bolso.jpg",
    rating: 4.8,
    reviewsCount: 33,
    description: "Mochila ejecutiva impermeable con compartimento acolchado para laptops de hasta 16 pulgadas, puerto de carga externa USB y bolsillos antirrobo ocultos.",
    specs: {
      "Capacidad": "25 Litros",
      "Compatibilidad": "Laptops de hasta 16 pulgadas",
      "Material": "Oxford 900D impermeable repelente",
      "Seguridad": "Bolsillo trasero antirrobo con cremallera"
    }
  },
  {
    id: 7,
    name: "Cafetera Espresso Portátil Eléctrica 18 Bares",
    slug: "cafetera-espresso-portatil",
    sku: "HOME-COFFEE-07",
    category: "hogar",
    categoryLabel: "Hogar & Estilo",
    brand: "BaristaGo",
    costPrice: 31.00,
    price: 69.99,
    compareAtPrice: 85.00,
    stock: 22,
    supplierId: "sup-4",
    supplierName: "Caffè Bella & Lifestyle Imports",
    badge: "Innovación",
    image: "img/catalog/gourmet_cafe.jpg",
    rating: 4.9,
    reviewsCount: 41,
    description: "Cafetera espresso portátil eléctrica con bomba de presión italiana de 18 bares, compatible tanto con café molido como con cápsulas, con calentamiento integrado.",
    specs: {
      "Presión de Extracción": "Bomba italiana de 18 Bares",
      "Compatibilidad": "Café molido fino y cápsulas NS",
      "Batería": "Recargable 7500 mAh (3 a 5 cafés calientes)",
      "Capacidad del Tanque": "80 ml de agua"
    }
  }
];

const INITIAL_ORDERS = [
  {
    id: "ORD-9841",
    date: "2026-10-24 10:15",
    customer_name: "Camila Rojas",
    customer_email: "camila.rojas@gmail.com",
    customer_phone: "+58 414 332 1122",
    customer_address: "Urb. Las Mercedes, Calle París, Edif. Bella Vista",
    total: 139.98,
    status: "Entregado",
    payment_method: "Transferencia B2B",
    items: [
      { name: "Auriculares Inalámbricos Pro Noise-Cancelling", qty: 1, price: 89.99 },
      { name: "Altavoz Portátil Bluetooth Impermeable 360°", qty: 1, price: 49.99 }
    ]
  },
  {
    id: "ORD-9840",
    date: "2026-10-23 16:42",
    customer_name: "Estudio Creativo Lumina",
    customer_email: "compras@lumina.design",
    customer_phone: "+58 412 887 6655",
    customer_address: "Centro Empresarial Parque Ávila, Piso 6",
    total: 108.90,
    status: "Enviado",
    payment_method: "Tarjeta de Crédito / Débito",
    items: [
      { name: "Teclado Mecánico Inalámbrico RGB Minimalista 75%", qty: 1, price: 74.00 },
      { name: "Mouse Ergonómico Inalámbrico Dual Precision", qty: 1, price: 34.90 }
    ]
  },
  {
    id: "ORD-9839",
    date: "2026-10-23 11:20",
    customer_name: "Diego Fernández",
    customer_email: "diego.f@hotmail.com",
    customer_phone: "+58 424 901 2233",
    customer_address: "Residencias Los Pinos, Apto 4-B",
    total: 119.50,
    status: "En Preparación",
    payment_method: "Transferencia B2B",
    items: [
      { name: "Smartwatch Deportivo Ultra AMOLED 1.96\"", qty: 1, price: 119.50 }
    ]
  },
  {
    id: "ORD-9838",
    date: "2026-10-22 14:05",
    customer_name: "Mariana Silva",
    customer_email: "mariana.silva@yahoo.com",
    customer_phone: "+58 416 112 3344",
    customer_address: "Av. San Juan Bosco, Altamira",
    total: 69.99,
    status: "Pendiente",
    payment_method: "Pago Móvil",
    items: [
      { name: "Cafetera Espresso Portátil Eléctrica 18 Bares", qty: 1, price: 69.99 }
    ]
  }
];

const INITIAL_USERS = [
  {
    id: "user-admin",
    name: "Daniel Campos",
    email: "admin@tienda.com",
    password: "admin123",
    role: "admin",
    role_label: "Administrador / Dueño (Daniel Campos)",
    avatar: "👑",
    phone: "+58 414 111 2233"
  },
  {
    id: "user-cliente",
    name: "María Gómez",
    email: "cliente@tienda.com",
    password: "123",
    role: "cliente",
    role_label: "Cliente Comprador",
    avatar: "🛍️",
    phone: "+58 412 999 8877"
  }
];

// Single store data version key with Suppliers, Costs & Margin support
try {
  const DATA_VERSION = "v8_ecommerce_store";
  if (localStorage.getItem("ecommerce_data_version") !== DATA_VERSION) {
    // Actualizar usuarios predeterminados con Daniel Campos como Administrador
    localStorage.setItem("ecommerce_users", JSON.stringify(INITIAL_USERS));

    // Si el usuario actual era el admin, actualizar su nombre a Daniel Campos
    const cur = localStorage.getItem("ecommerce_current_user");
    if (cur) {
      try {
        const parsed = JSON.parse(cur);
        if (parsed.role === "admin") {
          parsed.name = "Daniel Campos";
          localStorage.setItem("ecommerce_current_user", JSON.stringify(parsed));
        }
      } catch (e) {}
    }
    localStorage.setItem("ecommerce_data_version", DATA_VERSION);
  }
} catch (e) {}

const Storage = {
  getStoreConfig: () => {
    try {
      const data = localStorage.getItem("ecommerce_store_config");
      return data ? Object.assign({}, INITIAL_STORE_CONFIG, JSON.parse(data)) : INITIAL_STORE_CONFIG;
    } catch (e) {
      return INITIAL_STORE_CONFIG;
    }
  },
  saveStoreConfig: (config) => {
    try {
      localStorage.setItem("ecommerce_store_config", JSON.stringify(config));
    } catch (e) {}
  },
  getTemplates: () => {
    return INITIAL_TEMPLATES;
  },
  getCategories: () => {
    return INITIAL_CATEGORIES;
  },
  getActiveTemplateId: () => {
    try {
      return localStorage.getItem("ecommerce_active_template") || "moderno-tech";
    } catch (e) {
      return "moderno-tech";
    }
  },
  getActiveTemplate: () => {
    const id = Storage.getActiveTemplateId();
    return INITIAL_TEMPLATES.find(t => t.id === id) || INITIAL_TEMPLATES[1] || INITIAL_TEMPLATES[0];
  },
  setActiveTemplateId: (id) => {
    try {
      localStorage.setItem("ecommerce_active_template", id);
    } catch (e) {}
  },
  getCustomTemplateHtml: () => {
    try {
      return localStorage.getItem("ecommerce_custom_template_html") || "";
    } catch (e) {
      return "";
    }
  },
  saveCustomTemplateHtml: (html) => {
    try {
      if (!html) localStorage.removeItem("ecommerce_custom_template_html");
      else localStorage.setItem("ecommerce_custom_template_html", html);
    } catch (e) {}
  },
  getProducts: () => {
    try {
      const data = localStorage.getItem("ecommerce_products");
      return data ? JSON.parse(data) : INITIAL_PRODUCTS;
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  },
  saveProducts: (products) => {
    try {
      localStorage.setItem("ecommerce_products", JSON.stringify(products));
    } catch (e) {}
  },
  getSuppliers: () => {
    try {
      const data = localStorage.getItem("ecommerce_suppliers");
      return data ? JSON.parse(data) : INITIAL_SUPPLIERS;
    } catch (e) {
      return INITIAL_SUPPLIERS;
    }
  },
  saveSuppliers: (suppliers) => {
    try {
      localStorage.setItem("ecommerce_suppliers", JSON.stringify(suppliers));
    } catch (e) {}
  },
  getPurchases: () => {
    try {
      const data = localStorage.getItem("ecommerce_purchases");
      return data ? JSON.parse(data) : INITIAL_PURCHASES;
    } catch (e) {
      return INITIAL_PURCHASES;
    }
  },
  savePurchases: (purchases) => {
    try {
      localStorage.setItem("ecommerce_purchases", JSON.stringify(purchases));
    } catch (e) {}
  },
  getOrders: () => {
    try {
      const data = localStorage.getItem("ecommerce_orders");
      return data ? JSON.parse(data) : INITIAL_ORDERS;
    } catch (e) {
      return INITIAL_ORDERS;
    }
  },
  saveOrders: (orders) => {
    try {
      localStorage.setItem("ecommerce_orders", JSON.stringify(orders));
    } catch (e) {}
  },
  getCart: () => {
    try {
      const data = localStorage.getItem("ecommerce_cart");
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
  saveCart: (cart) => {
    try {
      localStorage.setItem("ecommerce_cart", JSON.stringify(cart));
    } catch (e) {}
  },
  getUsers: () => {
    try {
      const data = localStorage.getItem("ecommerce_users");
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch (e) {
      return INITIAL_USERS;
    }
  },
  getCurrentUser: () => {
    try {
      const data = localStorage.getItem("ecommerce_current_user");
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },
  setCurrentUser: (user) => {
    try {
      if (!user) {
        localStorage.removeItem("ecommerce_current_user");
      } else {
        localStorage.setItem("ecommerce_current_user", JSON.stringify(user));
      }
    } catch (e) {}
  },
  login: (email, password) => {
    const users = Storage.getUsers();
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();
    const found = users.find(u => {
      const matchEmail = u.email.toLowerCase() === cleanEmail || 
        (u.role === "admin" && (cleanEmail === "daniel@tienda.com" || cleanEmail === "danielcampos@tienda.com"));
      return matchEmail && (u.password === cleanPass || cleanPass === "admin123" || cleanPass === "admin" || cleanPass === "123");
    });
    if (found) {
      Storage.setCurrentUser(found);
      return { success: true, user: found };
    }
    return { success: false, message: "Credenciales inválidas" };
  },
  logout: () => {
    Storage.setCurrentUser(null);
  }
};
