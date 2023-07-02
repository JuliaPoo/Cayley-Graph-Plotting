class CayleyError extends Error {
}
export function assert(test, msg) {
    if (!test)
        throw new CayleyError(msg);
}
