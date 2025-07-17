import React, { useState, useEffect } from "react";
import BookRow from '@/components/atoms/BookTableRow';
import { createBook, getBooks, searchBooksByTitle } from '@/utils/api';
import { useSession } from "next-auth/react";

interface Book {
    id: string;
    title: string;
    author: string;
    genre: string;
    publicationYear: number;
    availableCopies: number;
    status: string;
    createdAt: string;
    coverImageUrl?: string;
    description?: string;
    isbn?: string;
}

interface BookTableProps {
    books: Book[];
}

const Index = ({ books }: BookTableProps) => {
    const { data: session } = useSession();
    const [bookList, setBookList] = useState<Book[]>(books);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Solo búsqueda
    const [searchTitle, setSearchTitle] = useState("");

    // Formulario para agregar libro
    const [form, setForm] = useState({
        title: "",
        author: "",
        genre: "",
        publicationYear: "",
        availableCopies: "",
        isbn: "",
        description: "",
        coverImageUrl: ""
    });

    useEffect(() => {
        setBookList(books);
    }, [books]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAddBook = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!session?.user?.id || session.user.role !== "ADMIN") {
            setError("Solo administradores pueden agregar libros.");
            return;
        }

        setLoading(true);
        try {
            const newBook = await createBook({
                createdById: session.user.id,
                title: form.title,
                author: form.author,
                genre: form.genre,
                publicationYear: form.publicationYear ? Number(form.publicationYear) : 0,
                totalCopies: form.availableCopies ? Number(form.availableCopies) : 0,
                availableCopies: form.availableCopies ? Number(form.availableCopies) : 0,
                isbn: form.isbn,
                description: form.description,
                coverImageUrl: form.coverImageUrl,
            });
            setBookList(prev => [...prev, newBook]);
            setForm({
                title: "",
                author: "",
                genre: "",
                publicationYear: "",
                availableCopies: "",
                isbn: "",
                description: "",
                coverImageUrl: ""
            });
        } catch (err: unknown) {
            setError("Error al agregar el libro");
        } finally {
            setLoading(false);
        }
    };

    // Solo búsqueda
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            if (searchTitle) {
                const result = await searchBooksByTitle(searchTitle);
                setBookList(result);
            } else {
                const result = await getBooks();
                setBookList(result);
            }
        } catch (err: unknown) {
            setError("Error al buscar libros");
        } finally {
            setLoading(false);
        }
    };

    // ELIMINAR LIBRO
    const handleDelete = async (id: string) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch('/api/book', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId: id }),
            });
            if (res.ok) {
                setBookList(prev => prev.filter(b => b.id !== id));
            } else {
                setError('No se pudo eliminar el libro');
            }
        } catch (err: unknown) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="container px-4 mx-auto">
            {/* Solo muestra el formulario si es administrador */}
            {session?.user?.role === "ADMIN" ? (
                <form onSubmit={handleAddBook} className="mb-6 flex flex-wrap gap-2 items-center">
                    <input name="title" value={form.title} onChange={handleFormChange} placeholder="Título" className="border px-2 py-1 rounded" />
                    <input name="author" value={form.author} onChange={handleFormChange} placeholder="Autor" className="border px-2 py-1 rounded" />
                    <input name="genre" value={form.genre} onChange={handleFormChange} placeholder="Género" className="border px-2 py-1 rounded" />
                    <input name="publicationYear" value={form.publicationYear} onChange={handleFormChange} placeholder="Año" type="number" className="border px-2 py-1 rounded" />
                    <input name="availableCopies" value={form.availableCopies} onChange={handleFormChange} placeholder="Disponibles" type="number" className="border px-2 py-1 rounded" />
                    <input name="isbn" value={form.isbn} onChange={handleFormChange} placeholder="ISBN" className="border px-2 py-1 rounded" />
                    <input name="coverImageUrl" value={form.coverImageUrl} onChange={handleFormChange} placeholder="URL portada" className="border px-2 py-1 rounded" />
                    <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Descripción" className="border px-2 py-1 rounded" />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded" disabled={loading}>
                        {loading ? "Agregando..." : "Agregar libro"}
                    </button>
                </form>
            ) : (
                <div className="mb-6 text-red-500">Solo administradores pueden agregar libros.</div>
            )}

            {/* Formulario de búsqueda */}
            <form onSubmit={handleSearch} className="mb-4 flex gap-2 items-center">
                <input
                    type="text"
                    placeholder="Buscar por título"
                    value={searchTitle}
                    onChange={e => setSearchTitle(e.target.value)}
                    className="border px-2 py-1 rounded"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded" disabled={loading}>
                    Buscar
                </button>
            </form>

            {error && <div className="mb-4 text-red-500">{error}</div>}

            <div className="flex items-center gap-x-3">
                <h2 className="text-lg font-medium text-gray-800 dark:text-white">Libros registrados</h2>
                <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
                    {bookList.length} libros
                </span>
            </div>

            <div className="flex flex-col mt-6">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400">Título</th>
                                        <th className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400">Autor</th>
                                        <th className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400">Género</th>
                                        <th className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400">Año</th>
                                        <th className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400">Disponibles</th>
                                        <th className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                                    {bookList.map((book) => (
                                        <BookRow key={book.id} book={book} onDelete={handleDelete} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Index;