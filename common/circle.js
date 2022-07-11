export { Circle };
import { Collision } from '/LearnJS/common/collision.js';

class Circle {
  constructor (center, radius) {
    this.center = center.copy();
    this.radius = radius;
  }

  collisionWith(other) {
    let disp = this.center.minus(other.center);
    let distSqr = disp.lengthSqr();
    let radSum = this.radius + other.radius;
    let radSumSqr = radSum * radSum;
    if (distSqr > radSumSqr) {
      return null;
    }
    let dist = Math.sqrt(distSqr);
    disp.timesEquals(1 / dist);
    return new Collision(disp, radSum - dist);
  }
};