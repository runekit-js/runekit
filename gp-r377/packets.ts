import { packet } from '../lib/mod.ts'
import chatPacket from './packet-defs/chat.packet.ts'

export const incomingPackets = [
    packet(24, -1, 'chat')(chatPacket),
]