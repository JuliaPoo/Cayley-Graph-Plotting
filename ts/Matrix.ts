import { assert } from "./Errors";
import { Rational } from "./Rational";
import { is_perfect_square, isqrt, range, zip } from "./Utils";

export type MatrixField = number | "Z" | "Q";
export type MatrixElement = number | Rational;

export class Matrix {
  constructor(readonly mat: MatrixElement[], readonly fp: MatrixField) {
    assert(
      () => is_perfect_square(mat.length),
      "Generators aren't isn't a square matrix"
    );
  }

  get dim(): number {
    return isqrt(this.mat.length);
  }

  static id(dim: number, fp: MatrixField): Matrix {
    return new Matrix(
      range(0, dim * dim).map((i) => {
        const x = i % dim;
        const y = Math.floor(i / dim);
        return fp == "Q"
          ? x == y
            ? Rational.one
            : Rational.zero
          : x == y
          ? 1
          : 0;
      }),
      fp
    );
  }

  add(o: Matrix): Matrix {
    assert(() => o.fp == this.fp, "Adding matrices of different fp");
    return new Matrix(
      this.fp == "Q"
        ? zip(o.mat, this.mat).map((r) => {
            const rq = r as [Rational, Rational];
            return rq[0].add(rq[1]);
          })
        : this.fp == "Z"
        ? zip(o.mat, this.mat).map((r) => {
            const rz = r as [number, number];
            return rz[0] + rz[1];
          })
        : zip(o.mat, this.mat).map((r) => {
            const rz = r as [number, number];
            return (rz[0] + rz[1]) % (this.fp as number);
          }),
      this.fp
    );
  }

  mul(o: Matrix): Matrix {
    assert(() => o.fp == this.fp, "Multiplying matrices of different fp");
    const d = this.dim;
    return new Matrix(
      this.fp == "Q"
        ? range(0, d * d).map((i) => {
            const x = i % d;
            const y = Math.floor(i / d);
            return range(0, d)
              .map((j) => {
                const [a, b] = [this.mat[y * d + j]!, o.mat[x + j * d]!];
                const [xq, yq] = [a as Rational, b as Rational];
                return xq.mul(yq);
              })
              .reduce((a, b) => {
                const [aq, bq] = [a as Rational, b as Rational];
                return aq.add(bq);
              });
          })
        : this.fp == "Z"
        ? range(0, d * d).map((i) => {
            const x = i % d;
            const y = Math.floor(i / d);
            return range(0, d)
              .map((j) => {
                const [a, b] = [this.mat[y * d + j]!, o.mat[x + j * d]!];
                const [xz, yz] = [a as number, b as number];
                return xz * yz;
              })
              .reduce((a, b) => {
                const [az, bz] = [a as number, b as number];
                return az + bz;
              });
          })
        : range(0, d * d).map((i) => {
            const x = i % d;
            const y = Math.floor(i / d);
            return range(0, d)
              .map((j) => {
                const [a, b] = [this.mat[y * d + j]!, o.mat[x + j * d]!];
                const [xz, yz] = [a as number, b as number];
                return (xz * yz) % (this.fp as number);
              })
              .reduce((a, b) => {
                const [az, bz] = [a as number, b as number];
                return (az + bz) % (this.fp as number);
              });
          }),
      this.fp
    );
  }

  equal(o: Matrix): boolean {
    return (
      o.fp == this.fp &&
      o.mat.length == this.mat.length &&
      (this.fp == "Q"
        ? zip(o.mat, this.mat).every((r) => {
            const rq = r as [Rational, Rational];
            return rq[0].equal(rq[1]);
          })
        : zip(o.mat, this.mat).every((r) => {
            const rz = r as [number, number];
            return rz[0] == rz[1];
          }))
    );
  }
}
