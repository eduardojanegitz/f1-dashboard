// src/components/DriverDetails.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getDriverDetails } from '../../api/f1';

export default function DriverDetails() {
  const { id } = useParams();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    getDriverDetails(id).then(setDetails);
  }, [id]);

  return (
    <div style={{ padding: '2rem' }}>
      {details ? (
        <>
          <h2>{details.Driver.givenName} {details.Driver.familyName}</h2>
          <p>Posição: {details.position}</p>
          <p>Pontos: {details.points}</p>
          <p>Equipe: {details.Constructors[0].name}</p>
        </>
      ) : <p>Carregando...</p>}
    </div>
  );
}
