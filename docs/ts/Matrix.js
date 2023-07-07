import { assert } from "./Errors.js";
import { Rational } from "./Rational.js";
import { is_perfect_square, isqrt, range, zip } from "./Utils.js";
export class Matrix {
    constructor(mat, fp) {
        this.mat = mat;
        this.fp = fp;
        assert(is_perfect_square(mat.length), "Generators aren't isn't a square matrix");
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
        assert(o.fp == this.fp, "Adding matrices of different fp");
        const f = this.fp == "Q"
            ? (r) => r[0].add(r[1])
            : this.fp == "Z"
                ? (r) => r[0] + r[1]
                : (r) => (r[0] + r[1]) % this.fp;
        return new Matrix(zip(o.mat, this.mat).map(f), this.fp);
    }
    mul(o) {
        assert(o.fp == this.fp, "Multiplying matrices of different fp");
        const d = this.dim;
        if (this.fp == "Q") {
            const new_mat = new Array(d * d);
            for (let i = 0; i < d * d; i++) {
                const x = i % d;
                const y = Math.floor(i / d);
                let s = Rational.zero;
                for (let j = 0; j < d; j++) {
                    s = s.add(this.mat[y * d + j].mul(o.mat[x + j * d]));
                }
                new_mat[i] = s;
            }
            return new Matrix(new_mat, this.fp);
        }
        if (this.fp == "Z") {
            const new_mat = new Array(d * d);
            for (let i = 0; i < d * d; i++) {
                const x = i % d;
                const y = Math.floor(i / d);
                let s = 0;
                for (let j = 0; j < d; j++) {
                    s += this.mat[y * d + j] * o.mat[x + j * d];
                }
                new_mat[i] = s;
            }
            return new Matrix(new_mat, this.fp);
        }
        const new_mat = new Array(d * d);
        for (let i = 0; i < d * d; i++) {
            const x = i % d;
            const y = Math.floor(i / d);
            let s = 0;
            for (let j = 0; j < d; j++) {
                s += this.mat[y * d + j] * o.mat[x + j * d];
            }
            new_mat[i] = s % this.fp;
        }
        return new Matrix(new_mat, this.fp);
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
