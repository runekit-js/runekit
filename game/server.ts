import { createSession } from '../lib/mod.ts'
import { handleSession } from './network.ts'
    
const sessions = []

interface Gamepack {
    LoginDecoder: (session: unknown) => Promise<void>
    PacketEncoder: (session: unknown) => Record<string, unknown>
}

export async function server(gamepack: Gamepack, world: unknown) {

    console.log({ gamepack })

    return {
        start: async () => {
            const listener = Deno.listen({ port: 43594 })

            console.log(`Listening @ localhost:43594`)

            // connection listener
            for await (const conn of listener) {
                // TODO: handle connections.
                const session = createSession(conn).assign(gamepack.LoginDecoder)
                sessions.push(session)
            
                // await handleSession(session)
            }
        }
    }
}
