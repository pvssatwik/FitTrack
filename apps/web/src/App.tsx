import { Link, Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Leaderboards } from './pages/Leaderboards';
import { Login } from './pages/Login';
import { Upload } from './pages/Upload';

export function App() {
  return (
    <>
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/upload">Upload</Link>
        <Link to="/leaderboards">Leaderboards</Link>
        <Link to="/login">Login</Link>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/leaderboards" element={<Leaderboards />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </>
  );
}
