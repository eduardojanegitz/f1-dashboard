import axios from 'axios';

const BASE_URL = 'https://api.openf1.org/v1';

// Sessões mais próximas da data atual
export const getNextRace = async () => {
  const now = new Date().toISOString();

  const res = await axios.get(`${BASE_URL}/sessions`, {
    params: {
      session_type: 'Race',
      // date_start_gte: now,
      // order_by: 'date_start',
      // limit: 1
    }
  });

  return res.data[0];
};

// Última sessão de corrida antes do momento atual
export const getLastRace = async () => {
  const now = new Date().toISOString();
  // console.log(now)

  const res = await axios.get(`${BASE_URL}/sessions`, {
    params: {
      session_type: 'Race',
      date_start: '2025-06-01',
      // order_by: '-date_start',
      // limit: 1
    }
  });

  return res.data[0];
};

// Lista de pilotos únicos (última sessão usada como referência)
export const getDrivers = async () => {
  const latest = await axios.get(`${BASE_URL}/drivers`, {
    params: {
      session_type: 'Race',
      order_by: '-date_start',
      limit: 1
    }
  });

  const latestSessionKey = latest.data[0]?.session_key;

  const res = await axios.get(`${BASE_URL}/drivers`, {
    params: {
      session_key: latestSessionKey
    }
  });

  return res.data;
};

// Detalhes de um piloto (com base no último session_key)
export const getDriverDetails = async (driverNumber) => {
  const latest = await axios.get(`${BASE_URL}/sessions`, {
    params: {
      session_type: 'Race',
      order_by: '-date_start',
      limit: 1
    }
  });

  const sessionKey = latest.data[0]?.session_key;

  const res = await axios.get(`${BASE_URL}/drivers`, {
    params: {
      driver_number: driverNumber,
      session_key: sessionKey
    }
  });

  return res.data[0];
};

// Corridas da temporada atual
export const getSeasonRaces = async () => {
  const year = new Date().getFullYear();

  const res = await axios.get(`${BASE_URL}/meetings`, {
    params: {
      year
    }
  });

  return res.data;
};
