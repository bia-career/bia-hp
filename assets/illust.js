// 動くイラスト（assets/illust/*.svg をページの中に直接入れたもの）。DESIGN-SPEC.md 13 章
// .illust-anim が画面に見えている間だけ .is-playing を付けて動かす。見えなくなったら外す
// 動きを減らす設定・IntersectionObserver が無いブラウザでは何もしない（止まった 1 枚の絵のまま）
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { e.target.classList.toggle('is-playing', e.isIntersecting); });
  }, { threshold: 0.2 });
  document.querySelectorAll('.illust-anim').forEach(function (el) { io.observe(el); });
})();
