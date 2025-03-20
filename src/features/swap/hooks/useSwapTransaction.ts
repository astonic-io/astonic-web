import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { TokenId, getTokenAddress } from 'src/config/tokens'
import { getAstonicSdk, getTradablePairForTokens } from 'src/features/sdk'
import { SwapDirection } from 'src/features/swap/types'
import { logger } from 'src/utils/logger'
import { useSendTransaction, useEstimateGas  } from 'wagmi'
import { chainConfig } from '../../../config/config'
import { Address } from 'abitype/zod'
import { estimateGas } from '@wagmi/core'

export function useSwapTransaction(
  chainId: number,
  fromToken: TokenId,
  toToken: TokenId,
  amountInWei: string,
  thresholdAmountInWei: string,
  direction: SwapDirection,
  accountAddress?: Address,
  isApproveConfirmed?: boolean,
  isWrapConfirmed?: boolean
) {
  const { error: txPrepError, data: txRequest, isLoading: queryIsLoading } = useQuery(
    [
      'useSwapTransaction',
      chainId,
      fromToken,
      toToken,
      amountInWei,
      thresholdAmountInWei,
      direction,
      accountAddress,
      isApproveConfirmed,
      isWrapConfirmed,
    ],
    async () => {
      if (
        !accountAddress ||
        !isApproveConfirmed ||
        !isWrapConfirmed ||
        new BigNumber(amountInWei).lte(0) ||
        new BigNumber(thresholdAmountInWei).lte(0)
      ) {
        logger.debug('Skipping swap transaction')
        return null
      }
      const sdk = await getAstonicSdk(chainId)
      const fromTokenAddr = getTokenAddress(fromToken, chainId)
      const toTokenAddr = getTokenAddress(toToken, chainId)
      const tradablePair = await getTradablePairForTokens(chainId, fromToken, toToken)
      const swapFn = direction === 'in' ? sdk.swapIn.bind(sdk) : sdk.swapOut.bind(sdk)
      const txRequest = await swapFn(
        fromTokenAddr,
        toTokenAddr,
        amountInWei,
        thresholdAmountInWei,
        tradablePair
      )
      // This should be populated by the SDK as either broker or router, but if it's not, throw an error
      if (!txRequest.to) {
        throw new Error('Swap transaction to address is undefined')
      }
      const gasResult = await estimateGas(chainConfig,
        txRequest ? {
          to: txRequest.to as `0x${string}`,
          value: BigInt(txRequest.value ? txRequest.value.toString() : 0),
          data: txRequest.data as `0x${string}`,
          account: txRequest.from as `0x${string}`,
        } : {}
      )

      return { ...txRequest, to: txRequest.to!, gas: gasResult }
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
    if(!txRequest) return
    if (txPrepError || (!isLoading && !isSuccess)) {
      toast.error('Unable to prepare swap transaction')
      logger.error(txPrepError)
    } else if (txSendError) {
      toast.error('Unable to execute swap transaction')
      logger.error(txSendError)
    }
  }, [txPrepError, isLoading, isSuccess, txSendError])


  return {
    sendSwapTx: txRequest ? sendTransactionAsync : undefined,
    swapTxRequest: txRequest,
    swapTxResult: txResult,
    isSwapTxLoading: isLoading,
    isSwapTxSuccess: isSuccess,
  }
}
