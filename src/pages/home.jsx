import Botao from "../components/botao";
import '../styles/home.css';
import {Link} from 'react-router-dom';


export default function Home(){
    return(
        <div className="container">
        <div>
            <p>Bem-vindo a Clinica Uninassau!</p>
            
        </div>
    
        <div>
            <h id="h">
            <Link to="/emissao">
            <Botao className="botao" texto="Iniciar"></Botao> 
            </Link>
        </h>
        </div>
        </div>
    )
}