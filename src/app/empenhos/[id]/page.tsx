"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Empenho {
    id: string
    numero: string
    descricao: string
    valor: number
    status: string
    dataEmissao: string
    dataPrevistaPagamento: string | null
    orgaoPagador: string
    cnpjOrgao: string
    observacoes: string | null
    possuiContrato: boolean
    fornecedor: { razaoSocial: string; cnpj: string }
    contrato: { numero: string; valorTotal: number } | null
    usuario: { name: string }
}

const statusColors: Record<string, string> = {
    EM_AVALIACAO: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    APROVADO: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    REPROVADO: "bg-red-500/20 text-red-300 border-red-500/30",
    PAGO: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    CANCELADO: "bg-slate-500/20 text-slate-300 border-slate-500/30"
}

const statusLabels: Record<string, string> = {
    EM_AVALIACAO: "Em Avaliação",
    APROVADO: "Aprovado",
    REPROVADO: "Reprovado",
    PAGO: "Pago",
    CANCELADO: "Cancelado"
}

const transicoesValidas: Record<string, { label: string; color: string }[]> = {
    EM_AVALIACAO: [
        { label: "APROVADO", color: "bg-blue-500 hover:bg-blue-600" },
        { label: "REPROVADO", color: "bg-red-500 hover:bg-red-600" },
        { label: "CANCELADO", color: "bg-slate-500 hover:bg-slate-600" }
    ],
    APROVADO: [
        { label: "PAGO", color: "bg-emerald-500 hover:bg-emerald-600" },
        { label: "CANCELADO", color: "bg-slate-500 hover:bg-slate-600" }
    ],
    REPROVADO: [
        { label: "EM_AVALIACAO", color: "bg-yellow-500 hover:bg-yellow-600" },
        { label: "CANCELADO", color: "bg-slate-500 hover:bg-slate-600" }
    ],
    PAGO: [],
    CANCELADO: []
}

export default function EmpenhoDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const [empenho, setEmpenho] = useState<Empenho | null>(null)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [modalStatus, setModalStatus] = useState<string | null>(null)
    const [motivo, setMotivo] = useState("")

    useEffect(() => {
        fetch(`/api/empenhos/${id}`)
            .then(res => res.json())
            .then(data => setEmpenho(data))
            .finally(() => setLoading(false))
    }, [id])

    const handleStatusChange = async () => {
        if (!modalStatus) return
        setActionLoading(true)
        try {
            const res = await fetch(`/api/empenhos/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: modalStatus, motivo })
            })
            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error)
            }
            router.refresh()
            window.location.reload()
        } catch (err) {
            alert(err instanceof Error ? err.message : "Erro ao alterar status")
        } finally {
            setActionLoading(false)
            setModalStatus(null)
            setMotivo("")
        }
    }

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full"></div>
            </div>
        )
    }

    if (!empenho) {
        return <div className="p-8 text-center text-blue-200/60">Empenho não encontrado</div>
    }

    const acoes = transicoesValidas[empenho.status] || []

    return (
        <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/empenhos" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white">Empenho {empenho.numero}</h1>
                    <p className="text-sm text-blue-200/60">Detalhes e fluxo de aprovação</p>
                </div>
                <span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${statusColors[empenho.status]}`}>
                    {statusLabels[empenho.status]}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Dados Principais */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Dados do Empenho</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-blue-200/60">Valor</p>
                                <p className="text-xl font-bold text-white">
                                    {Number(empenho.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-blue-200/60">Data Emissão</p>
                                <p className="text-white">{new Date(empenho.dataEmissao).toLocaleDateString("pt-BR")}</p>
                            </div>
                            <div>
                                <p className="text-sm text-blue-200/60">Órgão Pagador</p>
                                <p className="text-white">{empenho.orgaoPagador}</p>
                            </div>
                            <div>
                                <p className="text-sm text-blue-200/60">CNPJ Órgão</p>
                                <p className="text-white font-mono">{empenho.cnpjOrgao}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-blue-200/60">Descrição</p>
                            <p className="text-white mt-1">{empenho.descricao}</p>
                        </div>
                        {empenho.observacoes && (
                            <div className="mt-4">
                                <p className="text-sm text-blue-200/60">Observações</p>
                                <p className="text-white mt-1">{empenho.observacoes}</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Fornecedor</h3>
                        <p className="text-white font-medium">{empenho.fornecedor.razaoSocial}</p>
                        <p className="text-blue-200/60 font-mono text-sm">{empenho.fornecedor.cnpj}</p>
                        {empenho.contrato && (
                            <div className="mt-4 p-4 bg-white/5 rounded-xl">
                                <p className="text-sm text-blue-200/60">Contrato Vinculado</p>
                                <p className="text-white font-mono">{empenho.contrato.numero}</p>
                                <p className="text-sm text-blue-200/60 mt-1">
                                    Valor: {Number(empenho.contrato.valorTotal).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Ações */}
                <div className="space-y-6">
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Ações</h3>
                        {acoes.length > 0 ? (
                            <div className="space-y-3">
                                {acoes.map(({ label, color }) => (
                                    <button
                                        key={label}
                                        onClick={() => setModalStatus(label)}
                                        className={`w-full py-3 px-4 rounded-xl text-white font-semibold transition-all ${color}`}
                                    >
                                        {label === "PAGO" ? "Marcar como Pago" :
                                            label === "APROVADO" ? "Aprovar Empenho" :
                                                label === "REPROVADO" ? "Reprovar Empenho" :
                                                    label === "EM_AVALIACAO" ? "Retornar para Avaliação" :
                                                        "Cancelar Empenho"}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-blue-200/60 text-center py-4">
                                Nenhuma ação disponível para este status
                            </p>
                        )}
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Informações</h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-blue-200/60">Cadastrado por</p>
                                <p className="text-white">{empenho.usuario.name}</p>
                            </div>
                            <div>
                                <p className="text-blue-200/60">Pagamento Previsto</p>
                                <p className="text-white">
                                    {empenho.dataPrevistaPagamento
                                        ? new Date(empenho.dataPrevistaPagamento).toLocaleDateString("pt-BR")
                                        : "Não informado"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Confirmação */}
            {modalStatus && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-2">Confirmar Alteração</h3>
                        <p className="text-blue-200/70 mb-4">
                            Alterar status para <strong>{statusLabels[modalStatus]}</strong>?
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm text-blue-100 mb-2">Motivo (opcional)</label>
                            <textarea
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                rows={3}
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setModalStatus(null); setMotivo("") }}
                                className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleStatusChange}
                                disabled={actionLoading}
                                className="flex-1 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold disabled:opacity-50"
                            >
                                {actionLoading ? "Processando..." : "Confirmar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
