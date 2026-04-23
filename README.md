# RN Lab

A high-fidelity React Native playground for experimenting with advanced animations, Skia-based graphics, and premium UI components.

![RN Lab Hero](https://img.shields.io/badge/React--Native-0.81.5-000000?style=for-the-badge&logo=react)
![Expo](https://img.shields.io/badge/Expo-54-000000?style=for-the-badge&logo=expo)
![Skia](https://img.shields.io/badge/Shopify--Skia-Latest-000000?style=for-the-badge)

## Features

This repository serves as a "lab" for pushing the boundaries of React Native's visual capabilities. Current experiments include:

- **Mesh Gradients**: Smooth, dynamic gradients powered by `@shopify/react-native-skia`.
- **High-Fidelity Toasts**: A global notification system with glassmorphism effects, inner shadows, and fluid animations.
- **Liquid Bottom Bar**: A tab bar featuring organic, liquid-like transition animations.
- **Crypto Button**: An interactive, high-polish button component designed for fintech applications.
- **Animated Numbers**: Smooth ticker-style transitions for numeric values.

## Tech Stack

- **Core**: React Native 0.81.5 + Expo 54
- **Graphics**: [Shopify React Native Skia](https://shopify.github.io/react-native-skia/)
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Gestures**: [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- **Navigation**: [React Navigation v6](https://reactnavigation.org/)
- **Fonts**: Inter & Space Grotesk

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/carllosnc/rn-lab.git
   cd rn-lab
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

### Running the App

Start the development server:

```bash
bun start
```

- Press **`i`** to open on iOS simulator.
- Press **`a`** to open on Android emulator.
- Press **`w`** to open on web.

## Project Structure

```text
src/
├── components/   # Reusable UI components (Skia/Reanimated)
├── navigation/   # Navigation configuration and routers
├── screens/      # Main application screens for each experiment
└── partials/     # Screen-specific sub-components
```

## License

MIT

