import { IntResult, StringResult, ByteBuf } from './mod.ts'

type IncomingPacketVarOperation = number | string | boolean | IntResult | StringResult

interface IncomingPacketVar {
    name: string,
    operation: IncomingPacketVarOperation
}

export interface IncomingPacket {
    id: number
    event: string
    vars: IncomingPacketVar[]
}

// TODO: fix packet lengths.
export function packet(id: number, length: number, event: string) {
    const buf = ByteBuf.from(new Uint8Array(512))
    return (vars: (buf: ByteBuf) => IncomingPacketVar[]): IncomingPacket => ({
        id,
        event,
        vars: vars(buf)
    })
}

export function pvar(name: string, operation: IncomingPacketVarOperation) {
    return ({
        name,
        operation
    })
}

/**
 * pvar('torso', buffer.readInt())
 */