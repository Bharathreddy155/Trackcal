// src/services/firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';

// Default Firebase configuration for BulkTrack cloud sync
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBulkTrackDefaultKeyForSync2026",
  authDomain: "bulktrack-sync.firebaseapp.com",
  projectId: "bulktrack-sync",
  storageBucket: "bulktrack-sync.appspot.com",
  messagingSenderId: "987654321012",
  appId: "1:987654321012:web:a1b2c3d4e5f6g7h8i9j0"
};

let app;
let db;

export function getFirebaseInstance(customConfig = null) {
  const config = customConfig || DEFAULT_FIREBASE_CONFIG;
  if (!getApps().length) {
    app = initializeApp(config);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
  return { app, db };
}

// Initializing default instance
try {
  getFirebaseInstance();
} catch (e) {
  console.warn('Firebase initialization warning:', e.message);
}

/**
 * Subscribes to real-time changes for a specific Sync Code (e.g., 'bharath-70kg-sync')
 */
export function subscribeToCloudSync(syncCode, onDataReceived, onError) {
  if (!syncCode || !db) return () => {};

  try {
    const docRef = doc(db, 'bulktrack_data', syncCode.toLowerCase().trim());
    
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          onDataReceived(data);
        }
      },
      (err) => {
        console.warn('Firestore snapshot error:', err);
        if (onError) onError(err);
      }
    );

    return unsubscribe;
  } catch (e) {
    console.error('Failed to subscribe to cloud sync:', e);
    return () => {};
  }
}

/**
 * Pushes updated local data to Firebase Firestore
 */
export async function pushToCloudSync(syncCode, payload) {
  if (!syncCode || !db) return false;

  try {
    const docRef = doc(db, 'bulktrack_data', syncCode.toLowerCase().trim());
    const dataToSave = {
      ...payload,
      updatedAt: new Date().toISOString(),
      serverTime: serverTimestamp()
    };
    await setDoc(docRef, dataToSave, { merge: true });
    return true;
  } catch (e) {
    console.warn('Cloud sync push warning:', e.message);
    return false;
  }
}
