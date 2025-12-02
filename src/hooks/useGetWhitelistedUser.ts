import { useQuery } from '@tanstack/react-query'
import { useWallet } from '@solana/wallet-adapter-react'
import { apiClient } from '../lib/axios'

interface Minted {
  public: number
  whitelist: number
  jackpot: number
}

interface Mint {
  id: string
  address: string
  minted: Minted
  createdAt: string
  updatedAt: string
}

interface GetMintResponse {
  success: boolean
  mint: Mint
}

export function useGetWhitelistedUser() {
  const { publicKey, connected } = useWallet()

  const whitelistedUserQuery = useQuery({
    queryKey: ['whitelisted-user', publicKey?.toString()],
    queryFn: async (): Promise<Mint> => {
      const { data } = await apiClient.get<GetMintResponse>(
        `/api/mint/${publicKey?.toString()}`,
      )

      return data.mint
    },
    enabled: connected && !!publicKey,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return whitelistedUserQuery
}
