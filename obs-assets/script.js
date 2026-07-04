// パネルの自動切り替え(リーダーボード → チーム名簿を順番にループ)
// 表示時間はここで調整できます(ミリ秒)。
const LEADERBOARD_DURATION = 8000;
const ROSTER_DURATION = 6000;

const panelLabel = document.getElementById('panelLabel');
const panelLeaderboard = document.getElementById('panel-leaderboard');
const panelRoster = document.getElementById('panel-roster');
const leaderboardBody = document.getElementById('leaderboardBody');
const rosterTeamName = document.getElementById('rosterTeamName');
const rosterList = document.getElementById('rosterList');

function renderLeaderboard() {
  leaderboardBody.innerHTML = LEADERBOARD.map((row) => `
    <tr class="rank-${row.rank}">
      <td class="col-rank">${row.rank}</td>
      <td class="col-team">${row.team}</td>
      <td class="col-pts">${row.sp} SP</td>
    </tr>
  `).join('');
}

function renderRoster(rosterIndex) {
  const roster = ROSTERS[rosterIndex];
  rosterTeamName.textContent = roster.team;
  rosterList.innerHTML = roster.members.map((m) => `
    <li>
      <span class="role-tag${m.role === 'CREW' ? ' crew' : ''}">${m.role}</span>
      <span>${m.name}</span>
    </li>
  `).join('');
}

let rosterIndex = 0;

function showLeaderboard() {
  panelLabel.textContent = 'LEADERBOARD';
  renderLeaderboard();
  panelLeaderboard.classList.add('is-active');
  panelRoster.classList.remove('is-active');
  setTimeout(showRoster, LEADERBOARD_DURATION);
}

function showRoster() {
  panelLabel.textContent = 'TEAM ROSTER';
  renderRoster(rosterIndex);
  panelRoster.classList.add('is-active');
  panelLeaderboard.classList.remove('is-active');

  rosterIndex = (rosterIndex + 1) % ROSTERS.length;

  // 全チーム分ローテーションし終えたらリーダーボードへ戻る。
  if (rosterIndex === 0) {
    setTimeout(showLeaderboard, ROSTER_DURATION);
  } else {
    setTimeout(showRoster, ROSTER_DURATION);
  }
}

showLeaderboard();
