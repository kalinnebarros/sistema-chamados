import Botao from '../components/botao';
import '../styles/emissao.css';
import {useState} from 'react';
import gerarSenha from '../services/senhas';
import { CarregarSenha } from '../services/senhas';





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


    
    const [Senha ,setSenha] = useState('');
    function EmitirSenha(){
        let tipo = '';
        if (atendimento ==='Atendimento Geral'){
            tipo= 'SG';
            
        }
        else if (atendimento === 'Atendimento Prioritário'){
            tipo= 'SP';         
        }
        else if (atendimento === 'Atendimento Especial'){
            tipo= 'SE';
            
            
        }
        else if (atendimento === ''){
            alert('Selecione o tipo de atendimento antes de emitir a senha');
            return;
        }
        const senha = gerarSenha(tipo);
        console.log(senha.numero)

        
        setSenha(senha.numero);
      
    }

    function Reiniciar(){
        setAtendimento(''),
        setSenha('');


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
            <Botao className="botao" texto="Emitir Senha" onClick={EmitirSenha} ></Botao>
            <h2 className="senha">{Senha && `Senha Emitida: ${Senha}`}</h2>
            <Botao className="botao" texto= "Reiniciar" onClick= {Reiniciar} ></Botao>
            
        </div>
        </div>
    )   
    
}
