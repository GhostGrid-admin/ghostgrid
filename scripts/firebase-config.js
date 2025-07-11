// firebase-config.js
if (!window.firebaseAppInitialized) {
  const firebaseConfig = {
    apiKey: "AIzaSyCjWQB0hAO1r686hVdpBKBJkaIYMXOM8l8",
    authDomain: "ghostgrid-fb278.firebaseapp.com",
    projectId: "ghostgrid-fb278",
    storageBucket: "ghostgrid-fb278.appspot.com",
    messagingSenderId: "283208202937",
    appId: "1:283208202937:web:11c0cea81fd18a31163968"
  };
  firebase.initializeApp(firebaseConfig);
  window.db = firebase.firestore();
  window.auth = firebase.auth();
  window.firebaseAppInitialized = true;
}
