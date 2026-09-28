import { NavLink } from "react-router-dom";

const itens = [
  ["⌂", "Início", "/"],
  ["#", "Emitir senha", "/emissao"],
  ["▣", "Guichê", "/guiche"],
  ["▤", "Histórico", "/historico"],
  ["▥", "Painel", "/painel"]
];

export default function SidebarHistorico() {
  return (
    <aside className="historico-sidebar">
      <div className="historico-brand">
        <strong></strong>
        <span>Sistema de Atendimento</span>
      </div>

      <nav aria-label="Menu principal">
        {itens.map(([icone, label, rota]) => (
          <NavLink
            key={rota}
            to={rota}
            end={rota === "/"}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span className="historico-nav-icon" aria-hidden="true">{icone}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

    </aside>
  );
}
