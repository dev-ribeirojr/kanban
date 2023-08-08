import { useState, useContext, useEffect } from 'react';
import './headerFrame.css';

import avatar from '../../assets/avatar.png';

import { AuthContext } from '../../contexts/auth';
import { BiSearchAlt, BiLoaderCircle } from 'react-icons/bi';

import { db } from '../../services/firebaseConection';
import { doc, updateDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function HeaderFrame({ frame, loading, isAdm }) {

  const { id } = useParams();
  const { handleLoadFriends, listFullUsers, loadingFullUsers } = useContext(AuthContext);

  const [listMembers, setListMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  const [modalMembers, setModalMembers] = useState(false);
  const [addMembers, setAddMembers] = useState(false);

  const [inputText, setInputText] = useState("");

  useEffect(() => {

    async function loadMembers() {
      if (!loading) {
        setListMembers([])
        frame.members.map(async (uid) => {
          const membersRef = doc(db, "users", uid);

          handleLoadFriends(membersRef, setListMembers, setLoadingMembers)
        })
      }
    }
    loadMembers();
    return () => { }

  }, [loading, frame])


  async function addMember(uid) {
    const frameRef = doc(db, "pictures", id)
    let list = frame.members
    list.push(uid)

    await updateDoc(frameRef, {
      members: list
    })
      .then(() => {
        setInputText("");
        setAddMembers(false);
        toast.success("Usuário adicionado com sucesso!")
      })
      .catch((error) => {
        console.log(error);
        toast.error("Não foi possível adicionar esse usuário!")
      })

  }
  function handleAdmMember(uid) {
    const exist = frame.adms.findIndex((adms) => adms === uid);
    if (exist !== -1) {
      return true
    } else {
      return false
    }
  }
  function handleCloseModal(e) {
    const container = document.querySelector(".container-membros");
    if (e.target === container) {
      setModalMembers(false);
      setInputText("");
      setAddMembers(false);
    }
  }
  function handleClose() {
    setModalMembers(false);
    setInputText("");
    setAddMembers(false);
  }
  function handleIsMember(uid) {
    const exist = frame.members.findIndex((member) => member === uid)
    if (exist !== -1) {
      return true
    } else {
      return false
    }
  }

  const filterUsers = listFullUsers.filter((user) => {
    const searchUpper = inputText.toUpperCase().trim();
    const users = user.name.toUpperCase();
    return users.includes(searchUpper);
  })

  function handleReturnAddMember() {
    setAddMembers(!addMembers);
    setInputText("");
  }

  if (loading) {
    return <section></section>
  }

  return (
    <header className="header-frame">
      <h1>{frame.title}</h1>
      <button
        className='btn-membros'
        onClick={() => setModalMembers(true)}
      >
        Membros
      </button>

      {modalMembers &&
        <section className='container-membros' onClick={(e) => handleCloseModal(e)}>
          <section className='content-membros'>
            <section className='btn-header'>
              <button
                onClick={handleClose}>
                Sair
              </button>
              {isAdm &&

                <button
                  className='add-member'
                  onClick={handleReturnAddMember}
                >
                  {addMembers ? "Voltar" : "Adicionar membro"}
                </button>
              }
            </section>
            {addMembers &&
              <section className='area-add-members'>
                <BiSearchAlt size={25} />
                <input
                  type='text'
                  placeholder='Adicione mais membros'
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </section>
            }
            <h1
              style={{ marginBottom: '0.3em', fontSize: 22 }}
            >Membros</h1>
            <ul className='filtro-user'>
              {inputText !== '' &&
                filterUsers.map((user) => (
                  <li key={user.uid}>
                    <section>
                      {user.profileUrl !== null ?
                        (
                          <img
                            src={user.profileUrl}
                            alt='Foto de perfil'
                            width={30}
                            height={30}
                          />
                        )
                        :
                        (
                          <img
                            src={avatar}
                            alt='Foto de perfil'
                            width={30}
                            height={30}
                          />
                        )
                      }
                      <p>{user.name}</p>
                    </section>
                    {handleIsMember(user.uid) ?
                      (
                        <p>Já é membro</p>
                      )
                      :
                      (
                        <button
                          onClick={() => addMember(user.uid)}
                        >
                          adicionar
                        </button>
                      )
                    }
                  </li>
                ))
              }
            </ul>
            <section className='area-membros'>
              <ul className='list-membros'>
                {loadingMembers &&
                  <li style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: 4,
                    paddingBottom: 4
                  }}>
                    <BiLoaderCircle className='loading' color='#FFF' size={25} />
                  </li>
                }
                {listMembers.map((doc) => (
                  <li key={doc.uid}>
                    <section>
                      {doc.profileUrl !== null ?
                        (
                          <img src={doc.profileUrl} alt="Foto perfil" width={40} height={40} />
                        )
                        :
                        (
                          <img src={avatar} alt='Foto perfil' width={40} height={40} />
                        )

                      }
                      <p>{doc.name}</p>
                      {handleAdmMember(doc.uid) &&
                        <p className='adm'>
                          Adm
                        </p>
                      }
                    </section>
                    {isAdm && !handleAdmMember(doc.uid) &&
                      <section>
                        <button className='up'>
                          Promover
                        </button>
                        <button className='delete'>
                          Excluir
                        </button>
                      </section>
                    }
                  </li>
                ))
                }
              </ul>
            </section>
          </section>
        </section>
      }

    </header >
  )
}
