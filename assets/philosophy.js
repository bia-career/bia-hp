// パーパス・ミッション・ビジョン（会社のトップ・採用ページの両方に出る）。直すのはここ 1 か所だけ
// ページの中の data-philo="purpose" などの文字を、ここの文に入れ替える（HTML に書いてある文は JS が動かないとき用）
// 2026-11 時点では「仮。あとで調整」（docs/HANDOFF.md）
window.BIA_PHILOSOPHY = {
  'purpose': '若者のポテンシャルを解放する。',
  'purpose-en': 'Unleash the potential of youth.',
  'mission': '一人ひとりの「叶えたい未来」を言葉にし、そこへ近づくキャリアを一緒につくる。',
  'vision': '20 代が「自分の #」で仕事を選ぶのが、当たり前の社会へ。'
};
(function () {
  var p = window.BIA_PHILOSOPHY;
  document.querySelectorAll('[data-philo]').forEach(function (el) {
    var t = p[el.getAttribute('data-philo')];
    if (t) el.textContent = t;
  });
})();
