// Import the functions you need from the SDKs you need
import { initializeApp } from "@react-native-firebase/app";
import { getFirestore } from "@react-native-firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDu_NHKhUPNLKpoOSjHNB693Op5t0Fnegk",
  authDomain: "cooker-looker.firebaseapp.com",
  projectId: "cooker-looker",
  storageBucket: "cooker-looker.firebasestorage.app",
  messagingSenderId: "238191136983",
  appId: "1:238191136983:web:fb62a8cc815cce52b02092",
  measurementId: "G-MS8BZ1L8H2",
  databaseURL: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };