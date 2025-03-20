import Document, { Head, Html, Main, NextScript } from 'next/document'
import { getDarkMode } from 'src/styles/mediaQueries'

class MyDocument extends Document {
  render() {
    const isDarkMode = getDarkMode()
    return (
      <Html className={isDarkMode ? 'dark' : ''}>
        <Head>
          <meta charSet="utf-8" />

          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#19d88a" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="msapplication-TileColor" content="#19d88a" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <meta name="theme-color" content="#ffffff" />

          <meta name="application-name" content="Astonic Stable Exchange" />
          <meta name="keywords" content="Astonic Stable Exchange Finance Planq aUSD aEUR aREAL" />
          <meta name="description" content="Simple exchanges of Astonic sustainable stable assets" />

          <meta name="HandheldFriendly" content="true" />
          <meta name="apple-mobile-web-app-title" content="Astonic Stable Exchange" />
          <meta name="apple-mobile-web-app-capable" content="yes" />

          <meta property="og:url" content="https://app.astonic.io" />
          <meta property="og:title" content="Astonic Stable Exchange" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://app.astonic.io/logo.png" />
          <meta
            property="og:description"
            content="Simple exchanges of Astonic sustainable stable assets"
          />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content="Astonic Stable Exchange" />
          <meta
            name="twitter:description"
            content="Simple exchanges of Astonic sustainable stable assets"
          />
          <meta name="twitter:image" content="https://app.astonic.io/logo.png" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={"anonymous"} />
          <link href="https://fonts.googleapis.com/css2?family=Gabarito:wght@400..900&display=swap" rel="stylesheet" />
        </Head>
        <body className="text-black">
        <Main />
        <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
