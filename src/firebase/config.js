// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDa2Cra7Hq9ExskiH-YmRuiMFdHScljzQI",
  authDomain: "isisproject-5c75a.firebaseapp.com",
  projectId: "isisproject-5c75a",
  storageBucket: "isisproject-5c75a.appspot.com",
  messagingSenderId: "192901724922",
  appId: "1:192901724922:web:36638527479fa3489a2743",
  measurementId: "G-1XDJG9Q80W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//initialize db
const db = getDatabase(app);
export { db };