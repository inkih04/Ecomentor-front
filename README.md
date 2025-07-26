# EcoMentor Frontend

**Mobile application to promote energy efficiency in Catalonia**

EcoMentor Frontend is a mobile application developed with React Native and Expo that connects to the [EcoMentor Backend](https://github.com/inkih04/EcoMentor-backend) to provide an intuitive and comprehensive experience in building energy efficiency management.

## Development Methodology

This project was developed following the **Scrum methodology**, enabling iterative and incremental development with regular value deliveries. For source code management, **GitFlow** was implemented, ensuring a structured workflow with specific branches for development, features, and releases.

> **Note**: When transferring the repository to this personal profile, the complete commit history and branches that documented the original development process have been lost.

## Key Features

- **Interactive Maps**: Visualize real-time energy information of buildings
- **Energy Certificates**: Query and compare energy efficiency certificates
- **AI Assistant**: Intelligent chatbot for personalized sustainability advice
- **Improvement Calculator**: Quantifies the benefits of implementing energy improvements
- **Native Experience**: Interface optimized for iOS and Android

## Tech Stack

- **React Native** with Expo
- **TypeScript** for enhanced code robustness
- **Axios** for API communication
- **React Navigation** for screen navigation
- **Expo Router** for file-based routing

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Installation and Setup

### 1. Clone the repository
```bash
git clone https://github.com/inkih04/Ecomentor-front.git
cd Ecomentor-front
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the project root:
```env
EXPO_PUBLIC_API_URL=http://localhost:8080/api
```

### 4. Start the application
```bash
npx expo start
```

## Development Options

In the terminal you'll see options to run the app on:

- **Expo Go**: Scan the QR code to test on your device
- **Android Emulator**: [Configure Android Studio](https://docs.expo.dev/workflow/android-studio-emulator/)
- **iOS Simulator**: [Configure Xcode](https://docs.expo.dev/workflow/ios-simulator/) (macOS only)
- **Development Build**: For advanced native functionalities

## Project Structure

```
app/
├── (tabs)/          # Tab navigation
├── components/      # Reusable components
├── services/        # API communication
├── utils/          # Utilities and helpers
└── types/          # TypeScript definitions
```

This project uses Expo Router's [file-based routing](https://docs.expo.dev/router/introduction/).

## Useful Commands

```bash
# Run in development mode
npm start

# Clear Expo cache
npx expo start -c

# Create development build
npx expo run:android
npx expo run:ios

# Reset project (remove example code)
npm run reset-project
```

## 📱 Screenshots

<details>
<summary>📸 Click to view app screenshots</summary>

### Main Dashboard
![Main Dashboard - Map View](https://github.com/inkih04/Ecomentor/blob/main/images/mapa.png) 
![Main Dashboard - Sidebar](https://github.com/inkih04/Ecomentor/blob/main/images/sideBar.png)

### Achievements System
![Achievements](https://github.com/inkih04/Ecomentor/blob/main/images/logros.png) 

### AI-Powered Recommendations
![Recommendations](https://github.com/inkih04/Ecomentor/blob/main/images/recommendations.png) 

### Certificate Comparison Tool
![Certificate Comparison](https://github.com/inkih04/Ecomentor/blob/main/images/compare.png) 

### AI Sustainability Advisor Chat
![AI Advisor](https://github.com/inkih04/Ecomentor/blob/main/images/chat.png) 

### Improvement Calculator
![Calculator](https://github.com/inkih04/Ecomentor/blob/main/images/Calculate.png)

</details>

## Backend API

This application consumes the [EcoMentor Backend](https://github.com/inkih04/EcoMentor-backend) API. Make sure the backend is running before starting the mobile application.

## Testing

```bash
# Run tests (when configured)
npm test
```

## Deployment

To create production builds:

```bash
# Build for Android
npx eas build --platform android

# Build for iOS
npx eas build --platform ios
```

## Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Tutorial](https://reactnative.dev/docs/getting-started)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)

## Community

- [Expo on GitHub](https://github.com/expo/expo)
- [Expo Discord](https://chat.expo.dev)
- [React Native Community](https://reactnative.dev/community/overview)

---

**Contributing to a more sustainable future, one application at a time**
