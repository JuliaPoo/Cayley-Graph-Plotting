import { assert } from "./Errors.js";
import { Rational } from "./Rational.js";
import { is_perfect_square, isqrt, range, zip } from "./Utils.js";
export class Matrix {
    constructor(mat, fp) {
        this.mat = mat;
        this.fp = fp;
        assert(() => is_perfect_square(mat.length), "Generators aren't isn't a square matrix");
    }
    get dim() {
        return isqrt(this.mat.length);
    }
    static id(dim, fp) {
        return new Matrix(range(0, dim * dim).map((i) => {
            const x = i % dim;
            const y = Math.floor(i / dim);
            return fp == "Q"
                ? x == y
                    ? Rational.one
                    : Rational.zero
                : x == y
                    ? 1
                    : 0;
        }), fp);
    }
    add(o) {
        assert(() => o.fp == this.fp, "Adding matrices of different fp");
        const f = this.fp == "Q"
            ? (r) => r[0].add(r[1])
            : this.fp == "Z"
                ? (r) => r[0] + r[1]
                : (r) => (r[0] + r[1]) % this.fp;
        return new Matrix(zip(o.mat, this.mat).map(f), this.fp);
    }
    mul(o) {
        assert(() => o.fp == this.fp, "Multiplying matrices of different fp");
        const d = this.dim;
        const f3 = this.fp == "Q"
            ? (a, b) => a.add(b)
            : this.fp == "Z"
                ? (a, b) => a + b
                : (a, b) => (a + b) % this.fp;
        const f2 = this.fp == "Q"
            ? (x, y) => (j) => {
                const [a, b] = [this.mat[y * d + j], o.mat[x + j * d]];
                const [xq, yq] = [a, b];
                return xq.mul(yq);
            }
            : this.fp == "Z"
                ? (x, y) => (j) => {
                    const [a, b] = [this.mat[y * d + j], o.mat[x + j * d]];
                    const [xz, yz] = [a, b];
                    return xz * yz;
                }
                : (x, y) => (j) => {
                    const [a, b] = [this.mat[y * d + j], o.mat[x + j * d]];
                    const [xz, yz] = [a, b];
                    return (xz * yz) % this.fp;
                };
        const f1 = (i) => {
            const x = i % d;
            const y = Math.floor(i / d);
            const f2_ = f2(x, y);
            return range(0, d)
                .map(f2_)
                .reduce(f3);
        };
        return new Matrix(range(0, d * d).map(f1), this.fp);
    }
    equal(o) {
        return (o.fp == this.fp &&
            o.mat.length == this.mat.length &&
            (this.fp == "Q"
                ? zip(o.mat, this.mat).every((r) => {
                    const rq = r;
                    return rq[0].equal(rq[1]);
                })
                : zip(o.mat, this.mat).every((r) => {
                    const rz = r;
                    return rz[0] == rz[1];
                })));
    }
}
