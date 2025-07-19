import { useEffect, useState } from "react"
import { GetServerSideProps } from "next"
import { withPageAuth } from "@/hooks/withPageAuth"
import { getUserTransactions } from "@/utils/api"
import TransactionDataTable from "@/components/organism/transactionsTable/index"
import { DashboardLayout } from "@/components/templates/dashboardLayout"

const TransactionIndex = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getUserTransactions()
        setTransactions(data)
      } catch (error) {
        setError("Error al cargar las transacciones")
        console.error("Error fetching transactions:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [])

  console.log("transactions :>> ", transactions)

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
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c0 .621.504 1.125 1.125 1.125H18a2.25 2.25 0 002.25-2.25V9.375c0-.621-.504-1.125-1.125-1.125H15M8.25 8.25V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.124-.08M15 8.25H9.75a1.125 1.125 0 00-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h5.25c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#4B3C2A] mb-1">Gestión de Transacciones</h2>
                <p className="text-base text-[#7A6A58] font-medium">Administra préstamos y devoluciones de libros</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-6 py-3 text-base font-bold text-[#F3EEE7] bg-[#8C735B] rounded-full shadow-md">
                {transactions.length} transacciones
              </span>
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
              <span className="font-semibold">Cargando transacciones...</span>
            </div>
          </div>
        )}

        {/* Tabla de transacciones */}
        {!loading && <TransactionDataTable transactions={transactions} />}
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

export default TransactionIndex
