import { Game } from './game.js';
const game = new Game();
const $ = id => document.getElementById(id);
let best = 0;
try { best = Number(localStorage.getItem('node-rescue-best')) || 0; } catch {}
$('best').textContent = best;
const buttons = Array.from({length: 9}, (_, i) => {
  const b = document.createElement('button'); b.className = 'node';
  b.addEventListener('click', () => repair(i)); $('grid').append(b); return b;
});
function render() {
  buttons.forEach((b, i) => {
    const bad = game.running && game.nodes[i];
    b.classList.toggle('bad', Boolean(bad)); b.disabled = !game.running;
    b.textContent = `${i + 1} / worker-${i + 1}\n${bad ? 'NotReady → 復旧' : 'Ready'}`;
    b.setAttribute('aria-label', `worker-${i + 1}: ${bad ? 'NotReady、復旧する' : 'Ready'}`);
  });
  $('time').textContent = game.running ? game.remaining(performance.now()) : (game.end ? 0 : 30);
  $('score').textContent = game.score || 0;
}
function repair(i) { const active = game.running; game.repair(i, performance.now()); if (active && !game.running) finish(); render(); }
$('start').addEventListener('click', () => {
  game.start(performance.now()); $('start').disabled = true;
  $('status').textContent = '対応中。赤いノードを復旧しろ。'; render();
});
document.addEventListener('keydown', e => {
  if (!e.repeat && !e.ctrlKey && !e.metaKey && !e.altKey && /^[1-9]$/.test(e.key)) { e.preventDefault(); repair(Number(e.key) - 1); }
});
setInterval(() => {
  const wasRunning = game.running; game.tick(performance.now());
  if (wasRunning && !game.running) {
    finish();
  }
  render();
}, 100);
render();

function finish() {
    best = Math.max(best, game.score); $('best').textContent = best;
    try { localStorage.setItem('node-rescue-best', String(best)); } catch {}
    $('status').textContent = `対応終了。${game.score}点 / 誤操作 ${game.misses}回。`;
    $('start').disabled = false; $('start').textContent = 'RETRY / もう一度';
}
