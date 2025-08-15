import { useEffect, useState } from 'react';
import { api } from '../components/api';
import '../styles/App.css';

type Member = { id: string; name: string; email: string };

export default function Members() {
  const [items, setItems] = useState<Member[]>([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false); // Modal para crear/editar
  const [selectedMember, setSelectedMember] = useState<Member | null>(null); // Miembro seleccionado para editar

  const load = async () => {
    try {
      const data = await api<Member[]>('/api/member');
      setItems(data);
    } catch (e: any) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { name: form.name, email: form.email };

      if (selectedMember) {
        // Editar miembro
        await api<Member>(`/api/member/${selectedMember.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        // Crear miembro
        await api<Member>('/api/member', { method: 'POST', body: JSON.stringify(payload) });
      }

      setForm({ name: '', email: '' });
      setModalOpen(false);
      await load();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await api(`/api/member/${id}`, { method: 'DELETE' });
      await load();
    } catch (e: any) { setError(e.message); }
  };

  const openModal = (member?: Member) => {
    setSelectedMember(member || null);
    setForm({
      name: member?.name || '',
      email: member?.email || ''
    });
    setModalOpen(true);
  };

  const filteredMembers = items.filter((member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) || member.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
      <section>
        <h2>Miembros</h2>

        {/* Filtro de búsqueda */}
        <input
            type="text"
            placeholder="Buscar por nombre o correo"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
        />

        {/* Botón de crear miembro */}
        <button onClick={() => openModal()} style={{ marginBottom: '10px' }}>
          Crear Miembro
        </button>

        {/* Tabla de miembros */}
        <table>
          <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
          </thead>
          <tbody>
          {filteredMembers.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>
                  <button onClick={() => openModal(member)}>Editar</button>
                  <button className="delete-button" onClick={() => onDelete(member.id)}>
                    Borrar
                  </button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>

        {/* Modal */}
        {modalOpen && (
            <div className="modal">
              <h3>{selectedMember ? 'Editar Miembro' : 'Crear Miembro'}</h3>
              <form onSubmit={onSubmit}>
                <input
                    placeholder="Nombre"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
                <input
                    placeholder="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                />
                <button type="submit">{selectedMember ? 'Actualizar' : 'Crear'}</button>
                <button onClick={() => setModalOpen(false)}>Cancelar</button>
              </form>
            </div>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </section>
  );
}
