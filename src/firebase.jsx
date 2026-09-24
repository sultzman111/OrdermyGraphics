
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1TM9GLL-Fab_5jjzhXL88czELbYTUr_M",
  authDomain: "ordermygraphics.firebaseapp.com",
  projectId: "ordermygraphics",
  storageBucket: "ordermygraphics.firebasestorage.app",
  messagingSenderId: "347045259798",
  appId: "1:347045259798:web:4a69df8c1979a26900e337"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;