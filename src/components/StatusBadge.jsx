import { estadoLabel } from "../utils/atendimento";
export default function StatusBadge({ estado }) { return <span className={`historico-status historico-status-${estado || "SEM_ESTADO"}`}>{estadoLabel(estado)}</span>; }
