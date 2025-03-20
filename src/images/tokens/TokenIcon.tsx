import Image from 'next/image'
import { memo } from 'react'
import { Token, TokenId } from 'src/config/tokens'
import PlanqIcon from 'src/images/tokens/PLANQ.svg'
import USDCIcon from 'src/images/tokens/USDC.svg'
import aEURIcon from 'src/images/tokens/aEUR.png'
import aREALIcon from 'src/images/tokens/aBRL.png'
import aUSDIcon from 'src/images/tokens/aUSD.png'

interface Props {
  token?: Token | null
  size?: 'xs' | 's' | 'm' | 'l'
}

function _TokenIcon({ token, size = 'm' }: Props) {
  const { actualSize, fontSize } = sizeValues[size]

  if (!token) {
    return (
      <div
        className="flex items-center justify-center bg-white border border-gray-200 rounded-full"
        style={{
          width: actualSize,
          height: actualSize,
        }}
      ></div>
    )
  }

  let imgSrc
  if (token?.id === TokenId.PLANQ) imgSrc = PlanqIcon
  else if (token?.id === TokenId.aUSD) imgSrc = aUSDIcon
  else if (token?.id === TokenId.aEUR) imgSrc = aEURIcon
  else if (token?.id === TokenId.aREAL) imgSrc = aREALIcon
  else if (token?.id === TokenId.USDC) imgSrc = USDCIcon

  if (imgSrc) {
    return (
      <Image
        src={imgSrc}
        alt="" // Not using real alt because it looks strange while loading
        width={actualSize}
        height={actualSize}
        priority={true}
      />
    )
  }

  return (
    <div
      className="flex items-center justify-center rounded-full"
      style={{
        width: actualSize,
        height: actualSize,
        backgroundColor: token.color || '#9CA4A9',
      }}
    >
      <div
        className="font-semibold text-white"
        style={{
          fontSize,
        }}
      >
        {token.symbol[0].toUpperCase()}
      </div>
    </div>
  )
}

const sizeValues = {
  xs: {
    actualSize: 22,
    fontSize: '13px',
  },
  s: {
    actualSize: 30,
    fontSize: '15px',
  },
  m: {
    actualSize: 40,
    fontSize: '18px',
  },
  l: {
    actualSize: 46,
    fontSize: '20px',
  },
}

export const TokenIcon = memo(_TokenIcon)
