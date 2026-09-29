import HistoricoStatusBadge from "./HistoricoStatusBadge";
import {
  formatarDataHistorico,
  formatarHoraHistorico,
} from "../../utils/historicoAtendimento";

function Linha({ label, value }) {
  return (
    <div className="vh-detail-row">
      <span>{label}</span>
      <strong>{value ?? "-"}</strong>
    </div>
  );
}

export default function HistoricoDetalhesModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="vh-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="vh-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Detalhes do atendimento"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <small>DETALHES DO ATENDIMENTO</small>
            <h2>{item.senha || "Sem número de senha"}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar">×</button>
        </header>

        <div className="vh-detail-status">
          <HistoricoStatusBadge estado={item.estado} />
        </div>

        <Linha label="Tipo" value={item.tipo || "-"} />
        <Linha label="Estado" value={item.estado || "-"} />
        <Linha label="Guichê" value={item.guiche || "-"} />
        <Linha label="Data de emissão" value={formatarDataHistorico(item.dataCriacao)} />
        <Linha label="Hora de emissão" value={formatarHoraHistorico(item.dataCriacao)} />
        <Linha label="Última chamada" value={formatarHoraHistorico(item.dataChamada)} />
        <Linha label="Finalização" value={formatarHoraHistorico(item.dataFinalizacao)} />
        <Linha label="Tentativas de chamada" value={String(item.tentativasChamada ?? 0)} />

        <button className="vh-modal-close" type="button" onClick={onClose}>
          Fechar
        </button>
      </section>
    </div>
  );
}
