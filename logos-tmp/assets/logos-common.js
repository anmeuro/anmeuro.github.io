// Shared language helpers for the Logos section.
// Only English and Chinese are supported here (unlike the 4-language
// newsletters section). Preference is remembered via localStorage,
// separate from the newsletters section's own key.
window.LogosCommon = (function () {
  var LANG_ORDER = ['en', 'zh'];
  var LANG_LABEL = { en: 'English', zh: '中文' };
  var STORAGE_KEY = 'logos-preferred-lang';

  function getPreferredLang() {
    try {
      var params = new URLSearchParams(window.location.search);
      var fromUrl = params.get('lang');
      if (fromUrl && LANG_ORDER.indexOf(fromUrl) !== -1) return fromUrl;
    } catch (e) {}
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored && LANG_ORDER.indexOf(stored) !== -1) return stored;
    } catch (e) {}
    var nav = (navigator.language || 'en').slice(0, 2);
    return nav === 'zh' ? 'zh' : 'en';
  }

  function setPreferredLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  function pick(dict, lang) {
    if (!dict) return '';
    return dict[lang] || dict.en || Object.values(dict)[0];
  }

  // Renders "Read in: EN 中文" pill buttons into the given container element.
  // onChange(lang) is called whenever the visitor picks a different language.
  function renderLangSelect(container, currentLang, onChange) {
    container.innerHTML = '<span class="lang-label">Read in / 阅读语言</span>';
    LANG_ORDER.forEach(function (lang) {
      var btn = document.createElement('button');
      btn.className = 'lang-btn' + (lang === currentLang ? ' active' : '');
      btn.textContent = LANG_LABEL[lang];
      btn.setAttribute('aria-pressed', lang === currentLang ? 'true' : 'false');
      btn.addEventListener('click', function () {
        setPreferredLang(lang);
        onChange(lang);
      });
      container.appendChild(btn);
    });
  }

  return {
    LANG_ORDER: LANG_ORDER,
    LANG_LABEL: LANG_LABEL,
    getPreferredLang: getPreferredLang,
    setPreferredLang: setPreferredLang,
    pick: pick,
    renderLangSelect: renderLangSelect
  };
})();
