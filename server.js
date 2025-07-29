const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Configurazione Shopify - CREDENZIALI HARDCODED
const SHOPIFY_API_KEY = 'ca6a1b7c965bf5e57af573f8f3afc118';
const SHOPIFY_API_SECRET = 'd1ccdf193f5d46c3d46a2bde7e67e999';
const SHOPIFY_SCOPES = 'read_products,read_orders,read_customers,read_inventory,read_analytics';
const APP_URL = 'https://shopify-claude-connector-viky.vercel.app';

// Token predefinito per il negozio (dalle credenziali dell'app installata)
const DEFAULT_SHOP = 'kf1fj0-hp.myshopify.com';
const DEFAULT_TOKEN = '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';

async function shopifyRequest(shop, accessToken, endpoint) {
  try {
    const shopName = shop.replace('.myshopify.com', '');
    const response = await axios.get(`https://${shopName}.myshopify.com/admin/api/2023-10/${endpoint}`, {
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

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="it">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Shopify-Claude Connector</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; }
        .links { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
        .link-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .link-card a { text-decoration: none; color: #667eea; font-weight: bold; font-size: 1.1em; }
        .link-card:hover { background: #e9ecef; }
        .install-info { background: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; padding: 20px; border-radius: 8px; margin: 20px 0; }
        code { background: #f1f3f4; padding: 5px 10px; border-radius: 4px; font-family: monospace; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🚀 Shopify-Claude Connector</h1>
        <p>Collega il tuo e-commerce Shopify con Claude AI</p>
      </div>
      
      <div class="links">
        <div class="link-card">
          <a href="/data/products?shop=${DEFAULT_SHOP}">📦 Visualizza Prodotti</a>
          <p>Tutti i prodotti del negozio</p>
        </div>
        <div class="link-card">
          <a href="/data/orders?shop=${DEFAULT_SHOP}">🛒 Visualizza Ordini</a>
          <p>Cronologia degli ordini</p>
        </div>
        <div class="link-card">
          <a href="/data/customers?shop=${DEFAULT_SHOP}">👥 Visualizza Clienti</a>
          <p>Database clienti</p>
        </div>
        <div class="link-card">
          <a href="/export/claude?shop=${DEFAULT_SHOP}">🤖 Esporta per Claude</a>
          <p>Dati formattati per AI</p>
        </div>
        <div class="link-card">
          <a href="/dashboard?shop=${DEFAULT_SHOP}&token=${DEFAULT_TOKEN}">📊 Dashboard Completa</a>
          <p>Vista d'insieme</p>
        </div>
      </div>
      
      <div class="install-info">
        <h3>📱 Installazione</h3>
        <p>Per installare l'app in un altro negozio Shopify:</p>
        <code>${APP_URL}/auth?shop=NOME-NEGOZIO.myshopify.com</code>
      </div>
    </body>
    </html>
  `);
});

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

app.get('/auth/callback', async (req, res) => {
  const { code, shop, state } = req.query;

  if (!code || !shop) {
    return res.status(400).send('Parametri mancanti');
  }

  try {
    const tokenResponse = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: SHOPIFY_API_KEY,
      client_secret: SHOPIFY_API_SECRET,
      code: code
    });

    const accessToken = tokenResponse.data.access_token;

    res.send(`
      <html>
        <head>
          <title>Connessione Riuscita</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 100px auto; padding: 20px; text-align: center; }
            .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .token { background: #f8f9fa; padding: 15px; border-radius: 4px; font-family: monospace; margin: 20px 0; word-break: break-all; }
            .button { display: inline-block; padding: 12px 24px; background: #007cba; color: white; text-decoration: none; border-radius: 5px; margin: 10px; }
          </style>
        </head>
        <body>
          <h1>🎉 Connessione Riuscita!</h1>
          <div class="success">
            <p>Il negozio <strong>${shop}</strong> è ora collegato correttamente.</p>
          </div>
          <div class="token">
            <strong>Token di accesso:</strong><br>
            ${accessToken}
          </div>
          <p>Usa questo URL per accedere alla dashboard:</p>
          <div class="token">
            ${APP_URL}/dashboard?shop=${shop}&token=${accessToken}
          </div>
          <a href="/" class="button">🏠 Torna alla Home</a>
          <a href="/dashboard?shop=${shop}&token=${accessToken}" class="button">📊 Vai alla Dashboard</a>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Errore OAuth:', error);
    res.status(500).send('Errore durante l\'autenticazione');
  }
});

app.get('/data/products', async (req, res) => {
  try {
    const shop = req.query.shop || DEFAULT_SHOP;
    const accessToken = req.query.token || DEFAULT_TOKEN;

    if (!accessToken) {
      return res.json({ error: 'Token di accesso mancante' });
    }

    const products = await shopifyRequest(shop, accessToken, 'products.json');

    res.json({
      success: true,
      shop: shop,
      count: products.products.length,
      data: products.products.map(p => ({
        id: p.id,
        title: p.title,
        handle: p.handle,
        status: p.status,
        product_type: p.product_type,
        vendor: p.vendor,
        tags: p.tags,
        variants: p.variants.map(v => ({
          id: v.id,
          title: v.title,
          price: v.price,
          inventory_quantity: v.inventory_quantity,
          sku: v.sku
        })),
        images: p.images.map(img => ({ src: img.src, alt: img.alt })),
        created_at: p.created_at,
        updated_at: p.updated_at
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/data/orders', async (req, res) => {
  try {
    const shop = req.query.shop || DEFAULT_SHOP;
    const accessToken = req.query.token || DEFAULT_TOKEN;

    if (!accessToken) {
      return res.json({ error: 'Token di accesso mancante' });
    }

    const orders = await shopifyRequest(shop, accessToken, 'orders.json?status=any&limit=250');

    res.json({
      success: true,
      shop: shop,
      count: orders.orders.length,
      data: orders.orders.map(o => ({
        id: o.id,
        order_number: o.order_number,
        created_at: o.created_at,
        updated_at: o.updated_at,
        total_price: o.total_price,
        currency: o.currency,
        financial_status: o.financial_status,
        fulfillment_status: o.fulfillment_status,
        customer: o.customer ? {
          id: o.customer.id,
          email: o.customer.email,
          first_name: o.customer.first_name,
          last_name: o.customer.last_name
        } : null,
        shipping_address: o.shipping_address,
        line_items: o.line_items.map(item => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          total_discount: item.total_discount
        }))
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/data/customers', async (req, res) => {
  try {
    const shop = req.query.shop || DEFAULT_SHOP;
    const accessToken = req.query.token || DEFAULT_TOKEN;

    if (!accessToken) {
      return res.json({ error: 'Token di accesso mancante' });
    }

    const customers = await shopifyRequest(shop, accessToken, 'customers.json?limit=250');

    res.json({
      success: true,
      shop: shop,
      count: customers.customers.length,
      data: customers.customers.map(c => ({
        id: c.id,
        email: c.email,
        first_name: c.first_name,
        last_name: c.last_name,
        phone: c.phone,
        orders_count: c.orders_count,
        total_spent: c.total_spent,
        created_at: c.created_at,
        updated_at: c.updated_at,
        last_order_id: c.last_order_id,
        last_order_name: c.last_order_name,
        default_address: c.default_address ? {
          city: c.default_address.city,
          country: c.default_address.country,
          province: c.default_address.province,
          zip: c.default_address.zip
        } : null,
        accepts_marketing: c.accepts_marketing,
        state: c.state
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/export/claude', async (req, res) => {
  try {
    const shop = req.query.shop || DEFAULT_SHOP;
    const accessToken = req.query.token || DEFAULT_TOKEN;

    if (!accessToken) {
      return res.json({ error: 'Token di accesso mancante' });
    }

    const shopName = shop.replace('.myshopify.com', '');

    const [products, orders, customers] = await Promise.all([
      shopifyRequest(shop, accessToken, 'products.json'),
      shopifyRequest(shop, accessToken, 'orders.json?status=any&limit=250'),
      shopifyRequest(shop, accessToken, 'customers.json?limit=250')
    ]);

    const totalRevenue = orders.orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0);
    
    const claudeData = {
      metadata: {
        negozio: shopName,
        url_completo: shop,
        data_esportazione: new Date().toISOString(),
        periodo_analisi: "Tutti i dati disponibili",
        valuta_principale: orders.orders[0]?.currency || 'EUR'
      },
      riepilogo_esecutivo: {
        totale_prodotti: products.products.length,
        totale_ordini: orders.orders.length,
        totale_clienti: customers.customers.length,
        fatturato_totale: totalRevenue.toFixed(2),
        valore_medio_ordine: orders.orders.length > 0 ? (totalRevenue / orders.orders.length).toFixed(2) : 0,
        prodotti_attivi: products.products.filter(p => p.status === 'active').length
      },
      analisi_prodotti: {
        categorie_principali: [...new Set(products.products.map(p => p.product_type).filter(Boolean))],
        prodotti_top: products.products
          .filter(p => p.variants[0]?.inventory_quantity > 0)
          .slice(0, 10)
          .map(p => ({
            nome: p.title,
            categoria: p.product_type,
            prezzo: p.variants[0]?.price,
            inventario: p.variants[0]?.inventory_quantity,
            stato: p.status
          })),
        prodotti_esauriti: products.products.filter(p => 
          p.variants.some(v => v.inventory_quantity === 0)
        ).length
      },
      analisi_vendite: {
        ordini_per_stato: {
          pagati: orders.orders.filter(o => o.financial_status === 'paid').length,
          in_sospeso: orders.orders.filter(o => o.financial_status === 'pending').length,
          rimborsati: orders.orders.filter(o => o.financial_status === 'refunded').length
        },
        spedizioni_per_stato: {
          spediti: orders.orders.filter(o => o.fulfillment_status === 'fulfilled').length,
          parziali: orders.orders.filter(o => o.fulfillment_status === 'partial').length,
          non_spediti: orders.orders.filter(o => !o.fulfillment_status).length
        },
        ordini_recenti: orders.orders
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5)
          .map(o => ({
            numero: o.order_number,
            data: o.created_at,
            totale: o.total_price,
            stato: o.financial_status,
            cliente: o.customer?.email || 'Ospite'
          }))
      },
      analisi_clienti: {
        clienti_top: customers.customers
          .sort((a, b) => parseFloat(b.total_spent) - parseFloat(a.total_spent))
          .slice(0, 10)
          .map(c => ({
            nome: `${c.first_name} ${c.last_name}`,
            email: c.email,
            ordini_totali: c.orders_count,
            spesa_totale: c.total_spent,
            ultimo_ordine: c.last_order_name,
            citta: c.default_address?.city,
            paese: c.default_address?.country
          })),
        distribuzione_geografica: [...new Set(customers.customers
          .map(c => c.default_address?.country)
          .filter(Boolean)
        )],
        clienti_attivi_marketing: customers.customers.filter(c => c.accepts_marketing).length
      },
      raccomandazioni_ai: {
        prompt_suggerito: "Analizza questi dati del mio e-commerce e fornisci insights su: 1) Performance prodotti e opportunità di ottimizzazione 2) Strategie per aumentare il valore medio dell'ordine 3) Segmentazione clienti e strategie di retention 4) Analisi del trend vendite e previsioni 5) Raccomandazioni specifiche per migliorare le conversioni",
        aree_focus: [
          "Ottimizzazione catalogo prodotti",
          "Strategie di pricing",
          "Customer retention",
          "Gestione inventario",
          "Marketing personalizzato"
        ]
      }
    };

    res.json({
      success: true,
      message: 'Dati formattati per l\'analisi con Claude AI',
      istruzioni: 'Copia il contenuto di "claude_data" e incollalo in Claude per un\'analisi completa',
      claude_data: claudeData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/dashboard', async (req, res) => {
  try {
    const shop = req.query.shop || DEFAULT_SHOP;
    const token = req.query.token || DEFAULT_TOKEN;

    if (!token) {
      return res.send(`
        <html>
          <head>
            <title>Dashboard - Accesso Richiesto</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; text-align: center; }
              .error { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 20px; border-radius: 8px; }
              .button { display: inline-block; padding: 12px 24px; background: #007cba; color: white; text-decoration: none; border-radius: 5px; margin: 10px; }
            </style>
          </head>
          <body>
            <h1>⚠️ Accesso Dashboard</h1>
            <div class="error">
              <p>Per accedere alla dashboard completa è necessario un token di accesso valido.</p>
            </div>
            <a href="/" class="button">🏠 Torna alla Home</a>
            <a href="/auth?shop=${shop}" class="button">🔐 Autorizza App</a>
          </body>
        </html>
      `);
    }

    try {
      // Fetch dei dati per la dashboard
      const [productsRes, ordersRes, customersRes] = await Promise.all([
        shopifyRequest(shop, token, 'products.json'),
        shopifyRequest(shop, token, 'orders.json?status=any&limit=50'),
        shopifyRequest(shop, token, 'customers.json?limit=50')
      ]);

      const products = productsRes.products || [];
      const orders = ordersRes.orders || [];
      const customers = customersRes.customers || [];
      
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0);
      const avgOrderValue = orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : 0;

      res.send(`
        <!DOCTYPE html>
        <html lang="it">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Dashboard - ${shop}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 1200px; margin: 20px auto; padding: 20px; background: #f5f5f5; }
            .header { text-align: center; margin-bottom: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; }
            .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0; }
            .stat-card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
            .stat-number { font-size: 2.5em; font-weight: bold; color: #667eea; margin: 10px 0; }
            .stat-label { color: #666; font-size: 1.1em; }
            .claude-section { background: white; padding: 30px; border-radius: 12px; margin: 30px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .claude-button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #ff6b6b, #feca57); color: white; text-decoration: none; border-radius: 8px; font-size: 1.1em; font-weight: bold; margin: 10px; transition: transform 0.2s; cursor: pointer; border: none; }
            .claude-button:hover { transform: translateY(-2px); }
            .data-preview { background: #2d3748; color: #e2e8f0; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 0.9em; max-height: 300px; overflow-y: auto; margin: 20px 0; display: none; }
            .success-message { background: #d4edda; color: #155724; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; display: none; }
            .recent-orders { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .order-item { border-bottom: 1px solid #eee; padding: 10px 0; display: flex; justify-content: between; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📊 Dashboard Shopify Claude Connector</h1>
            <p>Negozio: <strong>${shop}</strong></p>
            <p>🟢 Connessione attiva • Dati aggiornati in tempo reale</p>
          </div>
          
          <div class="stats">
            <div class="stat-card">
              <div class="stat-number">${products.length}</div>
              <div class="stat-label">📦 Prodotti Totali</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${orders.length}</div>
              <div class="stat-label">🛒 Ordini</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${customers.length}</div>
              <div class="stat-label">👥 Clienti</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">€${totalRevenue.toFixed(2)}</div>
              <div class="stat-label">💰 Fatturato</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">€${avgOrderValue}</div>
              <div class="stat-label">📈 Valore Medio Ordine</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${products.filter(p => p.status === 'active').length}</div>
              <div class="stat-label">✅ Prodotti Attivi</div>
            </div>
          </div>
          
          <div class="claude-section">
            <h2>🤖 Integrazione Claude AI</h2>
            <p>I tuoi dati sono pronti per essere analizzati da Claude! Utilizza il pulsante qui sotto per ottenere un'analisi completa del tuo e-commerce.</p>
            
            <div style="text-align: center;">
              <button onclick="exportForClaude()" class="claude-button">
                🤖 Esporta Dati per Claude
              </button>
              <button onclick="togglePreview()" class="claude-button" style="background: linear-gradient(135deg, #74b9ff, #0984e3);">
                👁️ Anteprima Dati
              </button>
              <a href="/export/claude?shop=${shop}&token=${token}" class="claude-button" style="background: linear-gradient(135deg, #00b894, #00cec9);">
                📊 API Dati Completi
              </a>
            </div>
            
            <div id="success-message" class="success-message">
              ✅ Dati copiati negli appunti! Ora vai su Claude e incolla per l'analisi.
            </div>
            
            <div id="data-preview" class="data-preview">
              <div id="preview-content">Caricamento dati...</div>
            </div>
          </div>
          
          <div class="recent-orders">
            <h3>🛒 Ordini Recenti</h3>
            ${orders.slice(0, 5).map(order => `
              <div class="order-item">
                <div>
                  <strong>#${order.order_number}</strong> - ${order.customer?.email || 'Ospite'}<br>
                  <small>${new Date(order.created_at).toLocaleDateString('it-IT')} • ${order.financial_status}</small>
                </div>
                <div style="text-align: right;">
                  <strong>€${order.total_price}</strong><br>
                  <small>${order.fulfillment_status || 'Non spedito'}</small>
                </div>
              </div>
            `).join('')}
          </div>
          
          <script>
            async function exportForClaude() {
              try {
                const response = await fetch('/export/claude?shop=${shop}&token=${token}');
                const data = await response.json();
                
                if (data.success) {
                  const claudeText = \`Analizza questi dati del mio e-commerce Shopify e fornisci insights dettagliati:

\${JSON.stringify(data.claude_data, null, 2)}\`;
                  
                  await navigator.clipboard.writeText(claudeText);
                  document.getElementById('success-message').style.display = 'block';
                  setTimeout(() => {
                    document.getElementById('success-message').style.display = 'none';
                  }, 5000);
                } else {
                  alert('Errore nel caricamento dati: ' + data.error);
                }
              } catch (error) {
                alert('Errore: ' + error.message);
              }
            }
            
            async function togglePreview() {
              const preview = document.getElementById('data-preview');
              if (preview.style.display === 'none' || !preview.style.display) {
                try {
                  const response = await fetch('/export/claude?shop=${shop}&token=${token}');
                  const data = await response.json();
                  document.getElementById('preview-content').textContent = JSON.stringify(data.claude_data, null, 2);
                  preview.style.display = 'block';
                } catch (error) {
                  document.getElementById('preview-content').textContent = 'Errore nel caricamento: ' + error.message;
                  preview.style.display = 'block';
                }
              } else {
                preview.style.display = 'none';
              }
            }
          </script>
        </body>
        </html>
      `);

    } catch (error) {
      console.error('Errore nel fetch dei dati:', error);
      res.send(`
        <html>
          <head>
            <title>Errore Dashboard</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; text-align: center; }
              .error { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 20px; border-radius: 8px; }
              .button { display: inline-block; padding: 12px 24px; background: #007cba; color: white; text-decoration: none; border-radius: 5px; margin: 10px; }
            </style>
          </head>
          <body>
            <h1>⚠️ Errore Dashboard</h1>
            <div class="error">
              <p>Errore nel caricamento dei dati dal negozio.</p>
              <p><strong>Dettaglio:</strong> ${error.message}</p>
            </div>
            <a href="/" class="button">🏠 Torna alla
