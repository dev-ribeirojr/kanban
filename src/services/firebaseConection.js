import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBS5zSbUJrdyERFfaLxA6YPQ04kF5s2X-s",
  authDomain: "gerenciador-de-tarefas-6a07b.firebaseapp.com",
  projectId: "gerenciador-de-tarefas-6a07b",
  storageBucket: "gerenciador-de-tarefas-6a07b.appspot.com",
  messagingSenderId: "577758994164",
  appId: "1:577758994164:web:3a6ac45ce990d90d3f48a1",
  measurementId: "G-ZC8BRGQDKJ"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage };
