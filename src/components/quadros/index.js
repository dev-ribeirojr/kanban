import './quadros.css';
import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa'

import Cards from '../cards';
import ModalData from '../modalData';

function Quadros() {

    const localStorageKey = '@lista';
    const [listas, setListas] = useState([]);
    const [inputText, setInputText] = useState('');
    const [abrirModalData, setAbrirModalData] = useState('none');
    const [cardClicado, setCardClicado] = useState(null);
    const [modeloModal, setModeloModal] = useState('');

    useEffect(() => {
        function loadingList() {
            const list = JSON.parse(localStorage.getItem(localStorageKey)) || [
                {
                    id: 1,
                    titulo: 'A FAZER',
                    atividades: []
                },
                {
                    id: 2,
                    titulo: 'FAZENDO',
                    atividades: []
                },
                {
                    id: 3,
                    titulo: 'EM ANÁLISE',
                    atividades: []
                },
                {
                    id: 4,
                    titulo: 'CONCLUÍDO',
                    atividades: []
                }
            ]
            setListas(list);
        }
        loadingList();
    }, [])

    function excluirPrazo(card) {
        card.prazoConclusao = null

        setListas([...listas]);
        localStorage.setItem(localStorageKey, JSON.stringify(listas));
    }
    function deletarCard(card, quadroAtual) {
        const index = listas[quadroAtual].atividades.findIndex((item) => item.id === card.id);
        listas[quadroAtual].atividades.splice(index, 1);

        setListas([...listas]);
        localStorage.setItem(localStorageKey, JSON.stringify(listas));
    }
    function mudarCardQuadro(card, quadroAtual, quadroFuturo) {
        if (quadroFuturo === 3 || quadroFuturo == 2) {
            card.dataConclusao = dataAtual();
        }
        listas[quadroFuturo].atividades.push(card);
        const index = listas[quadroAtual].atividades.findIndex((item) => item.id === card.id);

        listas[quadroAtual].atividades.splice(index, 1);

        setListas([...listas]);
        localStorage.setItem(localStorageKey, JSON.stringify(listas));
    }
    function horaAtual() {
        const data = new Date();
        return (
            `${data.getHours() > 9 ?
                `${data.getHours()}` :
                `0${data.getHours()}`
            }:${data.getMinutes() > 9 ?
                `${data.getMinutes()}` :
                `0${data.getMinutes()}`}`
        )
    }
    function dataAtual() {
        const data = new Date();
        return (
            `${data.getFullYear()}-${data.getMonth() + 1 > 9 ?
                `${data.getMouth() + 1}` :
                `0${data.getMonth() + 1}`
            }-${data.getDate() > 9 ?
                `${data.getDate()}` :
                `0${data.getDate()}`}`
        )
    }
    function converterData(props) {
        if (props != null) {
            const data = new Date(props)
            return (
                data.toLocaleDateString('pr-br', {
                    timeZone: 'UTC'
                })
            );
        }
    }
    function criarCards(e) {
        e.preventDefault();
        if (!inputText) {
            alert('Informe um titulo para o card.');
            return;
        }

        const existe = listas.map((item) => item.atividades.findIndex((item) => item.atividade === inputText));

        for (const index of existe) {
            if (index > -1) {
                alert('Esse titulo já esta sendo utilizado');
                setInputText('')
                return;
            }
        }
        const id = `${Math.random()}-${Date.now()}`

        listas[0].atividades.push({
            id: id,
            atividade: inputText,
            dataCriacao: dataAtual(),
            horaCriacao: horaAtual(),
            prazoConclusao: null,
            prazoDias: 0,
            dataConclusao: null
        });

        setListas([...listas]);
        localStorage.setItem(localStorageKey, JSON.stringify(listas));
        setInputText('');
    }
    function mostrarModalData(card, modelo) {
        setAbrirModalData('block');
        setCardClicado(card);
        setModeloModal(modelo);
    }
    function fecharModalData() {
        setAbrirModalData('none');
    }
    function atualizarLista() {
        localStorage.setItem(localStorageKey, JSON.stringify(listas));
    }
    return (
        <div className='container-quadros'>
            {listas.map((item) => (
                <section key={item.id} className='quadros'>
                    <header>
                        <h1>{item.titulo}</h1>
                    </header>
                    {item.titulo === 'A FAZER' &&
                        <form className='form-criar'>
                            <input
                                type='text'
                                placeholder='Digite uma atividade'
                                value={inputText}
                                onChange={(text) => setInputText(text.target.value)}
                            />
                            <button
                                onClick={(e) => criarCards(e)}
                            >
                                <FaPlus />
                            </button>
                        </form>
                    }
                    <Cards
                        dados={item.atividades}
                        titulo={item.titulo}
                        funData={dataAtual}
                        funConverterData={converterData}
                        funMudarCard={mudarCardQuadro}
                        funDeletarCard={deletarCard}
                        funExcluirPrazo={excluirPrazo}
                        funMostrarModal={mostrarModalData}
                    />
                </section>
            ))}
            <ModalData
                listas={listas}
                atualizarLista={atualizarLista}
                card={cardClicado}
                abrir={abrirModalData}
                fechar={fecharModalData}
                funDataAtual={dataAtual}
                modeloModal={modeloModal}
            />
        </div>
    )
}

export default Quadros;