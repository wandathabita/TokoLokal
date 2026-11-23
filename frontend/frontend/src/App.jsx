import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import { useAuth } from './context/AuthContext'

function Home() {
  const { user, logout } = useAuth()

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-teal-700">Beranda TokoLokal</h1>

      {user ? (
        <div className="mt-4">
          <p>Halo, {user.name} ({user.role})</p>
          <button
            onClick={logout}
            className="mt-2 rounded bg-teal-700 px-4 py-2 text-white"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link to="/login" className="mt-4 inline-block text-teal-700 underline">
          Login
        </Link>
      )}
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}