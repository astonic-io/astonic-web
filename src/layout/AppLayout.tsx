import { PropsWithChildren } from 'react'
import { BottomGrid } from 'src/components/nav/BottomGrid'
import { Footer } from 'src/components/nav/Footer'
import { Header } from 'src/components/nav/Header'
import { TopBlur } from 'src/components/nav/TopBlur'
import { PollingWorker } from 'src/features/polling/PollingWorker'
import { HeadMeta } from 'src/layout/HeadMeta'
import { Poppins, Gabarito } from "next/font/google";


interface Props {
  pathName: string
}

const gabarito = Gabarito({
  variable: "--font-gabarito",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "600"],
  subsets: ["latin"],
});

export function AppLayout({ pathName, children }: PropsWithChildren<Props>) {
  return (
    <>
      <HeadMeta pathName={pathName} />
      <div
        className={`flex flex-col w-full h-full min-h-screen min-w-screen bg-white dark:bg-primary-dark ${gabarito.className} ${gabarito.variable} ${poppins.variable}`}
      >
        <TopBlur />
        <Header />
        <main className={`relative z-20 flex items-center justify-center grow`}>{children}</main>
        <Footer />
        <BottomGrid />
      </div>
      <PollingWorker />
    </>
  )
}
