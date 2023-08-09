import { useRef, useState } from "react";
import './home.css';
import Friends from "../../components/Friends";
import NewPicture from "../../components/NewPicture";
import RenderPictures from "../../components/RenderPictures";


import { BiAddToQueue, BiSearchAlt } from 'react-icons/bi';
import { Header } from "../../components/Header";
import { TbReload } from 'react-icons/tb';

function Home() {

    const inputRef = useRef();
    const [searchWidth, setSearchWidth] = useState(null);
    const [searchPictures, setSearchPictures] = useState('');

    const [modalNewPicture, setModalNewPicture] = useState(false)

    function handleInpuclose() {
        setSearchWidth(null)
        setSearchPictures('');
    }

    return (
        <section className='container'>
            <Header data="home" />
            <section className="main-home">
                <aside className="area-amigos">
                    <Friends />
                </aside>
                <section className="quadros">
                    <header className="header-home">
                        <button>
                            <TbReload size={25} color="#FFF" />
                        </button>
                        <button
                            onClick={() => setModalNewPicture(true)}
                        >
                            <BiAddToQueue color="#FFF" size={25} />
                        </button>
                        <section
                            className="search"
                            style={{
                                border: searchWidth === 200 ? "1px solid #F16A29" : null,
                                gap: searchWidth === 200 ? "1em" : null,
                                borderRadius: "50px"
                            }}
                        >
                            <BiSearchAlt
                                color="#FFF"
                                size={25}
                                className="svg-search"
                                style={{
                                    borderRadius: searchWidth === 200 ? '50%' : null,
                                    background: searchWidth === 200 ? '#F16A29' : null,
                                }}
                                onClick={() => inputRef.current.focus()}
                            />
                            <input
                                type="text"
                                placeholder="Digite o quadro desejado."
                                ref={inputRef}
                                value={searchPictures}
                                onChange={(e) => setSearchPictures(e.target.value)}
                                onFocus={() => setSearchWidth(200)}
                                onBlur={handleInpuclose}
                                style={{ width: searchWidth }}
                            />
                        </section>

                    </header>
                    <RenderPictures setModalNewPicture={setModalNewPicture} />

                    {modalNewPicture &&
                        <NewPicture setModalNewPicture={setModalNewPicture} />
                    }

                </section>
            </section>
        </section>
    )
}

export default Home;