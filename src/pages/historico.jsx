import { useState } from 'react';
import ModalDashboard from '../components/ModalDashboard';
import '../styles/historico.css';

function carregarAtendimentos() {
  try {
    const dadosSalvos = JSON.parse(localStorage.getItem('senhas') || '[]');

    if (!Array.isArray(dadosSalvos)) {
      return [];
    }

    return dadosSalvos;
  } catch {
    return [];
  }
}

function formatarData(data) {
  if (!data) return '-';
  return new Date(data).toLocaleDateString('pt-BR');
}

function formatarHora(data) {
  if (!data) return '-';
  return new Date(data).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatarEstado(estado) {
  if (!estado) return '-';

  if (estado === 'NAO_COMPARECEU') {
    return 'NÃO COMPARECEU';
  }

  return estado.replaceAll('_', ' ');
}

export default function Historico() {
  const [modalAberto, setModalAberto] = useState(false);
  const [atendimentos] = useState(carregarAtendimentos);

  const [busca, setBusca] = useState('');
  const [tipo, setTipo] = useState('');
  const [estado, setEstado] = useState('');
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');

  const atendimentosFiltrados = atendimentos.filter((item) => {
    const textoBusca = `${item.numero || ''} ${item.guiche || ''}`.toLowerCase();
    const dataAtendimento = item.dataCriacao
      ? item.dataCriacao.slice(0, 10)
      : '';
    const dataFinalizacao = item.dataFinalizacao
      ? item.dataCriacao.slice(0, 10)
      : '';
    const buscaOk = !busca || textoBusca.includes(busca.toLowerCase());
    const tipoOk = !tipo || item.tipo === tipo;
    const estadoOk = !estado || item.estado === estado;
    const dataInicialOk = !dataInicial || dataAtendimento === dataInicial;
    const dataFinalOk = !dataFinal || dataFinalizacao === dataFinal;

    return buscaOk && tipoOk && estadoOk && dataInicialOk && dataFinalOk;
  });

  function limparFiltros() {
    setBusca('');
    setTipo('');
    setEstado('');
    setDataInicial('');
    setDataFinal('');
  }

  return (
    <div className="historico-container">
      <div className="historico-cabecalho">
        <div>
          <h1 className="historico-titulo">Histórico de Atendimentos</h1>
          <p className="historico-descricao">
            Consulte as senhas registradas no sistema.
          </p>
        </div>

        <button
          className="btn-abrir-dashboard"
          type="button"
          onClick={() => setModalAberto(true)}
        >
          Visualizar Dashboard
        </button>
      </div>

      <div className="historico-filtros">
        <input
          type="text"
          placeholder="Buscar por senha ou guichê"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="">Todos os tipos</option>
          <option value="SG">Geral (SG)</option>
          <option value="SP">Preferencial (SP)</option>
          <option value="SE">Exame (SE)</option>
        </select>

        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="">Todos os estados</option>
          <option value="EMITIDA">Emitida</option>
          <option value="AGUARDANDO">Aguardando</option>
          <option value="CHAMADA">Chamada</option>
          <option value="CHAMADA_NOVAMENTE">Chamada novamente</option>
          <option value="EM_ATENDIMENTO">Em atendimento</option>
          <option value="ATENDIDA">Atendida</option>
          <option value="NAO_COMPARECEU">Não compareceu</option>
        </select>

        <input
          type="date"
          value={dataInicial}
          onChange={(e) => setDataInicial(e.target.value)}
          title="Data inicial"
        />

        <input
          type="date"
          value={dataFinal}
          onChange={(e) => setDataFinal(e.target.value)}
          title="Data final"
        />

        <button
          className="btn-limpar-filtros"
          type="button"
          onClick={limparFiltros}
        >
          Limpar filtros
        </button>
      </div>

      <div className="historico-tabela-container">
        <div className="historico-contagem">
          {atendimentosFiltrados.length} atendimento(s) encontrado(s)
        </div>

        {atendimentosFiltrados.length === 0 ? (
          <p className="historico-vazio">Nenhum atendimento encontrado.</p>
        ) : (
          <div className="historico-tabela-scroll">
            <table className="historico-tabela">
              <thead>
                <tr>
                  <th>Senha</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Guichê</th>
                  <th>Data</th>
                  <th>Emissão</th>
                  <th>Chamada</th>
                  <th>Finalização</th>
                </tr>
              </thead>

              <tbody>
                {atendimentosFiltrados.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.numero || '-'}</strong></td>
                    <td>{item.tipo || '-'}</td>
                    <td>{formatarEstado(item.estado)}</td>
                    <td>{item.guiche || '-'}</td>
                    <td>{formatarData(item.dataCriacao)}</td>
                    <td>{formatarHora(item.dataCriacao)}</td>
                    <td>{formatarHora(item.dataChamada)}</td>
                    <td>{formatarHora(item.dataFinalizacao)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalAberto && (
        <ModalDashboard onClose={() => setModalAberto(false)} />
      )}
    </div>
  );
}
