import { useState, useEffect } from "react";
import GraficoRosca from "./GraficoRosca.jsx";
import GraficoBarra from "./GraficoBarra.jsx";
import "../styles/ModalDashboard.css";

export default function ModalDashboard({ onClose }) {
  const [todasSenhas, setTodasSenhas] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("TODOS");

  useEffect(() => {
    const dados = localStorage.getItem("senhas");

    if (dados) {
      setTodasSenhas(JSON.parse(dados));
    }
  }, []);

  const senhasFiltradas =
    filtroTipo === "TODOS"
      ? todasSenhas
      : todasSenhas.filter((senha) => senha.tipo === filtroTipo);

  const total = senhasFiltradas.length;

  const aguardando = senhasFiltradas.filter(
    (s) => s.estado === "AGUARDANDO",
  ).length;

  const emAtendimento = senhasFiltradas.filter(
    (s) =>
      s.estado === "CHAMADA" ||
      s.estado === "CHAMADA_NOVAMENTE" ||
      s.estado === "EM_ATENDIMENTO",
  ).length;

  const naoCompareceu = senhasFiltradas.filter(
    (s) => s.estado === "NAO_COMPARECEU",
  ).length;

  const atendidas = senhasFiltradas.filter(
    (s) => s.estado === "ATENDIDA",
  ).length;

  //calculo de tempo medio
  const senhasChamadas = senhasFiltradas.filter(
    (s) => s.dataCriacao && s.dataChamada,
  );
  const senhasFinalizadas = senhasFiltradas.filter(
    (s) => s.dataChamada && s.dataFinalizacao && s.estado === "ATENDIDA",
  );

  let tempoEsperaMs = 0;
  senhasChamadas.forEach((s) => {
    tempoEsperaMs += new Date(s.dataChamada) - new Date(s.dataCriacao);
  });
  const mediaEsperaMin =
    senhasChamadas.length > 0
      ? Math.round(tempoEsperaMs / senhasChamadas.length / 60000)
      : 0;

  let tempoAtendimentoMs = 0;
  senhasFinalizadas.forEach((s) => {
    tempoAtendimentoMs += new Date(s.dataFinalizacao) - new Date(s.dataChamada);
  });
  const mediaAtendimentoMin =
    senhasFinalizadas.length > 0
      ? Math.round(tempoAtendimentoMs / senhasFinalizadas.length / 60000)
      : 0;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="btn-fechar" onClick={onClose}>
          X Fechar
        </button>

        <div className="dashboard-header">
          <h2>📊Dashboard</h2>
          <div className="filtro-container">
            <label htmlFor="filtro">Filtrar por:</label>
            <select
              id="filtro"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="TODOS">Todos os Tipos</option>
              <option value="SP">Preferencial (SP)</option>
              <option value="SE">Especial (SE)</option>
              <option value="SG">Geral (SG)</option>
            </select>
          </div>
        </div>

        <div className="cards-container">
          <div className="card card-total">
            <h3>Total</h3>
            <p>{total}</p>
          </div>
          <div className="card card-aguardando">
            <h3>Aguardando</h3>
            <p>{aguardando}</p>
          </div>
          <div className="card card-atendimento">
            <h3>Em Atendimento</h3>
            <p>{emAtendimento}</p>
          </div>
          <div className="card card-finalizado">
            <h3>Finalizados</h3>
            <p>{atendidas}</p>
          </div>
          <div className="card card-desistencia">
            <h3>Desistências</h3>
            <p>{naoCompareceu}</p>
          </div>
          <div className="card card-tempo-espera">
            <h3>Espera Média</h3>
            <p>{mediaEsperaMin} min</p>
          </div>
          <div className="card card-tempo-atendimento">
            <h3>Atend. Médio</h3>
            <p>{mediaAtendimentoMin} min</p>
          </div>

          <hr className="dashboard-divider" />

          <div className="graficos-wrapper">
            <GraficoRosca
              aguardando={aguardando}
              emAtendimento={emAtendimento}
              atendidas={atendidas}
              naoCompareceu={naoCompareceu}
            />
            <GraficoBarra
              senhas={senhasFiltradas}
              filtroTipo={filtroTipo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
