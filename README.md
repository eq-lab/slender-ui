# Slender UI

Slender is the first noncustodial Lending protocol on Stellar Soroban. Slender allows users to lend and borrow any crypto asset which supported by the Soroban network.

[App](https://app.slender.fi) and [landing](https://slender.fi) **demos**

[![](https://raw.githubusercontent.com/eq-lab/slender-ui/main/assets/screenshot.png)](https://app.slender.fi)

## Prerequisites

You will need:

- [Node.js](https://nodejs.org/en/download) (>=18.17.1)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install) (>=1.0.0 <2.0.0)
- Git

## Local Development

First, clone the project:

```bash
git clone --recurse-submodules git@github.com:eq-lab/slender-ui.git
```

Install dependencies:

```bash
cd slender-ui
yarn
```

Then run the development app server:

```bash
yarn workspace @slender/app dev
```

To run the development landing server:

```bash
yarn workspace @slender/landing dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Start editing the main app page by modifying `packages/app/src/app/page.tsx`. The page auto-updates as you edit the file.

## Contributing

We use [Conventional Commits](https://conventionalcommits.org/) to track changes. You can find types (such as `feat` and `fix`) and scopes of the project in [Commitlint configuration](https://github.com/eq-lab/slender-ui/blob/main/commitlint.config.js). A git pre-commit hook checks commit messages.

### Testing

To run automated checks:

```bash
yarn test
```

In this script, Prettier and ESLint go over the codebase. Take a notice that automated reformatting runs as a git hook on commits.

## Credits and references

1. [UI / UX specification](https://www.notion.so/eq-lab/UI-UX-specification-c4d8a859c87648f1b9411ee78f099ba9)
2. [Slender technical specification](https://www.notion.so/Slender-technical-specification-ac9644adb9284a8f88cfc0146990b119)
3. This is a [React](https://react.dev/) project bootstrapped with [Next.js](https://nextjs.org/).
4. It also depends on [UI Kit project](https://github.com/equilibrium-eosdt/uikit) which is included as a Git module.

## License

Licensed under the [MIT](https://github.com/eq-lab/slender-ui/blob/main/LICENSE) license. Copyright 2023 EQ LAB.
