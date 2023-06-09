import './headerApp.css';
import { FaGithubSquare, FaLinkedin } from 'react-icons/fa';

function HeaderApp() {
    return (
        <header className='header'>
            <div className='logo'>
                <img
                    src={require('../../assets/img/logo.png')}
                    alt='logo'
                />
            </div>
            <div className='icons'>
                <a
                    href='https://github.com/dev-ribeirojr'
                    target='_blanck'
                    className='git'
                >
                    <FaGithubSquare />
                </a>
                <a
                    href='https://www.linkedin.com/in/pablo-alves-629bba245/'
                    target='_blanck'
                    className='link'
                >
                    <FaLinkedin />
                </a>
            </div>
        </header>
    )
}

export default HeaderApp;