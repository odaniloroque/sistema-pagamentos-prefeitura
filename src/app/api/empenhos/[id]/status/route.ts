import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

interface RouteParams {
    params: Promise<{ id: string }>
}

// PATCH - Alterar status do empenho
export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const { id } = await params
        const { status, motivo } = await request.json()

        const empenho = await prisma.empenho.findUnique({ where: { id, deleted: false } })
        if (!empenho) {
            return NextResponse.json({ error: "Empenho não encontrado" }, { status: 404 })
        }

        // Validar transições de status
        const transicoesValidas: Record<string, string[]> = {
            EM_AVALIACAO: ["APROVADO", "REPROVADO", "CANCELADO"],
            APROVADO: ["PAGO", "CANCELADO"],
            REPROVADO: ["EM_AVALIACAO", "CANCELADO"],
            PAGO: [],
            CANCELADO: []
        }

        if (!transicoesValidas[empenho.status]?.includes(status)) {
            return NextResponse.json({
                error: `Transição de ${empenho.status} para ${status} não permitida`
            }, { status: 400 })
        }

        const updated = await prisma.empenho.update({
            where: { id },
            data: { status }
        })

        await prisma.auditoriaLog.create({
            data: {
                usuario: session.user.name || "Sistema",
                acao: "STATUS_CHANGE",
                entidade: "EMPENHO",
                entidadeId: id,
                detalhes: `Status alterado: ${empenho.status} → ${status}. Motivo: ${motivo || "Não informado"}`
            }
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Erro ao alterar status:", error)
        return NextResponse.json({ error: "Erro ao alterar status" }, { status: 500 })
    }
}
