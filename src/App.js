import { BrowserRouter } from 'react-router-dom';
import RoutesApp from './routes/routes';
import './sass/index.css';

import AOS from 'aos';
import 'aos/dist/aos.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthProvider from './contexts/auth';

function App() {
  AOS.init();
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer
          autoClose={2000}
          theme='dark'
        />
        <RoutesApp />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
