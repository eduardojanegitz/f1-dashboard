import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

const colors = [
  '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
  '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe'
];

export default function GapChart({ sessionKey }) {
  const [series, setSeries] = useState([]);
  const [legendNames, setLegendNames] = useState({});

  useEffect(() => {
    if (!sessionKey) return;

    async function fetchGapData() {
      try {
        const [intervalsRes, driversRes] = await Promise.all([
          axios.get('https://api.openf1.org/v1/intervals', {
            params: { session_key: sessionKey }
          }),
          axios.get('https://api.openf1.org/v1/drivers', {
            params: { session_key: sessionKey }
          })
        ]);

        const driverMap = {};
        driversRes.data.forEach(d => {
          driverMap[d.driver_number] = d.name_acronym || d.broadcast_name || `#${d.driver_number}`;
        });

        const raw = intervalsRes.data.filter(d => d.gap_to_leader !== null);

        const grouped = {};
        raw.forEach(d => {
          const key = d.driver_number;
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push({
            time: new Date(d.date).toISOString().slice(11, 19),
            gap: d.gap_to_leader
          });
        });

        const topDrivers = Object.entries(grouped)
          .sort((a, b) => {
            const aLast = a[1][a[1].length - 1]?.gap ?? Infinity;
            const bLast = b[1][b[1].length - 1]?.gap ?? Infinity;
            return aLast - bLast;
          })
          .slice(0, 3);

        const merged = [];
        const legendMap = {};
        const maxPoints = Math.max(...topDrivers.map(([_, points]) => points.length));

        for (let i = 0; i < maxPoints; i++) {
          const point = {};
          topDrivers.forEach(([driver, points]) => {
            const p = points[i];
            if (p) {
              point.time = p.time;
              const label = driverMap[driver] || `#${driver}`;
              point[label] = parseFloat(p.gap.toFixed(1));
              legendMap[driver] = label;
            }
          });
          merged.push(point);
        }

        setSeries(merged);
        setLegendNames(legendMap);
      } catch (err) {
        console.error('Erro ao carregar dados de intervalo:', err);
      }
    }

    fetchGapData();
  }, [sessionKey]);

  return (
    <div className="mb-8">
      <h3 className="text-black text-xl font-semibold mb-2">⏱️ Gap para o Líder (Top 3)</h3>
      <p className="text-black text-xl mb-2">Mostra os 3 pilotos com menor gap final (excluindo o líder)</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={series}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis unit="s" domain={[0, 'auto']} />
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
