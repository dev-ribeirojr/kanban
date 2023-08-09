import { useContext, useState } from 'react';
import './profile.css';

import { AuthContext } from '../../contexts/auth';
import avatar from '../../assets/avatar.png';

import { Header } from '../../components/Header';
import { FiUpload } from 'react-icons/fi';

import { BiLoaderCircle, BiEdit, BiArrowBack } from 'react-icons/bi';
import { MdLogout } from 'react-icons/md';

import { db, storage } from '../../services/firebaseConection';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function Profile() {

  const { user, setUser, storageUser, handleFormat, logOut } = useContext(AuthContext);

  const [imgUrl, setImgUrl] = useState(user && user.profileUrl)
  const [imgAvatar, setImgAvatar] = useState(null);

  const [userLogado, setUserLogado] = useState({
    name: user.name,
    titleProfile: user.titleProfile,
    birth: user.birth,
    about: user.about,
  })

  const [loading, setLoading] = useState(false);
  const [editProfile, setEditProfile] = useState(false);

  function handleFile(e) {
    if (e.target.files[0]) {
      const img = e.target.files[0];

      if (img.type === 'image/jpeg' || img.type === 'image/png') {
        setImgAvatar(img);
        setImgUrl(URL.createObjectURL(img));
      } else {
        setImgAvatar(null);
        return;
      }
    }
  }

  async function handleUpload() {
    const currentUid = user.uid;

    const uploadRef = ref(storage, `imagens/${currentUid}/${imgAvatar.name}`)
    const uploadTask = uploadBytes(uploadRef, imgAvatar)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (downloadUrl) => {
          let urlFoto = downloadUrl;

          const docRef = doc(db, 'users', user.uid);
          await updateDoc(docRef, {
            name: userLogado.name,
            birth: userLogado.birth,
            about: userLogado.about,
            titleProfile: userLogado.titleProfile,
            profileUrl: urlFoto
          })
            .then(() => {
              let data = {
                ...user,
                name: userLogado.name,
                birth: userLogado.birth,
                about: userLogado.about,
                titleProfile: userLogado.titleProfile,
                profileUrl: urlFoto
              }
              setUser(data);
              storageUser(data);
              toast.success("Perfil atualizado com sucesso!");
              setLoading(false);
              setEditProfile(false);
            })
        })
      })
  }

  async function handleUpdate(e) {
    e.preventDefault();

    if (userLogado.name === user.name && userLogado.birth === user.birth && userLogado.about === user.about && userLogado.titleProfile === user.titleProfile && imgUrl === user.profileUrl) {
      toast.warning("Não há alterações a serem feitas!");
      return;
    }

    setLoading(true);
    if (imgAvatar === null && userLogado.name !== '' && userLogado.birth !== '') {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        name: userLogado.name,
        birth: userLogado.birth,
        about: userLogado.about,
        titleProfile: userLogado.titleProfile
      })
        .then(() => {
          let data = {
            ...user,
            name: userLogado.name,
            birth: userLogado.birth,
            about: userLogado.about,
            titleProfile: userLogado.titleProfile
          }
          setUser(data);
          storageUser(data);
          toast.success("Perfil atualizado com sucesso!")
          setLoading(false);
          setEditProfile(false);
        })
        .catch((error) => {
          console.log(error)
          toast.error("Erro ao atualizar perfil")
          setLoading(false);
        })
    } else if (imgAvatar !== null && userLogado.name !== '' && userLogado.birth !== '') {
      handleUpload();
    } else {
      toast.error("Alguns dados são obrigatorios")
    }
  }
  function handleChange(prop, e) {
    setUserLogado({ ...userLogado, [prop]: e.target.value })
  }

  function handleCancel() {
    setUserLogado({
      name: user.name,
      titleProfile: user.titleProfile,
      birth: user.birth,
      about: user.about
    })
    setEditProfile(false)
  }

  function dataAtual() {
    const data = new Date()

    const dataFormat = `${data.getFullYear()}-${data.getMonth() + 1 < 10 ? `0${data.getMonth() + 1}` : data.getMonth()
      }-${data.getDate() < 10 ? `0${data.getDate()}` : data.getDate()
      }`;
    return dataFormat
  }

  return (
    <>
      <Header data={"profile"} />
      <section className='profile'>
        <section className='area-profile-border'>
          <section className='area-profile' >
            <Link to={"/home"} className='return'>
              <BiArrowBack size={35} color='#FFF' />
            </Link>
            {imgUrl === null ? (
              <img src={avatar} alt='Foto do perfil' />
            )
              :
              (
                <img src={imgUrl} alt='Foto de perfil' />
              )
            }
            <h2>{user.name}</h2>
            <p className='titulo-perfil'>{user.titleProfile ? user.titleProfile : 'Não possui titulo de perfil'}</p>
            <p>Data de Nasc: {handleFormat(user.birth)}</p>
          </section>
          <section className='sobre'>
            <h3>Sobre</h3>
            <p>
              {user.about ? user.about : 'Não possui resumo'}
            </p>
          </section>
          {!editProfile &&
            <section className='btns-profile'>
              <button onClick={() => logOut()}>
                <MdLogout size={25} color="#FFF" /> Sair
              </button>
              <button onClick={() => setEditProfile(true)}>
                <BiEdit size={25} color="#FFF" /> Editar Perfil
              </button>
            </section>
          }
        </section>

        { /*  Edit Perfil */}
        {editProfile &&
          <section className='area-profile-border'>
            <section>
              <form onSubmit={handleUpdate}>
                <label className='label-avatar'>
                  <span>
                    <FiUpload color="#FFF" size={25} />
                  </span>
                  <input type="file" accept="image/*" onChange={handleFile} />
                  {imgUrl === null ? (
                    <img src={avatar} alt='Foto do perfil' width={100} heigth={100} />
                  )
                    :
                    (
                      <img src={imgUrl} alt='Foto de perfil' width={100} heigth={100} />
                    )
                  }
                </label>
                <label>
                  Alterar nome:
                  <input
                    type='text'
                    placeholder='Digite seu nome e sobrenome'
                    required
                    value={userLogado.name}
                    onChange={(e) => handleChange('name', e)}
                  />
                </label>
                <label>
                  Titulo:
                  <input
                    type='text'
                    placeholder='Digite um titulo para seu perfil'
                    value={userLogado.titleProfile}
                    onChange={(e) => handleChange('titleProfile', e)}
                  />
                </label>
                <label>
                  Alterar data de nascimento:
                  <input
                    type='date'
                    value={userLogado.birth}
                    onChange={(e) => handleChange('birth', e)}
                    required
                    max={dataAtual()}
                  />
                </label>
                <label>
                  Editar sobre:
                  <textarea
                    placeholder='Fale um pouco sobre você'
                    value={userLogado.about}
                    onChange={(e) => handleChange('about', e)}
                  />
                </label>

                <div style={{
                  display: 'flex',
                  justifyContent: loading ? 'center' : 'space-between',
                  alignItems: 'center'
                }}>
                  {loading ? (

                    <BiLoaderCircle
                      size={30} className='loading'
                    />
                  )
                    :
                    (
                      <>
                        <button onClick={handleCancel}> Cancelar </button>
                        <button type='submit' > Salvar </button>
                      </>
                    )
                  }
                </div>
              </form>
            </section>
          </section>
        }
      </section>
    </>
  )
}