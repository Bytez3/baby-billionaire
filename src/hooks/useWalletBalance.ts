import { useWallet } from '@solana/wallet-adapter-react'
import { useQuery } from '@tanstack/react-query'
import { connection } from '../constants'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

export function useWalletBalance() {
  const { publicKey, connected } = useWallet()

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['wallet-balance', publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey) return 0

      const balance = await connection.getBalance(publicKey)
      return balance / LAMPORTS_PER_SOL
    },
    enabled: connected && !!publicKey,
    refetchInterval: 10000, // Refetch every 10 seconds
  })
}
