export { Color };

class Color {
  constructor(r, g, b) {
    if (r === undefined) {
      this.r = 0;
      this.g = 0;
      this.b = 0;
    } else {
      this.r = r;
      this.g = g;
      this.b = b;
    }
  }

  get hex() {
    return "#" + (
        (1 << 24)
        + (Math.floor(this.r) << 16)
        + (Math.floor(this.g) << 8)
        + Math.floor(this.b)
    ).toString(16).slice(1);
  }

  static fromHex(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? new Color(
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ) : null;
  }
};