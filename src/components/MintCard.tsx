import { HiOutlineLockOpen, HiLockClosed } from 'react-icons/hi'
import Trump from '/assets/Trump.svg'
import { FaCircle } from 'react-icons/fa'
import { GrSubtract } from 'react-icons/gr'
import { TbPlus } from 'react-icons/tb'
import { useState, useEffect } from 'react'
import { MdInfoOutline } from 'react-icons/md'
import { useCandyMachine, useUmi } from '../hooks/useUmi'
import { useWallet } from '@solana/wallet-adapter-react'
import { toast } from 'react-toastify'
import {
  type WrappedInstruction,
  generateSigner,
  transactionBuilder,
  unwrapOption,
  sol,
  amountToNumber,
} from '@metaplex-foundation/umi'
import { mintV2 } from '@metaplex-foundation/mpl-candy-machine'
import {
  setComputeUnitLimit,
  setComputeUnitPrice,
} from '@metaplex-foundation/mpl-toolbox'
import { base58 } from '@metaplex-foundation/umi/serializers'
import { apiClient } from '../lib/axios'
import type { Stage } from '../types'
import { useGetWhitelistedUser } from '../hooks/useGetWhitelistedUser'
import { useWalletBalance } from '../hooks/useWalletBalance'
import { WHITELIST_SALE_START, PUBLIC_SALE_START } from '../constants'
import { useGetMintStats } from '../hooks/useGetMintStats'

type Props = {
  stage?: Stage
  selectedImage?: any
}

export default function MintCard({ stage, selectedImage }: Props) {
  const [count, setCount] = useState(1)
  const [minting, setMinting] = useState(false)
  const [agree, setAgree] = useState(false)

  const { connected, publicKey: userAddress } = useWallet()
  const umi = useUmi()
  const { candyMachineQuery, candyGuardQuery } = useCandyMachine()

  const whitelistedUserQuery = useGetWhitelistedUser()
  const whitelistedUser = whitelistedUserQuery.data

  const walletBalanceQuery = useWalletBalance()
  const walletBalance = walletBalanceQuery.data ?? 0

  const mintStatsQuery = useGetMintStats()
  const mintStats = mintStatsQuery.data

  const candyGuard = candyGuardQuery.data
  const group = candyGuard?.groups.find((g) => g.label === stage)
  const groupAmount = group
    ? amountToNumber(unwrapOption(group.guards.solPayment)?.lamports ?? sol(0))
    : 0

  // Calculate remaining whitelist mints for the user
  // const remainingWhitelistMints = whitelistedUser
  //   ? 3 - whitelistedUser.minted.whitelist
  //   : 0

  // Determine max count based on stage
  // const getMaxCount = () => {
  //   if (stage === 'jkp') return 1
  //   if (stage === 'wl') return Math.min(remainingWhitelistMints, 2)
  //   return 2 // public
  // }

  // const maxCount = getMaxCount()

  // useEffect(() => {
  //   if (stage === 'jkp') {
  //     setCount(1)
  //   } else if (stage === 'wl') {
  //     setCount(Math.max(1, maxCount))
  //   }
  // }, [stage, maxCount])

  // Reset count to 1 when stage changes to "jkp"
  // useEffect(() => {
  //   if (stage === 'jkp' && count > 1) {
  //     setCount(1)
  //   }
  //   // Reset count if it exceeds max for whitelist
  //   if (stage === 'wl' && count > maxCount) {
  //     setCount(Math.max(1, maxCount))
  //   }
  // }, [stage, count, maxCount])

  const handleMintNft = async () => {
    if (!connected || !userAddress) {
      toast.error('Please connect your wallet to mint.')
      return
    }

    if (!whitelistedUser) {
      toast.error('You are not eligible to mint at this time.')
      return
    }

    // Check if the sale has started based on the stage
    const currentTime = Date.now()
    if (stage === 'wl' && currentTime < WHITELIST_SALE_START) {
      toast.error('Whitelist sale has not started yet.')
      return
    }
    if (stage === 'public' && currentTime < PUBLIC_SALE_START) {
      toast.error('Public sale has not started yet.')
      return
    }

    if (!agree) {
      toast.error('You must agree to the terms before minting.')
      return
    }

    if (mintStats && mintStats?.totalWhitelist + count > 3000) {
      toast.error('Whitelist mint limit reached.')
      return
    }

    const candyMachine = candyMachineQuery.data

    if (!candyMachine || !candyGuard) {
      toast.error('Candy Machine is not loaded yet. Please try again later.')
      return
    }

    if (!group) {
      toast.error('Selected minting stage is not available.')
      return
    }

    const nftsToMint = Array.from({ length: count }).map(() =>
      generateSigner(umi),
    )

    const toastId = toast.loading('Minting in progress...')
    setMinting(true)

    try {
      const wrappedInstructions: WrappedInstruction[] = []

      for (const nftMint of nftsToMint) {
        const items = mintV2(umi, {
          candyGuard: candyMachine.mintAuthority,
          candyMachine: candyMachine.publicKey,
          collectionMint: candyMachine.collectionMint,
          collectionUpdateAuthority: candyMachine.authority,
          nftMint,
          tokenStandard: candyMachine.tokenStandard,
          group: group?.label,
          mintArgs: {
            solPayment: group?.guards.solPayment,
          },
        }).items

        wrappedInstructions.push(...items)
      }

      // Build transaction
      const builder = transactionBuilder()
        .add(setComputeUnitPrice(umi, { microLamports: 200_000 }))
        .add(setComputeUnitLimit(umi, { units: 400_000 + count * 200_000 }))
        .add(wrappedInstructions)

      // Build transaction WITHOUT signing yet
      let transaction = await builder.build(umi)
      
      // STEP 1: Phantom wallet signs FIRST (recommended by Phantom's Lighthouse security)
      // This ensures compatibility with Phantom's security system
      transaction = await umi.identity.signTransaction(transaction)
      
      // STEP 2: Additional signers (NFT mints) sign AFTERWARD using partialSign
      // This follows the correct signing order: Phantom first, then additional signers
      for (const nftMint of nftsToMint) {
        transaction = await nftMint.signTransaction(transaction)
      }

      // Send the fully signed transaction
      const sig = await umi.rpc.sendTransaction(transaction)
      const sigString = base58.deserialize(sig)[0]

      let confirming = true
      while (confirming) {
        const [updatedStatus] = await umi.rpc.getSignatureStatuses([sig])

        if (updatedStatus && updatedStatus.commitment === 'finalized') {
          confirming = false
        }
        if (updatedStatus?.error) {
          throw new Error(
            `Transaction failed: ${updatedStatus.error.toString()}`,
          )
        }

        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      if (stage === 'jkp') {
        await apiClient.post(
          `/api/user/claim-jackpot/${userAddress.toString()}`,
        )
      }

      // Increment mint count
      if (stage) {
        const mintType =
          stage === 'jkp' ? 'jackpot' : stage === 'wl' ? 'whitelist' : 'public'

        // Increment for each NFT minted
        for (let i = 0; i < count; i++) {
          await apiClient.post(
            `/api/mint/${userAddress.toString()}/increment`,
            { type: mintType },
          )
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast.update(toastId, {
        render: (
          <div>
            Mint successful!{' '}
            <a
              href={`https://solscan.io/tx/${sigString}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              View on Solscan
            </a>
          </div>
        ),
        type: 'success',
        isLoading: false,
      })

      setMinting(false)

      window.location.reload()
    } catch (error) {
      console.error('Minting error:', error)

      toast.update(toastId, {
        render: `Minting failed: ${
          error instanceof Error ? error.message : error
        }`,
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      })

      setMinting(false)
    }
  }

  const [displayImage, setDisplayImage] = useState(Trump)
  const [fade, setFade] = useState(false)

  useEffect(() => {
    if (!selectedImage) return

    // Start fade-out animation
    setFade(true)

    const timeout = setTimeout(() => {
      setDisplayImage(selectedImage) // Change image
      setFade(false) // Fade-in
    }, 200) // fade duration

    return () => clearTimeout(timeout)
  }, [selectedImage])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full mt-8">
      <div className="col-span-12 lg:col-span-5 flex items-center justify-center">
        <img
          src={displayImage}
          alt="NFT Preview"
          className={`
    rounded-xl w-full h-full object-cover
    transition-opacity duration-300
    ${fade ? 'opacity-0' : 'opacity-100'}
  `}
        />
      </div>

      <div className="col-span-12 lg:col-span-7 flex flex-col bg-[#15131580] border border-[#FFAE7E80] rounded-2xl p-4 md:p-6">
        <div className="p-4">
          <div className="flex items-center gap-4 mb-3 justify-between">
            <div className="text-sm md:text-lg lg:text-2xl font-bold text-[#FFFFFF]">
              <h2 className="text-md md:text-lg font-semibold text-white mb-2">
                Price
              </h2>
              {groupAmount} SOL
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-4xl border border-[#41E78A] flex text-[#F2F2F3] items-center text-md md:text-lg px-2 md:px-4 py-2 gap-2">
                {whitelistedUser ? (
                  <>
                    <HiOutlineLockOpen className="text-xl" /> Eligible
                  </>
                ) : (
                  <>
                    <HiLockClosed className="text-xl" /> Not Eligible
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <FaCircle className="text-sm md:text-xl text-[#2ADF72] " />{' '}
                <span className="text-sm md:text-xl text-[#F2F2F3]">
                  {stage === 'jkp'
                    ? 'Jackpot'
                    : stage === 'wl'
                    ? 'Whitelist'
                    : stage === 'public'
                    ? 'Public'
                    : 'No Stage Selected'}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6 w-full">
            <div className="md:w-2/5 bg-[#0A070E80] border border-[#FF9455] p-2 flex items-center justify-between rounded-lg ">
              <div
                onClick={() => setCount(Math.max(1, count - 1))}
                className={`p-4 rounded-md text-[#F2F2F3] transition ${
                  count <= 1
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer hover:bg-[#FF7422]'
                }`}
              >
                <GrSubtract />
              </div>
              {count}
              <div className={`p-4 rounded-md text-[#F2F2F3] transition`}>
                <TbPlus onClick={() => setCount(count + 1)} />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-6">
            <h2 className="text-[#FFFFFF] text-md md:text-lg lg:text-2xl ">
              Mint Fee
            </h2>
            <div className="flex items-center gap-1 text-md md:text-lg lg:text-2xl">
              <p>{(count * groupAmount).toFixed(2)}</p>{' '}
              <span className="text-[#FFAE7E] ">SOL</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-6">
            <h2 className="text-[#FFFFFF] text-md md:text-lg lg:text-2xl flex items-center gap-2">
              Protocol Fee <MdInfoOutline className="text-2xl" />
            </h2>
            <div className="flex items-center gap-1 text-md md:text-lg lg:text-2xl">
              <p>0.0005</p> <span className="text-[#FFAE7E]">SOL</span>
            </div>
          </div>
          {/* <div className="flex items-center justify-between mt-6">
            <h2 className="text-[#FFFFFF] text-md md:text-lg lg:text-2xl ">
              Priority Fee <span className="underline">(Standard)</span>
            </h2>
          </div> */}
          <div className="flex items-center gap-2 mt-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={agree}
                onChange={() => setAgree(!agree)}
                className="
                  peer h-5 w-5 appearance-none
                  border border-gray-400 rounded-md
                  checked:bg-[#FB6A14] checked:border-[#FB6A14]
                  transition
                "
              />

              <span
                className="
                pointer-events-none
                absolute ml-1
                text-white text-sm font-bold
                opacity-0
                peer-checked:opacity-100
                transition
              "
              >
                ✓
              </span>
            </label>

            <p className="text-sm md:text-lg lg:text-xl">
              By clicking "mint", you agree to the{' '}
              <span className="font-bold">Baby Billionaires of Service</span>{' '}
            </p>
          </div>
          <button
            onClick={handleMintNft}
            disabled={minting || walletBalance < count * groupAmount}
            className="bg-orange-500 w-full text-md md:text-xl py-5 rounded-lg font-normal text-white hover:bg-orange-600 transition mt-6 cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {minting ? 'Minting...' : 'Mint'}
          </button>

          {walletBalance < count * groupAmount && (
            <div className="mt-2">
              <p className="text-[#ECB613] text-md md:text-lg text-center ">
                You don't have enough funds to mint. Try another currency.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
