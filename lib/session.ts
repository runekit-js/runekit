export function createSession(conn: Deno.Conn) {
    let _player: unknown = null
    let _decoder: unknown = null
    return {
        player: () => _player,
        attach(player: unknown) {
            _player = player
            return this
        },
        decoder: () => _decoder,
        assign(decoder: unknown) {
            _decoder = decoder
            return this
        },
        conn: () => conn
    }
}