import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hash } from "bcryptjs"

// GET - Listar todos os usuários (exceto deletados)
export async function GET() {
    try {
        const users = await prisma.user.findMany({
            where: { deleted: false },
            select: {
                id: true,
                name: true,
                email: true,
                status: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json(users)
    } catch (error) {
        console.error("Erro ao listar usuários:", error)
        return NextResponse.json(
            { error: "Erro ao listar usuários" },
            { status: 500 }
        )
    }
}

// POST - Criar novo usuário
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, password } = body

        // Validação
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Todos os campos são obrigatórios" },
                { status: 400 }
            )
        }

        // Verificar se email já existe
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "Este e-mail já está cadastrado" },
                { status: 400 }
            )
        }

        // Criptografar senha
        const hashedPassword = await hash(password, 12)

        // Criar usuário
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            },
            select: {
                id: true,
                name: true,
                email: true,
                status: true,
                createdAt: true
            }
        })

        return NextResponse.json(user, { status: 201 })
    } catch (error) {
        console.error("Erro ao criar usuário:", error)
        return NextResponse.json(
            { error: "Erro ao criar usuário" },
            { status: 500 }
        )
    }
}
