import { useContext, useState, useRef } from 'react';
import './header.css';
import avatar from '../../assets/avatar.png';

import { MdNotificationsNone, MdLogout } from 'react-icons/md';
import { FiSettings } from 'react-icons/fi';
import { FaHome, FaUserCog } from 'react-icons/fa'

import { AuthContext } from '../../contexts/auth';
import { Link } from 'react-router-dom';
import { BiSearchAlt } from 'react-icons/bi';

export default function Header({ data }) {

  const { user, logOut } = useContext(AuthContext);
  const [modal, setModal] = useState(false);

  const [searchWidth, setSearchWidth] = useState(null);
  const [fetchPeople, setFetchPeople] = useState("");

  function fecharModal(e) {
    const modal = document.querySelector('.modal');
    if (e.target === modal) {
      setModal(!modal);
      return;
    }
  }
  function handleOfFocus() {
    setSearchWidth(null)
    setFetchPeople('')
  }

  return (
    <header className='header'>
      <section>
        {data === "profile" &&
          <Link to={"/home"} className='btn-header'>
            <FaHome />
          </Link>
        }
        {data === "home" &&
          <div
            className='search-friends'
            style={{
              border: searchWidth === 200 ? '1px solid #FFF' : null
            }}
          >
            <BiSearchAlt
              color='#FFF'
              size={35}
              style={{
                borderRadius: searchWidth === 200 ? '50%' : null
              }}
            />
            <input
              type='text'
              placeholder='Busque por pessoas'
              value={fetchPeople}
              onChange={(e) => setFetchPeople(e.target.value)}
              onFocus={() => setSearchWidth(200)}
              onBlur={handleOfFocus}

              style={{
                width: searchWidth,
              }}
            />
          </div>
        }
      </section>
      <section className="area-titulo-header">
        <h1>Gerenciador de Tarefas</h1>
      </section>
      <section>
        <button className='btn-header btn-icon'>
          <MdNotificationsNone />
        </button>
        <button className='btn-header btn-icon'>
          <FiSettings />
        </button>
        {user.profileUrl === null ?
          (
            <img
              src={avatar}
              alt='img perfil'
              className='img-header'
              onClick={() => setModal(!modal)}
            />
          )
          :
          (
            <img
              src={user.profileUrl}
              alt='img perfil'
              className='img-header'
              onClick={() => setModal(!modal)}
            />
          )
        }
      </section>

      { /* Modal  */}

      {modal &&
        <section className='modal' onClick={fecharModal}>
          <section className='modal-perfil'>
            <button
              onClick={() => setModal(!modal)}
              className='btn-fechar-perfil'
            >X</button>
            <section>
              {user.profileUrl === null ?
                (
                  <img src={avatar} alt='img perfil' width={100} height={100} />
                )
                :
                (
                  <img src={user.profileUrl} alt='img perfil' width={100} height={100} />
                )
              }
              <h2>{user.name}</h2>
              <p>Idade: 22 anos</p>
              <p>Id: <span>{user.uid}</span></p>
            </section>
            {data === 'profile' ?
              <Link to={"/home"}>
                <FaHome />
                Inicio
              </Link>
              :
              <Link to={"/profile"}>
                <FaUserCog />
                Perfil
              </Link>
            }
            <button onClick={() => logOut()}>
              <MdLogout />
              Sair
            </button>
          </section>
        </section>
      }
    </header>
  )
}