// src/components/Races.jsx
import { useEffect, useState } from 'react';
import { getSeasonRaces } from '../../api/f1';

export default function Races() {
  const [races, setRaces] = useState([]);

  useEffect(() => {
    getSeasonRaces().then(setRaces);
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🏎️ Corridas da Temporada</h2>
      <ul>
        {races.map((race) => (
          <li key={race.round}>
            {race.round}. {race.raceName} – {race.Circuit.circuitName} ({race.date})
          </li>
        ))}
      </ul>
    </div>
  );
}
