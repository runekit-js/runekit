import type { Gamepack } from './gamepack.ts'
import type { Isaac } from './isaac.ts'
import type { ByteBuf } from './mod.ts'

export interface Session {
    conn: () => Deno.Conn
    player: () => unknown
    decoder: () => Gamepack.Decoder | undefined
    encoder: () => Gamepack.Encoder | undefined
    encryptor: () => Isaac | undefined
    decryptor: () => Isaac | undefined
    assignPlayer: (player: unknown) => Session
    assignEncryptor: (encryptor: Isaac) => Session
    assignDecryptor: (decryptor: Isaac) => Session
    assignDecoder: (decoder: Gamepack.LoginDecoder) => Session
    assignEncoder: (encoder: Gamepack.PacketEncoder) => Session
    send: (buf: ByteBuf) => Promise<Session>
}

export function createSession(conn: Deno.Conn): Session {
    let _player: unknown
    let _decoder: Gamepack.Decoder
    let _encoder: Gamepack.Encoder
    let _encryptor: Isaac
    let _decryptor: Isaac
    return Object.assign({}, {
        conn: () => conn,
        player: () => _player,
        assignPlayer(this: Session, player: unknown) {
            _player = player
            return this
        },
        decoder: (): Gamepack.Decoder | undefined => _decoder,
        assignDecoder(this: Session, decoder: Gamepack.LoginDecoder ) {
            _decoder = decoder(this)
            return this
        },
        encoder: (): Gamepack.Encoder | undefined => _encoder,
        assignEncoder(this: Session, encoder: Gamepack.PacketEncoder) {
            _encoder = encoder(this)
            return this
        },
        encryptor: () => _encryptor,
        assignEncryptor(this: Session, encryptor: Isaac) {
            _encryptor = encryptor
            return this
        },
        decryptor: () => _decryptor,
        assignDecryptor(this: Session, decryptor: Isaac) {
            _decryptor = decryptor
            return this
        },
        async send(this: Session, buf: ByteBuf) {
            try {
                await this.conn().write(new Uint8Array(buf.buffer))
            } catch (err) {
                console.error({ err })
            }
            return this
        }
    })
}
