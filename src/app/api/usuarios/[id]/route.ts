import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hash } from "bcryptjs"

interface RouteParams {
    params: Promise<{ id: string }>
}

// GET - Buscar usuário por ID
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params

        const user = await prisma.user.findUnique({
            where: { id, deleted: false },
            select: {
                id: true,
                name: true,
                email: true,
                status: true,
                createdAt: true,
                updatedAt: true
            }
        })

        if (!user) {
            return NextResponse.json(
                { error: "Usuário não encontrado" },
                { status: 404 }
            )
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error("Erro ao buscar usuário:", error)
        return NextResponse.json(
            { error: "Erro ao buscar usuário" },
            { status: 500 }
        )
    }
}

// PUT - Atualizar usuário
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params
        const body = await request.json()
        const { name, email, password, status } = body

        // Verificar se usuário existe
        const existingUser = await prisma.user.findUnique({
            where: { id, deleted: false }
        })

        if (!existingUser) {
            return NextResponse.json(
                { error: "Usuário não encontrado" },
                { status: 404 }
            )
        }

        // Verificar se email já está em uso por outro usuário
        if (email && email !== existingUser.email) {
            const emailInUse = await prisma.user.findUnique({
                where: { email }
            })

            if (emailInUse) {
                return NextResponse.json(
                    { error: "Este e-mail já está em uso" },
                    { status: 400 }
                )
            }
        }

        // Preparar dados para atualização
        const updateData: {
            name?: string
            email?: string
            password?: string
            status?: boolean
        } = {}

        if (name) updateData.name = name
        if (email) updateData.email = email
        if (typeof status === "boolean") updateData.status = status
        if (password) updateData.password = await hash(password, 12)

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                status: true,
                updatedAt: true
            }
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error)
        return NextResponse.json(
            { error: "Erro ao atualizar usuário" },
            { status: 500 }
        )
    }
}

// DELETE - Soft delete (exclusão lógica)
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params

        const user = await prisma.user.findUnique({
            where: { id, deleted: false }
        })

        if (!user) {
            return NextResponse.json(
                { error: "Usuário não encontrado" },
                { status: 404 }
            )
        }

        await prisma.user.update({
            where: { id },
            data: { deleted: true, status: false }
        })

        return NextResponse.json({ message: "Usuário excluído com sucesso" })
    } catch (error) {
        console.error("Erro ao excluir usuário:", error)
        return NextResponse.json(
            { error: "Erro ao excluir usuário" },
            { status: 500 }
        )
    }
}
