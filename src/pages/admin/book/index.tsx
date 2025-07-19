import type React from "react"
import { useEffect, useState } from "react"
import { GetServerSideProps } from "next"
import { withPageAuth } from "@/hooks/withPageAuth"
import { getBooks, searchBooks, filterBooksByAuthor, filterBooksByYear } from "@/utils/api"
import BookDataTable from "@/components/organism/BooksTable/index"
import { DashboardLayout } from "@/components/templates/dashboardLayout"


const BookIndex = () => {
  const [books, setBooks] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAuthor, setFilterAuthor] = useState("")
  const [filterYear, setFilterYear] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar todos los libros al inicio
  useEffect(() => {
    fetchAllBooks()
  }, [])

  const fetchAllBooks = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getBooks()
      setBooks(data)
    } catch (error) {
      setError("Error al cargar los libros")
      console.error("Error fetching books:", error)
    } finally {
      setLoading(false)
    }
  }

  // Buscar por título, autor o género
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await searchBooks(searchQuery)
      setBooks(data)
    } catch (error) {
      setError("Error al buscar libros")
      console.error("Error searching books:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar por autor
  const handleFilterAuthor = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await filterBooksByAuthor(filterAuthor)
      setBooks(data)
    } catch (error) {
      setError("Error al filtrar por autor")
      console.error("Error filtering books by author:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar por año
  const handleFilterYear = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await filterBooksByYear(Number(filterYear))
      setBooks(data)
    } catch (error) {
      setError("Error al filtrar por año")
      console.error("Error filtering books by year:", error)
    } finally {
      setLoading(false)
    }
  }

  // Limpiar todos los filtros
  const handleClearFilters = () => {
    setSearchQuery("")
    setFilterAuthor("")
    setFilterYear("")
    fetchAllBooks()
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
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
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#4B3C2A] mb-1">Catálogo de Libros</h2>
                <p className="text-base text-[#7A6A58] font-medium">Busca y filtra libros en la biblioteca</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-6 py-3 text-base font-bold text-[#F3EEE7] bg-[#8C735B] rounded-full shadow-md">
                {books.length} libros
              </span>
            </div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-gradient-to-br from-[#fffaf0] to-[#F3EEE7] border border-[#EADBC8] rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-[#4B3C2A] mb-6">Buscar y filtrar libros</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Búsqueda general */}
            <div className="space-y-4">
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#4B3C2A] mb-2">Búsqueda general</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Buscar por título, autor o género"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 px-4 py-3 bg-[#F3EEE7] border border-[#EADBC8] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B89F84] focus:border-[#B89F84] text-[#4B3C2A] placeholder-[#7A6A58]"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 text-sm font-semibold text-[#F3EEE7] bg-[#8C735B] rounded-xl shadow-md hover:bg-[#7A6A58] transition-all duration-200 disabled:opacity-50"
                    >
                      {loading ? "Buscando..." : "Buscar"}
                    </button>
                  </div>
                </div>
              </form>

              {/* Filtro por autor */}
              <form onSubmit={handleFilterAuthor} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#4B3C2A] mb-2">Filtrar por autor</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Nombre del autor"
                      value={filterAuthor}
                      onChange={(e) => setFilterAuthor(e.target.value)}
                      className="flex-1 px-4 py-3 bg-[#F3EEE7] border border-[#EADBC8] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B89F84] focus:border-[#B89F84] text-[#4B3C2A] placeholder-[#7A6A58]"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 text-sm font-semibold text-[#F3EEE7] bg-[#8C735B] rounded-xl shadow-md hover:bg-[#7A6A58] transition-all duration-200 disabled:opacity-50"
                    >
                      Filtrar
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Filtros específicos */}
            <div className="space-y-4">
              {/* Filtro por año */}
              <form onSubmit={handleFilterYear} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#4B3C2A] mb-2">
                    Filtrar por año de publicación
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="Año (ej: 2024)"
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                      className="flex-1 px-4 py-3 bg-[#F3EEE7] border border-[#EADBC8] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B89F84] focus:border-[#B89F84] text-[#4B3C2A] placeholder-[#7A6A58]"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 text-sm font-semibold text-[#F3EEE7] bg-[#8C735B] rounded-xl shadow-md hover:bg-[#7A6A58] transition-all duration-200 disabled:opacity-50"
                    >
                      Filtrar
                    </button>
                  </div>
                </div>
              </form>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleClearFilters}
                  disabled={loading}
                  className="flex-1 px-4 py-3 text-sm font-semibold text-[#4B3C2A] bg-gradient-to-r from-[#fffaf0] to-[#F3EEE7] border border-[#EADBC8] rounded-xl shadow-md hover:shadow-lg hover:from-[#F3EEE7] hover:to-[#EADBC8] hover:border-[#D5C2A5] transition-all duration-300 disabled:opacity-50"
                >
                  Limpiar filtros
                </button>
                <button
                  onClick={fetchAllBooks}
                  disabled={loading}
                  className="flex-1 px-4 py-3 text-sm font-semibold text-[#4B3C2A] bg-gradient-to-r from-[#fffaf0] to-[#F3EEE7] border border-[#EADBC8] rounded-xl shadow-md hover:shadow-lg hover:from-[#F3EEE7] hover:to-[#EADBC8] hover:border-[#D5C2A5] transition-all duration-300 disabled:opacity-50"
                >
                  Mostrar todos
                </button>
              </div>
            </div>
          </div>
        </div>

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

        {/* Indicador de carga */}
        {loading && (
          <div className="bg-gradient-to-br from-[#fffaf0] to-[#F3EEE7] border border-[#EADBC8] rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-center gap-3 text-[#8C735B]">
              <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="font-semibold">Cargando libros...</span>
            </div>
          </div>
        )}

        {/* Tabla de libros */}
        <BookDataTable books={books} />

       
      </div>
    </DashboardLayout>
  )
}

export const getServerSideProps: GetServerSideProps = withPageAuth(
  async () => {
    return {
      props: {},
    }
  },
  { allowedRoles: ["ADMIN"] }
)

export default BookIndex
