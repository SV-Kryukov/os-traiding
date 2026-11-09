# TradeOS — Трейдинговая Операционная Система

Симуляция специализированной ОС для трейдеров и инвесторов, реализованная как веб-приложение.

## 🎯 Концепция

TradeOS — это не просто набор приложений для трейдинга. Это **единая среда**, где данные, аналитика и исполнение работают как единая операционная система.

## 🏗 Архитектура

```
TradeOS/
├── index.html     — Главная страница (рабочий стол, док, меню)
├── style.css      — Стили: тёмная тема, окна, графики, анимации
├── data.js        — Данные: определения приложений, API-конфиги, FS
├── apps.js        — Логика всех 12 приложений
└── os.js          — Ядро ОС: окна, док, уведомления, файловая система
```

## 📱 Приложения (12 шт.)

| Приложение | Назначение |
|---|---|
| 📊 **Терминал** | Реалтайм-график свечей (candlestick), индикаторы, таймфреймы |
| 💼 **Портфель** | Управление портфелем: позиции, P&L, диверсификация |
| 🔍 **Скринер** | Скринер акций/крипты с фильтрами (P/E, RSI, Volume, Beta) |
| 📰 **Новости** | Лента новостей рынка с анализом настроения (NLP-эмуляция) |
| 📅 **Календарь** | Экономический календарь: CPI, NFP, FOMC, дивиденды |
| 🐍 **Notebook** | Python-аналитика: Jupyter-подобный интерфейс |
| 📈 **Бэктест** | Тестирование стратегий на исторических данных |
| 🔔 **Оповещения** | Система оповещений: цены, индикаторы, новости |
| ⭐ **Ватчлист** | Список наблюдения за активами |
| 📋 **Опционы** | Options Chain с Greeks и IV |
| ⚙️ **Настройки** | API-ключи, темы, алерты, уведомления |
| 📁 **Файлы** | Файловый менеджер для скриптов и данных |

## 🔌 API Интеграция

TradeOS поддерживает 6 провайдеров данных:

| Провайдер | URL | Тип данных |
|---|---|---|
| Yahoo Finance | `query1.finance.yahoo.com` | Акции, ETF, исторические данные |
| Alpha Vantage | `www.alphavantage.co` | Реалтайм котировки, индикаторы |
| CoinGecko | `api.coingecko.com` | Криптовалюты, токены |
| NewsAPI | `newsapi.org` | Новости рынка |
| Polygon.io | `api.polygon.io` | Тикеры, свечки, сплиты |
| Finnhub | `finnhub.io` | Реалтайм данные, новости |

```javascript
// Подключение к API
const API_CONFIG = {
  yfinance: { url: 'https://query1.finance.yahoo.com/v8/finance/chart/', enabled: false },
  alphavantage: { url: 'https://www.alphavantage.co/query', apiKey: '', enabled: false },
  coingecko: { url: 'https://api.coingecko.com/api/v3/', enabled: false },
  newsapi: { url: 'https://newsapi.org/v2/', apiKey: '', enabled: false },
  polygon: { url: 'https://api.polygon.io/v2/', apiKey: '', enabled: false },
  finnhub: { url: 'https://finnhub.io/api/v1/', apiKey: '', enabled: false },
};

// Пример получения данных
async function fetchStockData(symbol) {
  const resp = await fetch(`${API_CONFIG.yfinance.url}${symbol}?range=1mo&interval=5m`);
  const data = await resp.json();
  return parseCandlesticks(data);
}
```

## 🐍 Python-аналитика

Notebook предоставляет Jupyter-подобный интерфейс для Python-аналитики.
Поддержка Pyodide (WebAssembly) добавляется по требованию.

```python
import pandas as pd
import numpy as np

# Создаём тестовые данные
dates = pd.date_range('2024-01-01', periods=30)
prices = [180 + np.random.randn().cumsum() * 2 for _ in range(30)]
df = pd.DataFrame({'Date': dates, 'Close': prices})
df['SMA_7'] = df['Close'].rolling(7).mean()

print(df.tail(10))
```

**Поддерживаемые библиотеки:**
- `pandas` — анализ данных
- `numpy` — численные вычисления
- `matplotlib` — визуализация (при подключении Pyodide)

## 🚀 Как запустить

1. Откройте `index.html` в браузере
2. Данные генерируются локально (mock data)
3. Для реальных данных подключите API-ключи в **Настройки → API Keys**
4. Python Notebook работает в режиме симуляции (без Pyodide)

## 💡 Философия TradeOS

> «Лучшая торговая система — та, где данные, аналитика и исполнение 
> работают как единый организм. Не 10 отдельных программ. Одна ОС.»
