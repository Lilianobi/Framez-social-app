📱 Framez - Social Media Mobile App

A modern React Native social app built with Expo, Firebase Authentication, and Convex for backend and storage.
Framez lets users share posts, upload images, like content, and connect with others through a smooth, social experience.

REACT NATIVE
EXPO
FIREBASE
CONVEX
TYPESCRIPT


🌟 Features
🔐 Authentication (Firebase)

Secure email/password registration

Persistent login sessions

User profile with display name and email

Logout and auto-redirect on sign-out

🖼️ Posts (Convex)

Create text posts only

Upload and store images in Convex storage

Like and unlike posts

See user names, captions, and timestamps

Delete your own posts

Real-time feed refresh

👤 Profile

Display user details and post count

View all personal posts(on refresh)

Clean, Instagram-inspired layout

🚀 Quick Start
Prerequisites

Node.js ≥ 18

npm or yarn

Expo CLI (npm install -g expo-cli)

Convex CLI (npm install -g convex)

Firebase project (for Auth only)

1️⃣ Clone Repository
git clone https://github.com/Lilianobi/Framez-social-app.git
cd framez

2️⃣ Install Dependencies
npm install
# or
yarn install

3️⃣ Setup Firebase (Authentication Only)

In your Firebase Console:

Enable Email/Password Authentication only

Copy your Firebase credentials into firebaseConfig.ts:

// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

4️⃣ Setup Convex

Log in to Convex

npx convex login


Initialize Convex inside your project:

npx convex dev


Create your backend functions inside /convex/ (e.g. posts.ts, users.ts).

5️⃣ Run the App
npm start
# or
expo start


Then press:

a → open on Android

i → open on iOS Simulator

Or scan the QR code with Expo Go

🏗️ Project Structure
framez/
├── app/
│   ├── (tabs)/
│   │   ├── feed.tsx              # Main feed screen
│   │   ├── profile.tsx           # User profile tab
│   │   
│   └── _layout.tsx               # Tab navigation layout
│
├── assets/
├── convex/
│   ├── posts.ts                  # Convex functions for posts
│   ├── users.ts                  # Convex functions for user data
│   └── schema.ts                 # Convex schema definitions
│
├── src/
│   ├── components/
│   │   ├── CreatePostModal.tsx   # Post creation modal
│   │   ├── PostCard.tsx          # Post UI component
│   │   └── LoadingSpinner.tsx    # Loading indicator
│   ├── context/
│   │   └── AuthContext.tsx       # Firebase Auth state management
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   └── utils/
│       └── helpers.ts            # Utility functions
│
├── firebaseConfig.ts             # Firebase Auth configuration
├── convex.json                   # Convex config
├── app.config.js                 # Expo project config
├── package.json
└── README.md

🛠️ Tech Stack
Layer	Technology
Frontend	React Native + Expo
Auth	Firebase Authentication
Backend	Convex (Functions + Database + Storage)
Image Storage	Convex Storage
Styling	React Native + Custom Components
Navigation	Expo Router (Tabs)
Language	TypeScript
📦 Key Dependencies
{
  "expo": "~51.0.0",
  "react-native": "0.74.0",
  "firebase": "^10.7.1",
  "convex": "^1.15.0",
  "expo-image-picker": "~15.0.4",
  "expo-router": "^3.5.9"
}

🎨 Design Highlights

Minimal, Instagram-inspired interface

Animated tab transitions

Curved modal for creating posts

Rounded post cards with shadow

Responsive for all screen sizes

Pull-to-refresh and like animations

🔒 Security

Firebase authentication guards

Convex access control rules

User-owned post deletion only

Safe server-side validation with Convex schema

🚢 Deployment
Build for Android (APK)
npx eas build -p android --profile preview


Once complete, download the APK and upload it to Appetize.io
.

🔮 Future Enhancements

💬 Comments on posts

👥 Follow/following system

🔍 Search users and posts

🎞️ image posts/ Stories / Reels feature

🔔 Push notifications

🌙 Dark mode

🎭 Reactions and emoji effects


👨‍💻 Author

Lilian Obi
💼 GitHub --=> https://github.com/Lilianobi/Framez-social-app.git
appetize.io --=> https://appetize.io/app/b_d3u7tya2ffygcqbkw6p2c3g6hm
 My Demo link --=> https://drive.google.com/drive/folders/1rx2Rv8ze2dKLK4LYFuDad-3BOP2xCEPX?usp=sharing

❤️ Acknowledgements

Expo Team

Convex

Firebase

React Native community

AI & Google search