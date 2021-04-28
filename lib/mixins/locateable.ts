import { mixin } from '../mixin.ts'

interface LocateableObject {
    x: () => number
    setX: (x: number) => LocateableObject
    z: () => number
    setZ: (z: number) => LocateableObject
    y: () => number
    setY: (y: number) => LocateableObject
}

export const locateable = mixin<LocateableObject>(() => {
    let _x = -1
    let _z = -1
    let _y = -1
    return {
        x: () => _x,
        setX(x: number) {
            _x = x
            return this
        },
        z: () => _z,
        setZ(z: number) {
            _z = z
            return this
        },
        y: () => _y,
        setY(y: number) {
            _y = y
            return this
        }
    }
})