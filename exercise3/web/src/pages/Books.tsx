import React, { useEffect, useState } from 'react';
import { api } from '../components/api';
import GenericModal from '../components/GenericModal';
import '../styles/App.css';

type Book = {
    id: string;
    title: string;
    author: string;
    isbn: string;
    publishedYear?: string | null;
    libraryId: string;
    available: boolean;
    borrowed: boolean;
    loanInfo: {
        loanId: string;
        memberId: string;
        borrowedAt: string;
    } | null;
};

type Library = { id: string; name: string };
type Member = { id: string; name: string };

export default function Books() {
    const [items, setItems] = useState<Book[]>([]);
    const [libraries, setLibraries] = useState<Library[]>([]);
    const [members, setMembers] = useState<Member[]>([]); // Miembros
    const [form, setForm] = useState({ title: '', author: '', isbn: '', publishedYear: '', libraryId: '' });
    const [search, setSearch] = useState('');
    const [error, setError] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [modalOpen, setModalOpen] = useState(false); // Modal para crear/editar
    const [loanModalOpen, setLoanModalOpen] = useState(false); // Modal para prestar libro
    const [selectedBook, setSelectedBook] = useState<Book | null>(null); // Libro seleccionado para editar o prestar
    const [selectedMemberId, setSelectedMemberId] = useState<string>(''); // ID del miembro seleccionado para préstamo

    const load = async () => {
        try {
            const [books, libs, mems] = await Promise.all([
                api<Book[]>('/api/book/full'),
                api<Library[]>('/api/library'),
                api<Member[]>('/api/member') // Obtener los miembros
            ]);
            setItems(books);
            setLibraries(libs);
            setMembers(mems);
        } catch (e: any) { setError(e.message); }
    };

    useEffect(() => { load() }, []);

    useEffect(() => {
        if (selectedBook && selectedBook.loanInfo?.memberId) {
            setSelectedMemberId(selectedBook.loanInfo.memberId);
        } else {
            setSelectedMemberId('');
        }
    }, [selectedBook]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const payload: any = { title: form.title, author: form.author, isbn: form.isbn, libraryId: form.libraryId };
            if (form.publishedYear) payload.publishedYear = Number(form.publishedYear);

            if (selectedBook) {
                // Editar libro
                await api<Book>(`/api/book/${selectedBook.id}`, { method: 'PUT', body: JSON.stringify(payload) });
            } else {
                // Crear libro
                await api<Book>('/api/book', { method: 'POST', body: JSON.stringify(payload) });
            }

            setForm({ title: '', author: '', isbn: '', publishedYear: '', libraryId: '' });
            setModalOpen(false);
            await load();
        } catch (e: any) { setError(e.message); }
    };

    const onDelete = async (id: string) => {
        try {
            await api(`/api/book/${id}`, { method: 'DELETE' });
            await load();
        } catch (e: any) { setError(e.message); }
    };

    const onBorrow = async (book: Book) => {
        if (!selectedMemberId) {
            return;
        }

        try {
            await api(`/api/loan`, { method: 'POST', body: JSON.stringify({ bookId: book.id, memberId: selectedMemberId }) });
            await load();
            setLoanModalOpen(false); // Cerrar modal de préstamo después de realizar el préstamo
        } catch (e: any) {
            setError(e.message);
        }
    };

    const onReturn = async (book: Book) => {
        if (!book.loanInfo?.loanId){
            setMessage('El libro no esta prestado');
            return;
        }
        try {
            await api(`/api/loan/${book.loanInfo.loanId}`, { method: 'DELETE'});
            await load();
            setLoanModalOpen(false);
        } catch (e: any) {
            console.log({e})
            setError(e.message); }
    };

    const openModal = (book?: Book) => {
        setError('');
        setMessage('');
        setSelectedBook(book || null);
        setForm({
            title: book?.title || '',
            author: book?.author || '',
            isbn: book?.isbn || '',
            publishedYear: book?.publishedYear || '',
            libraryId: book?.libraryId || ''
        });
        setModalOpen(true);
    };

    const openLoanModal = (book: Book) => {
        setSelectedBook(book);
        setLoanModalOpen(true);
        setError('');
        setMessage('');
    };

    const filteredBooks = items.filter((book) =>
        book.title.toLowerCase().includes(search.toLowerCase()) || book.author.toLowerCase().includes(search.toLowerCase())
    );

    const contentForLoanModal = selectedBook && (
        <div>
            <form onSubmit={(e)=>{e.preventDefault();}}>
                <select
                    value={selectedMemberId}
                    onChange={e => setSelectedMemberId(e.target.value)}
                    required
                    disabled={selectedBook.loanInfo !== null} // Deshabilitar si ya está prestado
                >
                    <option value="">Seleccione miembro</option>
                    {members.map(member => (
                        <option key={member.id} value={member.id}>{member.name}</option>
                    ))}
                </select>
                <button onClick={() => onBorrow(selectedBook!)}>Prestar</button>
                <button onClick={() => onReturn(selectedBook!)}>Devolver</button>
            </form>
        </div>
    );

    return (
        <section>
            <h2>Libros</h2>

            {/* Filtro de búsqueda */}
            <input
                type="text"
                placeholder="Buscar por título o autor"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
            />

            {/* Botón de crear libro */}
            <button onClick={() => openModal()} style={{ marginBottom: '10px' }}>Crear Libro</button>

            {/* Tabla de libros */}
            <table>
                <thead>
                <tr>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>ISBN</th>
                    <th>Año</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {filteredBooks.map(book => (
                    <tr key={book.id}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.isbn}</td>
                        <td>{book.publishedYear}</td>
                        <td>
                            <button onClick={() => openModal(book)}>Editar</button>
                            <button className="delete-button" onClick={() => onDelete(book.id)}>Borrar</button>
                            <button onClick={() => openLoanModal(book)}>Prestar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Modal para Crear/Editar Libro */}
            {modalOpen && (
                <div className="modal">
                    <h3>{selectedBook ? 'Editar Libro' : 'Crear Libro'}</h3>
                    <form onSubmit={onSubmit}>
                        <input
                            placeholder="Título"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Autor"
                            value={form.author}
                            onChange={e => setForm({ ...form, author: e.target.value })}
                            required
                        />
                        <input
                            placeholder="ISBN"
                            value={form.isbn}
                            onChange={e => setForm({ ...form, isbn: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Año (opcional)"
                            value={form.publishedYear}
                            onChange={e => setForm({ ...form, publishedYear: e.target.value })}
                        />
                        <select
                            value={form.libraryId}
                            onChange={e => setForm({ ...form, libraryId: e.target.value })}
                            required
                        >
                            <option value="">Seleccione biblioteca</option>
                            {libraries.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </select>
                        <button type="submit">{selectedBook ? 'Actualizar' : 'Crear'}</button>
                        <button onClick={() => setModalOpen(false)}>Cancelar</button>
                    </form>
                </div>
            )}

            {/* Modal de préstamo */}
            {loanModalOpen && (
                <GenericModal
                    title={`Prestar Libro - ${selectedBook?.title}`}
                    content={contentForLoanModal}
                    onClose={() => setLoanModalOpen(false)}
                    submitLabel="Cancelar"
                />

            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'black' }}>{message}</p>}
        </section>
    );
}
