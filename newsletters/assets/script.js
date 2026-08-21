// Letters from Houghton — archive script
// Reads assets/manifest.json, renders the dated entry list,
// and remembers the visitor's preferred language via localStorage.

const LANG_ORDER = ['en', 'ko', 'zh', 'de'];
const LANG_LABEL = { en: 'English', ko: '한국어', zh: '中文', de: 'Deutsch' };
const MONTHS = {
  en: ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
};

const STORAGE_KEY = 'lfh-preferred-lang';

function getPreferredLang() {
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('lang');
    if (fromUrl && LANG_ORDER.includes(fromUrl)) return fromUrl;
  } catch (e) {}
  const nav = (navigator.language || 'en').slice(0, 2);
  if (nav === 'ko') return 'ko';
  if (nav === 'zh') return 'zh';
  if (nav === 'de') return 'de';
  return 'en';
}

function setPreferredLang(lang) {
  try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
}

function pick(dict, lang) {
  return dict[lang] || dict.en || Object.values(dict)[0];
}

function postmarkFor(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return {
    day: String(d).padStart(2, '0'),
    month: MONTHS.en[m - 1],
    year: y
  };
}

async function init() {
  const res = await fetch('assets/manifest.json', { cache: 'no-store' });
  const data = await res.json();

  let currentLang = getPreferredLang();

  const langSelectEl = document.getElementById('lang-select');
  const titleEl = document.getElementById('site-title');
  const subtitleEl = document.getElementById('site-subtitle');
  const listEl = document.getElementById('entry-list');

  function renderLangButtons() {
    langSelectEl.innerHTML = '<span class="lang-label">Read in</span>';
    LANG_ORDER.forEach(lang => {
      const btn = document.createElement('button');
      btn.className = 'lang-btn' + (lang === currentLang ? ' active' : '');
      btn.textContent = LANG_LABEL[lang];
      btn.setAttribute('aria-pressed', lang === currentLang ? 'true' : 'false');
      btn.addEventListener('click', () => {
        currentLang = lang;
        setPreferredLang(lang);
        renderAll();
      });
      langSelectEl.appendChild(btn);
    });
  }

  function renderHeader() {
    titleEl.textContent = pick(data.site.title, currentLang);
    subtitleEl.textContent = pick(data.site.subtitle, currentLang);
    document.title = pick(data.site.title, currentLang);
    document.documentElement.lang = currentLang;
  }

function postmarkSvg(entry, pm, uid) {
  const topId = `pm-top-${uid}`;
  const botId = `pm-bot-${uid}`;
  const cx = 44, cy = 44, r = 35;
  return `
    <svg class="postmark-svg" viewBox="0 0 148 84" aria-hidden="true">
      <defs>
        <path id="${topId}" d="M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy}" />
        <path id="${botId}" d="M ${cx - r},${cy} A ${r},${r} 0 0 0 ${cx + r},${cy}" />
      </defs>

      <circle class="pm-ring" cx="${cx}" cy="${cy}" r="${r}" stroke-width="2.2" />
      <circle class="pm-ring" cx="${cx}" cy="${cy}" r="${r - 4.5}" stroke-width="1.4" />

      <text class="pm-arc-text" font-size="9.6">
        <textPath href="#${topId}" startOffset="50%" text-anchor="middle">HOUGHTON MI</textPath>
      </text>
      <text class="pm-arc-text" font-size="9.6">
        <textPath href="#${botId}" startOffset="50%" text-anchor="middle">SERVE THE KING</textPath>
      </text>

      <circle class="pm-dot" cx="${cx - r}" cy="${cy}" r="2.1" />
      <circle class="pm-dot" cx="${cx + r}" cy="${cy}" r="2.1" />

      <rect class="pm-date-box" x="${cx - 21}" y="${cy - 12}" width="42" height="24" stroke-width="1.8" />
      <text class="pm-date-text" x="${cx}" y="${cy - 1}" font-size="11.8">${pm.month} ${pm.day}</text>
      <text class="pm-date-text" x="${cx}" y="${cy + 10}" font-size="9">${pm.year}</text>

      <path class="pm-wave" d="M ${cx + r + 5},${cy - 13} q 6,-9 12,0 t 12,0 t 12,0 t 12,0" stroke-width="2" />
      <path class="pm-wave" d="M ${cx + r + 5},${cy}      q 6,-9 12,0 t 12,0 t 12,0 t 12,0" stroke-width="2" />
      <path class="pm-wave" d="M ${cx + r + 5},${cy + 13} q 6,-9 12,0 t 12,0 t 12,0 t 12,0" stroke-width="2" />
    </svg>
  `;
}

  function renderList() {
    listEl.innerHTML = '';
    // entries already sorted newest-first in manifest, but sort defensively
    const sorted = [...data.entries].sort((a, b) => b.date.localeCompare(a.date));

    sorted.forEach((entry, idx) => {
      const pm = postmarkFor(entry.date);
      const li = document.createElement('li');
      li.className = 'entry';
      li.setAttribute('role', 'listitem');

      const preferredHref = entry.files[currentLang] || entry.files.en;

      li.innerHTML = `
        <div class="entry-top">
          <div>
            <p class="entry-date-full">${pick(entry.displayDate, currentLang)}</p>
            <h2 class="entry-title"><a href="${preferredHref}">${pick(entry.title, currentLang)}</a></h2>
            <p class="entry-excerpt">${pick(entry.excerpt, currentLang)}</p>
          </div>
          <div class="postmark-wrap">${postmarkSvg(entry, pm, idx)}</div>
        </div>
      `;

      listEl.appendChild(li);
    });
  }

  function renderSupportBanner() {
    const support = data.site.support;
    if (!support) return;
    const banner = document.getElementById('support-banner');
    banner.innerHTML = `
      <p class="support-text">${pick(support.text, currentLang)}</p>
      <a class="support-btn" href="${support.url}" target="_blank" rel="noopener">${support.buttonLabel}</a>
    `;
  }

  
const NAV_LABELS = {
  en: { letters: 'Letters', about: 'About Sion', houghton: 'About Houghton', essays: 'Essays', subscribe: 'Subscribe' },
  ko: { letters: '편지', about: 'Sion 소개', houghton: '하턴 소개', essays: '에세이', subscribe: '구독' },
  zh: { letters: '书信', about: '关于Sion', houghton: '关于霍顿', essays: '文章', subscribe: '订阅' },
  de: { letters: 'Briefe', about: 'Über Sion', houghton: 'Über Houghton', essays: 'Essays', subscribe: 'Abonnieren' }
};

const NAV_HREFS = {
  en: { letters: 'index.html', about: 'about.html', houghton: 'houghton.html', essays: 'essays.html', subscribe: 'subscribe.html' },
  ko: { letters: 'index.html?lang=ko', about: 'about-ko.html', houghton: 'houghton-ko.html', essays: 'essays.html', subscribe: 'subscribe-ko.html' },
  zh: { letters: 'index.html?lang=zh', about: 'about-zh.html', houghton: 'houghton-zh.html', essays: 'essays.html', subscribe: 'subscribe-zh.html' },
  de: { letters: 'index.html?lang=de', about: 'about-de.html', houghton: 'houghton-de.html', essays: 'essays.html', subscribe: 'subscribe-de.html' }
};

function renderNav() {
  const labels = NAV_LABELS[currentLang] || NAV_LABELS.en;
  const hrefs = NAV_HREFS[currentLang] || NAV_HREFS.en;
  document.querySelectorAll('.site-nav-link[data-nav]').forEach(function (link) {
    var key = link.getAttribute('data-nav');
    if (labels[key]) link.textContent = labels[key];
    if (hrefs[key]) link.setAttribute('href', hrefs[key]);
  });
}

function renderAll() {
    renderNav();
    renderLangButtons();
    renderHeader();
    renderList();
    renderSupportBanner();
  }

  renderAll();
}

document.addEventListener('DOMContentLoaded', init);
