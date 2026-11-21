// 全ページの共通：スマホのメニュー（≡）と、パソコンの「その他」
(function () {
  var b = document.querySelector('.menu-btn'), n = document.getElementById('gnav');
  if (b && n) {
    b.addEventListener('click', function () {
      var o = n.classList.toggle('open');
      b.setAttribute('aria-expanded', o);
      b.setAttribute('aria-label', o ? 'メニューを閉じる' : 'メニューを開く');
    });
    n.addEventListener('click', function (e) {
      if (e.target.closest('a')) { n.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-label', 'メニューを開く'); }
    });
  }
  var m = document.querySelector('.more'), mb = document.querySelector('.more-btn');
  if (m && mb) {
    mb.addEventListener('click', function (e) { e.stopPropagation(); var o = m.classList.toggle('open'); mb.setAttribute('aria-expanded', o); });
    document.addEventListener('click', function (e) { if (!m.contains(e.target)) { m.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { m.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); } });
  }
  // 見本の絞り込み（押した見た目だけ）
  document.querySelectorAll('.tag-btn').forEach(function (t) {
    t.addEventListener('click', function () { t.setAttribute('aria-pressed', t.getAttribute('aria-pressed') !== 'true'); });
  });
})();
