import './profileFriends.css';

import { BiArrowBack } from 'react-icons/bi'

export default function ProfileFriends({ selectedFriend, handleReturn }) {

  function handleClick(e) {
    const container = document.querySelector('.modalFriend');

    if (e.target === container) {
      handleReturn()
    }
  }

  return (
    <section className='modalFriend' onClick={(e) => handleClick(e)}>
      <section className='modal' >
        <button className='return' onClick={handleReturn}>
          <BiArrowBack color='#FFF' size={35} />
        </button>
        <img src={selectedFriend.profileUrl} />
        <section className='info'>
          <section>
            <h1>{selectedFriend.name}</h1>
            <p>{selectedFriend.titleProfile}</p>
            <p className='sobre'><strong>Sobre</strong></p>
            <p>{selectedFriend.about}</p>
          </section>
          <button>Remover</button>
        </section>
      </section>
    </section>
  )
}