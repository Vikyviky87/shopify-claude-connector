const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Configurazione - CREDENZIALI HARDCODED
const SHOP = 'kf1fj0-hp.myshopify.com';
const TOKEN = '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';

// Homepage
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Shopify Claude Connector</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .header { text-align: center; background: #667eea; color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; }
        .links { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
        .link-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
        .link-card a { text-decoration: none; color: #667eea; font-weight: bold; }
        .link-card:hover { background: #e9ecef; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🚀 Shopify Claude Connector</h1>
        <p>Connessione attiva con ${SHOP}</p>
      </div>
      <div class="links">
        <div class="link-card">
          <a href="/products">📦 Visualizza Prodotti</a>
        </div>
        <div class="link-card">
          <a href="/orders">🛒 Visualizza Ordini</a>
        </div>
        <div class="link-card">
          <a href="/customers">👥 Visualizza Clienti</a>
        </div>
        <div class="link-card">
          <a href="/claude">🤖 Export per Claude</a>
        </div>
        <div class="link-card">
          <a href="/dashboard">📊 Dashboard</a>
        </div>
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
    res.json({
      success: true,
      count: data.products.length,
      products: data.products.map(p => ({
        id: p.id,
        title: p.title,
        price: p.variants[0]?.price || 0,
        inventory: p.variants[0]?.inventory_quantity || 0,
        status: p.status
      }))
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
app.get('/dashboard', async (req, res) => {
  try {
    const [products, orders, customers] = await Promise.all([
      shopifyAPI('products.json'),
      shopifyAPI('orders.json?status=any&limit=20'),
      shopifyAPI('customers.json?limit=20')
    ]);

    const totalRevenue = orders.orders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Dashboard ${SHOP}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 1200px; margin: 20px auto; padding: 20px; }
          .header { text-align: center; background: #667eea; color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; }
          .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
          .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
          .stat-number { font-size: 2em; font-weight: bold; color: #667eea; }
          .claude-section { background: #f8f9fa; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center; }
          .claude-button { display: inline-block; padding: 15px 30px; background: #ff6b6b; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px; }
          .orders { margin: 20px 0; }
          .order { padding: 10px; border-bottom: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 Dashboard</h1>
          <p>Negozio: ${SHOP}</p>
        </div>
        
        <div class="stats">
          <div class="stat-card">
            <div class="stat-number">${products.products.length}</div>
            <div>📦 Prodotti</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${orders.orders.length}</div>
            <div>🛒 Ordini</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${customers.customers.length}</div>
            <div>👥 Clienti</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">€${totalRevenue.toFixed(2)}</div>
            <div>💰 Fatturato</div>
          </div>
        </div>
        
        <div class="claude-section">
          <h2>🤖 Export per Claude</h2>
          <p>Clicca per ottenere i dati formattati per Claude AI</p>
          <a href="/claude" class="claude-button">🤖 Ottieni Dati Claude</a>
        </div>
        
        <div class="orders">
          <h3>🛒 Ordini Recenti</h3>
          ${orders.orders.slice(0, 5).map(o => `
            <div class="order">
              <strong>#${o.order_number}</strong> - €${o.total_price} - ${o.customer?.email || 'Guest'}
              <br><small>${new Date(o.created_at).toLocaleDateString()}</small>
            </div>
          `).join('')}
        </div>
        
        <p><a href="/">← Torna alla Home</a></p>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`Errore: ${error.message}`);
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
  console.log(`🚀 App online sulla porta ${PORT}`);
});

module.exports = app;
