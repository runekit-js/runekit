import { createSession } from '../lib/mod.ts'
import type { Session, Gamepack } from '../lib/mod.ts'
import { handleSession } from './network.ts'
    
const sessions: Session[] = []

export function server(gamepack: Gamepack.Module, world: unknown) {

    console.log({ gamepack, world })

    return {
        start: async () => {
            const listener = Deno.listen({ port: 43594, hostname: '0.0.0.0' })

            console.log(`Listening @ localhost:43594`)

            // connection listener
            for await (const conn of listener) {
                // TODO: handle connections.
                const session = createSession(conn)
                    .assignDecoder(gamepack.LoginDecoder)
                    .assignEncoder(gamepack.PacketEncoder)

                sessions.push(session)
            
                try {
                    await handleSession(session)
                } catch (err) {
                    // closed connection
                    const index = sessions.indexOf(session)
                    sessions.splice(index, 1)
                }
            }
        }
    }
}
