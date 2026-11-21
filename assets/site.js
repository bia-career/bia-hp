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

})();

// 6. スクロールで出てくる動き（見出し・カード）。1 回出たら終わり。動きを減らす設定なら何もしない
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  var els = document.querySelectorAll('.sec-head, .card, .faq details, .typing-card, .policy');
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  els.forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.top < window.innerHeight) return; // はじめから見えているものは隠さない
    el.classList.add('rv'); io.observe(el);
  });
  document.documentElement.classList.add('js-reveal');
})();


// 9. スマホの下の「無料でキャリア相談」：ページの中の主なボタンが見えている間は隠す
(function () {
  var bar = document.querySelector('.sticky-cta');
  if (!bar || !('IntersectionObserver' in window)) return;
  var targets = document.querySelectorAll('main .btn-main');
  if (!targets.length) return;
  var seen = new Set();
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) seen.add(e.target); else seen.delete(e.target); });
    var hide = seen.size > 0;
    bar.classList.toggle('hide', hide);
    bar.setAttribute('aria-hidden', hide);
    bar.querySelector('a').tabIndex = hide ? -1 : 0;
  });
  targets.forEach(function (t) { io.observe(t); });
})();

// 「無料でキャリア相談」の行き先を assets/config.js の BOOKING_URL から作る。どのボタンから来たかを ?from= で付ける
(function () {
  var cfg = window.HASHTAG_CONFIG || {}; var base = cfg.BOOKING_URL || '/booking.html';
  document.querySelectorAll('a[data-booking]').forEach(function (a) {
    a.href = base + (base.indexOf('?') >= 0 ? '&' : '?') + 'from=' + encodeURIComponent(a.getAttribute('data-booking'));
  });
})();
