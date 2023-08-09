import { useContext } from "react";
import "./searchUser.css";
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

//imgs
import avatar from '../../../../assets/avatar.png';

//context
import { AuthContext } from "../../../../contexts/auth";

//firebase conection
import { db } from "../../../../services/firebaseConection";

export default function SearchUser({ frame, inputText, setAddMembers, setInputText }) {

  const { listFullUsers, loadingFullUsers } = useContext(AuthContext);
  const { id } = useParams();

  const filterUsers = listFullUsers.filter((user) => {
    const searchUpper = inputText.toUpperCase().trim();
    const users = user.name.toUpperCase();
    return users.includes(searchUpper);
  })

  function handleIsMember(uid) {
    const exist = frame.members.findIndex((member) => member === uid)
    if (exist !== -1) {
      return true
    } else {
      return false
    }
  }
  async function addMember(uid) {
    const frameRef = doc(db, "pictures", id)
    let list = frame.members
    list.push(uid)

    await updateDoc(frameRef, {
      members: list
    })
      .then(() => {
        setAddMembers(false);
        toast.success("Usuário adicionado com sucesso!");
        setInputText("");
      })
      .catch((error) => {
        console.log(error);
        setAddMembers(false);
        toast.error("Não foi possível adicionar esse usuário!")
        setInputText("");
      })
  }

  return (
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
  )
}