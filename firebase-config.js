// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyCMeJhxPqWyXB1tZqpN0YdYHOEzKlCB-RM",
  authDomain: "ghostgrid.firebaseapp.com",
  projectId: "ghostgrid",
  storageBucket: "ghostgrid.appspot.com", // fixade här
  messagingSenderId: "867043406657",
  appId: "1:867043406657:web:0cd071cddcf463aaaae7c0"
};

// Initialisera Firebase för webbsidan
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
