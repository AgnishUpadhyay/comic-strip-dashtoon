// firebase.js
import firebase from 'firebase/app'
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDiecCPsYjrHEaqXb9ycle_JGxWZFUUfzQ",
    authDomain: "dashtoon-comic.firebaseapp.com",
    projectId: "dashtoon-comic",
    storageBucket: "dashtoon-comic.appspot.com",
    messagingSenderId: "556797500668",
    appId: "1:556797500668:web:4116201b4ec36205794b79",
    measurementId: "G-6YGZWVXXVE"
  };

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
