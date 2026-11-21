// 全ページの共通：ヘッダー（ロゴとメニュー）。DESIGN-SPEC.md 10 章
(function () {
  var root = document.documentElement;
  var hd = document.querySelector('.hd');
  if (!hd) return;
  var mq = window.matchMedia('(max-width: 959px)');

  // スクロールしたら html に .hd-scrolled（ロゴの下の 1 行を消す・ロゴを小さく・影）。一番上に戻ったら外す
  var ticking = false;
  // 運営会社のページの BIA のロゴは、紺のフッターに重なっている間だけ白にする（html に .hd-on-dark）
  var bia = hd.querySelector('.hd-bia img'), foot = document.querySelector('footer');
  // BIA のロゴが見出し（h1〜h3・大きな英字の見出し）の文字に重なっている間だけ、ロゴをうすくする（html に .hd-on-head）。本文・カード・表では変えない
  var heads = bia ? [].slice.call(document.querySelectorAll('h1, h2, h3, .en-big')).filter(function (h) { return !h.closest('.hd, footer'); }) : [];
  var range = document.createRange();
  function onHead(l) {
    for (var i = 0; i < heads.length; i++) {
      var r = heads[i].getBoundingClientRect();
      if (r.bottom <= l.top || r.top >= l.bottom || !r.width) continue; // 縦に重ならないものは、ここで飛ばす（軽い）
      range.selectNodeContents(heads[i]);
      var rs = range.getClientRects(); // 文字が実際にある所（行ごと）
      for (var j = 0; j < rs.length; j++) {
        var t = rs[j];
        if (t.width && t.right > l.left && t.left < l.right && t.bottom > l.top && t.top < l.bottom) return true;
      }
    }
    return false;
  }
  function onScroll() {
    ticking = false;
    root.classList.toggle('hd-scrolled', window.scrollY > 4);
    if (bia && foot) {
      var l = bia.getBoundingClientRect(), f = foot.getBoundingClientRect(), mid = l.top + l.height / 2;
      root.classList.toggle('hd-on-dark', f.top <= mid && f.bottom >= mid);
      root.classList.toggle('hd-on-head', onHead(l));
    }
  }
  function queue() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  onScroll();

  // SERVICE ▼：マウスを乗せる・押す・キーボード（Enter・Space・↓ で開く、Esc で閉じる、↑↓ で中を動く）
  var sv = hd.querySelector('.hd-sv'), svb = hd.querySelector('.hd-sv-btn');
  var items = sv ? [].slice.call(sv.querySelectorAll('.hd-drop a')) : [];
  function setSv(open) { if (!sv) return; sv.classList.toggle('open', open); svb.setAttribute('aria-expanded', open ? 'true' : 'false'); }
  if (sv && svb) {
    var timer, lastPointer = '';
    sv.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse' && !mq.matches) { clearTimeout(timer); setSv(true); } });
    sv.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && !mq.matches) { timer = setTimeout(function () { setSv(false); }, 150); } });
    // マウスのある画面で押したときは「開く」だけ（閉じるのは マウスが外れたとき・外を押したとき・Esc）。
    // タッチとキーボード（Enter・スペース）は押すたびに開く／閉じる
    svb.addEventListener('pointerdown', function (e) { lastPointer = e.pointerType || ''; });
    svb.addEventListener('keydown', function () { lastPointer = 'keyboard'; });
    svb.addEventListener('click', function (e) {
      var type = (e.pointerType !== undefined && e.pointerType !== '') ? e.pointerType : (e.detail === 0 ? 'keyboard' : lastPointer);
      lastPointer = '';
      if (type === 'mouse' && !mq.matches) { clearTimeout(timer); setSv(true); return; }
      setSv(!sv.classList.contains('open'));
    });
    svb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); e.stopPropagation(); setSv(true); if (items[0]) items[0].focus(); }
    });
    sv.addEventListener('keydown', function (e) {
      var i = items.indexOf(document.activeElement);
      if (e.key === 'Escape' && sv.classList.contains('open')) { e.stopPropagation(); setSv(false); svb.focus(); }
      else if (i >= 0 && e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      else if (i >= 0 && e.key === 'ArrowUp') { e.preventDefault(); if (i === 0) svb.focus(); else items[i - 1].focus(); }
    });
    // マウスを乗せて開いているとき（ボタンにフォーカスが無いとき）も Esc で閉じる
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !mq.matches && sv.classList.contains('open') && !sv.contains(document.activeElement)) setSv(false); });
    // パソコンでは、SERVICE の外を押す・Tab で外に出ると閉じる
    document.addEventListener('click', function (e) { if (!mq.matches && !sv.contains(e.target)) setSv(false); });
    sv.addEventListener('focusout', function (e) { if (!mq.matches && !sv.contains(e.relatedTarget)) setSv(false); });
  }

  // スマホの ≡：開いている間は後ろのページをスクロールさせない（html に .hd-open）。Esc・リンク・外を押すと閉じる
  var b = hd.querySelector('.hd-menu'), n = document.getElementById('gnav');
  function setMenu(open, focusBack) {
    if (!b || !n) return;
    n.classList.toggle('open', open);
    root.classList.toggle('hd-open', open);
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
    b.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    if (!open) setSv(false); // 次に開いたとき SERVICE は閉じている
    if (!open && focusBack) b.focus();
  }
  if (b && n) {
    b.addEventListener('click', function () { setMenu(!n.classList.contains('open')); });
    n.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && n.classList.contains('open')) setMenu(false, true); });
    document.addEventListener('click', function (e) { if (n.classList.contains('open') && (!hd.contains(e.target) || e.target.classList.contains('hd-bar') || e.target.classList.contains('hd-in'))) setMenu(false); });
    hd.addEventListener('focusout', function (e) { if (n.classList.contains('open') && e.relatedTarget && !hd.contains(e.relatedTarget)) setMenu(false); });
    // 幅がパソコンに変わったら閉じる
    (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(function () { setMenu(false); setSv(false); });
  }
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
