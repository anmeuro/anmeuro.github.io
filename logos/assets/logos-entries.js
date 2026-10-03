// Generic book archive renderer. Each book's index.html just needs:
//   <script src="../assets/logos-common.js"></script>
//   <script src="../assets/logos-entries.js"></script>
// and the standard element ids used below (see Acts/index.html for the
// exact markup to copy).
(function () {
  function init() {
    fetch('assets/manifest.json', { cache: 'no-store' })
      .then(function (res) { return res.json(); })
      .then(function (data) { render(data); })
      .catch(function (err) {
        document.getElementById('status').textContent =
          'Could not load the list, please refresh. / 无法加载列表，请刷新重试。 (' + err.message + ')';
      });
  }

  function render(data) {
    var C = window.LogosCommon;
    var currentLang = C.getPreferredLang();

    var langSelectEl = document.getElementById('lang-select');
    var titleEl = document.getElementById('book-title');
    var subtitleEl = document.getElementById('book-subtitle');
    var coverEl = document.getElementById('book-cover');
    var statusEl = document.getElementById('status');
    var listEl = document.getElementById('entry-list');

    function renderHeader() {
      titleEl.textContent = C.pick(data.book.title, currentLang);
      subtitleEl.textContent = C.pick(data.book.subtitle, currentLang);
      document.title = C.pick(data.book.title, currentLang);
      document.documentElement.lang = currentLang;
      renderCover();
    }

    // Optional. If data.book.cover is present, shows a cover-art thumbnail
    // in the header that links out to a companion file (e.g. a full PDF).
    // Books without a "cover" field in manifest.json simply show nothing.
    // Expected shape:
    //   "cover": {
    //     "image": "assets/some-cover.jpg",
    //     "href": "assets/some-file.pdf",
    //     "alt": { "en": "...", "zh": "...", "ko": "..." }
    //   }
    function renderCover() {
      if (!coverEl) return;
      var cover = data.book.cover;
      if (!cover || !cover.image || !cover.href) {
        coverEl.innerHTML = '';
        return;
      }
      var altText = C.pick(cover.alt, currentLang);
      var a = document.createElement('a');
      a.className = 'book-cover-link';
      a.href = cover.href;
      a.target = '_blank';
      a.rel = 'noopener';
      var img = document.createElement('img');
      img.className = 'book-cover-img';
      img.src = cover.image;
      img.alt = altText || '';
      a.appendChild(img);
      coverEl.innerHTML = '';
      coverEl.appendChild(a);
    }

    function renderList() {
      var entries = (data.entries || []).slice()
        .sort(function (a, b) { return b.date.localeCompare(a.date); });

      listEl.innerHTML = '';

      if (entries.length === 0) {
        statusEl.style.display = 'block';
        var emptyMsg = { en: 'No summaries yet.', zh: '暂无摘要。', ko: '아직 등록된 요약이 없습니다.' };
        statusEl.textContent = emptyMsg[currentLang] || emptyMsg.en;
        return;
      }
      statusEl.style.display = 'none';

      entries.forEach(function (entry) {
        var href = entry.files[currentLang] || entry.files.en;
        var li = document.createElement('li');
        li.className = 'entry';
        li.innerHTML =
          '<div class="entry-date">' + C.pick(entry.displayDate, currentLang) + '</div>' +
          '<h2 class="entry-title"><a href="' + href + '">' + C.pick(entry.title, currentLang) + '</a></h2>' +
          '<p class="entry-excerpt">' + C.pick(entry.excerpt, currentLang) + '</p>';
        listEl.appendChild(li);
      });
    }

    function renderAll() {
      C.renderLangSelect(langSelectEl, currentLang, function (lang) {
        currentLang = lang;
        renderAll();
      });
      renderHeader();
      renderList();
    }

    renderAll();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
