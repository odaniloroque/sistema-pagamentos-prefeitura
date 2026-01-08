"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Fornecedor { id: string; razaoSocial: string }
interface Contrato { id: string; numero: string; fornecedorId: string }

export default function NovoEmpenhoPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
    const [contratos, setContratos] = useState<Contrato[]>([])
    const [formData, setFormData] = useState({
        numero: "",
        fornecedorId: "",
        possuiContrato: false,
        contratoId: "",
        orgaoPagador: "",
        cnpjOrgao: "",
        descricao: "",
        valor: "",
        dataPrevistaPagamento: "",
        observacoes: ""
    })

    useEffect(() => {
        fetch("/api/fornecedores").then(r => r.json()).then(d => setFornecedores(d.filter((f: Fornecedor & { status: boolean }) => f.status)))
        fetch("/api/contratos").then(r => r.json()).then(d => setContratos(d.filter((c: Contrato & { status: string }) => c.status === "VIGENTE")))
    }, [])

    const contratosFornecedor = contratos.filter(c => c.fornecedorId === formData.fornecedorId)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await fetch("/api/empenhos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    valor: parseFloat(formData.valor.replace(/\D/g, "")) / 100,
                    contratoId: formData.possuiContrato ? formData.contratoId : null
                })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error)

            setSuccess(true)
            setTimeout(() => router.push("/empenhos"), 1500)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao criar empenho")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/empenhos" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Novo Empenho</h1>
                    <p className="text-sm text-blue-200/60">Cadastre um novo empenho</p>
                </div>
            </div>

            <div className="max-w-4xl">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-100 mb-2">Número do Empenho *</label>
                                <input
                                    type="text"
                                    value={formData.numero}
                                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-100 mb-2">Fornecedor *</label>
                                <select
                                    value={formData.fornecedorId}
                                    onChange={(e) => setFormData({ ...formData, fornecedorId: e.target.value, contratoId: "" })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                    required
                                >
                                    <option value="" className="bg-slate-800">Selecione...</option>
                                    {fornecedores.map(f => <option key={f.id} value={f.id} className="bg-slate-800">{f.razaoSocial}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.possuiContrato}
                                    onChange={(e) => setFormData({ ...formData, possuiContrato: e.target.checked, contratoId: "" })}
                                    className="w-5 h-5 rounded bg-white/10 border-white/20 text-cyan-400 focus:ring-cyan-400"
                                />
                                <span className="text-blue-100">Vinculado a contrato</span>
                            </label>
                            {formData.possuiContrato && (
                                <select
                                    value={formData.contratoId}
                                    onChange={(e) => setFormData({ ...formData, contratoId: e.target.value })}
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                    required={formData.possuiContrato}
                                >
                                    <option value="" className="bg-slate-800">Selecione o contrato...</option>
                                    {contratosFornecedor.map(c => <option key={c.id} value={c.id} className="bg-slate-800">{c.numero}</option>)}
                                </select>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-100 mb-2">Órgão Pagador *</label>
                                <input
                                    type="text"
                                    value={formData.orgaoPagador}
                                    onChange={(e) => setFormData({ ...formData, orgaoPagador: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-100 mb-2">CNPJ do Órgão *</label>
                                <input
                                    type="text"
                                    value={formData.cnpjOrgao}
                                    onChange={(e) => setFormData({ ...formData, cnpjOrgao: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-blue-100 mb-2">Descrição do Pagamento *</label>
                            <textarea
                                value={formData.descricao}
                                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                rows={3}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-100 mb-2">Valor *</label>
                                <input
                                    type="text"
                                    value={formData.valor}
                                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                    placeholder="R$ 0,00"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-100 mb-2">Data Prevista Pagamento</label>
                                <input
                                    type="date"
                                    value={formData.dataPrevistaPagamento}
                                    onChange={(e) => setFormData({ ...formData, dataPrevistaPagamento: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-blue-100 mb-2">Observações</label>
                            <textarea
                                value={formData.observacoes}
                                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                rows={2}
                            />
                        </div>

                        {error && <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl text-sm">{error}</div>}
                        {success && <div className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 px-4 py-3 rounded-xl text-sm">Empenho criado! Redirecionando...</div>}

                        <div className="flex gap-4 pt-4">
                            <Link href="/empenhos" className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-center transition-all">Cancelar</Link>
                            <button type="submit" disabled={loading || success} className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold shadow-lg disabled:opacity-50 transition-all">
                                {loading ? "Salvando..." : "Cadastrar Empenho"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
