import { useEffect, useState } from 'react'
import { api } from '../components/api'

type Book = { id: string; title: string; author: string; isbn: string; publishedYear?: number | null; libraryId: string; available: boolean }
type Library = { id: string; name: string }

export default function Books() {
  const [items, setItems] = useState<Book[]>([])
  const [libraries, setLibraries] = useState<Library[]>([])
  const [form, setForm] = useState({ title: '', author: '', isbn: '', publishedYear: '', libraryId: '' })
  const [error, setError] = useState<string>('')

  const load = async () => {
    try {
      const [books, libs] = await Promise.all([
        api<Book[]>('/api/book'),
        api<Library[]>('/api/library')
      ])
      setItems(books); setLibraries(libs)
    } catch (e: any) { setError(e.message) }
  }

  useEffect(() => { load() }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const payload: any = { title: form.title, author: form.author, isbn: form.isbn, libraryId: form.libraryId }
      if (form.publishedYear) payload.publishedYear = Number(form.publishedYear)
      await api<Book>('/api/book', { method: 'POST', body: JSON.stringify(payload) })
      setForm({ title: '', author: '', isbn: '', publishedYear: '', libraryId: '' })
      await load()
    } catch (e: any) { setError(e.message) }
  }

  return (
    <section>
      <h2>Libros</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 500 }}>
        <input placeholder="Título" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        <input placeholder="Autor" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required />
        <input placeholder="ISBN" value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} required />
        <input placeholder="Año (opcional)" value={form.publishedYear} onChange={e => setForm({ ...form, publishedYear: e.target.value })} />
        <select value={form.libraryId} onChange={e => setForm({ ...form, libraryId: e.target.value })} required>
          <option value="">Seleccione biblioteca</option>
          {libraries.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <button type="submit">Crear</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {items.map(x => (
          <li key={x.id}>
            <strong>{x.title}</strong> — {x.author} (ISBN {x.isbn}) {x.publishedYear ? `· ${x.publishedYear}` : ''}
          </li>
        ))}
      </ul>
    </section>
  )
}
