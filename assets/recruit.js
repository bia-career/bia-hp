// 採用ページ（recruit.html）の動き。DESIGN-SPEC.md 12 章
// 1. 募集職種のカード（assets/recruit-jobs.js の RECRUIT_JOBS から。多くても 3 件）
// 2. エントリーの行き先（assets/config.js の RECRUIT_ENTRY_URL）
// 3. パソコンの右の目次：今読んでいる区画を青にする
(function () {
  var cfg = window.HASHTAG_CONFIG || {};
  var entry = cfg.RECRUIT_ENTRY_URL || {};
  // 応募フォーム（新しいタブで開く）。設定が無いときはページの中の ENTRY へ
  var urls = { '新卒': entry.new || entry.career || '#entry', '中途': entry.career || entry.new || '#entry' };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function val(s) { return esc(s === undefined || s === '' ? '—' : s); }

  // 1. 募集職種
  var box = document.getElementById('rc-jobs');
  if (box) {
    var jobs = (window.RECRUIT_JOBS || (typeof RECRUIT_JOBS !== 'undefined' ? RECRUIT_JOBS : []) || []).slice(0, 3);
    if (!jobs.length) {
      box.outerHTML = '<div class="card empty"><p style="margin:0;font-weight:700">現在募集している職種はありません</p></div>';
    } else {
      box.innerHTML = jobs.map(function (j, i) {
        var id = 'rc-job-' + (j.id ? String(j.id).replace(/[^a-zA-Z0-9_-]/g, '') : i);
        // 詳しく見る：[見出し, 文] または [見出し, [箇条書き…]] を上から順に。古い形（{ work, want, … }）でも出る
        var d = j.detail || [];
        if (!Array.isArray(d)) d = [['仕事内容', d.work], ['求める人', d.want], ['給与', d.salary], ['勤務時間', d.hours], ['休日', d.holidays], ['福利厚生', d.benefits]];
        var types = (j.types || []).filter(function (t) { return urls[t]; });
        var apply = types.map(function (t) {
          return '<a class="btn btn-main" href="' + esc(urls[t]) + '" target="_blank" rel="noopener">' + (types.length > 1 ? esc(t) + 'で' : '') + 'このポジションに応募する<span class="sr">（応募フォームが新しいタブで開きます）</span></a>';
        }).join('');
        function cell(v) { return Array.isArray(v) ? '<ul>' + v.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : val(v); }
        return '<li class="card line rc-job">' +
          '<div class="rc-job-types">' + (j.types || []).map(function (t) { return '<span class="chip">' + esc(t) + '</span>'; }).join('') + '</div>' +
          '<h3>' + val(j.title) + '</h3>' +
          '<p class="rc-job-catch">' + val(j.catch) + '</p>' +
          '<dl class="rc-job-meta"><dt>勤務地</dt><dd>' + val(j.place) + '</dd><dt>雇用形態</dt><dd>' + val(j.employment) + '</dd><dt>給与</dt><dd>' + val(j.salary) + '</dd>' + (j.openings ? '<dt>募集人数</dt><dd>' + val(j.openings) + '</dd>' : '') + '</dl>' +
          '<button class="btn btn-sub rc-job-more" type="button" aria-expanded="false" aria-controls="' + id + '">詳しく見る<span class="rc-plus" aria-hidden="true"></span></button>' +
          '<div class="rc-job-detail" id="' + id + '" hidden>' +
            '<dl>' + d.map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + cell(r[1]) + '</dd>'; }).join('') + '</dl>' +
            (apply ? '<div class="rc-job-apply">' + apply + '</div>' : '') +
          '</div>' +
        '</li>';
      }).join('');
      box.addEventListener('click', function (e) {
        var b = e.target.closest('.rc-job-more');
        if (!b) return;
        var open = b.getAttribute('aria-expanded') !== 'true';
        b.setAttribute('aria-expanded', open ? 'true' : 'false');
        b.firstChild.nodeValue = open ? '閉じる' : '詳しく見る';
        document.getElementById(b.getAttribute('aria-controls')).hidden = !open;
      });
    }
  }

  // 2. エントリーのボタン（data-entry="new" / "career"）：ENTRY の 2 つ・ヘッダーとスマホの下の「エントリー」
  document.querySelectorAll('a[data-entry]').forEach(function (a) {
    var u = a.getAttribute('data-entry') === 'new' ? urls['新卒'] : urls['中途'];
    if (u) a.href = u;
  });

  // 3. 右の目次（1,100px 以上で見える）。区画（data-toc）のうち、画面の上から 35% の線を越えた最後のものを今の区画にする
  var toc = document.querySelector('.rc-toc');
  if (!toc) return;
  var links = {};
  toc.querySelectorAll('li a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  var blocks = [].slice.call(document.querySelectorAll('[data-toc]'));
  var ticking = false, now = null;
  function update() {
    ticking = false;
    var line = window.innerHeight * 0.35, cur = null;
    blocks.forEach(function (b) { if (b.getBoundingClientRect().top <= line) cur = b.getAttribute('data-toc'); });
    // 一番下まで来たら最後の区画
    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 2 && blocks.length) cur = blocks[blocks.length - 1].getAttribute('data-toc');
    if (cur === now) return;
    now = cur;
    Object.keys(links).forEach(function (k) {
      if (k === cur) links[k].setAttribute('aria-current', 'true'); else links[k].removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
