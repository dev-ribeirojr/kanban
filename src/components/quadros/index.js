import './quadros.css';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa'

import Cards from '../cards';

function Quadros({ dados }) {
    const [listas, setListas] = useState(dados);
    const [inputText, setInputText] = useState('')

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
                            <button>
                                <FaPlus />
                            </button>
                        </form>
                    }
                    <Cards dados={item.atividades} />
                </section>
            ))}
        </div>
    )
}

export default Quadros;