import './home.css';
import { useState, useEffect } from 'react';

import Quadros from '../../components/quadros';

function Home() {

    const [listas, setListas] = useState([
        {
            id: 1,
            titulo: 'A FAZER',
            atividades: [
                {
                    id: 1,
                    atividade: 'atividade 1',
                    dataCriacao: '2023-06-04',
                    horaCriacao: '21:19'
                },
                {
                    id: 2,
                    atividade: 'atividade 2',
                    dataCriacao: '2023-06-04',
                    horaCriacao: '22:19'
                }, {
                    id: 3,
                    atividade: 'atividade 3',
                    dataCriacao: '2023-06-04',
                    horaCriacao: '23:19'
                },
            ]
        },
        {
            id: 2,
            titulo: 'FAZENDO',
            atividades: [
                {
                    id: 1,
                    atividade: 'atividade 1',
                    dataCriacao: '2023-06-04',
                    horaCriacao: '21:19'
                },
                {
                    id: 2,
                    atividade: 'atividade 2',
                    dataCriacao: '2023-06-04',
                    horaCriacao: '22:19'
                }, {
                    id: 3,
                    atividade: 'atividade 3',
                    dataCriacao: '2023-06-04',
                    horaCriacao: '23:19'
                },
            ]
        },
        {
            id: 3,
            titulo: 'EM ANÁLISE',
            atividades: [
                {
                    id: 1,
                    atividade: 'atividade 1',
                    dataCriacao: '2023-06-04',
                    horaCriacao: '21:19'
                },
                {
                    id: 2,
                    atividade: 'atividade 2',
                    dataCriacao: '2023-06-04',
                    horaCriacao: '22:19'
                }, {
                    id: 3,
                    atividade: 'atividade 3',
                    dataCriacao: '2023-06-04',
                    horaCriacao: '23:19'
                },
            ]
        },
        {
            id: 4,
            titulo: 'CONCLUÍDO',
            atividades: [
                {
                    id: 1,
                    atividade: 'atividade 1',
                    dataCriacao: '2023-06-04',
                    horaCriacao: '21:19'
                },
                {
                    id: 2,
                    atividade: 'atividade 2',
                    dataCriacao: '2023-06-04',
                    horaCriacao: '22:19'
                }, {
                    id: 3,
                    atividade: 'atividade 3',
                    dataCriacao: '2023-06-04',
                    horaCriacao: '23:19'
                },
            ]
        }
    ])

    return (
        <section className='container'>
            <h1 className='titulo'>Kanban de Atividades</h1>
            <Quadros dados={listas} />
        </section>
    )
}

export default Home;