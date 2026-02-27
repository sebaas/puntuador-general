const MIN_PLAYERS = 2;
const MAX_PLAYERS = 40;

const config = {
  playerCount: 2,
  pointing: 'add1',     // 'add1' | 'addx'
  display: 'number',    // 'number' | 'box'  (add1 sub-option)
  negative: 'positive', // 'positive' | 'both'  (addx sub-option)
  targetPoints: 30,
  useTarget: false,
  useHalfTarget: false,
};

// Screens
const screenHome    = document.getElementById('screen-home');
const screenConfig  = document.getElementById('screen-config');
const screenPlayers = document.getElementById('screen-players');
const screenGame    = document.getElementById('screen-game');
const screenHistory = document.getElementById('screen-history');

// Home
const btnStart = document.getElementById('btn-start');

// Config
const btnBack       = document.getElementById('btn-back');
const btnDecrease   = document.getElementById('btn-decrease');
const btnIncrease   = document.getElementById('btn-increase');
const playerCountEl = document.getElementById('player-count');
const btnContinue   = document.getElementById('btn-continue');
const optDisplay    = document.getElementById('opt-display');
const optNegative   = document.getElementById('opt-negative');

function showScreen(screen) {
  [screenHome, screenConfig, screenPlayers, screenGame, screenHistory].forEach(s => s.classList.add('hidden'));
  screen.classList.remove('hidden');
}

function updateStepper() {
  playerCountEl.textContent = config.playerCount;
  btnDecrease.disabled = config.playerCount <= MIN_PLAYERS;
  btnIncrease.disabled = config.playerCount >= MAX_PLAYERS;
}

function updatePointingSubOptions() {
  const isAdd1 = config.pointing === 'add1';
  // Add 1: disable "+ & −"; Add X: disable "Box"
  document.querySelector('#opt-negative .seg-btn[data-value="both"]').disabled = isAdd1;
  document.querySelector('#opt-display .seg-btn[data-value="box"]').disabled = !isAdd1;
  // Reset any now-disabled active selection back to its allowed default
  if (isAdd1 && config.negative === 'both') {
    config.negative = 'positive';
    resetSegControl('#opt-negative', 'positive');
  }
  if (!isAdd1 && config.display === 'box') {
    config.display = 'number';
    resetSegControl('#opt-display', 'number');
  }
}

function bindSegControl(containerSelector, configKey) {
  document.querySelectorAll(`${containerSelector} .seg-btn`).forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll(`${containerSelector} .seg-btn`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      config[configKey] = btn.dataset.value;
      if (configKey === 'pointing') updatePointingSubOptions();
    });
  });
}

const PRESET_SECTIONS = ['opt-pointing', 'opt-display', 'opt-negative', 'opt-target', 'opt-half-target'];

function setConfigPresetMode(isPreset) {
  PRESET_SECTIONS.forEach(id => document.getElementById(id).classList.toggle('hidden', isPreset));
}

btnStart.addEventListener('click', () => {
  config.playerCount  = 2;
  config.pointing     = 'add1';
  config.display      = 'number';
  config.negative     = 'positive';
  config.targetPoints = 30;
  config.useTarget = false;
  config.useHalfTarget = false;
  document.getElementById('input-target').value = 30;
  document.getElementById('input-target').classList.add('hidden');
  document.querySelector('#opt-half-target .seg-btn[data-value="on"]').disabled = true;
  updateStepper();
  updatePointingSubOptions();
  // Reset seg controls to default active states
  resetSegControl('#opt-pointing', 'add1');
  resetSegControl('#opt-display', 'number');
  resetSegControl('#opt-negative', 'positive');
  resetSegControl('#opt-target', 'none');
  resetSegControl('#opt-half-target', 'off');
  setConfigPresetMode(false);
  showScreen(screenConfig);
});

function resetSegControl(selector, activeValue) {
  document.querySelectorAll(`${selector} .seg-btn`).forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === activeValue);
  });
}

btnBack.addEventListener('click', () => showScreen(screenHome));

btnDecrease.addEventListener('click', () => {
  if (config.playerCount > MIN_PLAYERS) { config.playerCount--; updateStepper(); }
});

btnIncrease.addEventListener('click', () => {
  if (config.playerCount < MAX_PLAYERS) { config.playerCount++; updateStepper(); }
});

bindSegControl('#opt-pointing', 'pointing');
bindSegControl('#opt-display', 'display');
bindSegControl('#opt-negative', 'negative');

// Target points toggle
document.querySelectorAll('#opt-target .seg-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#opt-target .seg-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    config.useTarget = btn.dataset.value === 'custom';
    document.getElementById('input-target').classList.toggle('hidden', !config.useTarget);
    document.querySelector('#opt-half-target .seg-btn[data-value="on"]').disabled = !config.useTarget;
    if (!config.useTarget) {
      config.useHalfTarget = false;
      resetSegControl('#opt-half-target', 'off');
    }
  });
});

// Half target toggle
document.querySelectorAll('#opt-half-target .seg-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#opt-half-target .seg-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    config.useHalfTarget = btn.dataset.value === 'on';
  });
});

// Players screen
const playersList       = document.getElementById('players-list');
const btnBackPlayers    = document.getElementById('btn-back-players');
const btnStartGame      = document.getElementById('btn-start-game');
let playersBackScreen   = screenConfig;

function buildPlayersScreen() {
  const defaults = config.playerCount === 2 ? ['Nos', 'Ellos'] : null;
  playersList.innerHTML = '';
  for (let i = 0; i < config.playerCount; i++) {
    const defaultName = defaults ? defaults[i] : `Player ${i + 1}`;
    const row = document.createElement('div');
    row.className = 'player-row';
    row.innerHTML = `
      <span class="player-index">${i + 1}</span>
      <input class="player-input" type="text" value="${defaultName}" maxlength="24" />
    `;
    playersList.appendChild(row);
  }
}

btnContinue.addEventListener('click', () => {
  playersBackScreen = screenConfig;
  buildPlayersScreen();
  showScreen(screenPlayers);
});

btnBackPlayers.addEventListener('click', () => showScreen(playersBackScreen));

document.getElementById('btn-truco').addEventListener('click', () => {
  config.playerCount  = 2;
  config.pointing     = 'add1';
  config.display      = 'box';
  config.negative     = 'positive';
  config.targetPoints = 30;
  config.useTarget    = true;
  config.useHalfTarget = true;
  playersBackScreen   = screenHome;
  buildPlayersScreen();
  showScreen(screenPlayers);
});

document.getElementById('btn-flip7').addEventListener('click', () => {
  config.playerCount   = 2;
  config.pointing      = 'addx';
  config.display       = 'number';
  config.negative      = 'positive';
  config.targetPoints  = 200;
  config.useTarget     = true;
  config.useHalfTarget = true;
  document.getElementById('input-target').value = 200;
  document.getElementById('input-target').classList.remove('hidden');
  document.querySelector('#opt-half-target .seg-btn[data-value="on"]').disabled = false;
  updateStepper();
  updatePointingSubOptions();
  resetSegControl('#opt-pointing', 'addx');
  resetSegControl('#opt-display', 'number');
  resetSegControl('#opt-negative', 'positive');
  resetSegControl('#opt-target', 'custom');
  resetSegControl('#opt-half-target', 'on');
  setConfigPresetMode(true);
  showScreen(screenConfig);
});

document.getElementById('btn-sushigo').addEventListener('click', () => {
  config.playerCount   = 2;
  config.pointing      = 'addx';
  config.display       = 'number';
  config.negative      = 'both';
  config.targetPoints  = 30;
  config.useTarget     = false;
  config.useHalfTarget = false;
  document.getElementById('input-target').value = 30;
  document.getElementById('input-target').classList.add('hidden');
  document.querySelector('#opt-half-target .seg-btn[data-value="on"]').disabled = true;
  updateStepper();
  updatePointingSubOptions();
  resetSegControl('#opt-pointing', 'addx');
  resetSegControl('#opt-display', 'number');
  resetSegControl('#opt-negative', 'both');
  resetSegControl('#opt-target', 'none');
  resetSegControl('#opt-half-target', 'off');
  setConfigPresetMode(true);
  showScreen(screenConfig);
});

document.getElementById('btn-nothanks').addEventListener('click', () => {
  config.playerCount   = 2;
  config.pointing      = 'addx';
  config.display       = 'number';
  config.negative      = 'positive';
  config.targetPoints  = 30;
  config.useTarget     = false;
  config.useHalfTarget = false;
  document.getElementById('input-target').value = 30;
  document.getElementById('input-target').classList.add('hidden');
  document.querySelector('#opt-half-target .seg-btn[data-value="on"]').disabled = true;
  updateStepper();
  updatePointingSubOptions();
  resetSegControl('#opt-pointing', 'addx');
  resetSegControl('#opt-display', 'number');
  resetSegControl('#opt-negative', 'positive');
  resetSegControl('#opt-target', 'none');
  resetSegControl('#opt-half-target', 'off');
  setConfigPresetMode(true);
  showScreen(screenConfig);
});

btnStartGame.addEventListener('click', () => {
  config.playerNames = [...playersList.querySelectorAll('.player-input')]
    .map(inp => inp.value.trim() || inp.placeholder);
  buildGameScreen();
  showScreen(screenGame);
});

// ── Game screen ───────────────────────────────────────────────
const gameGrid = document.getElementById('game-grid');

let scores = [];
let pendingPlayerIndex = -1;

// History log: [{ playerIndex, name, delta, total }]
let gameHistory = [];

// Pending add-1 group: { playerIndex, delta, timerId }
let pendingAdd1 = null;

const GROUP_TIMEOUT_MS = 10000;

function flushPendingAdd1() {
  if (!pendingAdd1) return;
  clearTimeout(pendingAdd1.timerId);
  const i = pendingAdd1.playerIndex;
  gameHistory.push({
    playerIndex: i,
    name:        config.playerNames[i],
    delta:       pendingAdd1.delta,
    total:       scores[i],
  });
  pendingAdd1 = null;
  updateUndoBtn(i);
}

function logHistoryEntry(playerIndex, delta) {
  gameHistory.push({
    playerIndex,
    name:  config.playerNames[playerIndex],
    delta,
    total: scores[playerIndex],
  });
}

// Draws one tally group (1–5 strokes) as an SVG square built clockwise,
// with a diagonal for the 5th stroke.
function tallyGroupSVG(n) {
  // viewBox: 40×40, drawing area padded to 32×32 inside
  const [x0, y0, x1, y1] = [4, 4, 36, 36];
  const strokes = [
    `<line x1="${x0}" y1="${y1}" x2="${x0}" y2="${y0}"/>`,  // 1 left  ↑
    `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}"/>`,  // 2 top   →
    `<line x1="${x1}" y1="${y0}" x2="${x1}" y2="${y1}"/>`,  // 3 right ↓
    `<line x1="${x1}" y1="${y1}" x2="${x0}" y2="${y1}"/>`,  // 4 bottom←
    `<line x1="${x0}" y1="${y1}" x2="${x1}" y2="${y0}"/>`,  // 5 diag  ↗
  ];
  const lines = strokes.slice(0, n).join('');
  return `<svg class="tally-svg" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <g stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none">${lines}</g>
  </svg>`;
}

function renderScore(score) {
  if (config.display === 'box') {
    if (score <= 0) return '<span class="score-zero">0</span>';
    const full = Math.floor(score / 5);
    const rem  = score % 5;
    const halfGroups = (config.useTarget && config.useHalfTarget)
      ? Math.floor(config.targetPoints / 2 / 5)
      : 0;
    let html = '<div class="score-boxes">';
    let lineAdded = false;
    for (let i = 0; i < full; i++) {
      if (halfGroups > 0 && !lineAdded && i === halfGroups) {
        html += '<div class="half-target-line"></div>';
        lineAdded = true;
      }
      html += `<span class="tally-group">${tallyGroupSVG(5)}</span>`;
    }
    if (halfGroups > 0 && !lineAdded && full >= halfGroups) {
      html += '<div class="half-target-line"></div>';
    }
    if (rem > 0) html += `<span class="tally-group">${tallyGroupSVG(rem)}</span>`;
    html += '</div>';
    return html;
  }
  return `<span class="score-number${score < 0 ? ' negative' : ''}">${score}</span>`;
}

function checkHighlight(i) {
  const col = document.querySelector(`.player-col[data-col="${i}"]`);
  if (!col) return;
  col.classList.toggle('reached', config.useTarget && scores[i] >= config.targetPoints);
}

function checkHalfHighlight(i) {
  const col = document.querySelector(`.player-col[data-col="${i}"]`);
  if (!col) return;
  const half = Math.floor(config.targetPoints / 2);
  col.classList.toggle('half-reached',
    config.useTarget && config.useHalfTarget &&
    scores[i] >= half && scores[i] < config.targetPoints
  );
}

function updateUndoBtn(i) {
  const btn = document.querySelector(`.player-col[data-col="${i}"] .btn-undo`);
  if (!btn) return;
  const hasPending = pendingAdd1?.playerIndex === i;
  const hasHistory = gameHistory.some(e => e.playerIndex === i);
  btn.disabled = !hasPending && !hasHistory;
}

function undoPlayer(i) {
  // Pending (not yet flushed) takes priority
  if (pendingAdd1 && pendingAdd1.playerIndex === i) {
    clearTimeout(pendingAdd1.timerId);
    scores[i] -= pendingAdd1.delta;
    pendingAdd1 = null;
    updateScore(i);
    return;
  }
  // Find the last history entry for this player
  let lastIdx = -1;
  for (let j = gameHistory.length - 1; j >= 0; j--) {
    if (gameHistory[j].playerIndex === i) { lastIdx = j; break; }
  }
  if (lastIdx === -1) return;
  scores[i] -= gameHistory[lastIdx].delta;
  gameHistory.splice(lastIdx, 1);
  updateScore(i);
}

function getRanks() {
  const sorted = [...scores].sort((a, b) => b - a);
  return scores.map(s => sorted.indexOf(s) + 1);
}

function updateRanks() {
  const ranks = getRanks();
  ranks.forEach((rank, i) => {
    const el = document.getElementById(`rank-${i}`);
    if (el) el.textContent = `#${rank}`;
  });
}

function updateScore(i) {
  document.getElementById(`score-area-${i}`).innerHTML = renderScore(scores[i]);
  checkHighlight(i);
  checkHalfHighlight(i);
  updateUndoBtn(i);
  updateRanks();
}

function buildGameScreen() {
  config.targetPoints = parseInt(document.getElementById('input-target').value) || 60;
  scores = new Array(config.playerCount).fill(0);
  gameHistory = [];
  if (pendingAdd1) { clearTimeout(pendingAdd1.timerId); pendingAdd1 = null; }
  gameGrid.style.gridTemplateColumns = `repeat(${config.playerCount}, 1fr)`;
  gameGrid.innerHTML = '';

  config.playerNames.forEach((name, i) => {
    const col = document.createElement('div');
    col.className = 'player-col';
    col.dataset.col = i;
    const showMinus = config.pointing === 'add1';
    col.innerHTML = `
      <div class="player-header" data-index="${i}">
        <button class="btn-minus" data-minus="${i}" style="${showMinus ? '' : 'visibility:hidden'}">−1</button>
        <span class="header-name">${name}</span>
        <span class="player-rank" id="rank-${i}">#1</span>
        <button class="btn-undo" data-undo="${i}" disabled title="Undo last action">↩</button>
      </div>
      <div class="player-score-area" id="score-area-${i}">${renderScore(0)}</div>
    `;
    gameGrid.appendChild(col);
  });

  gameGrid.querySelectorAll('.btn-minus').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const i = parseInt(btn.dataset.minus);
      scores[i]--;
      logHistoryEntry(i, -1);
      updateScore(i);
    });
  });

  gameGrid.querySelectorAll('.btn-undo').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      undoPlayer(parseInt(btn.dataset.undo));
    });
  });

  gameGrid.querySelectorAll('.player-col').forEach(col => {
    col.addEventListener('click', () => {
      const i = parseInt(col.dataset.col);
      if (config.pointing === 'add1') {
        scores[i]++;
        // Set up pendingAdd1 before updateScore so updateUndoBtn sees it
        if (pendingAdd1 && pendingAdd1.playerIndex === i) {
          clearTimeout(pendingAdd1.timerId);
          pendingAdd1.delta++;
        } else {
          flushPendingAdd1();
          pendingAdd1 = { playerIndex: i, delta: 1, timerId: null };
        }
        pendingAdd1.timerId = setTimeout(flushPendingAdd1, GROUP_TIMEOUT_MS);
        updateScore(i);
        const header = col.querySelector('.player-header');
        header.classList.add('flash');
        header.addEventListener('animationend', () => header.classList.remove('flash'), { once: true });
      } else {
        openModal(i);
      }
    });
  });

  updateRanks();
}

// ── Add X modal ───────────────────────────────────────────────
const modalOverlay  = document.getElementById('modal-addx');
const modalLabel    = document.getElementById('modal-label');
const modalInput    = document.getElementById('modal-input');
const modalCancel   = document.getElementById('modal-cancel');
const modalSubtract = document.getElementById('modal-subtract');
const modalConfirm  = document.getElementById('modal-addx-confirm');

function openModal(i) {
  pendingPlayerIndex = i;
  modalLabel.textContent = config.playerNames[i];
  modalInput.value = '';
  modalInput.placeholder = 'e.g. 5';
  const bothAllowed = config.negative === 'both';
  modalSubtract.classList.toggle('hidden', !bothAllowed);
  modalConfirm.textContent = bothAllowed ? '+' : 'Add';
  modalOverlay.classList.remove('hidden');
  modalInput.focus();
}

function closeModal() {
  modalOverlay.classList.add('hidden');
}

function confirmModal(sign) {
  const val = parseFloat(modalInput.value);
  if (isNaN(val) || val === 0) { closeModal(); return; }
  const delta = sign * Math.abs(val);
  scores[pendingPlayerIndex] += delta;
  logHistoryEntry(pendingPlayerIndex, delta);
  updateScore(pendingPlayerIndex);
  closeModal();
}

modalCancel.addEventListener('click', closeModal);
modalSubtract.addEventListener('click', () => confirmModal(-1));
modalConfirm.addEventListener('click', () => confirmModal(1));
modalInput.addEventListener('keydown', e => { if (e.key === 'Enter') confirmModal(1); });
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

// ── Restart & History ─────────────────────────────────────────
const modalConfirmRestart = document.getElementById('modal-confirm');
const btnRestart          = document.getElementById('btn-restart');
const btnHistory          = document.getElementById('btn-history');

btnRestart.addEventListener('click', () => {
  modalConfirmRestart.classList.remove('hidden');
});

document.getElementById('confirm-cancel').addEventListener('click', () => {
  modalConfirmRestart.classList.add('hidden');
});

document.getElementById('confirm-ok').addEventListener('click', () => {
  modalConfirmRestart.classList.add('hidden');
  showScreen(screenHome);
});

modalConfirmRestart.addEventListener('click', e => {
  if (e.target === modalConfirmRestart) modalConfirmRestart.classList.add('hidden');
});

// ── History screen ────────────────────────────────────────────
const historyList     = document.getElementById('history-list');
const btnBackHistory  = document.getElementById('btn-back-history');

function buildHistoryScreen() {
  // Flush any pending add-1 group so history is complete
  flushPendingAdd1();

  historyList.innerHTML = '<div class="history-start">Game start</div>';

  gameHistory.forEach(entry => {
    const sign = entry.delta > 0 ? '+' : '';
    const row  = document.createElement('div');
    row.className = 'history-entry';
    row.innerHTML = `
      <span class="history-name">${entry.name}</span>
      <span class="history-delta">${sign}${entry.delta}</span>
      <span class="history-total">(${entry.total})</span>
    `;
    historyList.appendChild(row);
  });

  if (gameHistory.length === 0) {
    historyList.insertAdjacentHTML('beforeend', '<div class="history-empty">No points yet</div>');
  }
}

btnHistory.addEventListener('click', () => {
  buildHistoryScreen();
  showScreen(screenHistory);
});

btnBackHistory.addEventListener('click', () => showScreen(screenGame));

// ── Finish game ───────────────────────────────────────────────
const modalWinner   = document.getElementById('modal-winner');
const winnerTitle   = document.getElementById('winner-title');
const winnerNames   = document.getElementById('winner-names');
const btnFinish     = document.getElementById('btn-finish');

btnFinish.addEventListener('click', () => {
  flushPendingAdd1();

  const maxScore = Math.max(...scores);
  const winners  = config.playerNames.filter((_, i) => scores[i] === maxScore);

  if (winners.length === 1) {
    winnerTitle.textContent = 'Winner!';
    winnerNames.textContent = `${winners[0]}  —  ${maxScore} pts`;
  } else {
    winnerTitle.textContent = "It's a tie!";
    winnerNames.textContent = `${winners.join(', ')}  —  ${maxScore} pts`;
  }

  modalWinner.classList.remove('hidden');
});

document.getElementById('winner-return').addEventListener('click', () => {
  modalWinner.classList.add('hidden');
});

document.getElementById('winner-restart').addEventListener('click', () => {
  modalWinner.classList.add('hidden');
  showScreen(screenHome);
});

modalWinner.addEventListener('click', e => {
  if (e.target === modalWinner) modalWinner.classList.add('hidden');
});
