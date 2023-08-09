import { useContext, useState } from "react";
import './search.css'

import { AuthContext } from "../../contexts/auth";
import { BiLoaderCircle } from 'react-icons/bi';

import ProfileUser from "../ProfileUSer";
import avatar from '../../assets/avatar.png';

export default function Search({ value, setValue, setSearchWidth }) {

  const { listFullUsers, loadingFullUsers } = useContext(AuthContext);
  const [userSelected, setUserSelected] = useState([]);
  const [modal, setModal] = useState(false)

  const filterUsers = listFullUsers.filter(user => {
    const searchUpper = value.toUpperCase().trim();
    const users = user.name.toUpperCase();
    return users.includes(searchUpper)
  });

  function handleUserSelected(user) {
    setUserSelected(user)
    setModal(true);
  }

  function handleReturn() {
    setModal(false);
    setUserSelected([]);
    setValue("");
    setSearchWidth(null);
  }

  function handleClick(e) {
    const container = document.querySelector('.container-search-users');

    if (e.target === container) {
      setValue("");
      setSearchWidth(null);
    }
  }

  return (
    <>
      <section className="container-search-users" onClick={(e) => handleClick(e)}>
        <section className="modal-search-users">
          {loadingFullUsers ?
            <section style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} >
              <BiLoaderCircle color="#FFF" size={35} className="loading" />
            </section>
            :
            filterUsers.map((user) => (
              <section
                key={user.uid}
                className="user"
                onClick={() => handleUserSelected(user)}
              >
                {user.profileUrl === null ?
                  (
                    <img src={avatar} alt="Foto de Perfil" />
                  )
                  :
                  (
                    <img src={user.profileUrl} alt="Foto de Perfil" />
                  )
                }
                <p>{user.name}</p>
              </section>
            ))

          }
          {value.trim() !== "" && filterUsers.length === 0 &&
            <section
              style={{
                color: '#FFF',
                padding: '8px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <p>Usuário não encontrado</p>
            </section>

          }
        </section>
      </section>
      {modal &&
        <ProfileUser
          userSelected={userSelected}
          handleReturn={handleReturn}
        />
      }
    </>
  )
}