import { useEffect, useRef } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom'
import { useGetRecentMints } from '../hooks/useGetRecentMints'

export default function Dashboard() {
  const isXXL = useMediaQuery({ minWidth: 1868 })
  const isXL = useMediaQuery({ minWidth: 1680 })
  const isLG = useMediaQuery({ minWidth: 1494 })
  const isLG1 = useMediaQuery({ minWidth: 1390 })
  const isLG2 = useMediaQuery({ minWidth: 1290 })
  const isMD1 = useMediaQuery({ minWidth: 1124 })
  const isMD2 = useMediaQuery({ minWidth: 868 })
  const isMD = useMediaQuery({ minWidth: 768 })
  const isSM = useMediaQuery({ minWidth: 648 })
  const isSM1 = useMediaQuery({ minWidth: 493 })
  const isSM2 = useMediaQuery({ minWidth: 435 })
  const titleSize = isXXL
    ? 'text-[38px]'
    : isXL
      ? 'text-[34px]'
      : isLG
        ? 'text-[30px]'
        : isLG1
          ? 'text-[28px]'
          : isLG2
            ? 'text-[24px]'
            : isMD1
              ? 'text-[46px]'
              : isMD2
                ? 'text-[35px]'
                : isMD
                  ? 'text-[26px]'
                  : isSM
                    ? 'text-[24px]'
                    : isSM1
                      ? 'text-[20px]'
                      : isSM2
                        ? 'text-[16px]'
                        : 'text-[16px]'
  const subHeadingSize = isXXL
    ? 'text-[18px]'
    : isXL
      ? 'text-[18px]'
      : isLG
        ? 'text-[18px]'
        : isLG1
          ? 'text-[13px]'
          : isLG2
            ? 'text-[14px]'
            : isMD1
              ? 'text-[26px]'
              : isMD2
                ? 'text-[20px]'
                : isMD
                  ? 'text-[14px]'
                  : isSM
                    ? 'text-[14px]'
                    : isSM1
                      ? 'text-[12px]'
                      : isSM2
                        ? 'text-[12px]'
                        : 'text-[10px]'

  const observerTarget = useRef<HTMLDivElement>(null)
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetRecentMints()

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

  const allNfts = data?.pages.flatMap((page) => page.items) || []

  return (
    <div className="mt-8">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-8  ">
          <div className="bg-dashboard-frame max-h-42 sm:max-h-62 md:max-h-72 lg:max-h-82 xl:max-h-92 py-10   rounded-xl  border border-[#FFAE7E80]  flex items-center justify-between relative ">
            <div className="flex flex-col gap-6 relative translate-x-4 sm:translate-x-10  ">
              <h1
                className={`text-white pt-4 tracking-widest text-stroke-orange luckiest-guy-regular leading-tight ${titleSize}`}
              >
                THE NEXT GEN BILLIONAIRES <br /> ARE MINTING RIGHT NOW
              </h1>

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1 xl:gap-4">
                  <h2
                    className={`luckiest-guy-regular tracking-widest text-white font-semibold ${subHeadingSize}`}
                  >
                    YOUR JOURNEY STARTS HERE
                  </h2>
                  <Link
                    to="/mint"
                    className={`bg-[#FB6A14] flex items-center justify-center tracking-widest luckiest-guy-regular  text-white font-bold px-3 py-2 rounded-lg text-xs sm:text-sm md:text-lg shadow-md hover:bg-orange-600 w-full mt-4`}
                  >
                    MINT NOW
                  </Link>
                </div>
              </div>
            </div>
          </div>


        </div>

      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-8">
          <div className="mt-8">
            <h2 className="text-2xl md:text-3xl text-stroke-orange font-bold luckiest-guy-regular text-white mb-6">
              Recent Mints
            </h2>

            {/* AUTO height until 3 rows, then scroll */}
            <div className="relative pr-2 max-h-[850px] overflow-y-auto hide-scrollbar">
              {isLoading ? (
                <div className="flex items-center justify-between py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              ) : allNfts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {allNfts.map((nft) => {
                      const imageUrl =
                        nft.content?.links &&
                          typeof nft.content.links === "object"
                          ? (nft.content.links as Record<string, any>).image
                          : undefined;

                      return (
                        <div
                          key={nft.id}
                          className="bg-[#15131580] border border-[#FFAE7E80] rounded"
                        >
                          <div className="aspect-square bg-gray-800">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={nft.content?.metadata?.name || "NFT"}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.currentTarget.src = "/assets/Trump.svg")}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500">
                                No Image
                              </div>
                            )}
                          </div>
                          <div className="p-1">
                            <h3 className="text-white text-center luckiest-guy-regular tracking-wider text-lg">
                              #{(nft.content?.metadata?.name || "").split(" ").pop()}
                            </h3>
                          </div>
                        </div>
                      );
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
                  <p className="text-xl luckiest-guy-regular mt-6">Not Live Yet</p>
                </div>
              )}
            </div>
          </div>
        </div>


        <div className="col-span-12 xl:col-span-4 -mt-78">
          <div className="bg-[#00000080] rounded-2xl">
            <h2 className="px-4 text-center py-3 text-xl md:text-2xl text-stroke-orange font-bold luckiest-guy-regular text-white tracking-widest border-b border-[#FFAE7E80]">
              Latest Mint Activity 🔥
            </h2>

            {/* FIXED HEIGHT */}
            <div className="h-[700px] overflow-y-auto hide-scrollbar">
              {allNfts?.length > 0 ? (
                allNfts.map((nft) => (
                  <h3
                    key={nft.id}
                    className="p-4 text-[#FFFFFF] flex items-center luckiest-guy-regular bg-[#0000004D] border-b border-[#A46B4B] justify-between font-semibold text-lg"
                  >
                    <img src="/assets/light.svg" />
                    <span className="tracking-widest">New NFT Minted</span>

                    <a
                      href={`https://solscan.io/account/${nft.id}`}
                      target="_blank"
                      className="font-bold text-white tracking-wide"
                    >
                      # {nft.content.metadata.name.split(" ")[1]}
                    </a>

                    <a
                      href={`https://solscan.io/account/${nft.ownership.owner}`}
                      target="_blank"
                      className="text-[#FF9759] tracking-wide"
                    >
                      {nft.ownership.owner.slice(0, 4)}...
                      {nft.ownership.owner.slice(-4)}
                    </a>
                  </h3>
                ))
              ) : (
                <div className="flex justify-center items-center h-full">
                  <h2 className="text-2xl luckiest-guy-regular">Not Live Yet</h2>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>


    </div>
  )
}
