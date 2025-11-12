import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyALV2UNTntnJapTa3Ei7Od7xGYM0slKaYQ",
  authDomain: "framez-e698f.firebaseapp.com",
  projectId: "framez-e698f",
  storageBucket: "framez-e698f.appspot.com",
  messagingSenderId: "820928833273",
  appId: "1:820928833273:web:98994bcf0a4422f06d2428"
};

// Initialize Firebase only once
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized');
} else {
  app = getApp();
  console.log('✅ Firebase already initialized');
}

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

console.log('✅ Firebase services ready');