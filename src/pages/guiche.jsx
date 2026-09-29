//export default function Guiche() {
    //return (
     //   <div>
         //   <h1>Guichê</h1>
       // </div>
   // );
//}
import { useEffect, useState } from "react";
import "../styles/guiche.css";
import dadosIniciais from "../data/dados.json";

const STORAGE_KEY = "senhas";

function carregarSenhas() {
  try {
    const salvas = localStorage.getItem(STORAGE_KEY);

    if (salvas) {
      const dados = JSON.parse(salvas);

      if (Array.isArray(dados)) {
        return dados;
      }
    }
  } catch (erro) {
    console.error("Erro ao carregar senhas:", erro);
  }

  return Array.isArray(dadosIniciais) ? dadosIniciais : [];
}

export default function Guiche() {
  const [senhas, setSenhas] = useState(() => carregarSenhas());
  const [senhaAtual, setSenhaAtual] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(senhas));
  }, [senhas]);

  function salvarSenhas(novasSenhas) {
    setSenhas(novasSenhas);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novasSenhas));
  }

  function chamarProxima() {
    const fila = senhas
      .filter((senha) => senha.estado === "AGUARDANDO")
      .sort((a, b) => {
        const dataA = new Date(a.dataCriacao || 0);
        const dataB = new Date(b.dataCriacao || 0);
        return dataA - dataB;
      });

    if (fila.length === 0) {
      alert("Não há senhas aguardando atendimento.");
      return;
    }

    const proxima = fila[0];

    const atualizada = senhas.map((senha) =>
      senha.id === proxima.id
        ? {
            ...senha,
            estado: "CHAMADA",
            guiche: "Guichê 01",
            dataChamada: new Date().toISOString(),
            tentativasChamada: 1,
          }
        : senha
    );

    setSenhaAtual({
      ...proxima,
      estado: "CHAMADA",
      guiche: "Guichê 01",
      dataChamada: new Date().toISOString(),
      tentativasChamada: 1,
    });

    salvarSenhas(atualizada);
  }

  function chamarNovamente() {
    if (!senhaAtual) return;

    const atualizada = senhas.map((senha) =>
      senha.id === senhaAtual.id
        ? {
            ...senha,
            estado: "CHAMADA_NOVAMENTE",
            dataChamada: new Date().toISOString(),
            tentativasChamada: 2,
          }
        : senha
    );

    setSenhaAtual((atual) => ({
      ...atual,
      estado: "CHAMADA_NOVAMENTE",
      dataChamada: new Date().toISOString(),
      tentativasChamada: 2,
    }));

    salvarSenhas(atualizada);
  }

  function iniciarAtendimento() {
    if (!senhaAtual) return;

    const atualizada = senhas.map((senha) =>
      senha.id === senhaAtual.id
        ? {
            ...senha,
            estado: "EM_ATENDIMENTO",
          }
        : senha
    );

    setSenhaAtual((atual) => ({
      ...atual,
      estado: "EM_ATENDIMENTO",
    }));

    salvarSenhas(atualizada);
  }

  function finalizarAtendimento() {
    if (!senhaAtual) return;

    const agora = new Date().toISOString();

    const atualizada = senhas.map((senha) =>
      senha.id === senhaAtual.id
        ? {
            ...senha,
            estado: "ATENDIDA",
            dataFinalizacao: agora,
          }
        : senha
    );

    setSenhaAtual(null);
    salvarSenhas(atualizada);
  }

  function marcarNaoCompareceu() {
    if (!senhaAtual) return;

    const agora = new Date().toISOString();

    const atualizada = senhas.map((senha) =>
      senha.id === senhaAtual.id
        ? {
            ...senha,
            estado: "NÃO_COMPARECEU",
            dataFinalizacao: agora,
            tentativasChamada: 2,
          }
        : senha
    );

    setSenhaAtual(null);
    salvarSenhas(atualizada);
  }

  const filaEspera = senhas.filter(
    (senha) => senha.estado === "AGUARDANDO"
  );

  return (
    <div className="guiche-container">
      <h1>Terminal do Atendente</h1>

      <section className="senha-atual">
        <h2>Senha atual</h2>

        {senhaAtual ? (
          <>
            <div className="senha-destaque">
              {senhaAtual.numero}
            </div>

            <p>
              <strong>Tipo:</strong> {senhaAtual.tipo}
            </p>

            <p>
              <strong>Estado:</strong> {senhaAtual.estado}
            </p>

            <p>
              <strong>Guichê:</strong> {senhaAtual.guiche || "Guichê 01"}
            </p>

            <div className="botoes-atendimento">
              {(senhaAtual.estado === "CHAMADA" ||
                senhaAtual.estado === "CHAMADA_NOVAMENTE") && (
                <button onClick={iniciarAtendimento}>
                  Iniciar atendimento
                </button>
              )}

              {senhaAtual.estado === "CHAMADA" && (
                <button onClick={chamarNovamente}>
                  Chamar novamente
                </button>
              )}

              {senhaAtual.estado === "CHAMADA_NOVAMENTE" && (
                <button onClick={marcarNaoCompareceu}>
                  Marcar não compareceu
                </button>
              )}

              {senhaAtual.estado === "EM_ATENDIMENTO" && (
                <button onClick={finalizarAtendimento}>
                  Finalizar atendimento
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <p>Nenhuma senha em atendimento.</p>

            <button onClick={chamarProxima}>
              Chamar próxima senha
            </button>
          </>
        )}
      </section>

      <section className="fila">
        <h2>Fila de espera</h2>

        {filaEspera.length === 0 ? (
          <p>Não há senhas aguardando.</p>
        ) : (
          <div className="lista-fila">
            {filaEspera.map((senha) => (
              <div className="item-fila" key={senha.id}>
                <strong>{senha.numero}</strong>

                <span>Tipo: {senha.tipo}</span>

                <span>Estado: {senha.estado}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}