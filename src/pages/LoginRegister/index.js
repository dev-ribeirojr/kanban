import { useContext, useState } from 'react';
import './login.css';

import Img from '../../assets/img.png';
import Logo from '../../assets/logo.png';
import Typing from '../../components/animated';

import { AuthContext } from '../../contexts/auth';
import { BiLoaderCircle } from 'react-icons/bi';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

export default function LoginRegister() {

  const { signUp, signIn, loading } = useContext(AuthContext);
  const { register, handleSubmit, reset } = useForm()

  const [visible, setVisible] = useState({
    register: false,
    password: false,
  });

  //Limpando os campos dos inputs
  function handleClearInput() {
    reset();
  }

  function handleRegister() {
    handleVisible("register", !visible.register);
    handleClearInput();
  }

  async function handleLogin(data) {

    if (visible.register) {
      if (data.name !== '' && data.birth !== '' && data.email !== '' && data.password) {
        if (data.password.length < 6) {
          toast.info("Senha precisa ter 6 digitos ou mais.");
          return;
        }
        await signUp(data.name, data.birth, data.email, data.password);
        return;
      }
      toast.error('Preencha os dados corretamente!');
    } else {
      if (data.email !== '' && data.password) {
        await signIn(data.email, data.password);
        return;
      }
      toast.error('Preencha os dados corretamente!');
    }
  }

  function handleVisible(prop, e) {
    if (prop === "register" && e === false) {
      reset();
    }
    setVisible({ ...visible, [prop]: e })
  }

  return (
    <section className="loginRegister">
      <section className='container-login'>
        <section
          data-aos="zoom-in"
          data-aos-duration="1500"
          className='area-texto'
        >
          <Typing
            text={
              visible.register ?
                "Que bom ter você por aqui, Crie sua conta!"
                :
                "Que bom ter você por aqui, Faça login!"
            }
            el={"h1"}
          />
          <p
            data-aos="fade-right"
            data-aos-duration="1200"
            data-aos-offset="300"
            data-aos-easing="ease-in-sine"
          >
            Gerencie suas tarefas com facilidade,
            seja individualmente ou em equipe.
          </p>
          <section>
            <img
              src={Img}
              data-aos="zoom-in"
              data-aos-duration="1200"
            />
          </section>
        </section>
        <section
          className='area-form'
          data-aos="zoom-in"
          data-aos-duration="1500"
        >
          <section
            className='header-login'
            data-aos="zoom-in"
            data-aos-duration="1500"
            data-aos-delay="200"
          >
            <section>
              <img src={Logo} alt='Logo' />
            </section>
            {visible.register ?
              <h1>Criar Conta</h1>
              :
              <h1 >Fazer Login</h1>
            }
          </section>

          <form
            onSubmit={handleSubmit(handleLogin)}
            data-aos="zoom-in"
            data-aos-duration="1500"
            data-aos-delay="200"
          >
            {visible.register &&
              <>
                <label>Nome</label>
                <input
                  type='text'
                  placeholder='Digite seu nome'
                  {...register("name")}
                />
                <label>Data de Nascimento</label>
                <input
                  type='date'
                  placeholder='Digite seu nome'
                  {...register("birth")}
                />
              </>
            }
            <label>E-mail</label>
            <input
              type='text'
              placeholder='Digite seu email'
              {...register("email")}
            />
            <label>Senha</label>
            <input
              type={visible.password ? "text" : "password"}
              placeholder='******'
              {...register("password")}
            />
            <div onClick={() => handleVisible('password', !visible.password)}>
              {visible.password ?
                <>
                  <MdVisibility color='#FFF' size={20} />
                  <p>ocultar senha?</p>
                </>
                :
                <>
                  <MdVisibilityOff color='#FFF' size={20} />
                  <p>exibir senha?</p>
                </>
              }
            </div>
            {loading ?
              <BiLoaderCircle size={30} className='loading' />
              :
              <button type='submit'>
                {visible.register ? "Cadastrar" : "Entrar"}
              </button>
            }
          </form>
          {visible.register ?
            <p>Já tenho uma conta, <span
              onClick={() => handleVisible("register", !visible.register)}
            >
              fazer login.
            </span>
            </p>
            :
            <p
              data-aos="zoom-in"
              data-aos-duration="1500"
              data-aos-delay="200"
            >
              Sou novo por aqui, <span
                onClick={handleRegister}
              >
                criar uma conta.
              </span>
            </p>
          }
        </section>
      </section>
    </section>
  )
}