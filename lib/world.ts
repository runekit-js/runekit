import { interpret } from './xstate.ts'

interface World {
    service: () => unknown
}

export function world(machine: unknown): World {
    const worldService = interpret(machine)
    return {
        service: () => worldService
    }
}