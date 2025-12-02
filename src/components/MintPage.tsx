import MintCard from './MintCard'
import AboutSection from './AboutSection'
import { useState, useRef } from 'react'
import type { Stage } from '../types'
import { useWallet } from '@solana/wallet-adapter-react'

const DEFAULT_STAGE: Stage = 'wl'

export default function MintPage() {
  const { publicKey } = useWallet()
  const [stage, setStage] = useState<Stage>(DEFAULT_STAGE)
  const previousWalletRef = useRef<string | undefined>(undefined)

  const currentWallet = publicKey?.toString()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Reset stage when wallet changes
  if (previousWalletRef.current !== currentWallet) {
    previousWalletRef.current = currentWallet
    if (stage !== undefined) {
      setStage(DEFAULT_STAGE)
    }
  }

  const handleStageChange = (newStage: Stage) => {
    setStage(newStage)
  }

  return (
    <>
      <div>
        <MintCard stage={stage} selectedImage={selectedImage}/>
      </div>

      <div className="mt-6">
        <AboutSection stage={stage} onStageChange={handleStageChange} onImageSelect={setSelectedImage} />
      </div>
    </>
  )
}
