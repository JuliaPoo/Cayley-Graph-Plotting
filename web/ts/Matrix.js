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
        return new Matrix(zip(o.mat, this.mat).map((r) => {
            if (this.fp == "Q") {
                const rq = r;
                return rq[0].add(rq[1]);
            }
            const rz = r;
            return this.fp == "Z" ? rz[0] + rz[1] : (rz[0] + rz[1]) % this.fp;
        }), this.fp);
    }
    mul(o) {
        assert(() => o.fp == this.fp, "Multiplying matrices of different fp");
        const d = this.dim;
        return new Matrix(range(0, d * d).map((i) => {
            const x = i % d;
            const y = Math.floor(i / d);
            return range(0, d)
                .map((j) => {
                const [a, b] = [this.mat[y * d + j], o.mat[x + j * d]];
                if (this.fp == "Q") {
                    const [xq, yq] = [a, b];
                    return xq.mul(yq);
                }
                const [xz, yz] = [a, b];
                return xz * yz;
            })
                .reduce((a, b) => {
                if (this.fp == "Q") {
                    const [aq, bq] = [a, b];
                    return aq.add(bq);
                }
                const [az, bz] = [a, b];
                return this.fp == "Z" ? az + bz : (az + bz) % this.fp;
            });
        }), this.fp);
    }
    equal(o) {
        return (o.fp == this.fp &&
            o.mat.length == this.mat.length &&
            zip(o.mat, this.mat).every((r) => {
                if (this.fp == "Q") {
                    const rq = r;
                    return rq[0].equal(rq[1]);
                }
                const rz = r;
                return rz[0] == rz[1];
            }));
    }
}
