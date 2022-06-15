import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPuHtrQHYf8biduWIfcf2F6RZA6GNOJgY",
  authDomain: "biblioteca-eletronica-c2cdb.firebaseapp.com",
  projectId: "biblioteca-eletronica-c2cdb",
  storageBucket: "biblioteca-eletronica-c2cdb.appspot.com",
  messagingSenderId: "189263495501",
  appId: "1:189263495501:web:8af2efefb7341fdc75f704"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);