import { assert } from "./Errors";
import { Rational } from "./Rational";
import { is_perfect_square, isqrt, range, zip } from "./Utils";

export type MatrixField = number | "Z" | "Q";
export type MatrixElement = number | Rational;

export class Matrix {
  constructor(readonly mat: MatrixElement[], readonly fp: MatrixField) {
    assert(
      is_perfect_square(mat.length),
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
    assert(o.fp == this.fp, "Adding matrices of different fp");
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
    assert(o.fp == this.fp, "Multiplying matrices of different fp");
    const d = this.dim;

    if (this.fp == "Q") {
      const new_mat = new Array(d * d);
      for (let i = 0; i < d * d; i++) {
        const x = i % d;
        const y = Math.floor(i / d);
        let s = Rational.zero;
        for (let j = 0; j < d; j++) {
          s = s.add(
            (this.mat[y * d + j]! as Rational).mul(
              o.mat[x + j * d]! as Rational
            )
          );
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
          s += (this.mat[y * d + j]! as number) * (o.mat[x + j * d]! as number);
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
        s += (this.mat[y * d + j]! as number) * (o.mat[x + j * d]! as number);
      }
      new_mat[i] = s % this.fp;
    }
    return new Matrix(new_mat, this.fp);
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
