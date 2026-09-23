import React, { useState, useEffect } from 'react';
import '../styles/painel.css';

export default function Painel() {
  const [senhaAtual, setSenhaAtual] = useState(null);
  const [ultimasSenhas, setUltimasSenhas] = useState([]);
  const [animando, setAnimando] = useState(false);

  const tocarBip = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine'
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime); // Tom E5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      console.warn("Áudio não reproduzido devido a restrições do navegador:", e);
    }
  };

  const lerSenhasDoLocalStorage = () => {
    try {
      const registos = localStorage.getItem('senhas');
      if (!registos) return;

      const todas = JSON.parse(registos);

      const chamadas = todas
        .filter((s) => ['CHAMADA', 'CHAMADA_NOVAMENTE', 'EM_ATENDIMENTO', 'ATENDIDA'].includes(s.status))
        .sort((a, b) => new Date(b.horaChamada || 0) - new Date(a.horaChamada || 0));

      if (chamadas.length > 0) {
        const maisRecente = chamadas[0];

        setSenhaAtual((anterior) => {
          if (!anterior || anterior.codigo !== maisRecente.codigo || anterior.status !== maisRecente.status) {
            tocarBip();
            setAnimando(true);
            setTimeout(() => setAnimando(false), 2200);
          }
          return maisRecente;
        });

        setUltimasSenhas(chamadas.slice(1, 6));
      }
    } catch (erro) {
      console.error("Falha ao ler dados de atendimento:", erro);
    }
  };

  useEffect(() => {
    lerSenhasDoLocalStorage();

    const escutarStorage = (e) => {
      if (e.key === 'senhas') {
        lerSenhasDoLocalStorage();
      }
    };
    window.addEventListener('storage', escutarStorage);

    const intervalo = setInterval(lerSenhasDoLocalStorage, 1500);

    return () => {
      window.removeEventListener('storage', escutarStorage);
      clearInterval(intervalo);
    };
  }, []);

  return (
    <div className="painel-tv-wrapper">
      <section className={`painel-principal ${animando ? 'painel-alerta-ativo' : ''}`}>
        <div className="painel-cabecalho">
          <h1>SISTEMA DE ATENDIMENTO</h1>
          <span className="painel-subtitulo">Aguarde ser chamado pelo painel</span>
        </div>

        {senhaAtual ? (
          <div className="destaque-card">
            <span className="tipo-atendimento-pill">
              {senhaAtual.tipo || senhaAtual.tipoSigla || 'GERAL'}
            </span>
            
            <div className="senha-grande">{senhaAtual.codigo}</div>

            <div className="box-guiche">
              <span className="rotulo-guiche">GUICHÊ</span>
              <span className="valor-guiche">{senhaAtual.guiche || '01'}</span>
            </div>

            {senhaAtual.status === 'CHAMADA_NOVAMENTE' && (
              <div className="aviso-segunda-chamada">2ª CHAMADA</div>
            )}
          </div>
        ) : (
          <div className="painel-sem-chamadas">
            <p>Nenhuma senha chamada até ao momento</p>
            <small>As chamadas efetuadas nos guichés serão exibidas aqui.</small>
          </div>
        )}
      </section>

      <aside className="painel-historico-coluna">
        <h2>ÚLTIMAS CHAMADAS</h2>
        <ul className="lista-ultimas">
          {ultimasSenhas.length > 0 ? (
            ultimasSenhas.map((item, idx) => (
              <li key={item.codigo || idx} className="item-historico-tv">
                <div className="dados-senha-historico">
                  <span className="codigo-historico">{item.codigo}</span>
                  <span className="tipo-historico">{item.tipo || item.tipoSigla || 'Geral'}</span>
                </div>
                <div className="guiche-historico">
                  Guichê <strong>{item.guiche || '01'}</strong>
                </div>
              </li>
            ))
          ) : (
            <li className="sem-historico">Sem registos anteriores</li>
          )}
        </ul>
      </aside>
    </div>
  );
}