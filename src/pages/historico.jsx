import { useState } from 'react';
import ModalDashboard from '../components/ModalDashboard';
import HistoricoIntegrado from '../components/historico/HistoricoIntegrado';
import '../styles/historico.css';

export default function Historico() {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <HistoricoIntegrado onOpenDashboard={() => setModalAberto(true)} />

      {modalAberto && (
        <ModalDashboard onClose={() => setModalAberto(false)} />
      )}
    </>
  );
}
