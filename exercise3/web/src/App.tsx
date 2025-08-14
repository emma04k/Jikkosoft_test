import { Link, Route, Routes, Navigate } from 'react-router-dom'
import Libraries from './pages/Libraries'
import Books from './pages/Books'
import Members from './pages/Members'

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <h1>📚 Library Manager</h1>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Link to="/libraries">Bibliotecas</Link>
        <Link to="/books">Libros</Link>
        <Link to="/members">Miembros</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/libraries" replace />} />
        <Route path="/libraries" element={<Libraries />} />
        <Route path="/books" element={<Books />} />
        <Route path="/members" element={<Members />} />
      </Routes>
    </div>
  )
}
