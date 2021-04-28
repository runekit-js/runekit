import { mixin } from '../mixin.ts'

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