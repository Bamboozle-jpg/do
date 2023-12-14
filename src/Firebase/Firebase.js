// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// import firebase from 'firebase/compat/app';

import 'firebase/compat/auth';

import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

// const firebaseConfig = {
//     apiKey: "AIzaSyAcyP7W_OibUuD7VNvJt6w4_bDeCUenucA",
//     authDomain: "dodue-d79cc.firebaseapp.com",
//     projectId: "dodue-d79cc",
//     storageBucket: "dodue-d79cc.appspot.com",
//     messagingSenderId: "684234639819",
//     appId: "1:684234639819:web:18fa5461a12b87f1abce4e"
// };

// Initialize Firebase
const app = initializeApp( firebaseConfig );


// eslint-disable-next-line
const analytics = getAnalytics( app );

export const auth = getAuth( app );
// export const auth2 = firebase.auth();

export const db = getFirestore( app );
