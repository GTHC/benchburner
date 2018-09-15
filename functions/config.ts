import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as firebase from 'firebase';
import * as dotenv from 'dotenv';

dotenv.load();

// admin.initializeApp();

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_DOMAIN,
  databaseURL: process.env.FIREBASE_DB_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MSG_ID
};

firebase.initializeApp(config);

const firestore = firebase.firestore();
firestore.settings({timestampsInSnapshots: true});


export {
  admin,
  config,
  firebase,
};
