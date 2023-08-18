import { useState, useContext, useEffect } from 'react';
import './headerFrame.css';

import { doc, deleteDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';

import { AuthContext } from '../../../../contexts/auth';

import { BiSearchAlt } from 'react-icons/bi';
//firebase
import { db } from '../../../../services/firebaseConection';

//components
import MembersList from '../MembersList';
import SearchUser from '../SearchUser';

export default function HeaderFrame({ frame, loading, isAdm, userUid }) {
  const { handleLoadFriends, listFullUsers, loadingFullUsers } = useContext(AuthContext);
  const { id } = useParams();

  const navigate = useNavigate();

  const [listMembers, setListMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  const [modalMembers, setModalMembers] = useState(false);
  const [addMembers, setAddMembers] = useState(false);
  const [inputText, setInputText] = useState("");

  const isCreator = userUid === frame?.createdUser?.uid

  useEffect(() => {
    async function loadMembers() {
      if (!loading) {
        setListMembers([])
        frame.members?.map(async (uid) => {
          const membersRef = doc(db, "users", uid);
          handleLoadFriends(membersRef, setListMembers, setLoadingMembers);
        })
      }
    }
    loadMembers();
    return () => { }

  }, [loading, frame])

  function handleAdmMember(uid) {
    const exist = frame?.adms.findIndex((adms) => adms === uid);
    if (exist !== -1) {
      return true
    } else {
      return false
    }
  }
  function handleCloseModal(e) {
    const container = document.querySelector(".container-membros");
    if (e.target === container) {
      handleClose();
    }
  }
  function handleClose() {
    setModalMembers(false);
    setAddMembers(false);
    setInputText("");
  }
  function handleReturnAddMember() {
    setAddMembers(!addMembers);
    setInputText("");
  }

  async function handleRemoveFrame() {
    const docRef = doc(db, "pictures", id)
    await deleteDoc(docRef)
      .then(() => {
        navigate("/home")
      })
      .catch((error) => {
        console.log(error)
      })
  }

  if (loading) {
    return <section></section>
  }

  return (
    <header className="header-frame">

      {
        /**
         * @author Pablo saindo do quandro navegando de volta para a home
         */
      }
      <button
        className='btn-header-frame'
        onClick={() => navigate("/home")}
      >
        Sair
      </button>
      <h1>{frame.title}</h1>
      <button
        className='btn-header-frame'
        onClick={() => setModalMembers(true)}
      >
        Membros
      </button>
      {isCreator &&
        <button
          className='btn-header-frame'
          onClick={handleRemoveFrame}
        >
          Excluir Quadro
        </button>
      }

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
            >
              Membros
            </h1>
            {/** *@author Pablo componentizando busca para add novo membro */}
            <SearchUser
              frame={frame}
              inputText={inputText}
              setAddMembers={setAddMembers}
              setInputText={setInputText}
            />

            {/** *@author Pablo Componentizando lista de membros */}
            <MembersList
              handleAdmMember={handleAdmMember}
              isAdm={isAdm}
              listMembers={listMembers}
              loadingMembers={loadingMembers}
              frame={frame}
            />
          </section>
        </section>
      }

    </header >
  )
}
