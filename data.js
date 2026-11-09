// ===== API CONFIGURATIONS =====
const API_CONFIGS = {
  yfinance: {
    name: 'Yahoo Finance',
    url: 'https://query1.finance.yahoo.com/v8/finance/chart/',
    enabled: false,
    icon: '📈'
  },
  alphavantage: {
    name: 'Alpha Vantage',
    url: 'https://www.alphavantage.co/query',
    apiKey: '',
    enabled: false,
    icon: '📊'
  },
  coingecko: {
    name: 'CoinGecko',
    url: 'https://api.coingecko.com/api/v3/',
    enabled: false,
    icon: '🪙'
  },
  newsapi: {
    name: 'NewsAPI',
    url: 'https://newsapi.org/v2/',
    apiKey: '',
    enabled: false,
    icon: '📰'
  },
  polygon: {
    name: 'Polygon.io',
    url: 'https://api.polygon.io/v2/',
    apiKey: '',
    enabled: false,
    icon: '🔷'
  },
  finnhub: {
    name: 'Finnhub',
    url: 'https://finnhub.io/api/v1/',
    apiKey: '',
    enabled: false,
    icon: '💹'
  }
};

// ===== APP DEFINITIONS =====
const APPS = {
  terminal:    { name:'Терминал', icon:'📊', w:950, h:620, fixed:false },
  portfolio:   { name:'Портфель', icon:'💼', w:850, h:580, fixed:false },
  screener:    { name:'Скринер', icon:'🔍', w:900, h:600, fixed:false },
  news:        { name:'Новости', icon:'📰', w:750, h:550, fixed:false },
  calendar:    { name:'Календарь', icon:'📅', w:700, h:550, fixed:false },
  notebook:    { name:'Notebook', icon:'🐍', w:800, h:600, fixed:false },
  backtest:    { name:'Бэктест', icon:'📈', w:900, h:620, fixed:false },
  alerts:      { name:'Оповещения', icon:'🔔', w:700, h:500, fixed:false },
  watchlist:   { name:'Ватчлист', icon:'⭐', w:700, h:480, fixed:false },
  options:     { name:'Опционы', icon:'📋', w:950, h:600, fixed:false },
  files:       { name:'Файлы', icon:'📁', w:800, h:520, fixed:false },
  settings:    { name:'Настройки', icon:'⚙️', w:750, h:520, fixed:false }
};

// ===== WATCHLIST DATA =====
let watchlist = ['AAPL','MSFT','GOOGL','AMZN','TSLA','NVDA','META','BTC-USD','ETH-USD','SPY'];

// ===== PORTFOLIO DATA =====
let portfolio = {
  cash: 45230.50,
  positions: [
    { symbol:'AAPL', shares:50, avgPrice:175.20, currentPrice:189.84 },
    { symbol:'MSFT', shares:30, avgPrice:380.50, currentPrice:415.20 },
    { symbol:'NVDA', shares:25, avgPrice:720.00, currentPrice:875.35 },
    { symbol:'TSLA', shares:40, avgPrice:265.00, currentPrice:248.42 },
    { symbol:'BTC-USD', shares:0.5, avgPrice:58000, currentPrice:67432 },
    { symbol:'SPY', shares:20, avgPrice:520.00, currentPrice:542.18 },
  ]
};

// ===== ALERTS DATA =====
let alerts = [
  { id:1, symbol:'AAPL', type:'price', condition:'above', value:195, active:true, triggered:false },
  { id:2, symbol:'BTC-USD', type:'price', condition:'below', value:65000, active:true, triggered:false },
  { id:3, symbol:'NVDA', type:'rsi', condition:'above', value:70, active:true, triggered:false },
  { id:4, symbol:'TSLA', type:'price', condition:'below', value:240, active:true, triggered:true },
  { id:5, symbol:'SPY', type:'volume', condition:'above', value:100000000, active:false, triggered:false },
  { id:6, symbol:'ETH-USD', type:'price', condition:'above', value:3800, active:true, triggered:false },
  { id:7, symbol:'GOOGL', type:'sma_cross', condition:'golden', active:true, triggered:false },
];

// ===== NEWS DATA =====
const NEWS_DATA = [
  { source:'Reuters', time:'14:32', title:'FED ожидает снижение ставки на 25bp в декабре', desc:'Федеральная резервная система сохраняет осторожный оптимизм по инфляции. Рынки закладывают 90% вероятность снижения.', sentiment:'bullish', symbols:['SPY','QQQ','GLD'] },
  { source:'Bloomberg', time:'14:15', title:'NVDA бьёт все рекорды на фоне спроса на AI-чипы', desc:'NVIDIA отчиталась о рекордной выручке. Data Center revenue выросла на 154% г/г.', sentiment:'bullish', symbols:['NVDA'] },
  { source:'CNBC', time:'13:58', title:'Tesla снижает цены на Model Y в США', desc:'Третье снижение цен за квартал беспокоит инвесторов. Маржа может продолжать сжиматься.', sentiment:'bearish', symbols:['TSLA'] },
  { source:'WSJ', time:'13:40', title:'Apple готовится к запуску AirPods Pro 3', desc:'Новые наушники получат улучшенный шумоподавление и мониторинг здоровья.', sentiment:'bullish', symbols:['AAPL'] },
  { source:'CoinDesk', time:'13:22', title:'Bitcoin пробивает $67,000 на фоне ETF-притоков', desc:'Spot Bitcoin ETF зафиксировал $500M притока за неделю. Институциональный спрос растёт.', sentiment:'bullish', symbols:['BTC-USD','ETH-USD'] },
  { source:'Financial Times', time:'12:55', title:'ЕЦБ сохраняет ставки без изменений', desc:'Европа сталкивается со стагфляционными рисками. Зона евро показывает слабую динамику.', sentiment:'bearish', symbols:['EWU','VGK'] },
  { source:'MarketWatch', time:'12:30', title:'Microsoft announces AI Copilot for enterprises', desc:'Новые AI-продукты от Microsoft могут стать новым драйвером роста.', sentiment:'bullish', symbols:['MSFT'] },
  { source:'Yahoo Finance', time:'12:10', title:'Oil prices fall on demand concerns', desc:'Котировки нефти снижаются на фоне замедления спроса из Китая.', sentiment:'bearish', symbols:['XLE','USO'] },
];

// ===== ECONOMIC CALENDAR =====
const CALENDAR_EVENTS = [
  { date:'2024-12-18', day:18, month:'ДЕК', name:'Решение FOMC по ставке', time:'20:00', impact:'high', forecast:'5.25%', previous:'5.50%' },
  { date:'2024-12-19', day:19, month:'ДЕК', name:'Протокол заседания FOMC', time:'21:00', impact:'high', forecast:'—', previous:'—' },
  { date:'2024-12-20', day:20, month:'ДЕК', name:'Продажи нового жилья', time:'15:30', impact:'medium', forecast:'680K', previous:'702K' },
  { date:'2024-12-23', day:23, month:'ДЕК', name:'Индекс PMI Manufacturing', time:'14:45', impact:'medium', forecast:'49.2', previous:'49.5' },
  { date:'2024-12-31', day:31, month:'ДЕК', name:'PCE Индекс цен (ежемесячный)', time:'15:30', impact:'high', forecast:'+0.2%', previous:'+0.3%' },
  { date:'2025-01-03', day:03, month:'ЯНВ', name:'ISM Manufacturing PMI', time:'15:00', impact:'medium', forecast:'48.8', previous:'46.5' },
  { date:'2025-01-10', day:10, month:'ЯНВ', name:'Индекс потребительских ожиданий', time:'15:00', impact:'low', forecast:'2.8%', previous:'2.7%' },
  { date:'2025-01-17', day:17, month:'ЯНВ', name:'Нон-Фарм Паушментс (NFP)', time:'15:30', impact:'high', forecast:'+180K', previous:'+150K' },
  { date:'2025-01-22', day:22, month:'ЯНВ', name:'Решение FOMC по ставке', time:'20:00', impact:'high', forecast:'5.00%', previous:'5.25%' },
  { date:'2025-01-31', day:31, month:'ЯНВ', name:'CPI Индекс цен (ежемесячный)', time:'15:30', impact:'high', forecast:'+2.7%', previous:'+2.6%' },
];

// ===== BACKTEST RESULTS =====
const BACKTEST_STRATEGIES = [
  {
    name:'SMA Cross (20/50)',
    initialCapital:100000,
    totalReturn:23.45,
    sharpeRatio:1.42,
    maxDrawdown:-12.3,
    winRate:58.2,
    trades:247,
    profitFactor:1.35,
  },
  {
    name:'RSI Reversal',
    initialCapital:100000,
    totalReturn:18.72,
    sharpeRatio:1.18,
    maxDrawdown:-15.8,
    winRate:52.4,
    trades:312,
    profitFactor:1.22,
  },
  {
    name:'Bollinger Breakout',
    initialCapital:100000,
    totalReturn:31.20,
    sharpeRatio:1.65,
    maxDrawdown:-18.5,
    winRate:45.8,
    trades:189,
    profitFactor:1.58,
  },
  {
    name:'MACD Divergence',
    initialCapital:100000,
    totalReturn:15.33,
    sharpeRatio:0.98,
    maxDrawdown:-10.2,
    winRate:61.3,
    trades:156,
    profitFactor:1.28,
  }
];

// ===== VIRTUAL FILE SYSTEM =====
let fileSystem = {
  'C:': {
    type:'folder', children:{
      'TradeOS': {
        type:'folder', children:{
          'scripts': {
            type:'folder', children:{
              'sma_strategy.py': { type:'file', content:'# SMA Crossover Strategy\nimport pandas as pd\n\ndef sma_cross(df, fast=20, slow=50):\n    df["SMA_fast"] = df["Close"].rolling(fast).mean()\n    df["SMA_slow"] = df["Close"].rolling(slow).mean()\n    df["Signal"] = 0\n    df.loc[df["SMA_fast"] > df["SMA_slow"], "Signal"] = 1\n    return df', ext:'py', size:'1.2 KB' },
              'rsi_strategy.py': { type:'file', content:'# RSI Reversal Strategy\n\ndef rsi_strategy(df, period=14, oversold=30, overbought=70):\n    delta = df["Close"].diff()\n    gain = (delta.where(delta > 0, 0)).rolling(period).mean()\n    loss = (-delta.where(delta < 0, 0)).rolling(period).mean()\n    rs = gain / loss\n    df["RSI"] = 100 - (100 / (1 + rs))\n    return df', ext:'py', size:'0.8 KB' },
              'portfolio_opt.py': { type:'file', content:'# Portfolio Optimization\nimport numpy as np\n\ndef efficient_frontierreturns, n_assets=5):\n    np.random.seed(42)\n    weights = np.random.dirichlet(np.ones(n_assets), 1000)\n    returns = weights @ mean_returns\n    portfolio_risk = np.sqrt(weights @ cov_matrix @ weights.T)\n    return pd.DataFrame({"return": returns, "risk": portfolio_risk})', ext:'py', size:'1.5 KB' },
            }
          },
          'data': {
            type:'folder', children:{
              'AAPL_1mo.csv': { type:'file', content:'Date,Open,High,Low,Close,Volume\n2024-11-01,189.84,191.20,188.50,190.35,45230000\n2024-11-04,190.50,192.80,189.90,192.15,52100000\n2024-11-05,192.30,194.10,191.80,193.55,48700000', ext:'csv', size:'24 KB' },
              'BTC_1mo.csv': { type:'file', content:'Date,Open,High,Low,Close,Volume\n2024-11-01,69432,70120,68200,69850,28500000000\n2024-11-04,69800,71500,68900,70430,31200000000', ext:'csv', size:'18 KB' },
              'portfolio.csv': { type:'file', content:'Symbol,Shares,AvgPrice,CurrentPrice\nAAPL,50,175.20,189.84\nMSFT,30,380.50,415.20\nNVDA,25,720.00,875.35', ext:'csv', size:'2.1 KB' },
            }
          },
          'reports': {
            type:'folder', children:{
              'monthly_report.txt': { type:'file', content:'MONTHLY REPORT — November 2024\n\nTotal Return: +8.2%\nBest Performer: NVDA (+12.3%)\nWorst Performer: TSLA (-4.1%)\n\nRecommendations:\n- Consider trimming NVDA position\n- Add exposure to defensive sectors\n- Monitor Fed meeting on Dec 18', ext:'txt', size:'1.8 KB' },
            }
          },
          'readme.txt': { type:'file', content:'TradeOS File System\n====================\n\n/scripts — Python trading strategies\n/data — Market data CSV files\n/reports — Trading reports and analysis', ext:'txt', size:'320 B' },
        }
      },
    }
  }
};

function resolvePath(pathStr) {
  if (!pathStr || pathStr === '') return fileSystem['C:'];
  const parts = pathStr.split('\\').filter(Boolean);
  let current = fileSystem;
  for (const p of parts) {
    if (current[p]) { current = current[p]; continue; }
    if (current.children && current.children[p]) { current = current.children[p]; continue; }
    return null;
  }
  return current;
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' KB';
  return (bytes/(1024*1024)).toFixed(1) + ' MB';
}

// ===== MOCK MARKET DATA =====
function generateCandleData(symbol, days=30) {
  const basePrices = { AAPL:190, MSFT:415, GOOGL:140, AMZN:185, TSLA:250, NVDA:870, META:500, SPY:540, 'BTC-USD':67000, 'ETH-USD':3500 };
  let base = basePrices[symbol] || 100;
  let volatility = symbol.includes('BTC') || symbol.includes('ETH') ? 0.03 : 0.015;
  const data = [];
  let price = base;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const change = (Math.random() - 0.48) * volatility * price;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * volatility * price * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * price * 0.5;
    const volume = Math.floor(Math.random() * 50000000 + 10000000);
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume
    });
    price = close;
  }
  return data;
}

// ===== STOCK SCREENER DATA =====
const SCREENER_STOCKS = [
  { symbol:'AAPL', name:'Apple Inc.', price:189.84, change:1.05, marketCap:'2.95T', pe:31.2, eps:6.08, dividend:0.55, volume:'52.3M', beta:1.28, rsi:62 },
  { symbol:'MSFT', name:'Microsoft Corp.', price:415.20, change:0.87, marketCap:'3.08T', pe:36.8, eps:11.29, dividend:0.72, volume:'22.1M', beta:0.89, rsi:58 },
  { symbol:'NVDA', name:'NVIDIA Corp.', price:875.35, change:3.42, marketCap:'2.16T', pe:65.4, eps:13.39, dividend:0.02, volume:'41.8M', beta:1.68, rsi:72 },
  { symbol:'GOOGL', name:'Alphabet Inc.', price:141.80, change:-0.32, marketCap:'1.78T', pe:25.6, eps:5.54, dividend:0, volume:'25.4M', beta:1.06, rsi:48 },
  { symbol:'AMZN', name:'Amazon.com Inc.', price:185.63, change:1.24, marketCap:'1.92T', pe:62.3, eps:2.98, dividend:0, volume:'48.2M', beta:1.15, rsi:55 },
  { symbol:'TSLA', name:'Tesla Inc.', price:248.42, change:-2.15, marketCap:'790B', pe:72.8, eps:3.41, dividend:0, volume:'98.5M', beta:2.31, rsi:38 },
  { symbol:'META', name:'Meta Platforms', price:505.95, change:2.18, marketCap:'1.29T', pe:28.4, eps:17.82, dividend:0, volume:'18.7M', beta:1.22, rsi:68 },
  { symbol:'JPM', name:'JPMorgan Chase', price:198.45, change:0.45, marketCap:'570B', pe:12.3, eps:16.13, dividend:2.31, volume:'8.2M', beta:1.04, rsi:52 },
  { symbol:'V', name:'Visa Inc.', price:279.32, change:0.67, marketCap:'575B', pe:30.1, eps:9.28, dividend:0.76, volume:'6.8M', beta:0.94, rsi:56 },
  { symbol:'JNJ', name:'Johnson & Johnson', price:156.78, change:-0.23, marketCap:'378B', pe:22.5, eps:6.97, dividend:3.04, volume:'7.5M', beta:0.58, rsi:42 },
  { symbol:'WMT', name:'Walmart Inc.', price:165.42, change:0.89, marketCap:'445B', pe:27.8, eps:5.95, dividend:1.28, volume:'8.9M', beta:0.52, rsi:61 },
  { symbol:'XOM', name:'Exxon Mobil', price:112.35, change:-1.45, marketCap:'455B', pe:13.2, eps:8.51, dividend:3.48, volume:'14.2M', beta:0.82, rsi:35 },
  { symbol:'DIS', name:'Walt Disney Co.', price:91.28, change:1.56, marketCap:'167B', pe:42.5, eps:2.15, dividend:0, volume:'11.3M', beta:1.18, rsi:58 },
  { symbol:'NFLX', name:'Netflix Inc.', price:628.45, change:2.34, marketCap:'272B', pe:44.2, eps:14.22, dividend:0, volume:'5.8M', beta:1.35, rsi:71 },
  { symbol:'AMD', name:'Advanced Micro Devices', price:147.82, change:2.87, marketCap:'239B', pe:245.6, eps:0.60, dividend:0, volume:'55.2M', beta:1.72, rsi:65 },
  { symbol:'CRM', name:'Salesforce Inc.', price:272.15, change:-0.56, marketCap:'264B', pe:52.3, eps:5.20, dividend:0, volume:'6.2M', beta:1.12, rsi:45 },
  { symbol:'BA', name:'Boeing Co.', price:178.92, change:-3.21, marketCap:'108B', pe:-15.2, eps:-11.76, dividend:0, volume:'9.8M', beta:1.45, rsi:28 },
  { symbol:'KO', name:'Coca-Cola Co.', price:60.85, change:0.15, marketCap:'263B', pe:23.8, eps:2.56, dividend:3.07, volume:'12.5M', beta:0.59, rsi:50 },
  { symbol:'PFE', name:'Pfizer Inc.', price:28.42, change:-1.87, marketCap:'160B', pe:9.8, eps:2.90, dividend:5.67, volume:'38.4M', beta:0.62, rsi:32 },
  { symbol:'INTC', name:'Intel Corp.', price:43.18, change:-2.45, marketCap:'182B', pe:85.2, eps:0.51, dividend:1.50, volume:'42.1M', beta:0.68, rsi:30 },
];

// ===== OPTIONS DATA =====
const OPTIONS_DATA = {
  symbol: 'AAPL',
  currentPrice: 189.84,
  expiry: '2024-12-20',
  calls: [
    { strike:170, bid:20.50, ask:21.00, volume:1250, openInterest:8500, iv:28.5 },
    { strike:175, bid:16.20, ask:16.60, volume:2340, openInterest:12400, iv:26.8 },
    { strike:180, bid:12.10, ask:12.40, volume:5620, openInterest:22100, iv:24.5 },
    { strike:185, bid:8.30, ask:8.60, volume:8900, openInterest:35600, iv:22.3 },
    { strike:190, bid:5.10, ask:5.30, volume:15400, openInterest:52300, iv:20.8 },
    { strike:195, bid:2.80, ask:3.00, volume:12200, openInterest:48200, iv:21.5 },
    { strike:200, bid:1.20, ask:1.35, volume:8500, openInterest:38900, iv:23.2 },
    { strike:205, bid:0.45, ask:0.55, volume:3200, openInterest:18500, iv:25.8 },
  ],
  puts: [
    { strike:170, bid:0.30, ask:0.40, volume:800, openInterest:5200, iv:32.1 },
    { strike:175, bid:0.65, ask:0.80, volume:1500, openInterest:8900, iv:30.5 },
    { strike:180, bid:1.40, ask:1.55, volume:3200, openInterest:15600, iv:28.2 },
    { strike:185, bid:2.90, ask:3.10, volume:6800, openInterest:28400, iv:25.8 },
    { strike:190, bid:5.50, ask:5.70, volume:12100, openInterest:45200, iv:23.5 },
    { strike:195, bid:9.20, ask:9.50, volume:8400, openInterest:32100, iv:24.8 },
    { strike:200, bid:13.80, ask:14.10, volume:4200, openInterest:18900, iv:27.2 },
    { strike:205, bid:18.50, ask:19.00, volume:1800, openInterest:9200, iv:29.8 },
  ]
};
