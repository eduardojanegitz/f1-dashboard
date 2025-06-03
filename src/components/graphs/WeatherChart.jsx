import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

export default function WeatherChart({ meetingKey }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!meetingKey) return;

    async function fetchWeather() {
      try {
        const res = await axios.get('https://api.openf1.org/v1/weather', {
          params: { meeting_key: meetingKey }
        });

        const formatted = res.data.map(d => ({
          time: new Date(d.date).toISOString().slice(11, 19),
          air: d.air_temperature,
          track: d.track_temperature
        }));

        setData(formatted);
      } catch (err) {
        console.error('Erro ao carregar dados climáticos:', err);
      }
    }

    fetchWeather();
  }, [meetingKey]);

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">🌤️ Temperatura da Corrida</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={['auto', 'auto']} unit="°C" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="air" stroke="#8884d8" dot={false} name="Ar" />
          <Line type="monotone" dataKey="track" stroke="#f33" dot={false} name="Pista" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
