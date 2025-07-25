const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Configurazione Shopify
const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;
const SHOPIFY_SCOPES = 'read_products,read_orders,read_customers,read_inventory,read_analytics';
const APP_URL = process.env.APP_URL || 'https://claude-shopify-connector.vercel.app';

// Funzione per fare richieste autenticate a Shopify
async function shopifyRequest(shop, accessToken, endpoint) {
  try {
    const response = await axios.get(`https://${shop}.myshopify.com/admin/api/2023-10/${endpoint}`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Errore richiesta Shopify:', error.response?.data || error.message);
    throw error;
  }
}

// Route principale - Dashboard
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="it">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Shopify-Claude Connector</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
            }
            .container { 
                max-width: 1200px; 
                margin: 0 auto; 
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .header { 
                background: linear-gradient(135deg, #96c93d 0%, #00b09b 100%);
                padding: 40px;
                text-align: center;
                color: white;
            }
            .header h1 { font-size: 2.5em; margin-bottom: 10px; }
            .header p { font-size: 1.2em; opacity: 0.9; }
            .content { padding: 40px; }
            .status { 
                background: #f8f9fa;
                border-radius: 15px;
                padding: 30px;
                margin-bottom: 30px;
                border-left: 5px solid #28a745;
            }
            .buttons { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-top: 30px;
            }
            .btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 20px;
                border-radius: 15px;
                font-size: 1.1em;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
                text-align: center;
                display: inline-block;
            }
            .btn:hover { 
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
            }
            .btn.success { background: linear-gradient(135deg, #96c93d 0%, #00b09b 100%); }
            .btn.warning { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
            .data-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-top: 30px;
            }
            .data-card {
                background: white;
                border: 2px solid #e9ecef;
                border-radius: 15px;
                padding: 25px;
                transition: all 0.3s ease;
            }
            .data-card:hover {
                border-color: #667eea;
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }
            .data-card h3 { color: #495057; margin-bottom: 15px; }
            .data-card p { color: #6c757d; line-height: 1.6; }
            .install-url {
                background: #e7f3ff;
                border: 2px dashed #007bff;
                border-radius: 10px;
                padding: 20px;
                margin: 20px 0;
                text-align: center;
            }
            .install-url code {
                background: #f8f9fa;
                padding: 10px 15px;
                border-radius: 5px;
                font-family: 'Monaco', 'Consolas', monospace;
                display: inline-block;
                margin: 10px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚀 Shopify-Claude Connector</h1>
                <p>Collega il tuo e-commerce Shopify con Claude AI per analisi avanzate</p>
            </div>
            
            <div class="content">
                <div class="status">
                    <h2>📊 Stato Connessione</h2>
                    <p><strong>App Status:</strong> ✅ Attiva e pronta</p>
                    <p><strong>API Status:</strong> 🟡 In attesa di autorizzazione negozio</p>
                    <p><strong>Claude Integration:</strong> ✅ Pronta</p>
                </div>

                <div class="install-url">
                    <h3>🔗 URL per installare l'app nel tuo negozio:</h3>
                    <code>https://${APP_URL}/auth?shop=NOME-NEGOZIO.myshopify.com</code>
                    <p><small>Sostituisci "NOME-NEGOZIO" con il nome del tuo negozio Shopify</small></p>
                </div>

                <div class="buttons">
                    <a href="/data/products" class="btn">📦 Visualizza Prodotti</a>
                    <a href="/data/orders" class="btn">📋 Visualizza Ordini</a>
                    <a href="/data/customers" class="btn">👥 Visualizza Clienti</a>
                    <a href="/data/analytics" class="btn success">📈 Analytics</a>
                    <a href="/export/claude" class="btn warning">🤖 Esporta per Claude</a>
                    <a href="/dashboard" class="btn">📊 Dashboard Completa</a>
                </div>

                <div class="data-grid">
                    <div class="data-card">
                        <h3>📦 Gestione Prodotti</h3>
                        <p>Accedi al catalogo completo, prezzi, descrizioni, varianti e dati inventario. Perfetto per analisi di performance prodotti con Claude.</p>
                    </div>
                    <div class="data-card">
                        <h3>📋 Analisi Ordini</h3>
                        <p>Cronologia ordini completa, trend di vendita, analisi stagionali e comportamenti d'acquisto per insights avanzati.</p>
                    </div>
                    <div class="data-card">
                        <h3>👥 Database Clienti</h3>
                        <p>Segmentazione clienti, analisi geografica, lifetime value e pattern di acquisto per strategie marketing mirate.</p>
                    </div>
                    <div class="data-card">
                        <h3>📈 Business Intelligence</h3>
                        <p>Metriche avanzate, KPI automatici, previsioni di vendita e raccomandazioni strategiche generate da Claude.</p>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
  `);
});

// Route per iniziare l'autenticazione OAuth con Shopify
app.get('/auth', (req, res) => {
  const shop = req.query.shop;
  
  if (!shop || !shop.includes('.myshopify.com')) {
    return res.status(400).send('Nome negozio non valido');
  }

  const state = crypto.randomBytes(16).toString('hex');
  const redirectUri = `${APP_URL}/auth/callback`;
  
  const authUrl = `https://${shop}/admin/oauth/authorize?` +
    `client_id=${SHOPIFY_API_KEY}&` +
    `scope=${SHOPIFY_SCOPES}&` +
    `redirect_uri=${redirectUri}&` +
    `state=${state}`;

  res.redirect(authUrl);
});

// Callback OAuth - riceve l'authorization code da Shopify
app.get('/auth/callback', async (req, res) => {
  const { code, shop, state } = req.query;

  if (!code || !shop) {
    return res.status(400).send('Parametri mancanti');
  }

  try {
    // Scambia il code con un access token
    const tokenResponse = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: SHOPIFY_API_KEY,
      client_secret: SHOPIFY_API_SECRET,
      code: code
    });

    const accessToken = tokenResponse.data.access_token;
    
    // Salva il token (in produzione useresti un database)
    global.shopifyTokens = global.shopifyTokens || {};
    global.shopifyTokens[shop] = accessToken;

    res.send(`
      <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
        <h1 style="color: #96c93d;">✅ Connessione Riuscita!</h1>
        <p style="font-size: 1.2em; margin: 20px 0;">
          Il tuo negozio <strong>${shop}</strong> è ora collegato a Claude!
        </p>
        <a href="/" style="background: #667eea; color: white; padding: 15px 30px; 
           text-decoration: none; border-radius: 10px; display: inline-block; margin-top: 20px;">
          🚀 Vai alla Dashboard
        </a>
      </div>
    `);
  } catch (error) {
    console.error('Errore OAuth:', error);
    res.status(500).send('Errore durante l\'autenticazione');
  }
});

// API endpoint per ottenere prodotti
app.get('/data/products', async (req, res) => {
  try {
    const shop = req.query.shop || Object.keys(global.shopifyTokens || {})[0];
    const accessToken = global.shopifyTokens?.[shop];

    if (!accessToken) {
      return res.json({ error: 'Nessun negozio connesso' });
    }

    const shopName = shop.replace('.myshopify.com', '');
    const products = await shopifyRequest(shopName, accessToken, 'products.json');
    
    res.json({
      success: true,
      shop: shop,
      count: products.products.length,
      data: products.products
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint per ottenere ordini
app.get('/data/orders', async (req, res) => {
  try {
    const shop = req.query.shop || Object.keys(global.shopifyTokens || {})[0];
    const accessToken = global.shopifyTokens?.[shop];

    if (!accessToken) {
      return res.json({ error: 'Nessun negozio connesso' });
    }

    const shopName = shop.replace('.myshopify.com', '');
    const orders = await shopifyRequest(shopName, accessToken, 'orders.json?status=any&limit=250');
    
    res.json({
      success: true,
      shop: shop,
      count: orders.orders.length,
      data: orders.orders
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint per ottenere clienti
app.get('/data/customers', async (req, res) => {
  try {
    const shop = req.query.shop || Object.keys(global.shopifyTokens || {})[0];
    const accessToken = global.shopifyTokens?.[shop];

    if (!accessToken) {
      return res.json({ error: 'Nessun negozio connesso' });
    }

    const shopName = shop.replace('.myshopify.com', '');
    const customers = await shopifyRequest(shopName, accessToken, 'customers.json?limit=250');
    
    res.json({
      success: true,
      shop: shop,
      count: customers.customers.length,
      data: customers.customers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint speciale per esportare dati formatati per Claude
app.get('/export/claude', async (req, res) => {
  try {
    const shop = req.query.shop || Object.keys(global.shopifyTokens || {})[0];
    const accessToken = global.shopifyTokens?.[shop];

    if (!accessToken) {
      return res.json({ error: 'Nessun negozio connesso' });
    }

    const shopName = shop.replace('.myshopify.com', '');
    
    // Ottieni tutti i dati
    const [products, orders, customers] = await Promise.all([
      shopifyRequest(shopName, accessToken, 'products.json'),
      shopifyRequest(shopName, accessToken, 'orders.json?status=any&limit=250'),
      shopifyRequest(shopName, accessToken, 'customers.json?limit=250')
    ]);

    // Formatta i dati per Claude
    const claudeData = {
      negozio: {
        nome: shopName,
        url: shop,
        dataEsportazione: new Date().toISOString()
      },
      riepilogo: {
        totaleProdotti: products.products.length,
        totaleOrdini: orders.orders.length,
        totaleClienti: customers.customers.length,
        fatturatoTotale: orders.orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0)
      },
      prodotti: products.products.map(p => ({
        id: p.id,
        titolo: p.title,
        prezzo: p.variants[0]?.price,
        inventario: p.variants[0]?.inventory_quantity,
        categoria: p.product_type,
        tags: p.tags,
        stato: p.status
      })),
      ordini: orders.orders.map(o => ({
        id: o.id,
        data: o.created_at,
        totale: o.total_price,
        stato: o.financial_status,
        spedizione: o.fulfillment_status,
        cliente: o.customer?.email,
        prodotti: o.line_items?.length
      })),
      clienti: customers.customers.map(c => ({
        id: c.id,
        email: c.email,
        nome: `${c.first_name} ${c.last_name}`,
        ordini: c.orders_count,
        totaleSpeso: c.total_spent,
        ultimoOrdine: c.last_order_name,
        citta: c.default_address?.city,
        paese: c.default_address?.country
      }))
    };

    res.json({
      success: true,
      message: 'Dati formattati per Claude',
      data: claudeData,
      istruzioni: 'Copia questi dati e incollali in Claude per analisi avanzate del tuo e-commerce'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard con visualizzazione completa
app.get('/dashboard', async (req, res) => {
  try {
    const shop = req.query.shop || Object.keys(global.shopifyTokens || {})[0];
    
    if (!shop) {
      return res.send(`
        <div style="text-align: center; padding: 50px;">
          <h2>Nessun negozio connesso</h2>
          <p>Prima connetti il tuo negozio Shopify usando il link di autorizzazione.</p>
          <a href="/">Torna alla home</a>
        </div>
      `);
    }

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Dashboard Shopify-Claude</title>
          <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
              .container { max-width: 1200px; margin: 0 auto; }
              .header { background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; }
              .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
              .card { background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .btn { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
              .btn:hover { background: #0056b3; }
              .data-container { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 15px; max-height: 400px; overflow-y: auto; }
              pre { font-size: 12px; white-space: pre-wrap; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>📊 Dashboard ${shop}</h1>
                  <p>Gestisci e analizza i dati del tuo e-commerce</p>
              </div>
              
              <div class="cards">
                  <div class="card">
                      <h3>📦 Prodotti</h3>
                      <button class="btn" onclick="loadData('products')">Carica Prodotti</button>
                      <div id="products-data" class="data-container" style="display: none;"></div>
                  </div>
                  
                  <div class="card">
                      <h3>📋 Ordini</h3>
                      <button class="btn" onclick="loadData('orders')">Carica Ordini</button>
                      <div id="orders-data" class="data-container" style="display: none;"></div>
                  </div>
                  
                  <div class="card">
                      <h3>👥 Clienti</h3>
                      <button class="btn" onclick="loadData('customers')">Carica Clienti</button>
                      <div id="customers-data" class="data-container" style="display: none;"></div>
                  </div>
                  
                  <div class="card">
                      <h3>🤖 Esporta per Claude</h3>
                      <button class="btn" style="background: #28a745;" onclick="exportForClaude()">Genera Dati per Claude</button>
                      <div id="claude-data" class="data-container" style="display: none;"></div>
                  </div>
              </div>
          </div>

          <script>
              async function loadData(type) {
                  try {
                      const response = await fetch('/data/' + type + '?shop=${shop}');
                      const data = await response.json();
                      
                      const container = document.getElementById(type + '-data');
                      container.style.display = 'block';
                      container.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
                  } catch (error) {
                      alert('Errore nel caricamento dati: ' + error.message);
                  }
              }

              async function exportForClaude() {
                  try {
                      const response = await fetch('/export/claude?shop=${shop}');
                      const data = await response.json();
                      
                      const container = document.getElementById('claude-data');
                      container.style.display = 'block';
                      container.innerHTML = 
                          '<h4>📋 Copia questi dati per Claude:</h4>' +
                          '<pre>' + JSON.stringify(data.data, null, 2) + '</pre>' +
                          '<button class="btn" onclick="copyToClipboard()">📋 Copia negli Appunti</button>';
                      
                      window.claudeData = JSON.stringify(data.data, null, 2);
                  } catch (error) {
                      alert('Errore nell\\'esportazione: ' + error.message);
                  }
              }

              function copyToClipboard() {
                  navigator.clipboard.writeText(window.claudeData).then(() => {
                      alert('✅ Dati copiati! Ora puoi incollarli in Claude per l\\'analisi.');
                  });
              }
          </script>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send('Errore nel caricamento dashboard: ' + error.message);
  }
});

// Avvio server
app.listen(PORT, () => {
  console.log(`🚀 Shopify-Claude Connector avviato su porta ${PORT}`);
  console.log(`📱 Accedi a: ${APP_URL}`);
});

module.exports = app;
