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
    var statusEl = document.getElementById('status');
    var listEl = document.getElementById('entry-list');

    function renderHeader() {
      titleEl.textContent = C.pick(data.book.title, currentLang);
      subtitleEl.textContent = C.pick(data.book.subtitle, currentLang);
      document.title = C.pick(data.book.title, currentLang);
      document.documentElement.lang = currentLang;
    }

    function renderList() {
      var entries = (data.entries || []).slice()
        .sort(function (a, b) { return b.date.localeCompare(a.date); });

      listEl.innerHTML = '';

      if (entries.length === 0) {
        statusEl.style.display = 'block';
        statusEl.textContent = currentLang === 'zh'
          ? '暂无摘要。' : 'No summaries yet.';
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
