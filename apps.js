// ===== TRADEOS APPLICATIONS =====

// ===== OPEN APP DISPATCHER =====
function openApp(appId, extra={}) {
  switch(appId) {
    case 'terminal': return renderTerminal();
    case 'portfolio': return renderPortfolio();
    case 'screener': return renderScreener();
    case 'news': return renderNews();
    case 'calendar': return renderCalendar();
    case 'notebook': return renderNotebook();
    case 'backtest': return renderBacktest();
    case 'alerts': return renderAlerts();
    case 'watchlist': return renderWatchlist();
    case 'options': return renderOptions();
    case 'files': return renderFiles();
    case 'settings': return renderSettings();
  }
}

// ================================================================
// 1. TERMINAL - Candlestick Chart with Indicators
// ================================================================
function renderTerminal() {
  const id = createWindow('terminal', 'Терминал', '', {w:950, h:650});
  const body = document.getElementById(id).querySelector('.window-body');
  
  const symbols = ['AAPL','MSFT','GOOGL','AMZN','TSLA','NVDA','META','SPY','BTC-USD','ETH-USD'];
  let currentSymbol = 'AAPL';
  let timeframe = '1D';

  body.innerHTML = `
    <div style="display:flex;flex-direction:column;height:100%;background:#0a0e17;">
      <!-- Toolbar -->
      <div style="display:flex;align-items:center;padding:8px 16px;background:#111b26;border-bottom:1px solid #1a2332;gap:8px;">
        <select id="term-symbol" style="background:#0a0e17;color:#e2e8f0;border:1px solid #1a2332;border-radius:6px;padding:6px 12px;font-size:13px;">
          ${symbols.map(s => `<option value="${s}">${s}</option>`).join('')}
        </select>
        <div style="display:flex;gap:2px;">
          ${['1m','5m','15m','1H','1D','1W'].map(tf => 
            `<button class="tf-btn" data-tf="${tf}" style="padding:6px 12px;border:1px solid ${tf==='1D'?'#00d4aa':'#1a2332'};background:${tf==='1D'?'rgba(0,212,170,0.15)':'transparent'};color:${tf==='1D'?'#00d4aa':'#8892a4'};border-radius:4px;cursor:pointer;font-size:11px;">${tf}</button>`
          ).join('')}
        </div>
        <div style="flex:1;"></div>
        <div style="display:flex;gap:8px;align-items:center;">
          <label style="color:#4a5568;font-size:11px;cursor:pointer;display:flex;align-items:center;gap:4px;">
            <input type="checkbox" checked class="show-sma20"> SMA 20
          </label>
          <label style="color:#4a5568;font-size:11px;cursor:pointer;display:flex;align-items:center;gap:4px;">
            <input type="checkbox" checked class="show-sma50"> SMA 50
          </label>
          <label style="color:#4a5568;font-size:11px;cursor:pointer;display:flex;align-items:center;gap:4px;">
            <input type="checkbox" class="show-boll"> Bollinger
          </label>
          <label style="color:#4a5568;font-size:11px;cursor:pointer;display:flex;align-items:center;gap:4px;">
            <input type="checkbox" class="show-volume"> Volume
          </label>
        </div>
      </div>
      <!-- Chart Area -->
      <div style="flex:1;display:flex;flex-direction:column;position:relative;">
        <canvas id="term-canvas-${id}" class="chart-canvas"></canvas>
      </div>
      <!-- Info Bar -->
      <div style="display:flex;align-items:center;padding:6px 16px;background:#111b26;border-top:1px solid #1a2332;gap:16px;font-size:11px;">
        <span style="color:#4a5568;">O:</span><span class="c-o" style="color:#8892a4;font-family:monospace;">-</span>
        <span style="color:#4a5568;">H:</span><span class="c-h" style="color:#8892a4;font-family:monospace;">-</span>
        <span style="color:#4a5568;">L:</span><span class="c-l" style="color:#8892a4;font-family:monospace;">-</span>
        <span style="color:#4a5568;">C:</span><span class="c-c" style="color:#8892a4;font-family:monospace;">-</span>
        <span style="color:#4a5568;">Vol:</span><span class="c-v" style="color:#8892a4;font-family:monospace;">-</span>
        <span style="flex:1;"></span>
        <span style="color:#00d4aa;">SMA20:</span><span class="sma20-val" style="color:#00d4aa;font-family:monospace;">-</span>
        <span style="color:#ffa502;">SMA50:</span><span class="sma50-val" style="color:#ffa502;font-family:monospace;">-</span>
      </div>
    </div>`;

  const canvas = document.getElementById('term-canvas-'+id);
  const ctx = canvas.getContext('2d');
  
  // Timeframe buttons
  body.querySelectorAll('.tf-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      body.querySelectorAll('.tf-btn').forEach(b => { b.style.borderColor='#1a2332'; b.style.background='transparent'; b.style.color='#8892a4'; });
      this.style.borderColor='#00d4aa'; this.style.background='rgba(0,212,170,0.15)'; this.style.color='#00d4aa';
      timeframe = this.dataset.tf;
      drawChart();
    });
  });

  // Symbol change
  document.getElementById('term-symbol').addEventListener('change', function() {
    currentSymbol = this.value;
    drawChart();
  });

  function drawChart() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = (rect.height - 30) * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = (rect.height - 30) + 'px';
    ctx.scale(dpr, dpr);
    const W = rect.width, H = rect.height - 30;

    const data = generateCandleData(currentSymbol, 60);
    const showSMA20 = body.querySelector('.show-sma20')?.checked;
    const showSMA50 = body.querySelector('.show-sma50')?.checked;
    const showVol = body.querySelector('.show-volume')?.checked;

    const priceH = showVol ? H * 0.7 : H;
    const volH = showVol ? H * 0.3 : 0;

    // Calculate ranges
    let minP = Infinity, maxP = -Infinity, maxV = 0;
    data.forEach(d => {
      minP = Math.min(minP, d.low);
      maxP = Math.max(maxP, d.high);
      maxV = Math.max(maxV, d.volume);
    });
    const padding = (maxP - minP) * 0.1;
    minP -= padding; maxP += padding;

    const barW = (W / data.length) * 0.7;
    const gap = W / data.length;

    // Background
    ctx.fillStyle = '#0a0e17';
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = '#1a2332';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 5; i++) {
      const y = (priceH / 5) * i;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      const price = maxP - ((maxP - minP) / 5) * i;
      ctx.fillStyle = '#2d3a4a';
      ctx.font = '10px monospace';
      ctx.fillText(price.toFixed(2), W - 50, y + 12);
    }

    // Draw candles
    data.forEach((d, i) => {
      const x = i * gap + gap/2;
      const isUp = d.close >= d.open;
      const color = isUp ? '#00d4aa' : '#ff4757';
      
      const oY = priceH - ((d.open - minP) / (maxP - minP)) * priceH;
      const cY = priceH - ((d.close - minP) / (maxP - minP)) * priceH;
      const hY = priceH - ((d.high - minP) / (maxP - minP)) * priceH;
      const lY = priceH - ((d.low - minP) / (maxP - minP)) * priceH;

      // Wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, hY); ctx.lineTo(x, lY); ctx.stroke();
      
      // Body
      ctx.fillStyle = color;
      const bodyTop = Math.min(oY, cY);
      const bodyH = Math.max(Math.abs(cY - oY), 1);
      ctx.fillRect(x - barW/2, bodyTop, barW, bodyH);

      // Volume bars
      if (showVol) {
        const vH = (d.volume / maxV) * volH;
        ctx.fillStyle = isUp ? 'rgba(0,212,170,0.3)' : 'rgba(255,71,87,0.3)';
        ctx.fillRect(x - barW/2, priceH + volH - vH, barW, vH);
      }
    });

    // SMA lines
    function drawSMA(period, color) {
      if (!body.querySelector('.show-sma' + period)) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      let started = false;
      for (let i = period - 1; i < data.length; i++) {
        let sum = 0;
        for (let j = 0; j < period; j++) sum += data[i-j].close;
        const sma = sum / period;
        const x = i * gap + gap/2;
        const y = priceH - ((sma - minP) / (maxP - minP)) * priceH;
        if (!started) { ctx.moveTo(x, y); started = true; }
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    drawSMA(20, '#00d4aa');
    drawSMA(50, '#ffa502');

    // Update info
    const last = data[data.length - 1];
    body.querySelector('.c-o').textContent = last.open.toFixed(2);
    body.querySelector('.c-h').textContent = last.high.toFixed(2);
    body.querySelector('.c-l').textContent = last.low.toFixed(2);
    body.querySelector('.c-c').textContent = last.close.toFixed(2);
    body.querySelector('.c-v').textContent = (last.volume / 1e6).toFixed(1) + 'M';

    // SMA values
    const last20 = sma20(data, 20);
    const last50 = sma20(data, 50);
    if (last20) body.querySelector('.sma20-val').textContent = last20.toFixed(2);
    if (last50) body.querySelector('.sma50-val').textContent = last50.toFixed(2);
  }

  function sma20(data, period) {
    if (data.length < period) return null;
    let sum = 0;
    for (let i = data.length - period; i < data.length; i++) sum += data[i].close;
    return sum / period;
  }

  drawChart();
  setTimeout(drawChart, 100);
}

// ================================================================
// 2. PORTFOLIO - Portfolio Manager
// ================================================================
function renderPortfolio() {
  const id = createWindow('portfolio', 'Портфель', '', {w:850, h:600});
  const body = document.getElementById(id).querySelector('.window-body');
  
  function updatePortfolio() {
    let totalValue = portfolio.cash;
    let totalCost = 0;
    let totalPnL = 0;
    let totalPnLPct = 0;

    portfolio.positions.forEach(p => {
      const marketValue = p.shares * p.currentPrice;
      totalValue += marketValue;
      totalCost += p.shares * p.avgPrice;
      const posPnL = (p.currentPrice - p.avgPrice) * p.shares;
      totalPnL += posPnL;
    });
    totalPnLPct = ((totalValue - totalCost) / totalCost * 100);

    const isPositive = totalPnL >= 0;
    body.querySelector('.total-value').textContent = '$' + totalValue.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
    body.querySelector('.total-pnl').textContent = (isPositive?'+':'') + '$' + totalPnL.toFixed(2);
    body.querySelector('.total-pnl').className = 'value ' + (isPositive?'positive':'negative');
    body.querySelector('.pnl-pct').textContent = (isPositive?'+':'') + totalPnLPct.toFixed(2) + '%';
    body.querySelector('.pnl-pct').className = 'value ' + (isPositive?'positive':'negative');
    body.querySelector('.cash-value').textContent = '$' + portfolio.cash.toLocaleString('en-US', {minimumFractionDigits:2});

    // Positions table
    let posHtml = '';
    portfolio.positions.forEach(p => {
      const mv = p.shares * p.currentPrice;
      const cost = p.shares * p.avgPrice;
      const pnl = mv - cost;
      const pnlPct = ((p.currentPrice - p.avgPrice) / p.avgPrice * 100);
      const posPositive = pnl >= 0;
      // Allocation
      const alloc = (mv / totalValue * 100).toFixed(1);
      posHtml += `<tr>
        <td class="symbol-cell">${p.symbol}</td>
        <td>${p.shares}</td>
        <td>$${p.avgPrice.toFixed(2)}</td>
        <td>$${p.currentPrice.toFixed(2)}</td>
        <td style="color:${posPositive?'#00d4aa':'#ff4757'}">${posPositive?'+':''}$${pnl.toFixed(2)}</td>
        <td style="color:${posPositive?'#00d4aa':'#ff4757'}">${posPositive?'+':''}${pnlPct.toFixed(2)}%</td>
        <td>${alloc}%</td>
      </tr>`;
    });
    body.querySelector('.positions-body').innerHTML = posHtml;
  }

  body.innerHTML = `
    <div style="display:flex;flex-direction:column;height:100%;background:#0a0e17;">
      <div class="portfolio-summary">
        <div class="portfolio-card">
          <h4>Общая стоимость</h4>
          <div class="value total-value" style="color:#e2e8f0;">$0</div>
        </div>
        <div class="portfolio-card">
          <h4>Нереализ. P&L</h4>
          <div class="value total-pnl positive">+$0</div>
        </div>
        <div class="portfolio-card">
          <h4>Доходность</h4>
          <div class="value pnl-pct positive">+0%</div>
        </div>
        <div class="portfolio-card">
          <h4>Наличные</h4>
          <div class="value cash-value" style="color:#e2e8f0;">$0</div>
        </div>
      </div>
      <div style="padding:12px 16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <h3 style="font-size:14px;color:#e2e8f0;">Позиции</h3>
          <button class="refresh-portfolio" style="background:#00d4aa;border:none;color:#000;padding:6px 16px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;">🔄 Обновить цены</button>
        </div>
        <div style="overflow:auto;flex:1;">
          <table class="screener-table">
            <thead><tr>
              <th>Символ</th><th>Шеры</th><th>Ср. цена</th><th>Тек. цена</th><th>P&L</th><th>P&L %</th><th>Долг.</th>
            </tr></thead>
            <tbody class="positions-body"></tbody>
          </table>
        </div>
      </div>
      <!-- Allocation Chart -->
      <div style="padding:12px 16px;border-top:1px solid #1a2332;">
        <h4 style="font-size:12px;color:#4a5568;margin-bottom:8px;">Структура портфеля</h4>
        <div class="alloc-bars" style="display:flex;height:24px;border-radius:4px;overflow:hidden;"></div>
        <div class="alloc-legend" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;"></div>
      </div>
    </div>`;

  updatePortfolio();

  // Refresh button
  body.querySelector('.refresh-portfolio').addEventListener('click', () => {
    // Simulate price updates
    portfolio.positions.forEach(p => {
      const change = (Math.random() - 0.5) * p.currentPrice * 0.01;
      p.currentPrice = +(p.currentPrice + change).toFixed(2);
    });
    updatePortfolio();
    notify('Портфель', 'Цены обновлены');
  });

  // Allocation bars
  setTimeout(() => {
    const colors = ['#00d4aa','#00a8ff','#ffa502','#ff4757','#a855f7','#3b82f6','#22c55e','#f43f5e'];
    let totalVal = portfolio.cash;
    portfolio.positions.forEach(p => totalVal += p.shares * p.currentPrice);
    const bars = body.querySelector('.alloc-bars');
    const legend = body.querySelector('.alloc-legend');
    let html = '';
    let legendHtml = '';
    let colorIdx = 0;
    const items = portfolio.positions.map(p => ({symbol:p.symbol, value:p.shares*p.currentPrice, color:colors[colorIdx++%colors.length]}));
    items.push({symbol:'Cash', value:portfolio.cash, color:'#4a5568'});
    items.forEach(item => {
      const pct = (item.value / totalVal * 100).toFixed(1);
      html += `<div style="width:${pct}%;background:${item.color};height:100%;"></div>`;
      legendHtml += `<span style="font-size:11px;color:#8892a4;display:flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;background:${item.color};border-radius:2px;display:inline-block;"></span>${item.symbol} ${pct}%</span>`;
    });
    bars.innerHTML = html;
    legend.innerHTML = legendHtml;
  }, 100);
}

// ================================================================
// 3. SCREENER - Stock Screener
// ================================================================
function renderScreener() {
  const id = createWindow('screener', 'Скринер', '', {w:900, h:620});
  const body = document.getElementById(id).querySelector('.window-body');
  
  let filterPe = {min:0, max:100};
  let filterRsi = {min:0, max:100};
  let filterMarketCap = 'all';

  function renderTable() {
    let filtered = SCREENER_STOCKS.filter(s => {
      if (s.pe < filterPe.min || s.pe > filterPe.max) return false;
      if (s.rsi < filterRsi.min || s.rsi > filterRsi.max) return false;
      if (filterMarketCap === 'large' && parseFloat(s.marketCap) < 100) return false;
      if (filterMarketCap === 'small' && parseFloat(s.marketCap) > 100) return false;
      return true;
    });

    let html = '<table class="screener-table"><thead><tr>';
    html += '<th>Символ</th><th>Название</th><th>Цена</th><th>Изм.</th><th>Капитализация</th><th>P/E</th><th>EPS</th><th>Див.</th><th>Объём</th><th>Beta</th><th>RSI</th>';
    html += '</tr></thead><tbody>';
    filtered.forEach(s => {
      const rsiColor = s.rsi > 70 ? '#ff4757' : s.rsi < 30 ? '#00d4aa' : '#8892a4';
      const changeClass = s.change >= 0 ? 'positive' : 'negative';
      html += `<tr style="cursor:pointer;">
        <td class="symbol-cell">${s.symbol}</td>
        <td style="font-family:inherit;color:#8892a4;">${s.name}</td>
        <td>$${s.price.toFixed(2)}</td>
        <td style="color:${s.change>=0?'#00d4aa':'#ff4757'}">${s.change>=0?'+':''}${s.change.toFixed(2)}%</td>
        <td>${s.marketCap}</td>
        <td>${s.pe > 0 ? s.pe.toFixed(1) : '-'}</td>
        <td>$${s.eps.toFixed(2)}</td>
        <td>${s.dividend > 0 ? s.dividend.toFixed(2)+'%' : '-'}</td>
        <td>${s.volume}</td>
        <td>${s.beta.toFixed(2)}</td>
        <td style="color:${rsiColor};font-weight:600;">${s.rsi}</td>
      </tr>`;
    });
    html += '</tbody></table>';
    body.querySelector('.screener-table-wrap').innerHTML = html;
    body.querySelector('.result-count').textContent = `Найдено: ${filtered.length} акций`;
  }

  body.innerHTML = `
    <div style="display:flex;flex-direction:column;height:100%;background:#0a0e17;">
      <div style="display:flex;align-items:center;padding:12px 16px;background:#111b26;border-bottom:1px solid #1a2332;gap:12px;flex-wrap:wrap;">
        <h3 style="font-size:14px;color:#e2e8f0;">Фильтры</h3>
        <div style="display:flex;align-items:center;gap:6px;">
          <span style="color:#4a5568;font-size:11px;">P/E:</span>
          <input type="number" class="filter-pe-min" value="0" style="width:50px;padding:4px 8px;background:#0a0e17;border:1px solid #1a2332;border-radius:4px;color:#e2e8f0;font-size:11px;">
          <span style="color:#4a5568;">—</span>
          <input type="number" class="filter-pe-max" value="100" style="width:50px;padding:4px 8px;background:#0a0e17;border:1px solid #1a2332;border-radius:4px;color:#e2e8f0;font-size:11px;">
        </div>
        <div style="display:flex;align-items:center;gap:6px;">
          <span style="color:#4a5568;font-size:11px;">RSI:</span>
          <input type="number" class="filter-rsi-min" value="0" style="width:50px;padding:4px 8px;background:#0a0e17;border:1px solid #1a2332;border-radius:4px;color:#e2e8f0;font-size:11px;">
          <span style="color:#4a5568;">—</span>
          <input type="number" class="filter-rsi-max" value="100" style="width:50px;padding:4px 8px;background:#0a0e17;border:1px solid #1a2332;border-radius:4px;color:#e2e8f0;font-size:11px;">
        </div>
        <select class="filter-mcap" style="padding:4px 8px;background:#0a0e17;border:1px solid #1a2332;border-radius:4px;color:#e2e8f0;font-size:11px;">
          <option value="all">Любой cap</option>
          <option value="large">> $10B</option>
          <option value="small">< $10B</option>
        </select>
        <button class="screener-apply" style="background:#00d4aa;border:none;color:#000;padding:6px 16px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;">Применить</button>
        <span class="result-count" style="margin-left:auto;font-size:12px;color:#4a5568;">Найдено: 20 акций</span>
      </div>
      <div class="screener-table-wrap" style="flex:1;overflow:auto;"></div>
    </div>`;

  body.querySelector('.screener-apply').addEventListener('click', () => {
    filterPe.min = parseInt(body.querySelector('.filter-pe-min').value) || 0;
    filterPe.max = parseInt(body.querySelector('.filter-pe-max').value) || 100;
    filterRsi.min = parseInt(body.querySelector('.filter-rsi-min').value) || 0;
    filterRsi.max = parseInt(body.querySelector('.filter-rsi-max').value) || 100;
    filterMarketCap = body.querySelector('.filter-mcap').value;
    renderTable();
  });

  renderTable();
}

// ================================================================
// 4. NEWS - Market News with Sentiment
// ================================================================
function renderNews() {
  const id = createWindow('news', 'Новости', '', {w:750, h:550});
  const body = document.getElementById(id).querySelector('.window-body');

  let html = '<div style="display:flex;flex-direction:column;height:100%;background:#0a0e17;">';
  html += '<div style="padding:12px 16px;background:#111b26;border-bottom:1px solid #1a2332;">';
  html += '<h3 style="font-size:14px;color:#e2e8f0;">📰 Лента новостей рынка</h3></div>';
  html += '<div class="news-feed" style="flex:1;overflow:auto;">';
  
  NEWS_DATA.forEach((news, i) => {
    const sentimentClass = news.sentiment;
    const sentimentLabel = news.sentiment === 'bullish' ? '🐂 Бычьи' : news.sentiment === 'bearish' ? '🐻 Медвежьи' : '⚖️ Нейтральные';
    html += `<div class="news-item" onclick="showNewsDetail(${i})">
      <div class="news-header">
        <span class="news-source">${news.source}</span>
        <span class="news-time">${news.time}</span>
        <span class="news-sentiment ${sentimentClass}">${sentimentLabel}</span>
      </div>
      <div class="news-title">${news.title}</div>
      <div class="news-desc">${news.desc}</div>
      <div style="margin-top:6px;display:flex;gap:4px;">
        ${news.symbols.map(s => `<span style="font-size:10px;padding:2px 6px;background:#111b26;border-radius:3px;color:#4a5568;">${s}</span>`).join('')}
      </div>
    </div>`;
  });
  
  html += '</div></div>';
  body.innerHTML = html;

  window.showNewsDetail = function(idx) {
    const news = NEWS_DATA[idx];
    notify(news.source, news.title, news.sentiment === 'bullish' ? 'success' : news.sentiment === 'bearish' ? 'error' : 'warning');
  };
}

// ================================================================
// 5. CALENDAR - Economic Calendar
// ================================================================
function renderCalendar() {
  const id = createWindow('calendar', 'Календарь', '', {w:700, h:580});
  const body = document.getElementById(id).querySelector('.window-body');

  const months = ['ЯНВ','ФЕВ','МАР','АПР','МАЙ','ИЮН','ИЮЛ','АВГ','СЕН','ОКТ','НОЯ','ДЕК'];

  let html = '<div style="display:flex;flex-direction:column;height:100%;background:#0a0e17;">';
  html += '<div style="padding:12px 16px;background:#111b26;border-bottom:1px solid #1a2332;display:flex;justify-content:space-between;align-items:center;">';
  html += '<h3 style="font-size:14px;color:#e2e8f0;">📅 Экономический календарь</h3>';
  html += '<div style="display:flex;gap:8px;font-size:11px;">';
  html += '<span style="color:#ff4757;">● Высокий</span><span style="color:#ffa502;">● Средний</span><span style="color:#00d4aa;">● Низкий</span>';
  html += '</div></div><div class="calendar-feed" style="flex:1;overflow:auto;">';

  CALENDAR_EVENTS.forEach(ev => {
    html += `<div class="calendar-event">
      <div class="calendar-date"><span class="day">${ev.day}</span><span class="month">${months[ev.day % 12]}</span></div>
      <div class="calendar-info">
        <div class="event-name">${ev.name}</div>
        <div class="event-desc">Время: ${ev.time} | Прогноз: ${ev.forecast} | Пред.: ${ev.previous}</div>
      </div>
      <span class="calendar-impact ${ev.impact}">${ev.impact === 'high' ? 'Высокий' : ev.impact === 'medium' ? 'Средний' : 'Низкий'}</span>
    </div>`;
  });

  html += '</div></div>';
  body.innerHTML = html;
}

// ================================================================
// 6. NOTEBOOK - Python Analysis Notebook
// ================================================================
function renderNotebook() {
  const id = createWindow('notebook', 'Notebook', '', {w:800, h:620});
  const body = document.getElementById(id).querySelector('.window-body');

  body.innerHTML = `
    <div style="display:flex;flex-direction:column;height:100%;background:#0a0e17;">
      <div style="display:flex;align-items:center;padding:8px 12px;background:#111b26;border-bottom:1px solid #1a2332;gap:8px;">
        <button class="nb-add-cell" style="background:#00d4aa;border:none;color:#000;padding:6px 16px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;">+ Добавить ячейку</button>
        <button class="nb-run-all" style="background:#0a0e17;border:1px solid #1a2332;color:#8892a4;padding:6px 16px;border-radius:6px;cursor:pointer;font-size:12px;">▶ Запустить всё</button>
        <span style="margin-left:auto;font-size:11px;color:#4a5568;">🐍 Python (Pyodide)</span>
      </div>
      <div class="notebook-cells" style="flex:1;overflow-y:auto;padding:8px;"></div>
    </div>`;

  const cellsContainer = body.querySelector('.notebook-cells');
  let cellCounter = 0;

  // Default code cells
  const defaultCells = [
    { code: `# TradeOS Python Notebook\nimport pandas as pd\nimport numpy as np\nprint("TradeOS Notebook готов к работе! 🚀")`, type:'code' },
    { code: `# Загрузка данных\nimport pandas as pd\n\n# Создаём тестовые данные\ndates = pd.date_range('2024-01-01', periods=30)\nprices = [180 + np.random.randn().cumsum() * 2 for _ in range(30)]\ndf = pd.DataFrame({'Date': dates, 'Close': prices})\ndf['SMA_7'] = df['Close'].rolling(7).mean()\nprint(df.tail(10))`, type:'code' },
    { code: `# Визуализация\nimport matplotlib.pyplot as plt\n\nplt.figure(figsize=(10, 4))\nplt.plot(df['Date'], df['Close'], label='Цена')\nplt.plot(df['Date'], df['SMA_7'], label='SMA(7)', alpha=0.7)\nplt.legend()\nprint("График построен в памяти 📊")`, type:'code' },
  ];

  defaultCells.forEach(cell => addCodeCell(cell.code));

  function addCodeCell(code='') {
    const cellId = 'nb-cell-' + (++cellCounter);
    const cell = document.createElement('div');
    cell.className = 'notebook-cell';
    cell.id = cellId;
    cell.innerHTML = `
      <textarea placeholder="Введите Python код..." style="min-height:80px;">${code}</textarea>
      <div style="display:flex;gap:8px;margin-top:8px;">
        <button class="nb-run" data-cell="${cellId}" style="background:#00d4aa;border:none;color:#000;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:11px;font-weight:600;">▶ Выполнить</button>
        <button class="nb-delete" data-cell="${cellId}" style="background:transparent;border:1px solid #ff4757;color:#ff4757;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:11px;">🗑 Удалить</button>
      </div>
      <div class="output" style="display:none;"></div>
    `;
    cellsContainer.appendChild(cell);

    cell.querySelector('.nb-run').addEventListener('click', function() {
      const textarea = cell.querySelector('textarea');
      const output = cell.querySelector('.output');
      const code = textarea.value;
      output.style.display = 'block';
      output.textContent = '⏳ Выполнение...';
      output.style.color = '#ffa502';
      
      setTimeout(() => {
        // Simulate Python output
        let result = simulatePythonExecution(code);
        output.style.color = '#8892a4';
        output.textContent = '>> ' + result.join('\n>> ');
        notify('Notebook', 'Ячейка выполнена');
      }, 800);
    });

    cell.querySelector('.nb-delete').addEventListener('click', function() {
      cell.remove();
    });
  }

  body.querySelector('.nb-add-cell').addEventListener('click', () => addCodeCell());
  body.querySelector('.nb-run-all').addEventListener('click', () => {
    body.querySelectorAll('.nb-run').forEach(btn => btn.click());
  });

  function simulatePythonExecution(code) {
    const lines = [];
    lines.push('Python 3.11.0 (TradeOS Kernel)');
    lines.push('Набор данных: pandas, numpy');
    
    if (code.includes('print')) {
      const printMatch = code.match(/print\((.+)\)/);
      if (printMatch) lines.push(printMatch[1].replace(/['"]/g, ''));
    }
    if (code.includes('SMA')) lines.push('SMA(7) вычислен для 30 баров');
    if (code.includes('plt') || code.includes('graph')) lines.push('Фигура matplotlib создана (10x4)');
    if (code.includes('df.tail')) lines.push('Последние 10 строк DataFrame выведены');
    if (code.includes('np.random')) lines.push('Random seed: None, shape: (30,)');
    
    if (lines.length <= 2) lines.push('# Код выполнен успешно ✓');
    return lines;
  }
}

// ================================================================
// 7. BACKTEST - Strategy Backtesting
// ================================================================
function renderBacktest() {
  const id = createWindow('backtest', 'Бэктест', '', {w:900, h:650});
  const body = document.getElementById(id).querySelector('.window-body');

  let html = '<div style="display:flex;flex-direction:column;height:100%;background:#0a0e17;">';
  
  // Strategy selector
  html += '<div style="padding:16px;background:#111b26;border-bottom:1px solid #1a2332;">';
  html += '<h3 style="font-size:14px;color:#e2e8f0;margin-bottom:12px;">📈 Тестирование стратегий</h3>';
  html += '<div style="display:flex;gap:8px;flex-wrap:wrap;">';
  BACKTEST_STRATEGIES.forEach((strat, i) => {
    html += `<button class="backtest-strat" data-idx="${i}" style="padding:8px 16px;border-radius:8px;border:1px solid #1a2332;background:transparent;color:#8892a4;cursor:pointer;font-size:12px;transition:all 0.2s;">${strat.name}</button>`;
  });
  html += '</div></div>';

  // Results
  html += '<div style="flex:1;overflow:auto;padding:16px;">';
  html += '<div class="backtest-result" id="backtest-stats"></div>';
  html += '<div style="margin-top:16px;background:#111b26;border-radius:8px;padding:16px;border:1px solid #1a2332;">';
  html += '<h4 style="font-size:13px;color:#e2e8f0;margin-bottom:12px;">📊 Equity Curve</h4>';
  html += '<canvas id="backtest-canvas" style="width:100%;height:250px;"></canvas>';
  html += '</div></div></div>';
  body.innerHTML = html;

  // Strategy buttons
  body.querySelectorAll('.backtest-strat').forEach(btn => {
    btn.addEventListener('click', function() {
      body.querySelectorAll('.backtest-strat').forEach(b => { b.style.borderColor='#1a2332'; b.style.color='#8892a4'; b.style.background='transparent'; });
      this.style.borderColor='#00d4aa'; this.style.color='#00d4aa'; this.style.background='rgba(0,212,170,0.1)';
      const idx = parseInt(this.dataset.idx);
      showBacktestResult(idx);
    });
  });

  function showBacktestResult(idx) {
    const strat = BACKTEST_STRATEGIES[idx];
    const stats = body.querySelector('#backtest-stats');
    stats.innerHTML = `
      <div class="backtest-stat"><div class="label">Начальный капитал</div><div class="value" style="color:#e2e8f0;">$${strat.initialCapital.toLocaleString()}</div></div>
      <div class="backtest-stat"><div class="label">Общая доходность</div><div class="value positive">+${strat.totalReturn}%</div></div>
      <div class="backtest-stat"><div class="label">Sharpe Ratio</div><div class="value" style="color:#00a8ff;">${strat.sharpeRatio}</div></div>
      <div class="backtest-stat"><div class="label">Макс. просадка</div><div class="value negative">${strat.maxDrawdown}%</div></div>
      <div class="backtest-stat"><div class="label">Win Rate</div><div class="value" style="color:#00d4aa;">${strat.winRate}%</div></div>
      <div class="backtest-stat"><div class="label">Трейдов</div><div class="value" style="color:#e2e8f0;">${strat.trades}</div></div>
      <div class="backtest-stat"><div class="label">Profit Factor</div><div class="value" style="color:#ffa502;">${strat.profitFactor}</div></div>
    `;
    drawEquityCurve(strat);
  }

  function drawEquityCurve(strat) {
    const canvas = body.querySelector('#backtest-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(dpr, dpr);
    const W = rect.width, H = rect.height;

    // Generate equity curve
    let equity = strat.initialCapital;
    const data = [equity];
    const steps = 60;
    for (let i = 0; i < steps; i++) {
      equity *= (1 + (Math.random() - 0.42) * 0.015);
      data.push(equity);
    }
    // Force end near target
    const target = strat.initialCapital * (1 + strat.totalReturn / 100);
    data[data.length - 1] = target;

    const minVal = Math.min(...data) * 0.95;
    const maxVal = Math.max(...data) * 1.05;
    const range = maxVal - minVal;

    // Background
    ctx.fillStyle = '#0a0e17';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = '#1a2332';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 4; i++) {
      const y = (H / 4) * i;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Equity line
    ctx.strokeStyle = '#00d4aa';
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach((val, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - ((val - minVal) / range) * H;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill under curve
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0,212,170,0.1)';
    ctx.fill();

    // Labels
    ctx.fillStyle = '#8892a4';
    ctx.font = '11px monospace';
    ctx.fillText('$' + minVal.toFixed(0), 8, H - 8);
    ctx.fillText('$' + maxVal.toFixed(0), 8, 16);
    ctx.fillStyle = '#00d4aa';
    ctx.fillText('$' + target.toFixed(0), W - 70, 16);
  }

  // Show first strategy by default
  setTimeout(() => {
    body.querySelector('.backtest-strat')?.click();
  }, 100);
}

// ================================================================
// 8. ALERTS - Price & Indicator Alerts
// ================================================================
function renderAlerts() {
  const id = createWindow('alerts', 'Оповещения', '', {w:700, h:520});
  const body = document.getElementById(id).querySelector('.window-body');

  function renderAlertsList() {
    let html = `<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#111b26;border-bottom:1px solid #1a2332;">
      <h3 style="font-size:14px;color:#e2e8f0;">🔔 Активные оповещения (${alerts.filter(a=>a.active).length})</h3>
      <button class="add-alert-btn" style="background:#00d4aa;border:none;color:#000;padding:6px 16px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;">+ Добавить</button>
    </div><div class="alerts-list" style="flex:1;overflow:auto;">`;
    
    alerts.forEach(alert => {
      const dotClass = alert.triggered ? 'triggered' : alert.active ? 'active' : 'inactive';
      const statusClass = alert.triggered ? 'triggered' : alert.active ? 'active' : '';
      const statusText = alert.triggered ? '🔔 Сработал' : alert.active ? 'Активен' : 'Неактивен';
      html += `<div class="alert-item" data-id="${alert.id}">
        <div class="alert-dot ${dotClass}"></div>
        <div class="alert-info">
          <div class="alert-symbol">${alert.symbol}</div>
          <div class="alert-condition">${alert.condition === 'above' ? '>' : alert.condition === 'below' ? '<' : alert.condition} ${alert.value} (${alert.type})</div>
        </div>
        <span class="alert-status ${statusClass}">${statusText}</span>
        <label style="position:relative;width:36px;height:20px;cursor:pointer;">
          <input type="checkbox" ${alert.active?'checked':''} class="alert-toggle" data-id="${alert.id}" style="display:none;">
          <span class="alert-switch" style="position:absolute;top:0;left:0;right:0;bottom:0;background:${alert.active?'#00d4aa':'#1a2332'};border-radius:10px;transition:background 0.3s;"></span>
        </label>
      </div>`;
    });
    
    html += '</div>';
    body.innerHTML = html;

    // Toggle alerts
    body.querySelectorAll('.alert-toggle').forEach(cb => {
      cb.addEventListener('change', function() {
        const alert = alerts.find(a => a.id == this.dataset.id);
        if (alert) {
          alert.active = this.checked;
          renderAlertsList();
          notify('Оповещения', alert.active ? `${alert.symbol} алерт активирован` : `${alert.symbol} алерт отключён`);
        }
      });
    });

    // Add alert
    body.querySelector('.add-alert-btn').addEventListener('click', () => {
      const symbols = ['AAPL','MSFT','GOOGL','AMZN','TSLA','NVDA','META','BTC-USD','ETH-USD','SPY'];
      const sym = prompt('Символ (AAPL, BTC-USD, ...):', 'AAPL');
      if (!sym) return;
      const type = prompt('Тип (price, rsi, volume):', 'price');
      const value = parseFloat(prompt('Значение:', '190'));
      if (!value) return;
      const condition = prompt('Условие (above/below):', 'above');
      alerts.push({ id: Date.now(), symbol: sym.toUpperCase(), type: type || 'price', condition: condition || 'above', value, active: true, triggered: false });
      renderAlertsList();
      notify('Оповещения', `Алерт для ${sym} создан`);
    });
  }

  renderAlertsList();
}

// ================================================================
// 9. WATCHLIST - Watch List
// ================================================================
function renderWatchlist() {
  const id = createWindow('watchlist', 'Ватчлист', '', {w:700, h:500});
  const body = document.getElementById(id).querySelector('.window-body');

  function renderWatchlist() {
    let html = `<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#111b26;border-bottom:1px solid #1a2332;">
      <h3 style="font-size:14px;color:#e2e8f0;">⭐ Мой ватчлист</h3>
      <div style="display:flex;gap:8px;">
        <button class="add-wl-btn" style="background:#00d4aa;border:none;color:#000;padding:6px 16px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;">+ Добавить</button>
        <button class="refresh-wl-btn" style="background:transparent;border:1px solid #1a2332;color:#8892a4;padding:6px 16px;border-radius:6px;cursor:pointer;font-size:12px;">🔄</button>
      </div>
    </div><div style="overflow:auto;flex:1;">
      <table class="screener-table"><thead><tr><th>Символ</th><th>Цена</th><th>Изм.</th><th>Объём</th><th>Действия</th></tr></thead><tbody>`;
    
    watchlist.forEach((sym, i) => {
      const mock = SCREENER_STOCKS.find(s => s.symbol === sym) || { price: 100 + Math.random()*200, change: (Math.random()-0.5)*5, volume: Math.floor(Math.random()*50+10)+'M' };
      const isUp = mock.change >= 0;
      html += `<tr>
        <td class="symbol-cell">${sym}</td>
        <td>$${mock.price.toFixed(2)}</td>
        <td style="color:${isUp?'#00d4aa':'#ff4757'}">${isUp?'+':''}${mock.change.toFixed(2)}%</td>
        <td>${mock.volume}</td>
        <td><button class="remove-wl" data-idx="${i}" style="background:transparent;border:none;color:#ff4757;cursor:pointer;font-size:16px;">×</button></td>
      </tr>`;
    });
    
    html += '</tbody></table></div>';
    body.innerHTML = html;

    // Remove
    body.querySelectorAll('.remove-wl').forEach(btn => {
      btn.addEventListener('click', function() {
        watchlist.splice(parseInt(this.dataset.idx), 1);
        renderWatchlist();
      });
    });

    // Add
    body.querySelector('.add-wl-btn').addEventListener('click', () => {
      const sym = prompt('Символ для добавления:', 'AMD');
      if (sym && !watchlist.includes(sym.toUpperCase())) {
        watchlist.push(sym.toUpperCase());
        renderWatchlist();
      }
    });

    // Refresh
    body.querySelector('.refresh-wl-btn').addEventListener('click', () => {
      renderWatchlist();
      notify('Ватчлист', 'Цены обновлены');
    });
  }

  renderWatchlist();
}

// ================================================================
// 10. OPTIONS - Options Chain
// ================================================================
function renderOptions() {
  const id = createWindow('options', 'Опционы', '', {w:950, h:620});
  const body = document.getElementById(id).querySelector('.window-body');
  const opt = OPTIONS_DATA;

  let html = `<div style="display:flex;flex-direction:column;height:100%;background:#0a0e17;">
    <div style="padding:12px 16px;background:#111b26;border-bottom:1px solid #1a2332;display:flex;justify-content:space-between;align-items:center;">
      <div>
        <h3 style="font-size:14px;color:#e2e8f0;display:inline;">📋 ${opt.symbol} Options Chain</h3>
        <span style="color:#4a5568;font-size:12px;margin-left:12px;">Strike: ${opt.currentPrice} | Expiry: ${opt.expiry}</span>
      </div>
      <div style="display:flex;gap:8px;font-size:11px;">
        <span style="color:#00d4aa;">● ITM Calls</span>
        <span style="color:#ff4757;">● ITM Puts</span>
      </div>
    </div>
    <div style="flex:1;overflow:auto;">
      <table class="options-chain"><thead><tr>
        <th></th><th>Strike</th><th>Call Bid</th><th>Call Ask</th><th>Call Vol</th><th>Call OI</th><th>Call IV</th>
        <th style="background:#1a2332;">PUT IV</th><th>Put OI</th><th>Put Vol</th><th>Put Ask</th><th>Put Bid</th><th></th>
      </tr></thead><tbody>`;

  opt.calls.forEach((call, i) => {
    const put = opt.puts[i];
    const isCallITM = call.strike < opt.currentPrice;
    const isPutITM = put.strike > opt.currentPrice;
    const bgClass = (isCallITM || isPutITM) ? 'in-the-money' : '';
    html += `<tr class="${bgClass}">
      <td style="color:${isPutITM?'#ff4757':'transparent'}">${isPutITM?'▼':''}</td>
      <td class="strike-cell">${call.strike}</td>
      <td style="color:${isCallITM?'#00d4aa':'#8892a4'}">${call.bid}</td>
      <td style="color:${isCallITM?'#00d4aa':'#8892a4'}">${call.ask}</td>
      <td>${call.volume}</td><td>${call.openInterest}</td><td>${call.iv}%</td>
      <td style="background:#1a2332;">${put.iv}%</td><td>${put.openInterest}</td><td>${put.volume}</td>
      <td style="color:${isPutITM?'#ff4757':'#8892a4'}">${put.ask}</td>
      <td style="color:${isPutITM?'#ff4757':'#8892a4'}">${put.bid}</td>
      <td style="color:${isCallITM?'#00d4aa':'transparent'}">${isCallITM?'▲':''}</td>
    </tr>`;
  });

  html += '</tbody></table></div></div>';
  body.innerHTML = html;
}

// ================================================================
// 11. FILES - File Manager
// ================================================================
function renderFiles(startPath) {
  const path = startPath || 'C:\\TradeOS';
  let currentPath = path;
  let navHistory = [path];

  function buildContent() {
    const folder = resolvePath(currentPath);
    if (!folder) return '<div style="padding:40px;color:#ff4757;">Путь не найден</div>';
    const children = folder.children || {};
    const entries = Object.entries(children).sort((a,b) => {
      if (a[1].type==='folder' && b[1].type!=='folder') return -1;
      if (a[1].type!=='folder' && b[1].type==='folder') return 1;
      return a[0].localeCompare(b[0]);
    });

    const parent = currentPath.split('\\').slice(0,-1).join('\\') || 'C:';

    let html = `<div style="display:flex;flex-direction:column;height:100%;">
      <div style="display:flex;align-items:center;padding:8px 12px;background:#111b26;gap:8px;border-bottom:1px solid #1a2332;">
        <button class="file-back" style="background:#1a2332;border:none;color:#8892a4;padding:4px 10px;border-radius:4px;cursor:pointer;">←</button>
        <div style="flex:1;padding:6px 12px;background:#0a0e17;border:1px solid #1a2332;border-radius:4px;color:#8892a4;font-size:12px;font-family:monospace;">${currentPath}</div>
      </div>
      <div style="flex:1;overflow:auto;padding:12px;" class="file-grid">`;

    if (parent !== currentPath) {
      html += `<div class="file-item" data-path="${parent}"><div class="file-icon">📂</div><div class="file-name">..</div></div>`;
    }

    entries.forEach(([name, item]) => {
      const icon = item.type === 'folder' ? '📂' : getFileIcon(item.ext);
      html += `<div class="file-item" data-path="${currentPath.replace(/\\$/,'') + '\\' + name}">
        <div class="file-icon">${icon}</div>
        <div class="file-name">${name}</div>
      </div>`;
    });

    if (entries.length === 0) html += '<div style="padding:40px;text-align:center;color:#4a5568;">Пустая папка</div>';
    html += '</div></div>';
    return html;
  }

  const winId = createWindow('files', 'Файлы', buildContent(), {w:800, h:520});
  const winEl = document.getElementById(winId);
  const body = winEl.querySelector('.window-body');

  body.addEventListener('dblclick', e => {
    const item = e.target.closest('.file-item');
    if (!item) return;
    const newPath = item.dataset.path;
    if (!newPath) return;
    const folder = resolvePath(newPath);
    if (folder && folder.type === 'folder') {
      navHistory.push(newPath);
      currentPath = newPath;
      body.innerHTML = buildContent();
    }
  });

  body.addEventListener('click', e => {
    const btn = e.target.closest('.file-back');
    if (btn && navHistory.length > 1) {
      navHistory.pop();
      currentPath = navHistory[navHistory.length - 1];
      body.innerHTML = buildContent();
    }
  });
}

// ================================================================
// 12. SETTINGS - System Settings
// ================================================================
function renderSettings() {
  const id = createWindow('settings', 'Настройки', '', {w:750, h:550});
  const body = document.getElementById(id).querySelector('.window-body');

  const apiKeys = API_CONFIGS;

  let html = `<div style="display:flex;height:100%;background:#0a0e17;">
    <!-- Sidebar -->
    <div style="width:200px;background:#111b26;border-right:1px solid #1a2332;padding:8px;">
      <div class="settings-nav-item" data-section="api" style="padding:10px 12px;border-radius:6px;cursor:pointer;color:#00d4aa;font-size:13px;background:rgba(0,212,170,0.1);margin-bottom:4px;">🔌 API Keys</div>
      <div class="settings-nav-item" data-section="notifications" style="padding:10px 12px;border-radius:6px;cursor:pointer;color:#8892a4;font-size:13px;margin-bottom:4px;">🔔 Уведомления</div>
      <div class="settings-nav-item" data-section="display" style="padding:10px 12px;border-radius:6px;cursor:pointer;color:#8892a4;font-size:13px;margin-bottom:4px;">🎨 Display</div>
      <div class="settings-nav-item" data-section="about" style="padding:10px 12px;border-radius:6px;cursor:pointer;color:#8892a4;font-size:13px;">ℹ️ О системе</div>
    </div>
    <!-- Content -->
    <div style="flex:1;overflow-y:auto;padding:20px;">`;

  // API Keys section
  html += `<div class="settings-content" data-section="api">
    <h2 style="font-size:20px;color:#e2e8f0;margin-bottom:20px;">🔌 API Keys</h2>`;
  Object.entries(API_CONFIGS).forEach(([key, api]) => {
    html += `<div class="settings-section">
      <h3>${api.icon} ${api.name}</h3>
      <div class="setting-row">
        <div><div class="setting-label">API Key</div><div class="setting-desc">${api.url}</div></div>
        <input type="password" class="setting-input api-key-input" data-api="${key}" placeholder="Введите API key">
      </div>
      <div class="setting-row">
        <div></div>
        <label class="setting-toggle ${api.enabled?'on':''}" data-api="${key}"></label>
      </div>
    </div>`;
  });
  html += `</div>`;

  // Notifications section
  html += `<div class="settings-content" data-section="notifications" style="display:none;">
    <h2 style="font-size:20px;color:#e2e8f0;margin-bottom:20px;">🔔 Уведомления</h2>
    <div class="settings-section">
      <h3>Оповещения о ценах</h3>
      <div class="setting-row"><div><div class="setting-label">Desktop уведомления</div></div><label class="setting-toggle on" data-setting="desktop-notif"></label></div>
      <div class="setting-row"><div><div class="setting-label">Звуковые оповещения</div></div><label class="setting-toggle" data-setting="sound-notif"></label></div>
    </div>
    <div class="settings-section">
      <h3>Уведомления о новостях</h3>
      <div class="setting-row"><div><div class="setting-label">Breaking news</div></div><label class="setting-toggle on" data-setting="breaking-news"></label></div>
    </div>
  </div>`;

  // Display section
  html += `<div class="settings-content" data-section="display" style="display:none;">
    <h2 style="font-size:20px;color:#e2e8f0;margin-bottom:20px;">🎨 Display</h2>
    <div class="settings-section">
      <h3>Интерфейс</h3>
      <div class="setting-row"><div><div class="setting-label">Анимации</div></div><label class="setting-toggle on" data-setting="animations"></label></div>
      <div class="setting-row"><div><div class="setting-label">Тёмная тема</div></div><label class="setting-toggle on" data-setting="dark-theme"></label></div>
    </div>
  </div>`;

  // About section
  html += `<div class="settings-content" data-section="about" style="display:none;">
    <h2 style="font-size:20px;color:#e2e8f0;margin-bottom:20px;">ℹ️ О системе</h2>
    <div class="settings-section">
      <div style="padding:20px;background:#111b26;border-radius:12px;border:1px solid #1a2332;text-align:center;">
        <div style="font-size:64px;margin-bottom:16px;">📊</div>
        <div style="font-size:24px;color:#00d4aa;font-weight:300;margin-bottom:8px;">TradeOS</div>
        <div style="color:#4a5568;">Version 2.0</div>
        <div style="color:#4a5568;margin-top:12px;font-size:13px;">Trading Operating System</div>
        <div style="color:#2d3a4a;margin-top:8px;font-size:12px;">Ядро: Web/HTML5/CSS3/JS</div>
        <div style="color:#2d3a4a;font-size:12px;">Python: Pyodide (WASM)</div>
      </div>
    </div>
  </div>`;

  html += `</div></div>`;
  body.innerHTML = html;

  // Navigation
  body.querySelectorAll('.settings-nav-item').forEach(item => {
    item.addEventListener('click', function() {
      body.querySelectorAll('.settings-nav-item').forEach(n => { n.style.color='#8892a4'; n.style.background='transparent'; });
      this.style.color = '#00d4aa'; this.style.background = 'rgba(0,212,170,0.1)';
      const section = this.dataset.section;
      body.querySelectorAll('.settings-content').forEach(c => c.style.display = c.dataset.section === section ? 'block' : 'none');
    });
  });

  // Toggles
  body.querySelectorAll('.setting-toggle').forEach(toggle => {
    toggle.addEventListener('click', function() {
      this.classList.toggle('on');
    });
  });
}
