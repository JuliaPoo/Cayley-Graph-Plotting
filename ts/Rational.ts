import { gcd, idiv } from "./Utils";

type pair = [number, number];

export class Rational {
  constructor(readonly frac: pair) {
    this.frac = Rational.simplify(frac);
  }

  private static simplify(frac: pair): pair {
    const [x, y] = frac;
    const d = gcd(x, y);
    const y_neg = y < 0;
    return y_neg 
      ? [-idiv(x, d), -idiv(y, d)]
      : [idiv(x, d), idiv(y, d)];
  }

  static new(pair: pair): Rational {
    return new Rational(pair);
  } 

  add(o: Rational): Rational {
    const [x, y] = this.frac;
    const [z, w] = o.frac;
    return new Rational([x * w + z * y, y * w]);
  }

  mul(o: Rational): Rational {
    const [x, y] = this.frac;
    const [z, w] = o.frac;
    return new Rational([x * z, y * w]);
  }

  equal(o: Rational): boolean {
    const [x, y] = this.frac;
    const [z, w] = o.frac;
    return x == z && y == w;
  }

  static get zero(): Rational {
    return new Rational([0, 1]);
  }

  static get one(): Rational {
    return new Rational([1,1]);
  }
}
