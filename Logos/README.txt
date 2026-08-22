Logos 섹션 사용법
=================

이제 Acts는 PDF가 아니라, 시온의 뉴스레터와 같은 구조로 되어 있습니다:
  - 각 책(Book)마다 index.html + assets/manifest.json 이 있고,
    manifest.json에 등록된 항목들이 자동으로 목록에 나타납니다 (날짜 최신순).
  - 각 항목(요약)은 실제 HTML 파일(EN/ZH 두 언어)로 되어 있어
    모바일에서 바로 읽기 좋게 최적화되어 있습니다.
  - 언어는 영어/중국어만 지원하며, 선택한 언어는 브라우저에 기억됩니다.


1) 기존 책에 새 요약(항목) 추가하기 (예: Acts에 새 성경공부 추가)
------------------------------------------------------------
  1. Logos/_entry-template 폴더를 복사해서
     Logos/Acts/<날짜> (예: Logos/Acts/2026-09-06) 로 이름 바꿔 넣기
  2. 그 안의 en.html, zh.html을 열어서 {{...}} placeholder들을 실제 내용으로 교체
     (제목, 핵심 구절, 본문, 요점, 묵상/기도 질문 등)
  3. Logos/Acts/assets/manifest.json 을 열어서 "entries" 배열에 새 항목 추가:

     {
       "date": "2026-09-06",
       "displayDate": { "en": "September 6, 2026", "zh": "2026年9月6日" },
       "title": { "en": "...", "zh": "..." },
       "excerpt": { "en": "...", "zh": "..." },
       "files": { "en": "2026-09-06/en.html", "zh": "2026-09-06/zh.html" }
     }

  4. git add / commit / push


2) 새 책 추가하기 (예: Romans)
------------------------------
  1. Logos/_book-template 폴더 전체를 복사해서 Logos/Romans 로 이름 바꾸기
  2. Logos/Romans/index.html 을 열어서 {{BOOK_TITLE_EN}} / {{BOOK_TITLE_ZH}}
     placeholder를 실제 책 이름으로 교체 (예: Romans / 罗马书)
  3. Logos/Romans/assets/manifest.json 을 열어서 book.title, book.subtitle의
     {{BOOK_TITLE_EN}} / {{BOOK_TITLE_ZH}} 도 같은 값으로 교체
  4. Logos/assets/logos-books.js 에 한 줄 추가:

     { folder: 'Romans', en: 'Romans', zh: '罗马书' }

     → 이렇게 하면 Logos/index.html 첫 화면에 자동으로 카드가 나타납니다.
  5. 위 "1) 새 요약 추가하기" 순서대로 Romans/<날짜>/en.html, zh.html 만들고
     manifest.json의 entries에 등록
  6. git add / commit / push


참고
----
- 예전 A/index.html (PDF 목록, jsDelivr 방식)은 그대로 남겨두었으니
  필요 없으면 나중에 지우거나, Logos/Acts/index.html로 리다이렉트하도록
  바꿔서 옛 링크도 계속 살릴 수 있습니다.
- 실제 PDF를 올려두던 별도의 anmeuro/Logos 데이터 저장소는 이제 필요
  없습니다 (원한다면 계속 보관용으로 둬도 무방합니다).
