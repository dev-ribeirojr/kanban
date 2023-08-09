import { useState, useContext } from "react";
import "./newPicture.css";

import { collection, addDoc } from 'firebase/firestore';
import { format } from "date-fns";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

//context
import { AuthContext } from "../../../../contexts/auth";
//firebase
import { db } from "../../../../services/firebaseConection";

//modal para criar novo quadro
export default function NewPicture({ setModalNewPicture }) {

  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const [title, setTitle] = useState("");

  function handleClose(e) {
    e.preventDefault()
    setModalNewPicture(false);
    setTitle("");
  }

  function handleClick(e) {
    const container = document.querySelector(".modal-new-picture");

    if (e.target === container) {
      setModalNewPicture(false);
      setTitle("");
    }
  }

  async function handleNewFrame(e) {
    e.preventDefault();
    if (title !== "") {

      await addDoc(collection(db, "pictures"), {
        title: title,
        adms: [user.uid],
        members: [user.uid],
        created: new Date(),
        createdDayFormat: format(new Date(), "dd/MM/yyyy"),
        createdHoursFormat: format(new Date(), "HH:mm"),
        createdUser: user.name,
        pictures: [
          {
            id: 1,
            title: "Tarefas pendente",
            tasks: [],
          },
          {
            id: 2,
            title: "Tarefas em andamento",
            tasks: [],
          },
          {
            id: 3,
            title: "Tarefas em análise",
            tasks: [],
          },
          {
            id: 4,
            title: "Tarefas aprovada",
            tasks: [],
          }
        ]
      })
        .then((doc) => {

          setTitle("");
          toast.success("Quadro criado com sucesso!");
          setModalNewPicture(false);

          navigate(`/frame/${doc.id}`);
        })
        .catch((error) => {
          console.log(error)
          toast.error('Não foi possível criar um novo quadro!')

        })

    } else {
      toast.error("Titulo está vazio")
    }
  }

  return (
    <section className="modal-new-picture" onClick={e => handleClick(e)}>
      <section className="content-new-picture-color">
        <section className="content-new-picture">
          <h1>Novo Quadro </h1>
          <form onSubmit={(e) => handleNewFrame(e)} >
            <label>
              Titulo:
              <input
                type="text"
                placeholder="Dê um nome ao seu quadro"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <section>
              <button type="button" onClick={(e) => handleClose(e)}>Cancelar</button>
              <button type="submit">Criar</button>
            </section>
          </form>
        </section>
      </section>
    </section>
  )
}