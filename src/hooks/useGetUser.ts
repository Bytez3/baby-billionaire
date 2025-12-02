import { useQuery } from '@tanstack/react-query'
import { useWallet } from '@solana/wallet-adapter-react'
import { apiClient } from '../lib/axios'

interface GameStats {
  id: string
  userId: string
  totalSpins: number
  spinsUsed: number
  score: number
  hasWonJackpot: boolean
  lastPlayedAt: string
  createdAt: string
  updatedAt: string
}

interface User {
  id: string
  address: string
  username: string
  hasClaimedJackpot: boolean
  createdAt: string
  gameStats: GameStats | null
}

interface GetUserResponse {
  success: boolean
  user: User
}

export function useGetUser() {
  const { publicKey, connected } = useWallet()

  const userQuery = useQuery({
    queryKey: ['user', publicKey?.toString()],
    queryFn: async (): Promise<User> => {
      const { data } = await apiClient.get<GetUserResponse>(
        `/api/user/${publicKey?.toString()}`,
      )

      return data.user
    },
    enabled: connected && !!publicKey,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return userQuery
}
