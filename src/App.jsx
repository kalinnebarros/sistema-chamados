import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Emissao from './pages/emissao';
import Home from './pages/home';
import Guiche from './pages/guiche';



function App() {
  useEffect(() => {
    const key = "senhas";

    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(dados));
      console.log("localStorage criado");
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/emissao" element={<Emissao />} />
        <Route path="/guiche" element={<Guiche />} />
        <Route path="/historico" element={<Historico />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
