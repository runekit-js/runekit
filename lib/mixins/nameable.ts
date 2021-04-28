import { mixin } from '../mixin.ts'

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