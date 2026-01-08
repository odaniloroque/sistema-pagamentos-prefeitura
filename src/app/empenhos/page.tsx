"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface Empenho {
    id: string
    numero: string
    descricao: string
    valor: number
    status: string
    dataEmissao: string
    fornecedor: { razaoSocial: string }
    contrato: { numero: string } | null
}

const statusColors: Record<string, string> = {
    EM_AVALIACAO: "bg-yellow-500/20 text-yellow-300",
    APROVADO: "bg-blue-500/20 text-blue-300",
    REPROVADO: "bg-red-500/20 text-red-300",
    PAGO: "bg-emerald-500/20 text-emerald-300",
    CANCELADO: "bg-slate-500/20 text-slate-300"
}

const statusLabels: Record<string, string> = {
    EM_AVALIACAO: "Em Avaliação",
    APROVADO: "Aprovado",
    REPROVADO: "Reprovado",
    PAGO: "Pago",
    CANCELADO: "Cancelado"
}

export default function EmpenhosPage() {
    const [empenhos, setEmpenhos] = useState<Empenho[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("")

    useEffect(() => {
        fetch("/api/empenhos")
            .then(res => res.json())
            .then(data => setEmpenhos(data))
            .finally(() => setLoading(false))
    }, [])

    const filtered = empenhos.filter(e =>
        !filter || e.status === filter
    )

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Empenhos</h1>
                    <p className="text-blue-200/60 mt-1">Gerencie os empenhos do sistema</p>
                </div>
                <Link
                    href="/empenhos/novo"
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Novo Empenho
                </Link>
            </div>

            {/* Filtros */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                <button
                    onClick={() => setFilter("")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${!filter ? "bg-blue-500 text-white" : "bg-white/10 text-blue-200 hover:bg-white/20"
                        }`}
                >
                    Todos ({empenhos.length})
                </button>
                {Object.entries(statusLabels).map(([key, label]) => {
                    const count = empenhos.filter(e => e.status === key).length
                    return (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${filter === key ? "bg-blue-500 text-white" : "bg-white/10 text-blue-200 hover:bg-white/20"
                                }`}
                        >
                            {label} ({count})
                        </button>
                    )
                })}
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto"></div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-blue-200/60">Nenhum empenho encontrado</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Número</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Fornecedor</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Descrição</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Valor</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Status</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-blue-200">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((empenho) => (
                                <tr key={empenho.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-white font-mono">{empenho.numero}</p>
                                        {empenho.contrato && (
                                            <p className="text-xs text-blue-200/50">Contrato: {empenho.contrato.numero}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-blue-100/80">{empenho.fornecedor.razaoSocial}</td>
                                    <td className="px-6 py-4 text-blue-100/80 max-w-xs truncate">{empenho.descricao}</td>
                                    <td className="px-6 py-4 text-white font-medium">
                                        {Number(empenho.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[empenho.status]}`}>
                                            {statusLabels[empenho.status]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/empenhos/${empenho.id}`}
                                            className="p-2 rounded-lg bg-white/10 hover:bg-blue-500/30 text-blue-300 transition-all inline-block"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
