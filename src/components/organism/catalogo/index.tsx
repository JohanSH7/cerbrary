"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { getBooks, searchBooks, createTransaction } from "@/utils/api"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, BookOpen, User, Calendar, Hash, Eye, Heart, AlertCircle } from "lucide-react"

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

interface CatalogoProps {
  initialBooks?: Book[]
}

const ImprovedCatalog = ({ initialBooks = [] }: CatalogoProps) => {
  const { data: session } = useSession()
  const [books, setBooks] = useState<Book[]>(initialBooks)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loanLoading, setLoanLoading] = useState(false)

  // Filtros
  const [searchTitle, setSearchTitle] = useState("")
  const [searchAuthor, setSearchAuthor] = useState("")
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [loanMessage, setLoanMessage] = useState("")

  // Cargar libros iniciales
  useEffect(() => {
    if (initialBooks.length === 0) {
      loadAllBooks()
    }
  }, [initialBooks])

  const loadAllBooks = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getBooks()
      setBooks(result)
    } catch (error) {
      console.error("Error loading books:", error)
      setError("Error al cargar los libros")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      let result: Book[] = []

      if (searchTitle && searchAuthor) {
        const titleResults = await searchBooks(searchTitle)
        result = titleResults.filter((book: Book) => book.author.toLowerCase().includes(searchAuthor.toLowerCase()))
      } else if (searchTitle) {
        result = await searchBooks(searchTitle)
      } else if (searchAuthor) {
        result = await searchBooks(searchAuthor)
      } else {
        result = await getBooks()
      }

      setBooks(result)
    } catch (error) {
      console.error("Error searching books:", error)
      setError("Error al buscar libros")
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setSearchTitle("")
    setSearchAuthor("")
    loadAllBooks()
  }

  const openBookDetails = (book: Book) => {
    setSelectedBook(book)
    setShowDetails(true)
  }

  const closeBookDetails = () => {
    setSelectedBook(null)
    setShowDetails(false)
  }

  const handleLoanBook = async (bookId: string) => {
    if (!session) {
      setLoanMessage("Debes iniciar sesión para pedir un préstamo")
      setShowErrorDialog(true)
      return
    }

    setLoanLoading(true)
    setError(null)

    try {
      const userId = session.user.id
      const result = await createTransaction(bookId, userId)

      // Actualizar el libro en el estado local
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === bookId
            ? { ...book, availableCopies: book.availableCopies - 1 }
            : book
        )
      )

      // Actualizar el libro seleccionado si es el mismo
      if (selectedBook?.id === bookId) {
        setSelectedBook((prev) =>
          prev ? { ...prev, availableCopies: prev.availableCopies - 1 } : null
        )
      }

      setLoanMessage("Se encontraron copias del libro disponibles, Préstamo obtenido exitosamente.")
      setShowSuccessDialog(true)
    } catch (error: unknown) {
      console.error("Error creating loan:", error)
      let errorMessage = "Error al procesar el préstamo"

      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === "string") {
        errorMessage = error
      }

      setLoanMessage(errorMessage)
      setShowErrorDialog(true)
    } finally {
      setLoanLoading(false)
    }
  }

  const BookCard = ({ book }: { book: Book }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 ease-out border border-[#EADBC8] bg-gradient-to-br from-[#fffaf0] to-[#F3EEE7] backdrop-blur-sm hover:scale-[1.02] hover:shadow-xl hover:border-[#D5C2A5] rounded-2xl overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex justify-center mb-4">
          <div className="relative overflow-hidden rounded-xl shadow-md ring-1 ring-[#EADBC8] group-hover:shadow-lg group-hover:ring-[#D5C2A5] transition-all duration-300">
            <Image
              src={book.coverImageUrl || "/placeholder.svg?height=200&width=150"}
              alt={book.title}
              width={150}
              height={200}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#4B3C2A]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
        <CardTitle className="text-lg font-bold text-[#4B3C2A] line-clamp-2 group-hover:text-[#7A6A58] transition-colors duration-200 leading-tight min-h-[3.5rem]">
          {book.title}
        </CardTitle>
        <CardDescription className="text-sm text-[#7A6A58] font-medium line-clamp-1">
          {book.author}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 flex-grow">
        <div className="flex items-center justify-between">
          <Badge className="bg-[#D5C2A5] text-[#4B3C2A] hover:bg-[#B89F84] font-semibold px-3 py-1 rounded-full border-0 text-xs">
            {book.genre}
          </Badge>
          <div className="flex items-center gap-1.5 text-sm text-[#7A6A58] font-medium">
            <Calendar className="h-3.5 w-3.5" />
            {book.publicationYear}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge
            className={`font-semibold px-3 py-1 rounded-full border-0 text-xs ${book.availableCopies > 0 
              ? "bg-[#B89F84] text-white" 
              : "bg-[#8C735B] text-[#F3EEE7]"
            }`}
          >
            {book.availableCopies} disponibles
          </Badge>
          {book.isbn && (
            <div className="flex items-center gap-1.5 text-xs text-[#7A6A58] font-medium">
              <Hash className="h-3.5 w-3.5" />
              {book.isbn.slice(-4)}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-4 flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => openBookDetails(book)}
          className="w-full border-[#EADBC8] bg-[#fffaf0] hover:bg-[#F3EEE7] hover:border-[#D5C2A5] text-[#4B3C2A] font-semibold rounded-xl transition-all duration-200"
        >
          <Eye className="h-4 w-4 mr-2" />
          Ver detalles
        </Button>
        {book.availableCopies > 0 && (
          <Button
            size="sm"
            onClick={() => handleLoanBook(book.id)}
            disabled={loanLoading}
            className="w-full bg-[#8C735B] hover:bg-[#7A6A58] text-[#F3EEE7] font-semibold shadow-md hover:shadow-lg transition-all duration-300 rounded-xl"
          >
            <Heart className="h-4 w-4 mr-2" />
            {loanLoading ? "Reservando..." : "Reservar"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )

  const BookSkeleton = () => (
    <Card className="border border-[#EADBC8] bg-gradient-to-br from-[#fffaf0] to-[#F3EEE7] rounded-2xl h-full flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex justify-center mb-4">
          <Skeleton className="h-[200px] w-[150px] rounded-xl bg-[#EADBC8]" />
        </div>
        <Skeleton className="h-6 w-full rounded-lg bg-[#EADBC8]" />
        <Skeleton className="h-5 w-3/4 rounded-lg bg-[#EADBC8]" />
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        <div className="flex justify-between">
          <Skeleton className="h-6 w-20 rounded-full bg-[#EADBC8]" />
          <Skeleton className="h-5 w-16 rounded-lg bg-[#EADBC8]" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-6 w-24 rounded-full bg-[#EADBC8]" />
          <Skeleton className="h-5 w-20 rounded-lg bg-[#EADBC8]" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 flex-shrink-0">
        <Skeleton className="h-9 w-full rounded-xl bg-[#EADBC8]" />
        <Skeleton className="h-9 w-full rounded-xl bg-[#EADBC8]" />
      </CardFooter>
    </Card>
  )

  return (
    <div className="container mx-auto px-8 py-10 space-y-8">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-[#D5C2A5] to-[#EADBC8] rounded-2xl border border-[#d4c0a2] shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#B89F84] rounded-xl shadow-md">
              <BookOpen className="h-7 w-7 text-[#F3EEE7]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#4B3C2A] mb-1">Catálogo de Libros</h1>
              <p className="text-base text-[#7A6A58] font-medium">
                Descubre nuestra colección de <span className="text-[#4B3C2A] font-semibold">{books.length}</span> libros
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros de búsqueda */}
      <Card className="border border-[#EADBC8] bg-gradient-to-br from-[#fffaf0] to-[#F3EEE7] backdrop-blur-sm rounded-2xl shadow-lg">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#8C735B]" />
                <Input
                  type="text"
                  placeholder="Buscar por título..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="pl-12 pr-4 py-3 border-[#EADBC8] bg-[#fffaf0] backdrop-blur-sm rounded-xl shadow-sm focus:shadow-md focus:ring-2 focus:ring-[#D5C2A5] focus:border-[#D5C2A5] text-[#4B3C2A] font-medium transition-all duration-200"
                />
              </div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#8C735B]" />
                <Input
                  type="text"
                  placeholder="Buscar por autor..."
                  value={searchAuthor}
                  onChange={(e) => setSearchAuthor(e.target.value)}
                  className="pl-12 pr-4 py-3 border-[#EADBC8] bg-[#fffaf0] backdrop-blur-sm rounded-xl shadow-sm focus:shadow-md focus:ring-2 focus:ring-[#D5C2A5] focus:border-[#D5C2A5] text-[#4B3C2A] font-medium transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#8C735B] hover:bg-[#7A6A58] text-[#F3EEE7] font-bold py-3 px-6 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl"
              >
                {loading ? "Buscando..." : "Buscar"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={clearFilters}
                className="border-[#EADBC8] bg-[#fffaf0] hover:bg-[#F3EEE7] hover:border-[#D5C2A5] text-[#4B3C2A] font-semibold py-3 px-6 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
              >
                Limpiar filtros
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert className="border border-red-300 bg-gradient-to-r from-red-50 to-red-100 rounded-xl shadow-md">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800 font-medium">{error}</AlertDescription>
        </Alert>
      )}

      {/* Grid de libros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => <BookSkeleton key={index} />)
        ) : books.length === 0 ? (
          <div className="col-span-full">
            <Card className="border border-[#EADBC8] bg-gradient-to-br from-[#fffaf0] to-[#F3EEE7] rounded-2xl shadow-lg">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <BookOpen className="h-16 w-16 text-[#D5C2A5] mb-6" />
                <p className="text-xl text-[#7A6A58] font-medium">No se encontraron libros</p>
                <p className="text-base text-[#7A6A58] mt-2 opacity-70">Intenta con otros términos de búsqueda</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          books.map((book) => <BookCard key={book.id} book={book} />)
        )}
      </div>

     {/* Modal de detalles */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border border-[#EADBC8] bg-gradient-to-br from-[#fffaf0] to-[#F3EEE7] rounded-2xl shadow-2xl">
          {selectedBook && (
            <>
              <DialogHeader className="pb-6">
                <DialogTitle className="text-2xl font-bold text-[#4B3C2A]">Detalles del Libro</DialogTitle>
                <DialogDescription className="text-base text-[#7A6A58] font-medium">
                  Información completa sobre el libro seleccionado
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                <div className="md:col-span-1">
                  <div className="sticky top-0">
                    <Image
                      src={selectedBook.coverImageUrl || "/placeholder.svg?height=400&width=300"}
                      alt={selectedBook.title}
                      width={300}
                      height={400}
                      className="w-full h-auto rounded-xl shadow-lg ring-1 ring-[#EADBC8]"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold text-[#4B3C2A] mb-2 leading-tight">{selectedBook.title}</h3>
                    <p className="text-xl text-[#7A6A58] font-semibold mb-4">por {selectedBook.author}</p>
                  </div>

                  <div className="flex flex-wrap gap-6">
                    <div className="space-y-2 flex-shrink-0">
                      <span className="text-sm font-semibold text-[#7A6A58] uppercase tracking-wide">Género</span>
                      <div>
                        <Badge className="bg-[#D5C2A5] text-[#4B3C2A] font-bold px-4 py-2 rounded-full text-sm whitespace-nowrap">
                          {selectedBook.genre}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2 flex-shrink-0">
                      <span className="text-sm font-semibold text-[#7A6A58] uppercase tracking-wide">Año de publicación</span>
                      <p className="text-[#4B3C2A] font-bold text-lg">{selectedBook.publicationYear}</p>
                    </div>
                    <div className="space-y-2 flex-shrink-0">
                      <span className="text-sm font-semibold text-[#7A6A58] uppercase tracking-wide">ISBN</span>
                      <p className="text-[#4B3C2A] font-bold text-lg">{selectedBook.isbn || "No disponible"}</p>
                    </div>
                    <div className="space-y-2 flex-shrink-0">
                     
                      <Badge
                        className={`font-bold px-4 py-2 rounded-full text-sm whitespace-nowrap ${selectedBook.availableCopies > 0 
                          ? "bg-[#B89F84] text-white" 
                          : "bg-[#8C735B] text-[#F3EEE7]"
                        }`}
                      >Copias disponibles: {selectedBook.availableCopies} 
                      </Badge>
                    </div>
                  </div>

                  {selectedBook.description && (
                    <div className="space-y-3">
                      <span className="text-sm font-semibold text-[#7A6A58] uppercase tracking-wide">Descripción</span>
                      <p className="text-[#4B3C2A] leading-relaxed text-base font-medium">{selectedBook.description}</p>
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter className="flex gap-4 pt-6">
                <Button
                  variant="outline"
                  onClick={closeBookDetails}
                  className="border-[#EADBC8] bg-[#fffaf0] hover:bg-[#F3EEE7] hover:border-[#D5C2A5] text-[#4B3C2A] font-semibold py-3 px-6 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
                >
                  Cerrar
                </Button>
                {selectedBook.availableCopies > 0 && (
                  <Button
                    onClick={() => handleLoanBook(selectedBook.id)}
                    disabled={loanLoading}
                    className="bg-[#8C735B] hover:bg-[#7A6A58] text-[#F3EEE7] font-bold py-3 px-6 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl"
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    {loanLoading ? "Reservando..." : "Reservar libro"}
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Éxito */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md border border-[#D5C2A5] bg-[#fffaf0] rounded-2xl shadow-2xl text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#4B3C2A]">¡Éxito!</DialogTitle>
            <DialogDescription className="text-[#7A6A58] font-medium">{loanMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="bg-[#8C735B] hover:bg-[#7A6A58] text-[#F3EEE7] font-semibold px-6 py-2 rounded-xl"
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Error */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="max-w-md border border-red-200 bg-red-50 rounded-2xl shadow-2xl text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-700">Ocurrió un error</DialogTitle>
            <DialogDescription className="text-red-800 font-medium">{loanMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setShowErrorDialog(false)}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-xl"
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ImprovedCatalog