import Image from 'next/image'
import Link from 'next/link'
import { ConnectButton } from 'src/components/nav/ConnectButton'
import LogoBlack from 'src/images/logos/astonic_logo.svg'

export function Header() {
  return (
    <header className="relative z-30 w-screen px-3 pt-4 pb-5 sm:pl-5 sm:pr-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center sm:hidden">
          <Image
            src={LogoBlack}
            alt="Astonic"
            quality={100}
            width={90}
            className="hidden dark:inline"
          />
          <Image src={LogoBlack} alt="Astonic" quality={100} width={90} className="dark:hidden " />
        </Link>
        <Link href="/" className="items-center hidden sm:flex">
          <Image
            src={LogoBlack}
            alt="Astonic"
            quality={100}
            width={108}
            className="hidden dark:inline"
          />
          <Image src={LogoBlack} alt="Astonic" quality={100} width={108} className="dark:hidden" />
        </Link>
        {/* <NavBar pathName={pathName} /> Will remove once we confirm it's not needed */}
        <ConnectButton />
      </div>
    </header>
  )
}
