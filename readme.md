# Home Unlock App

## Overview

The Home Unlock App is a basic React Native application that allows users to view a list of homes and unlock them when they are within proximity. The app features location-based unlocking, and mock APIs are used to simulate fetching home data and unlocking homes.

### Features
- **Home List**: View a list of available homes with basic information.
- **Home Details**: See detailed information about a selected home.
- **Proximity-based Unlock**: Unlock a home when within 30 meters.
- **Push Notifications**: Notify the user and admin about proximity and unlocking events.

## Prerequisites

- **Node.js**: Ensure you have Node.js installed. You can download it [here](https://nodejs.org/).
- **Expo CLI**: Install Expo CLI globally by running:

  ```bash
  npm install -g expo-cli

- Android Studio or Xcode: Required for running the app on an emulator/simulator.

# Git: To clone the repository.

- git clone <repository-url>
- cd homesapp
- npm install
- npx expo start
- For iOS: Press i to open the app in the iOS simulator.
- For Android: Press a to open the app in the Android emulator.

# Test the App:

- Sign in to the app (mock sign-in).
- Browse the list of homes.
- Select a home to view details.
- If you are within 30 meters of the home, the "Unlock" button will appear.    Click it to simulate unlocking the home.

# License
This project is licensed under the MIT License. See the LICENSE file for more details.