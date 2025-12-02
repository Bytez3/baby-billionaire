import {
  fetchCandyGuard,
  fetchCandyMachine,
  mplCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { useWallet } from '@solana/wallet-adapter-react'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { CANDY_MACHINE_PUBLIC_KEY, connection } from '../constants'
import {
  dasApi,
  type DasApiInterface,
} from '@metaplex-foundation/digital-asset-standard-api'
import { useQuery } from '@tanstack/react-query'

declare module '@metaplex-foundation/umi' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RpcInterface extends DasApiInterface {}
}

const umi = createUmi(connection)
  .use(mplTokenMetadata())
  .use(mplCandyMachine())
  .use(dasApi())

export function useUmi() {
  const wallet = useWallet()

  umi.use(walletAdapterIdentity(wallet))

  return umi
}

export function useCandyMachine() {
  const umi = useUmi()

  const candyMachineQuery = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['candy-machine'],
    queryFn: async () => await fetchCandyMachine(umi, CANDY_MACHINE_PUBLIC_KEY),
  })
  const candyGuardQuery = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['candy-guard'],
    queryFn: async () =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      await fetchCandyGuard(umi, candyMachineQuery.data?.mintAuthority!),
    enabled: candyMachineQuery.isSuccess,
  })

  return { candyMachineQuery, candyGuardQuery }
}
