import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

interface RouteParams {
    params: Promise<{ id: string }>
}

// GET - Buscar fornecedor por ID
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params

        const fornecedor = await prisma.fornecedor.findUnique({
            where: { id, deleted: false }
        })

        if (!fornecedor) {
            return NextResponse.json(
                { error: "Fornecedor não encontrado" },
                { status: 404 }
            )
        }

        return NextResponse.json(fornecedor)
    } catch (error) {
        console.error("Erro ao buscar fornecedor:", error)
        return NextResponse.json(
            { error: "Erro ao buscar fornecedor" },
            { status: 500 }
        )
    }
}

// PUT - Atualizar fornecedor
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params
        const body = await request.json()

        const existing = await prisma.fornecedor.findUnique({
            where: { id, deleted: false }
        })

        if (!existing) {
            return NextResponse.json(
                { error: "Fornecedor não encontrado" },
                { status: 404 }
            )
        }

        // Verificar CNPJ duplicado
        if (body.cnpj && body.cnpj !== existing.cnpj) {
            const cnpjInUse = await prisma.fornecedor.findUnique({
                where: { cnpj: body.cnpj }
            })
            if (cnpjInUse) {
                return NextResponse.json(
                    { error: "CNPJ já em uso" },
                    { status: 400 }
                )
            }
        }

        const fornecedor = await prisma.fornecedor.update({
            where: { id },
            data: body
        })

        await prisma.auditoriaLog.create({
            data: {
                usuario: "Sistema",
                acao: "UPDATE",
                entidade: "FORNECEDOR",
                entidadeId: id,
                detalhes: `Fornecedor atualizado: ${fornecedor.razaoSocial}`
            }
        })

        return NextResponse.json(fornecedor)
    } catch (error) {
        console.error("Erro ao atualizar fornecedor:", error)
        return NextResponse.json(
            { error: "Erro ao atualizar fornecedor" },
            { status: 500 }
        )
    }
}

// DELETE - Soft delete
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params

        const fornecedor = await prisma.fornecedor.findUnique({
            where: { id, deleted: false }
        })

        if (!fornecedor) {
            return NextResponse.json(
                { error: "Fornecedor não encontrado" },
                { status: 404 }
            )
        }

        await prisma.fornecedor.update({
            where: { id },
            data: { deleted: true, status: false }
        })

        await prisma.auditoriaLog.create({
            data: {
                usuario: "Sistema",
                acao: "DELETE",
                entidade: "FORNECEDOR",
                entidadeId: id,
                detalhes: `Fornecedor excluído: ${fornecedor.razaoSocial}`
            }
        })

        return NextResponse.json({ message: "Fornecedor excluído" })
    } catch (error) {
        console.error("Erro ao excluir fornecedor:", error)
        return NextResponse.json(
            { error: "Erro ao excluir fornecedor" },
            { status: 500 }
        )
    }
}
