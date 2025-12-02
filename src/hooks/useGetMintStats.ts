import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/axios'

interface MintStats {
  totalPublic: number
  totalWhitelist: number
  totalJackpot: number
  totalMinted: number
  totalAddresses: number
}

interface GetMintStatsResponse {
  success: boolean
  stats: MintStats
}

export function useGetMintStats() {
  const statsQuery = useQuery({
    queryKey: ['mint-stats'],
    queryFn: async (): Promise<MintStats> => {
      const { data } = await apiClient.get<GetMintStatsResponse>(
        '/api/mint-stats',
      )

      return data.stats
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return statsQuery
}
