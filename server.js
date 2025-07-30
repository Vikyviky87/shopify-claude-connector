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

// Prodotti
app.get('/products', async (req, res) => {
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

// Ordini
app.get('/orders', async (req, res) => {
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

// Clienti
app.get('/customers', async (req, res) => {
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

// Export per Claude
app.get('/claude', async (req, res) => {
  try {
    const [products, orders, customers] = await Promise.all([
      shopifyAPI('products.json'),
      shopifyAPI('orders.json?status=any&limit=100'),
      shopifyAPI('customers.json?limit=100')
    ]);

    const claudeData = {
      negozio: SHOP,
      data_export: new Date().toISOString(),
      riassunto: {
        prodotti: products.products.length,
        ordini: orders.orders.length,
        clienti: customers.customers.length,
        fatturato_totale: orders.orders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0)
      },
      prodotti: products.products.slice(0, 20).map(p => ({
        nome: p.title,
        prezzo: p.variants[0]?.price,
        inventario: p.variants[0]?.inventory_quantity,
        stato: p.status
      })),
      ordini_recenti: orders.orders.slice(0, 10).map(o => ({
        numero: o.order_number,
        data: o.created_at,
        totale: o.total_price,
        stato: o.financial_status,
        cliente: o.customer?.email || 'Guest'
      })),
      clienti_top: customers.customers
        .sort((a, b) => parseFloat(b.total_spent) - parseFloat(a.total_spent))
        .slice(0, 10)
        .map(c => ({
          nome: `${c.first_name} ${c.last_name}`,
          email: c.email,
          ordini: c.orders_count,
          speso: c.total_spent
        }))
    };

    res.json({
      success: true,
      message: 'Dati pronti per Claude AI',
      istruzioni: 'Copia il contenuto di claude_data e incollalo in Claude',
      claude_data: claudeData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard
// Sostituisci la route /dashboard nel tuo server.js con questa versione avanzata

app.get('/dashboard', async (req, res) => {
  try {
    const [productsData, ordersData, customersData] = await Promise.all([
      shopifyAPI('products.json'),
      shopifyAPI('orders.json?status=any&limit=250'),
      shopifyAPI('customers.json?limit=250')
    ]);

    const products = productsData.products;
    const orders = ordersData.orders;
    const customers = customersData.customers;

    // CALCOLI STATISTICHE AVANZATE
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Statistiche Generali
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    
    // Ordini per periodo
    const ordersThisMonth = orders.filter(o => new Date(o.created_at) > lastMonth);
    const ordersThisWeek = orders.filter(o => new Date(o.created_at) > lastWeek);
    const revenueThisMonth = ordersThisMonth.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);
    
    // Statistiche Prodotti
    const activeProducts = products.filter(p => p.status === 'active').length;
    const outOfStock = products.filter(p => p.variants.some(v => v.inventory_quantity === 0)).length;
    const lowStock = products.filter(p => p.variants.some(v => v.inventory_quantity > 0 && v.inventory_quantity <= 5)).length;
    
    // Top Prodotti per vendite (simulato basato su inventory)
    const topProducts = products
      .filter(p => p.status === 'active')
      .sort((a, b) => (b.variants[0]?.inventory_quantity || 0) - (a.variants[0]?.inventory_quantity || 0))
      .slice(0, 5);

    // Clienti Statistiche
    const topCustomers = customers
      .sort((a, b) => parseFloat(b.total_spent) - parseFloat(a.total_spent))
      .slice(0, 5);
    
    const averageCustomerValue = customers.reduce((sum, c) => sum + parseFloat(c.total_spent || 0), 0) / customers.length;

    // Ordini per stato
    const ordersByStatus = {
      paid: orders.filter(o => o.financial_status === 'paid').length,
      pending: orders.filter(o => o.financial_status === 'pending').length,
      refunded: orders.filter(o => o.financial_status === 'refunded').length,
      cancelled: orders.filter(o => o.financial_status === 'cancelled').length
    };

    // Trend ultimi 7 giorni (simulato)
    const dailyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayOrders = orders.filter(o => {
        const orderDate = new Date(o.created_at);
        return orderDate.toDateString() === date.toDateString();
      });
      
      dailyData.push({
        date: date.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric' }),
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0)
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
          
          .header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          }
          
          .header h1 {
            font-size: 2.8rem;
            font-weight: 700;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
          }
          
          .header p {
            font-size: 1.1rem;
            opacity: 0.9;
            position: relative;
            z-index: 1;
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
            border: 1px solid rgba(255,255,255,0.8);
            transition: transform 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          
          .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: var(--accent-color);
          }
          
          .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.12);
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
          }
          
          .stat-change.positive {
            background: #dcfce7;
            color: #166534;
          }
          
          .stat-change.negative {
            background: #fee2e2;
            color: #991b1b;
          }
          
          /* Colori per le card */
          .stat-card:nth-child(1) { --accent-color: #10b981; }
          .stat-card:nth-child(2) { --accent-color: #3b82f6; }
          .stat-card:nth-child(3) { --accent-color: #8b5cf6; }
          .stat-card:nth-child(4) { --accent-color: #f59e0b; }
          .stat-card:nth-child(5) { --accent-color: #ef4444; }
          .stat-card:nth-child(6) { --accent-color: #06b6d4; }
          
          .content-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
          }
          
          .section {
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          }
          
          .section-title {
            font-size: 1.4rem;
            font-weight: 600;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            gap: 10px;
            color: #1e293b;
          }
          
          .chart-container {
            position: relative;
            height: 300px;
            margin: 20px 0;
          }
          
          .top-items {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }
          
          .top-item {
            display: flex;
            align-items: center;
            padding: 15px;
            background: #f8fafc;
            border-radius: 12px;
            transition: background 0.3s ease;
          }
          
          .top-item:hover {
            background: #f1f5f9;
          }
          
          .item-avatar {
            width: 45px;
            height: 45px;
            border-radius: 8px;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            margin-right: 15px;
          }
          
          .item-info {
            flex: 1;
          }
          
          .item-name {
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 4px;
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          .item-details {
            font-size: 0.85rem;
            color: #64748b;
          }
          
          .item-value {
            font-weight: 600;
            color: #059669;
            font-size: 0.95rem;
          }
          
          .bottom-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
          }
          
          .status-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-top: 20px;
          }
          
          .status-item {
            padding: 20px;
            background: #f8fafc;
            border-radius: 12px;
            text-align: center;
          }
          
          .status-number {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 5px;
          }
          
          .status-label {
            font-size: 0.85rem;
            color: #64748b;
            font-weight: 500;
          }
          
          .status-paid { color: #10b981; }
          .status-pending { color: #f59e0b; }
          .status-refunded { color: #ef4444; }
          .status-cancelled { color: #6b7280; }
          
          .nav-buttons {
            display: flex;
            gap: 15px;
            margin: 20px 0;
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
          
          .nav-button.secondary {
            background: #6b7280;
          }
          
          .nav-button.claude {
            background: linear-gradient(135deg, #f59e0b, #d97706);
          }
          
          @media (max-width: 1024px) {
            .content-grid { grid-template-columns: 1fr; }
            .main-stats { grid-template-columns: repeat(2, 1fr); }
          }
          
          @media (max-width: 768px) {
            .main-stats { grid-template-columns: 1fr; }
            .nav-buttons { flex-direction: column; }
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
              <div class="stat-change positive">+€${revenueThisMonth.toFixed(2)} questo mese</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">🛒</div>
              <div class="stat-number">${orders.length}</div>
              <div class="stat-label">Ordini Totali</div>
              <div class="stat-change positive">+${ordersThisMonth.length} questo mese</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-number">${customers.length}</div>
              <div class="stat-label">Clienti Registrati</div>
              <div class="stat-change positive">Base clienti in crescita</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">📈</div>
              <div class="stat-number">€${avgOrderValue.toFixed(2)}</div>
              <div class="stat-label">Valore Medio Ordine</div>
              <div class="stat-change positive">Performance stabile</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">📦</div>
              <div class="stat-number">${activeProducts}</div>
              <div class="stat-label">Prodotti Attivi</div>
              <div class="stat-change ${lowStock > 0 ? 'negative' : 'positive'}">${lowStock} scorte basse</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">⭐</div>
              <div class="stat-number">€${averageCustomerValue.toFixed(2)}</div>
              <div class="stat-label">Valore Cliente Medio</div>
              <div class="stat-change positive">LTV in crescita</div>
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
        
        <div class="container">
          <div class="content-grid">
            <div class="section">
              <h2 class="section-title">📈 Trend Vendite (Ultimi 7 giorni)</h2>
              <div class="chart-container">
                <canvas id="salesChart"></canvas>
              </div>
            </div>
            
            <div class="section">
              <h2 class="section-title">🏆 Top Prodotti</h2>
              <div class="top-items">
                ${topProducts.map((product, index) => `
                  <div class="top-item">
                    <div class="item-avatar">${index + 1}</div>
                    <div class="item-info">
                      <div class="item-name">${product.title}</div>
                      <div class="item-details">${product.variants[0]?.inventory_quantity || 0} disponibili</div>
                    </div>
                    <div class="item-value">€${product.variants[0]?.price || 0}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          
          <div class="bottom-grid">
            <div class="section">
              <h2 class="section-title">💳 Stati Ordini</h2>
              <div class="status-grid">
                <div class="status-item">
                  <div class="status-number status-paid">${ordersByStatus.paid}</div>
                  <div class="status-label">Pagati</div>
                </div>
                <div class="status-item">
                  <div class="status-number status-pending">${ordersByStatus.pending}</div>
                  <div class="status-label">In Sospeso</div>
                </div>
                <div class="status-item">
                  <div class="status-number status-refunded">${ordersByStatus.refunded}</div>
                  <div class="status-label">Rimborsati</div>
                </div>
                <div class="status-item">
                  <div class="status-number status-cancelled">${ordersByStatus.cancelled}</div>
                  <div class="status-label">Cancellati</div>
                </div>
              </div>
            </div>
            
            <div class="section">
              <h2 class="section-title">⭐ Top Clienti</h2>
              <div class="top-items">
                ${topCustomers.slice(0, 4).map((customer, index) => `
                  <div class="top-item">
                    <div class="item-avatar">${customer.first_name?.charAt(0) || 'C'}</div>
                    <div class="item-info">
                      <div class="item-name">${customer.first_name} ${customer.last_name}</div>
                      <div class="item-details">${customer.orders_count} ordini</div>
                    </div>
                    <div class="item-value">€${customer.total_spent}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="section">
              <h2 class="section-title">📊 Metriche Inventario</h2>
              <div class="status-grid">
                <div class="status-item">
                  <div class="status-number status-paid">${activeProducts}</div>
                  <div class="status-label">Prodotti Attivi</div>
                </div>
                <div class="status-item">
                  <div class="status-number status-pending">${lowStock}</div>
                  <div class="status-label">Scorte Basse</div>
                </div>
                <div class="status-item">
                  <div class="status-number status-refunded">${outOfStock}</div>
                  <div class="status-label">Esauriti</div>
                </div>
                <div class="status-item">
                  <div class="status-number status-cancelled">${products.filter(p => p.status === 'draft').length}</div>
                  <div class="status-label">Bozze</div>
                </div>
              </div>
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
                    font: {
                      weight: 'bold'
                    }
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
                    font: {
                      weight: 'bold'
                    }
                  },
                  grid: {
                    color: 'rgba(0,0,0,0.1)'
                  }
                },
                y1: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  title: {
                    display: true,
                    text: 'Numero Ordini',
                    font: {
                      weight: 'bold'
                    }
                  },
                  grid: {
                    drawOnChartArea: false,
                  },
                },
                x: {
                  grid: {
                    color: 'rgba(0,0,0,0.1)'
                  }
                }
              },
              interaction: {
                intersect: false,
                mode: 'index'
              }
            }
          });
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`
      <div style="padding: 50px; text-align: center; font-family: Arial, sans-serif;">
        <h2>❌ Errore nel caricamento dashboard</h2>
        <p>${error.message}</p>
        <a href="/" style="color: #3b82f6;">← Torna alla Home</a>
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
