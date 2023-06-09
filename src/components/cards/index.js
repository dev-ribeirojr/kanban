import './cards.css';
import { useState } from 'react';
import {
    FaPlay, FaEdit,
    FaTrash, FaBackward,
    FaForward, FaUndoAlt,
    FaCheck, FaCheckDouble,
    FaExclamationCircle
} from 'react-icons/fa';

function Cards({
    dados, titulo,
    funData, funConverterData,
    funMudarCard, funDeletarCard,
    funExcluirPrazo, funMostrarModal
}) {
    const [atividades, setAtividades] = useState(dados);

    function porcentagem(card) {
        if (card.prazoConclusao != null) {
            const dataAtual = Number(funData().replaceAll('-', ""));
            const dataPrazo = Number(card.prazoConclusao.replaceAll("-", ''));

            const dias = dataPrazo - dataAtual;
            const diaAtualCard = card.prazoDias - dias;

            const result = (diaAtualCard * 100) / card.prazoDias;
            return result.toFixed(0);
        }
    }
    function corCard(card) {

        if (card.prazoDias > 0 && card.prazoConclusao != null) {

            const result = porcentagem(card);

            if (result >= 50 && result < 75) {
                return '#F5F471'
            } else if (result >= 75 && result < 100) {
                return '#F5B146'
            } else if (result >= 100) {
                return '#FA3028'
            }
        }
    }
    function corTexto(card) {
        if (porcentagem(card) >= 75) {
            return '#FFF'
        }
    }
    return (
        <section className='area'>
            {atividades.map((card) => (
                <article
                    key={card.id}
                    className='content-card'
                    style={{
                        backgroundColor: titulo === 'CONCLUÍDO' ?
                            null :
                            corCard(card),
                        color: titulo === 'CONCLUÍDO' ?
                            '#121212' : corTexto(card)
                    }}
                >
                    <div className='info-criacao'
                        style={{
                            color: titulo === 'CONCLUÍDO' ?
                                null : corTexto(card)
                        }}
                    >
                        <p>{funConverterData(card.dataCriacao)}</p>
                        <p>{card.horaCriacao}</p>
                    </div>
                    <div className='area-titulo'>
                        <h1>{card.atividade}</h1>

                        {titulo != 'CONCLUÍDO' ? porcentagem(card) >= 50 ?
                            <abbr title={porcentagem(card) > 99 ?
                                'Atividade Vencida' :
                                `${porcentagem(card)}% do prazo se passou!!`
                            }>
                                <FaExclamationCircle />
                            </abbr> : null
                            :
                            null
                        }
                    </div>

                    {titulo === 'A FAZER' &&
                        <div className='area-botao'>
                            <button
                                onClick={() => funMudarCard(card, 0, 1)}
                            >
                                <FaPlay />
                            </button>
                            <button
                                onClick={() => funMostrarModal(card, 'text')}
                            >
                                <FaEdit />
                            </button>
                            <button
                                onClick={() => funDeletarCard(card, 0)}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    }
                    {titulo === 'FAZENDO' &&
                        <div className='area-botao'>
                            <button
                                onClick={() => funMudarCard(card, 1, 0)}
                            >
                                <FaBackward />
                            </button>
                            <button
                                onClick={() => funMudarCard(card, 1, 2)}
                            >
                                <FaForward />
                            </button>
                            <button
                                onClick={() => funDeletarCard(card, 1)}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    }
                    {titulo === 'EM ANÁLISE' &&
                        <div className='area-botao'>
                            <button
                                onClick={() => funMudarCard(card, 2, 3)}
                            >
                                <FaCheck />
                            </button>
                            <button
                                onClick={() => funMudarCard(card, 2, 0)}
                            >
                                <FaUndoAlt />
                            </button>
                            <button
                                onClick={() => funDeletarCard(card, 2)}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    }
                    {titulo === 'CONCLUÍDO' &&
                        <div className='area-botao'
                            style={{
                                justifyContent: card.dataConclusao != null ?
                                    'space-between' :
                                    'flex-end'
                            }}
                        >

                            {card.dataConclusao != null &&
                                <div className='prazo-info'
                                    style={{
                                        color: titulo === 'CONCLUÍDO' ?
                                            null : corTexto(card),
                                        gap: 8
                                    }}
                                >
                                    <p>Aprovado em: </p>
                                    <p>{funConverterData(card.dataConclusao)}</p>
                                </div>
                            }

                            <button
                                onClick={() => funDeletarCard(card, 3)}
                                style={{
                                    color: '#36D93E',
                                }}
                            >
                                <FaCheckDouble />
                            </button>
                        </div>
                    }
                    {titulo === 'A FAZER' || titulo === 'FAZENDO' ?
                        <div className='area-prazo'>
                            {card.prazoConclusao === null &&
                                <button
                                    onClick={() => funMostrarModal(card, 'data')}
                                    className='definir-prazo'
                                >
                                    "Definir prazo de conclusão?"
                                </button>
                            }

                            {card.prazoConclusao != null &&
                                <div className='prazo-info'
                                    style={{
                                        color: corTexto(card)
                                    }}
                                >
                                    <p>Concluir até: {funConverterData(card.prazoConclusao)}</p>
                                    <button
                                        onClick={() => funExcluirPrazo(card)}
                                        className='botao-ecluir-prazo'
                                        style={{
                                            backgroundColor: 'transparent',
                                            color: corTexto(card)
                                        }}
                                    >
                                        Excluir?
                                    </button>
                                </div>
                            }
                        </div>
                        : null
                    }
                    {titulo === 'EM ANÁLISE' ?
                        <div className='area-prazo'>
                            <div className='prazo-info'
                                style={{
                                    color: titulo === 'CONCLUÍDO' ?
                                        null : corTexto(card)
                                }}
                            >
                                <p>Finalizado em:</p>
                                <p>{funConverterData(card.dataConclusao)}</p>
                            </div>
                        </div>
                        : null
                    }
                </article>
            ))}
        </section>
    )
}

export default Cards;