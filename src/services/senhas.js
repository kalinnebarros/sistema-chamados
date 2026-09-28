const STORAGE_KEY = "senhas";

// IDs que vieram apenas como massa de demonstração no projeto original.
// Eles são removidos automaticamente para que o sistema trabalhe somente
// com senhas realmente emitidas pelo usuário.
const IDS_DEMONSTRACAO = new Set([
  "260917-SP005",
  "260917-SP001",
  "260917-SE001",
  "260917-SG001",
  "260917-SP002",
  "260917-SE002",
  "260917-SG002",
  "260917-SP003",
  "260917-SE003",
  "260917-SG003",
  "260917-SG004",
]);

function salvarSenhas(lista) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));

  // O evento "storage" não dispara na mesma aba que fez a alteração.
  // Este evento interno permite que o Histórico seja atualizado imediatamente.
  window.dispatchEvent(new CustomEvent("senhas-atualizadas"));
}

function removerDadosDemonstracao(lista) {
  return lista.filter((senha) => !IDS_DEMONSTRACAO.has(senha?.id));
}

export function CarregarSenha() {
  try {
    const senhasSalvas = localStorage.getItem(STORAGE_KEY);

    if (senhasSalvas === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }

    const dados = JSON.parse(senhasSalvas);
    if (!Array.isArray(dados)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }

    const dadosReais = removerDadosDemonstracao(dados);

    if (dadosReais.length !== dados.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosReais));
    }

    return dadosReais;
  } catch (erro) {
    console.error("Erro ao carregar senhas:", erro);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    return [];
  }
}

export default function gerarSenha(tipo) {
  const listaSenhas = CarregarSenha();
  const senhasDoTipo = listaSenhas.filter((senha) => senha.tipo === tipo);

  const numeros = senhasDoTipo
    .map((senha) => {
      const numero = String(senha.numero || "");
      const parteNumerica = numero.startsWith(tipo)
        ? numero.slice(tipo.length)
        : numero.replace(/\D/g, "");
      return Number(parteNumerica);
    })
    .filter((numero) => Number.isFinite(numero));

  const maiorNumero = numeros.length > 0 ? Math.max(...numeros) : 0;
  const senhaAdicionada = maiorNumero + 1;
  const numeroString = String(senhaAdicionada).padStart(3, "0");
  const senhaCompleta = tipo + numeroString;

  const hoje = new Date();
  const anoMenor = String(hoje.getFullYear()).slice(2);
  const mesCerto = String(hoje.getMonth() + 1).padStart(2, "0");
  const diaCerto = String(hoje.getDate()).padStart(2, "0");
  const dataCompleta = anoMenor + mesCerto + diaCerto;

  const novaSenha = {
    id: `${dataCompleta}-${senhaCompleta}`,
    numero: senhaCompleta,
    tipo,
    estado: "AGUARDANDO",
    guiche: null,
    dataCriacao: hoje.toISOString(),
    dataChamada: null,
    dataFinalizacao: null,
    tentativasChamada: 0,
  };

  listaSenhas.push(novaSenha);
  salvarSenhas(listaSenhas);

  return novaSenha;
}
