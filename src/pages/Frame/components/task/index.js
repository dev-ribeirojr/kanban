import './task.css';

import { format } from "date-fns";
import { toast } from "react-toastify";

//icons
import { FaComments } from "react-icons/fa";

/** 
 * Responsável por renderizar os cards 
 * *@author Pablo Componentizando */

export default function Task({ doc, handleUpdate, tasks, user, isAdm }) {

  //Arrays responsáveis pela menssagem do toastfy
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
      // se a tarefa foi iniciada será acrescentada data, hora e usuário que iniciou 
      taskSelected.initializeDayFormat = format(new Date(), "dd/MM/yyyy");
      taskSelected.initializeHoursFormat = format(new Date(), "HH:mm");
      taskSelected.initializeUser = { uid: user.uid, name: user.name };

    } else {
      // se a tarefa ja foi iniciada ou esta em análise apenas e repassado o valor
      taskSelected.initializeDayFormat = task.initializeDayFormat;
      taskSelected.initializeHoursFormat = task.initializeHoursFormat;
      taskSelected.initializeUser = task.initializeUser;
      if (previousFrame === 2 && nextFrame === 3) {
        // se a tarefa for aprovada 
        taskSelected.userApproved = { uid: user.uid, name: user.name };
        taskSelected.approvedDayFormat = format(new Date(), "dd/MM/yyyy");
        taskSelected.approvedHoursFormat = format(new Date(), "HH:mm");
      } else {
        //se a tarefa for reprovada voltará ao inicio com uma etiqueta de reprovada
        taskSelected.disapproved = true
      }
    }
    picturesList[nextFrame].tasks.push(taskSelected);

    const sucess = listMessageSuccess[previousFrame];
    const error = listMessageError[previousFrame];

    handleUpdate(picturesList, error, sucess);
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
                    {/* <button className="edit">Editar</button> */}
                    <button
                      className="delete"
                      onClick={() => handleDelete(task, doc.title)}
                    >
                      Excluir
                    </button>
                  </>
                }
              </section>
              {/* <button className="comment">
                <FaComments size={20} />
              </button> */}
            </section>
          </section>
        ))
      }
    </section>
  )
}