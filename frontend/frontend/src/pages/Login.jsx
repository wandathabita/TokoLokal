import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const user = await login(email, password)
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'seller') navigate('/seller')
      else navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal.')
    }
  }

  return (
    <div className="mx-auto mt-20 max-w-sm rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold text-teal-700">Login TokoLokal</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full rounded bg-teal-700 py-2 font-medium text-white hover:bg-teal-800"
        >
          Masuk
        </button>
      </form>
    </div>
  )
}