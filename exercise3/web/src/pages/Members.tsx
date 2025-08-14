import { useEffect, useState } from 'react'
import { api } from '../components/api'

type Member = { id: string; name: string; email: string }

export default function Members() {
  const [items, setItems] = useState<Member[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>('')

  const load = async () => {
    try {
      const data = await api<Member[]>('/api/member')
      setItems(data)
    } catch (e: any) { setError(e.message) }
  }

  useEffect(() => { load() }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await api<Member>('/api/member', { method: 'POST', body: JSON.stringify({ name, email }) })
      setName(''); setEmail(''); await load()
    } catch (e: any) { setError(e.message) }
  }

  return (
    <section>
      <h2>Miembros</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 400 }}>
        <input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <button type="submit">Crear</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {items.map(x => <li key={x.id}><strong>{x.name}</strong> — {x.email}</li>)}
      </ul>
    </section>
  )
}
