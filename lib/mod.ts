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