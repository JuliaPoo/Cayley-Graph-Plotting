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
    const f =
      this.fp == "Q"
        ? (r: [Rational, Rational]) => r[0].add(r[1])
        : this.fp == "Z"
        ? (r: [number, number]) => r[0] + r[1]
        : (r: [number, number]) => (r[0] + r[1]) % (this.fp as number);
    return new Matrix(
      zip(o.mat as number[], this.mat as number[]).map(
        f as (r: [number, number]) => number
      ),
      this.fp
    );
  }

  mul(o: Matrix): Matrix {
    assert(() => o.fp == this.fp, "Multiplying matrices of different fp");
    const d = this.dim;
    const f3 =
      this.fp == "Q"
        ? (a: Rational, b: Rational) => a.add(b)
        : this.fp == "Z"
        ? (a: number, b: number) => a + b
        : (a: number, b: number) => (a + b) % (this.fp as number);
    const f2 =
      this.fp == "Q"
        ? (x: number, y: number) => (j: number) => {
            const [a, b] = [this.mat[y * d + j]!, o.mat[x + j * d]!];
            const [xq, yq] = [a as Rational, b as Rational];
            return xq.mul(yq);
          }
        : this.fp == "Z"
        ? (x: number, y: number) => (j: number) => {
            const [a, b] = [this.mat[y * d + j]!, o.mat[x + j * d]!];
            const [xz, yz] = [a as number, b as number];
            return xz * yz;
          }
        : (x: number, y: number) => (j: number) => {
            const [a, b] = [this.mat[y * d + j]!, o.mat[x + j * d]!];
            const [xz, yz] = [a as number, b as number];
            return (xz * yz) % (this.fp as number);
          };
    const f1 = (i: number) => {
      const x = i % d;
      const y = Math.floor(i / d);
      const f2_ = f2(x, y);
      return range(0, d)
        .map(f2_ as (j: number) => number)
        .reduce(f3 as (a: number, b: number) => number);
    };

    return new Matrix(range(0, d * d).map(f1), this.fp);
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
