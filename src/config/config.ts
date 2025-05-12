import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import { rainbowWallet, walletConnectWallet, injectedWallet, coinbaseWallet, safeWallet } from '@rainbow-me/rainbowkit/wallets'
import { createConfig, http } from 'wagmi'
import { planq } from 'wagmi/chains'

interface Config {
  debug: boolean
  version: string | null
  showPriceChart: boolean
  walletConnectProjectId: string
}

const isDevMode = process?.env?.NODE_ENV === 'development'
const version = process?.env?.NEXT_PUBLIC_VERSION ?? null
const walletConnectProjectId = process?.env?.NEXT_PUBLIC_WALLET_CONNECT_ID || ''

export const config: Config = Object.freeze({
  debug: isDevMode,
  version,
  showPriceChart: false,
  walletConnectProjectId,
})

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [injectedWallet, coinbaseWallet, rainbowWallet, walletConnectWallet, safeWallet],
    },
  ],
  {
    appName: 'Astonic',
    projectId: '20a920e6f715a7f387f4722b5d4526eb',
  }
);


export const chainConfig = createConfig({
  chains: [planq],
  connectors,
  transports: {
    [planq.id]: http('https://planq-rpc.nodies.app')
  },
});
