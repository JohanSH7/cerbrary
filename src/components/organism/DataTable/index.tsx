import React, { useState, useEffect } from "react";
import Row from '@/components/atoms/UserTableRow';
import { updateUserRole, approveUser, rejectUser, toggleUserStatus } from '@/utils/api';
import Link from 'next/link';

interface User {
    id: string;
    name: string;
    email: string;
    status: string;
    role: string;
    deleted: boolean;
    enabled: boolean;
    createdAt: string;
    image: string;
}

interface UserTableRowProps {
    users: User[];
}

const Index = ({ users }: UserTableRowProps) => {
    const [userList, setUserList] = useState(users);

    useEffect(() => {
        setUserList(users);
    }, [users]);

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch('/api/users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: id }),
            });
            if (res.ok) {
                setUserList(prev => prev.filter(u => u.id !== id));
            } else {
                alert('No se pudo eliminar el usuario');
            }
        } catch (error) {
            alert('Error de conexión');
        }
    };

    const handleRoleChange = async (id: string, newRole: string) => {
        try {
            await updateUserRole(id, newRole);
            setUserList(prev =>
                prev.map(u => u.id === id ? { ...u, role: newRole } : u)
            );
        } catch (error) {
            alert('No se pudo actualizar el rol');
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await approveUser(id);
            setUserList(prev =>
                prev.map(u => u.id === id ? { ...u, status: 'APPROVED' } : u)
            );
        } catch (error) {
            alert('No se pudo aprobar el usuario');
        }
    };

    const handleReject = async (id: string) => {
        try {
            await rejectUser(id);
            setUserList(prev =>
                prev.map(u => u.id === id ? { ...u, status: 'REJECTED' } : u)
            );
        } catch (error) {
            alert('No se pudo rechazar el usuario');
        }
    };

    const handleToggleStatus = async (id: string, enabled: boolean) => {
        try {
            await toggleUserStatus(id, enabled);
            setUserList(prev =>
                prev.map(u => u.id === id ? { ...u, enabled } : u)
            );
        } catch (error) {
            alert('No se pudo cambiar el estado del usuario');
        }
    };

    return (
        <section className="container px-8 mx-auto py-10 space-y-8">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-[#D5C2A5] to-[#EADBC8] rounded-2xl border border-[#d4c0a2] shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#B89F84] rounded-xl shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-7 w-7 text-[#F3EEE7]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-[#4B3C2A] mb-1">Gestión de Usuarios</h2>
                            <p className="text-base text-[#7A6A58] font-medium">
                                Administra los usuarios del sistema
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="px-6 py-3 text-base font-bold text-[#F3EEE7] bg-[#8C735B] rounded-full shadow-md">
                            {userList.length} usuarios
                        </span>
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-gradient-to-br from-[#fffaf0] to-[#F3EEE7] border border-[#EADBC8] rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full">
                            <thead className="bg-gradient-to-r from-[#D5C2A5] to-[#EADBC8] border-b border-[#d4c0a2]">
                                <tr>
                                    <th className="py-4 px-6 text-left text-sm font-bold text-[#4B3C2A] uppercase tracking-wider">
                                        Usuario
                                    </th>
                                    <th className="py-4 px-6 text-left text-sm font-bold text-[#4B3C2A] uppercase tracking-wider">
                                        Estado Sistema
                                    </th>
                                    <th className="py-4 px-6 text-left text-sm font-bold text-[#4B3C2A] uppercase tracking-wider">
                                        Rol
                                    </th>
                                    <th className="py-4 px-6 text-left text-sm font-bold text-[#4B3C2A] uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="py-4 px-6 text-left text-sm font-bold text-[#4B3C2A] uppercase tracking-wider">
                                        Estado Aprobación
                                    </th>
                                    <th className="py-4 px-6 text-left text-sm font-bold text-[#4B3C2A] uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-gradient-to-br from-[#fffaf0] to-[#F3EEE7] divide-y divide-[#EADBC8]">
                                {userList.map((user) => (
                                    <Row
                                        key={user.id}
                                        user={user}
                                        onDelete={handleDelete}
                                        onRoleChange={handleRoleChange}
                                        onApprove={handleApprove}
                                        onReject={handleReject}
                                        onToggleStatus={handleToggleStatus}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Paginación */}
            <div className="flex items-center justify-between">
                                    <Link
                                href="/dashboard"
                                className="flex items-center px-6 py-3 text-sm font-semibold text-[#4B3C2A] bg-gradient-to-r from-[#fffaf0] to-[#F3EEE7] border border-[#EADBC8] rounded-xl shadow-md hover:shadow-lg hover:from-[#F3EEE7] hover:to-[#EADBC8] hover:border-[#D5C2A5] transition-all duration-300 gap-x-2"
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                                </svg>
                                <span>Regresar al Dashboard</span>
                                </Link>

                <div className="items-center hidden lg:flex gap-x-2">
                    <a href="#" className="px-4 py-2 text-sm font-semibold text-[#F3EEE7] bg-[#8C735B] rounded-xl shadow-md hover:bg-[#7A6A58] transition-all duration-200">
                        1
                    </a>
                    <a href="#" className="px-4 py-2 text-sm font-semibold text-[#4B3C2A] bg-gradient-to-r from-[#fffaf0] to-[#F3EEE7] border border-[#EADBC8] rounded-xl shadow-md hover:shadow-lg hover:from-[#F3EEE7] hover:to-[#EADBC8] hover:border-[#D5C2A5] transition-all duration-300">
                        2
                    </a>
                    <a href="#" className="px-4 py-2 text-sm font-semibold text-[#4B3C2A] bg-gradient-to-r from-[#fffaf0] to-[#F3EEE7] border border-[#EADBC8] rounded-xl shadow-md hover:shadow-lg hover:from-[#F3EEE7] hover:to-[#EADBC8] hover:border-[#D5C2A5] transition-all duration-300">
                        3
                    </a>
                    <span className="px-4 py-2 text-sm font-semibold text-[#7A6A58]">...</span>
                    <a href="#" className="px-4 py-2 text-sm font-semibold text-[#4B3C2A] bg-gradient-to-r from-[#fffaf0] to-[#F3EEE7] border border-[#EADBC8] rounded-xl shadow-md hover:shadow-lg hover:from-[#F3EEE7] hover:to-[#EADBC8] hover:border-[#D5C2A5] transition-all duration-300">
                        12
                    </a>
                    <a href="#" className="px-4 py-2 text-sm font-semibold text-[#4B3C2A] bg-gradient-to-r from-[#fffaf0] to-[#F3EEE7] border border-[#EADBC8] rounded-xl shadow-md hover:shadow-lg hover:from-[#F3EEE7] hover:to-[#EADBC8] hover:border-[#D5C2A5] transition-all duration-300">
                        13
                    </a>
                    <a href="#" className="px-4 py-2 text-sm font-semibold text-[#4B3C2A] bg-gradient-to-r from-[#fffaf0] to-[#F3EEE7] border border-[#EADBC8] rounded-xl shadow-md hover:shadow-lg hover:from-[#F3EEE7] hover:to-[#EADBC8] hover:border-[#D5C2A5] transition-all duration-300">
                        14
                    </a>
                </div>

                <a href="#" className="flex items-center px-6 py-3 text-sm font-semibold text-[#4B3C2A] bg-gradient-to-r from-[#fffaf0] to-[#F3EEE7] border border-[#EADBC8] rounded-xl shadow-md hover:shadow-lg hover:from-[#F3EEE7] hover:to-[#EADBC8] hover:border-[#D5C2A5] transition-all duration-300 gap-x-2">
                    <span>Siguiente</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                    </svg>
                </a>
            </div>
        </section>
    );
}

export default Index;