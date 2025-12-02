import { useState, useRef, useEffect } from 'react'
import { HiOutlineLockOpen, HiLockClosed } from 'react-icons/hi'
import { IoIosArrowDown } from 'react-icons/io'
import { RiQuestionLine } from 'react-icons/ri'
import { FaCircle } from 'react-icons/fa'
import { useGetUser } from '../hooks/useGetUser'
import type { Stage } from '../types'
import { useGetWhitelistedUser } from '../hooks/useGetWhitelistedUser'
import { useGetMintStats } from '../hooks/useGetMintStats'
import {
  WHITELIST_SALE_START,
  PUBLIC_SALE_START,
  JACKPOT_MAX_LIMIT,
} from '../constants'

type Props = {
  stage?: Stage
  onStageChange: (newStage: Stage) => void
  onImageSelect: any
}

export default function AboutSection({
  stage,
  onStageChange,
  onImageSelect,
}: Props) {
  const [open, setOpen] = useState(false)
  const [maxHeight, setMaxHeight] = useState(0)
  const [currentTime, setCurrentTime] = useState(() => Date.now())

  const contentRef = useRef<HTMLDivElement>(null)

  const userQuery = useGetUser()
  const whitelistedUserQuery = useGetWhitelistedUser()
  const mintStatsQuery = useGetMintStats()

  const user = userQuery.data
  const mintStats = mintStatsQuery.data

  const isEligableForJackpot =
    user?.gameStats?.hasWonJackpot && !user?.hasClaimedJackpot

  const whitelistedUser = whitelistedUserQuery.data
  const isWhitelistFull = mintStats ? mintStats.totalWhitelist >= 3000 : false
  const isJackpotListFull = mintStats
    ? mintStats.totalJackpot >= JACKPOT_MAX_LIMIT
    : false
  const hasReachedWhitelistLimit = whitelistedUser
    ? whitelistedUser.minted.whitelist >= 3
    : false

  const isWhitelistStarted = currentTime >= WHITELIST_SALE_START
  const isPublicStarted = currentTime >= PUBLIC_SALE_START

  useEffect(() => {
    if (open && contentRef.current) {
      setMaxHeight(contentRef.current.scrollHeight)
    } else {
      setMaxHeight(0)
    }
  }, [open])

  // Update current time every second to check if sales have started
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [])
  const [timeLeft, setTimeLeft] = useState<number>(
    PUBLIC_SALE_START - Date.now(),
  )

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = PUBLIC_SALE_START - Date.now()
      setTimeLeft(diff > 0 ? diff : 0)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const hours = Math.floor(timeLeft / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)

    const hours = date.getUTCHours().toString().padStart(2, '0')
    const minutes = date.getUTCMinutes().toString().padStart(2, '0')

    return `${hours}:${minutes}`
  }

  const images = [
    '/assets/mint-frame.svg',
    '/assets/mint-frame-1.svg',
    '/assets/mint-frame-2.svg',
    '/assets/mint-frame-3.svg',
  ]

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full md:mt-8">
        <div className="col-span-12 lg:col-span-5 ">
          {/* <div className="col-span-12 md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
            <div className="w-full h-auto rounded-xl overflow-hidden">
              <img
                src="/assets/mint-frame.svg"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full h-auto rounded-xl overflow-hidden">
              <img
                src="/assets/mint-frame-1.svg"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full h-auto rounded-xl overflow-hidden">
              <img
                src="/assets/mint-frame-2.svg"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full h-auto rounded-xl overflow-hidden">
              <img
                src="/assets/mint-frame-3.svg"
                className="w-full h-full object-cover"
              />
            </div>
          </div> */}
          <div className="col-span-12 md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
            {images.map((img, i) => (
              <div
                key={i}
                className="w-full h-auto rounded-xl overflow-hidden cursor-pointer"
                onClick={() => onImageSelect(img)} // send selected image
              >
                <img
                  src={img}
                  className="w-full h-full object-cover hover:opacity-80 transition"
                />
              </div>
            ))}
          </div>
          <div className="bg-[#00000080] border border-[#FFAE7E80] p-6 rounded-xl text-white shadow-xl mt-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <h2 className="text-xl font-bold">
                About the Baby Billionaires Club
              </h2>

              <IoIosArrowDown
                className={`text-2xl transition-transform ${
                  open ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </div>

            <p className="text-[#FFFFFF] text-md leading-6 mt-4">
              Baby Billionaires are 1-of-1 degens stomping around Solana. We're
              unleashing 6,969 hand-drawn babies — inspired by streetwear,
              hip-hop, and the cartoon mischief you grew up on. This is the Baby
              Billionaire front-row seat to Web3's most meme-driven culture.
            </p>
            <div
              ref={contentRef}
              style={{
                maxHeight: maxHeight,
              }}
              className="overflow-hidden transition-all duration-500"
            >
              <h3 className="text-md font-bold mt-4 mb-2 text-[#F2F2F3] ">
                The Value Proposition
              </h3>
              <p className="text-[#FFFFFF] leading-6">
                Minting a Baby Billionaire isn't just acquiring a unique PFP;
                it's your all-access pass to the Baby Billionaire Club, an
                exclusive ecosystem designed for Solana's most ambitious degens.
                NFTs are the key to value that extends far beyond the art.
              </p>
              <ul className="list-disc list-outside pl-6 mt-4 space-y-3 text-[#FFFFFF] text-md leading-6">
                <li>
                  <span className="font-semibold">Elite Crypto Education:</span>{' '}
                  Elevate your DeFi game with exclusive access to curated crypto
                  education. Whether you're a seasoned trader or just starting,
                  our resources sharpen your skills and keep you ahead in the
                  fast-paced Web3 ecosystem.
                </li>

                <li>
                  <span className="font-semibold">
                    Cutting-Edge Trading Analytics:
                  </span>{' '}
                  Gain a significant edge with powerful trading analytics. The
                  Babyverse gives you the insights you need to make informed
                  decisions and navigate markets like a pro.
                </li>

                <li>
                  <span className="font-semibold">
                    Exclusive Community & Networking:
                  </span>{' '}
                  Connect with Solana's boldest degens in a private club
                  setting. Share alpha, collaborate on projects, and build
                  powerful relationships inside a forward-thinking community.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7 h-[600px] sm:bg-[#00000080] sm:p-4 sm:rounded-xl sm:shadow-xl sm:border sm:border-[#FFAE7E80] text-white">
          <div className="grid grid-cols-1 gap-4 sm:gap-8  rounded-lg">
            {/* JACPOT STAGE */}
            <div
              onClick={() => {
                if (isEligableForJackpot && !isJackpotListFull) {
                  onStageChange('jkp')
                }
              }}
              className={`bg-[#00000054] rounded-xl border border-[#FFAE7E80] p-2 sm:p-4 ${
                stage === 'jkp' ? 'border-green-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="rounded-4xl border border-[#41E78A]">
                    <div className="flex items-center gap-2 px-4 py-2">
                      {isEligableForJackpot ? (
                        <>
                          <HiOutlineLockOpen className="text-xl" />
                          Eligible
                        </>
                      ) : (
                        <>
                          <HiLockClosed className="text-xl" />
                          Not Eligible
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-[#00000080] p-2 sm:p-4 rounded-md gap-2 sm:gap-4 flex items-center justify-between">
                    <p className="text-[#FFFFFF] text-xl">Jackpot Mint</p>
                    <RiQuestionLine className="text-[#FB6A14] text-2xl " />
                  </div>
                </div>
                <h2 className="text-[#FFFFFF] text-lg lg:text-2xl ">
                  {/* {isEligableForJackpot
                    ? 'LIVE'
                    : isJackpotListFull
                      ? 'FULL'
                      : 'CLOSED'} */}
                  Live
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-[#FFAE7E80] text-lg mt-4 ">
                  {' '}
                  Mint Limit: <span className="text-white">1</span>{' '}
                </p>
                <p className="text-[#FFAE7E80] text-lg mt-4 ">
                  {' '}
                  Price: <span className="text-white">FREE</span>{' '}
                </p>
                <p className="text-[#FFAE7E80] text-lg mt-4 ">
                  {' '}
                  Minted:{' '}
                  <span className="text-white">
                    {/* {isEligableForJackpot ? '0' : '1'} */}
                    {whitelistedUser?.minted.jackpot ?? 0}
                  </span>
                </p>
              </div>
              <div className="w-full h-2 bg-black/60 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-linear-to-r from-orange-300 to-orange-600"
                  style={{
                    width: `${
                      mintStats
                        ? (mintStats.totalJackpot / JACKPOT_MAX_LIMIT) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <div className="flex itmes-center justify-between mt-1">
                <p>Total Minted during Stage </p>
                <p>
                  {mintStats
                    ? `${Math.round(
                        (mintStats.totalJackpot / JACKPOT_MAX_LIMIT) * 100,
                      )}% (${mintStats.totalJackpot}/32)`
                    : '0% (0/32)'}
                </p>
              </div>
            </div>

            {/* WHITELIST STAGE */}
            <div
              onClick={() => {
                if (
                  whitelistedUser &&
                  !isWhitelistFull &&
                  !hasReachedWhitelistLimit
                ) {
                  onStageChange('wl')
                }
              }}
              className={`bg-[#00000054] rounded-xl border border-[#FFAE7E80] p-2 sm:p-4 ${
                stage === 'wl' ? 'border-green-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="rounded-4xl border border-[#41E78A]">
                    <div className="flex items-center gap-2 px-4 py-2">
                      {whitelistedUser &&
                      !isWhitelistFull &&
                      !hasReachedWhitelistLimit ? (
                        <>
                          <HiOutlineLockOpen className="text-xl" />
                          Eligible
                        </>
                      ) : (
                        <>
                          <HiLockClosed className="text-xl" />
                          {!isWhitelistStarted
                            ? 'Not Started'
                            : hasReachedWhitelistLimit
                            ? 'Limit Reached'
                            : isWhitelistFull
                            ? 'Full'
                            : 'Not Eligible'}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-[#00000080] p-2 sm:p-4 rounded-md gap-2 sm:gap-4 flex items-center justify-between">
                    <p className="text-[#FFFFFF] text-xl">Whitelist</p>
                    <RiQuestionLine className="text-[#FB6A14] text-2xl " />
                  </div>
                </div>
                <h2 className="text-[#FFFFFF] text-lg lg:text-2xl ">
                  {/* {isWhitelistFull
                    ? 'ENDED'
                    : isWhitelistStarted
                      ? 'LIVE'
                      : 'NOT STARTED'} */}{' '}
                  Live
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-[#FFAE7E80] text-lg mt-4 ">
                  {' '}
                  Mint Limit: <span className="text-white">3</span>{' '}
                </p>
                <p className="text-[#FFAE7E80] text-lg mt-4 ">
                  {' '}
                  Price: <span className="text-white">0.15 SOL</span>{' '}
                </p>
                <p className="text-[#FFAE7E80] text-lg mt-4 ">
                  {' '}
                  Minted:{' '}
                  <span className="text-white">
                    {whitelistedUserQuery.isLoading
                      ? '...'
                      : whitelistedUser?.minted.whitelist ?? 0}
                  </span>{' '}
                </p>
              </div>
              <div className="w-full h-2 bg-black/60 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-linear-to-r from-orange-300 to-orange-600"
                  style={{
                    width: `${
                      mintStats ? (mintStats.totalWhitelist / 3000) * 100 : 0
                    }%`,
                  }}
                ></div>
              </div>
              <div className="flex itmes-center justify-between mt-1">
                <p>Total Minted during Stage </p>
                <p>
                  {mintStats
                    ? `${Math.round(
                        (mintStats.totalWhitelist / 3000) * 100,
                      )}% (${mintStats.totalWhitelist}/3,000)`
                    : '0% (0/3,000)'}
                </p>
              </div>
            </div>

            {/* PUBLIC STAGE */}
            <div
              onClick={() => {
                if (isPublicStarted) {
                  onStageChange('public')
                }
              }}
              className={`bg-[#00000054] rounded-xl border border-[#FFAE7E80] p-2 sm:p-4 ${
                stage === 'public' ? 'border-green-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-4xl border border-[#41E78A]">
                    <div className="flex items-center gap-2 px-4 py-2">
                      {isPublicStarted ? (
                        <>
                          <HiOutlineLockOpen className="text-xl" /> Eligible
                        </>
                      ) : (
                        <>
                          <HiLockClosed className="text-xl" /> Not Started
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-[#00000080] p-2 rounded-md gap-4 flex items-center justify-between">
                    <FaCircle className="text-xs md:text-lg lg:text-xl text-[#2ADF72] " />
                    <p className="text-[#FFFFFF] text-xs md:text-lg lg:text-xl">
                      Public
                    </p>
                    <RiQuestionLine className="text-[#FB6A14] text-2xl " />
                  </div>
                </div>
                <h2 className="text-[#FFFFFF] text-xs sm:text-lg lg:text-2xl">
                  {timeLeft > 0
                    ? `Live in ${hours.toString().padStart(2, '0')}:${minutes
                        .toString()
                        .padStart(2, '0')}:${seconds
                        .toString()
                        .padStart(2, '0')}`
                    : `LIVE at ${formatTime(PUBLIC_SALE_START)}`}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                {/* <p className="text-[#FFAE7E80] text-lg mt-4 ">
                  {' '}
                  Mint Limit: <span className="text-white">10</span>{' '}
                </p> */}
                <p className="text-[#FFAE7E80] text-lg mt-4 ">
                  {' '}
                  Price: <span className="text-white">0.25 SOL</span>{' '}
                </p>
              </div>
              <div className="w-full h-2 bg-black/60 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-linear-to-r from-orange-300 to-orange-600"
                  style={{
                    width: `${
                      mintStats ? (mintStats.totalPublic / 3000) * 100 : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
