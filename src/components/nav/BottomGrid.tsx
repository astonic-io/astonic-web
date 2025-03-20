import Image from 'next/image'
import BackgroundTilesDark from 'src/images/background/background_tiles_light.png'
import BackgroundTiles from 'src/images/background/background_tiles_dark.png'

export function BottomGrid() {
  return (
    <div className="absolute bottom-0 transform -translate-x-1/2 left-1/2 pointer-events-none">
      <div className="w-screen h-[401px] relative">
        <Image
          src={BackgroundTiles}
          alt="Background Tiles"
          quality={100}
          fill={true}
          style={{ opacity: '0.25' }}
          className="inline dark:hidden"
        />
        <Image
          src={BackgroundTilesDark}
          alt="Background Tiles"
          quality={100}
          fill={true}
          style={{ opacity: '0.25' }}
          className="hidden dark:inline"
        />
      </div>
    </div>
  )
}
