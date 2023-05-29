import { Routes, Route} from 'react-router-dom'

import Home from '../pages/Home';
import Register from '../pages/Register';
import Admin from '../pages/Admin'
import Game from '../pages/Game'
import Private from './Private'

function RoutesApp(){
  return(
    <Routes>
      <Route path='/' element={ <Home/> } />
      <Route path='/register' element={ <Register/> } />
      <Route path='/game' element={ <Game/> } />
      <Route path='/admin' element={ <Private> <Admin/> </Private> } />
    </Routes>
  )
}

export default RoutesApp;