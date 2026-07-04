// 上部: チーム紹介を一定間隔で自動的に切り替える。
// 下部: レース中の順位は常時固定表示し、GitHub上のJSONを定期的に取得して更新する。
const ROSTER_DURATION = 6000; // 各チームの表示時間(ミリ秒)
const RACE_POLL_INTERVAL = 8000; // レース順位の取得間隔(ミリ秒)

const RACE_POSITION_URL =
  'https://raw.githubusercontent.com/Wadeumix/LGT/preraceschedule/data/race-position.json';

const rosterTeamName = document.getElementById('rosterTeamName');
const rosterList = document.getElementById('rosterList');
const raceOrderList = document.getElementById('raceOrderList');

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

function cycleRoster() {
  renderRoster(rosterIndex);
  rosterIndex = (rosterIndex + 1) % ROSTERS.length;
  setTimeout(cycleRoster, ROSTER_DURATION);
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

cycleRoster();
renderRacePositions([]); // 初期表示は準備中
pollRacePositions();
