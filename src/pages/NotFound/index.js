import { useEffect, useState } from "react";
import "./notFound.css";
import { useNavigate } from "react-router-dom";

export default function NotFound() {

  const navigate = useNavigate();

  const [segundos, setSegundos] = useState(5)

  useEffect(() => {
    function redirect() {
      setTimeout(() => {
        navigate("/home")
      }, 5000)
    }
    redirect()
    function contagemRegressiva() {
      let contador = 5;

      const intervalId = setInterval(() => {
        contador--;
        setSegundos(contador)

        if (contador === 0) {
          clearInterval(intervalId);
        }
      }, 1000);
    }
    contagemRegressiva();
  }, [])
  return (
    <section className="not-found">
      <h1>404</h1>
      <p>Ops! página não encontrada!!</p>
      <p>Você será redirecionado para a página inicial em {segundos}</p>
    </section>
  )
}