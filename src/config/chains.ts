export enum ChainId {
  Planq = 7070,
}

export interface ChainMetadata {
  chainId: ChainId
  name: string
  rpcUrl: string
  explorerUrl: string
  explorerApiUrl: string
}

export const Planq: ChainMetadata = {
  chainId: ChainId.Planq,
  name: 'Planq',
  rpcUrl: 'https://evm-rpc.planq.network',
  explorerUrl: 'https://evm.planq.network',
  explorerApiUrl: 'https://evm-api.planq.network/api',
}

export const chainIdToChain: Record<number, ChainMetadata> = {
  [ChainId.Planq]: Planq,
}

export const allChains = [Planq]
