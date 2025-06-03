import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList
} from 'recharts';

export default function SpeedChart({ sessionKey }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!sessionKey) return;

    async function fetchSpeedSnapshot() {
      try {
        // Buscar data de início da sessão
        const sessionRes = await axios.get('https://api.openf1.org/v1/sessions', {
          params: { session_key: sessionKey }
        });
        const sessionStart = new Date(sessionRes.data[0].date_start);
        const snapshotTime = new Date(sessionStart.getTime() + 5000).toISOString(); // 5s depois

        // Buscar pilotos
        const driversRes = await axios.get('https://api.openf1.org/v1/drivers', {
          params: { session_key: sessionKey }
        });

        const drivers = driversRes.data.map(d => d.driver_number);
        const limitedDrivers = drivers.slice(0, 8); // limitar para performance

        const fetches = limitedDrivers.map(driver =>
          axios.get('https://api.openf1.org/v1/car_data', {
            params: {
              session_key: sessionKey,
              driver_number: driver,
              //date: `>=${snapshotTime}`
            }
          }).then(res => {
            const first = res.data.find(entry => entry.speed);
            return first ? { driver, speed: first.speed } : null;
          }).catch(() => null)
        );

        const results = await Promise.all(fetches);
        const filtered = results.filter(Boolean).sort((a, b) => b.speed - a.speed);

        setData(filtered.map(d => ({ driver: d.driver, avgSpeed: d.speed })));
      } catch (err) {
        console.error('Erro ao carregar snapshot de velocidade:', err);
      }
    }

    fetchSpeedSnapshot();
  }, [sessionKey]);

  return (
    <div className="mb-8">
      <h3 className="text-black text-xl font-semibold mb-2">🚀 Velocidade Estimada (5s de corrida)</h3>
      <p className="text-black text-xl mb-2">🚀 Velocidade Estimada (5s de corrida)</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart layout="vertical" data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" unit=" km/h" />
          <YAxis type="category" dataKey="driver" />
          <Tooltip />
          <Bar dataKey="avgSpeed" fill="#f33">
            <LabelList dataKey="avgSpeed" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
