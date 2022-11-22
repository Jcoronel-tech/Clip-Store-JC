// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbjCx5wH5SnqE4U2xR2fF-ZmobbnRg9q8",
  authDomain: "clip-store-jc.firebaseapp.com",
  databaseURL: "https://clip-store-jc-default-rtdb.firebaseio.com",
  projectId: "clip-store-jc",
  storageBucket: "clip-store-jc.appspot.com",
  messagingSenderId: "332518182888",
  appId: "1:332518182888:web:ecc1b2b616a49e26199e5d",
  measurementId: "G-2VYHWJ9W13"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;