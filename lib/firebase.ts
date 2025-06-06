// Firebase configuration
// Note: Values are hardcoded as per requirements instead of using environment variables

"use client"

import { initializeApp, getApps, FirebaseApp } from "firebase/app"
import { getAuth, Auth, onAuthStateChanged } from "firebase/auth"
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, Firestore } from "firebase/firestore"
import { getStorage, FirebaseStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBwNujju8j0ReZiZyEmXZNzDgjjvVvVJfc",
  authDomain: "pix-4d40e.firebaseapp.com",
  projectId: "pix-4d40e",
  storageBucket: "pix-4d40e.firebasestorage.app",
  messagingSenderId: "701410865281",
  appId: "1:701410865281:web:1bd3b6015951f7acb75d80",
  measurementId: "G-YL95JKXST4",
}

// Initialize Firebase
let app: FirebaseApp
let auth: Auth
let db: Firestore
let storage: FirebaseStorage

if (typeof window !== "undefined") {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)

  // Debug auth state changes
  onAuthStateChanged(auth, (user) => {
    console.log("Firebase auth state changed:", {
      email: user?.email,
      uid: user?.uid,
      timestamp: new Date().toISOString()
    })
  })
}

// Get current auth instance (useful for ensuring we're using the right instance)
export const getCurrentAuth = (): Auth => {
  if (typeof window === "undefined") {
    throw new Error("Firebase auth can only be used in browser environment")
  }
  return auth
}

// User roles type
export type UserRole = 'admin' | 'photographer' | 'user';

interface UserData {
  role: UserRole;
  email: string;
  name?: string;
}

// Helper function to check if there are any users in the system
export const isFirstUser = async (): Promise<boolean> => {
  try {
    const usersCollection = collection(db, 'users');
    const snapshot = await getDocs(usersCollection);
    return snapshot.empty;
  } catch (error) {
    console.error('Error checking first user:', error);
    return false;
  }
}

// Helper function to create a new user in Firestore
export const createUserInFirestore = async (uid: string, email: string, role: UserRole = 'user'): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      uid,
      email,
      role,
      createdAt: new Date().toISOString(),
    });
    console.log(`Created user in Firestore: ${email} with role: ${role}`)
  } catch (error) {
    console.error('Error creating user in Firestore:', error);
    throw error;
  }
}

// Helper functions for authentication
export const isAdmin = async (uid: string): Promise<boolean> => {
  try {
    if (!uid) return false;
    
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Check if this is the first user
      const firstUser = await isFirstUser();
      if (firstUser) {
        // Create the first user as admin
        await createUserInFirestore(uid, auth.currentUser?.email || '', 'admin');
        return true;
      }
      return false;
    }
    
    const userData = userSnap.data() as UserData;
    const isAdminUser = userData.role === 'admin';
    console.log(`Checking admin status for ${uid}: ${isAdminUser}`)
    return isAdminUser;
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
    const isPhotographerUser = userData.role === 'photographer';
    console.log(`Checking photographer status for ${uid}: ${isPhotographerUser}`)
    return isPhotographerUser;
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
    
    const userData = userSnap.data() as UserData;
    console.log(`Retrieved user data for ${uid}:`, userData)
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export { auth, db, storage }
