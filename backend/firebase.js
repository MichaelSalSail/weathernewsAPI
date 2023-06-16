// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
const credentials=require('./API_keys.json');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: credentials.firebase.web_app.apiKey,
  authDomain: credentials.firebase.web_app.authDomain,
  projectId: credentials.firebase.web_app.projectId,
  storageBucket: credentials.firebase.web_app.storageBucket,
  messagingSenderId: credentials.firebase.web_app.messagingSenderId,
  appId: credentials.firebase.web_app.appId,
  measurementId: credentials.firebase.web_app.measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);