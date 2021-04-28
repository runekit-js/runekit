import { ByteBuf, PacketDecoder, isaac, toJagString } from '../lib/mod.ts'
import type { Session } from '../lib/mod.ts'

type DecoderErrorType = 'INVALID_LOGIN_TYPE' | 
    'INVALID_REQUEST_TYPE' | 
    'OPCODE_MISMATCH' | 
    'VERSION_MISMATCH' |
    'PACKET_SIZE_MISMATCH' |
    'RSA_MISMATCH' |
    'INVALID_LOGIN_STATE'

// interface DecoderError extends Error {
//     type: DecoderErrorType
//     message: string
// }

type LoginState = 'USERNAME_HASH' | 'PAYLOAD' | 'SUCCESS'
type LoginResult = Promise<LoginState>

export function LoginDecoder(session: Session) {

    // let packetLength = -1
    let loginState: LoginState = 'USERNAME_HASH'

    async function readUsernameHash(buffer: ByteBuf): LoginResult {
        const loginType = buffer.readInt8() & 0xFF
        if (loginType !== 14) {
            // end session
            return Promise.reject({ type: 'INVALID_LOGIN_TYPE', message: `Invalid login type: ${loginType}` })
        }
    
        // name hash
        buffer.readInt8() & 0xFF

        const outBuffer = ByteBuf.from(new Int8Array(17))

        for (let i = 17; i > 0; i--) {
            outBuffer.writeInt8(0)
        }

        await session.send(outBuffer)

        console.log(`header sent`)

        return Promise.resolve('PAYLOAD')
    }
    
    async function readPayload(buffer: ByteBuf): LoginResult {
        const request = buffer.readInt8() & 0xFF
        if (request !== 16 && request !== 18) {
            return Promise.reject({ type: 'INVALID_REQUEST_TYPE', message: `Invalid request type: ${request}` })
        }
        
        let packetLength = (buffer.readInt8() & 0xFF) - (36 + 1 + 1 + 2)

        const opcode = buffer.readInt8() && 0xFF
        console.log(opcode, `opx`)
        if (opcode !== 255) {
            return Promise.reject({ type: 'OPCODE_MISMATCH', message: `Opcode mismatch ${opcode}:255` })
        }
        const version = buffer.readInt16()
        
        if (version !== 377 && version !== 317) {
            return Promise.reject({ type: 'VERSION_MISMATCH', message: `Version mismatch ${version}:377|317` })
        }
        
        // memoryMode
        buffer.readInt8() & 0xFF
    
        const crcs = Array.from({ length: 9 })
        for (let i = 0; i < 9; i++) {
            crcs[i] = buffer.readInt32()
        }

        packetLength -= 1
    
        const expectedSize = buffer.readInt8() & 0xFF
        if (expectedSize !== packetLength) {
            console.log(`unexpected packet size: es(${expectedSize}):pl(${packetLength})`)
            return Promise.reject({ type: 'PACKET_SIZE_MISMATCH', message: `Packet size mismatch ${expectedSize}:${packetLength}` })
        }

        const rsaOpcode = buffer.readInt8() & 0xFF
        if (rsaOpcode !== 10) {
            return Promise.reject({ type: 'RSA_MISMATCH', message: `RSA Mismatch ${rsaOpcode}:10` })
        }

        const clientSeed = buffer.readBigInt64()
        const serverSeed = buffer.readBigInt64()

        const uid = buffer.readInt32()

        const username = toJagString(buffer)
        const password = toJagString(buffer)

        console.log(uid, username, password)

        const sessionSeed: number[] = Array.from({ length: 4 })

        sessionSeed[0] = Number((clientSeed >> BigInt(32)))
        sessionSeed[1] = Number(clientSeed)
        sessionSeed[2] = Number((serverSeed >> BigInt(32)))
        sessionSeed[3] = Number(serverSeed)

        const encryptor = isaac().seed(sessionSeed)
        
        for (let i = 0; i < 4; i++) {
            sessionSeed[i] += 50
        }

        const decryptor = isaac().seed(sessionSeed)
    
        // hand off to auth/game-server.

        const responseCode = 2

        const outBuffer = ByteBuf.from(new Uint8Array(3))
        outBuffer.writeInt8(responseCode)
        outBuffer.writeInt8(2)
        outBuffer.writeInt8(0)

        await session.send(outBuffer)

        // auth/game-server

        session.assignDecryptor(decryptor)
        session.assignEncryptor(encryptor)
        session.assignDecoder(PacketDecoder)

        return Promise.resolve('SUCCESS')
    }

    return {
        async decode(data: ArrayBufferLike) {
            console.log(loginState)
            const buffer = ByteBuf.from(data)
            const getLoginState = async () => {
                if (loginState === 'USERNAME_HASH') {
                    return await readUsernameHash(buffer)
                }
                if (loginState === 'PAYLOAD') {
                    return await readPayload(buffer)
                }
                return Promise.reject({ type: 'INVALID_LOGIN_STATE' })
            }
            const response = await getLoginState()
            if (response) {
                loginState = response
            }
        }
    }
}