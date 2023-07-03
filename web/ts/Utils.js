import { assert } from "./Errors.js";
export function isqrt(value) {
    assert(() => value >= 0, "Square root of negative numbers not supported");
    return Math.floor(Math.sqrt(value));
}
export function is_perfect_square(value) {
    const s = isqrt(value);
    return value == s * s;
}
export function range(a, b) {
    return Array.from(new Array(b - a), (_, i) => i + a);
}
export function zip(xs, ys) {
    return xs.length < ys.length
        ? xs.map((v, i) => [v, ys[i]])
        : ys.map((v, i) => [xs[i], v]);
}
