import { assert } from "./Errors.js";
export function isqrt(value) {
    assert(() => value >= 0, "Square root of negative numbers not supported");
    if (value < 2)
        return value;
    const f = (n, x0) => {
        const x1 = (n / x0 + x0) >> 1;
        return x0 === x1 || x0 === x1 - 1
            ? x0
            : f(n, x1);
    };
    return f(value, 1);
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
