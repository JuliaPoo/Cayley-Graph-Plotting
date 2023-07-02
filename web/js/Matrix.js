import { assert } from "./Errors.js";
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
            return x == y ? 1 : 0;
        }), fp);
    }
    add(o) {
        assert(() => o.fp == this.fp, "Adding matrices of different fp");
        return new Matrix(zip(o.mat, this.mat).map((r) => (r[0] + r[1]) % this.fp), this.fp);
    }
    mul(o) {
        assert(() => o.fp == this.fp, "Multiplying matrices of different fp");
        const d = this.dim;
        return new Matrix(range(0, d * d).map((i) => {
            const x = i % d;
            const y = Math.floor(i / d);
            return range(0, d)
                .map((j) => this.mat[y * d + j] * o.mat[x + j * d])
                .reduce((a, b) => (a + b) % this.fp);
        }), this.fp);
    }
    equal(o) {
        return (o.fp == this.fp &&
            o.mat.length == this.mat.length &&
            zip(o.mat, this.mat).every((r) => r[0] == r[1]));
    }
}
