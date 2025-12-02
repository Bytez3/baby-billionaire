import type { Umi } from '@metaplex-foundation/umi'
import { useInfiniteQuery } from '@tanstack/react-query'
import { COLLECTION_PUBLIC_KEY } from '../constants'
import { useUmi } from './useUmi'

async function getRecentMints(umi: Umi, page: number, limit: number) {
  const result = await umi.rpc.getAssetsByGroup({
    groupKey: 'collection',
    groupValue: COLLECTION_PUBLIC_KEY.toString(),
    page,
    limit,
    sortBy: {
      sortBy: 'created',
      sortDirection: 'desc',
    },
  })

  return result
}

export function useGetRecentMints() {
  const umi = useUmi()

  return useInfiniteQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['recent-mints'],
    queryFn: ({ pageParam = 1 }) => getRecentMints(umi, pageParam, 10),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.items.length < 10) return undefined
      return allPages.length + 1
    },
    initialPageParam: 1,
  })
}
