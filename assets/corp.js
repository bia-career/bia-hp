// 企業の方へ（corp.html）の動き。見た目は assets/corp.css、決まりは docs/DESIGN-SPEC.md 18 章
// - .cp-anim が画面に入ったら .is-on を付ける（線が描かれる・タグがふわっと出る）。1 回だけ
// - 数字（.cp-count[data-to]）は 0 からカウントアップ（約 1.2 秒）
// - 動きを減らす設定・IntersectionObserver が無いときは何もしない（HTML のまま、最初から全部見える）
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('js-cp');

  function countUp(el) {
    var to = +el.getAttribute('data-to') || 0, t0 = null, dur = 1200;
    function step(t) {
      if (t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = String(Math.round(to * e));
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-on');
      e.target.querySelectorAll('.cp-count').forEach(countUp);
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -10% 0px' });

  document.querySelectorAll('.cp-anim').forEach(function (el) {
    el.querySelectorAll('.cp-count').forEach(function (c) { c.textContent = '0'; });
    io.observe(el);
  });
})();
