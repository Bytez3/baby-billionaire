import '@solana/wallet-adapter-react-ui/styles.css'

import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { ToastContainer } from 'react-toastify'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import MintPage from './components/MintPage'
import { RPC_URL } from './constants'
import Collection from './components/Collection'

const queryClient = new QueryClient()
const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()]

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider endpoint={RPC_URL}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/mint" element={<MintPage />} />
                  <Route path="/collection" element={<Collection />} />
                  {/* <Route path="/staking" element={<Staking />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/token-vault" element={<TokenVault />} />
                  <Route path="/nft-vault" element={<NftVault />} /> */}
                </Route>
              </Routes>
            </BrowserRouter>
            <ToastContainer />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  )
}
