import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Game } from '../web/game.js';
test('starts with one failing node; repair awards ten', () => {
 const g = new Game(() => 0); g.start(0); assert.equal(g.nodes[0], true);
 g.repair(0, 1); assert.equal(g.score, 10); assert.equal(g.nodes[0], false);
});
test('misclick penalizes without negative score', () => {
 const g = new Game(() => 0); g.start(0); g.repair(1, 1);
 assert.equal(g.score, 0); assert.equal(g.misses, 1);
});
test('deadline blocks late repair and restart resets all state', () => {
 const g = new Game(() => 0); g.start(0); g.repair(0, 30000);
 assert.equal(g.score, 0); assert.equal(g.running, false);
 g.start(40000); assert.equal(g.remaining(40000), 30); assert.equal(g.misses, 0); assert.equal(g.running, true);
});
test('full grid does not overflow; expired clock stays at zero', () => {
 const g = new Game(() => 0); g.start(0);
 for(let t=1000; t<=10000; t+=1000) g.tick(t);
 assert.equal(g.nodes.filter(Boolean).length, 9); assert.equal(g.remaining(99999), 0);
});
