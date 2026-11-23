// トップのオープニング（index.html だけ）。決まりは docs/DESIGN-SPEC.md 11 章
// - assets/config.js の INTRO_MODE：'type'（打ち込んでロゴになる・約 3 秒）／'empty'（点滅して消える・約 2.2 秒）／'off'
// - 同じタブで 1 回だけ（sessionStorage。使えないときは出さない）。ほかのページから戻ったときは出さない
// - 画面を押す・キーを押すとすぐ飛ばす。動きを減らす設定では出さない。3.5 秒を超えて止めない
// - ページは後ろで普通に読み込む（上に重ねるだけ）。JS が動かないときは何も出ない
// - index.html?intro=1 で強制で見られる（?intro=type / ?intro=empty でモードも選べる）
// このファイルは <head> で読む（ページが描かれる前に、地の色で覆うため）
(function () {
  var root = document.documentElement;
  var cfg = window.HASHTAG_CONFIG || {};
  var q = new URLSearchParams(location.search).get('intro');
  var force = q === '1' || q === 'type' || q === 'empty';
  var mode = (q === 'type' || q === 'empty') ? q : cfg.INTRO_MODE;
  if (mode !== 'type' && mode !== 'empty') return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var KEY = 'hashtag-intro-shown';
  if (!force) {
    // sessionStorage が使えないときは出さない
    try { if (sessionStorage.getItem(KEY)) return; sessionStorage.setItem(KEY, '1'); } catch (e) { return; }
    // ほかのページから来た・戻ったときは出さない
    try {
      var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
      if (nav && nav.type === 'back_forward') return;
      if (document.referrer && new URL(document.referrer).origin === location.origin) return;
    } catch (e) {}
  }

  // 描かれる前に地の色で覆う（site.css の html.intro-on）。CSS だけでも 3.5 秒で消える
  root.classList.add('intro-on');

  var HASH = '<svg class="hash" viewBox="0 0 40 40" aria-hidden="true"><g stroke="#fff" stroke-width="2.6" stroke-linecap="round" fill="none"><line x1="17" y1="6" x2="13" y2="34"/><line x1="28" y1="6" x2="24" y2="34"/><line x1="8" y1="15" x2="34" y2="15"/><line x1="6" y1="25" x2="32" y2="25"/></g></svg>';
  var wrap, pill, name, timers = [], done = false;

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function stopScroll(e) { e.preventDefault(); }
  function skip() { finish(150); }
  function cleanup() {
    timers.forEach(clearTimeout);
    window.removeEventListener('wheel', stopScroll, { passive: false });
    window.removeEventListener('touchmove', stopScroll, { passive: false });
    window.removeEventListener('pointerdown', skip, true);
    window.removeEventListener('keydown', skip, true);
    root.classList.remove('intro-on');
  }
  // 地の色を fade ms で消して終わる
  function finish(fade) {
    if (done) return;
    done = true;
    cleanup();
    if (!wrap) return;
    wrap.style.transitionDuration = fade + 'ms';
    wrap.classList.add('intro-out');
    setTimeout(function () { if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap); }, fade + 50);
  }

  var t0 = Date.now();

  function start() {
    if (done) return;
    // ページの準備に 0.8 秒より長くかかったときは出さない（待たせない）
    if (Date.now() - t0 > 800) { finish(0); return; }
    // 何があっても 3.5 秒で終わる
    later(function () { finish(200); }, 3300);
    wrap = document.createElement('div');
    wrap.className = 'intro';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML = '<div class="intro-pill">' + HASH + '<span class="intro-name"></span><span class="intro-caret"></span></div>';
    document.body.appendChild(wrap);
    pill = wrap.querySelector('.intro-pill');
    name = wrap.querySelector('.intro-name');
    root.classList.remove('intro-on'); // 覆いは .intro が引き継ぐ

    // 後ろのページをスクロールさせない（overflow は変えない：ロゴの位置がずれないように）。押すとすぐ飛ばす
    window.addEventListener('wheel', stopScroll, { passive: false });
    window.addEventListener('touchmove', stopScroll, { passive: false });
    window.addEventListener('pointerdown', skip, true);
    window.addEventListener('keydown', skip, true);

    // 0.1 秒：0.4 秒でふわっと出る → カーソルが約 1 秒（2 回）点滅
    later(function () { wrap.classList.add('intro-in'); }, 100);
    later(function () { wrap.classList.add('intro-blink'); }, 500);

    if (mode === 'empty') {
      // 1.6 秒：画面ごと 0.5 秒で消える（全部で約 2.2 秒）
      later(function () { finish(500); }, 1600);
      return;
    }

    // 'type'：1.5 秒から「hashtag」を 1 文字ずつ（90ms ごと）
    var word = 'hashtag';
    later(function () { wrap.classList.remove('intro-blink'); wrap.classList.add('intro-typing'); }, 1500);
    for (var i = 1; i <= word.length; i++) {
      (function (n) { later(function () { name.textContent = word.slice(0, n); }, 1500 + 90 * n); })(i);
    }
    // 打ち終わり（約 2.13 秒）：小さくなりながら、左上のヘッダーのロゴの位置へ 0.6 秒で動く
    later(function () {
      var logo = document.querySelector('.hd-logo');
      if (!logo) { finish(300); return; }
      var r = logo.getBoundingClientRect(), s = getComputedStyle(logo);
      var fs = logo.querySelector('.caret').getBoundingClientRect().height || r.height * 0.4375; // 丸長方形の大きさの基準＝ロゴのカーソルの高さ（文字はその 1.04 倍）
      var p = pill.getBoundingClientRect();
      // 今の場所に固定してから（動きなしで）、ロゴの場所・大きさへ
      pill.style.transition = 'none';
      pill.style.left = p.left + 'px'; pill.style.top = p.top + 'px'; pill.style.width = p.width + 'px'; pill.style.height = p.height + 'px';
      pill.style.transform = 'none';
      pill.offsetWidth; // いったん描く
      pill.style.transition = '';
      wrap.classList.add('intro-fly');
      pill.style.left = r.left + 'px'; pill.style.top = r.top + 'px'; pill.style.width = r.width + 'px'; pill.style.height = r.height + 'px';
      pill.style.fontSize = fs + 'px';
      pill.style.paddingLeft = s.paddingLeft; pill.style.paddingRight = s.paddingRight;
      // 0.6 秒でロゴに重なる → 地の色を 0.3 秒で消す（ロゴと入れ替わる）。全部で約 3 秒
      later(function () { finish(300); }, 650);
    }, 1500 + 90 * word.length);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
