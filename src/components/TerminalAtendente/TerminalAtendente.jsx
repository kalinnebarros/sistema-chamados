import React, { useState, useEffect } from 'react';
import './TerminalAtendente.css';

const STORAGE_KEY = 'senhas_atendimento';

export default function TerminalAtendente() {
  const [senhas, setSenhas] = useState([]);
  const [senhaAtual, setSenhaAtual] = useState(null);
  const [guiche, setGuiche] = useState(1);

  // Carrega as senhas do localStorage assim que a tela abre
  useEffect(() => {
    const carregarSenhas = () => {
      const dados = localStorage.getItem(STORAGE_KEY);
      if (dados) {
        setSenhas(JSON.parse(dados));
      }
    };
    
    carregarSenhas();
    // Em um cenário ideal, teríamos um event listener para mudanças no localStorage de outras abas
    window.addEventListener('storage', carregarSenhas);
    return () => window.removeEventListener('storage', carregarSenhas);
  }, []);

  // Função para salvar e atualizar o estado
  const salvarEAtualizar = (novasSenhas) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novasSenhas));
    setSenhas(novasSenhas);
  };

  const chamarProxima = () => {
    const novasSenhas = [...senhas];
    const proximaIndex = novasSenhas.findIndex(s => s.status === 'EMITIDA' || s.status === 'AGUARDANDO');

    if (proximaIndex === -1) {
      alert('Não há senhas aguardando na fila.');
      return;
    }

    // Atualiza a senha encontrada
    novasSenhas[proximaIndex] = {
      ...novasSenhas[proximaIndex],
      status: 'CHAMADA',
      guiche: guiche,
      chamadas: (novasSenhas[proximaIndex].chamadas || 0) + 1
    };

    setSenhaAtual(novasSenhas[proximaIndex]);
    salvarEAtualizar(novasSenhas);
  };

  const mudarStatusAtual = (novoStatus) => {
    if (!senhaAtual) return;

    const novasSenhas = senhas.map(s => {
      if (s.codigo === senhaAtual.codigo) {
        return { ...s, status: novoStatus, chamadas: novoStatus === 'CHAMADA_NOVAMENTE' ? (s.chamadas || 1) + 1 : s.chamadas };
      }
      return s;
    });

    salvarEAtualizar(novasSenhas);
    
    // Se atendeu ou não compareceu, limpa a tela do atendente
    if (novoStatus === 'ATENDIDA' || novoStatus === 'NAO_COMPARECEU') {
      setSenhaAtual(null);
    } else {
       // Atualiza a visualização local da senha atual
      setSenhaAtual(novasSenhas.find(s => s.codigo === senhaAtual.codigo));
    }
  };

  const filaEspera = senhas.filter(s => s.status === 'EMITIDA' || s.status === 'AGUARDANDO');

  return (
    <div className="terminal-container">
      <h1>Terminal do Atendente</h1>
      
      <div className="config-section">
        <label>Guichê:</label>
        <input 
          type="number" 
          value={guiche} 
          onChange={(e) => setGuiche(e.target.value)} 
          min="1" 
        />
      </div>

      <div className="painel-atendimento">
        <h2>Atendimento Atual</h2>
        <div className="senha-destaque">
          {senhaAtual ? senhaAtual.codigo : 'Nenhuma Senha'}
        </div>
        <p>Status: <strong>{senhaAtual ? senhaAtual.status : '-'}</strong></p>
        
        <div className="botoes-acao">
          <button onClick={chamarProxima}>Chamar Próxima</button>
          
          <button 
            disabled={!senhaAtual || (senhaAtual.status !== 'CHAMADA' && senhaAtual.status !== 'CHAMADA_NOVAMENTE')}
            onClick={() => mudarStatusAtual('CHAMADA_NOVAMENTE')}
          >
            Chamar Novamente
          </button>
          
          <button 
            disabled={!senhaAtual || (senhaAtual.status !== 'CHAMADA' && senhaAtual.status !== 'CHAMADA_NOVAMENTE')}
            onClick={() => mudarStatusAtual('EM_ATENDIMENTO')}
          >
            Iniciar Atendimento
          </button>
          
          <button 
            disabled={!senhaAtual || senhaAtual.status !== 'EM_ATENDIMENTO'}
            onClick={() => mudarStatusAtual('ATENDIDA')}
            className="btn-sucesso"
          >
            Finalizar (Atendida)
          </button>
          
          <button 
            disabled={!senhaAtual || (senhaAtual.status !== 'CHAMADA' && senhaAtual.status !== 'CHAMADA_NOVAMENTE')}
            onClick={() => mudarStatusAtual('NAO_COMPARECEU')}
            className="btn-perigo"
          >
            Não Compareceu
          </button>
        </div>
      </div>

      <div className="fila-espera">
        <h3>Fila de Espera ({filaEspera.length})</h3>
        <ul>
          {filaEspera.length > 0 ? (
            filaEspera.map((senha, index) => (
              <li key={index}>{senha.codigo} - {senha.tipo}</li>
            ))
          ) : (
            <li>Fila vazia</li>
          )}
        </ul>
      </div>
    </div>
  );
}