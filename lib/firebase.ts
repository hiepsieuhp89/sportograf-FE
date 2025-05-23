// Firebase configuration
// Note: Values are hardcoded as per requirements instead of using environment variables

"use client"

import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBwNujju8j0ReZiZyEmXZNzDgjjvVvVJfc",
  authDomain: "pix-4d40e.firebaseapp.com",
  projectId: "pix-4d40e",
  storageBucket: "pix-4d40e.firebasestorage.app",
  messagingSenderId: "701410865281",
  appId: "1:701410865281:web:1bd3b6015951f7acb75d80",
  measurementId: "G-YL95JKXST4",
}

// Initialize Firebase only on the client side and only if it hasn't been initialized
let app
let auth
let db
let storage

// Check if we're in the browser environment
if (typeof window !== "undefined") {
  // Check if Firebase has already been initialized
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0] // Use the existing app if it's already initialized
  }

  // Initialize Firebase services
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
}

// Helper functions for authentication
export const isAdmin = async (uid: string) => {
  // In a real app, you would check against a database
  // For this demo, we'll hardcode the admin user ID
  return uid === "admin123"
}

export const isPhotographer = async (uid: string) => {
  // In a real app, you would check against a database
  // For this demo, we'll return true for any non-admin user
  return uid !== "admin123" && uid !== ""
}

export { auth, db, storage }
