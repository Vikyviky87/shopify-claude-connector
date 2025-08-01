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

// Funzione per generare insights AI automatici
function generateAIInsights(products, orders, customers) {
  const insights = [];
  const recommendations = [];
  const alerts = [];
  
  // ANALISI FATTURATO
  const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);
  const avgPrice = products.length > 0 ? products.reduce((sum, p) => sum + parseFloat(p.variants?.[0]?.price || 0), 0) / products.length : 0;
  
  if (totalRevenue === 0) {
    alerts.push({
      type: 'critical',
      title: '🚨 Nessuna Vendita',
      message: 'Il negozio non ha ancora generato vendite. Priorità: attivare campagne marketing.',
      action: 'Attiva campagne Facebook/Instagram ads con budget €300-500'
    });
    
    recommendations.push({
      priority: 'CRITICA',
      title: '🎯 Piano Lancio Immediato',
      description: 'Email marketing al cliente registrato + campagne social',
      impact: 'Prime 5-10 vendite nei prossimi 30 giorni',
      effort: 'Basso'
    });
  }
  
  // ANALISI PRODOTTI
  const premiumProducts = products.filter(p => parseFloat(p.variants?.[0]?.price || 0) > 300);
  const midRangeProducts = products.filter(p => {
    const price = parseFloat(p.variants?.[0]?.price || 0);
    return price >= 150 && price <= 300;
  });
  
  if (premiumProducts.length > 0) {
    insights.push({
      type: 'opportunity',
      title: '💎 Posizionamento Premium',
      value: `${premiumProducts.length} prodotti premium (€${premiumProducts[0].variants?.[0]?.price}+)`,
      insight: 'Potenziale per marketing luxury e gift packaging'
    });
  }
  
  // ANALISI LINEA PRODOTTI
  const amataProducts = products.filter(p => p.title?.includes('Amata Estate'));
  if (amataProducts.length >= 3) {
    recommendations.push({
      priority: 'ALTA',
      title: '🍃 Bundle "Amata Estate Collection"',
      description: `Crea bundle con ${amataProducts.length} varianti Amata Estate`,
      impact: `Revenue potenziale: €${(amataProducts.length * 169 * 0.85).toFixed(0)} (sconto 15%)`,
      effort: 'Medio'
    });
  }
  
  // ANALISI CLIENTI
  if (customers.length > 0 && totalRevenue === 0) {
    alerts.push({
      type: 'warning',
      title: '👥 Cliente Registrato Senza Acquisti',
      message: 'Hai clienti registrati ma nessun acquisto completato.',
      action: 'Invia email con sconto 15% valido 48h'
    });
  }
  
  // ANALISI PRICING
  const priceGap = Math.max(...products.map(p => parseFloat(p.variants?.[0]?.price || 0))) - 
                   Math.min(...products.map(p => parseFloat(p.variants?.[0]?.price || 0)));
  
  if (priceGap > 200) {
    recommendations.push({
      priority: 'MEDIA',
      title: '💰 Gap Pricing Ottimizzazione',
      description: 'Introduce prodotto fascia media €299-349',
      impact: 'Maggiore accessibilità = +25% conversioni potenziali',
      effort: 'Alto'
    });
  }
  
  // CALCOLO POTENZIALE REVENUE
  const revenueProjection = {
    monthly_potential: products.length * avgPrice * 0.3, // 30% prodotti venduti al mese
    first_month_target: Math.min(5, products.length) * avgPrice * 0.5,
    quarterly_goal: products.length * avgPrice * 2
  };
  
  return {
    insights,
    recommendations: recommendations.sort((a, b) => {
      const priority = { 'CRITICA': 3, 'ALTA': 2, 'MEDIA': 1 };
      return priority[b.priority] - priority[a.priority];
    }),
    alerts,
    revenue_projection: revenueProjection,
    business_health: {
      score: totalRevenue > 0 ? 75 : 25,
      status: totalRevenue > 0 ? 'Operativo' : 'Pre-Lancio',
      next_milestone: totalRevenue > 0 ? 'Scalare a €5K/mese' : 'Prima vendita'
    }
  };
}

// Homepage
app.get('/', (req, res) => {
  res.send(`
    <html>
    <head>
      <title>Viky Store Analytics</title>
      <style>
        .header { background: #3b82f6; color: white; padding: 30px; text-align: center; border-radius: 10px; margin-bottom: 20px; }
        .header h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 10px; }
        .nav { margin: 20px 0; }
        .nav a { background: #6b7280; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; margin-right: 10px; }
        .nav a.active { background: #3b82f6; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
        .stat { background: white; padding: 20px; text-align: center; border-radius: 8px; }
        .stat h3 { color: #3b82f6; margin: 0; font-size: 1.8rem; }
        .ai-section { background: linear-gradient(135deg, #f0f9ff, #e0f2fe); padding: 25px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #3b82f6; }
        .ai-alert { background: #fee2e2; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ef4444; }
        .ai-rec { background: #ecfdf5; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #10b981; }
        .quick-actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .action-btn { background: #f59e0b; color: white; padding: 15px; text-decoration: none; border-radius: 8px; text-align: center; font-weight: bold; }
        .action-btn:hover { background: #d97706; }
      </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 Smart Dashboard</h1>
          <p>Panoramica Viky Store con AI Insights</p>
        </div>
        
        <div class="nav">
          <a href="/">🏠 Home</a>
          <a href="/dashboard" class="active">📊 Dashboard</a>
          <a href="/products">📦 Prodotti</a>
          <a href="/orders">🛒 Ordini</a>
          <a href="/customers">👥 Clienti</a>
          <a href="/insights">🧠 AI Insights</a>
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
            <h3>${products.filter(p => p.status === 'active').length}</h3>
            <p>Prodotti Attivi</p>
          </div>
          <div class="stat">
            <h3>€${avgOrderValue.toFixed(2)}</h3>
            <p>AOV</p>
          </div>
          <div class="stat">
            <h3>${aiAnalysis.business_health.score}/100</h3>
            <p>Health Score</p>
          </div>
        </div>
        
        <div class="ai-section">
          <h2>🤖 AI Assistant</h2>
          <p><strong>Status Negozio:</strong> ${aiAnalysis.business_health.status}</p>
          <p><strong>Prossimo Obiettivo:</strong> ${aiAnalysis.business_health.next_milestone}</p>
        </div>
        
        ${topAlert ? `
        <div class="ai-alert">
          <h3>${topAlert.title}</h3>
          <p>${topAlert.message}</p>
          <strong>Azione Suggerita:</strong> ${topAlert.action}
        </div>
        ` : ''}
        
        ${topRecommendation ? `
        <div class="ai-rec">
          <h3>💡 Raccomandazione Top Priority</h3>
          <h4>${topRecommendation.title}</h4>
          <p>${topRecommendation.description}</p>
          <p><strong>Impact Atteso:</strong> ${topRecommendation.impact}</p>
        </div>
        ` : ''}
        
        <div class="quick-actions">
          <a href="/insights" class="action-btn">🧠 Vedi Tutti gli Insights</a>
          <a href="/claude" class="action-btn">🤖 Export per Claude</a>
          <a href="/products" class="action-btn">📦 Gestisci Prodotti</a>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`<div style="padding: 50px; text-align: center;"><h2>❌ Errore</h2><p>${error.message}</p><a href="/">← Home</a></div>`);
  }
});

// Claude AI con Analisi Automatica integrata
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

    // Genera analisi AI completa
    const aiAnalysis = generateAIInsights(products, orders, customers);

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
      ai_insights: aiAnalysis
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
        .auto-analysis { background: white; padding: 30px; border-radius: 10px; margin: 20px 0; }
        .insights-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin: 20px 0; }
        .insight-card { background: #f0f9ff; padding: 20px; border-radius: 10px; border-left: 4px solid #3b82f6; }
        .recommendations { background: #ecfdf5; padding: 25px; border-radius: 10px; margin: 20px 0; }
        .rec-item { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 3px solid #10b981; }
        .content { background: white; padding: 30px; border-radius: 10px; margin: 20px 0; }
        .export-button { background: #10b981; color: white; padding: 15px 30px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
        .data-preview { background: #1e293b; color: #fff; padding: 20px; border-radius: 8px; font-family: monospace; overflow-x: auto; margin: 20px 0; max-height: 400px; overflow-y: auto; }
        .instructions { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
      </style>
      </head>
      <body>
        <div class="header">
          <h1>🤖 Claude AI + Analisi Automatica</h1>
          <p>Report completo con insights AI integrati</p>
        </div>
        
        <div class="nav">
          <a href="/">🏠 Home</a>
          <a href="/dashboard">📊 Dashboard</a>
          <a href="/products">📦 Prodotti</a>
          <a href="/orders">🛒 Ordini</a>
          <a href="/customers">👥 Clienti</a>
          <a href="/insights">🧠 AI Insights</a>
          <a href="/claude" class="active">🤖 Claude</a>
        </div>
        
        <div class="auto-analysis">
          <h2>🧠 Analisi Automatica</h2>
          <div class="insights-grid">
            <div class="insight-card">
              <h3>📊 Business Health</h3>
              <h2 style="color: ${aiAnalysis.business_health.score > 50 ? '#10b981' : '#f59e0b'};">${aiAnalysis.business_health.score}/100</h2>
              <p>Status: ${aiAnalysis.business_health.status}</p>
            </div>
            <div class="insight-card">
              <h3>🎯 Prossimo Obiettivo</h3>
              <p><strong>${aiAnalysis.business_health.next_milestone}</strong></p>
            </div>
            <div class="insight-card">
              <h3>💰 Potenziale Mensile</h3>
              <h2 style="color: #3b82f6;">€${aiAnalysis.revenue_projection.monthly_potential.toFixed(0)}</h2>
              <p>Proiezione AI basata su catalogo</p>
            </div>
          </div>
        </div>
        
        ${aiAnalysis.recommendations.length > 0 ? `
        <div class="recommendations">
          <h2>🎯 Top Raccomandazioni AI</h2>
          ${aiAnalysis.recommendations.slice(0, 3).map(rec => `
            <div class="rec-item">
              <strong>${rec.priority}:</strong> ${rec.title}
              <br><small>${rec.description}</small>
              <br><em>Impact: ${rec.impact}</em>
            </div>
          `).join('')}
          <p><a href="/insights" style="color: #059669; font-weight: bold;">→ Vedi tutte le raccomandazioni dettagliate</a></p>
        </div>
        ` : ''}
        
        <div class="content">
          <div class="instructions">
            <h3>📋 Export per Claude AI:</h3>
            <p>
              I dati qui sotto includono sia i dati raw di Shopify che l'analisi AI automatica.<br>
              <strong>Usa questo prompt:</strong> "Analizza questi dati completi del mio e-commerce con insights AI già integrati e forniscimi un piano d'azione dettagliato per i prossimi 30 giorni"
            </p>
          </div>
          
          <button class="export-button" onclick="copyData()">
            📋 Copia Dati Completi (Shopify + AI Analysis)
          </button>
          
          <div class="data-preview" id="dataPreview">${jsonData.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        </div>
        
        <script>
          function copyData() {
            const data = \`${jsonData.replace(/`/g, '\\`').replace(/\$/g, '\\
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
        <p>Sistema completo di Business Intelligence</p>
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
          <p>KPI e metriche avanzate con AI insights</p>
        </a>
        
        <a href="/insights" class="card">
          <h3>🧠 Business Intelligence <span class="new-badge">NEW</span></h3>
          <p>Report automatici e raccomandazioni AI</p>
        </a>
      </div>
      
      <div class="ai-section">
        <h2>🤖 Sistema AI Completo</h2>
        <p>Analisi automatiche, insights intelligenti e raccomandazioni strategiche</p>
        <a href="/claude" class="ai-button">🔄 Export Claude</a>
        <a href="/insights" class="ai-button">🧠 AI Insights</a>
        <a href="/dashboard" class="ai-button">📊 Smart Dashboard</a>
      </div>
    </body>
    </html>
  `);
});

// Prodotti (invariato)
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
          <a href="/insights">🧠 AI Insights</a>
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

// Ordini (invariato)
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
          <a href="/insights">🧠 AI Insights</a>
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
          <h3>🚀 Nessun Ordine Ancora</h3>
          <p>Il tuo negozio è pronto per le prime vendite!</p>
          <p><a href="/insights" style="color: #f59e0b; font-weight: bold;">→ Vedi strategie AI per generare le prime vendite</a></p>
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

// Clienti (invariato)
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
          <a href="/insights">🧠 AI Insights</a>
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

// NUOVA PAGINA: Business Intelligence con AI Insights completi
app.get('/insights', async (req, res) => {
  try {
    const [productsData, ordersData, customersData] = await Promise.all([
      shopifyAPI('products.json?limit=15'),
      shopifyAPI('orders.json?status=any&limit=15'),
      shopifyAPI('customers.json?limit=15')
    ]);

    const products = productsData.products || [];
    const orders = ordersData.orders || [];
    const customers = customersData.customers || [];

    const aiAnalysis = generateAIInsights(products, orders, customers);

    res.send(`
      <html>
      <head><title>Business Intelligence - Viky Store</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .header { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 40px; text-align: center; border-radius: 10px; margin-bottom: 20px; }
        .header h1 { font-size: 2.5rem; margin: 0 0 10px 0; }
        .nav { margin: 20px 0; }
        .nav a { background: #6b7280; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; margin-right: 10px; }
        .nav a.active { background: #8b5cf6; }
        .health-score { background: white; padding: 30px; border-radius: 10px; margin: 20px 0; text-align: center; }
        .score { font-size: 3rem; font-weight: bold; color: ${aiAnalysis.business_health.score > 50 ? '#10b981' : '#f59e0b'}; }
        .alerts { margin: 20px 0; }
        .alert { padding: 20px; border-radius: 10px; margin-bottom: 15px; }
        .alert.critical { background: #fee2e2; border-left: 4px solid #ef4444; }
        .alert.warning { background: #fef3c7; border-left: 4px solid #f59e0b; }
        .recommendations { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
        .rec-card { background: white; padding: 25px; border-radius: 10px; border-left: 4px solid #3b82f6; }
        .priority { padding: 4px 12px; border-radius: 15px; color: white; font-size: 0.8rem; font-weight: bold; margin-bottom: 10px; display: inline-block; }
        .priority.CRITICA { background: #ef4444; }
        .priority.ALTA { background: #f59e0b; }
        .priority.MEDIA { background: #3b82f6; }
        .insights { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin: 20px 0; }
        .insight-card { background: white; padding: 20px; border-radius: 10px; }
        .insight-type { color: #059669; font-weight: bold; margin-bottom: 10px; }
        .projection { background: #f0f9ff; padding: 25px; border-radius: 10px; margin: 20px 0; }
      </style>
      </head>
      <body>
        <div class="header">
          <h1>🧠 Business Intelligence</h1>
          <p>Analisi AI automatica e raccomandazioni strategiche</p>
          <small>Aggiornato: ${new Date().toLocaleString('it-IT')}</small>
        </div>
        
        <div class="nav">
          <a href="/">🏠 Home</a>
          <a href="/dashboard">📊 Dashboard</a>
          <a href="/products">📦 Prodotti</a>
          <a href="/orders">🛒 Ordini</a>
          <a href="/customers">👥 Clienti</a>
          <a href="/insights" class="active">🧠 AI Insights</a>
          <a href="/claude">🤖 Claude</a>
        </div>
        
        <div class="health-score">
          <h2>📈 Business Health Score</h2>
          <div class="score">${aiAnalysis.business_health.score}/100</div>
          <p><strong>Status:</strong> ${aiAnalysis.business_health.status}</p>
          <p><strong>Prossimo Milestone:</strong> ${aiAnalysis.business_health.next_milestone}</p>
        </div>
        
        ${aiAnalysis.alerts.length > 0 ? `
        <div class="alerts">
          <h2>🚨 Alert Prioritari</h2>
          ${aiAnalysis.alerts.map(alert => `
            <div class="alert ${alert.type}">
              <h3>${alert.title}</h3>
              <p>${alert.message}</p>
              <strong>Azione:</strong> ${alert.action}
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        <div class="recommendations">
          <h2 style="grid-column: 1/-1;">🎯 Raccomandazioni AI Strategiche</h2>
          ${aiAnalysis.recommendations.map(rec => `
            <div class="rec-card">
              <div class="priority ${rec.priority}">${rec.priority}</div>
              <h3>${rec.title}</h3>
              <p>${rec.description}</p>
              <p><strong>Impact:</strong> ${rec.impact}</p>
              <p><strong>Effort:</strong> ${rec.effort}</p>
            </div>
          `).join('')}
        </div>
        
        ${aiAnalysis.insights.length > 0 ? `
        <div class="insights">
          <h2 style="grid-column: 1/-1;">💡 AI Insights</h2>
          ${aiAnalysis.insights.map(insight => `
            <div class="insight-card">
              <div class="insight-type">${insight.type.toUpperCase()}</div>
              <h4>${insight.title}</h4>
              <p><strong>${insight.value}</strong></p>
              <p>${insight.insight}</p>
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        <div class="projection">
          <h2>📊 Proiezioni Revenue</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px;">
            <div style="text-align: center;">
              <h3 style="color: #3b82f6;">€${aiAnalysis.revenue_projection.first_month_target.toFixed(0)}</h3>
              <p>Target Primo Mese</p>
            </div>
            <div style="text-align: center;">
              <h3 style="color: #059669;">€${aiAnalysis.revenue_projection.monthly_potential.toFixed(0)}</h3>
              <p>Potenziale Mensile</p>
            </div>
            <div style="text-align: center;">
              <h3 style="color: #7c3aed;">€${aiAnalysis.revenue_projection.quarterly_goal.toFixed(0)}</h3>
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

// Dashboard con AI Insights integrati
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
    
    // Genera AI insights per quick alerts
    const aiAnalysis = generateAIInsights(products, orders, customers);
    const topAlert = aiAnalysis.alerts[0];
    const topRecommendation = aiAnalysis.recommendations[0];

    res.send(`
      <html>
      <head><title>Dashboard - Viky Store</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        )}\`;
            navigator.clipboard.writeText(data).then(() => {
              document.querySelector('.export-button').innerHTML = '✅ Dati Completi Copiati!';
              setTimeout(() => document.querySelector('.export-button').innerHTML = '📋 Copia Dati Completi (Shopify + AI Analysis)', 3000);
            }).catch(() => alert('Copia manualmente il testo JSON completo'));
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
        <p>Sistema completo di Business Intelligence</p>
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
          <p>KPI e metriche avanzate con AI insights</p>
        </a>
        
        <a href="/insights" class="card">
          <h3>🧠 Business Intelligence <span class="new-badge">NEW</span></h3>
          <p>Report automatici e raccomandazioni AI</p>
        </a>
      </div>
      
      <div class="ai-section">
        <h2>🤖 Sistema AI Completo</h2>
        <p>Analisi automatiche, insights intelligenti e raccomandazioni strategiche</p>
        <a href="/claude" class="ai-button">🔄 Export Claude</a>
        <a href="/insights" class="ai-button">🧠 AI Insights</a>
        <a href="/dashboard" class="ai-button">📊 Smart Dashboard</a>
      </div>
    </body>
    </html>
  `);
});

// Prodotti (invariato)
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
          <a href="/insights">🧠 AI Insights</a>
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

// Ordini (invariato)
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
          <a href="/insights">🧠 AI Insights</a>
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
          <h3>🚀 Nessun Ordine Ancora</h3>
          <p>Il tuo negozio è pronto per le prime vendite!</p>
          <p><a href="/insights" style="color: #f59e0b; font-weight: bold;">→ Vedi strategie AI per generare le prime vendite</a></p>
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

// Clienti (invariato)
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
          <a href="/insights">🧠 AI Insights</a>
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

// NUOVA PAGINA: Business Intelligence con AI Insights completi
app.get('/insights', async (req, res) => {
  try {
    const [productsData, ordersData, customersData] = await Promise.all([
      shopifyAPI('products.json?limit=15'),
      shopifyAPI('orders.json?status=any&limit=15'),
      shopifyAPI('customers.json?limit=15')
    ]);

    const products = productsData.products || [];
    const orders = ordersData.orders || [];
    const customers = customersData.customers || [];

    const aiAnalysis = generateAIInsights(products, orders, customers);

    res.send(`
      <html>
      <head><title>Business Intelligence - Viky Store</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .header { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 40px; text-align: center; border-radius: 10px; margin-bottom: 20px; }
        .header h1 { font-size: 2.5rem; margin: 0 0 10px 0; }
        .nav { margin: 20px 0; }
        .nav a { background: #6b7280; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; margin-right: 10px; }
        .nav a.active { background: #8b5cf6; }
        .health-score { background: white; padding: 30px; border-radius: 10px; margin: 20px 0; text-align: center; }
        .score { font-size: 3rem; font-weight: bold; color: ${aiAnalysis.business_health.score > 50 ? '#10b981' : '#f59e0b'}; }
        .alerts { margin: 20px 0; }
        .alert { padding: 20px; border-radius: 10px; margin-bottom: 15px; }
        .alert.critical { background: #fee2e2; border-left: 4px solid #ef4444; }
        .alert.warning { background: #fef3c7; border-left: 4px solid #f59e0b; }
        .recommendations { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
        .rec-card { background: white; padding: 25px; border-radius: 10px; border-left: 4px solid #3b82f6; }
        .priority { padding: 4px 12px; border-radius: 15px; color: white; font-size: 0.8rem; font-weight: bold; margin-bottom: 10px; display: inline-block; }
        .priority.CRITICA { background: #ef4444; }
        .priority.ALTA { background: #f59e0b; }
        .priority.MEDIA { background: #3b82f6; }
        .insights { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin: 20px 0; }
        .insight-card { background: white; padding: 20px; border-radius: 10px; }
        .insight-type { color: #059669; font-weight: bold; margin-bottom: 10px; }
        .projection { background: #f0f9ff; padding: 25px; border-radius: 10px; margin: 20px 0; }
      </style>
      </head>
      <body>
        <div class="header">
          <h1>🧠 Business Intelligence</h1>
          <p>Analisi AI automatica e raccomandazioni strategiche</p>
          <small>Aggiornato: ${new Date().toLocaleString('it-IT')}</small>
        </div>
        
        <div class="nav">
          <a href="/">🏠 Home</a>
          <a href="/dashboard">📊 Dashboard</a>
          <a href="/products">📦 Prodotti</a>
          <a href="/orders">🛒 Ordini</a>
          <a href="/customers">👥 Clienti</a>
          <a href="/insights" class="active">🧠 AI Insights</a>
          <a href="/claude">🤖 Claude</a>
        </div>
        
        <div class="health-score">
          <h2>📈 Business Health Score</h2>
          <div class="score">${aiAnalysis.business_health.score}/100</div>
          <p><strong>Status:</strong> ${aiAnalysis.business_health.status}</p>
          <p><strong>Prossimo Milestone:</strong> ${aiAnalysis.business_health.next_milestone}</p>
        </div>
        
        ${aiAnalysis.alerts.length > 0 ? `
        <div class="alerts">
          <h2>🚨 Alert Prioritari</h2>
          ${aiAnalysis.alerts.map(alert => `
            <div class="alert ${alert.type}">
              <h3>${alert.title}</h3>
              <p>${alert.message}</p>
              <strong>Azione:</strong> ${alert.action}
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        <div class="recommendations">
          <h2 style="grid-column: 1/-1;">🎯 Raccomandazioni AI Strategiche</h2>
          ${aiAnalysis.recommendations.map(rec => `
            <div class="rec-card">
              <div class="priority ${rec.priority}">${rec.priority}</div>
              <h3>${rec.title}</h3>
              <p>${rec.description}</p>
              <p><strong>Impact:</strong> ${rec.impact}</p>
              <p><strong>Effort:</strong> ${rec.effort}</p>
            </div>
          `).join('')}
        </div>
        
        ${aiAnalysis.insights.length > 0 ? `
        <div class="insights">
          <h2 style="grid-column: 1/-1;">💡 AI Insights</h2>
          ${aiAnalysis.insights.map(insight => `
            <div class="insight-card">
              <div class="insight-type">${insight.type.toUpperCase()}</div>
              <h4>${insight.title}</h4>
              <p><strong>${insight.value}</strong></p>
              <p>${insight.insight}</p>
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        <div class="projection">
          <h2>📊 Proiezioni Revenue</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px;">
            <div style="text-align: center;">
              <h3 style="color: #3b82f6;">€${aiAnalysis.revenue_projection.first_month_target.toFixed(0)}</h3>
              <p>Target Primo Mese</p>
            </div>
            <div style="text-align: center;">
              <h3 style="color: #059669;">€${aiAnalysis.revenue_projection.monthly_potential.toFixed(0)}</h3>
              <p>Potenziale Mensile</p>
            </div>
            <div style="text-align: center;">
              <h3 style="color: #7c3aed;">€${aiAnalysis.revenue_projection.quarterly_goal.toFixed(0)}</h3>
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

// Dashboard con AI Insights integrati
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
    
    // Genera AI insights per quick alerts
    const aiAnalysis = generateAIInsights(products, orders, customers);
    const topAlert = aiAnalysis.alerts[0];
    const topRecommendation = aiAnalysis.recommendations[0];

    res.send(`
      <html>
      <head><title>Dashboard - Viky Store</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
