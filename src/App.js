import AOS from 'aos';
import 'aos/dist/aos.css';

import './index.css';
import Home from './pages/Home';
import HeaderApp from './components/headerApp';

function App() {
  AOS.init();
  return (
    <div className='app'>
      <HeaderApp />
      <Home />
    </div>
  );
}

export default App;
