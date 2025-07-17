import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getBooks, searchBooks, createTransaction } from '@/utils/api';
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

interface CatalogoProps {
    initialBooks?: Book[];
}

const Catalogo = ({ initialBooks = [] }: CatalogoProps) => {
    const { data: session } = useSession();
    const [books, setBooks] = useState<Book[]>(initialBooks);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loanLoading, setLoanLoading] = useState(false);
    
    // Filtros
    const [searchTitle, setSearchTitle] = useState("");
    const [searchAuthor, setSearchAuthor] = useState("");
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    // Cargar libros iniciales
    useEffect(() => {
        if (initialBooks.length === 0) {
            loadAllBooks();
        }
    }, [initialBooks]);

    const loadAllBooks = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getBooks();
            setBooks(result);
        } catch (error) {
            console.error("Error loading books:", error);
            setError("Error al cargar los libros");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        
        try {
            let result: Book[] = [];
            
            if (searchTitle && searchAuthor) {
                // Si ambos filtros están activos, buscar por título y luego filtrar por autor
                const titleResults = await searchBooks(searchTitle);
                result = titleResults.filter((book: Book) => 
                    book.author.toLowerCase().includes(searchAuthor.toLowerCase())
                );
            } else if (searchTitle) {
                result = await searchBooks(searchTitle);
            } else if (searchAuthor) {
                result = await searchBooks(searchAuthor);
            } else {
                result = await getBooks();
            }
            
            setBooks(result);
        } catch (error) {
            console.error("Error searching books:", error);
            setError("Error al buscar libros");
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setSearchTitle("");
        setSearchAuthor("");
        loadAllBooks();
    };

    const openBookDetails = (book: Book) => {
        setSelectedBook(book);
        setShowDetails(true);
    };

    const closeBookDetails = () => {
        setSelectedBook(null);
        setShowDetails(false);
    };

    const handleLoanBook = async (bookId: string) => {
        if (!session) {
            setError("Debes iniciar sesión para pedir un préstamo");
            return;
        }

        setLoanLoading(true);
        setError(null);

        try {
            console.log("Attempting to create loan for book:", bookId);
            const result = await createTransaction(bookId);
            console.log("Loan created successfully:", result);
            
            // Actualizar el libro en el estado local
            setBooks(prevBooks => 
                prevBooks.map(book => 
                    book.id === bookId 
                        ? { ...book, availableCopies: book.availableCopies - 1 }
                        : book
                )
            );

            // Actualizar el libro seleccionado si es el mismo
            if (selectedBook?.id === bookId) {
                setSelectedBook(prev => prev ? { ...prev, availableCopies: prev.availableCopies - 1 } : null);
            }

            // Mostrar mensaje de éxito
            alert("¡Préstamo solicitado exitosamente! El libro ha sido reservado para ti.");
            
        } catch (error: unknown) {
            console.error("Error creating loan:", error);
            let errorMessage = "Error al procesar el préstamo";
            
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }
            
            setError(errorMessage);
            alert(`Error: ${errorMessage}`);
        } finally {
            setLoanLoading(false);
        }
    };

    return (
        <section className="container px-4 mx-auto">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-x-3">
                        <h2 className="text-lg font-medium text-gray-800 dark:text-white">
                            📚 Catálogo de Libros
                        </h2>
                        <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
                            {books.length} libros disponibles
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                        Explora nuestra colección de libros
                    </p>
                </div>
            </div>

            {/* Filtros de búsqueda */}
            <div className="mt-6 md:flex md:items-center md:justify-between">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 w-full">
                    <div className="flex gap-2 flex-1">
                        <input
                            type="text"
                            placeholder="Buscar por título..."
                            value={searchTitle}
                            onChange={(e) => setSearchTitle(e.target.value)}
                            className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                        <input
                            type="text"
                            placeholder="Buscar por autor..."
                            value={searchAuthor}
                            onChange={(e) => setSearchAuthor(e.target.value)}
                            className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 disabled:opacity-50"
                        >
                            {loading ? "Buscando..." : "Buscar"}
                        </button>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="px-6 py-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            Limpiar
                        </button>
                    </div>
                </form>
            </div>

            {error && (
                <div className="mt-4 p-4 text-red-700 bg-red-100 border border-red-300 rounded-lg dark:bg-red-900 dark:text-red-300 dark:border-red-600">
                    {error}
                </div>
            )}

            {/* Tabla de libros */}
            <div className="flex flex-col mt-6">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            Libro
                                        </th>
                                        <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            Autor
                                        </th>
                                        <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            Género
                                        </th>
                                        <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            Año
                                        </th>
                                        <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            Disponibles
                                        </th>
                                        <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                                    {books.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                                {loading ? "Cargando libros..." : "No se encontraron libros"}
                                            </td>
                                        </tr>
                                    ) : (
                                        books.map((book) => (
                                            <tr key={book.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                                    <div className="flex items-center gap-x-3">
                                                        <Image
                                                            className="object-cover w-10 h-14 rounded"
                                                            src={book.coverImageUrl || "https://placehold.co/40x60"}
                                                            alt={book.title}
                                                            width={40}
                                                            height={60}
                                                        />
                                                        <div>
                                                            <h2 className="font-medium text-gray-800 dark:text-white">
                                                                {book.title}
                                                            </h2>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                ISBN: {book.isbn || "No disponible"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                                    {book.author}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">
                                                        {book.genre}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                                    {book.publicationYear}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        book.availableCopies > 0 
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                    }`}>
                                                        {book.availableCopies} disponibles
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => openBookDetails(book)}
                                                            className="px-3 py-1 text-sm font-medium text-blue-600 transition-colors duration-200 bg-blue-100 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                                                        >
                                                            Ver detalles
                                                        </button>
                                                        {book.availableCopies > 0 && (
                                                            <button
                                                                onClick={() => handleLoanBook(book.id)}
                                                                disabled={loanLoading}
                                                                className="px-3 py-1 text-sm font-medium text-white transition-colors duration-200 bg-green-500 rounded-lg hover:bg-green-400 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                {loanLoading ? "..." : "Reservar"}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de detalles del libro */}
            {showDetails && selectedBook && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    Detalles del Libro
                                </h3>
                                <button
                                    onClick={closeBookDetails}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="md:w-1/3">
                                    <Image
                                        className="w-full h-auto rounded-lg shadow-md"
                                        src={selectedBook.coverImageUrl || "https://placehold.co/200x300"}
                                        alt={selectedBook.title}
                                        width={200}
                                        height={300}
                                    />
                                </div>
                                
                                <div className="md:w-2/3">
                                    <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                        {selectedBook.title}
                                    </h4>
                                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                                        por {selectedBook.author}
                                    </p>
                                    
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Género:</span>
                                            <p className="text-gray-800 dark:text-white">{selectedBook.genre}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Año:</span>
                                            <p className="text-gray-800 dark:text-white">{selectedBook.publicationYear}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">ISBN:</span>
                                            <p className="text-gray-800 dark:text-white">{selectedBook.isbn || "No disponible"}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Disponibles:</span>
                                            <p className="text-gray-800 dark:text-white">{selectedBook.availableCopies}</p>
                                        </div>
                                    </div>
                                    
                                    {selectedBook.description && (
                                        <div className="mb-4">
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Descripción:</span>
                                            <p className="text-gray-800 dark:text-white mt-1">
                                                {selectedBook.description}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    onClick={closeBookDetails}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    Cerrar
                                </button>
                                {selectedBook.availableCopies > 0 && (
                                    <button 
                                        onClick={() => handleLoanBook(selectedBook.id)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                                    >
                                        {loanLoading ? "Reservando..." : "Reservar libro"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Catalogo;
