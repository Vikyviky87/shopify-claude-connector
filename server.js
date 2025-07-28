const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Variabili ambiente (NON hardcoded)
const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;
const SHOPIFY_SCOPES = 'read_products,read_orders,read_customers,read_inventory,read_analytics';
const APP_URL = process.env.APP_URL;

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

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="it">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Shopify-Claude Connector</title>
    </head>
    <body>
      <h1>Shopify-Claude Connector</h1>
      <p>Collega il tuo e-commerce Shopify con Claude AI</p>
      <ul>
        <li><a href="/data/products">Visualizza Prodotti</a></li>
        <li><a href="/data/orders">Visualizza Ordini</a></li>
        <li><a href="/data/customers">Visualizza Clienti</a></li>
        <li><a href="/export/claude">Esporta per Claude</a></li>
        <li><a href="/dashboard">Dashboard</a></li>
      </ul>
      <p>Per installare l'app nel tuo negozio Shopify:</p>
      <code>${APP_URL}/auth?shop=NOME-NEGOZIO.myshopify.com</code>
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

    global.shopifyTokens = global.shopifyTokens || {};
    global.shopifyTokens[shop] = accessToken;

    res.send(`<h1>Connessione riuscita</h1><p>Il negozio ${shop} è ora collegato.</p><a href="/">Torna alla dashboard</a>`);
  } catch (error) {
    console.error('Errore OAuth:', error);
    res.status(500).send('Errore durante l\'autenticazione');
  }
});

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

app.get('/export/claude', async (req, res) => {
  try {
    const shop = req.query.shop || Object.keys(global.shopifyTokens || {})[0];
    const accessToken = global.shopifyTokens?.[shop];

    if (!accessToken) {
      return res.json({ error: 'Nessun negozio connesso' });
    }

    const shopName = shop.replace('.myshopify.com', '');

    const [products, orders, customers] = await Promise.all([
      shopifyRequest(shopName, accessToken, 'products.json'),
      shopifyRequest(shopName, accessToken, 'orders.json?status=any&limit=250'),
      shopifyRequest(shopName, accessToken, 'customers.json?limit=250')
    ]);

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
      data: claudeData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/dashboard', async (req, res) => {
  try {
    const shop = req.query.shop || Object.keys(global.shopifyTokens || {})[0];

    if (!shop) {
      return res.send(`<h2>Nessun negozio connesso</h2><p>Connetti il tuo negozio Shopify usando il link di autorizzazione.</p>`);
    }

    res.send(`<h1>Dashboard ${shop}</h1><p>Sezione in costruzione</p>`);
  } catch (error) {
    res.status(500).send('Errore nel caricamento dashboard: ' + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Shopify-Claude Connector avviato su porta ${PORT}`);
  console.log(`Accedi a: ${APP_URL}`);
});

module.exports = app;
