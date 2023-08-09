import { useContext, useState, memo } from 'react';
import './friends.css';

//contex
import { AuthContext } from '../../../../contexts/auth';

//imgs
import avatar from '../../../../assets/avatar.png';

//icons
import { BiUser, BiLoaderCircle } from 'react-icons/bi';

//component
import ProfileUSer from '../../../../components/ProfileUSer';

export const Friends = memo(() => {

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

  console.log("renderizou Friends")

  return (
    <section className="friends">
      <section className="friends-title">
        <h1>Amigos</h1>
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
          friends.length === 0 ?

            <section className='friend'>
              <section>
                <p>Não possuí amigos</p>
              </section>
            </section>
            :
            friends.map((data) => (
              <section
                key={data.uid}
                className="friend"
                onClick={() => handleModalFriend(data)}
              >
                <section>
                  {data.profileUrl === null ?
                    (
                      <img src={avatar} alt="Foto de perfil" />
                    )
                    :
                    (
                      <img src={data.profileUrl} alt="Foto de perfil" />
                    )

                  }
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
        <ProfileUSer
          userSelected={selectedFriend}
          handleReturn={handleReturn}
        />
      }

    </section>
  )
})