import "./membersList.css";
import { doc, updateDoc } from 'firebase/firestore';
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

//imgs
import avatar from "../../../../assets/avatar.png";

//icons
import { BiLoaderCircle } from 'react-icons/bi';

//firebase conection
import { db } from "../../../../services/firebaseConection";

export default function MembersList({ isAdm, handleAdmMember, listMembers, loadingMembers, frame }) {

  const { id } = useParams();

  /** *@author Pablo criando função para remover membro */

  async function handleDeleteMember(uidSelected) {
    const indexUser = frame.members.findIndex((uid) => uid === uidSelected);
    if (indexUser !== -1) {
      let list = frame.members
      list.splice(indexUser, 1);

      const membersRef = doc(db, "pictures", id);
      await updateDoc(membersRef, {
        members: list
      })
        .then(() => {
          toast.success("Membro removido com sucesso.");
        })
        .catch((error) => {
          toast.error("Erro ao remover membro.");
          console.log(error)
        })
    }
  }

  async function handleUpAdm(uid) {
    const adms = frame.adms
    adms.push(uid)

    const docRef = doc(db, "pictures", id)

    await updateDoc(docRef, {
      adms: adms
    })
      .then(() => {
        toast.success("Membro promovido!!")
      })
      .catch((error) => {
        console.log(error)
        toast.error("Erro ao promover membro")
      })
  }

  return (
    <ul className='list-membros'>
      {loadingMembers &&
        <li style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 4,
          paddingBottom: 4
        }}>
          <BiLoaderCircle className='loading' color='#FFF' size={25} />
        </li>
      }
      {
        listMembers.map((doc) => (
          <li key={doc.uid}>
            <section>
              {doc.profileUrl !== null ?
                (
                  <img src={doc.profileUrl} alt="Foto perfil" width={40} height={40} />
                )
                :
                (
                  <img src={avatar} alt='Foto perfil' width={40} height={40} />
                )
              }
              <p>{doc.name}</p>
              {handleAdmMember(doc.uid) &&
                <p className='adm'>
                  Adm
                </p>
              }
            </section>
            {isAdm && !handleAdmMember(doc.uid) &&
              <section>
                <button className='up' onClick={() => handleUpAdm(doc.uid)}>
                  Promover
                </button>
                <button
                  className='delete'
                  onClick={() => handleDeleteMember(doc.uid)}
                >
                  Excluir
                </button>
              </section>
            }
          </li>
        ))
      }
    </ul>
  )
}
