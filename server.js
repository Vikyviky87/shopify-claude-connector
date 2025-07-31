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
        .ai-button { background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🏪 Viky Store Analytics</h1>
        <p>Dashboard intelligente per il tuo e-commerce</p>
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
          <h3>📊 Dashboard</h3>
          <p>Panoramica completa KPI</p>
        </a>
      </div>
      
      <div class="ai-section">
        <h2>🤖 Analisi AI</h2>
        <p>Esporta i dati per analisi avanzate con Claude AI</p>
        <a href="/claude" class="ai-button">Genera Report AI</a>
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
          <a href="/claude">🤖 AI</a>
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
          <a href="/claude">🤖 AI</a>
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
        
        <div class="orders">
    `;
    
    orders.forEach(order => {
      html += `
        <div class="order">
          <strong>Ordine #${order.order_number || order.id}</strong> - €${order.total_price || '0'}
          <br><small>Stato: ${order.financial_status || 'N/D'} | Data: ${order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/D'}</small>
        </div>
      `;
    });
    
    html += `</div></body></html>`;
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
          <a href="/claude">🤖 AI</a>
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

// Dashboard
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
      </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 Dashboard</h1>
          <p>Panoramica Viky Store</p>
        </div>
        
        <div class="nav">
          <a href="/">🏠 Home</a>
          <a href="/dashboard" class="active">📊 Dashboard</a>
          <a href="/products">📦 Prodotti</a>
          <a href="/orders">🛒 Ordini</a>
          <a href="/customers">👥 Clienti</a>
          <a href="/claude">🤖 AI</a>
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
            <h3>${products.filter(p => p.status === 'active').length}</h3>
            <p>Prodotti Attivi</p>
          </div>
          <div class="stat">
            <h3>€${avgOrderValue.toFixed(2)}</h3>
            <p>AOV</p>
          </div>
          <div class="stat">
            <h3>${orders.filter(o => o.financial_status === 'paid').length}</h3>
            <p>Pagati</p>
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
      }))
    };

    const jsonData = JSON.stringify(analysis, null, 2);

    res.send(`
      <html>
      <head><title>Analisi AI - Viky Store</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 10px; margin-bottom: 20px; }
        .nav { margin: 20px 0; }
        .nav a { background: #6b7280; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; margin-right: 10px; }
        .nav a.active { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; }
        .content { background: white; padding: 30px; border-radius: 10px; margin: 20px 0; }
        .export-button { background: #10b981; color: white; padding: 15px 30px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
        .data-preview { background: #1e293b; color: #fff; padding: 20px; border-radius: 8px; font-family: monospace; overflow-x: auto; margin: 20px 0; max-height: 400px; overflow-y: auto; }
        .instructions { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
      </style>
      </head>
      <body>
        <div class="header">
          <h1>🤖 Analisi AI</h1>
          <p>Export dati per Claude AI</p>
        </div>
        
        <div class="nav">
          <a href="/">🏠 Home</a>
          <a href="/dashboard">📊 Dashboard</a>
          <a href="/products">📦 Prodotti</a>
          <a href="/orders">🛒 Ordini</a>
          <a href="/customers">👥 Clienti</a>
          <a href="/claude" class="active">🤖 AI</a>
        </div>
        
        <div class="content">
          <div class="instructions">
            <h3>📋 Come usare:</h3>
            <p>1. Copia i dati JSON qui sotto<br>
            2. Vai su Claude.ai<br>
            3. Incolla e chiedi: "Analizza questi dati e suggeriscimi strategie per il mio e-commerce"</p>
          </div>
          
          <button class="export-button" onclick="copyData()">📋 Copia Dati</button>
          
          <div class="data-preview" id="dataPreview">${jsonData.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        </div>
        
        <script>
          function copyData() {
            const data = \`${jsonData.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
            navigator.clipboard.writeText(data).then(() => {
              document.querySelector('.export-button').innerHTML = '✅ Copiato!';
              setTimeout(() => document.querySelector('.export-button').innerHTML = '📋 Copia Dati', 2000);
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

module.exports = app;
