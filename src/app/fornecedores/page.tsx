"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface Fornecedor {
    id: string
    razaoSocial: string
    nomeFantasia: string | null
    cnpj: string
    telefone: string | null
    email: string | null
    status: boolean
}

export default function FornecedoresPage() {
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
    const [loading, setLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState<string | null>(null)

    useEffect(() => {
        fetchFornecedores()
    }, [])

    const fetchFornecedores = async () => {
        try {
            const res = await fetch("/api/fornecedores")
            const data = await res.json()
            setFornecedores(data)
        } catch (error) {
            console.error("Erro ao carregar fornecedores:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await fetch(`/api/fornecedores/${id}`, { method: "DELETE" })
            setFornecedores(fornecedores.filter(f => f.id !== id))
            setDeleteModal(null)
        } catch (error) {
            console.error("Erro ao excluir:", error)
        }
    }

    const formatCNPJ = (cnpj: string) => {
        return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Fornecedores</h1>
                    <p className="text-blue-200/60 mt-1">Gerencie os fornecedores cadastrados</p>
                </div>
                <Link
                    href="/fornecedores/novo"
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Novo Fornecedor
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-blue-200/60 mt-4">Carregando...</p>
                    </div>
                ) : fornecedores.length === 0 ? (
                    <div className="p-12 text-center">
                        <svg className="w-16 h-16 text-blue-200/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <p className="text-blue-200/60">Nenhum fornecedor cadastrado</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Razão Social</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">CNPJ</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Telefone</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Status</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-blue-200">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fornecedores.map((fornecedor) => (
                                <tr key={fornecedor.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-white font-medium">{fornecedor.razaoSocial}</p>
                                        {fornecedor.nomeFantasia && (
                                            <p className="text-sm text-blue-200/60">{fornecedor.nomeFantasia}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-blue-100/80 font-mono text-sm">
                                        {formatCNPJ(fornecedor.cnpj)}
                                    </td>
                                    <td className="px-6 py-4 text-blue-100/80">
                                        {fornecedor.telefone || "-"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${fornecedor.status
                                                ? "bg-emerald-500/20 text-emerald-300"
                                                : "bg-red-500/20 text-red-300"
                                            }`}>
                                            {fornecedor.status ? "Ativo" : "Inativo"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/fornecedores/${fornecedor.id}`}
                                                className="p-2 rounded-lg bg-white/10 hover:bg-blue-500/30 text-blue-300 transition-all"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => setDeleteModal(fornecedor.id)}
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

            {/* Delete Modal */}
            {deleteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-2">Confirmar exclusão</h3>
                        <p className="text-blue-200/70 mb-6">Tem certeza que deseja excluir este fornecedor?</p>
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
