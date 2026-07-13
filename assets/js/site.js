(function () {
  var root = document.documentElement;
  var toggle = document.querySelector('.theme-toggle');
  var themeIcon = document.querySelector('.theme-icon');
  var themeLabel = document.querySelector('.theme-label');

  function currentTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function paintTheme(theme) {
    var isDark = theme === 'dark';
    root.dataset.theme = theme;
    var themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute('content', isDark ? '#191923' : '#f5eeda');
    if (!toggle) return;
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    themeIcon.textContent = isDark ? '☀' : '☾';
    themeLabel.textContent = isDark ? 'lights on' : 'lights off';
  }

  paintTheme(currentTheme());

  if (toggle) {
    toggle.addEventListener('click', function () {
      var nextTheme = currentTheme() === 'dark' ? 'light' : 'dark';
      paintTheme(nextTheme);
      try { localStorage.setItem('jackl-theme', nextTheme); } catch (error) {}
    });
  }

  var game = document.querySelector('.webcat-game');
  if (!game) return;

  var storageKey = 'jackl-webcat-game-v1';
  var petButton = game.querySelector('.cat-button');
  var countNode = game.querySelector('[data-purr-count]');
  var rateNode = game.querySelector('[data-purr-rate]');
  var powerNode = game.querySelector('[data-click-power]');
  var lifetimeNode = game.querySelector('[data-lifetime-purrs]');
  var rankNode = game.querySelector('[data-cat-rank]');
  var messageNode = game.querySelector('.cat-message');
  var resetButton = game.querySelector('.reset-game');
  var upgradeButtons = game.querySelectorAll('[data-upgrade]');
  var clickCount = 0;
  var lastTick = Date.now();

  var upgradeConfig = {
    yarn: { baseCost: 10, scale: 1.6 },
    scritcher: { baseCost: 35, scale: 1.7 },
    modem: { baseCost: 120, scale: 1.8 }
  };

  var messages = [
    'mrrrrp! transaction approved.',
    'webcat has received the scritch.',
    '*tiny dial-up purring noises*',
    'excellent mouse operation, human.',
    'purr protocol successfully executed.',
    'friendship packet received. <3'
  ];

  function blankState() {
    return {
      purrs: 0,
      lifetimePurrs: 0,
      upgrades: { yarn: 0, scritcher: 0, modem: 0 },
      lastSeen: Date.now()
    };
  }

  function safeNumber(value) {
    value = Number(value);
    return Number.isFinite(value) && value >= 0 ? value : 0;
  }

  function loadState() {
    var loaded = blankState();
    try {
      var saved = JSON.parse(localStorage.getItem(storageKey));
      if (saved) {
        loaded.purrs = safeNumber(saved.purrs);
        loaded.lifetimePurrs = safeNumber(saved.lifetimePurrs);
        loaded.lastSeen = safeNumber(saved.lastSeen) || Date.now();
        Object.keys(loaded.upgrades).forEach(function (name) {
          loaded.upgrades[name] = Math.floor(safeNumber(saved.upgrades && saved.upgrades[name]));
        });
        return loaded;
      }

      var oldPurrs = Math.floor(safeNumber(localStorage.getItem('jackl-purrs')));
      loaded.purrs = oldPurrs;
      loaded.lifetimePurrs = oldPurrs;
    } catch (error) {}
    return loaded;
  }

  var state = loadState();

  function clickPower() {
    return 1 + state.upgrades.yarn;
  }

  function purrRate() {
    return state.upgrades.scritcher + (state.upgrades.modem * 5);
  }

  function upgradeCost(name) {
    var config = upgradeConfig[name];
    return Math.floor(config.baseCost * Math.pow(config.scale, state.upgrades[name]));
  }

  function formatNumber(value) {
    if (value < 1000) return Math.floor(value).toLocaleString('en-US');
    if (value < 1000000) return (value / 1000).toFixed(value < 10000 ? 1 : 0) + 'k';
    if (value < 1000000000) return (value / 1000000).toFixed(value < 10000000 ? 1 : 0) + 'm';
    return (value / 1000000000).toFixed(1) + 'b';
  }

  function catRank() {
    if (state.lifetimePurrs >= 5000) return 'the chosen scritcher';
    if (state.lifetimePurrs >= 1000) return 'webcat sysadmin';
    if (state.lifetimePurrs >= 250) return 'senior purr engineer';
    if (state.lifetimePurrs >= 50) return 'trusted human';
    if (state.lifetimePurrs >= 10) return 'new friend';
    return 'complete stranger';
  }

  function saveState() {
    state.lastSeen = Date.now();
    try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch (error) {}
  }

  function render() {
    countNode.textContent = formatNumber(state.purrs);
    rateNode.textContent = formatNumber(purrRate());
    powerNode.textContent = formatNumber(clickPower());
    lifetimeNode.textContent = formatNumber(state.lifetimePurrs);
    rankNode.textContent = catRank();

    upgradeButtons.forEach(function (button) {
      var name = button.dataset.upgrade;
      var cost = upgradeCost(name);
      button.querySelector('[data-cost]').textContent = formatNumber(cost);
      button.querySelector('[data-owned]').textContent = state.upgrades[name];
      button.disabled = state.purrs < cost;
      button.classList.toggle('is-affordable', state.purrs >= cost);
    });
  }

  function addClickEffect(amount) {
    var effect = document.createElement('span');
    effect.className = 'purr-pop';
    effect.textContent = '+' + formatNumber(amount);
    effect.style.left = (35 + Math.random() * 30) + '%';
    effect.style.top = (34 + Math.random() * 18) + '%';
    game.querySelector('.cat-console').appendChild(effect);
    window.setTimeout(function () { effect.remove(); }, 850);
  }

  var awaySeconds = Math.min((Date.now() - state.lastSeen) / 1000, 60 * 60 * 4);
  var awayPurrs = purrRate() * awaySeconds;
  if (awayPurrs >= 1) {
    state.purrs += awayPurrs;
    state.lifetimePurrs += awayPurrs;
    messageNode.textContent = 'webcat saved ' + formatNumber(awayPurrs) + ' purrs while you were away.';
  }

  petButton.addEventListener('click', function () {
    var amount = clickPower();
    clickCount += 1;
    state.purrs += amount;
    state.lifetimePurrs += amount;
    messageNode.textContent = messages[(clickCount - 1) % messages.length];
    game.classList.remove('is-petted');
    void game.offsetWidth;
    game.classList.add('is-petted');
    addClickEffect(amount);
    render();
  });

  upgradeButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var name = button.dataset.upgrade;
      var cost = upgradeCost(name);
      if (state.purrs < cost) return;
      state.purrs -= cost;
      state.upgrades[name] += 1;
      messageNode.textContent = button.querySelector('.upgrade-copy strong').textContent + ' installed!';
      saveState();
      render();
    });
  });

  resetButton.addEventListener('click', function () {
    if (!window.confirm('Erase all webcat purrs and upgrades?')) return;
    state = blankState();
    messageNode.textContent = 'save erased. webcat remembers nothing... probably.';
    try {
      localStorage.removeItem(storageKey);
      localStorage.removeItem('jackl-purrs');
    } catch (error) {}
    render();
  });

  window.setInterval(function () {
    var now = Date.now();
    var seconds = Math.min((now - lastTick) / 1000, 5);
    var generated = purrRate() * seconds;
    lastTick = now;
    state.purrs += generated;
    state.lifetimePurrs += generated;
    render();
  }, 250);

  window.setInterval(saveState, 5000);
  window.addEventListener('pagehide', saveState);
  render();
})();
