import { useContext, useState, useRef } from 'react';
import './header.css';
import avatar from '../../assets/avatar.png';

import { MdNotificationsNone, MdLogout } from 'react-icons/md';
import { FiSettings } from 'react-icons/fi';
import { FaHome, FaUserCog } from 'react-icons/fa'

import { AuthContext } from '../../contexts/auth';
import { Link } from 'react-router-dom';
import { BiSearchAlt } from 'react-icons/bi';

import SearchUsers from '../SearchUsers';

export default function Header({ data }) {

  const { user, logOut } = useContext(AuthContext);
  const [modal, setModal] = useState(false);

  const inputRef = useRef();
  const [searchWidth, setSearchWidth] = useState(null);
  const [fetchPeople, setFetchPeople] = useState("");

  function fecharModal(e) {
    const modal = document.querySelector('.modal-header');
    if (e.target === modal) {
      setModal(!modal);
      return;
    }
  }
  function handleOfFocus() {
    if (fetchPeople.trim() !== "") {
      return;
    }
    setSearchWidth(null)
    setFetchPeople('')
  }

  function handleYears(birth) {

    const birthUser = birth.replaceAll("-", '');
    const data = new Date()

    let ano = data.getFullYear();
    let mes = data.getMonth();
    let dia = data.getDate();

    const fullData = `${ano}${mes + 1 < 10 ? `0${mes + 1}` : mes + 1}${dia < 10 ? `0${dia}` : dia}`;

    const birthNum = parseInt(birthUser);
    const dataNum = parseInt(fullData);

    const yearsNum = dataNum - birthNum

    const years = yearsNum.toString().substring(0, 2);
    return years
  }

  return (
    <header className='header'>
      <section className='section-header'>
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
              onClick={() => inputRef.current.focus()}
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
              ref={inputRef}
              style={{
                width: searchWidth,
              }}
            />
          </div>
        }
      </section>
      <section className="area-titulo-header section-header">
        <h1>Gerenciador de Tarefas</h1>
      </section>
      <section className='section-header'>
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
        <section className='modal-header' onClick={fecharModal}>
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
              <p>Idade: {handleYears(user.birth)} anos</p>
              <p>Id: <span>{user.uid}</span></p>
            </section>
            {data === 'profile' ?
              <Link to={"/home"}>
                <FaHome />
                Inicio
              </Link>
              :
              <Link to={"/profile"}>
                <FaUserCog size={25} />
                Perfil
              </Link>
            }
            <button onClick={() => logOut()}>
              <MdLogout size={25} />
              Sair
            </button>
          </section>
        </section>
      }
      {/* Fim modal */}
      {/* Modal search users */}
      {
        fetchPeople.trim() !== "" &&
        <SearchUsers
          value={fetchPeople}
          setValue={setFetchPeople}
          handleOfFocus={handleOfFocus}
          setSearchWidth={setSearchWidth}
        />

      }
      {/* Fim modal search users */}
    </header>
  )
}