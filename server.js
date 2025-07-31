const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Configurazione - CREDENZIALI HARDCODED
const SHOP = 'kf1fj0-hp.myshopify.com';
const TOKEN = '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';

// Homepage con design professionale pastello
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="it">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Viky Store - Claude Analytics Platform</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                background: #f8fafc;
                color: #2d3748;
                line-height: 1.6;
                min-height: 100vh;
            }
            
            .hero-section {
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                padding: 80px 20px;
                margin-bottom: 50px;
            }
            
            .container { 
                max-width: 1200px; 
                margin: 0 auto; 
                padding: 0 20px; 
            }
            
            .header {
                text-align: center;
                color: white;
            }
            
            .header h1 {
                font-size: 3.2rem;
                font-weight: 700;
                margin-bottom: 16px;
                color: white;
                letter-spacing: -0.02em;
                text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            }
            
            .header .subtitle {
                font-size: 1.2rem;
                color: rgba(255, 255, 255, 0.9);
                margin-bottom: 30px;
                font-weight: 400;
            }
            
            .status-badge {
                display: inline-flex;
                align-items: center;
                background: rgba(255, 255, 255, 0.2);
                color: white;
                padding: 10px 24px;
                border-radius: 50px;
                font-size: 0.9rem;
                font-weight: 500;
                border: 1px solid rgba(255, 255, 255, 0.3);
                backdrop-filter: blur(10px);
            }
            
            .status-dot {
                width: 8px;
                height: 8px;
                background: #4ade80;
                border-radius: 50%;
                margin-right: 8px;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.6; }
            }
            
            .main-content {
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(20px);
                border-radius: 24px;
                padding: 50px;
                border: 1px solid rgba(255, 255, 255, 0.5);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
                margin-bottom: 40px;
                margin-top: -30px;
                position: relative;
                z-index: 2;
            }
            
            .section-title {
                font-size: 2rem;
                font-weight: 600;
                margin-bottom: 40px;
                color: #1e293b;
                text-align: center;
                position: relative;
            }
            
            .section-title::after {
                content: '';
                position: absolute;
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%);
                width: 60px;
                height: 3px;
                background: linear-gradient(90deg, #a855f7, #ec4899);
                border-radius: 2px;
            }
            
            .services-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 30px;
                margin-bottom: 50px;
            }
            
            .service-card {
                background: rgba(255, 255, 255, 0.9);
                border-radius: 20px;
                padding: 35px;
                text-decoration: none;
                color: inherit;
                transition: all 0.4s ease;
                border: 1px solid rgba(255, 255, 255, 0.5);
                position: relative;
                overflow: hidden;
            }
            
            .service-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: var(--accent-color);
                transform: scaleX(0);
                transition: transform 0.4s ease;
            }
            
            .service-card:hover::before {
                transform: scaleX(1);
            }
            
            .service-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
                background: rgba(255, 255, 255, 0.95);
            }
            
            .service-icon {
                width: 60px;
                height: 60px;
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.8rem;
                margin-bottom: 20px;
                background: var(--icon-bg);
                color: var(--icon-color);
            }
            
            .service-title {
                font-size: 1.3rem;
                font-weight: 600;
                margin-bottom: 12px;
                color: #1e293b;
            }
            
            .service-description {
                color: #64748b;
                margin-bottom: 20px;
                font-size: 0.95rem;
                line-height: 1.6;
            }
            
            .service-action {
                display: inline-flex;
                align-items: center;
                color: var(--accent-color);
                font-weight: 500;
                font-size: 0.9rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .service-action::after {
                content: '→';
                margin-left: 8px;
                transition: transform 0.3s ease;
            }
            
            .service-card:hover .service-action::after {
                transform: translateX(4px);
            }
            
            /* Colori pastello per ogni card */
            .service-card:nth-child(1) {
                --accent-color: #a855f7;
                --icon-bg: linear-gradient(135deg, #f3e8ff, #e9d5ff);
                --icon-color: #7c3aed;
            }
            
            .service-card:nth-child(2) {
                --accent-color: #06b6d4;
                --icon-bg: linear-gradient(135deg, #ecfeff, #cffafe);
                --icon-color: #0891b2;
            }
            
            .service-card:nth-child(3) {
                --accent-color: #ec4899;
                --icon-bg: linear-gradient(135deg, #fdf2f8, #fce7f3);
                --icon-color: #db2777;
            }
            
            .service-card:nth-child(4) {
                --accent-color: #10b981;
                --icon-bg: linear-gradient(135deg, #ecfdf5, #d1fae5);
                --icon-color: #059669;
            }
            
            .ai-section {
                background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%);
                border-radius: 20px;
                padding: 50px;
                text-align: center;
                border: 1px solid #fed7aa;
                position: relative;
                overflow: hidden;
            }
            
            .ai-section::before {
                content: '';
                position: absolute;
                top: -50%;
                right: -50%;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%);
                pointer-events: none;
            }
            
            .ai-title {
                font-size: 2.2rem;
                font-weight: 700;
                color: #92400e;
                margin-bottom: 16px;
                position: relative;
            }
            
            .ai-description {
                color: #b45309;
                font-size: 1.1rem;
                margin-bottom: 35px;
                max-width: 600px;
                margin-left: auto;
                margin-right: auto;
                line-height: 1.7;
                position: relative;
            }
            
            .ai-button {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                color: white;
                padding: 16px 40px;
                border-radius: 12px;
                text-decoration: none;
                font-weight: 600;
                font-size: 1.05rem;
                display: inline-flex;
                align-items: center;
                gap: 12px;
                transition: all 0.3s ease;
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
                position: relative;
            }
            
            .ai-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 30px rgba(245, 158, 11, 0.4);
            }
            
            .footer-info {
                background: rgba(255, 255, 255, 0.6);
                backdrop-filter: blur(20px);
                border-radius: 20px;
                padding: 40px;
                text-align: center;
                border: 1px solid rgba(255, 255, 255, 0.3);
                margin-top: 30px;
            }
            
            .footer-title {
                font-size: 1.4rem;
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 16px;
            }
            
            .footer-text {
                color: #64748b;
                margin-bottom: 20px;
                line-height: 1.6;
            }
            
            .install-code {
                background: #1e293b;
                color: #e2e8f0;
                padding: 16px 24px;
                border-radius: 12px;
                font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
                font-size: 0.9rem;
                word-break: break-all;
                border: 1px solid #334155;
            }
            
            @media (max-width: 768px) {
                .header h1 { font-size: 2.5rem; }
                .main-content { padding: 30px 25px; }
                .services-grid { grid-template-columns: 1fr; }
                .ai-section { padding: 30px 25px; }
            }
        </style>
    </head>
    <body>
        <div class="hero-section">
            <div class="container">
                <header class="header">
                    <h1>Viky Store Analytics</h1>
                    <p class="subtitle">Integrazione intelligente tra Viky Store e Claude AI</p>
                    <div class="status-badge">
                        <div class="status-dot"></div>
                        Connesso a ${SHOP}
                    </div>
                </header>
            </div>
        </div>
        
        <div class="container">
            <main class="main-content">
                <h2 class="section-title">Servizi di Analisi Dati</h2>
                
                <div class="services-grid">
                    <a href="/products" class="service-card">
                        <div class="service-icon">📦</div>
                        <h3 class="service-title">Gestione Catalogo</h3>
                        <p class="service-description">
                            Analisi completa del catalogo prodotti con metriche di performance, 
                            gestione inventario e ottimizzazione prezzi.
                        </p>
                        <span class="service-action">Visualizza Catalogo</span>
                    </a>
                    
                    <a href="/orders" class="service-card">
                        <div class="service-icon">📊</div>
                        <h3 class="service-title">Analytics Vendite</h3>
                        <p class="service-description">
                            Dashboard completa degli ordini con analisi dei trend di vendita, 
                            performance stagionali e metriche KPI.
                        </p>
                        <span class="service-action">Visualizza Report</span>
                    </a>
                    
                    <a href="/customers" class="service-card">
                        <div class="service-icon">👥</div>
                        <h3 class="service-title">Customer Intelligence</h3>
                        <p class="service-description">
                            Segmentazione clienti avanzata, analisi comportamentale 
                            e strategie di retention personalizzate.
                        </p>
                        <span class="service-action">Analizza Clienti</span>
                    </a>
                    
                    <a href="/dashboard" class="service-card">
                        <div class="service-icon">📈</div>
                        <h3 class="service-title">Business Intelligence</h3>
                        <p class="service-description">
                            Vista d'insieme con KPI aziendali, forecast di crescita 
                            e dashboard esecutive personalizzabili.
                        </p>
                        <span class="service-action">Apri Dashboard</span>
                    </a>
                </div>
                
                <section class="ai-section">
                    <h2 class="ai-title">🤖 Analisi AI Avanzata</h2>
                    <p class="ai-description">
                        Sfrutta la potenza dell'intelligenza artificiale per ottenere insights approfonditi 
                        sui tuoi dati e-commerce. Claude AI analizza pattern complessi, identifica opportunità 
                        di crescita e fornisce raccomandazioni strategiche personalizzate.
                    </p>
                    <a href="/claude" class="ai-button">
                        <span>🧠</span>
                        Genera Report AI
                    </a>
                </section>
            </main>
            
            <footer class="footer-info">
                <h3 class="footer-title">Installazione Multi-Store</h3>
                <p class="footer-text">
                    Per integrare questa piattaforma con altri negozi Shopify, 
                    utilizza il seguente endpoint di configurazione:
                </p>
                <div class="install-code">
                    https://shopify-claude-connector-viky.vercel.app/auth?shop=STORE-NAME.myshopify.com
                </div>
            </footer>
        </div>
    </body>
    </html>
  `);
});

// Funzione helper per richieste Shopify
async function shopifyAPI(endpoint) {
  try {
    const response = await axios.get(`https://${SHOP.replace('.myshopify.com', '')}.myshopify.com/admin/api/2023-10/${endpoint}`, {
      headers: {
        'X-Shopify-Access-Token': TOKEN,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Errore API: ${error.message}`);
  }
}

// ROUTE PRODOTTI - PAGINA RICCA E MODERNA
app.get('/products', async (req, res) => {
  try {
    const productsData = await shopifyAPI('products.json');
    const products = productsData?.products || [];
    
    // Statistiche prodotti
    const activeProducts = products.filter(p => p?.status === 'active').length;
    const draftProducts = products.filter(p => p?.status === 'draft').length;
    const totalInventory = products.reduce((sum, p) => {
      return sum + (p?.variants?.reduce((vSum, v) => vSum + (v?.inventory_quantity || 0), 0) || 0);
    }, 0);
    const avgPrice = products.length > 0 ? products.reduce((sum, p) => sum + parseFloat(p?.variants?.[0]?.price || 0), 0) / products.length : 0;
    
    res.send(`
      <!DOCTYPE html>
      <html lang="it">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Prodotti - Viky Store</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #f8fafc; color: #1e293b; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 40px 20px; text-align: center; }
          .header h1 { font-size: 2.8rem; font-weight: 700; margin-bottom: 10px; }
          .container { max-width: 1400px; margin: 0 auto; padding: 0 20px; }
          .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: -40px 20px 40px; position: relative; z-index: 2; }
          .stat-card { background: white; padding: 25px; border-radius: 15px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); text-align: center; border-top: 4px solid var(--color); }
          .stat-number { font-size: 2.2rem; font-weight: 700; color: var(--color); margin-bottom: 8px; }
          .stat-label { color: #64748b; font-size: 0.95rem; }
          .content-section { background: white; border-radius: 20px; padding: 30px; margin: 30px 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
          .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
          .product-card { background: #f8fafc; border-radius: 12px; padding: 20px; border-left: 4px solid #3b82f6; transition: transform 0.2s; }
          .product-card:hover { transform: translateY(-2px); }
          .product-title { font-weight: 600; margin-bottom: 10px; color: #1e293b; }
          .product-price { font-size: 1.2rem; font-weight: 700; color: #10b981; margin-bottom: 8px; }
          .product-status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 500; }
          .status-active { background: #dcfce7; color: #166534; }
          .status-draft { background: #fef3c7; color: #92400e; }
          .nav-buttons { display: flex; gap: 15px; margin: 20px 20px; flex-wrap: wrap; }
          .nav-button { padding: 12px 24px; background: #6b7280; color: white; text-decoration: none; border-radius: 10px; font-weight: 500; transition: all 0.3s ease; }
          .nav-button:hover { background: #4b5563; transform: translateY(-2px); }
          .nav-button.active { background: #3b82f6; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="container">
            <h1>📦 Gestione Prodotti</h1>
            <p>Catalogo completo Viky Store - ${products.length} prodotti totali</p>
          </div>
        </div>
        
        <div class="container">
          <div class="stats-grid">
            <div class="stat-card" style="--color: #10b981;">
              <div class="stat-number">${activeProducts}</div>
              <div class="stat-label">Prodotti Attivi</div>
            </div>
            <div class="stat-card" style="--color: #f59e0b;">
              <div class="stat-number">${draftProducts}</div>
              <div class="stat-label">Bozze</div>
            </div>
            <div class="stat-card" style="--color: #3b82f6;">
              <div class="stat-number">${totalInventory}</div>
              <div class="stat-label">Inventario Totale</div>
            </div>
            <div class="stat-card" style="--color: #8b5cf6;">
              <div class="stat-number">€${avgPrice.toFixed(2)}</div>
              <div class="stat-label">Prezzo Medio</div>
            </div>
          </div>
          
          <div class="nav-buttons">
            <a href="/" class="nav-button">🏠 Home</a>
            <a href="/dashboard" class="nav-button">📊 Dashboard</a>
            <a href="/products" class="nav-button active">📦 Prodotti</a>
            <a href="/orders" class="nav-button">🛒 Ordini</a>
            <a href="/customers" class="nav-button">👥 Clienti</a>
            <a href="/claude" class="nav-button">🤖 Analisi AI</a>
          </div>
        </div>
        
        <div class="content-section">
          <h2 style="margin-bottom: 25px; color: #1e293b;">📋 Catalogo Prodotti</h2>
          <div class="products-grid">
            ${products.map(product => `
              <div class="product-card">
                <div class="product-title">${product.title || 'Senza titolo'}</div>
                <div class="product-price">€${product.variants?.[0]?.price || '0.00'}</div>
                <div class="product-status ${product.status === 'active' ? 'status-active' : 'status-draft'}">
                  ${product.status === 'active' ? '✅ Attivo' : '📝 Bozza'}
                </div>
                <div style="margin-top: 10px; font-size: 0.9rem; color: #64748b;">
                  Inventario: ${product.variants?.[0]?.inventory_quantity || 0} unità<br>
                  Tipo: ${product.product_type || 'N/D'}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`<div style="padding: 50px; text-align: center;"><h2>❌ Errore caricamento prodotti</h2><p>${error.message}</p><a href="/">← Home</a></div>`);
  }
});

// ROUTE ORDINI - PAGINA RICCA E MODERNA
app.get('/orders', async (req, res) => {
  try {
    const ordersData = await shopifyAPI('orders.json?status=any&limit=250');
    const orders = ordersData?.orders || [];
    
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0);
    const paidOrders = orders.filter(o => o?.financial_status === 'paid').length;
    const pendingOrders = orders.filter(o => o?.financial_status === 'pending').length;
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    
    res.send(`
      <!DOCTYPE html>
      <html lang="it">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ordini - Viky Store</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; background: #f8fafc; color: #1e293b; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 40px 20px; text-align: center; }
          .header h1 { font-size: 2.8rem; font-weight: 700; margin-bottom: 10px; }
          .container { max-width: 1400px; margin: 0 auto; padding: 0 20px; }
          .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: -40px 20px 40px; position: relative; z-index: 2; }
          .stat-card { background: white; padding: 25px; border-radius: 15px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); text-align: center; border-top: 4px solid var(--color); }
          .stat-number { font-size: 2.2rem; font-weight: 700; color: var(--color); margin-bottom: 8px; }
          .stat-label { color: #64748b; font-size: 0.95rem; }
          .content-section { background: white; border-radius: 20px; padding: 30px; margin: 30px 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
          .orders-list { margin-top: 20px; }
          .order-item { background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #3b82f6; }
          .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
          .order-number { font-weight: 600; color: #1e293b; }
          .order-total { font-weight: 700; color: #10b981; font-size: 1.1rem; }
          .order-status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 500; }
          .status-paid { background: #dcfce7; color: #166534; }
          .status-pending { background: #fef3c7; color: #92400e; }
          .status-cancelled { background: #fee2e2; color: #991b1b; }
          .nav-buttons { display: flex; gap: 15px; margin: 20px 20px; flex-wrap: wrap; }
          .nav-button { padding: 12px 24px; background: #6b7280; color: white; text-decoration: none; border-radius: 10px; font-weight: 500; transition: all 0.3s ease; }
          .nav-button:hover { background: #4b5563; }
          .nav-button.active { background: #3b82f6; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="container">
            <h1>🛒 Gestione Ordini</h1>
            <p>Panoramica completa ordini Viky Store - ${orders.length} ordini totali</p>
          </div>
        </div>
        
        <div class="container">
          <div class="stats-grid">
            <div class="stat-card" style="--color: #10b981;">
              <div class="stat-number">€${totalRevenue.toFixed(2)}</div>
              <div class="stat-label">Fatturato Totale</div>
            </div>
            <div class="stat-card" style="--color: #3b82f6;">
              <div class="stat-number">${orders.length}</div>
              <div class="stat-label">Ordini Totali</div>
            </div>
            <div class="stat-card" style="--color: #22c55e;">
              <div class="stat-number">${paidOrders}</div>
              <div class="stat-label">Ordini Pagati</div>
            </div>
            <div class="stat-card" style="--color: #f59e0b;">
              <div class="stat-number">€${avgOrderValue.toFixed(2)}</div>
              <div class="stat-label">Valore Medio Ordine</div>
            </div>
          </div>
          
          <div class="nav-buttons">
            <a href="/" class="nav-button">🏠 Home</a>
            <a href="/dashboard" class="nav-button">📊 Dashboard</a>
            <a href="/products" class="nav-button">📦 Prodotti</a>
            <a href="/orders" class="nav-button active">🛒 Ordini</a>
            <a href="/customers" class="nav-button">👥 Clienti</a>
            <a href="/claude" class="nav-button">🤖 Analisi AI</a>
          </div>
        </div>
        
        <div class="content-section">
          <h2 style="margin-bottom: 25px;">📋 Lista Ordini Recenti</h2>
          <div class="orders-list">
            ${orders.slice(0, 20).map(order => `
              <div class="order-item">
                <div class="order-header">
                  <div class="order-number">Ordine #${order.order_number || order.id}</div>
                  <div class="order-total">€${order.total_price || '0.00'}</div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div class="order-status status-${order.financial_status || 'pending'}">
                      ${order.financial_status === 'paid' ? '✅ Pagato' : 
                        order.financial_status === 'pending' ? '⏳ In Sospeso' : 
                        order.financial_status === 'cancelled' ? '❌ Annullato' : '📋 ' + (order.financial_status || 'N/D')}
                    </div>
                  </div>
                  <div style="font-size: 0.9rem; color: #64748b;">
                    ${order.created_at ? new Date(order.created_at).toLocaleDateString('it-IT') : 'Data N/D'}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`<div style="padding: 50px; text-align: center;"><h2>❌ Errore caricamento ordini</h2><p>${error.message}</p><a href="/">← Home</a></div>`);
  }
});

// ROUTE CLIENTI - PAGINA RICCA E MODERNA
app.get('/customers', async (req, res) => {
  try {
    const customersData = await shopifyAPI('customers.json?limit=250');
    const customers = customersData?.customers || [];
    
    const totalSpent = customers.reduce((sum, c) => sum + parseFloat(c?.total_spent || 0), 0);
    const avgSpent = customers.length > 0 ? totalSpent / customers.length : 0;
    const topSpenders = customers.filter(c => parseFloat(c?.total_spent || 0) > 100).length;
    const newCustomers = customers.filter(c => {
      const created = new Date(c?.created_at);
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return created > lastMonth;
    }).length;
    
    res.send(`
      <!DOCTYPE html>
      <html lang="it">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Clienti - Viky Store</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; background: #f8fafc; color: #1e293b; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 40px 20px; text-align: center; }
          .header h1 { font-size: 2.8rem; font-weight: 700; margin-bottom: 10px; }
          .container { max-width: 1400px; margin: 0 auto; padding: 0 20px; }
          .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: -40px 20px 40px; position: relative; z-index: 2; }
          .stat-card { background: white; padding: 25px; border-radius: 15px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); text-align: center; border-top: 4px solid var(--color); }
          .stat-number { font-size: 2.2rem; font-weight: 700; color: var(--color); margin-bottom: 8px; }
          .stat-label { color: #64748b; font-size: 0.95rem; }
          .content-section { background: white; border-radius: 20px; padding: 30px; margin: 30px 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
          .customers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; margin-top: 20px; }
          .customer-card { background: #f8fafc; border-radius: 12px; padding: 20px; border-left: 4px solid #8b5cf6; }
          .customer-name { font-weight: 600; color: #1e293b; margin-bottom: 8px; }
          .customer-email { color: #64748b; font-size: 0.9rem; margin-bottom: 10px; }
          .customer-spent { font-weight: 700; color: #10b981; font-size: 1.1rem; }
          .nav-buttons { display: flex; gap: 15px; margin: 20px 20px; flex-wrap: wrap; }
          .nav-button { padding: 12px 24px; background: #6b7280; color: white; text-decoration: none; border-radius: 10px; font-weight: 500; transition: all 0.3s ease; }
          .nav-button:hover { background: #4b5563; }
          .nav-button.active { background: #3b82f6; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="container">
            <h1>👥 Gestione Clienti</h1>
            <p>Database clienti Viky Store - ${customers.length} clienti registrati</p>
          </div>
        </div>
        
        <div class="container">
          <div class="stats-grid">
            <div class="stat-card" style="--color: #8b5cf6;">
              <div class="stat-number">${customers.length}</div>
              <div class="stat-label">Clienti Totali</div>
            </div>
            <div class="stat-card" style="--color: #10b981;">
              <div class="stat-number">€${totalSpent.toFixed(2)}</div>
              <div class="stat-label">Spesa Totale</div>
            </div>
            <div class="stat-card" style="--color: #3b82f6;">
              <div class="stat-number">€${avgSpent.toFixed(2)}</div>
              <div class="stat-label">Spesa Media</div>
            </div>
            <div class="stat-card" style="--color: #f59e0b;">
              <div class="stat-number">${topSpenders}</div>
              <div class="stat-label">Top Spenders</div>
            </div>
          </div>
          
          <div class="nav-buttons">
            <a href="/" class="nav-button">🏠 Home</a>
            <a href="/dashboard" class="nav-button">📊 Dashboard</a>
            <a href="/products" class="nav-button">📦 Prodotti</a>
            <a href="/orders" class="nav-button">🛒 Ordini</a>
            <a href="/customers" class="nav-button active">👥 Clienti</a>
            <a href="/claude" class="nav-button">🤖 Analisi AI</a>
          </div>
        </div>
        
        <div class="content-section">
          <h2 style="margin-bottom: 25px;">📋 Lista Clienti</h2>
          <div class="customers-grid">
            ${customers.slice(0, 50).map(customer => `
              <div class="customer-card">
                <div class="customer-name">${customer.first_name || 'Nome'} ${customer.last_name || 'Cognome'}</div>
                <div class="customer-email">${customer.email || 'Email non disponibile'}</div>
                <div class="customer-spent">Speso: €${customer.total_spent || '0.00'}</div>
                <div style="margin-top: 10px; font-size: 0.9rem; color: #64748b;">
                  Ordini: ${customer.orders_count || 0} | 
                  Registrato: ${customer.created_at ? new Date(customer.created_at).toLocaleDateString('it-IT') : 'N/D'}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`<div style="padding: 50px; text-align: center;"><h2>❌ Errore caricamento clienti</h2><p>${error.message}</p><a href="/">← Home</a></div>`);
  }
});

// ROUTE ANALISI AI CLAUDE - PAGINA COMPLETA
app.get('/claude', async (req, res) => {
  try {
    const [productsData, ordersData, customersData] = await Promise.all([
      shopifyAPI('products.json'),
      shopifyAPI('orders.json?status=any&limit=250'),
      shopifyAPI('customers.json?limit=250')
    ]);

    const products = productsData?.products || [];
    const orders = ordersData?.orders || [];
    const customers = customersData?.customers || [];

    // Analisi avanzata per Claude
    const analysis = {
      negozio: "Viky Store",
      url_negozio: SHOP,
      timestamp: new Date().toISOString(),
      riepilogo_esecutivo: {
        prodotti_totali: products.length,
        prodotti_attivi: products.filter(p => p?.status === 'active').length,
        ordini_totali: orders.length,
        clienti_registrati: customers.length,
        fatturato_totale: orders.reduce((sum, o) => sum + parseFloat(o?.total_price || 0), 0),
        valore_medio_ordine: orders.length > 0 ? (orders.reduce((sum, o) => sum + parseFloat(o?.total_price || 0), 0) / orders.length) : 0
      },
      analisi_prodotti: {
        categorie: [...new Set(products.map(p => p?.product_type).filter(Boolean))],
        range_prezzi: {
          minimo: Math.min(...products.map(p => parseFloat(p?.variants?.[0]?.price || 0))),
          massimo: Math.max(...products.map(p => parseFloat(p?.variants?.[0]?.price || 0))),
          medio: products.length > 0 ? products.reduce((sum, p) => sum + parseFloat(p?.variants?.[0]?.price || 0), 0) / products.length : 0
        },
        gestione_inventario: {
          prodotti_esauriti: products.filter(p => p?.variants?.some(v => (v?.inventory_quantity || 0) === 0)).length,
          scorte_basse: products.filter(p => p?.variants?.some(v => {
            const qty = v?.inventory_quantity || 0;
            return qty > 0 && qty <= 5;
          })).length
        },
        top_5_prodotti: products
          .filter(p => p?.status === 'active')
          .sort((a, b) => (b?.variants?.[0]?.inventory_quantity || 0) - (a?.variants?.[0]?.inventory_quantity || 0))
          .slice(0, 5)
          .map(p => ({
            nome: p.title,
            prezzo: p.variants?.[0]?.price,
            inventario: p.variants?.[0]?.inventory_quantity,
            tipo: p.product_type
          }))
      },
      analisi_vendite: {
        ordini_per_stato: {
          pagati: orders.filter(o => o?.financial_status === 'paid').length,
          in_sospeso: orders.filter(o => o?.financial_status === 'pending').length,
          rimborsi: orders.filter(o => o?.financial_status === 'refunded').length,
          cancellati: orders.filter(o => o?.financial_status === 'cancelled').length
        },
        ultimi_10_ordini: orders.slice(0, 10).map(o => ({
          numero: o.order_number,
          data: o.created_at,
          totale: o.total_price,
          stato: o.financial_status,
          cliente: o.customer?.email || 'Guest'
        })),
        trend_temporale: {
          ordini_ultimo_mese: orders.filter(o => {
            const orderDate = new Date(o.created_at);
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            return orderDate > lastMonth;
          }).length
        }
      },
      analisi_clienti: {
        segmentazione: {
          clienti_vip: customers.filter(c => parseFloat(c?.total_spent || 0) > 500).length,
          clienti_attivi: customers.filter(c => parseFloat(c?.total_spent || 0) > 100).length,
          nuovi_clienti: customers.filter(c => parseFloat(c?.total_spent || 0) < 50).length
        },
        top_10_clienti: customers
          .filter(c => c?.total_spent)
          .sort((a, b) => parseFloat(b.total_spent || 0) - parseFloat(a.total_spent || 0))
          .slice(0, 10)
          .map(c => ({
            nome: `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'Cliente',
            email: c.email,
            ordini: c.orders_count,
            speso: c.total_spent
          })),
        valore_cliente_medio: customers.length > 0 ? customers.reduce((sum, c) => sum + parseFloat(c?.total_spent || 0), 0) / customers.length : 0
      },
      raccomandazioni_ai: [
        "Ottimizza l'inventario per i prodotti con scorte basse",
        "Implementa strategie di retention per clienti VIP",
        "Analizza le categorie prodotto più performanti per espandere l'offerta",
        "Migliora il follow-up sugli ordini in sospeso per aumentare le conversioni",
        "Sviluppa campagne email marketing per aumentare l'AOV (Average Order Value)",
        "Considera programmi fedeltà per i top spenders",
        "Analizza i pattern stagionali per ottimizzare le campagne marketing"
      ],
      insights_automatici: {
        performance_generale: orders.length > 0 ? "Negozio attivo con transazioni regolari" : "Negozio in fase di avvio",
        categoria_dominante: products.length > 0 ? products.reduce((acc, p) => {
          acc[p.product_type || 'Altro'] = (acc[p.product_type || 'Altro'] || 0) + 1;
          return acc;
        }, {}) : {},
        stato_inventario: products.filter(p => p?.variants?.some(v => (v?.inventory_quantity || 0) <= 5)).length > 0 ? "Attenzione alle scorte basse" : "Inventario sotto controllo"
      }
    };

    const jsonData = JSON.stringify(analysis, null, 2);

    res.send(`
      <!DOCTYPE html>
      <html lang="it">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Analisi AI - Viky Store</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; background: #f8fafc; color: #1e293b; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 40px 20px; text-align: center; }
          .header h1 { font-size: 2.8rem; font-weight: 700; margin-bottom: 10px; }
          .container { max-width: 1400px; margin: 0 auto; padding: 0 20px; }
          .content-section { background: white; border-radius: 20px; padding: 30px; margin: 30px 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
          .nav-buttons { display: flex; gap: 15px; margin: 20px 20px; flex-wrap: wrap; }
          .nav-button { padding: 12px 24px; background: #6b7280; color: white; text-decoration: none; border-radius: 10px; font-weight: 500; transition: all 0.3s ease; }
          .nav-button:hover { background: #4b5563; }
          .nav-button.active { background: linear-gradient(135deg, #f59e0b, #d97706); }
          .export-button { background: linear-gradient(135deg, #10b981, #059669); padding: 15px 30px; color: white; border: none; border-radius: 12px; font-weight: 600; font-size: 1.1rem; cursor: pointer; margin: 20px 0; transition: all 0.3s ease; }
          .export-button:hover { background: linear-gradient(135deg, #059669, #047857); transform: translateY(-2px); }
          .data-preview { background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 12px; font-family: 'Monaco', 'Consolas', monospace; font-size: 0.9rem; line-height: 1.6; overflow-x: auto; margin: 20px 0; max-height: 500px; overflow-y: auto; }
          .instructions { background: #fef3c7; border: 1px solid #fbbf24; border-radius: 12px; padding: 20px; margin: 20px 0; }
          .instructions h3 { color: #92400e; margin-bottom: 15px; }
          .instructions ol { margin-left: 20px; }
          .instructions li { margin-bottom: 8px; color: #78350f; }
          .insights-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
          .insight-card { background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 12px; }
          .insight-title { font-weight: 600; color: #1e40af; margin-bottom: 10px; }
          .insight-text { color: #1e3a8a; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="container">
            <h1>🤖 Analisi AI per Claude</h1>
            <p>Dati strutturati e insights intelligenti per l'analisi avanzata</p>
          </div>
        </div>
        
        <div class="container">
          <div class="nav-buttons">
            <a href="/" class="nav-button">🏠 Home</a>
            <a href="/dashboard" class="nav-button">📊 Dashboard</a>
            <a href="/products" class="nav-button">📦 Prodotti</a>
            <a href="/orders" class="nav-button">🛒 Ordini</a>
            <a href="/customers" class="nav-button">👥 Clienti</a>
            <a href="/claude" class="nav-button active">🤖 Analisi AI</a>
          </div>
        </div>
        
        <div class="content-section">
          <h2 style="margin-bottom: 25px; color: #1e293b;">🎯 Dati Pronti per Claude AI</h2>
          
          <div class="instructions">
            <h3>📋 Come usare questi dati con Claude:</h3>
            <ol>
              <li><strong>Copia i dati</strong> cliccando il pulsante "Copia Dati per Claude"</li>
              <li><strong>Vai su Claude.ai</strong> (o usa questa chat se stai già parlando con Claude)</li>
              <li><strong>Incolla i dati</strong> e aggiungi la tua domanda. Esempi:</li>
              <ul style="margin: 10px 0; color: #6b7280;">
                <li>"Analizza questi dati del mio e-commerce e dammi insights actionable"</li>
                <li>"Suggeriscimi 5 strategie concrete per aumentare le vendite"</li>
                <li>"Identifica le maggiori opportunità di miglioramento"</li>
                <li>"Crea un piano marketing basato su questi dati"</li>
                <li>"Quali prodotti dovrei promuovere di più?"</li>
              </ul>
            </ol>
          </div>
          
          <button class="export-button" onclick="copyToClipboard()">
            📋 Copia Dati per Claude AI
          </button>
          
          <div class="insights-grid">
            <div class="insight-card">
              <div class="insight-title">💰 Performance Finanziarie</div>
              <div class="insight-text">
                Fatturato: €${analysis.riepilogo_esecutivo.fatturato_totale.toFixed(2)}<br>
                AOV: €${analysis.riepilogo_esecutivo.valore_medio_ordine.toFixed(2)}<br>
                ${analysis.riepilogo_esecutivo.ordini_totali} ordini processati
              </div>
            </div>
            
            <div class="insight-card">
              <div class="insight-title">📦 Stato Inventario</div>
              <div class="insight-text">
                ${analysis.analisi_prodotti.gestione_inventario.prodotti_esauriti} prodotti esauriti<br>
                ${analysis.analisi_prodotti.gestione_inventario.scorte_basse} con scorte basse<br>
                ${analysis.riepilogo_esecutivo.prodotti_attivi} prodotti attivi
              </div>
            </div>
            
            <div class="insight-card">
              <div class="insight-title">👥 Segmentazione Clienti</div>
              <div class="insight-text">
                ${analysis.analisi_clienti.segmentazione.clienti_vip} clienti VIP (>€500)<br>
                ${analysis.analisi_clienti.segmentazione.clienti_attivi} clienti attivi (>€100)<br>
                Valore medio: €${analysis.analisi_clienti.valore_cliente_medio.toFixed(2)}
              </div>
            </div>
          </div>
          
          <div class="data-preview" id="dataPreview">${jsonData.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
          
          <div style="margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 12px; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1e40af; margin-bottom: 15px;">💡 Prompt Suggerito per Claude:</h3>
            <p style="color: #1e3a8a; font-style: italic; line-height: 1.6;">
              "Analizza questi dati completi del mio e-commerce Viky Store. Forniscimi un report esecutivo dettagliato con: 1) Analisi delle performance attuali e trend, 2) Identificazione di opportunità di crescita specifiche, 3) Raccomandazioni actionable per aumentare vendite e profitti, 4) Strategie di ottimizzazione inventario, 5) Piano di customer retention e crescita. Sii molto specifico nelle raccomandazioni e includi metriche concrete da monitorare."
            </p>
          </div>
        </div>
        
        <script>
          function copyToClipboard() {
            const data = \`${jsonData.replace(/`/g, '\\`').replace(/\$/g, '\\)}\`;
            
            navigator.clipboard.writeText(data).then(function() {
              const button = document.querySelector('.export-button');
              const originalText = button.innerHTML;
              button.innerHTML = '✅ Dati Copiati negli Appunti!';
              button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
              
              setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
              }, 3000);
            }, function(err) {
              console.error('Errore copia:', err);
              // Fallback per browser che non supportano clipboard API
              const textArea = document.createElement('textarea');
              textArea.value = data;
              document.body.appendChild(textArea);
              textArea.select();
              try {
                document.execCommand('copy');
                const button = document.querySelector('.export-button');
                button.innerHTML = '✅ Dati Copiati!';
                setTimeout(() => {
                  button.innerHTML = '📋 Copia Dati per Claude AI';
                }, 3000);
              } catch (err) {
                alert('Errore nella copia. Seleziona manualmente il testo JSON e copialo.');
              }
              document.body.removeChild(textArea);
            });
          }
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`<div style="padding: 50px; text-align: center;"><h2>❌ Errore caricamento analisi AI</h2><p>${error.message}</p><a href="/">← Home</a></div>`);
  }
});

// Mantieni le route originali per compatibilità (ritornano JSON)
app.get('/products-json', async (req, res) => {
  try {
    const data = await shopifyAPI('products.json');
    const products = data.products.map(p => ({
      id: p.id,
      title: p.title,
      price: p.variants[0]?.price || 0,
      inventory: p.variants[0]?.inventory_quantity || 0,
      status: p.status,
      product_type: p.product_type,
      vendor: p.vendor,
      image: p.images[0]?.src || null
    }));

    res.json({
      success: true,
      count: products.length,
      products: products
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/orders-json', async (req, res) => {
  try {
    const data = await shopifyAPI('orders.json?status=any&limit=50');
    res.json({
      success: true,
      count: data.orders.length,
      orders: data.orders.map(o => ({
        id: o.id,
        number: o.order_number,
        date: o.created_at,
        total: o.total_price,
        status: o.financial_status,
        customer: o.customer?.email || 'Guest'
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/customers-json', async (req, res) => {
  try {
    const data = await shopifyAPI('customers.json?limit=50');
    res.json({
      success: true,
      count: data.customers.length,
      customers: data.customers.map(c => ({
        id: c.id,
        email: c.email,
        name: `${c.first_name} ${c.last_name}`,
        orders: c.orders_count,
        spent: c.total_spent
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DASHBOARD - Mantieni quella aggiornata che già funziona
app.get('/dashboard', async (req, res) => {
  try {
    const [productsData, ordersData, customersData] = await Promise.all([
      shopifyAPI('products.json'),
      shopifyAPI('orders.json?status=any&limit=250'),
      shopifyAPI('customers.json?limit=250')
    ]);

    const products = productsData?.products || [];
    const orders = ordersData?.orders || [];
    const customers = customersData?.customers || [];

    // CALCOLI STATISTICHE SICURE
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    
    // Statistiche prodotti sicure
    const activeProducts = products.filter(p => p?.status === 'active').length;
    const outOfStock = products.filter(p => 
      p?.variants && p.variants.some(v => (v?.inventory_quantity || 0) === 0)
    ).length;
    const lowStock = products.filter(p => 
      p?.variants && p.variants.some(v => {
        const qty = v?.inventory_quantity || 0;
        return qty > 0 && qty <= 5;
      })
    ).length;

    // Cliente medio sicuro
    const totalCustomerSpent = customers.reduce((sum, c) => sum + parseFloat(c?.total_spent || 0), 0);
    const averageCustomerValue = customers.length > 0 ? totalCustomerSpent / customers.length : 0;

    // Ordini per stato sicuri
    const ordersByStatus = {
      paid: orders.filter(o => o?.financial_status === 'paid').length,
      pending: orders.filter(o => o?.financial_status === 'pending').length,
      refunded: orders.filter(o => o?.financial_status === 'refunded').length,
      cancelled: orders.filter(o => o?.financial_status === 'cancelled').length
    };

    // Top prodotti sicuri
    const topProducts = products
      .filter(p => p?.status === 'active' && p?.variants && p.variants.length > 0)
      .sort((a, b) => {
        const aQty = a.variants[0]?.inventory_quantity || 0;
        const bQty = b.variants[0]?.inventory_quantity || 0;
        return bQty - aQty;
      })
      .slice(0, 5);

    // Top clienti sicuri
    const topCustomers = customers
      .filter(c => c?.total_spent)
      .sort((a, b) => parseFloat(b.total_spent || 0) - parseFloat(a.total_spent || 0))
      .slice(0, 5);

    // Trend ultimi 7 giorni sicuro
    const now = new Date();
    const dailyData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayOrders = orders.filter(o => {
        if (!o?.created_at) return false;
        const orderDate = new Date(o.created_at);
        return orderDate.toDateString() === date.toDateString();
      });
      
      dailyData.push({
        date: date.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric' }),
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, o) => sum + parseFloat(o?.total_price || 0), 0)
      });
    }

    res.send(`
      <!DOCTYPE html>
      <html lang="it">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard Analytics - Viky Store</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: #f8fafc;
            color: #1e293b;
            line-height: 1.6;
          }
          
          .header {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          
          .header h1 {
            font-size: 2.8rem;
            font-weight: 700;
            margin-bottom: 10px;
          }
          
          .header p {
            font-size: 1.1rem;
            opacity: 0.9;
          }
          
          .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 20px;
          }
          
          .main-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
            margin: -40px 20px 40px;
            position: relative;
            z-index: 2;
          }
          
          .stat-card {
            background: white;
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.08);
            text-align: center;
            border-top: 4px solid var(--accent-color);
            transition: transform 0.3s ease;
          }
          
          .stat-card:hover {
            transform: translateY(-5px);
          }
          
          .stat-icon {
            font-size: 2.5rem;
            margin-bottom: 15px;
            opacity: 0.8;
          }
          
          .stat-number {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 8px;
            color: var(--accent-color);
          }
          
          .stat-label {
            color: #64748b;
            font-size: 0.95rem;
            font-weight: 500;
            margin-bottom: 10px;
          }
          
          .stat-change {
            font-size: 0.85rem;
            padding: 4px 12px;
            border-radius: 20px;
            font-weight: 500;
            background: #dcfce7;
            color: #166534;
          }
          
          .stat-card:nth-child(1) { --accent-color: #10b981; }
          .stat-card:nth-child(2) { --accent-color: #3b82f6; }
          .stat-card:nth-child(3) { --accent-color: #8b5cf6; }
          .stat-card:nth-child(4) { --accent-color: #f59e0b; }
          .stat-card:nth-child(5) { --accent-color: #ef4444; }
          .stat-card:nth-child(6) { --accent-color: #06b6d4; }
          
          .content-section {
            background: white;
            border-radius: 20px;
            padding: 30px;
            margin: 30px 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          }
          
          .section-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 25px;
            color: #1e293b;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .chart-container {
            position: relative;
            height: 400px;
            margin: 20px 0;
          }
          
          .nav-buttons {
            display: flex;
            gap: 15px;
            margin: 20px 20px;
            flex-wrap: wrap;
          }
          
          .nav-button {
            padding: 12px 24px;
            background: #3b82f6;
            color: white;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 500;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .nav-button:hover {
            background: #2563eb;
            transform: translateY(-2px);
          }
          
          .nav-button.secondary { background: #6b7280; }
          .nav-button.claude { background: linear-gradient(135deg, #f59e0b, #d97706); }
          
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
          }
          
          .stats-item {
            padding: 20px;
            background: #f8fafc;
            border-radius: 12px;
            text-align: center;
          }
          
          .stats-number {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 5px;
            color: #1e293b;
          }
          
          .stats-label {
            font-size: 0.9rem;
            color: #64748b;
          }
          
          @media (max-width: 768px) {
            .main-stats { grid-template-columns: repeat(2, 1fr); margin: -20px 10px 20px; }
            .nav-buttons { margin: 20px 10px; flex-direction: column; }
            .content-section { margin: 20px 10px; padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="container">
            <h1>📊 Dashboard Analytics</h1>
            <p>Panoramica completa delle performance Viky Store</p>
          </div>
        </div>
        
        <div class="container">
          <div class="main-stats">
            <div class="stat-card">
              <div class="stat-icon">💰</div>
              <div class="stat-number">€${totalRevenue.toFixed(2)}</div>
              <div class="stat-label">Fatturato Totale</div>
              <div class="stat-change">Performance positiva</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">🛒</div>
              <div class="stat-number">${orders.length}</div>
              <div class="stat-label">Ordini Totali</div>
              <div class="stat-change">Crescita costante</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-number">${customers.length}</div>
              <div class="stat-label">Clienti Registrati</div>
              <div class="stat-change">Base clienti solida</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">📈</div>
              <div class="stat-number">€${avgOrderValue.toFixed(2)}</div>
              <div class="stat-label">Valore Medio Ordine</div>
              <div class="stat-change">AOV ottimale</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">📦</div>
              <div class="stat-number">${activeProducts}</div>
              <div class="stat-label">Prodotti Attivi</div>
              <div class="stat-change">${lowStock} scorte basse</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">⭐</div>
              <div class="stat-number">€${averageCustomerValue.toFixed(2)}</div>
              <div class="stat-label">Valore Cliente Medio</div>
              <div class="stat-change">LTV crescente</div>
            </div>
          </div>
          
          <div class="nav-buttons">
            <a href="/" class="nav-button secondary">🏠 Home</a>
            <a href="/products" class="nav-button">📦 Prodotti</a>
            <a href="/orders" class="nav-button">🛒 Ordini</a>
            <a href="/customers" class="nav-button">👥 Clienti</a>
            <a href="/claude" class="nav-button claude">🤖 Analisi AI</a>
          </div>
        </div>
        
        <div class="content-section">
          <h2 class="section-title">📈 Trend Vendite (Ultimi 7 giorni)</h2>
          <div class="chart-container">
            <canvas id="salesChart"></canvas>
          </div>
        </div>
        
        <div class="content-section">
          <h2 class="section-title">📊 Statistiche Business</h2>
          <div class="stats-grid">
            <div class="stats-item">
              <div class="stats-number" style="color: #10b981;">${ordersByStatus.paid}</div>
              <div class="stats-label">Ordini Pagati</div>
            </div>
            <div class="stats-item">
              <div class="stats-number" style="color: #f59e0b;">${ordersByStatus.pending}</div>
              <div class="stats-label">In Sospeso</div>
            </div>
            <div class="stats-item">
              <div class="stats-number" style="color: #ef4444;">${ordersByStatus.refunded}</div>
              <div class="stats-label">Rimborsati</div>
            </div>
            <div class="stats-item">
              <div class="stats-number" style="color: #8b5cf6;">${outOfStock}</div>
              <div class="stats-label">Prodotti Esauriti</div>
            </div>
          </div>
        </div>
        
        <script>
          // Configura grafico vendite
          const ctx = document.getElementById('salesChart').getContext('2d');
          const dailyData = ${JSON.stringify(dailyData)};
          
          new Chart(ctx, {
            type: 'line',
            data: {
              labels: dailyData.map(d => d.date),
              datasets: [{
                label: 'Fatturato (€)',
                data: dailyData.map(d => d.revenue),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6
              }, {
                label: 'Ordini',
                data: dailyData.map(d => d.orders),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                fill: false,
                tension: 0.4,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                yAxisID: 'y1'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    usePointStyle: true,
                    font: { weight: 'bold' }
                  }
                }
              },
              scales: {
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  title: {
                    display: true,
                    text: 'Fatturato (€)',
                    font: { weight: 'bold' }
                  }
                },
                y1: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  title: {
                    display: true,
                    text: 'Numero Ordini',
                    font: { weight: 'bold' }
                  },
                  grid: { drawOnChartArea: false }
                }
              }
            }
          });
        </script>
      </body>
      </html>
    `);

  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).send(`
      <div style="padding: 50px; text-align: center; font-family: Arial, sans-serif;">
        <h2>❌ Errore nel caricamento dashboard</h2>
        <p><strong>Errore:</strong> ${error.message}</p>
        <p><strong>Debug:</strong> Controllare i log del server per dettagli</p>
        <a href="/" style="color: #3b82f6; text-decoration: none; font-weight: bold;">← Torna alla Home</a>
      </div>
    `);
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    shop: SHOP,
    timestamp: new Date().toISOString() 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Viky Store Analytics online sulla porta ${PORT}`);
});

module.exports = app;
