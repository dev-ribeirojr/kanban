import { useContext } from 'react';
import './profileUSer.css';

import { BiArrowBack } from 'react-icons/bi';
import { AuthContext } from '../../contexts/auth';
import avatar from '../../assets/avatar.png';

export default function ProfileUSer({ userSelected, handleReturn }) {

  const { friends, handleAddUser, handleRemoveUser } = useContext(AuthContext)

  function handleClick(e) {
    const container = document.querySelector('.modalFriend');

    if (e.target === container) {
      handleReturn()
    }
  }

  function handleUser(uid) {
    const friend = friends.findIndex(user => user.uid === uid);
    return friend
  }

  function handleAdd() {
    handleAddUser(userSelected.uid);
    handleReturn();
  }
  function handleRemove() {
    handleRemoveUser(userSelected.uid);
    handleReturn();
  }

  return (
    <section className='modalFriend' onClick={(e) => handleClick(e)}>
      <section className='modal' >
        <button className='return' onClick={handleReturn}>
          <BiArrowBack color='#FFF' size={35} />
        </button>

        {
          userSelected.profileUrl === null ?
            (

              <img src={avatar} alt='Foto de perfil' />
            ) :
            (

              <img src={userSelected.profileUrl} alt='Foto de perfil' />
            )
        }
        <section className='info'>
          <section>
            <h1>{userSelected.name}</h1>
            <p>{
              userSelected.titleProfile !== "" ?
                userSelected.titleProfile : "Não possui titulo de perfil"
            }</p>
            <p className='sobre'><strong>Sobre</strong></p>
            <p>{
              userSelected.about !== '' ?
                userSelected.about : "Não possui sobre"
            }</p>
          </section>
          {
            handleUser(userSelected.uid) !== -1 ?
              (
                <button
                  onClick={handleRemove}>
                  Remover
                </button>
              )
              :
              (
                <button
                  onClick={handleAdd}>
                  Adicionar
                </button>
              )
          }
        </section>
      </section>
    </section>
  )
}