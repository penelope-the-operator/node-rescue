// Pure game state, with an injectable clock/random source for tests.
export class Game {
  constructor(random = Math.random) { this.random = random; this.running = false; }
  start(now) {
    this.score = 0; this.misses = 0; this.combo = 0;
    this.nodes = Array(9).fill(false); this.end = now + 30000;
    this.next = now; this.running = true; this.tick(now);
  }
  tick(now) {
    if (!this.running) return;
    if (now >= this.end) { this.running = false; return; }
    if (now >= this.next) {
      const healthy = this.nodes.flatMap((bad, i) => bad ? [] : [i]);
      if (healthy.length) this.nodes[healthy[Math.floor(this.random() * healthy.length)]] = true;
      this.next = now + Math.max(360, 850 - this.score * 8);
    }
  }
  repair(index, now) {
    this.tick(now);
    if (!this.running || index < 0 || index >= 9) return;
    if (this.nodes[index]) { this.nodes[index] = false; this.combo++; this.score += 10; }
    else { this.misses++; this.combo = 0; this.score = Math.max(0, this.score - 5); }
  }
  remaining(now) { return Math.max(0, Math.ceil((this.end - now) / 1000)); }
}
