// 上部: チーム紹介を一定間隔で自動的に切り替える(data/roster.jsonを定期取得)。
// 下部: レース中の順位は常時固定表示し、data/race-position.jsonを定期取得する。
const ROSTER_DURATION = 6000; // 各チームの表示時間(ミリ秒)
const ROSTER_POLL_INTERVAL = 15000; // チーム紹介データの取得間隔(ミリ秒)
const RACE_POLL_INTERVAL = 8000; // レース順位の取得間隔(ミリ秒)

const BASE_URL = 'https://raw.githubusercontent.com/Wadeumix/LGT/preraceschedule/data';
const ROSTER_URL = `${BASE_URL}/roster.json`;
const RACE_POSITION_URL = `${BASE_URL}/race-position.json`;

const rosterTeamName = document.getElementById('rosterTeamName');
const rosterList = document.getElementById('rosterList');
const raceOrderList = document.getElementById('raceOrderList');

let teams = []; // data/roster.jsonから取得したチーム一覧
let rosterIndex = 0;

function renderRoster() {
  if (!teams.length) {
    rosterTeamName.textContent = '';
    rosterList.innerHTML = '<li class="placeholder">チーム情報は準備中です</li>';
    return;
  }
  const team = teams[rosterIndex % teams.length];
  rosterTeamName.textContent = team.team;
  rosterList.innerHTML = (team.members || []).map((m) => `
    <li>
      <span class="role-tag${m.role === 'CREW' ? ' crew' : ''}">${m.role}</span>
      <span>${m.name}</span>
    </li>
  `).join('');
}

function cycleRoster() {
  renderRoster();
  rosterIndex = (rosterIndex + 1) % (teams.length || 1);
  setTimeout(cycleRoster, ROSTER_DURATION);
}

async function pollRoster() {
  try {
    const res = await fetch(`${ROSTER_URL}?t=${Date.now()}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      teams = data.teams || [];
    }
  } catch (err) {
    console.error('roster fetch failed', err);
  } finally {
    setTimeout(pollRoster, ROSTER_POLL_INTERVAL);
  }
}

function renderRacePositions(positions) {
  if (!positions || !positions.length) {
    raceOrderList.innerHTML = '<li class="placeholder">順位情報は準備中です</li>';
    return;
  }
  raceOrderList.innerHTML = positions.map((row) => `
    <li class="p${row.pos}">
      <span class="pos">${row.pos}</span>
      <span class="team-name">${row.team}</span>
      <span class="gap">${row.gap || ''}</span>
    </li>
  `).join('');
}

async function pollRacePositions() {
  try {
    const res = await fetch(`${RACE_POSITION_URL}?t=${Date.now()}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      renderRacePositions(data.positions);
    }
  } catch (err) {
    console.error('race position fetch failed', err);
  } finally {
    setTimeout(pollRacePositions, RACE_POLL_INTERVAL);
  }
}

renderRoster(); // 初期表示は準備中
renderRacePositions([]); // 初期表示は準備中
cycleRoster();
pollRoster();
pollRacePositions();
