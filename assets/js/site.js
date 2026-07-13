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

  var petButton = document.querySelector('.pet-button');
  var countNode = document.querySelector('[data-purr-count]');
  var messageNode = document.querySelector('.cat-message');
  var cat = document.querySelector('.webcat');
  var count = 0;
  var messages = [
    'mrrrrp! thank you :3',
    'the webcat approves.',
    '*tiny dial-up noises*',
    'you have excellent clicking skills.',
    'purr protocol activated!',
    'a friendship has been cached ♡'
  ];

  try { count = Number(localStorage.getItem('jackl-purrs')) || 0; } catch (error) {}
  if (countNode) countNode.textContent = count;

  function addSparkle() {
    if (!cat) return;
    var sparkle = document.createElement('span');
    sparkle.className = 'sparkle';
    sparkle.textContent = ['✦', '♡', '✧'][Math.floor(Math.random() * 3)];
    sparkle.style.left = (18 + Math.random() * 64) + '%';
    sparkle.style.top = (28 + Math.random() * 45) + '%';
    cat.appendChild(sparkle);
    window.setTimeout(function () { sparkle.remove(); }, 900);
  }

  if (petButton) {
    petButton.addEventListener('click', function () {
      count += 1;
      countNode.textContent = count;
      messageNode.textContent = messages[(count - 1) % messages.length];
      cat.classList.remove('is-petted');
      void cat.offsetWidth;
      cat.classList.add('is-petted');
      addSparkle();
      try { localStorage.setItem('jackl-purrs', String(count)); } catch (error) {}
    });
  }
})();
