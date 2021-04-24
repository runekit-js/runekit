function mixin<P, T = Record<string, unknown>>(props: (o?: T) => P) {
    return function(o: T): P & T {
        return Object.assign({}, o, props(o))
    }
}

interface NameableObject {
    name: () => string;
    setName: (name: string) => NameableObject;
}

export const nameable = mixin<NameableObject>(() => {
    let _name = ''
    return {
        name: () => _name,
        setName(name: string) {
            _name = name
            return this
        }
    }
})