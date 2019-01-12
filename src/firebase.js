import app from 'firebase/app';
import 'firebase/database';

const config = {
  apiKey: "AIzaSyA_MDT2dIX-62pFrKWp7WUFuNoxJ5j67Hg",
  authDomain: "aes256note.firebaseapp.com",
  databaseURL: "https://aes256note.firebaseio.com",
  projectId: "aes256note",
  storageBucket: "aes256note.appspot.com",
  messagingSenderId: "899639808664"
}

class Firebase {
  constructor(){
    app.initializeApp(config);
  }
}

export default app.initializeApp(config);
