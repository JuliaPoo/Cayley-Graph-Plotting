
class CayleyError extends Error {}

export function assert(test: () => boolean, msg: string) {
    if (!test) throw new CayleyError(msg);
}