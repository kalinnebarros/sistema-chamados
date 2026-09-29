import dadosDemonstracao from "../data/dados.json";

const STORAGE_KEY = "senhas";
const IDS_DEMONSTRACAO = new Set(dadosDemonstracao.map((item) => item.id));

function lerSenhasOriginais() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const lista = JSON.parse(raw);
    return Array.isArray(lista) ? lista : [];
  } catch (erro) {
    console.error("[Histórico] Não foi possível ler as senhas:", erro);
    return [];
  }
}

function adaptarSenha(senha) {
  return {
    id: senha.id,
    senha: senha.numero,
    tipo: senha.tipo,
    estado: senha.estado,
    guiche: senha.guiche,
    data: senha.dataCriacao,
    dataCriacao: senha.dataCriacao,
    dataChamada: senha.dataChamada,
    dataFinalizacao: senha.dataFinalizacao,
    tentativasChamada: senha.tentativasChamada ?? 0,
    paciente: senha.paciente ?? senha.nomePaciente ?? senha.nome ?? "",
  };
}

export function lerAtendimentosHistorico() {
  return lerSenhasOriginais()
    .filter((senha) => !IDS_DEMONSTRACAO.has(senha?.id))
    .map(adaptarSenha);
}

export function observarAtendimentosHistorico(callback) {
  let ultimaLeitura = "";

  const atualizar = () => {
    const dados = lerAtendimentosHistorico();
    const assinatura = JSON.stringify(dados);

    if (assinatura !== ultimaLeitura) {
      ultimaLeitura = assinatura;
      callback(dados);
    }
  };

  const onStorage = (event) => {
    if (event.key === STORAGE_KEY) atualizar();
  };

  const onFocus = () => atualizar();
  const onVisibility = () => {
    if (!document.hidden) atualizar();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener("focus", onFocus);
  document.addEventListener("visibilitychange", onVisibility);

  atualizar();
  const intervalo = window.setInterval(atualizar, 1000);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("focus", onFocus);
    document.removeEventListener("visibilitychange", onVisibility);
    window.clearInterval(intervalo);
  };
}
