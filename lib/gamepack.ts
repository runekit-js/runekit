import type { Session } from './session.ts'
import type { IncomingPacket } from './incoming-packet.ts'

export declare namespace Gamepack {
    export type Decoder = { decode: (data: ArrayBufferLike) => Promise<unknown> }
    export type Encoder = { encode: (data: ArrayBufferLike) => Promise<unknown> }
    export interface LoginDecoder {
        (session: Session): Decoder
    }
    export interface PacketEncoder {
        (session: Session): Encoder
    }
    export interface Module {
        LoginDecoder: LoginDecoder
        PacketEncoder: PacketEncoder
        incomingPackets: IncomingPacket[]
    }
}