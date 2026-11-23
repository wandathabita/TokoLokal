import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Login from './pages/Login'
import DashLayout from './layouts/DashLayout'
import SellerDashboard from './pages/seller/Dashboard'
import AdminDashboard from './pages/admin/Dashboard'

function Guard({ role, children }) {
  const { user } = useAuth()
  return user?.role === role ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/katalog" element={<Catalog />} />
      <Route path="/login" element={<Login />} />
      <Route path="/seller" element={<Guard role="seller"><DashLayout role="seller" /></Guard>}>
        <Route index element={<SellerDashboard />} />
      </Route>
      <Route path="/admin" element={<Guard role="admin"><DashLayout role="admin" /></Guard>}>
        <Route index element={<AdminDashboard />} />
      </Route>
    </Routes>
  )
}