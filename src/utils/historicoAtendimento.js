export const ESTADOS_HISTORICO = [
  "EMITIDA",
  "AGUARDANDO",
  "CHAMADA",
  "CHAMADA_NOVAMENTE",
  "EM_ATENDIMENTO",
  "ATENDIDA",
  "NAO_COMPARECEU",
];

export function normalizarHistorico(valor = "") {
  return String(valor)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function formatarDataHistorico(data) {
  if (!data) return "-";
  const valor = new Date(data);
  if (Number.isNaN(valor.getTime())) return "-";
  return valor.toLocaleDateString("pt-BR");
}

export function formatarHoraHistorico(data) {
  if (!data) return "-";
  const valor = new Date(data);
  if (Number.isNaN(valor.getTime())) return "-";
  return valor.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function estadoLabelHistorico(estado) {
  const labels = {
    EMITIDA: "EMITIDA",
    AGUARDANDO: "AGUARDANDO",
    CHAMADA: "CHAMADA",
    CHAMADA_NOVAMENTE: "CHAMADA NOVAMENTE",
    EM_ATENDIMENTO: "EM ATENDIMENTO",
    ATENDIDA: "ATENDIDA",
    NAO_COMPARECEU: "NÃO COMPARECEU",
  };

  return labels[estado] || estado || "-";
}
