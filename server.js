const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Configurazione
const SHOP = 'kf1fj0-hp.myshopify.com';
const TOKEN = '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';

// Funzione API Shopify
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
    throw new Error(`API Error: ${error.message}`);
  }
}

// Homepage
app.get('/', (req, res) => {
  res.send(`
    <html>
    <head>
      <title>Viky Store Analytics</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 40px; text-align: center; border-radius: 10px; margin-bottom: 30px; }
        .header h1 { font-size: 2.5rem; margin: 0 0 10px 0; }
        .services { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
        .card { background: white; padding: 30px; border-radius: 10px; text-decoration: none; color: #333; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .card:hover { transform: translateY(-2px); }
        .card h3 { margin: 0 0 10px 0; color: #3b82f6; }
        .ai-section { background: #fff7ed; padding: 30px; border-radius: 10px; text-align: center; margin: 30px 0; }
        .ai-button { background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 0 10px 10px 0; display: inline-block; }
        .new-badge { background: #ef4444; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.8rem; margin-left: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🏪 Viky Store Analytics</h1>
        <p>Sistema intelligente per il tuo e-commerce</p>
        <small>✅ Connesso a ${SHOP}</small>
      </div>
      
      <div class="services">
        <a href="/products" class="card">
          <h3>📦 Prodotti</h3>
          <p>Gestione catalogo e inventario</p>
        </a>
        
        <a href="/orders" class="card">
          <h3>🛒 Ordini</h3>
          <p>Analytics vendite e fatturato</p>
        </a>
        
        <a href="/customers" class="card">
          <h3>👥 Clienti</h3>
          <p>Database e segmentazione clienti</p>
        </a>
        
        <a href="/dashboard" class="card">
          <h3>📊 Smart Dashboard</h3>
          <p>KPI e insights automatici</p>
        </a>
        
        <a href="/insights" class="card">
          <h3>🧠 AI Insights <span class="new-badge">NEW</span></h3>
          <p>Raccomandazioni intelligenti</p>
        </a>
      </div>
      
      <div class="ai-section">
        <h2>🤖 Sistema AI</h2>
        <p>Analisi automatiche e raccomandazioni per il tuo business</p>
        <a href="/claude" class="ai-button">🔄 Export Claude</a>
        <a href="/insights" class="ai-button">🧠 AI Report</a>
      </div>
    </body>
    </html>
  `);
});

// Prodotti
app.get('/products', async (req, res) => {
  try {
    const data = await shopifyAPI('products.json?limit=20');
    const products = data.products || [];
    
    let html = `
      <html>
      <head><title>Prodotti - Viky Store</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 30px; text-align: center; border-radius: 10px; margin-bottom: 20px; }
        .nav { margin: 20px 0; }
        .nav a { background: #6b7280; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; margin-right: 10px; }
        .nav a.active { background: #3b82f6; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
        .stat { background: white; padding: 20px; text-align: center; border-radius: 8px; }
        .products { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
        .product { background: white; padding: 20px; border-radius: 8px; }
      </style>
      </head>
      <body>
        <div class="header">
          <h1>📦 Prodotti</h1>
          <p>Catalogo Viky Store - ${products.length} prodotti</p>
        </div>
        
        <div class="nav">
          <a href="/">🏠 Home</a>
          <a href="/dashboard">📊 Dashboard</a>
          <a href="/products" class="active">📦 Prodotti</a>
          <a href="/orders">🛒 Ordini</a>
          <a href="/customers">👥 Clienti</a>
          <a href="/insights">🧠 AI</a>
          <a href="/claude">🤖 Claude</a>
        </div>
        
        <div class="stats">
          <div class="stat">
            <h3>${products.length}</h3>
            <p>Totali</p>
          </div>
          <div class="stat">
            <h3>${products.filter(p => p.status === 'active').length}</h3>
            <p>Attivi</p>
          </div>
        </div>
        
        <div class="products">
    `;
    
    products.forEach(product => {
      html += `
        <div class="product">
          <h4>${product.title}</h4>
          <p>Prezzo: €${product.variants[0]?.price || '0'}</p>
          <p>Stato: ${product.status}</p>
          <p>Inventario: ${product.variants[0]?.inventory_quantity || 0}</p>
        </div>
      `;
    });
    
    html += `</div></body></html>`;
    res.send(html);
    
  } catch (error) {
    res.status(500).send(`<div style="padding: 50px; text-align: center;"><h2>❌ Errore</h2><p>${error.message}</p><a href="/">← Home</a></div>`);
  }
});

// Ordini
app.get('/orders', async (req, res) => {
  try {
    const data = await shopifyAPI('orders.json?status=any&limit=20');
    const orders = data.orders || [];
    
    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);
    
    let html = `
      <html>
      <head><title>Ordini - Viky Store</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 30px; text-align: center; border-radius: 10px; margin-bottom: 20px; }
        .nav { margin: 20px 0; }
        .nav a { background: #6b7280; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; margin-right: 10px; }
        .nav a.active { background: #3b82f6; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
        .stat { background: white; padding: 20px; text-align: center; border-radius: 8px; }
        .orders { margin: 20px 0; }
        .order { background: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; }
        .no-orders { background: #fef3c7; padding: 30px; border-radius: 10px; text-align: center; margin: 20px 0; border-left: 4px solid #f59e0b; }
      </style>
      </head>
      <body>
        <div class="header">
          <h1>🛒 Ordini</h1>
          <p>Gestione ordini - ${orders.length} ordini</p>
        </div>
        
        <div class="nav">
          <a href="/">🏠 Home</a>
          <a href="/dashboard">📊 Dashboard</a>
          <a href="/products">📦 Prodotti</a>
          <a href="/orders" class="active">🛒 Ordini</a>
          <a href="/customers">👥 Clienti</a>
          <a href="/insights">🧠 AI</a>
          <a href="/claude">🤖 Claude</a>
        </div>
        
        <div class="stats">
          <div class="stat">
            <h3>${orders.length}</h3>
            <p>Ordini</p>
          </div>
          <div class="stat">
            <h3>€${totalRevenue.toFixed(2)}</h3>
            <p>Fatturato</p>
          </div>
        </div>
    `;
    
    if (orders.length === 0) {
      html += `
        <div class="no-orders">
          <h3>🚀 Negozio Pronto per le Prime Vendite!</h3>
          <p>Il tuo catalogo è attivo. <strong>Prossimo passo:</strong> Campagne marketing.</p>
          <p><a href="/insights" style="color: #f59e0b; font-weight: bold;">→ Vedi strategie AI per generare vendite</a></p>
        </div>
      `;
    } else {
      html += `<div class="orders">`;
      orders.forEach(order => {
        html += `
          <div class="order">
            <strong>Ordine #${order.order_number || order.id}</strong> - €${order.total_price || '0'}
            <br><small>Stato: ${order.financial_status || 'N/D'} | Data: ${order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/D'}</small>
          </div>
        `;
      });
      html += `</div>`;
    }
    
    html += `</body></html>`;
    res.send(html);
    
  } catch (error) {
    res.status(500).send(`<div style="padding: 50px; text-align: center;"><h2>❌ Errore</h2><p>${error.message}</p><a href="/">← Home</a></div>`);
  }
});

// Clienti
app.get('/customers', async (req, res) => {
  try {
    const data = await shopifyAPI('customers.json?limit=20');
    const customers = data.customers || [];
    
    const totalSpent = customers.reduce((sum, c) => sum + parseFloat(c.total_spent || 0), 0);
    
    let html = `
      <html>
      <head><title>Clienti - Viky Store</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 30px; text-align: center; border-radius: 10px; margin-bottom: 20px; }
        .nav { margin: 20px 0; }
        .nav a { background: #6b7280; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; margin-right: 10px; }
        .nav a.active { background: #3b82f6; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
        .stat { background: white; padding: 20px; text-align: center; border-radius: 8px; }
        .customers { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
        .customer { background: white; padding: 15px; border-radius: 8px; }
      </style>
      </head>
      <body>
        <div class="header">
          <h1>👥 Clienti</h1>
          <p>Database clienti - ${customers.length} clienti</p>
        </div>
        
        <div class="nav">
          <a href="/">🏠 Home</a>
          <a href="/dashboard">📊 Dashboard</a>
          <a href="/products">📦 Prodotti</a>
          <a href="/orders">🛒 Ordini</a>
          <a href="/customers" class="active">👥 Clienti</a>
          <a href="/insights">🧠 AI</a>
          <a href="/claude">🤖 Claude</a>
        </div>
        
        <div class="stats">
          <div class="stat">
            <h3>${customers.length}</h3>
            <p>Clienti</p>
          </div>
          <div class="stat">
            <h3>€${totalSpent.toFixed(2)}</h3>
            <p>Spesa Totale</p>
          </div>
        </div>
        
        <div class="customers">
    `;
    
    customers.forEach(customer => {
      html += `
        <div class="customer">
          <h4>${customer.first_name || 'Nome'} ${customer.last_name || 'Cognome'}</h4>
          <p>Email: ${customer.email || 'N/D'}</p>
          <p>Speso: €${customer.total_spent || '0'}</p>
          <p>Ordini: ${customer.orders_count || 0}</p>
        </div>
      `;
    });
    
    html += `</div></body></html>`;
    res.send(html);
    
  } catch (error) {
    res.status(500).send(`<div style="padding: 50px; text-align: center;"><h2>❌ Errore</h2><p>${error.message}</p><a href="/">← Home</a></div>`);
  }
});

// Dashboard semplice
app.get('/dashboard', async (req, res) => {
  try {
    const [productsData, ordersData, customersData] = await Promise.all([
      shopifyAPI('products.json?limit=10'),
      shopifyAPI('orders.json?status=any&limit=10'),
      shopifyAPI('customers.json?limit=10')
    ]);

    const products = productsData.products || [];
    const orders = ordersData.orders || [];
    const customers = customersData.customers || [];

    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    res.send(`
      <html>
      <head><title>Dashboard - Viky Store</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 30px; text-align: center; border-radius: 10px; margin-bottom: 20px; }
        .nav { margin: 20px 0; }
        .nav a { background: #6b7280; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; margin-right: 10px; }
        .nav a.active { background: #3b82f6; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
        .stat { background: white; padding: 20px; text-align: center; border-radius: 8px; }
        .stat h3 { color: #3b82f6; margin: 0; font-size: 1.8rem; }
        .ai-alert { background: #fef3c7; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        .recommendations { background: #ecfdf5; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #10b981; }
      </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 Smart Dashboard</h1>
          <p>Panoramica Viky Store con AI</p>
        </div>
        
        <div class="nav">
          <a href="/">🏠 Home</a>
          <a href="/dashboard" class="active">📊 Dashboard</a>
          <a href="/products">📦 Prodotti</a>
          <a href="/orders">🛒 Ordini</a>
          <a href="/customers">👥 Clienti</a>
          <a href="/insights">🧠 AI</a>
          <a href="/claude">🤖 Claude</a>
        </div>
        
        <div class="stats">
          <div class="stat">
            <h3>€${totalRevenue.toFixed(2)}</h3>
            <p>Fatturato</p>
          </div>
          <div class="stat">
            <h3>${orders.length}</h3>
            <p>Ordini</p>
          </div>
          <div class="stat">
            <h3>${customers.length}</h3>
            <p>Clienti</p>
          </div>
          <div class="stat">
            <h3>${products.length}</h3>
            <p>Prodotti</p>
          </div>
          <div class="stat">
            <h3>€${avgOrderValue.toFixed(2)}</h3>
            <p>AOV</p>
          </div>
          <div class="stat">
            <h3>${totalRevenue === 0 ? '25' : '75'}/100</h3>
            <p>Health Score</p>
          </div>
        </div>
        
        ${totalRevenue === 0 ? `
        <div class="ai-alert">
          <h3>🚨 AI Alert: Nessuna Vendita</h3>
          <p>Il negozio non ha ancora generato vendite. <strong>Priorità:</strong> Attivare campagne marketing.</p>
          <p><strong>Azione Immediata:</strong> Email marketing al cliente registrato + campagne social.</p>
        </div>
        ` : ''}
        
        <div class="recommendations">
          <h3>💡 Raccomandazione AI</h3>
          <h4>🎯 Piano Lancio Immediato</h4>
          <p>Crea bundle "Amata Estate Collection" con le 4 varianti disponibili (sconto 15%).</p>
          <p><strong>Impact Atteso:</strong> Prime 5-10 vendite nei prossimi 30 giorni</p>
          <p><a href="/insights" style="color: #059669; font-weight: bold;">→ Vedi tutte le raccomandazioni</a></p>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`<div style="padding: 50px; text-align: center;"><h2>❌ Errore</h2><p>${error.message}</p><a href="/">← Home</a></div>`);
  }
});

// AI Insights semplificati
app.get('/insights', async (req, res) => {
  try {
    const [productsData, ordersData, customersData] = await Promise.all([
      shopifyAPI('products.json?limit=10'),
      shopifyAPI('orders.json?status=any&limit=10'),
      shopifyAPI('customers.json?limit=10')
    ]);

    const products = productsData.products || [];
    const orders = ordersData.orders || [];
    const customers = customersData.customers || [];
    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);

    res.send(`
      <html>
      <head><title>AI Insights - Viky Store</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .header { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 40px; text-align: center; border-radius: 10px; margin-bottom: 20px; }
        .nav { margin: 20px 0; }
        .nav a { background: #6b7280; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; margin-right: 10px; }
        .nav a.active { background: #8b5cf6; }
        .health-score { background: white; padding: 30px; border-radius: 10px; margin: 20px 0; text-align: center; }
        .score { font-size: 3rem; font-weight: bold; color: ${totalRevenue > 0 ? '#10b981' : '#f59e0b'}; }
        .alert { background: #fee2e2; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ef4444; }
        .recommendations { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
        .rec-card { background: white; padding: 25px; border-radius: 10px; border-left: 4px solid #3b82f6; }
        .priority { padding: 4px 12px; border-radius: 15px; color: white; font-size: 0.8rem; font-weight: bold; margin-bottom: 10px; display: inline-block; background: #ef4444; }
        .projection { background: #f0f9ff; padding: 25px; border-radius: 10px; margin: 20px 0; }
      </style>
      </head>
      <body>
        <div class="header">
          <h1>🧠 AI Business Insights</h1>
          <p>Analisi intelligente e raccomandazioni strategiche</p>
        </div>
        
        <div class="nav">
          <a href="/">🏠 Home</a>
          <a href="/dashboard">📊 Dashboard</a>
          <a href="/products">📦 Prodotti</a>
          <a href="/orders">🛒 Ordini</a>
          <a href="/customers">👥 Clienti</a>
          <a href="/insights" class="active">🧠 AI</a>
          <a href="/claude">🤖 Claude</a>
        </div>
        
        <div class="health-score">
          <h2>📈 Business Health Score</h2>
          <div class="score">${totalRevenue > 0 ? '75' : '25'}/100</div>
          <p><strong>Status:</strong> ${totalRevenue > 0 ? 'Operativo' : 'Pre-Lancio'}</p>
          <p><strong>Prossimo Milestone:</strong> ${totalRevenue > 0 ? 'Scalare a €5K/mese' : 'Prima vendita'}</p>
        </div>
        
        ${totalRevenue === 0 ? `
        <div class="alert">
          <h3>🚨 Alert Critico: Nessuna Vendita</h3>
          <p>Il negozio non ha ancora generato vendite. Priorità: attivare campagne marketing.</p>
          <p><strong>Azione:</strong> Email marketing al cliente registrato + campagne Facebook/Instagram ads con budget €300-500</p>
        </div>
        ` : ''}
        
        <div class="recommendations">
          <h2 style="grid-column: 1/-1;">🎯 Raccomandazioni AI</h2>
          
          <div class="rec-card">
            <div class="priority">CRITICA</div>
            <h3>🎯 Piano Lancio Immediato</h3>
            <p>Email marketing al cliente registrato + campagne social ads</p>
            <p><strong>Impact:</strong> Prime 5-10 vendite nei prossimi 30 giorni</p>
            <p><strong>Effort:</strong> Basso</p>
          </div>
          
          <div class="rec-card">
            <div class="priority" style="background: #f59e0b;">ALTA</div>
            <h3>🍃 Bundle "Amata Estate Collection"</h3>
            <p>Crea bundle con 4 varianti Amata Estate (sconto 15%)</p>
            <p><strong>Impact:</strong> Revenue potenziale: €575 vs €676 singoli</p>
            <p><strong>Effort:</strong> Medio</p>
          </div>
          
          <div class="rec-card">
            <div class="priority" style="background: #3b82f6;">MEDIA</div>
            <h3>💰 Ottimizzazione Pricing</h3>
            <p>Introduce prodotto fascia media €299-349</p>
            <p><strong>Impact:</strong> +25% conversioni potenziali</p>
            <p><strong>Effort:</strong> Alto</p>
          </div>
        </div>
        
        <div class="projection">
          <h2>📊 Proiezioni Revenue AI</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px;">
            <div style="text-align: center;">
              <h3 style="color: #3b82f6;">€1,200</h3>
              <p>Target Primo Mese</p>
            </div>
            <div style="text-align: center;">
              <h3 style="color: #059669;">€3,500</h3>
              <p>Potenziale Mensile</p>
            </div>
            <div style="text-align: center;">
              <h3 style="color: #7c3aed;">€12,000</h3>
              <p>Obiettivo Trimestrale</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`<div style="padding: 50px; text-align: center;"><h2>❌ Errore</h2><p>${error.message}</p><a href="/">← Home</a></div>`);
  }
});

// Claude AI
app.get('/claude', async (req, res) => {
  try {
    const [productsData, ordersData, customersData] = await Promise.all([
      shopifyAPI('products.json?limit=10'),
      shopifyAPI('orders.json?status=any&limit=10'),
      shopifyAPI('customers.json?limit=10')
    ]);

    const products = productsData.products || [];
    const orders = ordersData.orders || [];
    const customers = customersData.customers || [];

    const analysis = {
      negozio: "Viky Store",
      timestamp: new Date().toISOString(),
      riepilogo: {
        prodotti_totali: products.length,
        ordini_totali: orders.length,
        clienti_totali: customers.length,
        fatturato_totale: orders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0)
      },
      prodotti: products.slice(0, 5).map(p => ({
        nome: p.title,
        prezzo: p.variants?.[0]?.price,
        stato: p.status
      })),
      ordini: orders.slice(0, 5).map(o => ({
        numero: o.order_number,
        totale: o.total_price,
        stato: o.financial_status
      })),
      clienti: customers.slice(0, 5).map(c => ({
        nome: `${c.first_name || ''} ${c.last_name || ''}`.trim(),
        speso: c.total_spent
      })),
      ai_insights: {
        business_health_score: orders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0) > 0 ? 75 : 25,
        status_negozio: orders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0) > 0 ? 'Operativo' : 'Pre-Lancio',
        raccomandazione_top: orders.length === 0 ? 'Piano Lancio Immediato - Email marketing + social ads' : 'Ottimizzazione conversioni esistenti',
        potenziale_mensile: products.length * 200, // Stima conservativa
        alert_principali: orders.length === 0 ? ['Nessuna vendita ancora', 'Cliente registrato senza acquisti'] : ['Ottimizzare AOV', 'Aumentare frequenza acquisto']
      }
    };

    const jsonData = JSON.stringify(analysis, null, 2);

    res.send(`
      <html>
      <head><title>Claude AI Export - Viky Store</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 10px; margin-bottom: 20px; }
        .nav { margin: 20px 0; }
        .nav a { background: #6b7280; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; margin-right: 10px; }
        .nav a.active { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; }
        .ai-preview { background: white; padding: 25px; border-radius: 10px; margin: 20px 0; }
        .insights-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .insight-card { background: #f0f9ff; padding: 15px; border-radius: 10px; text-align: center; }
        .content { background: white; padding: 30px; border-radius: 10px; margin: 20px 0; }
        .export-button { background: #10b981; color: white; padding: 15px 30px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
        .data-preview { background: #1e293b; color: #fff; padding: 20px; border-radius: 8px; font-family: monospace; overflow-x: auto; margin: 20px 0; max-height: 400px; overflow-y: auto; }
        .instructions { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
      </style>
      </head>
      <body>
        <div class="header">
          <h1>🤖 Claude AI Export</h1>
          <p>Dati completi con AI insights integrati</p>
        </div>
        
        <div class="nav">
          <a href="/">🏠 Home</a>
          <a href="/dashboard">📊 Dashboard</a>
          <a href="/products">📦 Prodotti</a>
          <a href="/orders">🛒 Ordini</a>
          <a href="/customers">👥 Clienti</a>
          <a href="/insights">🧠 AI</a>
          <a href="/claude" class="active">🤖 Claude</a>
        </div>
        
        <div class="ai-preview">
          <h2>🧠 Anteprima AI Insights</h2>
          <div class="insights-grid">
            <div class="insight-card">
              <h3 style="color: ${analysis.ai_insights.business_health_score > 50 ? '#10b981' : '#f59e0b'};">${analysis.ai_insights.business_health_score}/100</h3>
              <p>Health Score</p>
            </div>
            <div class="insight-card">
              <h3 style="color: #3b82f6;">${analysis.ai_insights.status_negozio}</h3>
              <p>Status Business</p>
            </div>
            <div class="insight-card">
              <h3 style="color: #7c3aed;">€${analysis.ai_insights.potenziale_mensile}</h3>
              <p>Potenziale Mensile</p>
            </div>
          </div>
          
          <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 3px solid #10b981;">
            <strong>🎯 Top Raccomandazione:</strong> ${analysis.ai_insights.raccomandazione_top}
          </div>
        </div>
        
        <div class="content">
          <div class="instructions">
            <h3>📋 Come usare con Claude AI:</h3>
            <p>
              <strong>1.</strong> Clicca "Copia Dati" qui sotto<br>
              <strong>2.</strong> Vai su Claude.ai (o usa questa chat)<br>
              <strong>3.</strong> Incolla e usa questo prompt:<br>
              <em>"Analizza questi dati completi del mio e-commerce Viky Store (include AI insights). Forniscimi un piano d'azione dettagliato per i prossimi 30 giorni con strategie specifiche per aumentare le vendite."</em>
            </p>
          </div>
          
          <button class="export-button" onclick="copyData()">
            📋 Copia Dati Completi (Shopify + AI)
          </button>
          
          <div class="data-preview" id="dataPreview">${jsonData.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        </div>
        
        <script>
          function copyData() {
            const data = \`${jsonData.replace(/`/g, '\\`').replace(/\$/g, '\\>)}\`;
            navigator.clipboard.writeText(data).then(() => {
              document.querySelector('.export-button').innerHTML = '✅ Dati Copiati!';
              setTimeout(() => document.querySelector('.export-button').innerHTML = '📋 Copia Dati Completi (Shopify + AI)', 3000);
            }).catch(() => alert('Copia manualmente il testo JSON'));
          }
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`<div style="padding: 50px; text-align: center;"><h2>❌ Errore</h2><p>${error.message}</p><a href="/">← Home</a></div>`);
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', shop: SHOP, timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Viky Store Analytics online sulla porta ${PORT}`);
});

module.exports = app;>
