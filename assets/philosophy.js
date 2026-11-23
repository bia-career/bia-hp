// パーパス・ビジョン・ミッション（会社のトップ・会社概要・採用ページに出る）。直すのはここ 1 か所だけ（2026-11 廣瀬さんの決定）
// 並びは「パーパス → ビジョン → ミッション」（なぜ → どこへ → 何を）。見出しは大きく、添える文は小さく
// ページの中の data-philo="purpose" などの所を、ここの文に入れ替える（HTML に書いてある文は JS が動かないとき用）
// - 文の中の改行（\n）は、そのまま改行で出す。文（「。」まで）は途中で改行しない（言葉の途中で切れないように）
// - 配列（purpose-tags）は、線だけの丸長方形のハッシュタグ（.tag）で並べる
// - data-philo-hash が付いた所は「#」をサイトのグラデーションの # にする（大見出しの決まり。DESIGN-SPEC.md 9 章の 2）
// ※ 変えるときは、手で合わせる 3 か所も直す：会社のトップのタブの名前（title・og:title）・会社概要の meta・会社用の OGP の画像（DESIGN-SPEC.md 17 章）
window.BIA_PHILOSOPHY = {
  'purpose': '人生に、#を。',
  'purpose-tags': ['家族と過ごす夕方', '仲間と笑う月曜日', '旅するように働く'],
  'purpose-text': '人生に#があると、働くことは物語になる。',
  'vision': 'Open market, open you.',
  'vision-text': '知らないから、選べなかった。見えないから、あきらめていた。\n市場がひらけば、あなたはもっと遠くへ行ける。',
  'mission': '地図は渡す。背中も押す。旅は、あなたが選ぶ。',
  'mission-text': '求人の裏側も、自分の市場価値も、全部伝える。そのうえで決めるのは、いつもあなた。'
};
(function () {
  var p = window.BIA_PHILOSOPHY;
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  document.querySelectorAll('[data-philo]').forEach(function (el) {
    var v = p[el.getAttribute('data-philo')];
    if (v == null) return;
    if (Array.isArray(v)) { el.innerHTML = v.map(function (t) { return '<span class="tag">#' + esc(t) + '</span>'; }).join(''); return; }
    // 言葉の途中で改行しないように：文（「。」まで）を 1 つずつ .philo-s で包む（文の区切りで改行。CSS は philosophy.css）
    var hash = el.hasAttribute('data-philo-hash');
    el.innerHTML = String(v).split('\n').map(function (line) {
      return (line.match(/[^。]+。?/g) || ['']).map(function (s) {
        var h = esc(s);
        if (hash) h = h.replace(/#/g, '<span class="g-hash">#</span>');
        return '<span class="philo-s">' + h + '</span>';
      }).join('');
    }).join('<br>');
  });
})();
