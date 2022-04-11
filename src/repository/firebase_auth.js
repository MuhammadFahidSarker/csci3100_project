import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const firebaseConfig = {
    apiKey: "AIzaSyCL8Rgg8SUgYm0ZFjteD_CbdQQhyFtYlxk",
    authDomain: "test-96f35.firebaseapp.com",
    databaseURL: "https://test-96f35-default-rtdb.firebaseio.com",
    projectId: "test-96f35",
    storageBucket: "test-96f35.appspot.com",
    messagingSenderId: "213750274831",
    appId: "1:213750274831:web:b6b463fe9dcad688adbc7a",
    measurementId: "G-N4K0F1HWBN"
}

const app = initializeApp(firebaseConfig)

//firebase auth object
export const auth = getAuth(app)

//current user
export var user=undefined

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

onAuthStateChanged(auth, (u) => {
  if (u) {
    // User is signed in
    console.log(u)
    user=u
  } else {
    // User is signed out
    user=null
  }
})

export async function waitAuthObject(){
    while(user===undefined){
      await sleep(1000)
    }
}


