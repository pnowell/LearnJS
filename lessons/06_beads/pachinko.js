export {
  maxBeads,
  maxBeadsPerSecond,
  initializePegs,
  createPeg,
  shouldDeletePeg,
  createBead,
  updateBead,
  collideBead
};

import { V2 } from '/LearnJS/common/v2.js';
import { Circle } from '/LearnJS/common/circle.js';
import { Bead } from './bead.js';

const pegRadius = 10;
const numRows = 5;
const pegSpacing = 400 / (numRows + 2);
const beadRadius = 2;
const maxRandBeadXVel = 10;
const maxRandBeadYVel = 10;
const gravity = new V2(0, 70);
const beadElasticity = 0.15;

function maxBeads() {
  return 10;
}

function maxBeadsPerSecond() {
  return 4;
}

function initializePegs() {
  let pegs = [];
  for (let i = 1; i <= numRows; i++) {
    let y = 400 / (numRows + 1) * i;
    let startX = 200 - (pegSpacing / 2) * (i - 1);
    for (let j = 0; j < i; j++) {
      let pos = new V2(startX + pegSpacing * j, y);
      pegs.push(createPeg(pos));
    }
  }
  return pegs;
}

function createPeg(pos) {
  return new Circle(pos, pegRadius);
}

function shouldDeletePeg(peg) {
  return true;
}

function createBead() {
  let pos = new V2((Math.random() - 0.5) * beadRadius * 2 + 200, -beadRadius);
  let vel = new V2(
    (Math.random() - 0.5) * 2 * maxRandBeadXVel,
    Math.random() * maxRandBeadYVel
  );
  return new Bead(new Circle(pos, beadRadius), vel);
}

function updateBead(bead, dt, pegs) {
  bead.vel.plusEquals(gravity.times(dt));
  bead.circle.center.plusEquals(bead.vel.times(dt));
  // Return true (to delete the bead) if it's off the bottom
  // of the screen.
  return bead.circle.center.y > 400 + bead.circle.radius;
}

function collideBead(bead, peg, collision) {
  bead.circle.center.plusEquals(collision.normal.times(collision.dist));
  let normalVel = bead.vel.dot(collision.normal);
  if (normalVel < 0) {
    bead.vel.plusEquals(collision.normal.times(-normalVel * (1 + beadElasticity)));
  }
  return false;
}