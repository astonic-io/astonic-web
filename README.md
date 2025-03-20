# Astonic Web App

This is the home for the Astonic web app!

This DApp lets users make exchanges between Planq's native currencies using the Astonic on-chain exchange mechanism.

For more details about how Astonic works, see the [documentation](https://astonic.gitbook.io/)

This is a fork of [Mento](https://github.com/mento-protocol/mento-web).

## Architecture

This project uses Next.JS, React, Redux, Tailwind, Wagmi, and RainbowKit.

## Run Locally

1. Install deps: `yarn`
1. Create a local `.env` from the example: `cp .env.example .env`
1. Start server: `yarn dev`
1. `open http://localhost:3000`

## Deploy

- Deployments happen automatically via Vercel's Github app.
- Every push into `main` is automatically deployed to app.astonic.io

## Contribute

For small contributions such as bug fixes or style tweaks, please open a Pull Request.
For new features, please create an issue to start a discussion on [Telegram](https://t.me/astonic_io).

## License

This project is [Apache 2.0 Licensed](LICENSE).
