import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../styles/Graficos.css";

export default function GraficoRosca({
  aguardando,
  emAtendimento,
  atendidas,
  naoCompareceu,
}) {
  const dadosGrafico = [
    { nome: "Aguardando", valor: aguardando, cor: "#f39c12" },
    { nome: "Em Atendimento", valor: emAtendimento, cor: "#3498db" },
    { nome: "Finalizados", valor: atendidas, cor: "#27ae60" },
    { nome: "Desistências", valor: naoCompareceu, cor: "#c0392b" },
  ];

  return (
    <div className="grafico-box">
      <h3 className="grafico-titulo">Status da Fila</h3>
      <div className="grafico-container-interno">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={dadosGrafico}
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              dataKey="valor"
              nameKey="nome"
            >
              {dadosGrafico.map((item, index) => (
                <Cell key={`cell-${index}`} fill={item.cor} />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ paddingTop: "10px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
