export function mixin<P, T = Record<string, unknown>>(props: () => P) {
    return (o: T): P & T => Object.assign({}, o, props())
}