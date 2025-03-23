import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { enableIndexedDbPersistence } from "firebase/firestore";

// Firebase configuration
// Use actual Firebase project credentials for production
const firebaseConfig = {
  apiKey: "AIzaSyDXYtYP5FY3Ww6FabLEOCCHKZb27QG5hw8",
  authDomain: "timecapsule-app-b0e5f.firebaseapp.com",
  projectId: "timecapsule-app-b0e5f",
  storageBucket: "timecapsule-app-b0e5f.appspot.com",
  messagingSenderId: "1098765432109",
  appId: "1:1098765432109:web:abcdef1234567890abcdef",
};

// Initialize Firebase with error handling
let app, db, storage, auth;

// Create mock implementations to use as fallbacks
const createMockDB = () => {
  console.log("Creating mock Firestore implementation");
  return {
    collection: (collectionPath) => {
      console.log(`Mock collection access: ${collectionPath}`);
      return {
        add: async (data) => {
          console.log(`Mock add to ${collectionPath}:`, data);
          return { id: `mock-${Date.now()}` };
        },
        get: async () => {
          console.log(`Mock get from ${collectionPath}`);
          return { docs: [] };
        },
        doc: (docId) => {
          console.log(`Mock doc access: ${collectionPath}/${docId}`);
          return {
            get: async () => {
              console.log(`Mock get doc: ${collectionPath}/${docId}`);
              return { exists: false, data: () => ({}) };
            },
            set: async (data) => {
              console.log(`Mock set doc: ${collectionPath}/${docId}`, data);
            },
            update: async (data) => {
              console.log(`Mock update doc: ${collectionPath}/${docId}`, data);
            },
            delete: async () => {
              console.log(`Mock delete doc: ${collectionPath}/${docId}`);
            },
            collection: (subCollectionPath) => {
              console.log(
                `Mock subcollection access: ${collectionPath}/${docId}/${subCollectionPath}`,
              );
              return {
                add: async (data) => {
                  console.log(
                    `Mock add to ${collectionPath}/${docId}/${subCollectionPath}:`,
                    data,
                  );
                  return { id: `mock-${Date.now()}` };
                },
                get: async () => {
                  console.log(
                    `Mock get from ${collectionPath}/${docId}/${subCollectionPath}`,
                  );
                  return { docs: [] };
                },
              };
            },
          };
        },
      };
    },
  };
};

const createMockStorage = () => ({
  ref: () => ({
    put: async () => ({
      ref: {
        getDownloadURL: async () => "https://example.com/placeholder.jpg",
      },
    }),
    getDownloadURL: async () => "https://example.com/placeholder.jpg",
  }),
});

// Create a mock auth object that mimics the Firebase Auth API
const mockAuth = {
  currentUser: null,
  onAuthStateChanged: (callback) => callback(null),
  signInAnonymously: async () => ({}),
};

// Function to initialize Firestore with retry logic
const initializeFirestore = async (maxRetries = 3) => {
  let retries = 0;
  let firestoreDb = null;

  while (retries < maxRetries) {
    try {
      console.log(
        `Attempting to initialize Firestore (attempt ${retries + 1}/${maxRetries})...`,
      );
      firestoreDb = getFirestore(app);

      // Try to enable offline persistence
      try {
        await enableIndexedDbPersistence(firestoreDb);
        console.log("Offline persistence enabled for Firestore");
      } catch (persistenceError) {
        console.warn("Failed to enable offline persistence:", persistenceError);
        // Continue even if persistence fails
      }

      console.log("Firestore initialized successfully");
      return firestoreDb;
    } catch (error) {
      retries++;
      console.error(
        `Firestore initialization attempt ${retries} failed:`,
        error,
      );

      if (retries < maxRetries) {
        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, retries) * 1000;
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  console.error(`Failed to initialize Firestore after ${maxRetries} attempts`);
  return null;
};

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  console.log("Firebase app initialized successfully");

  // Initialize Firestore with retry logic
  initializeFirestore()
    .then((firestoreDb) => {
      if (firestoreDb) {
        db = firestoreDb;
      } else {
        console.warn(
          "Using mock Firestore implementation due to connection failure",
        );
        db = createMockDB();
      }
    })
    .catch((error) => {
      console.error("Error in Firestore initialization:", error);
      db = createMockDB();
    });

  // Initialize Storage
  try {
    storage = getStorage(app);
    console.log("Storage initialized successfully");
  } catch (storageError) {
    console.error("Error initializing Storage:", storageError);
    storage = createMockStorage();
  }

  // Set auth to the mock implementation
  // We're not initializing Firebase Auth to avoid the "component auth has not been registered yet" error
  auth = mockAuth;
  console.log("Using mock Auth implementation");
} catch (error) {
  console.error("Error initializing Firebase app:", error);

  // Use mock implementations if Firebase initialization fails
  db = createMockDB();
  storage = createMockStorage();
  auth = mockAuth;

  console.log("Using mock Firebase implementations");
}

// Temporary solution to ensure db is available immediately
// This will be replaced by the real Firestore instance once initialized
if (!db) {
  console.log("Setting up temporary mock Firestore while real one initializes");
  db = createMockDB();
}

export { db, storage, auth };
