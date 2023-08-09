import './header.css';
import { useContext, useState, useRef, memo } from 'react';
import { Link } from 'react-router-dom';

//context
import { AuthContext } from '../../contexts/auth';

//imgs
import avatar from '../../assets/avatar.png';

//icons
import { BiSearchAlt } from 'react-icons/bi';
import { FaHome, FaUserCog } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import { MdNotificationsNone, MdLogout } from 'react-icons/md';

//components
import Search from '../Search';

export const Header = memo(({ data }) => {

  const { user, logOut, searchWidth, setSearchWidth } = useContext(AuthContext);
  const [modal, setModal] = useState(false);

  const inputRef = useRef();
  const [fetchPeople, setFetchPeople] = useState("");

  function fecharModal(e) {
    const modal = document.querySelector('.modal-header');
    if (e.target === modal) {
      setModal(!modal);
      return;
    }
  }
  // busca de usuários
  function handleOfFocus() {
    if (fetchPeople.trim() !== "") {
      return;
    }
    setSearchWidth(null)
    setFetchPeople('')
  }
  // calculo de idade do usuário
  function handleYears(birth) {

    const birthUser = new Date(birth)
    const data = new Date()

    let birthYear = birthUser.getFullYear();
    let birthMonth = birthUser.getMonth();
    let birthDay = birthUser.getDate();

    let year = data.getFullYear();
    let month = data.getMonth();
    let day = data.getDate();

    let years = year - birthYear

    if (month < birthMonth || (month === birthMonth && day < birthDay)) {
      years--;
    }

    return years.toString().substring(0, 2)
  }
  return (
    <header className='header'>
      <section className='section-header'>
        {data === "profile" &&
          <Link to={"/home"} className='btn-header'>
            <FaHome />
          </Link>
        }
        {data === "frames" &&
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
        <Search
          value={fetchPeople}
          setValue={setFetchPeople}
          handleOfFocus={handleOfFocus}
          setSearchWidth={setSearchWidth}
        />
      }
      {/* Fim modal search users */}
    </header>
  )
})