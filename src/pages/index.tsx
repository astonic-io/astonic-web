import { config } from 'src/config/config'
import { TokenId } from 'src/config/tokens'
import { PriceChartPlanq } from 'src/features/chart/PriceChartPlanq'
import { useAppSelector } from 'src/features/store/hooks'
import { SwapConfirmCard } from 'src/features/swap/SwapConfirm'
import { SwapFormCard } from 'src/features/swap/SwapForm'

export default function SwapPage() {
  const { formValues, showChart, confirmView } = useAppSelector((state) => state.swap)
  return (
    <div className="flex justify-center items-center h-full flex-wrap w-full">
      <div className="mb-6 w-full max-w-md">
        {!formValues || !confirmView ? (
          <SwapFormCard />
        ) : (
          <SwapConfirmCard formValues={formValues} />
        )}{' '}
      </div>
      {config.showPriceChart && showChart && (
        <div className="mb-6 md:ml-10">
          <PriceChartPlanq stableTokenId={TokenId.aUSD} height={265} />
        </div>
      )}
    </div>
  )
}
