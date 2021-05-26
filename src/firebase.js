import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';



firebase.initializeApp({
  apiKey: "AIzaSyBOwFjSwiSz1w0N2nNWOODR0BJAAP_ul_E",
  authDomain: "chatter-2a660.firebaseapp.com",
  projectId: "chatter-2a660",
  storageBucket: "chatter-2a660.appspot.com",
  messagingSenderId: "71887498976",
  appId: "1:71887498976:web:faa68035a06f2c34986a85"
});


export const auth = firebase.auth;
auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);

export const db = firebase.database();

export function signup(email, password) {
  return auth().createUserWithEmailAndPassword(email, password)
}

export function signin(email, password) {
  return auth().signInWithEmailAndPassword(email, password);
}
