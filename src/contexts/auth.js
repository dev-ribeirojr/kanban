import { useState, createContext, useEffect } from 'react';
import { db, auth } from '../services/firebaseConection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { format } from 'date-fns';

export const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const localStorageKey = '@dataUserLogado';
  const navigate = useNavigate();

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      const storageUser = JSON.parse(localStorage.getItem(localStorageKey));

      if (storageUser) {
        setUser(storageUser);
        setLoading(false);
      }
      setLoading(false);
    }
    loadUser();
  }, [])

  // logando usuário
  async function signIn(email, password) {
    setLoading(true)
    await signInWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        let uidUser = value.user.uid;

        const docRef = doc(db, "users", uidUser);
        const docSnap = await getDoc(docRef);

        let data = {
          uid: uidUser,
          name: docSnap.data().name,
          email: value.user.email,
          profileUrl: docSnap.data().profileUrl
        }
        setUser(data);
        storageUser(data);
        setLoading(false);
        navigate('/home');
      })
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          toast.error("Email não cadastrado, crie uma conta!");
          setLoading(false);
          return;
        }
        if (error.code === "auth/wrong-password") {
          toast.error("Senha inválida.");
          setLoading(false);
          return;
        }
        console.log(error)
        setLoading(false)
      })
  }

  //cadastrando usuário
  async function signUp(name, birth, email, password) {
    setLoading(true)
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        let uidUser = value.user.uid
        await setDoc(doc(db, "users", uidUser), {
          name: name,
          birth: birth,
          createdFormat: new Date(),
          profileUrl: null
        })
          .then(() => {
            let data = {
              uid: uidUser,
              name: name,
              email: value.user.email,
              birth: birth,
              profileUrl: null,
            }
            setUser(data);
            storageUser(data);
            setLoading(false);
            navigate('/home');
          })
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          toast.error('Este email já está sendo utilizado!');
          setLoading(false);
          return;
        }
        console.log(error);
        setLoading(false)
      })
  }

  //salvando dados do usuário logado
  function storageUser(data) {
    localStorage.setItem(localStorageKey, JSON.stringify(data));
  }

  //deslogar usuário

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        signUp,
        signIn,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
