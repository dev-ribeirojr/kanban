import { useContext, useState } from 'react';
import './friends.css';
import { BiUser, BiLoaderCircle, BiArrowBack } from 'react-icons/bi';
import { AuthContext } from '../../contexts/auth';

import ProfileFriends from '../ProfileFriends';

export default function Friends() {

  const { friends, loadingFriends } = useContext(AuthContext);
  const [modal, setModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState([]);

  function handleModalFriend(data) {
    setSelectedFriend(data);
    setModal(true);
  }

  function handleReturn() {
    setModal(false);
    setSelectedFriend([]);
  }

  return (
    <section className="friends">
      <section className="friends-title">
        <h1>AMIGOS</h1>
      </section>
      {loadingFriends ?
        (
          <section
            className='friend'
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <BiLoaderCircle size={30} color='#FFF' className='loading' />
          </section>
        )
        :
        (
          friends.map((data) => (
            <section
              key={data.uid}
              className="friend"
              onClick={() => handleModalFriend(data)}
            >
              <section>
                <img src={data.profileUrl} alt="Foto de perfil" />
                <p>{data.name}</p>
              </section>

              <button>
                <BiUser color="#FFF" size={25} />
              </button>
            </section>
          ))
        )
      }
      {modal &&
        <ProfileFriends
          selectedFriend={selectedFriend}
          handleReturn={handleReturn}
        />
      }

    </section>
  )
}