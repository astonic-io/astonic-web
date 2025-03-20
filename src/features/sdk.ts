import { Astonic, TradablePair } from '@astonic-io/astonic-sdk'
import { ChainId } from 'src/config/chains'
import { TokenId, getTokenAddress } from 'src/config/tokens'
import { getProvider } from 'src/features/providers'

const cache: Record<number, Astonic> = {}

export async function getAstonicSdk(chainId: ChainId): Promise<Astonic> {
  if (cache[chainId]) return cache[chainId]

  const provider = getProvider(chainId)
  const astonic = await Astonic.create(provider)
  cache[chainId] = astonic
  return astonic
}

export async function getTradablePairForTokens(
  chainId: ChainId,
  tokenInId: TokenId,
  tokenOutId: TokenId
): Promise<TradablePair> {
  const sdk = await getAstonicSdk(chainId)
  const tokenInAddr = getTokenAddress(tokenInId, chainId)
  const tokenOutAddr = getTokenAddress(tokenOutId, chainId)
  return await sdk.findPairForTokens(tokenInAddr, tokenOutAddr)
}
