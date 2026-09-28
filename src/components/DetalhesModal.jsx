import StatusBadge from "./StatusBadge";
import { formatarData, formatarHora, pegarPaciente, pegarSenha } from "../utils/atendimento";
function Linha({ label, value }) { return <div className="historico-detail-row"><span>{label}</span><strong>{value || "-"}</strong></div>; }
export default function DetalhesModal({ item, onClose }) {
  if (!item) return null;
  const paciente = pegarPaciente(item);
  return <div className="historico-modal-backdrop" role="presentation" onMouseDown={onClose}>
    <section className="historico-modal" role="dialog" aria-modal="true" aria-label="Detalhes do atendimento" onMouseDown={(e)=>e.stopPropagation()}>
      <header><div><small>DETALHES DO ATENDIMENTO</small><h2>{pegarSenha(item) || "Sem número de senha"}</h2></div><button type="button" onClick={onClose} aria-label="Fechar"><span aria-hidden="true">×</span></button></header>
      <div className="historico-detail-status"><StatusBadge estado={item.estado ?? item.status}/></div>
      {paciente && <Linha label="Paciente" value={paciente}/>}<Linha label="Tipo" value={item.tipo ?? item.tipoSigla}/><Linha label="Guichê" value={item.guiche}/><Linha label="Data de emissão" value={formatarData(item.dataCriacao ?? item.data)}/><Linha label="Hora de emissão" value={formatarHora(item.dataCriacao ?? item.emissao)}/><Linha label="Última chamada" value={formatarHora(item.dataChamada ?? item.horaChamada ?? item.primeiraChamada)}/><Linha label="Finalização" value={formatarHora(item.dataFinalizacao ?? item.fim)}/><Linha label="Tentativas de chamada" value={String(item.tentativasChamada ?? 0)}/>
      <button className="historico-modal-close" type="button" onClick={onClose}>Fechar</button>
    </section>
  </div>;
}
