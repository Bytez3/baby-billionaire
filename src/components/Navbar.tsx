import { useState } from 'react'
import { HiMenu, HiX } from 'react-icons/hi'
import dasboard from '/assets/dasboard.svg'
import bank from '/assets/bank.svg'
import icon1 from '/assets/icon1.svg'
import { useCandyMachine } from '../hooks/useUmi'
import {
  WalletMultiButton,
  useWalletModal,
} from '@solana/wallet-adapter-react-ui'
import '@solana/wallet-adapter-react-ui/styles.css'
import '../styles/wallet-overrides.css'
import { useWallet } from '@solana/wallet-adapter-react'
import { Link } from 'react-router-dom'
import { FaRegClock } from 'react-icons/fa'
import protocols from '/assets/protocols.svg'
import treasury from '/assets/treasury.svg'
import { CiSearch } from 'react-icons/ci'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { connected } = useWallet()

  const { candyMachineQuery } = useCandyMachine()
  const { setVisible } = useWalletModal()

  // Extract candy machine data
  const candyMachine = candyMachineQuery.data
  const isLoading = candyMachineQuery.isLoading
  // Get total items available and items redeemed
  const totalItems = Number(candyMachine?.data.itemsAvailable)
  const itemsRedeemed = Number(candyMachine?.itemsRedeemed)
  // Calculate percentage
  const percentage = ((itemsRedeemed / totalItems) * 100).toFixed(2)

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-4 gap-1 md:gap-3 ">
        <div className="flex items-center bg-[#00000080] gap-4 border border-[#FFAE7E80] px-4 py-3 rounded-2xl w-[60%] ">
          <CiSearch />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-white placeholder-gray-300 w-full "
          />
        </div>

        <div className="flex items-center gap-6">
          <div className=" bg-[#00000080] border border-[#FFAE7E80] px-5 py-4 rounded-2xl flex items-center justify-center cursor-pointer">
            <img src="/assets/bell.svg" className="w-5 h-5" />
          </div>

          <div
            className="bg-[#00000080] border border-[#FFAE7E80]  items-center px-6 py-1 rounded-2xl lg:flex hidden"
            onClick={() => setVisible(true)}
          >
            {!connected && (
              <img src="/assets/wallet.svg" className="mr-2 flex" />
            )}
            <div className="wallet-button-custom">
              <WalletMultiButton />
            </div>
          </div>

          <div className=" xl:hidden flex justify-end">
            <button
              className=" text-white text-3xl"
              onClick={() => setOpen(!open)}
            >
              {open ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </div>

      <div
        className="
    w-full text-stroke-light
    md:bg-nav             /* activate bg-nav at md and above */
    bg-no-repeat bg-center bg-cover
    rounded-xl 
    py-10 sm:py-10 md:py-14 lg:py-12 xl:py-16
  "
      >
        <div className="max-w-screen-xxl w-full px-2 sm:px-6 flex flex-col md:flex-row justify-between items-center">
          <h1
            className="
                            font-bold uppercase luckiest-guy-regular text-white text-stroke-orange
                            text-3xl sm:text-4xl md:text-3xl lg:text-3xl xl:text-4xl
                            leading-tight tracking-wide w-full md:w-[50%] md:text-left text-center
                        "
          >
            Baby Billionaires Club
          </h1>

          <div className="flex items-center w-full md:w-[50%] justify-end lg:justify-between ">
            <div className="flex flex-col text-white w-full md:w-[90%] md:mt-0 mt-4 ">
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-sm md:text-base lg:text-lg w-full">
                    <span className="text-[#FFFFFF] text text-md  lg:text-2xl xl:text-3xl">
                      Total Minted
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-[#F2F2F3] text-md lg:text-2xl xl:text-3xl">
                        {percentage}%
                      </span>
                      <span className="text-[#FFFFFF] whitespace-nowrap text-md lg:text-2xl xl:text-3xl">
                        {itemsRedeemed} / {totalItems}
                      </span>
                    </div>
                  </div>

                  <div className="md:w-[350px] w-full h-4 xl:h-5 bg-black/60 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-orange-300 to-orange-600"
                      style={{ width: `${percentage}%` }}
                      // style={{ width: `0%` }}
                    ></div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div
          className="
                        xl:hidden 
                        absolute left-0 top-18 w-full 
                        bg-black text-white z-50
                        py-6 px-6 space-y-6
                        animate-fadeIn rounded-xl 
                    "
        >
          <div className="lg:hidden"></div>
          <div className="bg-[#00000080] border border-[#FFAE7E80] justify-center  items-center px-6 py-1 rounded-2xl flex">
            {!connected && (
              <img src="/assets/wallet.svg" className="mr-2 flex" />
            )}

            <div className="">
              <WalletMultiButton />
            </div>
          </div>
          <nav className="flex flex-col gap-5 text-lg py-4">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 hover:text-orange-300 transition"
            >
              <img src={dasboard} /> Dashboard
            </Link>

            <Link
              to="collection"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 hover:text-orange-300 transition"
            >
              <img src="/assets/collection.svg" /> Your Collection
            </Link>

            <Link
              to="mint"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 hover:text-orange-300 transition"
            >
              <img src={protocols} /> Mint NFTs
            </Link>

            <button className="flex items-center gap-3 hover:text-orange-300 transition">
              <img src={bank} /> Baby Bank
              <div className="flex items-center bg-[#FF5F0080] rounded-md px-1 gap-2 py-0.5">
                <FaRegClock />
                <span className=" text-xs px-2  py-1  ">COMING SOON</span>
              </div>
            </button>
            <button className="flex items-center gap-3 hover:text-orange-300 transition">
              <img src={treasury} /> Treasury
              <div className="flex items-center bg-[#FF5F0080] rounded-md px-1 gap-2 py-0.5">
                <FaRegClock />
                <span className=" text-xs px-2  py-1  ">COMING SOON</span>
              </div>
            </button>
            <button className="flex items-center gap-3 hover:text-orange-300 transition">
              <img src="/assets/gitbook.svg" /> Docs
            </button>
            {/* <button className="flex items-center gap-3 hover:text-orange-300 transition">
              <img src='/assets/document-text.svg' /> Documents

            </button> */}

            <Link
              to="https://babybillionaires.club/"
              className="flex items-center gap-3  text-red-400 hover:text-red-500 transition  border-t border-white/10"
            >
              <img src={icon1} /> Log Out
            </Link>
          </nav>
        </div>
      )}
    </div>
  )
}
