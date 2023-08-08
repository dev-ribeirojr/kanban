import { useState, useContext, useEffect } from 'react';
import './renderPictures.css';

import { FaArrowRight } from 'react-icons/fa';
import { BiLoaderCircle } from 'react-icons/bi';
import { AuthContext } from '../../contexts/auth';

import { Link } from 'react-router-dom';

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebaseConection';

export default function RenderPictures({ setModalNewPicture }) {

  const { user } = useContext(AuthContext);

  const [listFrames, setListFrames] = useState([]);
  const [loadingPictures, setLoadingPictures] = useState(true);
  const [userr, setUserr] = useState(user !== null ? true : false);

  useEffect(() => {

    if (user !== null) {
      async function handleSearchPictures() {
        const docRef = collection(db, "pictures");
        await getDocs(docRef)
          .then((snapshot) => {
            setListFrames([]);
            snapshot.forEach((snap) => {
              const membersSnap = snap.data().members
              membersSnap.map((uid) => {
                if (uid === user.uid) {
                  let list = []
                  list.push({
                    id: snap.id,
                    adms: snap.data().adms,
                    created: snap.data().created,
                    members: snap.data().members,
                    pictures: snap.data().pictures,
                    title: snap.data().title,
                    createdHoursFormat: snap.data().createdHoursFormat,
                    createdDayFormat: snap.data().createdDayFormat,
                    createdUser: snap.data().createdUser
                  })
                  setListFrames(lista => [...lista, ...list]);
                }
              })
            })
            setLoadingPictures(false)
          })
          .catch(() => {
            setLoadingPictures(false)
          })
      }
      handleSearchPictures()
    }

    return () => { }
  }, [userr])

  return (
    <section className='container-pictures'>

      {loadingPictures &&
        <section className='card-picture'>
          <section className='info' style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>

            <BiLoaderCircle size={25} color='#FFF' className='loading' />

          </section>

          <button className='area-btn-entrar' >
            <BiLoaderCircle size={25} color='#FFF' className='loading' />
          </button>
        </section>
      }
      {!loadingPictures && listFrames.length === 0 &&
        <section
          className='card-picture'
        >
          <section className='info' style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}>

            <p>Você não está participando de nenhum quadro</p>

          </section>

          <button
            onClick={() => setModalNewPicture(true)}
            className='area-btn-entrar'
            style={{
              fontSize: "1em",
              color: '#FFF'
            }}
          >
            Criar um Quadro.
          </button>
        </section>
      }

      {!loadingPictures &&
        listFrames.map((doc) => (
          <section key={doc.id} className='card-picture'>
            <section className='info'>
              <h1>{doc.title}</h1>

              <p>Membros: {doc.members.length}</p>
              <p>Criada em: {doc.createdDayFormat} as {doc.createdHoursFormat} </p>
              <p>Criado por: {doc.createdUser}</p>

            </section>

            <Link
              to={`/frame/${doc.id}`}
              className='area-btn-entrar'
            >
              <FaArrowRight size={25} color='#FFF' />
            </Link>
          </section>
        ))
      }
    </section>
  )
}