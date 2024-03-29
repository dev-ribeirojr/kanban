import { Routes, Route } from 'react-router-dom';

import LoginRegister from '../pages/LoginRegister';

import Private from './Private';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Frame from '../pages/Frame';
import NotFound from '../pages/NotFound';

export default function RoutesApp() {
  return (
    <Routes>
      <Route path='/' element={<LoginRegister />} />

      <Route path='/home' element={<Private> <Home /> </Private>} />
      <Route path='/profile' element={<Private> <Profile /> </Private>} />
      <Route path='/frame/:id' element={<Private> <Frame /> </Private>} />

      <Route path='*' element={<Private><NotFound /></Private>} />
    </Routes>
  )
}