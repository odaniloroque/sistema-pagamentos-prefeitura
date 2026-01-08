"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface User {
    id: string
    name: string
    email: string
    status: boolean
}

export default function EditarUsuarioPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        status: true
    })

    useEffect(() => {
        fetchUser()
    }, [id])

    const fetchUser = async () => {
        try {
            const res = await fetch(`/api/usuarios/${id}`)
            if (!res.ok) throw new Error("Usuário não encontrado")
            const user: User = await res.json()
            setFormData({
                name: user.name,
                email: user.email,
                password: "",
                status: user.status
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao carregar usuário")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSaving(true)

        try {
            const updateData: { name?: string; email?: string; password?: string; status?: boolean } = {
                name: formData.name,
                email: formData.email,
                status: formData.status
            }

            if (formData.password) {
                if (formData.password.length < 6) {
                    setError("A senha deve ter no mínimo 6 caracteres")
                    setSaving(false)
                    return
                }
                updateData.password = formData.password
            }

            const res = await fetch(`/api/usuarios/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData)
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Erro ao atualizar")
            }

            setSuccess(true)
            setTimeout(() => router.push("/usuarios"), 1500)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao atualizar usuário")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-blue-200/60 mt-4">Carregando...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="bg-white/5 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link href="/usuarios" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-white">Editar Usuário</h1>
                        <p className="text-sm text-blue-200/60">Atualize os dados do usuário</p>
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-6 py-8">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-blue-100 mb-2">
                                Nome Completo
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-2">
                                E-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-2">
                                Nova Senha <span className="text-blue-200/50">(deixe em branco para manter)</span>
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-blue-100 mb-2">
                                Status
                            </label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, status: true })}
                                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${formData.status
                                            ? "bg-emerald-500/30 text-emerald-300 border-2 border-emerald-400"
                                            : "bg-white/10 text-white border-2 border-transparent hover:bg-white/20"
                                        }`}
                                >
                                    Ativo
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, status: false })}
                                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${!formData.status
                                            ? "bg-red-500/30 text-red-300 border-2 border-red-400"
                                            : "bg-white/10 text-white border-2 border-transparent hover:bg-white/20"
                                        }`}
                                >
                                    Inativo
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Usuário atualizado com sucesso! Redirecionando...
                            </div>
                        )}

                        <div className="flex gap-4 pt-4">
                            <Link
                                href="/usuarios"
                                className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-center transition-all"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={saving || success}
                                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? "Salvando..." : "Salvar Alterações"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}
