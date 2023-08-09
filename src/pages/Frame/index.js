import { useState, useEffect, useContext } from "react";
import './frame.css';

import Header from "../../components/Header";
import HeaderFrame from "../../components/HeaderFrame";

import { AuthContext } from "../../contexts/auth";
import { BiAddToQueue } from 'react-icons/bi';
import { db } from "../../services/firebaseConection";
import { FaComments } from "react-icons/fa";
import { format } from "date-fns";
import { onSnapshot, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function Frame() {

  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [frame, setFrame] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loadingFrame, setLoadingFrame] = useState(true);
  const [isAdm, setIsAdm] = useState(false);
  const [taskInput, setTaskInput] = useState("");


  useEffect(() => {
    async function handleFrames() {

      const frameRef = doc(db, "pictures", id);

      const unSub = onSnapshot(frameRef, (docSnapshot) => {

        let list = {
          id: docSnapshot.id,
          adms: docSnapshot.data().adms,
          created: docSnapshot.data().created,
          members: docSnapshot.data().members,
          pictures: docSnapshot.data().pictures,
          title: docSnapshot.data().title,
        }
        setFrame(list);
        setLoadingFrame(false);
        setTasks(list.pictures)
      })
    }
    handleFrames()

    return () => { }
  }, [])

  useEffect(() => {
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
  }, [loadingFrame])


  async function handleAddTask(e) {
    e.preventDefault();
    if (taskInput !== "") {

      let newTask = {
        id: uuidv4(),
        title: taskInput,
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
      handleUpdate(picturesList, error, sucess)
    } else {
      toast.error("Digite uma tarefa!")
    }
  }

  async function handleTask(task, previousFrame, nextFrame) {
    const picturesList = tasks;
    const index = picturesList[previousFrame].tasks.findIndex((doc) => doc.id === task.id);
    if (index === -1) {
      toast.error("Não é possivel iniciar essa tarefa");
      return;
    }
    picturesList[previousFrame].tasks.splice(index, 1);

    let taskSelected = {
      id: task.id,
      title: task.title,
      creator: task.creator,
      createdDayFormat: task.createdDayFormat,
      createdHoursFormat: task.createdHoursFormat,
      created: task.created,
      comment: task.comment,
    }
    if (previousFrame === 0) {

      taskSelected.initializeDayFormat = format(new Date(), "dd/MM/yyyy");
      taskSelected.initializeHoursFormat = format(new Date(), "HH:mm");
      taskSelected.initializeUser = { uid: user.uid, name: user.name };

    } else {
      taskSelected.initializeDayFormat = task.initializeDayFormat;
      taskSelected.initializeHoursFormat = task.initializeHoursFormat;
      taskSelected.initializeUser = task.initializeUser;
      if (previousFrame === 2) {
        taskSelected.userApproved = { uid: user.uid, name: user.name };
        taskSelected.approvedDayFormat = format(new Date(), "dd/MM/yyyy");
        taskSelected.approvedHoursFormat = format(new Date(), "HH:mm");
      }
    }
    picturesList[nextFrame].tasks.push(taskSelected);

    const listMessageSuccess = [
      "Tarefa iniciada com sucesso",
      "Tarefa concluída com sucesso",
      "Tarefa aprovada com sucesso"
    ]
    const listMessageError = [
      "Não foi possível iniciar essa tarefa",
      "Não foi possível concluír essa tarefa",
      "Não foi possível aprovar essa tarefa"
    ]

    const sucess = listMessageSuccess[previousFrame];
    const error = listMessageError[previousFrame];

    handleUpdate(picturesList, error, sucess);

    console.log(picturesList)
  }

  async function handleUpdate(picturesList, errorMessage, successMessage) {
    const frameRef = doc(db, "pictures", id)

    await updateDoc(frameRef, {
      pictures: picturesList
    })
      .then(() => {
        setTaskInput("");
        setTasks(picturesList);
        toast.success(successMessage)
      })
      .catch((error) => {
        console.log('')
        console.log(error)
        toast.error(errorMessage)
      })
  }

  async function handleDelete(task, titleFrame) {
    let indexFrame = titleFrame === 'Tarefas em andamento' ? 1 : 0;
    const indexTask = tasks[indexFrame].tasks.findIndex((doc) => doc.id === task.id);

    tasks[indexFrame].tasks.splice(indexTask, 1);
    const success = "Tarefa excluída com sucesso";
    const error = "Não foi possível excluir essa tarefa";
    handleUpdate(tasks, error, success)
  }

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
                    onSubmit={handleAddTask}
                    className="form-add-task"
                  >
                    <input
                      type="text"
                      placeholder="Digite uma tarefa"
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value)}
                    />
                    <button
                      className="add-task"
                      type="submit"
                    >
                      <BiAddToQueue color="#FFF" size={25} />
                    </button>
                  </form>
                }
                {/* Card de tarefas */}
                <section className="tasks">
                  {
                    doc.tasks.map((task) => (
                      <section key={task.id} className="card">
                        <p className="created">
                          <span>{task.createdDayFormat}</span>
                          <span>{task.createdHoursFormat}</span>
                        </p>
                        <p>{task.title}</p>
                        <p className="created">
                          Criado por: {task.creator}
                        </p>
                        {doc.title !== "Tarefas pendente" &&
                          <p className="info-user">
                            {task.initializeUser.name} iniciou  ás {task.initializeHoursFormat} em {task.initializeDayFormat}.
                          </p>
                        }
                        {doc.title === "Tarefas aprovada" &&
                          <p className="info-user">Aprovada por: {task.userApproved.name}</p>
                        }
                        <section className="footer">
                          <section className="area-btn">
                            {doc.title === "Tarefas pendente" &&
                              <button
                                className="play"
                                onClick={() => handleTask(task, 0, 1)}
                              >Iniciar</button>
                            }
                            {doc.title === "Tarefas em andamento" &&
                              task.initializeUser.uid === user.uid &&
                              <button
                                className="play"
                                onClick={() => handleTask(task, 1, 2)}
                              >
                                Concluir
                              </button>
                            }
                            {doc.title === "Tarefas em análise" && isAdm &&
                              <>
                                <button
                                  className="play"
                                  onClick={() => handleTask(task, 2, 3)}
                                >
                                  Aprovar
                                </button>
                                <button
                                  className="delete"
                                  onClick={() => handleTask(task, 2, 0)}
                                >
                                  Reprovar
                                </button>
                              </>
                            }
                            {isAdm && doc.title !== "Tarefas em análise" && doc.title !== "Tarefas aprovada" &&
                              <>
                                <button className="edit">Editar</button>
                                <button
                                  className="delete"
                                  onClick={() => handleDelete(task, doc.title)}
                                >
                                  Excluir
                                </button>
                              </>
                            }
                          </section>
                          <button className="comment">
                            <FaComments size={20} />
                          </button>
                        </section>
                      </section>
                    ))
                  }
                </section>
              </section>
            )
          }
        </section>
      </section>
    </>
  )
}