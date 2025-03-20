import { useMemo } from 'react'
import { TokenId } from 'src/config/tokens'
import { SendTransactionMutateAsync } from '@wagmi/core/query'
import { Config } from 'wagmi'

interface SwapState {
  text: string
  disabled: boolean
}

interface UseSwapStateProps {
  isAllowanceLoading: boolean
  skipApprove: boolean
  skipWrap: boolean
  skipUnwrap: boolean
  sendApproveTx: SendTransactionMutateAsync<Config, unknown>  | undefined
  isApproveTxLoading: boolean
  isApproveTxSuccess: boolean
  isSwapTxSuccess: boolean
  isWrapTxSuccess: boolean
  isWrapTxLoading: boolean
  isUnwrapTxSuccess: boolean
  isUnwrapTxLoading: boolean
  sendSwapTx:  SendTransactionMutateAsync<Config, unknown> | undefined
  sendWrapTx:  SendTransactionMutateAsync<Config, unknown> | undefined
  sendUnwrapTx:  SendTransactionMutateAsync<Config, unknown> | undefined
  fromTokenId: TokenId
}

/**
 * This hook is used to determine the text and disabled state of the submit button on the SwapConfirm form.
 *
 * We have the following possible states:
 * 1. Checking Allowance (isAllowanceLoading is true)
 * 2. Approval needed (skipApprove is false and...)
 *    a) Approval transaction preparing, not yet ready to send (sendApproveTx is falsy)
 *    b) Approval transaction ready to send (sendApproveTx is truthy, isApproveTxLoading is false, isApproveTxSuccess is false)
 *    c) Approval transaction sent but not finalized yet (sendApproveTx is truthy, isApproveTxLoading is true, isApproveTxSuccess is false)
 *    d) Approval transaction successful (isApproveTxLoading is false, isApproveTxSuccess is true)
 * 3. No approval needed (skipApprove is true)
 *    a) Swap transaction preparing, not yet ready to send (isSwapReady is false)
 *    b) Swap transaction ready to send (isSwapReady is true)
 */
export function useSwapState(props: UseSwapStateProps): SwapState {
  const {
    fromTokenId,
    skipApprove,
    skipWrap,
    skipUnwrap,
    isAllowanceLoading,
    isApproveTxLoading,
    isApproveTxSuccess,
    isSwapTxSuccess,
    isWrapTxSuccess,
    isWrapTxLoading,
    isUnwrapTxSuccess,
    isUnwrapTxLoading,
    sendWrapTx,
    sendUnwrapTx,
    sendApproveTx,
    sendSwapTx,
  } = props

  return useMemo(() => {
    // 1. Checking Allowance
    if (isAllowanceLoading) {
      return {
        text: `Checking ${fromTokenId} allowance...`,
        disabled: true,
      }
    }

    // 1.1 Wrap Flow
    if(!skipWrap) {
      if(!isWrapTxSuccess) {
        return {
          text: 'Wrap PLQ',
          disabled: false,
        }
      }
      if (isWrapTxLoading) {
        return {
          text: `Wrapping ${fromTokenId}...`,
          disabled: true,
        }
      }
      if (!sendWrapTx) {
        return {
          text: 'Preparing Wrap Transaction...',
          disabled: true,
        }
      }
    }

    // 2. Approval Flow
    if (!skipApprove) {
      if (!sendApproveTx) {
        return {
          text: 'Preparing Approve Transaction...',
          disabled: true,
        }
      }
      if (isApproveTxLoading) {
        return {
          text: `Approving ${fromTokenId}...`,
          disabled: true,
        }
      }
      if (!isApproveTxSuccess && (isWrapTxSuccess || skipWrap)) {
        return {
          text: `Approve ${fromTokenId}`,
          disabled: false,
        }
      }
    }

    // 3. Swap Flow
    if (!sendSwapTx) {
      return {
        text: 'Preparing Swap Transaction...',
        disabled: true,
      }
    }
    if(!isSwapTxSuccess) {
      return {
        text: 'Swap',
        disabled: false,
      }
    }

    // 1.1 Wrap Flow
    if(!skipUnwrap) {
      if(!isUnwrapTxSuccess) {
        return {
          text: 'Unwrap PLQ',
          disabled: false,
        }
      }
      if (isUnwrapTxLoading) {
        return {
          text: `Unwrapping ${fromTokenId}...`,
          disabled: true,
        }
      }
      if (!sendUnwrapTx) {
        return {
          text: 'Preparing Unwrap Transaction...',
          disabled: true,
        }
      }
    }

    return {
      text: 'Swap',
      disabled: false,
    }
  }, [
    isAllowanceLoading,
    skipApprove,
    skipWrap,
    skipUnwrap,
    sendApproveTx,
    isApproveTxLoading,
    isApproveTxSuccess,
    isSwapTxSuccess,
    isWrapTxSuccess,
    isWrapTxLoading,
    sendWrapTx,
    isUnwrapTxSuccess,
    isUnwrapTxLoading,
    sendUnwrapTx,
    sendSwapTx,
    fromTokenId,
  ])
}
