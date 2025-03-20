import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { TokenId, getTokenAddress } from 'src/config/tokens'
import { getAstonicSdk, getTradablePairForTokens } from 'src/features/sdk'
import { logger } from 'src/utils/logger'
import { useSendTransaction } from 'wagmi'
import { Address } from 'abitype/zod'
import { estimateGas } from '@wagmi/core'
export function useApproveTransaction(
  chainId: number,
  tokenInId: TokenId,
  tokenOutId: TokenId,
  amountInWei: string,
  isWrapConfirmed: boolean,
  accountAddress?: Address
) {
  const { error: txPrepError, data: txRequest } = useQuery(
    ['useApproveTransaction', chainId, tokenInId, tokenOutId, amountInWei, accountAddress],
    async () => {
      if (!accountAddress || !isWrapConfirmed ||  new BigNumber(amountInWei).lte(0)) return null
      const sdk = await getAstonicSdk(chainId)
      const tokenInAddr = getTokenAddress(tokenInId, chainId)
      const tradablePair = await getTradablePairForTokens(chainId, tokenInId, tokenOutId)
      const txRequest = await sdk.increaseTradingAllowance(tokenInAddr, amountInWei, tradablePair)

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
  }, [txPrepError, txSendError])

  return {
    sendApproveTx: txRequest ? sendTransactionAsync : undefined,
    approveTxRequest: txRequest,
    approveTxResult: txResult,
    isApproveTxLoading: isLoading,
    isApproveTxSuccess: isSuccess,
  }
}

import { chainConfig } from '../../../config/config'
