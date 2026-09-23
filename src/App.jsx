import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Emissao from './pages/emissao';
import Home from './pages/home';
import Guiche from './pages/guiche';



function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/emissao' element={<Emissao/>}/>
      <Route path='/guiche' element={<Guiche/>}/>
    </Routes>
      
    </BrowserRouter>
  )
}

export default App