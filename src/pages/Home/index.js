import './home.css';
import Quadros from '../../components/quadros';

function Home() {

    return (
        <section className='container'>
            <h1 className='titulo'>Kanban de Atividades</h1>
            <div className='area-gabarito'>
                <strong>
                    Gabarito de Prazo:
                </strong>
                <div className='content-gabarito'>
                <div className='info-gabarito'>
                    <div className='circle'
                        style={{ backgroundColor: '#F5F471' }}
                    ></div>
                    <p>50% do prazo passou,</p>
                </div>
                <div className='info-gabarito'>
                    <div
                        className='circle'
                        style={{ backgroundColor: '#F5B146' }}
                    ></div>
                    <p>75% do prazo passou,</p>
                </div>
                <div className='info-gabarito'>
                    <div
                        className='circle'
                        style={{ backgroundColor: '#FA3028' }}
                    ></div>
                    <p>O prazo está vencido!</p>
                </div>
                </div>
            </div>
            <Quadros />
        </section>
    )
}

export default Home;