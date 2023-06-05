import './cards.css';
import { useState } from 'react';

function Cards({ dados }) {
    const [atividades, setAtividades] = useState(dados)

    return (
        <section>
            {atividades.map((card) => (
                <h1>{card.atividade}</h1>
            ))}
        </section>
    )
}

export default Cards;