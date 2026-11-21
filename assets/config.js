// ホームページの設定（1 か所）。「無料でキャリア相談」の行き先はここだけで変える
// 予約ページ（Caddie の中に作る）ができたら、その URL に書き換える。URL に個人情報は入れない
window.HASHTAG_CONFIG = {
  BOOKING_URL: '/booking.html',

  // 採用ページ（recruit.html）の「エントリー」の行き先。new＝新卒の方、career＝中途の方
  // 募集職種のカードの「このポジションに応募する」も、ここを使う。今は準備中のページ（entry.html）
  RECRUIT_ENTRY_URL: {
    new: '/entry.html?type=new',
    career: '/entry.html?type=career'
  },

  // トップのオープニング（DESIGN-SPEC.md 11 章）
  // 'type'  … 空の入力欄に「hashtag」を打ち込み、左上のロゴになって入れ替わる（約 3 秒）
  // 'empty' … 空の入力欄でカーソルが点滅して、画面ごと消える（約 2.2 秒）
  // 'off'   … オープニングを出さない
  INTRO_MODE: 'type'
};
