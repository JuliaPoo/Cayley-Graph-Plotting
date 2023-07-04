import { gcd, idiv } from "./Utils.js";
export class Rational {
    constructor(frac) {
        this.frac = frac;
        this.frac = Rational.simplify(frac);
    }
    static simplify(frac) {
        const [x, y] = frac;
        const d = gcd(x, y);
        const y_neg = y < 0;
        return y_neg
            ? [-idiv(x, d), -idiv(y, d)]
            : [idiv(x, d), idiv(y, d)];
    }
    static new(pair) {
        return new Rational(pair);
    }
    add(o) {
        const [x, y] = this.frac;
        const [z, w] = o.frac;
        return new Rational([x * w + z * y, y * w]);
    }
    mul(o) {
        const [x, y] = this.frac;
        const [z, w] = o.frac;
        return new Rational([x * z, y * w]);
    }
    equal(o) {
        const [x, y] = this.frac;
        const [z, w] = o.frac;
        return x == z && y == w;
    }
    static get zero() {
        return new Rational([0, 1]);
    }
    static get one() {
        return new Rational([1, 1]);
    }
}
