// ここを編集して表示内容を更新してください。
// このファイルだけを差し替えれば、レイアウト(HTML/CSS)には触れずに内容更新できます。

// --- 上部: チーム紹介(自動的に順番に切り替わります) ---
const ROSTERS = [
  {
    team: 'TEAM ALPHA',
    members: [
      { name: '選手A-1', role: 'DRIVER' },
      { name: '選手A-2', role: 'DRIVER' },
      { name: 'メカA', role: 'CREW' },
    ],
  },
  {
    team: 'TEAM BRAVO',
    members: [
      { name: '選手B-1', role: 'DRIVER' },
      { name: '選手B-2', role: 'DRIVER' },
      { name: 'メカB', role: 'CREW' },
    ],
  },
];

// --- 下部: レース中の順位(常時固定表示) ---
// 順位情報は後ほど構築予定。準備ができ次第、以下のような配列に差し替えてください。
// 例:
// const RACE_POSITIONS = [
//   { pos: 1, team: 'TEAM ALPHA', gap: '' },
//   { pos: 2, team: 'TEAM BRAVO', gap: '+1.2s' },
//   { pos: 3, team: 'TEAM CHARLIE', gap: '+4.8s' },
// ];
const RACE_POSITIONS = [];
