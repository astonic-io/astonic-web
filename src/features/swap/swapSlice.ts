import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { SwapFormValues, ToPlanqRates } from 'src/features/swap/types'

export interface SwapState {
  formValues: SwapFormValues | null
  toPlanqRates: ToPlanqRates
  showSlippage: boolean
  showChart: boolean
  confirmView: boolean
}

const initialState: SwapState = {
  formValues: null,
  toPlanqRates: {},
  showSlippage: false,
  showChart: false,
  confirmView: false,
}

export const swapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    setFormValues: (state, action: PayloadAction<SwapFormValues | null>) => {
      state.formValues = action.payload
    },
    setShowSlippage: (state, action: PayloadAction<boolean>) => {
      state.showSlippage = action.payload
    },
    setShowChart: (state, action: PayloadAction<boolean>) => {
      state.showChart = action.payload
    },
    reset: () => initialState,
    setConfirmView(state, action) {
      state.confirmView = action.payload
    },
  },
})

export const { setFormValues, setShowSlippage, setShowChart, reset, setConfirmView } =
  swapSlice.actions
export const swapReducer = swapSlice.reducer
