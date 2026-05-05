// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6TI9kwys34Sq7ULiVZSUjartf53jHwx0",
  authDomain: "study-planner-e7507.firebaseapp.com",
  projectId: "study-planner-e7507",
  storageBucket: "study-planner-e7507.appspot.com",
  messagingSenderId: "575127073249",
  appId: "1:575127073249:web:4e767933fa73bc3b25e2a0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const db=getFirestore(app);
export default app;