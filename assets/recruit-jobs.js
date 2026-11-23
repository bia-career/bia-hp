// 採用ページ（recruit.html）の募集職種。ここ 1 か所だけを直す（多くても 3 件まで出る）。
// あとで Caddie から同じ形の配列を出して、ここを置き換える（形は変えない）。
// 0 件（[]）にすると「現在募集している職種はありません」と出る。
//
// 1 件の形：
// {
//   id:         'ca',                    英字の短い名前（ほかと重ならないもの）
//   title:      'キャリアアドバイザー',     職種名
//   types:      ['中途'],                 '新卒' と '中途' のどちらか、または両方。応募ボタンの行き先が変わる
//   place:      '東京都新宿区',            勤務地
//   employment: '正社員',                 雇用形態
//   salary:     '月給 ○○万円〜',          給与（カードに出す短い形）
//   catch:      '一言',                   カードに出す一言
//   detail: { work: 仕事内容, want: 求める人, salary: 給与（詳しく）, hours: 勤務時間, holidays: 休日, benefits: 福利厚生 }
// }
// 決まっていない所は【仮】のまま、または '—'。
var RECRUIT_JOBS = [
  {
    id: 'ca',
    title: 'キャリアアドバイザー',
    types: ['新卒', '中途'],
    place: '本社オフィス',
    employment: '正社員',
    salary: '【仮】',
    catch: '20 代の人生の分岐点に伴走し、成果で応える仕事',
    detail: { work: '【仮】', want: '【仮】', salary: '【仮】', hours: '【仮】', holidays: '土日祝（年間休日 125 日）', benefits: '【仮】' }
  },
  {
    id: 'ra',
    title: 'リクルーティングアドバイザー',
    types: ['新卒', '中途'],
    place: '本社オフィス',
    employment: '正社員',
    salary: '【仮】',
    catch: '企業の採用に向き合い、事業の成長をつくる仕事',
    detail: { work: '【仮】', want: '【仮】', salary: '【仮】', hours: '【仮】', holidays: '土日祝（年間休日 125 日）', benefits: '【仮】' }
  },
  {
    id: 'webmkt',
    title: 'Web マーケティング',
    types: ['新卒', '中途'],
    place: '本社オフィス',
    employment: '正社員',
    salary: '【仮】',
    catch: 'データと AI で、ハッシュタグの集客を伸ばす仕事',
    detail: { work: '【仮】', want: '【仮】', salary: '【仮】', hours: '【仮】', holidays: '土日祝（年間休日 125 日）', benefits: '【仮】' }
  }
];
