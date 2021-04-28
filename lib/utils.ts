import { ByteBuf } from './mod.ts'

export const toJagString = (buffer: ByteBuf) => {
    const res = []
    let data: number
    while ((data = buffer.readInt8()) != 10) {
        res.push(String.fromCharCode(data))
    }
    return res.join('')
}