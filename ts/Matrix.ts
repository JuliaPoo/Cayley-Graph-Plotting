import { assert } from "./Errors";
import { is_perfect_square, isqrt, range, zip } from "./Utils";

export class Matrix {
  constructor(readonly mat: number[], readonly fp: number) {
    assert(
      () => is_perfect_square(mat.length),
      "Generators aren't isn't a square matrix"
    );
  }

  get dim(): number {
    return isqrt(this.mat.length);
  }

  static id(dim: number, fp: number): Matrix {
    return new Matrix(
      range(0, dim * dim).map((i) => {
        const x = i % dim;
        const y = Math.floor(i / dim);
        return x == y ? 1 : 0;
      }),
      fp
    );
  }

  add(o: Matrix): Matrix {
    assert(() => o.fp == this.fp, "Adding matrices of different fp");
    return new Matrix(
      zip(o.mat, this.mat).map((r) =>
        this.fp == -1 ? r[0] + r[1] : (r[0] + r[1]) % this.fp
      ),
      this.fp
    );
  }

  mul(o: Matrix): Matrix {
    assert(() => o.fp == this.fp, "Multiplying matrices of different fp");
    const d = this.dim;
    return new Matrix(
      range(0, d * d).map((i) => {
        const x = i % d;
        const y = Math.floor(i / d);
        return range(0, d)
          .map((j) => this.mat[y * d + j]! * o.mat[x + j * d]!)
          .reduce((a, b) => (this.fp == -1 ? a + b : (a + b) % this.fp));
      }),
      this.fp
    );
  }

  equal(o: Matrix): boolean {
    return (
      o.fp == this.fp &&
      o.mat.length == this.mat.length &&
      zip(o.mat, this.mat).every((r) => r[0] == r[1])
    );
  }
}
