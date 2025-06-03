import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList
} from 'recharts';

export default function PitStopsChart({ sessionKey }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!sessionKey) return;

    async function fetchPits() {
      try {
        const [pitsRes, driversRes] = await Promise.all([
          axios.get('https://api.openf1.org/v1/pit', { params: { session_key: sessionKey } }),
          axios.get('https://api.openf1.org/v1/drivers', { params: { session_key: sessionKey } }),
        ]);

        const nameMap = {};
        driversRes.data.forEach(d => {
          nameMap[d.driver_number] = d.name_acronym || `#${d.driver_number}`;
        });

        const pitCounts = {};

        pitsRes.data.forEach(pit => {
          const num = pit.driver_number;
          pitCounts[num] = (pitCounts[num] || 0) + 1;
        });

        const result = Object.entries(pitCounts).map(([driver, count]) => ({
          driver: nameMap[driver] || `#${driver}`,
          stops: count,
        }));

        setData(result.sort((a, b) => b.stops - a.stops));
      } catch (err) {
        console.error('Erro ao carregar dados de pit stops:', err);
      }
    }

    fetchPits();
  }, [sessionKey]);

  return (
    <div className="mb-8">
      <h3 className="text-black text-xl font-semibold mb-2">🛞 Número de Pit Stops</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="driver" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="stops" fill="#8884d8">
            <LabelList dataKey="stops" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
