import { ChainId } from 'src/config/chains'
import { getAstonicSdk } from 'src/features/sdk'
import { Color } from 'src/styles/Color'
import { areAddressesEqual } from 'src/utils/addresses'

export interface Token {
  id: string
  symbol: string // The same as id for now
  name: string
  color: string
  decimals: number
}

export interface TokenWithAddress {
  address: Address
}

export enum TokenId {
  PLANQ = 'PLANQ',
  aUSD = 'aUSD',
  aEUR = 'aEUR',
  aREAL = 'aREAL',
  USDC = 'USDC',
}

export const NativeStableTokenIds = [TokenId.aUSD, TokenId.aEUR, TokenId.aREAL]

export const PLANQ: Token = Object.freeze({
  id: TokenId.PLANQ,
  symbol: TokenId.PLANQ,
  name: 'Planq Native',
  color: Color.planqGold,
  decimals: 18,
})
export const aUSD: Token = Object.freeze({
  id: TokenId.aUSD,
  symbol: TokenId.aUSD,
  name: 'Astonic Dollar',
  color: Color.astonicBlue,
  decimals: 18,
})
export const aEUR: Token = Object.freeze({
  id: TokenId.aEUR,
  symbol: TokenId.aEUR,
  name: 'Astonic Euro',
  color: Color.astonicBlue,
  decimals: 18,
})
export const aREAL: Token = Object.freeze({
  id: TokenId.aREAL,
  symbol: TokenId.aREAL,
  name: 'Astonic Real',
  color: Color.astonicBlue,
  decimals: 18,
})
export const USDC: Token = Object.freeze({
  id: TokenId.USDC,
  symbol: TokenId.USDC,
  name: 'USDC',
  color: Color.usdcBlue,
  decimals: 6,
})

export const Tokens: Record<TokenId, Token> = {
  PLANQ,
  aUSD,
  aEUR,
  aREAL,
  USDC,
}

export const TokenAddresses: Record<ChainId, Record<TokenId, Address>> = Object.freeze({
  [ChainId.Planq]: {
    [TokenId.PLANQ]: '0x5EBCdf1De1781e8B5D41c016B0574aD53E2F6E1A',
    [TokenId.aUSD]: '0xA2871B267a7d888F830251F6B4D9d3DFf184995a',
    [TokenId.aEUR]: '0xd5be2932FEbD73019ba1d5d97DFC35E1Ab09E501',
    [TokenId.aREAL]: '0x240642C6f69878A0b199065f25EDf82023BC59ce',
    [TokenId.USDC]: '0xecEEEfCEE421D8062EF8d6b4D814efe4dc898265',
  },
})

export function isNativeToken(tokenId: string) {
  return Object.keys(Tokens).includes(tokenId)
}

export function isNativeStableToken(tokenId: string) {
  return NativeStableTokenIds.includes(tokenId as TokenId)
}

export async function isSwappable(token1: string, token2: string, chainId: number) {
  // Exit early if the same token was passed in two times
  if (token1 === token2) return false

  const sdk = await getAstonicSdk(chainId)
  const tradablePairs = await sdk.getTradablePairs()
  if (!tradablePairs) return false

  const token1Address = getTokenAddress(token1 as TokenId, chainId)
  const token2Address = getTokenAddress(token2 as TokenId, chainId)

  return tradablePairs.some(
    (pair) =>
      pair.find((asset) => asset.address === token1Address) &&
      pair.find((asset) => asset.address === token2Address)
  )
}

export async function getSwappableTokenOptions(inputTokenId: string, chainId: ChainId) {
  // Get all available tokens for the chain except the input token
  const tokenOptions = getTokenOptionsByChainId(chainId).filter(
    (tokenId) => tokenId !== inputTokenId
  )

  // Check swappability in parallel and maintain order
  const swappableTokens = await Promise.all(
    tokenOptions.map(async (tokenId) => {
      const swappable = await isSwappable(tokenId, inputTokenId, chainId)
      return swappable ? tokenId : null
    })
  )

  // Filter out non-swappable tokens (null values)
  return swappableTokens.filter((tokenId): tokenId is TokenId => tokenId !== null)
}

export function getTokenOptionsByChainId(chainId: ChainId): TokenId[] {
  const tokensForChain = TokenAddresses[chainId]

  return tokensForChain
    ? Object.entries(tokensForChain)
        .filter(([, tokenAddress]) => tokenAddress !== '') // Allows incomplete 'TokenAddresses' list i.e When tokens are not on all chains
        .map(([tokenId]) => tokenId as TokenId)
    : []
}

export function getTokenById(id: TokenId | string): Token {
  return Tokens[id as TokenId]
}

export function getTokenAddress(id: TokenId, chainId: ChainId): Address {
  const addr = TokenAddresses[chainId][id]
  if (!addr) throw new Error(`No address found for token ${id} on chain ${chainId}`)
  return addr
}

export function getTokenByAddress(address: Address): Token {
  const idAddressTuples = Object.values(TokenAddresses)
    .map((idToAddress) => Object.entries(idToAddress))
    .flat()
  // This assumes no clashes btwn different tokens on diff chains
  for (const [id, tokenAddr] of idAddressTuples) {
    if (areAddressesEqual(address, tokenAddr)) {
      return Tokens[id as TokenId]
    }
  }
  throw new Error(`No token found for address ${address}`)
}
