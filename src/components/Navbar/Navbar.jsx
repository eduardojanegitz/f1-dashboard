// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-f1black text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="text-black text-f1red text-2xl font-bold">F1 Dashboard</div>
      <div className="space-x-6 text-sm">
        <Link to="/" className="text-black hover:text-f1red transition">Dashboard</Link>
        <Link to="/drivers" className="text-black hover:text-f1red transition">Pilotos</Link>
        <Link to="/races" className="text-black hover:text-f1red transition">Corridas</Link>
      </div>
    </nav>
  );
}
