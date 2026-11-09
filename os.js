// ===== TRADEOS CORE =====

// ===== BOOT SEQUENCE =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('boot-screen').classList.add('hidden');
    document.getElementById('desktop').classList.remove('hidden');
    setTimeout(() => {
      notify('TradeOS', 'Система готова. Все биржи подключены.', 'success');
      startMarketTickerUpdates();
    }, 500);
  }, 3200);
});

// ===== CLOCK =====
function updateClock() {
  const now = new Date();
  const timeEl = document.getElementById('tray-time');
  const dateEl = document.getElementById('tray-date');
  if (timeEl) timeEl.textContent = now.toLocaleTimeString('ru-RU', {hour:'2-digit',minute:'2-digit'});
  if (dateEl) dateEl.textContent = now.toLocaleDateString('ru-RU', {day:'2-digit',month:'2-digit'});
}
setInterval(updateClock, 1000);
updateClock();

// ===== WINDOW MANAGEMENT =====
let windows = {};
let windowIdCounter = 0;
let activeWindowId = null;
let zIndexCounter = 100;

function createWindow(appId, title, content, options={}) {
  const appDef = APPS[appId] || {name:title, w:800, h:500};
  const id = 'win-' + (++windowIdCounter);
  const w = options.w || appDef.w;
  const h = options.h || appDef.h;
  const x = Math.max(10, (window.innerWidth - w) / 2 + (Math.random()*80-40));
  const y = Math.max(40, (window.innerHeight - h - 80) / 2 + (Math.random()*60-30));

  const win = document.createElement('div');
  win.className = 'window';
  win.id = id;
  win.dataset.appId = appId;
  win.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:${++zIndexCounter}`;
  win.innerHTML = `
    <div class="window-header" onmousedown="startDrag(event,'${id}')">
      <span class="window-title">${appDef.icon || ''} ${title}</span>
      <div class="window-controls">
        <button onclick="minimizeWindow('${id}')" title="Свернуть">─</button>
        <button onclick="maximizeWindow('${id}')" title="Развернуть">☐</button>
        <button class="btn-close" onclick="closeWindow('${id}')" title="Закрыть">✕</button>
      </div>
    </div>
    <div class="window-body">${content}</div>
    <div class="window-resize" onmousedown="startResize(event,'${id}')"></div>
  `;
  win.addEventListener('mousedown', () => focusWindow(id));
  document.getElementById('windows-container').appendChild(win);
  windows[id] = { appId, title, minimized:false, maximized:false };
  focusWindow(id);
  updateDock();
  return id;
}

function focusWindow(id) {
  document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) { el.classList.add('active'); el.style.zIndex = ++zIndexCounter; activeWindowId = id; }
  updateDock();
}

function minimizeWindow(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('minimized'); windows[id].minimized = true; }
  updateDock();
}

function maximizeWindow(id) {
  const el = document.getElementById(id);
  if (!el) return;
  windows[id].maximized = !windows[id].maximized;
  el.classList.toggle('maximized', windows[id].maximized);
}

function closeWindow(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
  delete windows[id];
  if (Object.keys(windows).length === 0) zIndexCounter = 100;
  updateDock();
}

function restoreWindow(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('minimized'); windows[id].minimized = false; focusWindow(id); }
  updateDock();
}

function updateDock() {
  document.querySelectorAll('.dock-item[data-app]').forEach(ti => {
    const app = ti.dataset.app;
    const hasOpen = Object.values(windows).some(w => w.appId === app);
    ti.classList.toggle('active', hasOpen);
  });
}

// ===== DRAG & RESIZE =====
let dragState = null;

function startDrag(e, id) {
  if (e.target.tagName === 'BUTTON') return;
  if (windows[id]?.maximized) return;
  const el = document.getElementById(id);
  dragState = { type:'drag', id, startX:e.clientX, startY:e.clientY, origX:el.offsetLeft, origY:el.offsetTop };
  e.preventDefault();
}

function startResize(e, id) {
  if (windows[id]?.maximized) return;
  const el = document.getElementById(id);
  dragState = { type:'resize', id, startX:e.clientX, startY:e.clientY, origW:el.offsetWidth, origH:el.offsetHeight };
  e.preventDefault();
}

document.addEventListener('mousemove', e => {
  if (!dragState) return;
  const el = document.getElementById(dragState.id);
  if (!el) { dragState=null; return; }
  if (dragState.type === 'drag') {
    const newX = Math.max(0, Math.min(dragState.origX + e.clientX - dragState.startX, window.innerWidth - 200));
    const newY = Math.max(32, dragState.origY + e.clientY - dragState.startY);
    el.style.left = newX + 'px';
    el.style.top = newY + 'px';
  } else {
    el.style.width = Math.max(400, dragState.origW + e.clientX - dragState.startX) + 'px';
    el.style.height = Math.max(300, dragState.origH + e.clientY - dragState.startY) + 'px';
  }
});

document.addEventListener('mouseup', () => { dragState = null; });


// ===== START MENU =====
function toggleStartMenu() {
  const menu = document.getElementById('start-menu');
  menu.classList.toggle('hidden');
  if (!menu.classList.contains('hidden')) {
    menu.querySelector('input')?.focus();
  }
}

function filterStartMenu(query) {
  const apps = document.querySelectorAll('.start-app');
  query = query.toLowerCase();
  apps.forEach(app => {
    const text = app.textContent.toLowerCase();
    app.style.display = text.includes(query) ? 'flex' : 'none';
  });
}

document.addEventListener('click', e => {
  const menu = document.getElementById('start-menu');
  if (!menu.classList.contains('hidden') &&
      !menu.contains(e.target) &&
      !e.target.closest('.dock-item')) {
    menu.classList.add('hidden');
  }
  document.querySelectorAll('.context-menu').forEach(m => m.remove());
});

// ===== NOTIFICATIONS =====
function notify(title, message, type='success') {
  const notif = document.createElement('div');
  notif.className = `notification ${type}`;
  notif.innerHTML = `<div class="notification-title">${title}</div><div class="notification-body">${message}</div>`;
  document.body.appendChild(notif);
  setTimeout(() => {
    notif.style.opacity = '0';
    notif.style.transition = 'opacity 0.3s';
    setTimeout(() => notif.remove(), 300);
  }, 4000);
}

// ===== CONTEXT MENU =====
document.getElementById('desktop')?.addEventListener('contextmenu', e => {
  if (e.target.closest('.window') || e.target.closest('#ticker-strip') || e.target.closest('#dock')) return;
  e.preventDefault();
  showContextMenu(e.clientX, e.clientY, [
    { label:'📊 Открыть терминал', action:() => openApp('terminal') },
    { label:'💼 Открыть портфель', action:() => openApp('portfolio') },
    { sep: true },
    { label:'🐍 Новый скрипт', action:() => notify('Файлы','Скрипт создан') },
    { label:'📁 Новая папка', action:() => notify('Файлы','Папка создана') },
    { sep: true },
    { label:'⚙️ Настройки', action:() => openApp('settings') },
    { label:'🐍 Python Notebook', action:() => openApp('notebook') },
    { sep: true },
    { label:'🔄 Обновить данные', action:() => refreshMarketData() },
    { label:'ℹ️ О системе', action:() => notify('TradeOS','v2.0 — Trading Operating System') },
  ]);
});

function showContextMenu(x, y, items) {
  const existing = document.querySelector('.context-menu');
  if (existing) existing.remove();
  const menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.style.left = x + 'px';
  menu.style.top = y + 'px';
  items.forEach(item => {
    if (item.sep) {
      const sep = document.createElement('div');
      sep.className = 'context-menu-sep';
      menu.appendChild(sep);
    } else {
      const mi = document.createElement('div');
      mi.className = 'context-menu-item';
      mi.textContent = item.label;
      mi.addEventListener('click', item.action);
      menu.appendChild(mi);
    }
  });
  document.body.appendChild(menu);
  const rect = menu.getBoundingClientRect();
  if (rect.right > window.innerWidth) menu.style.left = (x - rect.width) + 'px';
  if (rect.bottom > window.innerHeight) menu.style.top = (y - rect.height) + 'px';
  setTimeout(() => document.addEventListener('click', () => menu.remove(), {once:true}), 10);
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', e => {
  if (e.key === 'Meta' || (e.ctrlKey && e.key === 'Escape')) {
    e.preventDefault();
    toggleStartMenu();
  }
  if (e.key === 'Escape') {
    document.getElementById('start-menu')?.classList.add('hidden');
  }
});

// ===== SHUTDOWN =====
function shutdownTradeOS() {
  toggleStartMenu();
  const overlay = document.getElementById('shutdown-overlay');
  overlay.classList.remove('hidden');
  setTimeout(() => {
    overlay.querySelector('.shutdown-text').textContent = 'Система завершена';
    setTimeout(() => location.reload(), 1500);
  }, 3000);
}

// ===== MARKET TICKER =====
function startMarketTickerUpdates() {
  setInterval(() => {
    document.querySelectorAll('.ticker-item').forEach(item => {
      const symbol = item.dataset.symbol;
      const priceEl = item.querySelector('.ticker-price');
      const changeEl = item.querySelector('.ticker-change');
      const currentPrice = parseFloat(priceEl.textContent.replace(/,/g, ''));
      const change = (Math.random() - 0.5) * currentPrice * 0.002;
      const newPrice = +(currentPrice + change).toFixed(symbol.includes('BTC') ? 0 : symbol.includes('ETH') ? 0 : 2);
      priceEl.textContent = symbol.includes('BTC') || symbol.includes('ETH') ? newPrice.toLocaleString() : newPrice.toFixed(2);
      const pctChange = ((newPrice - currentPrice) / currentPrice * 100).toFixed(2);
      changeEl.textContent = (pctChange >= 0 ? '+' : '') + pctChange + '%';
      changeEl.className = 'ticker-change ' + (pctChange >= 0 ? 'positive' : 'negative');
    });
  }, 3000);
}

function refreshMarketData() {
  notify('Данные', 'Обновление рыночных данных...', 'success');
}

// ===== FILE MANAGER HELPERS =====
function getFileIcon(ext) {
  const map = { txt:'📄', py:'🐍', csv:'📊', json:'📋', md:'📝', js:'📜', html:'🌐', jpg:'🖼️', png:'🖼️' };
  return map[ext] || '📄';
}
