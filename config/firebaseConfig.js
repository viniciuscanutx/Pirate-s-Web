import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyACqBD9-Ylvz1h0yaL35qWcwzaYOcQWAwU",
    authDomain: "piratesauth.firebaseapp.com",
    databaseURL: "https://piratesauth-default-rtdb.firebaseio.com",
    projectId: "piratesauth",
    storageBucket: "piratesauth.firebasestorage.app",
    messagingSenderId: "357367486995",
    appId: "1:357367486995:web:5c2ffe27ad9dd7488d7de6"
  };

let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp(); 
}

const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth };

