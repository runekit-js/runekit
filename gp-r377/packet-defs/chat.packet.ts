import { ByteBuf, pvar } from '../../lib/mod.ts'

export default (buf: ByteBuf) => [
    pvar('message', buf.getVarString(0, 256)),
    pvar('effects', buf.getInt8(0))
]