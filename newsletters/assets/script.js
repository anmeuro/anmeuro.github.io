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

  function renderList() {
    listEl.innerHTML = '';
    // entries already sorted newest-first in manifest, but sort defensively
    const sorted = [...data.entries].sort((a, b) => b.date.localeCompare(a.date));

    sorted.forEach(entry => {
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
          <div class="postmark" aria-hidden="true">
            <span class="postmark-inner">
              <span class="pm-place">Houghton MI</span>
              <span class="pm-day">${pm.day}</span>
              <span class="pm-month">${pm.month} ${pm.year}</span>
            </span>
          </div>
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

  function renderAll() {
    renderLangButtons();
    renderHeader();
    renderList();
  }

  renderAll();
}

document.addEventListener('DOMContentLoaded', init);
