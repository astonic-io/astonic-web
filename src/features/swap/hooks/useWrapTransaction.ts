import { useQuery } from '@tanstack/react-query'
import { estimateGas } from '@wagmi/core'
import { Address } from 'abitype/zod'
import BigNumber from 'bignumber.js'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { TokenId, getTokenAddress } from 'src/config/tokens'
import { getAstonicSdk } from 'src/features/sdk'
import { logger } from 'src/utils/logger'
import { useSendTransaction } from 'wagmi'

import { chainConfig } from '../../../config/config'
import { getProvider } from '../../providers'


export function useWrapTransaction(
  chainId: number,
  tokenInId: TokenId,
  amountInWei: string,
  accountAddress?: Address
) {
  const { error: txPrepError, data: txRequest } = useQuery(
    ['useWrapTransaction', chainId, tokenInId,  amountInWei, accountAddress],
    async () => {
      if (!accountAddress || tokenInId != TokenId.PLANQ || new BigNumber(amountInWei).lte(0)) return null
      const sdk = await getAstonicSdk(chainId)
      const tokenInAddr = getTokenAddress(tokenInId, chainId)

      const balance = new BigNumber((await getProvider(chainId).getBalance(accountAddress)).toString())
      if (new BigNumber(amountInWei).gt(balance)) {
        throw new Error('Insufficient balance')
      }

      const txRequest = await sdk.wrapToken(tokenInAddr, amountInWei)

      const gasResult = await estimateGas(chainConfig,
        txRequest ? {
          to: txRequest.to as `0x${string}`,
          value: BigInt(txRequest.value ? txRequest.value.toString() : 0),
          data: txRequest.data as `0x${string}`,
          account: txRequest.from as `0x${string}`,
        } : {}
      )

      return { ...txRequest, to: tokenInAddr, gas: gasResult }
    },
    {
      retry: false,
    }
  )

  const {
    data: txResult,
    isLoading,
    isSuccess,
    error: txSendError,
    sendTransactionAsync,
  } = useSendTransaction()


  useEffect(() => {
    if (txPrepError) {
      toast.error('Unable to prepare approval transaction')
      logger.error(txPrepError)
    } else if (txSendError) {
      toast.error('Unable to execute approval transaction')
      logger.error(txSendError)
    }
  }, [txPrepError,  txSendError])

  return {
    sendWrapTx: txRequest ? sendTransactionAsync : undefined,
    wrapTxRequest: txRequest,
    wrapTxResult: txResult,
    isWrapTxLoading: isLoading,
    isWrapTxSuccess: isSuccess,
  }
}
