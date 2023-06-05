import './index.css';
import Home from './pages/Home';
import HeaderApp from './components/headerApp';

function App() {
  return (
    <div className='app'>
      <HeaderApp />
      <Home />
    </div>
  );
}

export default App;
