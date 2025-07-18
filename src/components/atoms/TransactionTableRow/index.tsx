import React from "react";

interface Transaction {
    id: string;
    bookTitle: string;
    userName: string;
    status: string;
    createdAt: string;
    returnDate?: string;
}

interface TransactionTableRowProps {
    transaction: Transaction;
    onUpdateStatus: (id: string, newStatus: string, returnDate?: string) => void;
}

const Index = ({ transaction, onUpdateStatus }: TransactionTableRowProps) => {
    const handleStatusChange = (newStatus: string) => {
        const returnDate = newStatus === "COMPLETED" ? new Date().toISOString() : undefined;
        console.log("Updating status:", { id: transaction.id, newStatus, returnDate });
        onUpdateStatus(transaction.id, newStatus, returnDate);
    };

    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap dark:text-gray-200">
                {transaction.bookTitle}
            </td>
            <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">
                {transaction.userName}
            </td>
            <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">
                <span
                    className={`px-2 py-1 text-xs rounded-full ${
                        transaction.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : transaction.status === "APPROVED"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                >
                    {transaction.status}
                </span>
            </td>
            <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">
                {new Date(transaction.createdAt).toLocaleDateString()}
            </td>
            <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">
                {transaction.returnDate
                    ? new Date(transaction.returnDate).toLocaleDateString()
                    : "No devuelto"}
            </td>
            <td className="px-4 py-4 text-sm whitespace-nowrap">
                <div className="flex items-center gap-2">
                    {transaction.status !== "COMPLETED" && (
                        <button
                            onClick={() => handleStatusChange("COMPLETED")}
                            className="px-3 py-1 text-sm font-medium text-white transition-colors duration-200 bg-green-500 rounded-lg hover:bg-green-400 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-50"
                        >
                            Marcar como Devuelto
                        </button>
                    )}
                    {transaction.status === "ACTIVE" && (
                        <button
                            onClick={() => handleStatusChange("CANCELLED")}
                            className="px-3 py-1 text-sm font-medium text-white transition-colors duration-200 bg-red-500 rounded-lg hover:bg-red-400 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-50"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default Index;