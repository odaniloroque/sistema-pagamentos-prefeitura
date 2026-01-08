import prisma from "@/lib/prisma"

interface AuditoriaLogItem {
    id: string
    dataHora: Date
    usuario: string
    acao: string
    entidade: string
    entidadeId: string
    detalhes: string | null
}

export default async function AuditoriaPage() {
    const logs: AuditoriaLogItem[] = await prisma.auditoriaLog.findMany({
        orderBy: { dataHora: "desc" },
        take: 100
    })

    const getActionColor = (acao: string) => {
        switch (acao) {
            case "CREATE": return "bg-emerald-500/20 text-emerald-300"
            case "UPDATE": return "bg-blue-500/20 text-blue-300"
            case "DELETE": return "bg-red-500/20 text-red-300"
            case "STATUS_CHANGE": return "bg-yellow-500/20 text-yellow-300"
            default: return "bg-slate-500/20 text-slate-300"
        }
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Auditoria</h1>
                <p className="text-blue-200/60 mt-1">Histórico de todas as ações do sistema</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                {logs.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-blue-200/60">Nenhum registro de auditoria</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Data/Hora</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Usuário</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Ação</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Entidade</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Detalhes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-blue-100/80 text-sm">
                                        {new Date(log.dataHora).toLocaleString("pt-BR")}
                                    </td>
                                    <td className="px-6 py-4 text-white">{log.usuario}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getActionColor(log.acao)}`}>
                                            {log.acao}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-white">{log.entidade}</span>
                                        <span className="text-blue-200/50 text-xs ml-2">#{log.entidadeId.slice(-8)}</span>
                                    </td>
                                    <td className="px-6 py-4 text-blue-100/60 text-sm max-w-md truncate">
                                        {log.detalhes}
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
