"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createBook } from "@/utils/api"
import { useSession } from "next-auth/react"
import Link from "next/link"

interface Book {
  id: string
  title: string
  author: string
  genre: string
  publicationYear: number
  availableCopies: number
  status: string
  createdAt: string
  coverImageUrl?: string
  description?: string
  isbn?: string
}

interface BookTableProps {
  books: Book[]
}

const BookAdminTable = ({ books }: BookTableProps) => {
  const { data: session } = useSession()
  const [bookList, setBookList] = useState<Book[]>(books)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Estados para formulario de agregar libro
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    publicationYear: "",
    availableCopies: "",
    isbn: "",
    description: "",
    coverImageUrl: "",
  })

  useEffect(() => {
    setBookList(books)
  }, [books])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      setError("Solo administradores pueden agregar libros.")
      return
    }
    setLoading(true)
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
      })
      setBookList((prev) => [...prev, newBook])
      setForm({
        title: "",
        author: "",
        genre: "",
        publicationYear: "",
        availableCopies: "",
        isbn: "",
        description: "",
        coverImageUrl: "",
      })
    } catch (err: unknown) {
      setError("Error al agregar el libro")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/book", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: id }),
      })
      if (res.ok) {
        setBookList((prev) => prev.filter((b) => b.id !== id))
      } else {
        setError("No se pudo eliminar el libro")
      }
    } catch (err: unknown) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="container px-8 mx-auto py-10 space-y-8">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#D5C2A5] to-[#EADBC8] rounded-2xl border border-[#d4c0a2] shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#B89F84] rounded-xl shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-7 w-7 text-[#F3EEE7]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#4B3C2A] mb-1">Administración de Libros</h2>
                <p className="text-base text-[#7A6A58] font-medium">Agregar y gestionar libros del sistema</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-6 py-3 text-base font-bold text-[#F3EEE7] bg-[#8C735B] rounded-full shadow-md">
                {bookList.length} libros
              </span>
            </div>
          </div>
        </div>

        {/* Formulario para agregar libro (solo admin) */}
        {session?.user?.role === "ADMIN" ? (
          <div className="bg-gradient-to-br from-[#fffaf0] to-[#F3EEE7] border border-[#EADBC8] rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-[#4B3C2A] mb-4">Agregar nuevo libro</h3>
            <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#4B3C2A] mb-2">Título</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  placeholder="Título del libro"
                  required
                  className="w-full px-4 py-3 bg-[#F3EEE7] border border-[#EADBC8] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B89F84] focus:border-[#B89F84] text-[#4B3C2A] placeholder-[#7A6A58]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#4B3C2A] mb-2">Autor</label>
                <input
                  name="author"
                  value={form.author}
                  onChange={handleFormChange}
                  placeholder="Nombre del autor"
                  required
                  className="w-full px-4 py-3 bg-[#F3EEE7] border border-[#EADBC8] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B89F84] focus:border-[#B89F84] text-[#4B3C2A] placeholder-[#7A6A58]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#4B3C2A] mb-2">Género</label>
                <input
                  name="genre"
                  value={form.genre}
                  onChange={handleFormChange}
                  placeholder="Género literario"
                  required
                  className="w-full px-4 py-3 bg-[#F3EEE7] border border-[#EADBC8] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B89F84] focus:border-[#B89F84] text-[#4B3C2A] placeholder-[#7A6A58]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#4B3C2A] mb-2">Año de publicación</label>
                <input
                  name="publicationYear"
                  value={form.publicationYear}
                  onChange={handleFormChange}
                  placeholder="2024"
                  type="number"
                  required
                  className="w-full px-4 py-3 bg-[#F3EEE7] border border-[#EADBC8] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B89F84] focus:border-[#B89F84] text-[#4B3C2A] placeholder-[#7A6A58]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#4B3C2A] mb-2">Copias disponibles</label>
                <input
                  name="availableCopies"
                  value={form.availableCopies}
                  onChange={handleFormChange}
                  placeholder="5"
                  type="number"
                  required
                  className="w-full px-4 py-3 bg-[#F3EEE7] border border-[#EADBC8] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B89F84] focus:border-[#B89F84] text-[#4B3C2A] placeholder-[#7A6A58]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#4B3C2A] mb-2">ISBN</label>
                <input
                  name="isbn"
                  value={form.isbn}
                  onChange={handleFormChange}
                  placeholder="978-0000000000"
                  className="w-full px-4 py-3 bg-[#F3EEE7] border border-[#EADBC8] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B89F84] focus:border-[#B89F84] text-[#4B3C2A] placeholder-[#7A6A58]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#4B3C2A] mb-2">URL de portada</label>
                <input
                  name="coverImageUrl"
                  value={form.coverImageUrl}
                  onChange={handleFormChange}
                  placeholder="https://ejemplo.com/portada.jpg"
                  className="w-full px-4 py-3 bg-[#F3EEE7] border border-[#EADBC8] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B89F84] focus:border-[#B89F84] text-[#4B3C2A] placeholder-[#7A6A58]"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-[#4B3C2A] mb-2">Descripción</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Descripción del libro..."
                  rows={3}
                  className="w-full px-4 py-3 bg-[#F3EEE7] border border-[#EADBC8] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B89F84] focus:border-[#B89F84] text-[#4B3C2A] placeholder-[#7A6A58] resize-none"
                />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 text-sm font-semibold text-[#F3EEE7] bg-[#8C735B] rounded-xl shadow-md hover:bg-[#7A6A58] transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? "Agregando..." : "Agregar libro"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#fffaf0] to-[#F3EEE7] border border-[#EADBC8] rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 text-[#8C735B]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
              <span className="font-semibold">Solo administradores pueden agregar libros.</span>
            </div>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl shadow-lg p-4">
            <div className="flex items-center gap-3 text-red-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
              <span className="font-semibold">{error}</span>
            </div>
          </div>
        )}

        {/* Tabla */}
        <div className="bg-gradient-to-br from-[#fffaf0] to-[#F3EEE7] border border-[#EADBC8] rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-[#D5C2A5] to-[#EADBC8] border-b border-[#d4c0a2]">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-bold text-[#4B3C2A] uppercase tracking-wider">
                      Título
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-bold text-[#4B3C2A] uppercase tracking-wider">
                      Autor
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-bold text-[#4B3C2A] uppercase tracking-wider">
                      Género
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-bold text-[#4B3C2A] uppercase tracking-wider">
                      Año
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-bold text-[#4B3C2A] uppercase tracking-wider">
                      Disponibles
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-bold text-[#4B3C2A] uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gradient-to-br from-[#fffaf0] to-[#F3EEE7] divide-y divide-[#EADBC8]">
                  {bookList.map((book) => (
                    <tr key={book.id} className="hover:bg-[#F3EEE7] transition-colors duration-200">
                      {/* Título */}
                      <td className="py-4 px-6 text-sm text-[#4B3C2A]">
                        <div className="flex items-center gap-3">
                          {book.coverImageUrl && (
                            <img
                              src={book.coverImageUrl}
                              alt={book.title}
                              className="w-10 h-12 object-cover rounded-lg shadow-sm"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-[#4B3C2A] line-clamp-2">{book.title}</p>
                            {book.isbn && (
                              <p className="text-xs text-[#7A6A58] mt-1">ISBN: {book.isbn}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      {/* Autor */}
                      <td className="py-4 px-6 text-sm text-[#4B3C2A] font-medium">
                        {book.author}
                      </td>
                      
                      {/* Género */}
                      <td className="py-4 px-6 text-sm">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#EADBC8] text-[#4B3C2A]">
                          {book.genre}
                        </span>
                      </td>
                      
                      {/* Año */}
                      <td className="py-4 px-6 text-sm text-[#4B3C2A]">
                        {book.publicationYear}
                      </td>
                      
                      {/* Disponibles */}
                      <td className="py-4 px-6 text-sm">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          book.availableCopies > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {book.availableCopies} {book.availableCopies === 1 ? 'copia' : 'copias'}
                        </span>
                      </td>
                      
                      {/* Acciones */}
                      <td className="py-4 px-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/books/${book.id}`}
                            className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-[#B89F84] text-[#F3EEE7] hover:bg-[#8C735B] transition-colors duration-200"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            Editar
                          </Link>
                          
                          {session?.user?.role === "ADMIN" && (
                            <button
                              onClick={() => handleDelete(book.id)}
                              disabled={loading}
                              className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                              Eliminar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BookAdminTable