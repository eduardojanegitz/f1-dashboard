import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import Drivers from './components/Drivers/Drivers';
import DriverDetails from './components/DriverDetails/DriverDetails';
import Races from './components/Races/Races';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/drivers/:id" element={<DriverDetails />} />
        <Route path="/races" element={<Races />} />
      </Routes>
    </Router>
  );
}

export default App;
