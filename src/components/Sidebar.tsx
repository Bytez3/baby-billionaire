import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import dasboard from '/assets/dasboard.svg'
import protocols from '/assets/protocols.svg'
import treasury from '/assets/treasury.svg'
import bank from '/assets/bank.svg'
import icon1 from '/assets/icon1.svg'
import { IoChevronDownSharp } from 'react-icons/io5'
import { MdKeyboardArrowUp } from 'react-icons/md'
import { FaRegClock } from "react-icons/fa6";
import { useMediaQuery } from "react-responsive";

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const [openBank, setOpenBank] = useState(false)
  const [openTreasury, setOpenTreasury] = useState(false)

  const trasuryClick = () => {
    setOpenBank(false);         // close Bank
    setOpenTreasury(prev => !prev);   // toggle Treasury
  };

  const bankClick = () => {
    setOpenTreasury(false);     // close Treasury
    setOpenBank(prev => !prev);       // toggle Bank
  };
  const isXXL = useMediaQuery({ minWidth: 1468 });

  const screenSizeClass = isXXL ? 'w-90' : 'w-76';

  const sidebarContent = (
    <div className={`bg-[#00000080] items-center  h-screen text-white  flex flex-col ${screenSizeClass}`}>
      <img
        src="/assets/logoo.svg"
        alt="Baby Billionaires Club Logo"
        className=" mb-10" style={{ width: '100%' }}
      />
      <div className='flex-1  overflow-y-auto hide-scrollbar'>
        <nav className="flex flex-col gap-[10px] text-lg">
          <Link
            to="/"
            className={`flex items-center gap-3 p-4 rounded-2xl transition text-[#DDDDDD] cursor-pointer ${location.pathname === '/'
              ? 'text-white bg-[#FF5F00]'
              : 'hover:text-white hover:bg-[#FF5F00]'
              }`}
          >
            <img src={dasboard} alt="Dashboard" /> Dashboard
          </Link>

          <Link
            to="/collection"
            className={`flex items-center gap-3 p-4 rounded-2xl text-[#DDDDDD] transition cursor-pointer ${location.pathname === '/collection'
              ? 'text-white bg-[#FF5F00]'
              : 'hover:text-white hover:bg-[#FF5F00]'
              }`}
          >
            <img src='/assets/collection.svg' alt="Collection" /> Your Collection
            
          </Link>

          <Link
            to="/mint"
            className={`flex items-center gap-3 p-4 rounded-2xl text-[#DDDDDD] transition cursor-pointer ${location.pathname === '/mint'
              ? 'text-white bg-[#FF5F00]'
              : 'hover:text-white hover:bg-[#FF5F00]'
              }`}
          >
            <img src={protocols} alt="Mint NFTs" /> Mint NFTs
          </Link>

          {/* BABY BANK — WITH DROPDOWN */}
          <div>
            <button
              onClick={bankClick}
              className="flex items-center justify-between w-full text-[#DDDDDD] gap-3 p-4 rounded-2xl transition hover:bg-[#FF5F00]"
            >
              <span className="flex items-center gap-3 text-gray-400 cursor-pointer">
                <img src={bank} alt="Baby Bank" /> Baby Bank
              </span>

              <div className="flex items-center gap-2">
                {openBank ? (
                  <MdKeyboardArrowUp className="cursor-pointer" />
                ) : (
                  <IoChevronDownSharp className="cursor-pointer" />
                )}

                <div className="flex items-center bg-[#FF5F0080] rounded-md px-1 gap-2 py-0.5">
                  <FaRegClock />
                  <span className="text-xs ">COMING <br /> SOON</span>
                </div>
              </div>
            </button>


            {/* CHILDREN */}
            {openBank && (
              <div className="ml-10 mt-2 flex flex-col gap-2 text-base">
                <button
                  className={`flex items-center gap-3 hover:bg-[#FF5F00] text-[#DDDDDD] p-4 rounded-2xl transition cursor-pointer`}
                >
                  <img src="/assets/staking.svg" alt="token" />{' '}
                  <div className="text-gray-300">Staking</div>
                </button>
                <button
                  // to=""
                  className={`flex items-center gap-3 hover:bg-[#FF5F00] text-[#DDDDDD] p-4 rounded-2xl transition cursor-pointer `}
                >
                  <img src="/assets/portfolio.svg" alt="token" />{' '}
                  <div className="text-gray-300">Portfolio</div>
                </button>
              </div>
            )}
          </div>

          {/* TREASURY — WITH DROPDOWN */}
          <div>
            <button
              onClick={trasuryClick}
              className="flex items-center justify-between w-full gap-3 text-[#DDDDDD] p-4 rounded-2xl transition hover:bg-[#FF5F00]"
            >
              <span className="flex items-center gap-3 cursor-pointer text-gray-400">
                <img src={treasury} alt="Treasury" /> Treasury
              </span>

              {openTreasury ? (
                <MdKeyboardArrowUp className="cursor-pointer" />
              ) : (
                <IoChevronDownSharp className="cursor-pointer" />
              )}

              <div className="flex items-center bg-[#FF5F0080] rounded-md px-1 gap-2 py-0.5">
                <FaRegClock />
                <span className="text-xs">COMING <br /> SOON</span>
              </div>
            </button>


            {/* CHILDREN */}
            {openTreasury && (
              <div className="ml-10 mt-2 flex flex-col gap-2 text-base">
                <button
                  className={`flex items-center gap-3 text-[#DDDDDD] hover:bg-[#FF5F00] p-4 rounded-2xl transition cursor-pointer `}
                >
                  <img src="/assets/token-vault.svg" alt="token" />{' '}
                  <div className="text-gray-300">Token Vault </div>
                </button>
                <button
                  // to=""
                  className={`flex items-center gap-3 text-[#DDDDDD] hover:bg-[#FF5F00] p-4 rounded-2xl transition cursor-pointer `}
                >
                  <img src="/assets/nft-vault.svg" alt="token" />{' '}
                  <div className="text-gray-300"> NFT Vault </div>
                </button>
              </div>
            )}
          </div>
          <Link
            to=""
            className={`flex items-center gap-3 p-4 text-[#DDDDDD] rounded-2xl transition cursor-pointer hover:bg-[#FF5F00]`}
          >
            <img src="/assets/gitbook.svg" alt="token" />{' '}
            <div className="text-gray-300">Docs </div>
          </Link>
          {/* <Link
            to=""
            className={`flex items-center gap-3 p-4 rounded-2xl transition cursor-pointer hover:bg-[#FF5F00] `}
          >
            <img src="/assets/document-text.svg" alt="token" />{' '}
            <div className="text-gray-300">Documents </div>
          </Link> */}

        </nav>
      </div>
      <div className="mt-auto shrink-0 py-12">
        <Link to='https://babybillionaires.club/' className="flex items-center text-[#DDDDDD]  gap-3 hover:text-red-500 transition cursor-pointer">
          <img src={icon1} alt="Logout" /> Log Out
        </Link>
      </div>

    </div>
  )

  return (
    <>
      <aside className="hidden xl:flex fixed left-0 top-0">
        {sidebarContent}
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          ></div>

          <div className={`relative z-50 ${screenSizeClass} h-screen shadow-lg`}>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
