import { Routes, Route } from 'react-router-dom';

import LoginRegister from '../pages/LoginRegister';
import Home from '../pages/Home';
import Private from './Private';

export default function RoutesApp() {
  return (
    <Routes>
      <Route path='/' element={<LoginRegister />} />
      <Route path='/home' element={<Private> <Home /> </Private>} />
    </Routes>
  )
}