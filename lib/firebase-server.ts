// Server-side Firebase configuration
// This file is specifically for server-side operations in API routes

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBwNujju8j0ReZiZyEmXZNzDgjjvVvVJfc",
  authDomain: "pix-4d40e.firebaseapp.com",
  projectId: "pix-4d40e",
  storageBucket: "pix-4d40e.firebasestorage.app",
  messagingSenderId: "701410865281",
  appId: "1:701410865281:web:1bd3b6015951f7acb75d80",
  measurementId: "G-YL95JKXST4",
}

// Initialize Firebase for server-side use
let serverApp: FirebaseApp
let serverDb: Firestore

try {
  // Check if server app already exists
  const existingApp = getApps().find(app => app.name === 'server')
  
  if (existingApp) {
    serverApp = existingApp
  } else {
    serverApp = initializeApp(firebaseConfig, 'server')
  }
  
  serverDb = getFirestore(serverApp)
  console.log('Firebase server instance initialized successfully')
} catch (error) {
  console.error('Error initializing Firebase server instance:', error)
  
  // Fallback to default app if server app fails
  try {
    const defaultApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
    serverDb = getFirestore(defaultApp)
    console.log('Using default Firebase app as fallback for server operations')
  } catch (fallbackError) {
    console.error('Fallback Firebase initialization failed:', fallbackError)
    throw new Error('Could not initialize Firebase for server-side operations')
  }
}

export { serverDb as db }
export { serverApp } 