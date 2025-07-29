import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-d5870.firebaseapp.com",
  projectId: "blog-d5870",
  storageBucket: "blog-d5870.firebasestorage.app",
  messagingSenderId: "568378619160",
  appId: "1:568378619160:web:16ce2f2d900bf3f3cd5a6d",
  measurementId: "G-WBMXF74WGT",
};

export const app = initializeApp(firebaseConfig);
