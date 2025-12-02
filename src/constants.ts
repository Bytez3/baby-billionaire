import { publicKey } from '@metaplex-foundation/umi'
import { Connection } from '@solana/web3.js'

export const RPC_URL =
  'https://mainnet.helius-rpc.com/?api-key=4c5acb83-5f9e-4812-b6d8-139af0431e7d'
export const connection = new Connection(RPC_URL)

/**
 * DEVNET ADDRESSES 6aDvG1k7VRLAcAmCw4hwNYH7ZVsA3ZDcrbKR1TsdWPcc
 * MAINNET ADDRESSES Ghb3xHYQr9G95CCxS17MswrNVHoGy2t6zSupQVupn3ow
 */
export const CANDY_MACHINE_PUBLIC_KEY = publicKey(
  'Ghb3xHYQr9G95CCxS17MswrNVHoGy2t6zSupQVupn3ow',
)
/**
 * DEVNET ADDRESSES 7VDtLgJ4HbBJqLEST1HRsHAqo5NFajyjmAZFS9Zq7mBC
 * MAINNET ADDRESSES Bay64WsXaLkvyMx6uqbNgD56GeL3tGFYmL3KPNkNG8h
 */
export const COLLECTION_PUBLIC_KEY = publicKey(
  'Bay64WsXaLkvyMx6uqbNgD56GeL3tGFYmL3KPNkNG8h',
)

export const API_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:3000'
    : import.meta.env.VITE_API_URL || 'https://slot.babybillionaires.club/api'

// add a time for whitelist sale start will be 12/1/2025 at 6 pm UTC
export const WHITELIST_SALE_START = new Date('2025-12-01T18:00:00Z').getTime()

// add a time for public sale start will be 12/2/2025 at 6 pm UTC
export const PUBLIC_SALE_START = new Date('2025-12-02T18:00:00Z').getTime()

export const JACKPOT_MAX_LIMIT = 32
