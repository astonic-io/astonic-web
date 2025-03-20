import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { TokenId, getTokenAddress } from 'src/config/tokens'
import { getAstonicSdk } from 'src/features/sdk'
import { logger } from 'src/utils/logger'
import { useSendTransaction } from 'wagmi'
import { estimateGas } from '@wagmi/core'
import { getProvider } from '../../providers'
import { Address } from 'abitype/zod'
import { chainConfig } from '../../../config/config'
import { Contract } from 'ethers'
import { ERC20_ABI } from '../../../config/consts'

export function useUnwrapTransaction(
  chainId: number,
  tokenInId: TokenId,
  amountInWei: string,
  isSwapTxSuccess: boolean,
  accountAddress?: Address
) {
  const { error: txPrepError, data: txRequest } = useQuery(
    ['useWrapTransaction', chainId, tokenInId,  amountInWei, accountAddress],
    async () => {
      if (!accountAddress || !isSwapTxSuccess || new BigNumber(amountInWei).lte(0)) return null
      const sdk = await getAstonicSdk(chainId)
      const tokenInAddr = getTokenAddress(tokenInId, chainId)
      const contract = new Contract(tokenInAddr, ERC20_ABI, getProvider(chainId))

      const balance = new BigNumber((await contract.balanceOf(accountAddress)).toString())
      if (new BigNumber(amountInWei).gt(balance)) {
        throw new Error('Insufficient balance')
      }

      const txRequest = await sdk.unwrapToken(tokenInAddr, amountInWei)

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
    sendUnwrapTx: txRequest ? sendTransactionAsync : undefined,
    unwrapTxRequest: txRequest,
    unwrapTxResult: txResult,
    isUnwrapTxLoading: isLoading,
    isUnwrapTxSuccess: isSuccess,
  }
}
