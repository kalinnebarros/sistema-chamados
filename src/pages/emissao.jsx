import Botao from '../components/botao';
import '../styles/emissao.css';
import {useState} from 'react';



export default function Emissao(){

    const [atendimento, setAtendimento] = useState('');
    function AtendimentoGeral(){
        setAtendimento('Atendimento Geral');
        
    }
    function AtendimentoPrioritario(){
        setAtendimento('Atendimento Prioritário');
        
    }   
    function AtendimentoEspecial(){
        setAtendimento('Atendimento Especial');
        
    }


    const [senhaGeral, setSenhaGeral] = useState(1);
    const [senhaPrioritaria, setSenhaPrioritaria] = useState(1);
    const [senhaEspecial, setSenhaEspecial] = useState(1);
    

    function EmitirSenha(){
        if (atendimento ==='Atendimento Geral'){
            setSenhaGeral(senhaGeral +1);
            alert(`Senha Emitida Com Sucesso: SG${String(senhaGeral).padStart(3, "0")}`);
            
        }
        else if (atendimento === 'Atendimento Prioritário'){
            setSenhaPrioritaria(senhaPrioritaria +1)
            alert(`Senha Emitida Com Sucesso: SP${String(senhaPrioritaria).padStart(3, "0") }`);
            
        }
        else if (atendimento === 'Atendimento Especial'){
            setSenhaEspecial(senhaEspecial +1);
            alert(`Senha Emitida Com Sucesso: SE${String(senhaEspecial).padStart(3, "0")}`);
            
        }
        else if (atendimento === ''){
            alert('Selecione o tipo de atendimento antes de emitir a senha');
        }
    
           
    }
    
    

    return(
        
        <div className="container">
        <div>
            <h1>Escolha o tipo de atendimento: </h1>
            <Botao className={atendimento === 'Atendimento Geral' ? "botaoSelecionado" : "botao"} texto="Atendimento Geral" onClick={AtendimentoGeral}></Botao>
            <Botao className={atendimento === 'Atendimento Prioritário' ? "botaoSelecionado" : "botao"} texto="Atendimento Prioritário" onClick={AtendimentoPrioritario}></Botao>
            <Botao className={atendimento === 'Atendimento Especial' ? "botaoSelecionado" : "botao"} texto="Atendimento Especial" onClick={AtendimentoEspecial}></Botao>
        </div>
        <div>
            <h2>Emitir Senha</h2>
            <Botao className="botao" texto="Emitir Senha" onClick={EmitirSenha}></Botao>
            
        </div>
        </div>
    ) 
    
}
