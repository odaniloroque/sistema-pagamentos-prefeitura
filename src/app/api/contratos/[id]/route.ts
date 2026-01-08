import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

interface RouteParams {
    params: Promise<{ id: string }>
}

// GET - Buscar contrato
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params

        const contrato = await prisma.contrato.findUnique({
            where: { id, deleted: false },
            include: {
                fornecedor: { select: { id: true, razaoSocial: true, cnpj: true } }
            }
        })

        if (!contrato) {
            return NextResponse.json({ error: "Contrato não encontrado" }, { status: 404 })
        }

        return NextResponse.json(contrato)
    } catch (error) {
        console.error("Erro ao buscar contrato:", error)
        return NextResponse.json({ error: "Erro ao buscar contrato" }, { status: 500 })
    }
}

// PUT - Atualizar
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params
        const body = await request.json()

        const existing = await prisma.contrato.findUnique({ where: { id, deleted: false } })
        if (!existing) {
            return NextResponse.json({ error: "Contrato não encontrado" }, { status: 404 })
        }

        if (body.numero && body.numero !== existing.numero) {
            const numInUse = await prisma.contrato.findUnique({ where: { numero: body.numero } })
            if (numInUse) {
                return NextResponse.json({ error: "Número já em uso" }, { status: 400 })
            }
        }

        const updateData: Record<string, unknown> = { ...body }
        if (body.dataInicio) updateData.dataInicio = new Date(body.dataInicio)
        if (body.dataTermino) updateData.dataTermino = new Date(body.dataTermino)

        const contrato = await prisma.contrato.update({
            where: { id },
            data: updateData
        })

        await prisma.auditoriaLog.create({
            data: {
                usuario: "Sistema",
                acao: "UPDATE",
                entidade: "CONTRATO",
                entidadeId: id,
                detalhes: `Contrato ${contrato.numero} atualizado`
            }
        })

        return NextResponse.json(contrato)
    } catch (error) {
        console.error("Erro ao atualizar contrato:", error)
        return NextResponse.json({ error: "Erro ao atualizar contrato" }, { status: 500 })
    }
}

// DELETE - Soft delete
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params

        const contrato = await prisma.contrato.findUnique({ where: { id, deleted: false } })
        if (!contrato) {
            return NextResponse.json({ error: "Contrato não encontrado" }, { status: 404 })
        }

        await prisma.contrato.update({
            where: { id },
            data: { deleted: true }
        })

        await prisma.auditoriaLog.create({
            data: {
                usuario: "Sistema",
                acao: "DELETE",
                entidade: "CONTRATO",
                entidadeId: id,
                detalhes: `Contrato ${contrato.numero} excluído`
            }
        })

        return NextResponse.json({ message: "Contrato excluído" })
    } catch (error) {
        console.error("Erro ao excluir contrato:", error)
        return NextResponse.json({ error: "Erro ao excluir contrato" }, { status: 500 })
    }
}
