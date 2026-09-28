export const ESTADOS = ["EMITIDA","AGUARDANDO","CHAMADA","CHAMADA_NOVAMENTE","EM_ATENDIMENTO","ATENDIDA","NAO_COMPARECEU"];
export function normalizar(valor = "") { return String(valor).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }
export function estadoLabel(estado) {
  const labels = { EMITIDA:"EMITIDA", AGUARDANDO:"AGUARDANDO", CHAMADA:"CHAMADA", CHAMADA_NOVAMENTE:"CHAMADA NOVAMENTE", EM_ATENDIMENTO:"EM ATENDIMENTO", ATENDIDA:"ATENDIDA", NAO_COMPARECEU:"NÃO COMPARECEU", "NÃO_COMPARECEU":"NÃO COMPARECEU" };
  return labels[estado] || estado || "-";
}
export function pegarSenha(item) { return item?.senha ?? item?.numero ?? item?.codigo ?? ""; }
export function pegarPaciente(item) { return item?.paciente ?? item?.nomePaciente ?? item?.nome ?? ""; }
export function pegarDataISO(item) { const valor = item?.data ?? item?.dataCriacao ?? item?.dataHora ?? ""; return valor ? String(valor).slice(0,10) : ""; }
export function formatarData(valor) { if (!valor) return "-"; const somenteData=String(valor).slice(0,10); const partes=somenteData.split("-"); return partes.length===3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : String(valor); }
export function formatarHora(valor) {
  if (!valor) return "-";
  const texto=String(valor); const data=new Date(texto);
  if (!Number.isNaN(data.getTime()) && texto.includes("T")) return data.toLocaleTimeString("pt-BR", {hour:"2-digit", minute:"2-digit"});
  if (texto.includes("T")) return texto.slice(11,16) || "-";
  return texto.length>=5 ? texto.slice(0,5) : texto;
}
export function pegarHora(item) { return formatarHora(item?.emissao ?? item?.hora ?? item?.horario ?? item?.dataCriacao ?? item?.dataHora); }
export function pegarId(item,index) { return item?.id ?? pegarSenha(item) ?? `linha-${index}`; }
