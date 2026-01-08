import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET - Listar fornecedores
export async function GET() {
    try {
        const fornecedores = await prisma.fornecedor.findMany({
            where: { deleted: false },
            orderBy: { razaoSocial: "asc" }
        })

        return NextResponse.json(fornecedores)
    } catch (error) {
        console.error("Erro ao listar fornecedores:", error)
        return NextResponse.json(
            { error: "Erro ao listar fornecedores" },
            { status: 500 }
        )
    }
}

// POST - Criar fornecedor
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { razaoSocial, nomeFantasia, cnpj, endereco, telefone, email, banco, agencia, conta, tipoConta } = body

        if (!razaoSocial || !cnpj) {
            return NextResponse.json(
                { error: "Razão social e CNPJ são obrigatórios" },
                { status: 400 }
            )
        }

        // Verificar CNPJ duplicado
        const existing = await prisma.fornecedor.findUnique({
            where: { cnpj }
        })

        if (existing) {
            return NextResponse.json(
                { error: "CNPJ já cadastrado" },
                { status: 400 }
            )
        }

        const fornecedor = await prisma.fornecedor.create({
            data: {
                razaoSocial,
                nomeFantasia,
                cnpj,
                endereco,
                telefone,
                email,
                banco,
                agencia,
                conta,
                tipoConta
            }
        })

        // Log de auditoria
        await prisma.auditoriaLog.create({
            data: {
                usuario: "Sistema",
                acao: "CREATE",
                entidade: "FORNECEDOR",
                entidadeId: fornecedor.id,
                detalhes: `Fornecedor criado: ${razaoSocial}`
            }
        })

        return NextResponse.json(fornecedor, { status: 201 })
    } catch (error) {
        console.error("Erro ao criar fornecedor:", error)
        return NextResponse.json(
            { error: "Erro ao criar fornecedor" },
            { status: 500 }
        )
    }
}
