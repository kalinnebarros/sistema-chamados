import { estadoLabelHistorico } from "../../utils/historicoAtendimento";

export default function HistoricoStatusBadge({ estado }) {
  return (
    <span className={`vh-status vh-status-${estado || "SEM_ESTADO"}`}>
      {estadoLabelHistorico(estado)}
    </span>
  );
}
