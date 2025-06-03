import { useEffect, useState } from "react";
import { getNextRace, getLastRace } from "../../api/f1";
import SpeedChart from "../graphs/SpeedChart";
import GapChart from "../graphs/GapChart";
import PositionChart from "../graphs/PositionChart";
import PitStopsChart from "../graphs/PitStopsChart";
import WeatherChart from "../graphs/WeatherChart";

export default function Dashboard() {
  const [nextRace, setNextRace] = useState(null);
  const [lastRace, setLastRace] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const next = await getNextRace();
      const last = await getLastRace();
      setNextRace(next);
      setLastRace(last);
    }
    fetchData();
  }, []);

  return (
    <div className="bg-f1black min-h-screen text-white p-6">
      <h2 className="text-3xl font-semibold text-f1red mb-4">
        🏁 Próxima Corrida
      </h2>
      {nextRace && (
        <div className="bg-neutral-800 p-4 rounded-md mb-8">
          <p className="text-lg font-medium">{nextRace.session_name}</p>
          <p>
            {nextRace.location} – {nextRace.country_name}
          </p>
          <p>{new Date(nextRace.date_start).toLocaleString()}</p>
        </div>
      )}

      <h2 className="text-3xl font-semibold text-f1red mb-4">
        ✅ Última Corrida
      </h2>
      {lastRace && (
        <div className="bg-neutral-800 p-4 rounded-md">
          <p className="text-lg font-medium">{lastRace.session_name}</p>
          <p>
            {lastRace.location} – {lastRace.country_name}
          </p>
          <p>Data: {new Date(lastRace.date_start).toLocaleString()}</p>
        </div>
      )}

      {/* <h2 className="text-3xl font-semibold text-f1red mb-4">
        Velocidade Média
      </h2>
      {lastRace && (
        <>
          <SpeedChart sessionKey={lastRace.session_key} />
        </>
      )} */}
      {lastRace && <GapChart sessionKey={lastRace.session_key} />}

      {lastRace && <PositionChart sessionKey={lastRace.session_key} />}

      {lastRace && <PitStopsChart sessionKey={lastRace.session_key} />}

      {lastRace && <WeatherChart meetingKey={lastRace.meeting_key} />}
    </div>
  );
}
