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
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LANG_ORDER.includes(saved)) return saved;
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
  const cx = 42, cy = 42, r = 33;
  return `
    <svg class="postmark-svg" viewBox="0 0 148 84" aria-hidden="true">
      <defs>
        <path id="${topId}" d="M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy}" />
        <path id="${botId}" d="M ${cx - r},${cy} A ${r},${r} 0 0 0 ${cx + r},${cy}" />
      </defs>

      <circle class="pm-ring" cx="${cx}" cy="${cy}" r="${r}" stroke-width="1.6" />
      <circle class="pm-ring" cx="${cx}" cy="${cy}" r="${r - 4}" stroke-width="1" />

      <text class="pm-arc-text" font-size="8.2">
        <textPath href="#${topId}" startOffset="50%" text-anchor="middle">HOUGHTON MI</textPath>
      </text>
      <text class="pm-arc-text" font-size="8.2">
        <textPath href="#${botId}" startOffset="50%" text-anchor="middle">SERVE THE KING</textPath>
      </text>

      <circle class="pm-dot" cx="${cx - r}" cy="${cy}" r="1.6" />
      <circle class="pm-dot" cx="${cx + r}" cy="${cy}" r="1.6" />

      <rect class="pm-date-box" x="${cx - 20}" y="${cy - 11}" width="40" height="22" stroke-width="1.3" />
      <text class="pm-date-text" x="${cx}" y="${cy - 1}" font-size="10.5">${pm.month} ${pm.day}</text>
      <text class="pm-date-text" x="${cx}" y="${cy + 9}" font-size="8">${pm.year}</text>

      <path class="pm-wave" d="M ${cx + r + 4},${cy - 12} q 6,-8 12,0 t 12,0 t 12,0 t 12,0" stroke-width="1.4" />
      <path class="pm-wave" d="M ${cx + r + 4},${cy}     q 6,-8 12,0 t 12,0 t 12,0 t 12,0" stroke-width="1.4" />
      <path class="pm-wave" d="M ${cx + r + 4},${cy + 12} q 6,-8 12,0 t 12,0 t 12,0 t 12,0" stroke-width="1.4" />
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
        <div class="stamp-row"></div>
      `;

      const stampRow = li.querySelector('.stamp-row');
      LANG_ORDER.forEach(lang => {
        const href = entry.files[lang];
        if (!href) return;
        const a = document.createElement('a');
        a.className = 'stamp' + (lang === currentLang ? ' preferred' : '');
        a.href = href;
        a.textContent = LANG_LABEL[lang];
        stampRow.appendChild(a);
      });

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

  function renderAll() {
    renderLangButtons();
    renderHeader();
    renderList();
    renderSupportBanner();
  }

  renderAll();
}

document.addEventListener('DOMContentLoaded', init);
