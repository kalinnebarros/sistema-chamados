import { useEffect, useMemo, useState } from "react";
import DetalhesModal from "../components/DetalhesModal";
import ModalDashboard from "../components/ModalDashboard";
import SidebarHistorico from "../components/SidebarHistorico";
import StatusBadge from "../components/StatusBadge";
import { lerAtendimentos, observarAtendimentos } from "../services/atendimentosStorage";
import { ESTADOS, formatarData, normalizar, pegarDataISO, pegarHora, pegarId, pegarPaciente, pegarSenha } from "../utils/atendimento";
import "../styles/historico.css";
const POR_PAGINA = 10;
export default function Historico() {
  const [dados,setDados]=useState(()=>lerAtendimentos()); const [busca,setBusca]=useState(""); const [tipo,setTipo]=useState(""); const [estado,setEstado]=useState(""); const [guiche,setGuiche]=useState(""); const [dataInicial,setDataInicial]=useState(""); const [dataFinal,setDataFinal]=useState(""); const [pagina,setPagina]=useState(1); const [detalhe,setDetalhe]=useState(null); const [modalAberto,setModalAberto]=useState(false);
  useEffect(()=>observarAtendimentos(setDados),[]);
  const tipos=useMemo(()=>[...new Set(dados.map(i=>i.tipo).filter(Boolean))].sort(),[dados]);
  const guiches=useMemo(()=>[...new Set(dados.map(i=>i.guiche).filter(Boolean))].sort(),[dados]);
  const filtrados=useMemo(()=>{ const termo=normalizar(busca.trim()); return dados.filter(item=>{ const textoBusca=normalizar(`${pegarSenha(item)} ${pegarPaciente(item)} ${item.tipo||""} ${item.guiche||""}`); const dataItem=pegarDataISO(item); const estadoItem=item.estado??item.status??""; return (!termo||textoBusca.includes(termo))&&(!tipo||item.tipo===tipo)&&(!estado||estadoItem===estado)&&(!guiche||item.guiche===guiche)&&(!dataInicial||(dataItem&&dataItem>=dataInicial))&&(!dataFinal||(dataItem&&dataItem<=dataFinal)); }); },[dados,busca,tipo,estado,guiche,dataInicial,dataFinal]);
  useEffect(()=>setPagina(1),[busca,tipo,estado,guiche,dataInicial,dataFinal]);
  const totalPaginas=Math.max(1,Math.ceil(filtrados.length/POR_PAGINA)); const paginaSegura=Math.min(pagina,totalPaginas); const linhas=filtrados.slice((paginaSegura-1)*POR_PAGINA,paginaSegura*POR_PAGINA); const inicio=filtrados.length?(paginaSegura-1)*POR_PAGINA+1:0; const fim=Math.min(paginaSegura*POR_PAGINA,filtrados.length);
  const limpar=()=>{setBusca("");setTipo("");setEstado("");setGuiche("");setDataInicial("");setDataFinal("");};
  return <div className="historico-integrado"><div className="historico-layout"><SidebarHistorico/><main className="historico-main"><header className="historico-topbar"><div><strong></strong><span>Histórico de atendimentos</span></div></header><div className="historico-content">
    <div className="historico-page-heading"><div><h1>Histórico de atendimentos</h1><p>Consulte e filtre as senhas registradas pelo sistema.</p></div><button className="historico-dashboard-button" type="button" onClick={()=>setModalAberto(true)}><span aria-hidden="true">▥</span>Visualizar Dashboard</button></div>
    <section className="historico-filters-card">
      <div className="historico-field historico-period"><label>Período</label><div><input type="date" value={dataInicial} onChange={e=>setDataInicial(e.target.value)} aria-label="Data inicial"/><span>até</span><input type="date" value={dataFinal} onChange={e=>setDataFinal(e.target.value)} aria-label="Data final"/></div></div>
      <div className="historico-field"><label>Tipo</label><select value={tipo} onChange={e=>setTipo(e.target.value)}><option value="">Todos</option>{tipos.map(v=><option key={v} value={v}>{v}</option>)}</select></div>
      <div className="historico-field"><label>Estado</label><select value={estado} onChange={e=>setEstado(e.target.value)}><option value="">Todos</option>{ESTADOS.map(v=><option key={v} value={v}>{v.replaceAll("_"," ")}</option>)}</select></div>
      <div className="historico-field"><label>Guichê</label><select value={guiche} onChange={e=>setGuiche(e.target.value)}><option value="">Todos</option>{guiches.map(v=><option key={v} value={v}>{v}</option>)}</select></div>
      <div className="historico-field historico-search-field"><label>Busca</label><div className="historico-search-box"><span aria-hidden="true">⌕</span><input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Senha, tipo ou guichê"/></div></div>
      <button className="historico-clear-button" type="button" onClick={limpar}><span aria-hidden="true">↻</span>Limpar filtros</button>
    </section>
    <section className="historico-table-card"><header className="historico-table-title"><strong>Atendimentos</strong><span>{filtrados.length} registro(s)</span></header>
      {dados.length===0?<div className="historico-empty"><h2>Nenhum atendimento disponível</h2><p>As senhas emitidas pelo sistema aparecerão aqui automaticamente.</p></div>:filtrados.length===0?<div className="historico-empty"><h2>Nenhum resultado encontrado</h2><p>Altere os filtros para consultar outros atendimentos.</p></div>:<div className="historico-table-scroll"><table><thead><tr><th>Senha</th><th>Tipo</th><th>Estado</th><th>Guichê</th><th>Data</th><th>Emissão</th><th>Ações</th></tr></thead><tbody>{linhas.map((item,index)=><tr key={pegarId(item,index)}><td><strong>{pegarSenha(item)||"-"}</strong></td><td>{item.tipo||"-"}</td><td><StatusBadge estado={item.estado??item.status}/></td><td>{item.guiche||"-"}</td><td>{formatarData(item.dataCriacao??item.data)}</td><td>{pegarHora(item)}</td><td><button className="historico-link-button" type="button" onClick={()=>setDetalhe(item)}>Ver</button></td></tr>)}</tbody></table></div>}
      <footer className="historico-pagination"><span>Mostrando {inicio} a {fim} de {filtrados.length} registros</span><div><button type="button" disabled={paginaSegura===1} onClick={()=>setPagina(p=>Math.max(1,p-1))}>Anterior</button><strong>{paginaSegura}</strong><button type="button" disabled={paginaSegura>=totalPaginas} onClick={()=>setPagina(p=>Math.min(totalPaginas,p+1))}>Próximo</button></div></footer>
    </section>
  </div></main></div><DetalhesModal item={detalhe} onClose={()=>setDetalhe(null)}/>{modalAberto&&<ModalDashboard onClose={()=>setModalAberto(false)}/>}</div>;
}
