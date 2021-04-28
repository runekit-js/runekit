import { Session } from '../lib/mod.ts'

export async function handleSession(session: Session) {
    const buffer = new Uint8Array(512)
    while (true) {
        const length = await session.conn().read(buffer)
        console.log(length)
        if (!length) { // connection closed.
            break
        }
        if (length) {
            try {
                await session.decoder()?.decode(buffer.subarray(0, length))
            } catch (err) {
                console.error(err)
            }
        }
    }
    return Promise.reject({ session, message: 'Connection closed.' })
}