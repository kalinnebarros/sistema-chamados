import { useEffect, useMemo, useState } from "react";
import HistoricoSidebar from "./HistoricoSidebar";
import HistoricoStatusBadge from "./HistoricoStatusBadge";
import HistoricoDetalhesModal from "./HistoricoDetalhesModal";
import {
  lerAtendimentosHistorico,
  observarAtendimentosHistorico,
} from "../../services/historicoAdapter";
import {
  ESTADOS_HISTORICO,
  formatarDataHistorico,
  formatarHoraHistorico,
  normalizarHistorico,
} from "../../utils/historicoAtendimento";
import "../../styles/historicoIntegrado.css";

const POR_PAGINA = 10;

export default function HistoricoIntegrado({ onOpenDashboard }) {
  const [dados, setDados] = useState(() => lerAtendimentosHistorico());
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState("");
  const [estado, setEstado] = useState("");
  const [guiche, setGuiche] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [pagina, setPagina] = useState(1);
  const [detalhe, setDetalhe] = useState(null);

  useEffect(() => observarAtendimentosHistorico(setDados), []);

  const tipos = useMemo(
    () => [...new Set(dados.map((item) => item.tipo).filter(Boolean))].sort(),
    [dados],
  );

  const guiches = useMemo(
    () => [...new Set(dados.map((item) => item.guiche).filter(Boolean))].sort(),
    [dados],
  );

  const filtrados = useMemo(() => {
    const termo = normalizarHistorico(busca.trim());

    return dados.filter((item) => {
      const textoBusca = normalizarHistorico(
        `${item.senha || ""} ${item.tipo || ""} ${item.guiche || ""}`,
      );
      const dataItem = String(item.dataCriacao || "").slice(0, 10);

      return (
        (!termo || textoBusca.includes(termo)) &&
        (!tipo || item.tipo === tipo) &&
        (!estado || item.estado === estado) &&
        (!guiche || item.guiche === guiche) &&
        (!dataInicial || (dataItem && dataItem >= dataInicial)) &&
        (!dataFinal || (dataItem && dataItem <= dataFinal))
      );
    });
  }, [dados, busca, tipo, estado, guiche, dataInicial, dataFinal]);

  useEffect(() => {
    setPagina(1);
  }, [busca, tipo, estado, guiche, dataInicial, dataFinal]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const linhas = filtrados.slice(
    (paginaSegura - 1) * POR_PAGINA,
    paginaSegura * POR_PAGINA,
  );

  const inicio = filtrados.length ? (paginaSegura - 1) * POR_PAGINA + 1 : 0;
  const fim = Math.min(paginaSegura * POR_PAGINA, filtrados.length);

  function limpar() {
    setBusca("");
    setTipo("");
    setEstado("");
    setGuiche("");
    setDataInicial("");
    setDataFinal("");
  }

  return (
    <div className="vh-layout">
      <HistoricoSidebar />

      <main className="vh-main">
        <header className="vh-topbar">
          <div>
            <strong>VitaLab</strong>
            <span>Histórico de atendimentos</span>
          </div>
        </header>

        <div className="vh-content">
          <div className="vh-page-heading">
            <div>
              <h1>Histórico de atendimentos</h1>
              <p>Consulte e filtre as senhas registradas pelo sistema.</p>
            </div>
            <button className="btn-abrir-dashboard" type="button" onClick={onOpenDashboard}>
              Visualizar Dashboard
            </button>
          </div>

          <section className="vh-filters-card">
            <div className="vh-field vh-period">
              <label>Período</label>
              <div>
                <input type="date" value={dataInicial} onChange={(e) => setDataInicial(e.target.value)} aria-label="Data inicial" />
                <span>até</span>
                <input type="date" value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} aria-label="Data final" />
              </div>
            </div>

            <div className="vh-field">
              <label>Tipo</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="">Todos</option>
                {tipos.map((valor) => <option key={valor} value={valor}>{valor}</option>)}
              </select>
            </div>

            <div className="vh-field">
              <label>Estado</label>
              <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="">Todos</option>
                {ESTADOS_HISTORICO.map((valor) => <option key={valor} value={valor}>{valor}</option>)}
              </select>
            </div>

            <div className="vh-field">
              <label>Guichê</label>
              <select value={guiche} onChange={(e) => setGuiche(e.target.value)}>
                <option value="">Todos</option>
                {guiches.map((valor) => <option key={valor} value={valor}>{valor}</option>)}
              </select>
            </div>

            <div className="vh-field vh-search-field">
              <label>Busca</label>
              <div className="vh-search-box">
                <span aria-hidden="true">⌕</span>
                <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Senha, tipo ou guichê" />
              </div>
            </div>

            <button className="vh-clear-button" type="button" onClick={limpar}>
              ↻ Limpar filtros
            </button>
          </section>

          <section className="vh-table-card">
            <header className="vh-table-title">
              <strong>Atendimentos</strong>
              <span>{filtrados.length} registro(s)</span>
            </header>

            {dados.length === 0 ? (
              <div className="vh-empty">
                <h2>Nenhum atendimento real registrado</h2>
                <p>Emita uma nova senha pela tela de Emissão. O Histórico lê a mesma chave <code>senhas</code> utilizada pelo projeto, sem alterar ou apagar os dados das outras telas.</p>
              </div>
            ) : filtrados.length === 0 ? (
              <div className="vh-empty">
                <h2>Nenhum resultado encontrado</h2>
                <p>Altere os filtros para consultar outros atendimentos.</p>
              </div>
            ) : (
              <div className="vh-table-scroll">
                <table className="vh-table">
                  <thead>
                    <tr>
                      <th>Senha</th>
                      <th>Tipo</th>
                      <th>Estado</th>
                      <th>Guichê</th>
                      <th>Data</th>
                      <th>Hora</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {linhas.map((item, index) => (
                      <tr key={item.id ?? `${item.senha}-${index}`}>
                        <td><strong>{item.senha || "-"}</strong></td>
                        <td>{item.tipo || "-"}</td>
                        <td><HistoricoStatusBadge estado={item.estado} /></td>
                        <td>{item.guiche || "-"}</td>
                        <td>{formatarDataHistorico(item.dataCriacao)}</td>
                        <td>{formatarHoraHistorico(item.dataCriacao)}</td>
                        <td><button className="vh-link-button" type="button" onClick={() => setDetalhe(item)}>Ver</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <footer className="vh-pagination">
              <span>Mostrando {inicio} a {fim} de {filtrados.length} registros</span>
              <div>
                <button type="button" disabled={paginaSegura === 1} onClick={() => setPagina((p) => Math.max(1, p - 1))}>Anterior</button>
                <strong>{paginaSegura}</strong>
                <button type="button" disabled={paginaSegura >= totalPaginas} onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}>Próximo</button>
              </div>
            </footer>
          </section>
        </div>
      </main>

      <HistoricoDetalhesModal item={detalhe} onClose={() => setDetalhe(null)} />
    </div>
  );
}
