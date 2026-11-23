// 求人の部品。今は見本（すべて例）。後で Caddie から同じ形の配列を出して、ここを置き換える。
// 1 件の形: { id, example, title, company, category, area, salaryMin, salaryMax（万円）, tags[], description, place, holidays }
var JOBS = [
  { id: 'example-1', example: true, title: 'ITサポート（未経験から始める社内ヘルプデスク）', company: '例：IT サービスの会社', category: 'IT', area: '東京都',
    salaryMin: 300, salaryMax: 380, tags: ['人生の選択肢を増やす', '子どもとの時間を大切に'],
    description: '社員の方からのパソコンやアカウントの困りごとに、電話とチャットで答えます。はじめは先輩と一緒に対応し、よくある質問から少しずつ覚えていきます。',
    place: '東京都（例）', holidays: '土日祝休み・年末年始（例）' },
  { id: 'example-2', example: true, title: '法人営業（地域の会社への提案）', company: '例：事務用品の会社', category: '営業', area: '神奈川県',
    salaryMin: 320, salaryMax: 420, tags: ['地元に恩返し', '人生の選択肢を増やす'],
    description: '地域の会社を訪ね、事務用品やオフィスの困りごとを伺って提案します。新しいお客さまより、今のお客さまとの関係づくりが中心です。',
    place: '神奈川県（例）', holidays: '土日休み（例）' },
  { id: 'example-3', example: true, title: '営業事務（チームの受発注を支える）', company: '例：食品の卸の会社', category: '事務', area: '東京都',
    salaryMin: 280, salaryMax: 340, tags: ['子どもとの時間を大切に', '好きなことを仕事に'],
    description: '営業の担当者に代わって、受発注の入力や納期の確認、お客さまからの電話の受け付けを行います。',
    place: '東京都（例）', holidays: '土日祝休み（例）' },
  { id: 'example-4', example: true, title: '店舗スタッフ（将来は店長を目指す）', company: '例：生活雑貨の会社', category: '販売・サービス', area: '大阪府',
    salaryMin: 290, salaryMax: 360, tags: ['30歳で独立', '好きなことを仕事に'],
    description: '接客・品出し・売り場づくりから始め、慣れてきたらアルバイトの方の育成やお店の数字の管理も担当します。',
    place: '大阪府（例）', holidays: 'シフト制・月 9 日休み（例）' },
  { id: 'example-5', example: true, title: 'Web サイトの運用アシスタント', company: '例：Web 制作の会社', category: 'IT', area: '東京都',
    salaryMin: 300, salaryMax: 400, tags: ['旅するように働く', '世界を相手に働く'],
    description: 'お客さまの Web サイトのお知らせの更新や、画像の差し替えなどを担当します。社内の研修で HTML の基本から学べます。',
    place: '東京都（例）', holidays: '土日祝休み（例）' },
  { id: 'example-6', example: true, title: 'カスタマーサポート（電話・メール）', company: '例：通信サービスの会社', category: '販売・サービス', area: 'そのほか',
    salaryMin: 270, salaryMax: 330, tags: ['地元に恩返し', '人生の選択肢を増やす'],
    description: 'サービスを使っている方からのお問い合わせに、電話とメールで答えます。答え方の手引きがあるので、はじめての方も安心です。',
    place: '福岡県（例）', holidays: 'シフト制・週休 2 日（例）' }
];

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
}
function salaryText(j) { return '想定年収 ' + j.salaryMin + '〜' + j.salaryMax + '万円'; }
function tagHtml(t, small) { return '<span class="tag"' + (small ? ' style="height:28px;font-size:12px"' : '') + '>#' + escapeHtml(t) + '</span>'; }

// 求人のカード（一覧・トップの新着で使う 1 つの部品）
function jobCard(j) {
  return '<a class="card line job-card" href="/job.html?id=' + encodeURIComponent(j.id) + '">' +
    (j.example ? '<span class="ex">例</span>' : '') +
    '<div class="job-tags">' + j.tags.map(function (t) { return tagHtml(t, true); }).join('') + '</div>' +
    '<p class="job-title">' + escapeHtml(j.title) + '</p>' +
    '<p class="note" style="margin:0">' + escapeHtml(j.area) + '・' + salaryText(j) + '</p>' +
    '</a>';
}
function renderJobList(el, jobs) { if (el) el.innerHTML = jobs.map(jobCard).join(''); }

// 求人ごとのページ（?id= の求人。無ければ 1 件目）
function renderJobDetail(el, jobs) {
  if (!el) return;
  var id = new URLSearchParams(location.search).get('id');
  var j = jobs.filter(function (x) { return x.id === id; })[0] || jobs[0];
  document.title = j.title + '｜求人の詳細｜ハッシュタグ';
  el.innerHTML =
    '<div class="job-head">' + (j.example ? '<span class="ex">例（見本の求人です）</span>' : '') +
    '<p class="note" style="margin:0">' + escapeHtml(j.company) + '</p>' +
    '<h2>' + escapeHtml(j.title) + '</h2>' +
    '<div class="tag-box">' + j.tags.map(function (t) { return tagHtml(t); }).join('') + '</div></div>' +
    '<dl class="job-dl">' +
    '<dt>仕事内容</dt><dd>' + escapeHtml(j.description) + '</dd>' +
    '<dt>給与</dt><dd>' + salaryText(j) + (j.example ? '（例）' : '') + '</dd>' +
    '<dt>勤務地</dt><dd>' + escapeHtml(j.place) + '</dd>' +
    '<dt>休日・休暇</dt><dd>' + escapeHtml(j.holidays) + '</dd>' +
    '<dt>この仕事のハッシュタグ</dt><dd><div class="tag-box">' + j.tags.map(function (t) { return tagHtml(t, true); }).join('') + '</div></dd>' +
    '</dl>' +
    '<div class="job-cta"><a class="btn btn-main" href="/hashtag/booking.html?from=job" data-booking="job">この求人について相談する</a><a class="btn btn-sub" href="/hashtag/jobs.html">求人一覧へ</a></div>';
}

// 例の求人が 0 件のハッシュタグ：面談でご紹介する旨と「無料でキャリア相談する」（行き先は config.js の BOOKING_URL）
function bookingHref(from) {
  var base = (window.HASHTAG_CONFIG || {}).BOOKING_URL || '/booking.html';
  return base + (base.indexOf('?') >= 0 ? '&' : '?') + 'from=' + encodeURIComponent(from);
}
function noJobsHtml(from) {
  return '<div class="empty card line no-jobs"><p style="margin:0;font-weight:700">このハッシュタグに合う求人は、非公開の求人も含めて面談でご紹介します。</p>' +
    '<p style="margin:16px 0 0"><a class="btn btn-main" href="' + escapeHtml(bookingHref(from)) + '" data-booking="' + escapeHtml(from) + '">無料でキャリア相談する</a></p></div>';
}

// 求人一覧のページ：?tag=○○ があれば、そのハッシュタグの求人だけ出す
function renderJobsPage(el, jobs) {
  var tag = new URLSearchParams(location.search).get('tag');
  var list = tag ? jobs.filter(function (j) { return j.tags.indexOf(tag) >= 0; }) : jobs;
  document.querySelectorAll('.tag-btn[data-tag]').forEach(function (b) {
    var on = b.getAttribute('data-tag') === tag;
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.setAttribute('href', on ? '/hashtag/jobs.html' : '/hashtag/jobs.html?tag=' + encodeURIComponent(b.getAttribute('data-tag')));
  });
  var now = document.getElementById('filter-now');
  if (now && tag) {
    now.hidden = false;
    now.innerHTML = '<span>#' + escapeHtml(tag) + ' の求人（' + list.length + '件）</span><a href="/hashtag/jobs.html">絞り込みを外す</a>';
  }
  if (!list.length) { el.innerHTML = noJobsHtml('jobs-empty'); return; }
  renderJobList(el, list);
}
