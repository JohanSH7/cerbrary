import React from "react";

interface UserTableRowProps {
    user: {
        id: string;
        name: string;
        email: string;
        status: string;
        role: string;
        deleted: boolean;
        enabled: boolean;
        createdAt: string;
        image?: string;
    };
    onDelete: (id: string) => void;
    onRoleChange: (id: string, newRole: string) => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    onToggleStatus: (id: string, enabled: boolean) => void;
}

const Index = ({ user, onDelete, onRoleChange, onApprove, onReject, onToggleStatus }: UserTableRowProps) => {
    
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return 'bg-emerald-100/60 text-emerald-500';
            case 'PENDING':
                return 'bg-yellow-100/60 text-yellow-500';
            case 'REJECTED':
                return 'bg-red-100/60 text-red-500';
            default:
                return 'bg-gray-100/60 text-gray-500';
        }
    };

    return (
        <tr key={user.id}>
            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                <div className="inline-flex items-center gap-x-3">
                    <input type="checkbox" className="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700" />
                    <div className="flex items-center gap-x-2">
                        <img className="object-cover w-10 h-10 rounded-full" src={user.image || "https://via.placeholder.com/40"} alt={user.name} />
                        <div>
                            <h2 className="font-medium text-gray-800 dark:text-white">{user.name}</h2>
                            <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
  @{user.email ? user.email.split("@")[0] : "desconocido"}
</p>
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                <div className="flex items-center gap-x-2">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full gap-x-2 ${user.enabled ? "bg-emerald-100/60 dark:bg-gray-800" : "bg-red-100/60 dark:bg-gray-800"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${user.enabled ? "bg-emerald-500" : "bg-red-500"}`}></span>
                        <h2 className={`text-sm font-normal ${user.enabled ? "text-emerald-500" : "text-red-500"}`}>{user.enabled ? "Activo" : "Inactivo"}</h2>
                    </div>
                    <button
                        onClick={() => onToggleStatus(user.id, !user.enabled)}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        title={user.enabled ? "Desactivar usuario" : "Activar usuario"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </button>
                </div>
            </td>
            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                <select
                    value={user.role}
                    onChange={e => onRoleChange(user.id, e.target.value)}
                    className="border rounded px-2 py-1 bg-white dark:bg-gray-800"
                >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                    {/* Agrega más roles si los tienes */}
                </select>
            </td>
            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{user.email}</td>
            <td className="px-4 py-4 text-sm whitespace-nowrap">
                <div className="flex items-center gap-x-2">
                    <p className={`px-3 py-1 text-xs rounded-full dark:bg-gray-800 ${getStatusColor(user.status)}`}>
                        {user.status}
                    </p>
                    {user.status === 'PENDING' && (
                        <div className="flex gap-x-1">
                            <button
                                onClick={() => onApprove(user.id)}
                                className="text-emerald-500 hover:text-emerald-600 focus:outline-none"
                                title="Aprobar usuario"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </button>
                            <button
                                onClick={() => onReject(user.id)}
                                className="text-red-500 hover:text-red-600 focus:outline-none"
                                title="Rechazar usuario"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </td>
            <td className="px-4 py-4 text-sm whitespace-nowrap">
                <div className="flex items-center gap-x-6">
                    <button
                        className="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none"
                        onClick={() => onDelete(user.id)}
                    >
                        {/* Icono eliminar */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                    <button className="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none">
                        {/* Icono editar */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default Index;