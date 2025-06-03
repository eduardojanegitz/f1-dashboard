import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

// Cores diferentes para até 10 pilotos
const colors = [
  '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
  '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe'
];

export default function PositionChart({ sessionKey }) {
  const [series, setSeries] = useState([]);
  const [legendNames, setLegendNames] = useState({}); // { driver_number: acronym }

  useEffect(() => {
    if (!sessionKey) return;

    async function fetchData() {
      try {
        const [positionsRes, driversRes] = await Promise.all([
          axios.get('https://api.openf1.org/v1/position', { params: { session_key: sessionKey } }),
          axios.get('https://api.openf1.org/v1/drivers', { params: { session_key: sessionKey } }),
        ]);

        const driversMap = {};
        driversRes.data.forEach(d => {
          driversMap[d.driver_number] = d.name_acronym || d.broadcast_name || `#${d.driver_number}`;
        });

        const data = positionsRes.data.filter(d => d.position && d.driver_number);

        const grouped = {};
        data.forEach(d => {
          const driver = d.driver_number;
          if (!grouped[driver]) grouped[driver] = [];
          grouped[driver].push({
            time: new Date(d.date).toISOString().slice(11, 19),
            position: d.position
          });
        });

        const topDrivers = Object.entries(grouped)
          .sort((a, b) => {
            const aLast = a[1][a[1].length - 1]?.position ?? 99;
            const bLast = b[1][b[1].length - 1]?.position ?? 99;
            return aLast - bLast;
          })
          .slice(0, 5);

        const legendMap = {};
        const merged = [];

        const maxLen = Math.max(...topDrivers.map(([_, arr]) => arr.length));
        for (let i = 0; i < maxLen; i++) {
          const point = {};
          topDrivers.forEach(([driver, points]) => {
            const p = points[i];
            if (p) {
              point.time = p.time;
              const label = driversMap[driver] || `#${driver}`;
              point[label] = p.position;
              legendMap[driver] = label;
            }
          });
          merged.push(point);
        }

        setSeries(merged);
        setLegendNames(legendMap);
      } catch (err) {
        console.error('Erro ao carregar gráfico de posições:', err);
      }
    }

    fetchData();
  }, [sessionKey]);

  return (
    <div className="mb-8">
      <h3 className="text-black text-xl font-semibold mb-2">📈 Evolução de Posição (Top 5)</h3>
      <p className="text-black text-xl mb-2">Mostra os 5 primeiros colocados no fim da corrida</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={series}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis reversed allowDecimals={false} domain={[1, 'dataMax']} />
          <Tooltip />
          <Legend />
          {Object.values(legendNames).map((label, i) => (
            <Line
              key={label}
              type="monotone"
              dataKey={label}
              stroke={colors[i % colors.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
