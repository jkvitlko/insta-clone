import firebase from 'firebase';

  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCGaMM_73K7NVQZ7vYSoHQklRm-BImB-Vo",
    authDomain: "instagram-clone-f33a0.firebaseapp.com",
    databaseURL: "https://instagram-clone-f33a0.firebaseio.com",
    projectId: "instagram-clone-f33a0",
    storageBucket: "instagram-clone-f33a0.appspot.com",
    messagingSenderId: "904508881448",
    appId: "1:904508881448:web:551824ef45fdbcbd93931d",
    measurementId: "G-XDEV1GJGWK"
  })

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {db, auth, storage};