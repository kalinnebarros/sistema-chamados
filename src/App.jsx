import { BrowserRouter, Routes, Route } from "react-router-dom";
import Emissao from "./pages/emissao";
import Home from "./pages/home";
import Guiche from "./pages/guiche";
import Historico from "./pages/historico";
import dados from "./data/dados.json";
import MenuNavegacao from "./components/MenuNavegacao";
import Painel from './pages/painel';
import { useEffect } from "react";

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
      <MenuNavegacao />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/emissao" element={<Emissao />} />
        <Route path="/guiche" element={<Guiche />} />
        <Route path="/historico" element={<Historico />} />
        <Route path="/painel" element={<Painel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
