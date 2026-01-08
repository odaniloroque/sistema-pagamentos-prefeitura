import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import Link from "next/link"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    // Buscar estatísticas
    const [
        totalFornecedores,
        totalContratos,
        empenhosPorStatus,
        valorTotalEmpenhos
    ] = await Promise.all([
        prisma.fornecedor.count({ where: { deleted: false } }),
        prisma.contrato.count({ where: { deleted: false } }),
        prisma.empenho.groupBy({
            by: ['status'],
            where: { deleted: false },
            _count: { status: true },
            _sum: { valor: true }
        }),
        prisma.empenho.aggregate({
            where: { deleted: false },
            _sum: { valor: true }
        })
    ])

    // Processar dados dos empenhos
    const statusData = {
        EM_AVALIACAO: { count: 0, valor: 0 },
        APROVADO: { count: 0, valor: 0 },
        REPROVADO: { count: 0, valor: 0 },
        PAGO: { count: 0, valor: 0 },
        CANCELADO: { count: 0, valor: 0 }
    }

    empenhosPorStatus.forEach((item) => {
        statusData[item.status] = {
            count: item._count.status,
            valor: Number(item._sum.valor) || 0
        }
    })

    const totalEmpenhos = Object.values(statusData).reduce((acc, curr) => acc + curr.count, 0)
    const valorTotal = Number(valorTotalEmpenhos._sum.valor) || 0

    const cards = [
        {
            title: "Fornecedores",
            value: totalFornecedores,
            icon: "🏢",
            color: "from-blue-500 to-blue-600",
            href: "/fornecedores"
        },
        {
            title: "Contratos",
            value: totalContratos,
            icon: "📄",
            color: "from-purple-500 to-purple-600",
            href: "/contratos"
        },
        {
            title: "Empenhos",
            value: totalEmpenhos,
            icon: "💰",
            color: "from-cyan-500 to-cyan-600",
            href: "/empenhos"
        },
        {
            title: "Valor Total",
            value: valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
            icon: "💵",
            color: "from-emerald-500 to-emerald-600",
            href: "/empenhos"
        }
    ]

    const statusCards = [
        { status: "Em Avaliação", data: statusData.EM_AVALIACAO, color: "bg-yellow-500/20 text-yellow-300" },
        { status: "Aprovado", data: statusData.APROVADO, color: "bg-blue-500/20 text-blue-300" },
        { status: "Pago", data: statusData.PAGO, color: "bg-emerald-500/20 text-emerald-300" },
        { status: "Reprovado", data: statusData.REPROVADO, color: "bg-red-500/20 text-red-300" },
        { status: "Cancelado", data: statusData.CANCELADO, color: "bg-slate-500/20 text-slate-300" }
    ]

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-blue-200/60 mt-1">Bem-vindo, {session?.user?.name}</p>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {cards.map((card) => (
                    <Link
                        key={card.title}
                        href={card.href}
                        className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-3xl">{card.icon}</span>
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center opacity-80 group-hover:opacity-100 transition-all`}>
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-sm text-blue-200/60 mb-1">{card.title}</p>
                        <p className="text-2xl font-bold text-white">{card.value}</p>
                    </Link>
                ))}
            </div>

            {/* Empenhos por Status */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <h2 className="text-xl font-bold text-white mb-6">Empenhos por Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {statusCards.map((item) => (
                        <div key={item.status} className={`${item.color} rounded-xl p-4`}>
                            <p className="text-sm font-medium mb-2">{item.status}</p>
                            <p className="text-2xl font-bold">{item.data.count}</p>
                            <p className="text-xs mt-1 opacity-80">
                                {item.data.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
