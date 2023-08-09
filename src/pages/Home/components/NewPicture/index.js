import { useState, useContext } from "react";
import "./newPicture.css";

import { collection, addDoc } from 'firebase/firestore';
import { format } from "date-fns";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';

//context
import { AuthContext } from "../../../../contexts/auth";
//firebase
import { db } from "../../../../services/firebaseConection";

//modal para criar novo quadro
export default function NewPicture({ setModalNewPicture }) {

  const { user } = useContext(AuthContext);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  // função observa se o usuário clicou fora do modal
  function handleClick(e) {
    const container = document.querySelector(".modal-new-picture");
    if (e.target === container) {
      setModalNewPicture(false);
    }
  }
  /** 
   * Utilizando react hook form para evitar renderizações desnecessárias
   * *@author Pablo Melhorando a performance 
  */
  async function handleNewFrame(data) {

    if (data.title !== "") {

      await addDoc(collection(db, "pictures"), {
        title: data.title,
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
          navigate(`/frame/${doc.id}`);
          toast.success("Quadro criado com sucesso!");
          setModalNewPicture(false);
        })
        .catch((error) => {
          console.log(error)
          toast.error('Não foi possível criar um novo quadro!');
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
          <form onSubmit={handleSubmit(handleNewFrame)} >
            <label>
              Titulo:
              <input
                type="text"
                placeholder="Dê um nome ao seu quadro"
                {...register("title")}
              />
            </label>
            <section>
              <button
                type="button"
                onClick={() => setModalNewPicture(false)}
              >
                Cancelar
              </button>
              <button type="submit">
                Criar
              </button>
            </section>
          </form>
        </section>
      </section>
    </section>
  )
}