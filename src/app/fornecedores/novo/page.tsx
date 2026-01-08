"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function NovoFornecedorPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        razaoSocial: "",
        nomeFantasia: "",
        cnpj: "",
        endereco: "",
        telefone: "",
        email: "",
        banco: "",
        agencia: "",
        conta: "",
        tipoConta: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await fetch("/api/fornecedores", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    cnpj: formData.cnpj.replace(/\D/g, ""),
                    tipoConta: formData.tipoConta || null
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Erro ao criar fornecedor")
            }

            setSuccess(true)
            setTimeout(() => router.push("/fornecedores"), 1500)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao criar fornecedor")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/fornecedores" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Novo Fornecedor</h1>
                    <p className="text-sm text-blue-200/60">Preencha os dados do fornecedor</p>
                </div>
            </div>

            <div className="max-w-4xl">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Dados Principais */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Dados Principais</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-blue-100 mb-2">Razão Social *</label>
                                    <input
                                        type="text"
                                        value={formData.razaoSocial}
                                        onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-blue-100 mb-2">Nome Fantasia</label>
                                    <input
                                        type="text"
                                        value={formData.nomeFantasia}
                                        onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-blue-100 mb-2">CNPJ *</label>
                                    <input
                                        type="text"
                                        value={formData.cnpj}
                                        onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                        placeholder="00.000.000/0000-00"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contato */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Contato</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-blue-100 mb-2">Endereço</label>
                                    <input
                                        type="text"
                                        value={formData.endereco}
                                        onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-blue-100 mb-2">Telefone</label>
                                    <input
                                        type="text"
                                        value={formData.telefone}
                                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-blue-100 mb-2">E-mail</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dados Bancários */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Dados Bancários</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-blue-100 mb-2">Banco</label>
                                    <input
                                        type="text"
                                        value={formData.banco}
                                        onChange={(e) => setFormData({ ...formData, banco: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-blue-100 mb-2">Agência</label>
                                    <input
                                        type="text"
                                        value={formData.agencia}
                                        onChange={(e) => setFormData({ ...formData, agencia: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-blue-100 mb-2">Conta</label>
                                    <input
                                        type="text"
                                        value={formData.conta}
                                        onChange={(e) => setFormData({ ...formData, conta: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-blue-100 mb-2">Tipo</label>
                                    <select
                                        value={formData.tipoConta}
                                        onChange={(e) => setFormData({ ...formData, tipoConta: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                    >
                                        <option value="" className="bg-slate-800">Selecione</option>
                                        <option value="CORRENTE" className="bg-slate-800">Corrente</option>
                                        <option value="POUPANCA" className="bg-slate-800">Poupança</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Fornecedor criado com sucesso! Redirecionando...
                            </div>
                        )}

                        <div className="flex gap-4 pt-4">
                            <Link
                                href="/fornecedores"
                                className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-center transition-all"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={loading || success}
                                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all disabled:opacity-50"
                            >
                                {loading ? "Salvando..." : "Salvar Fornecedor"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
