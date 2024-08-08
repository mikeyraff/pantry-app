// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore';



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdfRIrCAGgGcXo6pPEOyhG2S6rSjcF8VQ",
  authDomain: "final-project-869bd.firebaseapp.com",
  projectId: "final-project-869bd",
  storageBucket: "final-project-869bd.appspot.com",
  messagingSenderId: "342708819898",
  appId: "1:342708819898:web:18e5c0b9331cb79078af83"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);