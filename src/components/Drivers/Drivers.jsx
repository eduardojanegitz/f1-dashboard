// src/components/Drivers.jsx
import { useEffect, useState } from 'react';
import { getDrivers } from '../../api/f1';
import { Link } from 'react-router-dom';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    getDrivers().then(setDrivers);
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>👨‍✈️ Pilotos da Temporada</h2>
      <ul>
        {drivers.map(driver => (
          <li key={driver.driverId}>
            <Link to={`/drivers/${driver.driverId}`}>
              {driver.full_name} {driver.driver_number} - {driver.nationality}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
