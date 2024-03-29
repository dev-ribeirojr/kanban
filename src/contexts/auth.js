import { useState, createContext, useEffect } from 'react';
import { db, auth } from '../services/firebaseConection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { setDoc, doc, getDoc, getDocs, collection, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { format, parseISO } from 'date-fns';

export const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const localStorageKey = '@dataUserLogado';
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // amigos
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [listUidFriends, setListUidFriends] = useState(user && user?.friends);

  //lista de usuários
  const [listFullUsers, setListFullUsers] = useState([]);
  const [loadingFullUsers, setLoadingFullUsers] = useState(true);

  //useState que controla o input add amigos no header
  const [searchWidth, setSearchWidth] = useState(null);

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
    return () => { }
  }, [])

  // Carregando Amigos do usuário logado
  useEffect(() => {

    setFriends([])
    async function loadFriends() {
      if (user) {
        user.friends.map(async (uid) => {
          const friendsRef = doc(db, 'users', uid);
          handleLoadFriends(friendsRef, setFriends, setLoadingFriends);
        })
      }
      setLoadingFriends(false)
    }
    loadFriends()

    setListUidFriends(user?.friends)

    return () => { }
  }, [user])

  /*
    Função que irá buscar todos os usuários para a pesquisa de pessoas
    OBS: pensando em grande escala essa função ficará sobrecarregando muito.
    apenas para dar uma boa experiência ao usuário, mas irei buscar por melhorias e evitar isso.
  */
  useEffect(() => {
    async function loadUsersFull() {

      const docRef = collection(db, "users");

      await getDocs(docRef)
        .then((snapshot) => {
          let list = []
          snapshot.forEach((snap) => {

            if (user?.uid === snap.id) {
              return
            }

            list.push({
              uid: snap.id,
              name: snap.data().name,
              profileUrl: snap.data().profileUrl,
              about: snap.data().about,
              titleProfile: snap.data().titleProfile
            })
          })
          setListFullUsers(list);
          setLoadingFullUsers(false)
        })
        .catch((error) => {
          console.log(error)
          setLoadingFullUsers(false)
        })
    }

    loadUsersFull()
    return () => { }
  }, [user])

  function handleFormat(date) {
    const data = parseISO(date);
    const dataFormat = format(data, "dd/MM/yyyy");
    return dataFormat;
  }

  /**
   *  mostrando o input caso usuário não tenha amigo em sua lista e clique no botão para adicionar
   *  *@author Pablo abrir busca de amigos no header */

  function handleWidthSearchUser() {
    setSearchWidth(200)
  }

  // gerênciamento de amigos e usuários

  // removendo amigo
  async function handleRemoveUser(uid) {
    const list = listUidFriends.filter(doc => doc !== uid)

    setListUidFriends(list);

    const docRef = doc(db, "users", user.uid)
    await updateDoc(docRef, { friends: list })
      .then(() => {

        const newListFriends = friends.filter(user => user.uid !== uid)
        setFriends(newListFriends);

        let data = {
          uid: user.uid,
          name: user.name,
          email: user.email,
          profileUrl: user.profileUrl,
          birth: user.birth,
          about: user.about,
          titleProfile: user.titleProfile,
          friends: list
        }
        storageUser(data)

        toast.success("Sucesso ao remover amigo!")
      })
      .catch((error) => {
        toast.error('error')
        console.log(error)
      })
  }

  // adicionando amigo
  async function handleAddUser(uid) {

    setListUidFriends(list => [...list, uid])

    const docRef = doc(db, "users", user.uid)
    await updateDoc(docRef, { friends: [...listUidFriends, uid] })
      .then(() => {

        let data = {
          uid: user.uid,
          name: user.name,
          email: user.email,
          profileUrl: user.profileUrl,
          birth: user.birth,
          about: user.about,
          titleProfile: user.titleProfile,
          friends: [...listUidFriends, uid]
        }

        storageUser(data);
        toast.success("Sucesso ao adicionar amigo!")
      })
      .catch((error) => {
        toast.error("erro")
        console.log(error)
      })

    const friendsRef = doc(db, 'users', uid);
    handleLoadFriends(friendsRef, setFriends, setLoadingFriends);
  }

  // busca de amigos 
  async function handleLoadFriends(ref, setList, loading) {
    await getDoc(ref)

      .then((doc) => {
        let list = []

        list.push({
          uid: doc.id,
          name: doc.data().name,
          profileUrl: doc.data().profileUrl,
          titleProfile: doc.data().titleProfile,
          about: doc.data().about,
          birth: doc.data().birth
        })
        setList(friendsList => [...friendsList, ...list])
        loading(false)
      })
      .catch((error) => {
        console.log(error)
        loading(false)
      })
  }

  // gerenciamento de usuário

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
          profileUrl: docSnap.data().profileUrl,
          birth: docSnap.data().birth,
          about: docSnap.data().about,
          titleProfile: docSnap.data().titleProfile,
          friends: docSnap.data().friends
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
        if (error.code === "auth/invalid-email") {
          toast.error("Digite um email válido");
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
        console.log(value)

        let uidUser = value.user.uid
        await setDoc(doc(db, "users", uidUser), {
          name: name,
          birth: birth,
          createdFormat: new Date(),
          profileUrl: null,
          about: '',
          titleProfile: '',
          friends: [],
        })
          .then(() => {
            let data = {
              uid: uidUser,
              name: name,
              email: value.user.email,
              birth: birth,
              profileUrl: null,
              titleProfile: '',
              friends: []
            }
            setUser(data);
            storageUser(data);
            setLoading(false);
            navigate('/home');
          })
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          console.log(error.code)
          toast.error('Este email já está sendo utilizado!');
          setLoading(false);
          return;
        }
        if (error.code === "auth/invalid-email") {
          toast.error("Digite um email válido.");
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
  async function logOut() {
    await signOut(auth)
      .then(() => {
        localStorage.removeItem(localStorageKey);
        setUser(null)
      })
      .catch((error) => {

        console.log(error)
        toast.error('Erro ao sair da conta.')
      })
  }


  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        signUp,
        signIn,
        logOut,
        setUser,
        storageUser,
        handleFormat,
        loading,
        user,

        //loadUserUid
        handleLoadFriends,

        //friends
        loadingFriends,
        friends,
        handleAddUser,
        handleRemoveUser,

        //filtro de busca usuários
        listFullUsers,
        loadingFullUsers,

        //abrindo busca de usuários
        handleWidthSearchUser,
        setSearchWidth,
        searchWidth,

      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
