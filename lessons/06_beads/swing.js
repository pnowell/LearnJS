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

const rowCount = 13;
const rowDisp = 400 / (rowCount - 1);
const colCount = 13;
const colDisp = 400 / (colCount - 1);
const pegRadius = 10;
const beadRadius = 2;
const startHeight = 30;
const gravity = new V2(0, 1000);

function maxBeads() {
  return 50;
}

function maxBeadsPerSecond() {
  return 30;
}

function initializePegs() {
  let pegs = [];
  for (let i = 0; i < rowCount; i++) {
    let y = i * rowDisp;
    let evenRow = (i % 2) == 0;
    let startX = evenRow ? 0 : colDisp / 2;
    let rowColCount = evenRow ? colCount : colCount - 1;
    for (let j = 0; j < rowColCount; j++) {
      let x = startX + j * colDisp;
      pegs.push(createPeg(new V2(x, y)));
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
  let pos = new V2(Math.random() * 400, -startHeight);
  let vel = new V2(Math.random(), Math.random());
  return new Bead(new Circle(pos, beadRadius), vel);
}

function updateBead(bead, dt, pegs) {
  bead.vel.plusEquals(gravity.times(dt));

  let closestDistSqr = 100 * 100;
  let closestDisp = null;
  for (let i = 0; i < pegs.length; i++) {
    let disp = pegs[i].center.minus(bead.circle.center);
    let distSqr = disp.lengthSqr();
    if (closestDistSqr > distSqr) {
      closestDistSqr = distSqr;
      closestDisp = disp;
    }
  }
  if (closestDisp !== null) {
    closestDisp.timesEquals(1 / Math.sqrt(closestDistSqr));
    let perpVel = bead.vel.dot(closestDisp);
    bead.vel.minusEquals(closestDisp.times(perpVel));
  }

  bead.circle.center.plusEquals(bead.vel.times(dt));

  if (bead.circle.center.y - bead.circle.radius > 400) {
    return true;
  }
  return false;
}

function collideBead(bead, peg, collision) {
  return true;
}