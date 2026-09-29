import { NavLink } from "react-router-dom";

const itens = [
  ["/", "⌂", "Início"],
  ["/emissao", "#", "Emissão"],
  ["/guiche", "▣", "Guichê"],
  ["/historico", "☷", "Histórico"],
  ["/painel", "▤", "Painel"],
];

export default function HistoricoSidebar() {
  return (
    <aside className="vh-sidebar">
      <div className="vh-brand">
        <strong>VitaLab</strong>
        <span>Sistema de Atendimento</span>
      </div>

      <nav aria-label="Menu principal">
        {itens.map(([rota, icone, label]) => (
          <NavLink
            key={rota}
            to={rota}
            end={rota === "/"}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span className="vh-nav-icon" aria-hidden="true">{icone}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <footer>
        <span>VitaLab</span>
        <small>Histórico de atendimentos</small>
      </footer>
    </aside>
  );
}
