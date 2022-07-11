export { V2 };

class V2 {

  constructor(a, b) {
    if (a === undefined) {
      // No argument constructor
      this.x = 0;
      this.y = 0;
    } else if (b === undefined) {
      // Single argument constructor
      this.x = a.x;
      this.y = a.y;
    } else {
      this.x = a;
      this.y = b;
    }
  }

  copy() {
    return new V2(this);
  }

  plusEquals(other) {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  minusEquals(other) {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  timesEquals(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  plus(other) {
    return new V2(this.x + other.x, this.y + other.y);
  }

  minus(other) {
    return new V2(this.x - other.x, this.y - other.y);
  }

  times(scalar) {
    return new V2(this.x * scalar, this.y * scalar);
  }

  dot(other) {
    return this.x * other.x + this.y * other.y;
  }

  lengthSqr() {
    return this.dot(this);
  }

  length() {
    return Math.sqrt(lengthSqr());
  }

  static interpolate(a, b, t) {
    return a.times(t).plus(b.times(1-t));
  }

  static distanceSqr(a, b) {
    return a.minus(b).lengthSqr();
  }

  static distance(a, b) {
    return a.minus(b).length();
  }
}