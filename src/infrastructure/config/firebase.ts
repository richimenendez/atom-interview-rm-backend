import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    console.log('Initializing Firebase with default config');
    admin.initializeApp();
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
}

export const auth = admin.auth();
export const db = admin.firestore();
export const storage = admin.storage(); 