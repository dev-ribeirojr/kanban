import { useState, useEffect, useContext } from "react";
import './frame.css';

import { format } from "date-fns";
import { onSnapshot, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from "uuid";

//context
import { AuthContext } from "../../contexts/auth";

//icons
import { BiAddToQueue } from 'react-icons/bi';

//components
import { Header } from "../../components/Header";
import HeaderFrame from "./components/HeaderFrame";
import Task from "./components/task";

//firebase
import { db } from "../../services/firebaseConection";

export default function Frame() {

  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, reset } = useForm();

  const [frame, setFrame] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loadingFrame, setLoadingFrame] = useState(true);
  const [isAdm, setIsAdm] = useState(false);

  useEffect(() => {
    async function handleFrames() {

      const frameRef = doc(db, "pictures", id);

      const umSub = onSnapshot(frameRef, (docSnapshot) => {

        let list = {
          id: docSnapshot.id,
          adms: docSnapshot.data().adms,
          created: docSnapshot.data().created,
          members: docSnapshot.data().members,
          pictures: docSnapshot.data().pictures,
          title: docSnapshot.data().title,
        }
        setTasks(docSnapshot.data().pictures);

        setFrame(list);
        setLoadingFrame(false);
      })
    }
    handleFrames()

    return () => { }
  }, [])

  useEffect(() => {
    //verificando se o usuário logado é um dos adms
    function handleAdm() {
      if (user !== null && frame && !loadingFrame) {
        const adm = frame.adms.findIndex((uid) => uid === user.uid)
        if (adm !== -1) {
          setIsAdm(true);
        } else {
          setIsAdm(false);
        }
      }
    }
    handleAdm()
    return () => { }
  }, [loadingFrame]);

  /** 
   * Melhorando a performance do página evitando renderizações desnecessárias
   *@author Pablo utilizando react-hook-form*/

  async function handleAddTask(data) {
    if (data.task !== "") {

      let newTask = {
        id: uuidv4(),
        title: data.task,
        creator: user.name,
        createdDayFormat: format(new Date(), "dd/MM/yyyy"),
        createdHoursFormat: format(new Date(), "HH:mm"),
        created: new Date(),
        comment: [],
      }

      let picturesList = tasks;
      picturesList[0].tasks.push(newTask);
      const sucess = "Tarefa criada com sucesso";
      const error = "Não foi possivel criar uma tarefa"
      handleUpdate(picturesList, error, sucess);
    } else {
      toast.error("Digite uma tarefa!");
    }
  }

  async function handleUpdate(picturesList, errorMessage, successMessage) {
    const frameRef = doc(db, "pictures", id)

    await updateDoc(frameRef, {
      pictures: picturesList
    })
      .then(() => {
        reset();
        setTasks(picturesList);
        toast.success(successMessage)
      })
      .catch((error) => {
        console.log('')
        console.log(error)
        toast.error(errorMessage)
      })
  }

  console.log(tasks)

  return (
    <>
      <Header data="frames" />
      <HeaderFrame frame={frame} loading={loadingFrame} isAdm={isAdm} />
      <section className="container-frames">
        <section className="frames">
          {!loadingFrame &&
            tasks.map((doc) =>
              <section
                className="pictures"
                key={doc.id}
              >
                <header>{doc.title}</header>
                {doc.title === "Tarefas pendente" && isAdm &&
                  <form
                    onSubmit={handleSubmit(handleAddTask)}
                    className="form-add-task"
                  >
                    <input
                      type="text"
                      placeholder="Digite uma tarefa"
                      {...register("task")}
                    />
                    <button
                      className="add-task"
                      type="submit"
                    >
                      <BiAddToQueue color="#FFF" size={25} />
                    </button>
                  </form>
                }
                {/** Componentizando os cards de tarefas *@author Pablo Cards task */}
                <Task
                  doc={doc}
                  handleUpdate={handleUpdate}
                  tasks={tasks}
                  user={user}
                  isAdm={isAdm}
                />
              </section>
            )
          }
        </section>
      </section>
    </>
  )
}