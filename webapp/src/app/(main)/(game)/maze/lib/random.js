export function buildRandom() {
  function mulberry32() {
    return Math.random();
  }

  return {
    rnd: mulberry32,
    range(num1, num2) {
      const [min, max] = [num1, num2].sort();
      return Math.floor(min + (max - min + 1) * mulberry32());
    },
    int(rangeSize) {
      "use strict";
      console.assert(rangeSize > 0);
      return this.range(0, rangeSize - 1);
    },
    choice(array) {
      const length = array.length;
      if (length) {
        return array[this.int(length)];
      }
    },
    shuffle(array) {
      let i = array.length;

      while (i) {
        const r = this.int(i--);
        [array[i], array[r]] = [array[r], array[i]];
      }

      return array;
    },
    get seed() {
      return seed;
    },
  };
}
