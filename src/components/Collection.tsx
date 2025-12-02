import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useUmi } from '../hooks/useUmi'
import type { Umi } from '@metaplex-foundation/umi'
import { COLLECTION_PUBLIC_KEY } from '../constants'
import { useGetRecentMints } from '../hooks/useGetRecentMints'

async function getUserCollections(umi: Umi, page: number, limit: number) {
    const result = await umi.rpc.searchAssets({
        owner: umi.identity.publicKey,
        grouping: ['collection', COLLECTION_PUBLIC_KEY.toString()],
        page,
        limit,
        sortBy: {
            sortBy: 'created',
            sortDirection: 'desc',
        },
    })

    return result
}

const Collection = () => {
    const umi = useUmi()
    const observerTarget = useRef<HTMLDivElement>(null)
    const recentMintsObserverTarget = useRef<HTMLDivElement>(null)

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            // eslint-disable-next-line @tanstack/query/exhaustive-deps
            queryKey: ['user-collection'],
            queryFn: ({ pageParam = 1 }) => getUserCollections(umi, pageParam, 10),
            getNextPageParam: (lastPage, allPages) => {
                if (lastPage.items.length < 10) return undefined
                return allPages.length + 1
            },
            initialPageParam: 1,
        })

    const {
        data: recentMintsData,
        isLoading: recentMintsIsLoading,
        fetchNextPage: fetchNextPageRecentMints,
        hasNextPage: hasNextPageRecentMints,
        isFetchingNextPage: isFetchingNextPageRecentMints,
    } = useGetRecentMints()

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage()
                }
            },
            { threshold: 0.1 },
        )

        if (observerTarget.current) {
            observer.observe(observerTarget.current)
        }

        return () => observer.disconnect()
    }, [fetchNextPage, hasNextPage, isFetchingNextPage])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasNextPageRecentMints &&
                    !isFetchingNextPageRecentMints
                ) {
                    fetchNextPageRecentMints()
                }
            },
            { threshold: 0.1 },
        )

        if (recentMintsObserverTarget.current) {
            observer.observe(recentMintsObserverTarget.current)
        }

        return () => observer.disconnect()
    }, [
        fetchNextPageRecentMints,
        hasNextPageRecentMints,
        isFetchingNextPageRecentMints,
    ])

    const allNfts = data?.pages.flatMap((page) => page.items) || []
    const recentActivities =
        recentMintsData?.pages.flatMap((page) => page.items) || []

    return (
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 xl:col-span-8  ">
                <div className="mt-8">
                    <h2 className="text-2xl md:text-3xl text-stroke-orange font-bold luckiest-guy-regular text-white mb-6">
                        Your Collections
                    </h2>
                    <div className="relative flex justify-center items-center overflow-y-auto hide-scrollbar pr-2">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                            </div>
                        ) : allNfts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                                    {allNfts.map((nft) => {
                                        const imageUrl =
                                            nft.content?.links &&
                                                !Array.isArray(nft.content.links) &&
                                                typeof nft.content.links === 'object'
                                                ? ((nft.content.links as Record<string, unknown>)
                                                    .image as string)
                                                : undefined

                                        return (
                                            <div
                                                key={nft.id}
                                                className="bg-[#15131580] border border-[#FFAE7E80] rounded-xl overflow-hidden hover:scale-102 transition-transform duration-200"
                                            >
                                                <div className="aspect-square bg-gray-800">
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={
                                                                (nft.content?.metadata?.name as string) || 'NFT'
                                                            }
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.src = '/assets/Trump.svg'
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                            No Image
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-1">
                                                    <h3 className="text-white text-center luckiest-guy-regular tracking-wider text-lg">
                                                        #{' '}
                                                        {(nft.content?.metadata?.name as string)
                                                            ?.split(' ')
                                                            .pop() || 'No ID NFT'}
                                                    </h3>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div ref={observerTarget} className="flex justify-center py-8">
                                    {isFetchingNextPage && (
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-center text-xl luckiest-guy-regular mt-6">
                                    You don't own any NFTs in this collection yet.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="col-span-12 xl:col-span-4 mt-8 sm:mt-0">
                <div className="bg-[#00000080]  min-h-64 h-full rounded-2xl ">
                    <h2 className="px-4 text-center py-3 text-xl md:text-2xl text-stroke-orange font-bold luckiest-guy-regular text-white tracking-widest border-b border-[#FFAE7E80]">
                        Latest Mint Activity🔥
                    </h2>
                    <div className="overflow-y-auto max-h-[600px] hide-scrollbar ">
                        {recentMintsIsLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            </div>
                        ) : recentActivities.length > 0 ? (
                            <div className=''>
                                {recentActivities.map((nft) => (
                                    <h3
                                        key={nft.id}
                                        className="p-4 text-white flex items-center luckiest-guy-regular bg-[#0000004D] border-b border-[#A46B4B]  justify-between font-semibold text-lg tracking-wide"
                                    >
                                        <img src='/assets/light.svg' />

                                        <span className='tracking-widest'> Minted New NFT </span>
                                        <a
                                            href={`https://solscan.io/account/${nft.id.toString()}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-bold text-white tracking-wide"
                                        >
                                            #  {nft.content.metadata.name.split(' ')[1]}
                                        </a>
                                        <a
                                            href={`https://solscan.io/account/${nft.ownership.owner.toString()}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#FF9759] tracking-wide"
                                        >
                                            {nft.ownership.owner.toString().slice(0, 4)}...
                                            {nft.ownership.owner.toString().slice(-4)}
                                        </a>{' '}
                                    </h3>
                                ))}
                                <div
                                    ref={recentMintsObserverTarget}
                                    className="flex justify-center py-4"
                                >
                                    {isFetchingNextPageRecentMints && (
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-center text-xl luckiest-guy-regular">
                                    No recent mints yet.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Collection
