import { useEffect, useState } from 'react'
import { api } from '../components/api'

type Library = { id: string; name: string; address?: string | null }

export default function Libraries() {
  const [items, setItems] = useState<Library[]>([])
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState<string>('')

  const load = async () => {
    try {
      const data = await api<Library[]>('/api/library')
      setItems(data)
    } catch (e: any) {
      setError(e.message)
    }
  }

  useEffect(() => { load() }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await api<Library>('/api/library', { method: 'POST', body: JSON.stringify({ name, address }) })
      setName(''); setAddress(''); await load()
    } catch (e: any) { setError(e.message) }
  }

  return (
    <section>
      <h2>Bibliotecas</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 400 }}>
        <input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Dirección (opcional)" value={address} onChange={e => setAddress(e.target.value)} />
        <button type="submit">Crear</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {items.map(x => <li key={x.id}><strong>{x.name}</strong>{x.address ? ` — ${x.address}` : ''}</li>)}
      </ul>
    </section>
  )
}
