// 会社のトップ（index.html）のオープニング。決まりは docs/DESIGN-SPEC.md 16 章
// - 白い画面に BIA のロゴがふわっと出る → パーパス（若者のポテンシャルを解放する。）を水色のカーソルで 1 文字ずつ打ち込む → その文字が一番上の日本語の行へ動いて入れ替わる（約 3 秒）
// - assets/config.js の BIA_INTRO：'type'（出す）／'off'（出さない）
// - 同じタブで 1 回だけ（sessionStorage。使えないときは出さない）。同じサイトから来た・戻ったときは出さない
// - 画面を押す・キーを押すとすぐ飛ばす。動きを減らす設定・JS が動かないときは出さない。3.5 秒を超えて止めない
// - /?intro=1 で強制で見られる
// 打ち込む文字はパーパス（.co-purpose-ja・2026-11 にビジョンから変更）。その行と同じ大きさ・同じ幅・同じ改行で作り、縮めて真ん中に置く。最後は縮めたのを戻すだけなので、改行がずれない
// このファイルは <head> で読む（ページが描かれる前に、地の色で覆うため。覆いは site.css の html.intro-on）
(function () {
  var root = document.documentElement;
  var cfg = window.HASHTAG_CONFIG || {};
  var force = new URLSearchParams(location.search).get('intro') === '1';
  if (!force && cfg.BIA_INTRO === 'off') return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!force) {
    try { if (sessionStorage.getItem('bia-intro-shown')) return; sessionStorage.setItem('bia-intro-shown', '1'); } catch (e) { return; }
    try {
      var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
      if (nav && nav.type === 'back_forward') return;
      if (document.referrer && new URL(document.referrer).origin === location.origin) return;
    } catch (e) {}
  }
  root.classList.add('intro-on');

  var wrap, timers = [], done = false, t0 = Date.now();
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function stopScroll(e) { e.preventDefault(); }
  function skip() { finish(150); }
  function finish(fade) {
    if (done) return; done = true;
    timers.forEach(clearTimeout);
    window.removeEventListener('wheel', stopScroll, { passive: false });
    window.removeEventListener('touchmove', stopScroll, { passive: false });
    window.removeEventListener('pointerdown', skip, true);
    window.removeEventListener('keydown', skip, true);
    root.classList.remove('intro-on');
    if (!wrap) return;
    wrap.style.transitionDuration = fade + 'ms';
    wrap.classList.add('bintro-out');
    setTimeout(function () { if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap); }, fade + 50);
  }

  function start() {
    if (done) return;
    var h1 = document.querySelector('.co-purpose-ja');
    if (!h1 || Date.now() - t0 > 800) { finish(0); return; } // 準備に時間がかかったときは出さない
    later(function () { finish(200); }, 3300); // 何があっても 3.5 秒で終わる

    var text = h1.textContent, r = h1.getBoundingClientRect(), cs = getComputedStyle(h1);
    wrap = document.createElement('div');
    wrap.className = 'bintro';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML = '<img class="bintro-logo" src="/assets/logo.svg" alt="" width="130" height="52"><div class="bintro-text"><span class="bintro-typed"></span><span class="bintro-caret"></span></div>';
    document.body.appendChild(wrap);
    root.classList.remove('intro-on');
    var logo = wrap.querySelector('.bintro-logo'), box = wrap.querySelector('.bintro-text'), typed = wrap.querySelector('.bintro-typed');

    // 見出しと同じ形の箱を、見出しの場所に置く
    ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'color'].forEach(function (k) { box.style[k] = cs[k]; });
    box.style.left = r.left + 'px'; box.style.top = r.top + 'px'; box.style.width = r.width + 'px';
    // 縮めて、画面の真ん中（ロゴの下）へ
    var s = Math.min(0.62, (innerWidth * 0.86) / r.width);
    var dx = innerWidth / 2 - (r.left + r.width / 2), dy = innerHeight * 0.56 - (r.top + r.height / 2);
    box.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')';
    logo.style.top = (innerHeight * 0.56 - r.height * s / 2 - 72) + 'px';

    window.addEventListener('wheel', stopScroll, { passive: false });
    window.addEventListener('touchmove', stopScroll, { passive: false });
    window.addEventListener('pointerdown', skip, true);
    window.addEventListener('keydown', skip, true);

    // 0.1 秒：ロゴがふわっと出る → 0.6 秒：打ち込む（1 文字 45ms）
    later(function () { wrap.classList.add('bintro-in'); }, 100);
    var chars = Array.from(text), step = Math.min(45, 1300 / Math.max(1, chars.length));
    chars.forEach(function (c, i) { later(function () { typed.textContent = chars.slice(0, i + 1).join(''); }, 600 + step * (i + 1)); });
    var endType = 600 + step * chars.length;
    // 打ち終わって 0.2 秒：見出しの位置へ 0.6 秒で動く（ロゴは消える）→ 地の色を 0.3 秒で消して、見出しと入れ替わる
    later(function () { wrap.classList.add('bintro-fly'); box.style.transform = 'none'; }, endType + 200);
    later(function () { finish(300); }, endType + 200 + 650);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
