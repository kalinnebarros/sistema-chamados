import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/Graficos.css';

export function GraficoBarra({ senhas, filtroTipo }) {
  const calcularMedia = (lista, tipo, campoInicio, campoFim) => {
    const filtradas = lista.filter(s => s.tipo === tipo && s[campoInicio] && s[campoFim]);
    if (filtradas.length === 0) return 0;
    
    let totalMs = 0;
    filtradas.forEach(s => {
      totalMs += (new Date(s[campoFim]) - new Date(s[campoInicio]));
    });
    return Math.round((totalMs / filtradas.length) / 60000);
  };

  let dadosGrafico = [];

  if (filtroTipo === "TODOS") {
    dadosGrafico = [
      { nome: 'Preferencial', Espera: calcularMedia(senhas, 'SP', 'dataCriacao', 'dataChamada'), Atendimento: calcularMedia(senhas, 'SP', 'dataChamada', 'dataFinalizacao') },
      { nome: 'Especial', Espera: calcularMedia(senhas, 'SE', 'dataCriacao', 'dataChamada'), Atendimento: calcularMedia(senhas, 'SE', 'dataChamada', 'dataFinalizacao') },
      { nome: 'Geral', Espera: calcularMedia(senhas, 'SG', 'dataCriacao', 'dataChamada'), Atendimento: calcularMedia(senhas, 'SG', 'dataChamada', 'dataFinalizacao') }
    ];
  } else {
    const nomesMap = { SP: 'Preferencial', SE: 'Especial', SG: 'Geral' };
    dadosGrafico = [
      {
        nome: nomesMap[filtroTipo] || filtroTipo,
        Espera: calcularMedia(senhas, filtroTipo, 'dataCriacao', 'dataChamada'),
        Atendimento: calcularMedia(senhas, filtroTipo, 'dataChamada', 'dataFinalizacao')
      }
    ];
  }

  return (
    <div className="grafico-box">
      <h3 className="grafico-titulo">Tempo Médio por Fila (min)</h3>
      <div className="grafico-container-interno">
        <ResponsiveContainer>
          <BarChart data={dadosGrafico} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="nome" />
            <YAxis />
            <Tooltip cursor={{ fill: 'transparent' }} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            
            <Bar dataKey="Espera" fill="#8e44ad" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="Atendimento" fill="#16a085" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
