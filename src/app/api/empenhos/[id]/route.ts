import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

interface RouteParams {
    params: Promise<{ id: string }>
}

// GET - Buscar empenho
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params

        const empenho = await prisma.empenho.findUnique({
            where: { id, deleted: false },
            include: {
                fornecedor: { select: { id: true, razaoSocial: true, cnpj: true } },
                contrato: { select: { id: true, numero: true, valorTotal: true } },
                usuario: { select: { name: true } }
            }
        })

        if (!empenho) {
            return NextResponse.json({ error: "Empenho não encontrado" }, { status: 404 })
        }

        return NextResponse.json(empenho)
    } catch (error) {
        console.error("Erro ao buscar empenho:", error)
        return NextResponse.json({ error: "Erro ao buscar empenho" }, { status: 500 })
    }
}

// PUT - Atualizar empenho
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const { id } = await params
        const body = await request.json()

        const existing = await prisma.empenho.findUnique({ where: { id, deleted: false } })
        if (!existing) {
            return NextResponse.json({ error: "Empenho não encontrado" }, { status: 404 })
        }

        // Não permitir edição de empenho pago
        if (existing.status === "PAGO") {
            return NextResponse.json({ error: "Empenho pago não pode ser editado" }, { status: 400 })
        }

        const updateData: Record<string, unknown> = { ...body }
        if (body.dataPrevistaPagamento) {
            updateData.dataPrevistaPagamento = new Date(body.dataPrevistaPagamento)
        }

        const empenho = await prisma.empenho.update({
            where: { id },
            data: updateData
        })

        await prisma.auditoriaLog.create({
            data: {
                usuario: session.user.name || "Sistema",
                acao: "UPDATE",
                entidade: "EMPENHO",
                entidadeId: id,
                detalhes: `Empenho ${empenho.numero} atualizado`
            }
        })

        return NextResponse.json(empenho)
    } catch (error) {
        console.error("Erro ao atualizar empenho:", error)
        return NextResponse.json({ error: "Erro ao atualizar empenho" }, { status: 500 })
    }
}

// DELETE - Soft delete (não permitido se pago)
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const { id } = await params

        const empenho = await prisma.empenho.findUnique({ where: { id, deleted: false } })
        if (!empenho) {
            return NextResponse.json({ error: "Empenho não encontrado" }, { status: 404 })
        }

        // Não permitir exclusão de empenho pago
        if (empenho.status === "PAGO") {
            return NextResponse.json({ error: "Empenho pago não pode ser excluído" }, { status: 400 })
        }

        await prisma.empenho.update({
            where: { id },
            data: { deleted: true }
        })

        await prisma.auditoriaLog.create({
            data: {
                usuario: session.user.name || "Sistema",
                acao: "DELETE",
                entidade: "EMPENHO",
                entidadeId: id,
                detalhes: `Empenho ${empenho.numero} excluído`
            }
        })

        return NextResponse.json({ message: "Empenho excluído" })
    } catch (error) {
        console.error("Erro ao excluir empenho:", error)
        return NextResponse.json({ error: "Erro ao excluir empenho" }, { status: 500 })
    }
}
