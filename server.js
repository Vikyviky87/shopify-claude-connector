const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Configurazione - CREDENZIALI HARDCODED
const SHOP = 'kf1fj0-hp.myshopify.com';
const TOKEN = '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';

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

// Homepage
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="it">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Viky Store - Claude Analytics</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', sans-serif; background: #f8fafc; color: #1e293b; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 60px 20px; text-align: center; }
            .header h1 { font-size: 3rem; font-weight: 700; margin-bottom: 16px; }
            .header p { font-size: 1.2rem; opacity: 0.9; margin-bottom: 30px; }
            .status { background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 25px; display: inline-block; }
            .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
            .services { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; margin: 50px 0; }
            .service-card { background: white; padding: 40px; border-radius: 20px; text-decoration: none; color: inherit; transition: transform 0.3s; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .service-card:hover { transform: translateY(-5px); }
            .service-icon { font-size: 3rem; margin-bottom: 20px; }
            .service-title { font-size: 1.5rem; font-weight: 600; margin-bottom: 15px; }
            .service-desc { color: #64748b; line-height: 1.6; }
            .ai-section { background: linear-gradient(135deg, #fff7ed, #fef3c7); padding: 50px; border-radius: 20px; text-align: center; margin: 40px 0; }
            .ai-title { font-size: 2.5rem; font-weight: 700; color: #92400e; margin-bottom: 20px; }
            .ai-desc { color: #b45309; font-size: 1.1rem; margin-bottom: 30px; }
            .ai-button { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; display: inline-block; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🏪 Viky Store Analytics</h1>
            <p>Integrazione intelligente tra Viky Store e Claude AI</p>
            <div class="status">✅ Connesso a ${SHOP}</div>
        </div>
        
        <div class="container">
            <div class="services">
                <a href="/products" class="service-card">
                    <div class="service-icon">📦</div>
                    <h3 class="service-title">Prodotti</h3>
                    <p class="service-desc">Gestione completa del catalogo con statistiche e inventario</p>
                </a>
                
                <a href="/orders" class="service-card">
                    <div class="service-icon">🛒</div>
                    <h3 class="service-title">Ordini</h3>
                    <p class="service-desc">Analytics vendite e gestione ordini con metriche avanzate</p>
                </a>
                
                <a href="/customers" class="service-card">
                    <div class="service-icon">👥</div>
                    <h3 class="service-title">Clienti</h3>
                    <p class="service-desc">Database clienti con segmentazione e analisi comportamentale</p>
                </a>
                
                <a href="/dashboard" class="service-card">
                    <div class="service-icon">📊</div>
                    <h3 class="service-title">Dashboard</h3>
                    <p class="service-desc">Vista d'insieme con KPI e statistiche complete</p>
                </a>
            </div>
            
            <div class="ai-section">
                <h2 class="ai-title">🤖 Analisi AI</h2>
                <p class="ai-desc">Genera insights avanzati con Claude AI per ottimizzare le performance del tuo e-commerce</p>
                <a href="/claude" class="ai-button">🧠 Avvia Analisi AI</a>
            </div>
        </div>
    </body>
    </html>
  `);
});

// Prodotti
app.get('/products', async (req, res) => {
  try {
    const data = await shopifyAPI('products.json');
    const products = data?.products || [];
    
    const activeProducts = products.filter(p => p?.status === 'active').length;
    const totalInventory = products.reduce((sum, p) => {
      return sum + (p?.variants?.reduce((vSum, v) => vSum + (v?.inventory_quantity || 0), 0) || 0);
    }, 0);
    
    res.send(`
      <!DOCTYPE html>
      <html lang="it">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Prodotti - Viky Store</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; background: #f8fafc; color: #1e293b; }
          .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 40px 20px; text-align: center; }
          .header h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 10px; }
          .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
          .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
          .stat-card { background: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .stat-number { font-size: 2rem; font-weight: 700; color: #3b82f6; }
          .stat-label { color: #64748b; margin-top: 5px; }
          .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
          .product-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .product-title { font-weight: 600; margin-bottom: 10px; }
          .product-price { font-size: 1.2rem; font-weight: 700; color: #10b981; }
          .nav-buttons { display: flex; gap: 10px; margin: 20px 0; flex-wrap: wrap; }
          .nav-button { padding: 10px 20px; background: #6b7280; color: white; text-decoration: none; border-radius: 8px; }
          .nav-button:hover { background: #4b5563; }
          .nav-button.active { background: #3b82f6; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📦 Prodotti</h1>
          <p>Catalogo Viky Store - ${products.length} prodotti</p>
        </div>
        
        <div class="container">
          <div class="nav-buttons">
            <a href="/" class="nav-button">🏠 Home</a>
            <a href="/dashboard" class="nav-button">📊 Dashboard</a>
            <a href="/products" class="nav-button active">📦 Prodotti</a>
            <a href="/orders" class="nav-button">🛒 Ordini</a>
            <a href="/customers" class="nav-button">👥 Clienti</a>
            <a href="/claude" class="nav-button">🤖 AI</a>
          </div>
          
          <div class="stats">
            <div class="stat-card">
              <div class="stat-number">${products.length}</div>
              <div class="stat-label">Prodotti Totali</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${activeProducts}</div>
              <div class="stat-label">Prodotti Attivi</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${totalInventory}</div>
              <div class="stat-label">Inventario Totale</div>
            </div>
          </div>
          
          <div class="products-grid">
            ${products.slice(0, 20).map(product => `
              <div class="product-card">
                <div class="product-title">${product.title || 'Prodotto'}</div>
                <div class="product-price">€${product.variants?.[0]?.price || '0.00'}</div>
                <div style="margin-top: 10px; color: #64748b; font-size: 0.9rem;">
                  Stato: ${product.status || 'N/D'}<br>
                  Inventario: ${product.variants?.[0]?.inventory_quantity || 0}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`<div style="padding: 50px; text-align: center;"><h2>❌ Errore prodotti</h2><p>${error.message}</p><a href="/">← Home</a></div>`);
  }
});

// Ordini
app.get('/orders', async (req, res) => {
  try {
    const data = await shopifyAPI('orders.json?status=any&limit=100');
    const orders = data?.orders || [];
    
    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);
    const paidOrders = orders.filter(o => o?.financial_status === 'paid').length;
    
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
          .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 40px 20px; text-align: center; }
          .header h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 10px; }
          .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
          .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
          .stat-card { background: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .stat-number { font-size: 2rem; font-weight: 700; color: #3b82f6; }
          .stat-label { color: #64748b; margin-top: 5px; }
          .orders-list { margin: 20px 0; }
          .order-item { background: white; padding: 20px; border-radius: 12px; margin-bottom: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
          .order-number { font-weight: 600; }
          .order-total { font-weight: 700; color: #10b981; }
          .nav-buttons { display: flex; gap: 10px; margin: 20px 0; flex-wrap: wrap; }
          .nav-button { padding: 10px 20px; background: #6b7280; color: white; text-decoration: none; border-radius: 8px; }
          .nav-button:hover { background: #4b5563; }
          .nav-button.active { background: #3b82f6; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🛒 Ordini</h1>
          <p>Gestione ordini Viky Store - ${orders.length} ordini</p>
        </div>
        
        <div class="container">
          <div class="nav-buttons">
            <a href="/" class="nav-button">🏠 Home</a>
            <a href="/dashboard" class="nav-button">📊 Dashboard</a>
            <a href="/products" class="nav-button">📦 Prodotti</a>
            <a href="/orders" class="nav-button active">🛒 Ordini</a>
            <a href="/customers" class="nav-button">👥 Clienti</a>
            <a href="/claude" class="nav-button">🤖 AI</a>
          </div>
          
          <div class="stats">
            <div class="stat-card">
              <div class="stat-number">${orders.length}</div>
              <div class="stat-label">Ordini Totali</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">€${totalRevenue.toFixed(2)}</div>
              <div class="stat-label">Fatturato</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${paidOrders}</div>
              <div class="stat-label">Ordini Pagati</div>
            </div>
          </div>
          
          <div class="orders-list">
            ${orders.slice(0, 15).map(order => `
              <div class="order-item">
                <div class="order-header">
                  <div class="order-number">Ordine #${order.order_number || order.id}</div>
                  <div class="order-total">€${order.total_price || '0.00'}</div>
                </div>
                <div style="color: #64748b; font-size: 0.9rem;">
                  Stato: ${order.financial_status || 'N/D'} | 
                  Data: ${order.created_at ? new Date(order.created_at).toLocaleDateString('it-IT') : 'N/D'}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`<div style="padding: 50px; text-align: center;"><h2>❌ Errore ordini</h2><p>${error.message}</p><a href="/">← Home</a></div>`);
  }
});

// Clienti
app.get('/customers', async (req, res) => {
  try {
    const data = await shopifyAPI('customers.json?limit=100');
    const customers = data?.customers || [];
    
    const totalSpent = customers.reduce((sum, c) => sum + parseFloat(c?.total_spent || 0), 0);
    const avgSpent = customers.length > 0 ? totalSpent / customers.length : 0;
    
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
          .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 40px 20px; text-align: center; }
          .header h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 10px; }
          .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
          .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
          .stat-card { background: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .stat-number { font-size: 2rem; font-weight: 700; color: #3b82f6; }
          .stat-label { color: #64748b; margin-top: 5px; }
          .customers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
          .customer-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .customer-name { font-weight: 600; margin-bottom: 8px; }
          .customer-email { color: #64748b; font-size: 0.9rem; margin-bottom: 10px; }
          .customer-spent { font-weight: 700; color: #10b981; }
          .nav-buttons { display: flex; gap: 10px; margin: 20px 0; flex-wrap: wrap; }
          .nav-button { padding: 10px 20px; background: #6b7280; color: white; text-decoration: none; border-radius: 8px; }
          .nav-button:hover { background: #4b5563; }
          .nav-button.active { background: #3b82f6; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>👥 Clienti</h1>
          <p>Database clienti Viky Store - ${customers.length} clienti</p>
        </div>
        
        <div class="container">
          <div class="nav-buttons">
            <a href="/" class="nav-button">🏠 Home</a>
            <a href="/dashboard" class="nav-button">📊 Dashboard</a>
            <a href="/products" class="nav-button">📦 Prodotti</a>
            <a href="/orders" class="nav-button">🛒 Ordini</a>
            <a href="/customers" class="nav-button active">👥 Clienti</a>
            <a href="/claude" class="nav-button">🤖 AI</a>
          </div>
          
          <div class="stats">
            <div class="stat-card">
              <div class="stat-number">${customers.length}</div>
              <div class="stat-label">Clienti Totali</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">€${totalSpent.toFixed(2)}</div>
              <div class="stat-label">Spesa Totale</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">€${avgSpent.toFixed(2)}</div>
              <div class="stat-label">Spesa Media</div>
            </div>
          </div>
          
          <div class="customers-grid">
            ${customers.slice(0, 20).map(customer => `
              <div class="customer-card">
                <div class="customer-name">${customer.first_name || 'Nome'} ${customer.last_name || 'Cognome'}</div>
                <div class="customer-email">${customer.email || 'Email N/D'}</div>
                <div class="customer-spent">Speso: €${customer.total_spent || '0.00'}</div>
                <div style="margin-top: 10px; color: #64748b; font-size: 0.9rem;">
                  Ordini: ${customer.orders_count || 0}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`<div style="padding: 50px; text-align: center;"><h2>❌ Errore clienti</h2><p>${error.message}</p><a href="/">← Home</a></div>`);
  }
});

// Dashboard
app.get('/dashboard', async (req, res) => {
  try {
    const [productsData, ordersData, customersData] = await Promise.all([
      shopifyAPI('products.json'),
      shopifyAPI('orders.json?status=any&limit=100'),
      shopifyAPI('customers.json?limit=100')
    ]);

    const products = productsData?.products || [];
    const orders = ordersData?.orders || [];
    const customers = customersData?.customers || [];

    // Analisi semplificata per Claude
    const analysis = {
      negozio: "Viky Store",
      timestamp: new Date().toISOString(),
      riepilogo: {
        prodotti_totali: products.length,
        prodotti_attivi: products.filter(p => p?.status === 'active').length,
        ordini_totali: orders.length,
        clienti_totali: customers.length,
        fatturato_totale: orders.reduce((sum, o) => sum + parseFloat(o?.total_price || 0), 0),
        valore_medio_ordine: orders.length > 0 ? (orders.reduce((sum, o) => sum + parseFloat(o?.total_price || 0), 0) / orders.length) : 0
      },
      top_prodotti: products.slice(0, 5).map(p => ({
        nome: p.title,
        prezzo: p.variants?.[0]?.price,
        inventario: p.variants?.[0]?.inventory_quantity,
        stato: p.status
      })),
      ordini_recenti: orders.slice(0, 5).map(o => ({
        numero: o.order_number,
        data: o.created_at,
        totale: o.total_price,
        stato: o.financial_status
      })),
      top_clienti: customers
        .sort((a, b) => parseFloat(b.total_spent || 0) - parseFloat(a.total_spent || 0))
        .slice(0, 5)
        .map(c => ({
          nome: `${c.first_name || ''} ${c.last_name || ''}`.trim(),
          email: c.email,
          speso: c.total_spent,
          ordini: c.orders_count
        })),
      raccomandazioni: [
        "Analizza i prodotti con inventario basso per riordini",
        "Implementa strategie di retention per i top clienti",
        "Ottimizza i prezzi basandoti sulle performance di vendita",
        "Migliora il follow-up sugli ordini in sospeso",
        "Sviluppa campagne per aumentare l'Average Order Value"
      ]
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
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 40px 20px; text-align: center; }
          .header h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 10px; }
          .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
          .nav-buttons { display: flex; gap: 10px; margin: 20px 0; flex-wrap: wrap; }
          .nav-button { padding: 10px 20px; background: #6b7280; color: white; text-decoration: none; border-radius: 8px; }
          .nav-button:hover { background: #4b5563; }
          .nav-button.active { background: linear-gradient(135deg, #f59e0b, #d97706); }
          .content-section { background: white; border-radius: 12px; padding: 30px; margin: 20px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
          .export-button { background: linear-gradient(135deg, #10b981, #059669); padding: 15px 30px; color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; margin: 20px 0; }
          .export-button:hover { background: linear-gradient(135deg, #059669, #047857); }
          .data-preview { background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 10px; font-family: monospace; font-size: 0.9rem; overflow-x: auto; margin: 20px 0; max-height: 400px; overflow-y: auto; }
          .instructions { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 10px; margin: 20px 0; }
          .instructions h3 { color: #92400e; margin-bottom: 15px; }
          .instructions p { color: #78350f; line-height: 1.6; }
          .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
          .stat-item { background: #f0f9ff; padding: 15px; border-radius: 8px; text-align: center; }
          .stat-number { font-size: 1.5rem; font-weight: 700; color: #3b82f6; }
          .stat-label { color: #64748b; font-size: 0.9rem; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🤖 Analisi AI</h1>
          <p>Dati ottimizzati per Claude AI</p>
        </div>
        
        <div class="container">
          <div class="nav-buttons">
            <a href="/" class="nav-button">🏠 Home</a>
            <a href="/dashboard" class="nav-button">📊 Dashboard</a>
            <a href="/products" class="nav-button">📦 Prodotti</a>
            <a href="/orders" class="nav-button">🛒 Ordini</a>
            <a href="/customers" class="nav-button">👥 Clienti</a>
            <a href="/claude" class="nav-button active">🤖 AI</a>
          </div>
          
          <div class="content-section">
            <h2>🎯 Riepilogo Performance</h2>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-number">€${analysis.riepilogo.fatturato_totale.toFixed(2)}</div>
                <div class="stat-label">Fatturato</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">${analysis.riepilogo.ordini_totali}</div>
                <div class="stat-label">Ordini</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">${analysis.riepilogo.clienti_totali}</div>
                <div class="stat-label">Clienti</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">€${analysis.riepilogo.valore_medio_ordine.toFixed(2)}</div>
                <div class="stat-label">AOV</div>
              </div>
            </div>
          </div>
          
          <div class="content-section">
            <div class="instructions">
              <h3>📋 Come usare con Claude AI:</h3>
              <p>
                1. Clicca "Copia Dati" per copiare l'analisi completa<br>
                2. Vai su Claude.ai o usa questa chat<br>
                3. Incolla i dati e chiedi: "Analizza questi dati del mio e-commerce e suggeriscimi strategie per migliorare le vendite"
              </p>
            </div>
            
            <button class="export-button" onclick="copyToClipboard()">
              📋 Copia Dati per Claude AI
            </button>
            
            <div class="data-preview" id="dataPreview">${jsonData.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
          </div>
        </div>
        
        <script>
          function copyToClipboard() {
            const data = \`${jsonData.replace(/`/g, '\\`').replace(/\$/g, '\\?.products || [];
    const orders = ordersData?.orders || [];
    const customers = customersData?.customers || [];

    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    const activeProducts = products.filter(p => p?.status === 'active').length;

    res.send(`
      <!DOCTYPE html>
      <html lang="it">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard - Viky Store</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; background: #f8fafc; color: #1e293b; }
          .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 40px 20px; text-align: center; }
          .header h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 10px; }
          .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
          .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
          .stat-card { background: white; padding: 25px; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
          .stat-number { font-size: 2.2rem; font-weight: 700; color: #3b82f6; margin-bottom: 8px; }
          .stat-label { color: #64748b; font-size: 0.95rem; }
          .nav-buttons { display: flex; gap: 10px; margin: 20px 0; flex-wrap: wrap; }
          .nav-button { padding: 10px 20px; background: #6b7280; color: white; text-decoration: none; border-radius: 8px; }
          .nav-button:hover { background: #4b5563; }
          .nav-button.active { background: #3b82f6; }
          .overview { background: white; padding: 30px; border-radius: 12px; margin: 20px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
          .overview h2 { margin-bottom: 20px; color: #1e293b; }
          .overview-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; }
          .overview-item { text-align: center; padding: 15px; background: #f8fafc; border-radius: 8px; }
          .overview-number { font-size: 1.5rem; font-weight: 700; color: #059669; }
          .overview-label { color: #64748b; font-size: 0.9rem; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 Dashboard</h1>
          <p>Panoramica completa Viky Store</p>
        </div>
        
        <div class="container">
          <div class="nav-buttons">
            <a href="/" class="nav-button">🏠 Home</a>
            <a href="/dashboard" class="nav-button active">📊 Dashboard</a>
            <a href="/products" class="nav-button">📦 Prodotti</a>
            <a href="/orders" class="nav-button">🛒 Ordini</a>
            <a href="/customers" class="nav-button">👥 Clienti</a>
            <a href="/claude" class="nav-button">🤖 AI</a>
          </div>
          
          <div class="stats">
            <div class="stat-card">
              <div class="stat-number">€${totalRevenue.toFixed(2)}</div>
              <div class="stat-label">Fatturato Totale</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${orders.length}</div>
              <div class="stat-label">Ordini Totali</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${customers.length}</div>
              <div class="stat-label">Clienti</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${activeProducts}</div>
              <div class="stat-label">Prodotti Attivi</div>
            </div>
          </div>
          
          <div class="overview">
            <h2>📈 Metriche Chiave</h2>
            <div class="overview-grid">
              <div class="overview-item">
                <div class="overview-number">€${avgOrderValue.toFixed(2)}</div>
                <div class="overview-label">AOV</div>
              </div>
              <div class="overview-item">
                <div class="overview-number">${orders.filter(o => o?.financial_status === 'paid').length}</div>
                <div class="overview-label">Pagati</div>
              </div>
              <div class="overview-item">
                <div class="overview-number">${orders.filter(o => o?.financial_status === 'pending').length}</div>
                <div class="overview-label">In Sospeso</div>
              </div>
              <div class="overview-item">
                <div class="overview-number">${products.filter(p => p?.status === 'draft').length}</div>
                <div class="overview-label">Bozze Prodotti</div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`<div style="padding: 50px; text-align: center;"><h2>❌ Errore dashboard</h2><p>${error.message}</p><a href="/">← Home</a></div>`);
  }
});

// Claude AI
app.get('/claude', async (req, res) => {
  try {
    const [productsData, ordersData, customersData] = await Promise.all([
      shopifyAPI('products.json'),
      shopifyAPI('orders.json?status=any&limit=50'),
      shopifyAPI('customers.json?limit=50')
    ]);

    const products = productsData)}\`;
            
            navigator.clipboard.writeText(data).then(function() {
              const button = document.querySelector('.export-button');
              button.innerHTML = '✅ Dati Copiati!';
              button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
              
              setTimeout(() => {
                button.innerHTML = '📋 Copia Dati per Claude AI';
              }, 3000);
            }).catch(function(err) {
              alert('Copia manualmente il testo JSON qui sotto');
            });
          }
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`<div style="padding: 50px; text-align: center;"><h2>❌ Errore analisi AI</h2><p>${error.message}</p><a href="/">← Home</a></div>`);
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

module.exports = app;?.products || [];
    const orders = ordersData?.orders || [];
    const customers = customersData?.customers || [];

    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    const activeProducts = products.filter(p => p?.status === 'active').length;

    res.send(`
      <!DOCTYPE html>
      <html lang="it">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard - Viky Store</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; background: #f8fafc; color: #1e293b; }
          .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 40px 20px; text-align: center; }
          .header h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 10px; }
          .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
          .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
          .stat-card { background: white; padding: 25px; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
          .stat-number { font-size: 2.2rem; font-weight: 700; color: #3b82f6; margin-bottom: 8px; }
          .stat-label { color: #64748b; font-size: 0.95rem; }
          .nav-buttons { display: flex; gap: 10px; margin: 20px 0; flex-wrap: wrap; }
          .nav-button { padding: 10px 20px; background: #6b7280; color: white; text-decoration: none; border-radius: 8px; }
          .nav-button:hover { background: #4b5563; }
          .nav-button.active { background: #3b82f6; }
          .overview { background: white; padding: 30px; border-radius: 12px; margin: 20px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
          .overview h2 { margin-bottom: 20px; color: #1e293b; }
          .overview-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; }
          .overview-item { text-align: center; padding: 15px; background: #f8fafc; border-radius: 8px; }
          .overview-number { font-size: 1.5rem; font-weight: 700; color: #059669; }
          .overview-label { color: #64748b; font-size: 0.9rem; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 Dashboard</h1>
          <p>Panoramica completa Viky Store</p>
        </div>
        
        <div class="container">
          <div class="nav-buttons">
            <a href="/" class="nav-button">🏠 Home</a>
            <a href="/dashboard" class="nav-button active">📊 Dashboard</a>
            <a href="/products" class="nav-button">📦 Prodotti</a>
            <a href="/orders" class="nav-button">🛒 Ordini</a>
            <a href="/customers" class="nav-button">👥 Clienti</a>
            <a href="/claude" class="nav-button">🤖 AI</a>
          </div>
          
          <div class="stats">
            <div class="stat-card">
              <div class="stat-number">€${totalRevenue.toFixed(2)}</div>
              <div class="stat-label">Fatturato Totale</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${orders.length}</div>
              <div class="stat-label">Ordini Totali</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${customers.length}</div>
              <div class="stat-label">Clienti</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${activeProducts}</div>
              <div class="stat-label">Prodotti Attivi</div>
            </div>
          </div>
          
          <div class="overview">
            <h2>📈 Metriche Chiave</h2>
            <div class="overview-grid">
              <div class="overview-item">
                <div class="overview-number">€${avgOrderValue.toFixed(2)}</div>
                <div class="overview-label">AOV</div>
              </div>
              <div class="overview-item">
                <div class="overview-number">${orders.filter(o => o?.financial_status === 'paid').length}</div>
                <div class="overview-label">Pagati</div>
              </div>
              <div class="overview-item">
                <div class="overview-number">${orders.filter(o => o?.financial_status === 'pending').length}</div>
                <div class="overview-label">In Sospeso</div>
              </div>
              <div class="overview-item">
                <div class="overview-number">${products.filter(p => p?.status === 'draft').length}</div>
                <div class="overview-label">Bozze Prodotti</div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`<div style="padding: 50px; text-align: center;"><h2>❌ Errore dashboard</h2><p>${error.message}</p><a href="/">← Home</a></div>`);
  }
});

// Claude AI
app.get('/claude', async (req, res) => {
  try {
    const [productsData, ordersData, customersData] = await Promise.all([
      shopifyAPI('products.json'),
      shopifyAPI('orders.json?status=any&limit=50'),
      shopifyAPI('customers.json?limit=50')
    ]);

    const products = productsData
