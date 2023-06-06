import './cards.css';
import { useState } from 'react';
import { FaPlay, FaEdit, FaTrash, FaBackward, FaForward, FaUndoAlt, FaCheck, FaCheckDouble, FaExclamationCircle } from 'react-icons/fa';

function Cards({ dados, titulo }) {
    const [atividades, setAtividades] = useState(dados);

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
    function validarPrazo(props) {
        if (props != null) {
            const data = props.replaceAll('-', '');

            if (Number(data) > Number(dataAtual())) {
                return (
                    true
                )
            }
            return (
                false
            )
        }

    }
    function dataAtual() {
        const data = new Date();
        return (
            `${data.getFullYear()}${data.getMonth() + 1 > 9 ?
                `${data.getMouth() + 1}` :
                `0${data.getMonth() + 1}`
            }${data.getDate() > 9 ?
                `${data.getDate()}` :
                `0${data.getDate()}`}`
        )
    }

    function porcentagem(card) {

        if (card.prazoDias > 0 && card.prazoConclusao != null) {

            const dataPrazo = card.prazoDias;
            const prazoatual = Number(dataAtual()) - Number(card.dataCriacao.replaceAll('-', ''))
            console.log(prazoatual)
            const result = (prazoatual * 100) / dataPrazo

            console.log(result)
            return result.toFixed()
        }

    }

    return (
        <section className='area'>
            {atividades.map((card) => (
                <article
                    key={card.id}
                    className='content-card'
                    style={{
                        backgroundColor: porcentagem(card) > 60 ?
                            porcentagem(card) > 75 ?
                                'orange' : "yellow" :
                            null

                    }}
                >
                    <div className='info-criacao'>
                        <p>{converterData(card.dataCriacao)}</p>
                        <p>{card.horaCriacao}</p>
                    </div>
                    <div className='area-titulo'>
                        <h1>{card.atividade}</h1>

                        {validarPrazo(card.prazoConclusao) &&
                            <abbr title='Atividade Vencida!'>
                                <FaExclamationCircle />
                            </abbr>
                        }
                    </div>
                    {porcentagem(card)}

                    {titulo === 'A FAZER' &&
                        <div className='area-botao'>
                            <button>
                                <FaPlay />
                            </button>
                            <button>
                                <FaEdit />
                            </button>
                            <button>
                                <FaTrash />
                            </button>
                        </div>
                    }
                    {titulo === 'FAZENDO' &&
                        <div className='area-botao'>
                            <button>
                                <FaBackward />
                            </button>
                            <button>
                                <FaForward />
                            </button>
                            <button>
                                <FaTrash />
                            </button>
                        </div>
                    }
                    {titulo === 'EM ANÁLISE' &&
                        <div className='area-botao'>
                            <button>
                                <FaCheck />
                            </button>
                            <button>
                                <FaUndoAlt />
                            </button>
                            <button>
                                <FaTrash />
                            </button>
                        </div>
                    }
                    {titulo === 'CONCLUÍDO' &&
                        <div className='area-botao'>
                            <button>
                                <FaCheckDouble />
                            </button>
                            <button>
                                <FaTrash />
                            </button>
                        </div>
                    }
                    {titulo === 'A FAZER' || titulo === 'FAZENDO' ?
                        <div className='area-prazo'>
                            <button className='definir-prazo'>
                                {card.prazoConclusao === null &&
                                    "Definir prazo de conclusão?"
                                }
                            </button>
                            {card.prazoConclusao != null &&
                                <div className='prazo-info'>
                                    <p>Concluir até: {converterData(card.prazoConclusao)}</p>
                                    <button>
                                        Excluir?
                                    </button>
                                </div>
                            }
                        </div>
                        : null
                    }
                    {titulo === 'EM ANÁLISE' || titulo === 'CONCLUÍDO' ?
                        <div className='area-prazo'>
                            {card.prazoConclusao != null &&
                                <div className='prazo-info'>
                                    <p>Prazo:</p>
                                    <p>{converterData(card.prazoConclusao)}</p>
                                </div>
                            }
                        </div>
                        : null
                    }
                </article>
            ))}
        </section>
    )
}

export default Cards;