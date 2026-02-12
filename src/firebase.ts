import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDeSi4tvPbfR-r_mFm2J3QoB22NYOGqPVQ",
  authDomain: "it-department-0820.firebaseapp.com",
  projectId: "it-department-0820",
  storageBucket: "it-department-0820.firebasestorage.app",
  messagingSenderId: "916314560151",
  appId: "1:916314560151:web:8bf3bcbfee59d64cf1bbd2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
