import { pipe } from 'https://deno.land/x/pine/mod.ts'
import { world } from './world.ts'
import { identifiable, nameable, locateable } from './mixins/mod.ts'

export const createPlayer = () => pipe(
    identifiable,
    nameable,
    locateable,
)({})

export const createItem = () => pipe(
    identifiable,
    nameable,
)({})

export const createGroundItem = () => pipe(
    identifiable,
    nameable,
    locateable,
)({})

export const createNPC = () => pipe(
    identifiable,
    nameable,
    locateable,
)({})

export const createWorld = (machine: unknown) => pipe(
    nameable,
)(world(machine))

export * from './xstate.ts'
export { createSession } from './session.ts'
export { isaac } from './isaac.ts'
export type { Session } from './session.ts'
export * from 'https://deno.land/x/bytebuf@1.1.1/bytebuf.ts'
export { packet, pvar } from './incoming-packet.ts'
export type { Gamepack } from './gamepack.ts'
export { toJagString } from './utils.ts'
export { PacketDecoder } from './packet-decoder.ts'