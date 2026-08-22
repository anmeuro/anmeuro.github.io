Logos 섹션 사용법
=================

각 책(Book)마다 index.html + assets/manifest.json 이 있고,
manifest.json에 등록된 항목들이 자동으로 목록에 나타납니다 (날짜 최신순).
각 항목(요약)은 실제 HTML 파일(EN/ZH 두 언어)로 되어 있어
모바일에서 바로 읽기 좋게 최적화되어 있습니다.
언어는 영어/중국어만 지원하며, 선택한 언어는 브라우저에 기억됩니다.

항목 파일은 날짜별 폴더가 아니라, 폴더 하나(entries/) 안에
파일명에 날짜를 넣는 방식으로 관리합니다 (모임이 잦은 경우
폴더가 너무 많아지는 것을 피하기 위함):

  Logos/Acts/entries/2026-08-22-en.html
  Logos/Acts/entries/2026-08-22-zh.html


1) 기존 책에 새 요약(항목) 추가하기 (예: Acts에 새 성경공부 추가)
------------------------------------------------------------
  1. Logos/_entry-template 안의 en.html, zh.html을 복사해서
     Logos/Acts/entries/ 안에 아래처럼 이름 바꿔 넣기:
       entries/<날짜>-en.html   예: entries/2026-08-29-en.html
       entries/<날짜>-zh.html   예: entries/2026-08-29-zh.html
  2. 복사한 두 파일을 열어서 {{...}} placeholder들을 실제 내용으로 교체
     (제목, 핵심 구절, 본문, 요점, 묵상/기도/후속 사항 등)
  3. Logos/Acts/assets/manifest.json 을 열어서 "entries" 배열에 새 항목 추가:

     {
       "date": "2026-08-29",
       "displayDate": { "en": "August 29, 2026", "zh": "2026年8月29日" },
       "title": { "en": "...", "zh": "..." },
       "excerpt": { "en": "...", "zh": "..." },
       "files": {
         "en": "entries/2026-08-29-en.html",
         "zh": "entries/2026-08-29-zh.html"
       }
     }

  4. git add / commit / push


2) 새 책 추가하기 (예: Romans)
------------------------------
  1. Logos/_book-template 폴더 전체를 복사해서 Logos/Romans 로 이름 바꾸기
  2. Logos/Romans/index.html 을 열어서 {{BOOK_TITLE_EN}} / {{BOOK_TITLE_ZH}}
     placeholder를 실제 책 이름으로 교체 (예: Romans / 罗马书)
  3. Logos/Romans/assets/manifest.json 을 열어서 book.title, book.subtitle의
     {{BOOK_TITLE_EN}} / {{BOOK_TITLE_ZH}} 도 같은 값으로 교체
  4. Logos/Romans/ 안에 entries/ 폴더를 새로 만들기
  5. Logos/assets/logos-books.js 에 한 줄 추가:

     { folder: 'Romans', en: 'Romans', zh: '罗马书' }

     → 이렇게 하면 Logos/index.html 첫 화면에 자동으로 카드가 나타납니다.
  6. 위 "1) 새 요약 추가하기" 순서대로 Romans/entries/<날짜>-en.html, -zh.html
     만들고 manifest.json의 entries에 등록
  7. git add / commit / push


중요: 폴더명은 항상 소문자로!
-----------------------------
GitHub Pages 커스텀 도메인(sionletters.com)에서, 대문자로 시작하는 최상위
폴더명이 원인 불명의 404를 일으키는 문제를 겪은 적이 있습니다
(이 때문에 Logos -> logos로 이름을 바꿨습니다). 앞으로 폴더를 새로 만들 때는
Logos/ 바로 아래 단계(책 이름 등)는 상관없지만, 혹시 사이트 최상위에 새
폴더를 추가할 일이 있다면 소문자로 시작하는 것을 권장합니다.


참고
----
- 예전 A/index.html (PDF 목록, jsDelivr 방식)은 그대로 남겨두었으니
  필요 없으면 나중에 지우거나, Logos/Acts/index.html로 리다이렉트하도록
  바꿔서 옛 링크도 계속 살릴 수 있습니다.
- 실제 PDF를 올려두던 별도의 anmeuro/Logos 데이터 저장소는 이제 필요
  없습니다 (원한다면 계속 보관용으로 둬도 무방합니다).
