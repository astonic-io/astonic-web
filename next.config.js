const { version } = require('./package.json')

const isDev = process.env.NODE_ENV !== 'production'

const securityHeaders = [
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Content-Security-Policy',
    value: `default-src 'self'; script-src 'self'${
      isDev ? " 'unsafe-eval'" : ''
    }; connect-src 'self' https://fonts.googleapis.com https://*.planq.network https://*.nodies.app https://*.walletconnect.com wss://walletconnect.celo.org wss://*.walletconnect.com wss://*.walletconnect.org https://raw.githubusercontent.com; img-src 'self' data: https://raw.githubusercontent.com https://*.walletconnect.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data:  https://fonts.googleapis.com https://fonts.gstatic.com; base-uri 'self'; form-action 'self'; frame-src 'self' https://*.walletconnect.com`,
  },
]

module.exports = {
  webpack: (config, { webpack }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      child_process: false,
      readline: false,
    }
    config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /^electron$/ }))
    return config
  },

  async rewrites() {
    return [
      {
        source: '/:any*',
        destination: '/',
      },
    ]
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },

  env: {
    NEXT_PUBLIC_VERSION: version,
  },
}
