import { assert } from "./Errors";

export function isqrt(value: number): number {
  assert(() => value >= 0, "Square root of negative numbers not supported");
  return Math.floor(Math.sqrt(value));
}

export function is_perfect_square(value: number): boolean {
  const s = isqrt(value);
  return value == s * s;
}

export function range(a: number, b: number): number[] {
  return Array.from(new Array(b - a), (_, i) => i + a);
}

export function zip<U, V>(xs: U[], ys: V[]): [U, V][] {
  return xs.length < ys.length
    ? xs.map((v, i) => [v, ys[i]!])
    : ys.map((v, i) => [xs[i]!, v]);
}
