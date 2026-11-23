# ハッシュタグ（#hashtag）ホームページ

新卒・20代の転職支援サービス「ハッシュタグ」と、運営会社（株式会社ビア）のホームページ。
Caddie（社内の CRM）とは別のリポジトリ・別の Netlify サイト。Caddie の本番・DB には触らない。

| ページ | ファイル |
|---|---|
| トップ | `index.html` |
| ハッシュタグとは | `about.html` |
| 求人一覧（見本） | `jobs.html` |
| 求人ごと（見本。`job.html?id=…`） | `job.html` |
| よくある質問 | `faq.html` |
| 企業の方へ（BIA） | `corp.html` |
| 運営会社（BIA） | `company.html` |
| 採用情報（BIA） | `recruit.html`（募集職種は `assets/recruit-jobs.js`） |
| エントリー（準備中） | `entry.html` |
| コラム（準備中） | `column.html` |
| プライバシーポリシー（`/privacy` で開く。今の bia-career.com/privacy の文章のまま） | `privacy.html` |

- `assets/site.css` … 全ページの見た目（index.html と同じ部品）。`assets/site.js` … メニュー（≡・その他）
- `assets/jobs.js` … 求人の部品。`JOBS` の配列（今はすべて例）からカードと求人ページを描く。後で Caddie から同じ形で出す
- `assets/` … 画像（波・イラスト・アイコン・ロゴ・OGP・ファビコン）。`assets/logo/` は #hashtag のロゴの SVG（「hashtag」は JetBrains Mono 500 の輪郭）。`assets/fonts/` はロゴ用のフォント（JetBrains Mono 500・latin）とライセンス（OFL）
- `sitemap.xml` … 切り替えたあとの住所（https://bia-career.com/…）で書いてある。`robots.txt` は仮の公開の間 Disallow のまま
- 「無料でキャリア相談」の行き先は未定（今は `#`）
- 今は **仮の公開**：`robots.txt` と `netlify.toml` の `X-Robots-Tag` で検索に出さない

## Netlify の新しいサイトにつなぐ（はじめの 1 回だけ）

1. https://app.netlify.com を開く →「Add new project」（または「Add new site」）→「Import an existing project」
2. 「GitHub」を押す → 許可の画面が出たら、`bia-career/bia-hp` を選べるようにする
3. リポジトリの一覧から `bia-hp` を選ぶ
4. 設定の画面
   - Branch to deploy：`main`
   - Base directory：空のまま
   - Build command：空のまま
   - Publish directory：`.`（netlify.toml と同じ）
5. 「Deploy」を押す → 1〜2 分で `https://（ランダムな名前）.netlify.app` ができる
6. 名前を変える：「Project configuration」→「Change project name」→ 例 `bia-hp` → `https://bia-hp.netlify.app`
7. スマホでもこの URL を開いて確かめる

- main に push するたびに、Netlify が自動で公開する（GitHub Actions は使わない）
- PR を出すと、Netlify が下書き用の URL（Deploy Preview）を作る
- フォームの送信はまだどこにもつないでいない

## bia-career.com への切り替え（あとで。廣瀬さんの OK のあと）

手順は別に書く（お名前.com の DNS。MX・TXT は触らない）。切り替えるときに `robots.txt` と `netlify.toml` の noindex を外す。
