import { BrowserRouter, Routes, Route } from "react-router-dom";
import Emissao from "./pages/emissao";
import Home from "./pages/home";
import Guiche from "./pages/guiche";
import Historico from "./pages/historico";
import dados from "./data/dados.json";
import { useEffect } from "react";
<<<<<<< HEAD
import Painel from './pages/painel';

=======
>>>>>>> origin/main

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
<<<<<<< HEAD
        <Route path="/painel" element={<Painel />} />
=======
>>>>>>> origin/main
      </Routes>
    </BrowserRouter>
  );
}

export default App;
