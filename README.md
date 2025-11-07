# Native Tide Starter Kit

A CLI tool to quickly scaffold a new React Native project using the Native Tide starter template.

> **⚠️ Early Version Warning**: This package is still in a very early version and is not stable. Use at your own risk. Some features may be incomplete or subject to change.

## Installation

```bash
npm install -g native-tide-starter-kit
```

Or use with npx (no installation needed):

```bash
npx native-tide-starter-kit
```

## Usage

Run the CLI command:

```bash
native-tide-starter-kit
```

Or use the shorter alias:

```bash
create-native-tide
```

The CLI will prompt you for:

- **App Name**: The name of your application
- **Project Directory**: Where to create the project (defaults to the slugified app name)

## What Gets Created

The CLI creates a complete React Native project with:

- ✅ Expo Router setup with file-based routing
- ✅ React Native Unistyles for styling with 8 beautiful themes
- ✅ TypeScript configuration
- ✅ Internationalization (i18n) setup
- ✅ Zustand for state management
- ✅ ESLint and Prettier configuration
- ✅ Custom hooks and utilities
- ✅ Theme system with light/dark/system modes
- ✅ RTL (Right-to-Left) language support

## Next Steps

After creating your project:

```bash
cd your-project-name
yarn install
yarn start
```

## Features

- **Dynamic Theme System**: 8 beautiful themes to choose from
- **Type-Safe**: Fully typed theme definitions
- **Internationalization**: Multi-language support with i18n
- **Navigation**: Expo Router for file-based routing
- **State Management**: Zustand store setup
- **Linting**: ESLint and Prettier setup

## License

MIT
