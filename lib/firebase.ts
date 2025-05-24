// Firebase configuration
// Note: Values are hardcoded as per requirements instead of using environment variables

"use client"

import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore, doc, getDoc, Firestore } from "firebase/firestore"
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
let db: Firestore
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

// User roles type
export type UserRole = 'admin' | 'photographer' | 'user';

interface UserData {
  role: UserRole;
  email: string;
  name?: string;
}

// Helper functions for authentication
export const isAdmin = async (uid: string): Promise<boolean> => {
  try {
    if (!uid) return false;
    
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return false;
    
    const userData = userSnap.data() as UserData;
    return userData.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export const isPhotographer = async (uid: string): Promise<boolean> => {
  try {
    if (!uid) return false;
    
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return false;
    
    const userData = userSnap.data() as UserData;
    return userData.role === 'photographer';
  } catch (error) {
    console.error('Error checking photographer status:', error);
    return false;
  }
}

// Helper function to get user data
export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    if (!uid) return null;
    
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return null;
    
    return userSnap.data() as UserData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export { auth, db, storage }
