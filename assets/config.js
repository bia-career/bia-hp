// ホームページの設定（1 か所）。「無料でキャリア相談」の行き先はここだけで変える
// 予約ページ（Caddie の中に作る）ができたら、その URL に書き換える。URL に個人情報は入れない
window.HASHTAG_CONFIG = {
  BOOKING_URL: '/booking.html',

  // LINE の相談の行き先（1 か所）。ホームページ専用の経路（2026-11）
  // リンクに data-line を付けると、ここの URL になる（相談の帯・よくある質問の答えの中）
  LINE_URL: 'https://lin.ee/qq1v7gG',

  // 採用ページ（recruit.html）の「エントリー」の行き先。new＝新卒の方、career＝中途の方
  // 募集職種のカードの「このポジションに応募する」・ヘッダーとスマホの下の「エントリー」も、ここを使う（新しいタブで開く）
  // 今は Google フォーム（新卒・中途とも同じ）。あとで社内システム（人事の機能）に作り替える予定
  RECRUIT_ENTRY_URL: {
    new: 'https://forms.gle/y8prBTsdwqu2tVwK9',
    career: 'https://forms.gle/y8prBTsdwqu2tVwK9'
  },

  // トップのオープニング（DESIGN-SPEC.md 11 章）
  // 'type'  … 空の入力欄に「hashtag」を打ち込み、左上のロゴになって入れ替わる（約 3 秒）
  // 'empty' … 空の入力欄でカーソルが点滅して、画面ごと消える（約 2.2 秒）
  // 'off'   … オープニングを出さない
  INTRO_MODE: 'type',

  // 会社のトップ（/）のオープニング（DESIGN-SPEC.md 16 章）：'type'＝BIA のロゴ → ビジョンを打ち込む → 見出しへ（約 3 秒）／'off'＝出さない
  BIA_INTRO: 'type'
};
