import { createWorld, createPlayer, Machine } from '../lib/mod.ts'
import { server } from './server.ts'

// const { start } = actions

const worldMachine = Machine(
    {
        context: {},
        initial: 'boot',
        states: {
            boot: {
                // entry: 'init'
            }
        }
    },
    {
        guards: {},
        actions: {
            // init: start(activity)
        }
    }
)

const world = createWorld(worldMachine).setName('NORMAL')

const player = createPlayer()
player.setId(0)
player.setName('austin')

const player2 = createPlayer()
player2.setId(1)
player2.setName('tim')

const gamepack = await import('../gp-r377/mod.ts')
const gameserver = await server(gamepack, world)

await gameserver.start()