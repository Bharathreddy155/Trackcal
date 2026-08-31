// src/services/firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot, getDoc, serverTimestamp } from 'firebase/firestore';

// Bharath's Official Firebase Project Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAkxA8I_CbXiJ0wxgWUA8Ob8qUMLnC7deI",
  authDomain: "bulktrack976.firebaseapp.com",
  projectId: "bulktrack976",
  storageBucket: "bulktrack976.firebasestorage.app",
  messagingSenderId: "1072185597441",
  appId: "1:1072185597441:web:d06bc6e47c37380b586a00",
  measurementId: "G-F0W8YKMV58"
};

let app;
let db;

export function getFirebaseInstance() {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
  return { app, db };
}

// Initializing instance
try {
  getFirebaseInstance();
} catch (e) {
  console.warn('Firebase initialization warning:', e.message);
}

/**
 * Subscribes to real-time changes for a specific Sync Code (e.g., 'bharath-bulking-70kg') via Firebase Firestore onSnapshot
 */
export function subscribeToCloudSync(syncCode, onDataReceived, onError) {
  if (!syncCode) return () => {};

  try {
    if (!db) getFirebaseInstance();
    const cleanCode = syncCode.toLowerCase().trim();
    const docRef = doc(db, 'trackcal_data', cleanCode);
    const legacyDocRef = doc(db, 'bulktrack_data', cleanCode);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          onDataReceived(data);
        } else {
          // If trackcal_data doesn't exist yet, check legacy bulktrack_data
          getDoc(legacyDocRef).then((legacySnap) => {
            if (legacySnap.exists()) {
              const legacyData = legacySnap.data();
              onDataReceived(legacyData);
              // Migrate to new collection
              setDoc(docRef, legacyData, { merge: true }).catch(() => {});
            }
          }).catch(() => {});
        }
      },
      (err) => {
        console.warn('Firestore snapshot listener warning:', err);
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
  if (!syncCode) return false;

  try {
    if (!db) getFirebaseInstance();
    const cleanCode = syncCode.toLowerCase().trim();
    const docRef = doc(db, 'trackcal_data', cleanCode);
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
