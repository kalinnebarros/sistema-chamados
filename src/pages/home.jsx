import Botao from "../components/botao";
import "../styles/home.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container">
      <div>
        <p>Bem-vindo a Clinica Uninassau!</p>
      </div>

      <div>
        <h1 id="h">
          <Link to="/emissao">
            <Botao className="botao" texto="Cliente"></Botao>
          </Link>
          <Link to="/guiche">
            <Botao className="botao" texto="Atendente"></Botao>
          </Link>
        </h1>
      </div>
    </div>
  );
}
