function mixin<P, T = Record<string, unknown>>(props: () => P) {
    return (o: T): P & T => Object.assign({}, o, props())
}

interface IdentifiableObject {
    id: () => number | string
    setId: (id: number | string) => IdentifiableObject
}

export const identifiable = mixin<IdentifiableObject>(() => {
    let _id: string | number = -1
    return {
        id: () => _id,
        setId(id: number | string) {
            _id = id
            return this
        }
    }
})