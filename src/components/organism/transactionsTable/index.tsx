"use client"
import { useState, useEffect } from "react"
import Row from "@/components/atoms/TransactionTableRow"
import { updateTransaction } from "@/utils/api"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Transaction {
  id: string
  bookTitle: string
  userName: string
  status: string
  createdAt: string
  returnDate?: string
}

interface TransactionTableProps {
  transactions: Transaction[]
}

const Index = ({ transactions }: TransactionTableProps) => {
  const [transactionList, setTransactionList] = useState(transactions)
  const [currentPage, setCurrentPage] = useState(1)
  const transactionsPerPage = 6 // Mostrar un máximo de 6 transacciones por página

  useEffect(() => {
    setTransactionList(transactions)
    setCurrentPage(1) // Resetear a la primera página cuando las transacciones cambian
  }, [transactions])

  const handleUpdateStatus = async (id: string, newStatus: string, returnDate?: string) => {
    try {
      await updateTransaction(id, newStatus, returnDate)
      setTransactionList((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus, returnDate } : t)))
    } catch (error) {
      alert("No se pudo actualizar el estado de la transacción")
    }
  }

  // Lógica de paginación
  const indexOfLastTransaction = currentPage * transactionsPerPage
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage
  const currentTransactions = transactionList.slice(indexOfFirstTransaction, indexOfLastTransaction)

  const totalPages = Math.ceil(transactionList.length / transactionsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <section className="container px-4 mx-auto">
      <div className="flex items-center gap-x-3">
        <h2 className="text-lg font-medium text-[#4B3C2A]">Gestión de Transacciones</h2>
        <span className="px-3 py-1 text-xs text-[#F3EEE7] bg-[#8C735B] rounded-full">
          {transactionList.length} transacciones
        </span>
      </div>

      <div className="flex flex-col mt-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-[#EADBC8] md:rounded-lg">
              <table className="min-w-full divide-y divide-[#EADBC8]">
                <thead className="bg-[#F3EEE7]">
                  <tr>
                    <th className="py-3.5 px-4 text-sm font-normal text-left text-[#7A6A58]">
                      <span>Libro</span>
                    </th>
                    <th className="px-12 py-3.5 text-sm font-normal text-left text-[#7A6A58]">
                      <span>Usuario</span>
                    </th>
                    <th className="px-4 py-3.5 text-sm font-normal text-left text-[#7A6A58]">
                      <span>Estado</span>
                    </th>
                    <th className="px-4 py-3.5 text-sm font-normal text-left text-[#7A6A58]">
                      <span>Fecha de Préstamo</span>
                    </th>
                    <th className="px-4 py-3.5 text-sm font-normal text-left text-[#7A6A58]">
                      <span>Fecha de Devolución</span>
                    </th>
                    <th className="px-4 py-3.5 text-sm font-normal text-left text-[#7A6A58]">
                      <span>Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#fffaf0] divide-y divide-[#EADBC8]">
                  {currentTransactions.map((transaction) => (
                    <Row key={transaction.id} transaction={transaction} onUpdateStatus={handleUpdateStatus} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Paginación */}
      {transactionList.length > transactionsPerPage && (
        <div className="flex items-center justify-between mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) paginate(currentPage - 1)
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === currentPage}
                    onClick={(e) => {
                      e.preventDefault()
                      paginate(page)
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages) paginate(currentPage + 1)
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </section>
  )
}

export default Index
