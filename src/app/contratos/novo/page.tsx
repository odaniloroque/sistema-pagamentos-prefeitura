"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Fornecedor {
    id: string
    razaoSocial: string
}

export default function NovoContratoPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
    const [formData, setFormData] = useState({
        numero: "",
        fornecedorId: "",
        objeto: "",
        dataInicio: "",
        dataTermino: "",
        valorTotal: ""
    })

    useEffect(() => {
        fetch("/api/fornecedores")
            .then(res => res.json())
            .then(data => setFornecedores(data.filter((f: Fornecedor & { status: boolean }) => f.status)))
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await fetch("/api/contratos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    valorTotal: parseFloat(formData.valorTotal.replace(/\D/g, "")) / 100
                })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error)

            setSuccess(true)
            setTimeout(() => router.push("/contratos"), 1500)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao criar contrato")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/contratos" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Novo Contrato</h1>
                    <p className="text-sm text-blue-200/60">Preencha os dados do contrato</p>
                </div>
            </div>

            <div className="max-w-3xl">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-100 mb-2">Número do Contrato *</label>
                                <input
                                    type="text"
                                    value={formData.numero}
                                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-100 mb-2">Fornecedor *</label>
                                <select
                                    value={formData.fornecedorId}
                                    onChange={(e) => setFormData({ ...formData, fornecedorId: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                    required
                                >
                                    <option value="" className="bg-slate-800">Selecione...</option>
                                    {fornecedores.map(f => (
                                        <option key={f.id} value={f.id} className="bg-slate-800">{f.razaoSocial}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-blue-100 mb-2">Objeto do Contrato *</label>
                            <textarea
                                value={formData.objeto}
                                onChange={(e) => setFormData({ ...formData, objeto: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                rows={3}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-100 mb-2">Data Início *</label>
                                <input
                                    type="date"
                                    value={formData.dataInicio}
                                    onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-100 mb-2">Data Término *</label>
                                <input
                                    type="date"
                                    value={formData.dataTermino}
                                    onChange={(e) => setFormData({ ...formData, dataTermino: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-100 mb-2">Valor Total *</label>
                                <input
                                    type="text"
                                    value={formData.valorTotal}
                                    onChange={(e) => setFormData({ ...formData, valorTotal: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                    placeholder="R$ 0,00"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl text-sm">{error}</div>
                        )}
                        {success && (
                            <div className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 px-4 py-3 rounded-xl text-sm">Contrato criado! Redirecionando...</div>
                        )}

                        <div className="flex gap-4 pt-4">
                            <Link href="/contratos" className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-center transition-all">Cancelar</Link>
                            <button type="submit" disabled={loading || success} className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold shadow-lg disabled:opacity-50 transition-all">
                                {loading ? "Salvando..." : "Salvar Contrato"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
