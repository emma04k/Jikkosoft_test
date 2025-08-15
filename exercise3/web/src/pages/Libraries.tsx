import { useEffect, useState } from 'react';
import { api } from '../components/api';
import '../styles/App.css';

type Library = { id: string; name: string; address?: string | null };

export default function Libraries() {
  const [items, setItems] = useState<Library[]>([]);
  const [form, setForm] = useState({ name: '', address: '' });
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false); // Modal para crear/editar
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null); // Biblioteca seleccionada para editar

  const load = async () => {
    try {
      const data = await api<Library[]>('/api/library');
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
      const payload = { name: form.name, address: form.address };

      if (selectedLibrary) {
        // Editar biblioteca
        await api<Library>(`/api/library/${selectedLibrary.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        // Crear biblioteca
         await api<Library>('/api/library', { method: 'POST', body: JSON.stringify(payload) });
      }

        setForm({ name: '', address: '' });
        setModalOpen(false);
        await load();

    } catch (e: any) {
      setError(e.message);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await api(`/api/library/${id}`, { method: 'DELETE' });
      await load();
    } catch (e: any) { setError(e.message); }
  };

  const openModal = (library?: Library) => {
    setSelectedLibrary(library || null);
    setForm({
      name: library?.name || '',
      address: library?.address || ''
    });
    setModalOpen(true);
  };

  const filteredLibraries = items.filter((library) =>
      library.name.toLowerCase().includes(search.toLowerCase()) || (library.address && library.address.toLowerCase().includes(search.toLowerCase()))
  );

  return (
      <section>
        <h2>Bibliotecas</h2>

        {/* Filtro de búsqueda */}
        <input
            type="text"
            placeholder="Buscar por nombre o dirección"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
        />

        {/* Botón de crear biblioteca */}
        <button onClick={() => openModal()} style={{ marginBottom: '10px' }}>
          Crear Biblioteca
        </button>

        {/* Tabla de bibliotecas */}
        <table>
          <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
          </thead>
          <tbody>
          {filteredLibraries.map((library) => (
              <tr key={library.id}>
                <td>{library.name}</td>
                <td>{library.address || 'No especificada'}</td>
                <td>
                  <button onClick={() => openModal(library)}>Editar</button>
                  <button className="delete-button" onClick={() => onDelete(library.id)}>
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
              <h3>{selectedLibrary ? 'Editar Biblioteca' : 'Crear Biblioteca'}</h3>
              <form onSubmit={onSubmit}>
                <input
                    placeholder="Nombre"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
                <input
                    placeholder="Dirección (opcional)"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
                <button type="submit">{selectedLibrary ? 'Actualizar' : 'Crear'}</button>
                <button onClick={() => setModalOpen(false)}>Cancelar</button>
              </form>
            </div>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </section>
  );
}
