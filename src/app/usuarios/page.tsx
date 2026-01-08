"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import Link from "next/link"

interface User {
    id: string
    name: string
    email: string
    status: boolean
    createdAt: string
}

export default function UsuariosPage() {
    const { data: session } = useSession()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState<string | null>(null)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/usuarios")
            const data = await res.json()
            setUsers(data)
        } catch (error) {
            console.error("Erro ao carregar usuários:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await fetch(`/api/usuarios/${id}`, { method: "DELETE" })
            setUsers(users.filter(u => u.id !== id))
            setDeleteModal(null)
        } catch (error) {
            console.error("Erro ao excluir:", error)
        }
    }

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await fetch(`/api/usuarios/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: !currentStatus })
            })
            setUsers(users.map(u => u.id === id ? { ...u, status: !currentStatus } : u))
        } catch (error) {
            console.error("Erro ao atualizar status:", error)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="bg-white/5 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">Prefeitura Municipal</h1>
                            <p className="text-sm text-blue-200/60">Sistema de Controle de Pagamentos</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-blue-100 text-sm">Olá, {session?.user?.name}</span>
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Cadastro de Usuários</h2>
                        <p className="text-blue-200/60 mt-1">Gerencie os usuários do sistema</p>
                    </div>
                    <Link
                        href="/usuarios/novo"
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Novo Usuário
                    </Link>
                </div>

                {/* Table */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto"></div>
                            <p className="text-blue-200/60 mt-4">Carregando usuários...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-12 text-center">
                            <svg className="w-16 h-16 text-blue-200/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p className="text-blue-200/60">Nenhum usuário cadastrado</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Nome</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">E-mail</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Criado em</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-blue-200">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-white font-medium">{user.name}</td>
                                        <td className="px-6 py-4 text-blue-100/80">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleStatus(user.id, user.status)}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${user.status
                                                        ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                                                        : "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                                                    }`}
                                            >
                                                {user.status ? "Ativo" : "Inativo"}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-blue-100/60 text-sm">
                                            {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/usuarios/${user.id}`}
                                                    className="p-2 rounded-lg bg-white/10 hover:bg-blue-500/30 text-blue-300 transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteModal(user.id)}
                                                    className="p-2 rounded-lg bg-white/10 hover:bg-red-500/30 text-red-300 transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>

            {/* Delete Modal */}
            {deleteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-2">Confirmar exclusão</h3>
                        <p className="text-blue-200/70 mb-6">Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteModal(null)}
                                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleDelete(deleteModal)}
                                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-all"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
