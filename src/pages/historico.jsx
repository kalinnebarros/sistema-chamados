import { useState } from 'react';
import  ModalDashboard  from '../components/ModalDashboard';
import '../styles/historico.css'; 

export default function Historico() {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <div className="historico-container">
      <h1 className="historico-titulo">Histórico e Relatórios</h1>
      <p className="historico-descricao">Tabela de senhas.</p>
      
      <button 
        className="btn-abrir-dashboard"
        onClick={() => setModalAberto(true)}
      >
        Visualizar Dashboard
      </button>

      {modalAberto && (
        <ModalDashboard onClose={() => setModalAberto(false)} />
      )}
    </div>
  );
}