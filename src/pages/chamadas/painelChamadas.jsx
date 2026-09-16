import { useState, useEffect } from 'react';
import './PainelChamadas.css';

export default function PainelChamadas() {
  const [senhaAtual, setSenhaAtual] = useState(null);
  const [historico, setHistorico] = useState([]);

  const atualizarPainel = () => {
    const dadosLocais = localStorage.getItem('filaLaboratorio');
    if (dadosLocais) {
      const dadosConvertidos = JSON.parse(dadosLocais);
      setSenhaAtual(dadosConvertidos.senhaAtual || null);
      const ultimas = dadosConvertidos.historico ? dadosConvertidos.historico.slice(0, 5) : [];
      setHistorico(ultimas);
    }
  };

  useEffect(() => {
    atualizarPainel();
    window.addEventListener('storage', atualizarPainel);
    return () => window.removeEventListener('storage', atualizarPainel);
  }, []);

  return (
    <div className="painel-container">
      <main className="chamada-principal">
        <h1 className="titulo-secao">Senha Atual</h1>
        {senhaAtual ? (
          <div className="destaque-senha">
            <span className="numero">{senhaAtual.numero}</span>
            <span className="guiche">{senhaAtual.guiche}</span>
          </div>
        ) : (
          <div className="mensagem-vazia"><p>Aguardando próxima chamada...</p></div>
        )}
      </main>

      <aside className="historico-lateral">
        <h2 className="titulo-secao">Últimas Chamadas</h2>
        {historico.length > 0 ? (
          <ul className="lista-historico">
            {historico.map((item, index) => (
              <li key={index} className="item-historico">
                <span className="hist-numero">{item.numero}</span>
                <span className="hist-guiche">{item.guiche}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mensagem-vazia-historico"><p>Nenhuma senha chamada anteriormente.</p></div>
        )}
      </aside>
    </div>
  );
}