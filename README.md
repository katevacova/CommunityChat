# CommunityChat

**CommunityChat** is a real-time chat application built with **React Native** and **TypeScript**, leveraging **Firebase** for authentication, messaging, and push notifications.

## Screenshots

<img src="https://i.imgur.com/uYkYZif.png" alt="ChatRoom1" width="30%" /> <img src="https://i.imgur.com/0UaB1TB.png" alt="ChatRooms" width="30%" /> <img src="https://i.imgur.com/8PnY0WE.png" alt="SignIn" width="30%"/>

## Tech Stack

- **Frontend**: React Native (without Expo), TypeScript
- **Backend**: Firebase (Authentication, Firestore, Cloud Messaging)
- <!--**Push Notifications**: Firebase Cloud Messaging (FCM)-->
- **Storage**: Firebase Storage (for image uploads)
- **Navigation**: React Navigation

## Installation & Setup

### Prerequisites

Ensure you have the following installed:

- **Node.js**
- **npm**
- **React Native CLI**
- **Android Studio** (for Android)
- **Xcode** (for iOS)

### Clone the Repository

```sh
git clone https://github.com/katevacova/CommunityChat.git
cd CommunityChat
```

### Install Dependencies

```sh
npm install

cd ios
pod install
cd ..
```

### Running the App
```sh
npm run android

npm run ios
```

## Features

- **Authentication**: Users can log in via **Google** authentication.
- **Chat Rooms**: A list of available chat rooms sorted by the most recent messages.
- **Real-Time Messaging**: Messages are sent and received dynamically using Firebase.
- **Image Uploading**: Users can send images from their gallery or take a photo directly within the app.

- **Email**: kackavacova@seznam.cz
