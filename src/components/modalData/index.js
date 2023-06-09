import './modalData.css';
import { useState } from 'react';

function ModalData({ card, abrir, fechar, funDataAtual, atualizarLista, modeloModal, listas }) {
    const [inputText, setInputText] = useState('');
    const [inputData, setInputData] = useState('');

    function editarAtividade(e) {
        e.preventDefault()
        e.preventDefault();
        if (!inputText) {
            alert('Informe um titulo para o card.');
            return;
        }

        const existe = listas.map((item) => item.atividades.findIndex((item) => item.atividade === inputText));

        for (const index of existe) {
            if (index > -1) {
                alert('Esse titulo já esta sendo utilizado');
                setInputText('');
                return;
            }
        }
        card.atividade = inputText;
        setInputText('');
        atualizarLista();
        fechar();

    }
    function definirPrazo(e) {
        e.preventDefault()
        const data = funDataAtual().replaceAll('-', '');
        const dataInput = inputData.replaceAll('-', '');

        if (!inputData) {
            alert('[ERRO] Imforme uma data de validade');
            setInputData('');
            return;
        }
        if(Number(dataInput) === Number(data)){
            alert('A data de hoje não e válida para vencimento da atividade');
            return;
        }
        if (Number(dataInput) > Number(data)) {
            card.prazoConclusao = inputData;
            card.prazoDias = dataInput - Number(card.dataCriacao.replaceAll('-', ""));

            setInputData('');
            atualizarLista();
            fechar();
            return;
        } else {
            alert('[ERRO] Imforme uma dala válida!');
            setInputData('');
            return;
        }
    }
    function clicouFora(e) {
        const content = document.querySelector('#content');
        if (content === e.target) {
            setInputData('');
            setInputText('');
            fechar();
            return;
        }
    }

    if (card != null) {
        return (
            <section
                style={{ display: abrir }}
                className='container-definir-prazo'
            >
                <div className='form-prazo'
                    onClick={(e) => clicouFora(e)}
                    id='content'
                >
                    <form>
                        <p>
                            {modeloModal === 'data' ?
                                `Informe um prazo de validade para a atividade "${card.atividade}".` :
                                `Atividade a ser editada: "${card.atividade}".`
                            }

                        </p>
                        {modeloModal === 'data' ?
                            <input type='date'
                                value={inputData}
                                onChange={(e) => setInputData(e.target.value)}
                            /> :
                            <input
                                type='text'
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder='Digite uma atividade'
                            />
                        }
                        <div>
                            <button
                                onClick={modeloModal === 'data' ?
                                    definirPrazo :
                                    editarAtividade
                                }
                                style={{
                                    backgroundColor: '#36D93E'
                                }}
                            >
                                {modeloModal === 'data' ?
                                    "Definir Prazo" :
                                    "Editar"
                                }
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setInputText('');
                                    fechar();
                                }}
                                style={{
                                    backgroundColor: '#FA3028'
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        )
    }

}

export default ModalData;