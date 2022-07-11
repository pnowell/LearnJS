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
const beadRadius = 2;
const velThetaMaxOffset = 0;
const velMagMin = 50;
const velMagMax = 150;
const velMagRange = velMagMax - velMagMin;
const gravity = 10000;

function maxBeads() {
  return 25;
}

function maxBeadsPerSecond() {
  return 4;
}

function initializePegs() {
  return [
    createPeg(new V2(75, 75)),
    createPeg(new V2(200, 200)),
    createPeg(new V2(325, 325)),
  ];
}

function createPeg(pos) {
  return new Circle(pos, pegRadius);
}

function shouldDeletePeg(peg) {
  return true;
}

function createBead() {
  let theta = Math.random() * Math.PI * 2;
  let pos = new V2(Math.cos(theta), Math.sin(theta));
  pos.timesEquals(100).plusEquals(new V2(200, 200));
  let velTheta = theta + (Math.random() - 0.5) * Math.PI * 4 * velThetaMaxOffset + Math.PI * 0.5;
  let vel = new V2(Math.cos(velTheta), Math.sin(velTheta));
  if (Math.random() < 0.5) {
    vel.timesEquals(-1);
  }
  vel.timesEquals(Math.random() * velMagRange + velMagMin);
  return new Bead(new Circle(pos, beadRadius), vel);
}

function updateBead(bead, dt, pegs) {
  for (let i = 0; i < pegs.length; i++) {
    let disp = pegs[i].center.minus(bead.circle.center);
    let distSqr = disp.lengthSqr();
    let gravityVector = disp.times(gravity / distSqr);
    bead.vel.plusEquals(gravityVector.times(dt));
  }
  bead.circle.center.plusEquals(bead.vel.times(dt));
  return false;
}

function collideBead(bead, peg, collision) {
  return true;
}