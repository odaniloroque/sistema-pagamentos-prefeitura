import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET - Listar contratos
export async function GET() {
    try {
        const contratos = await prisma.contrato.findMany({
            where: { deleted: false },
            include: {
                fornecedor: {
                    select: { razaoSocial: true, cnpj: true }
                }
            },
            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json(contratos)
    } catch (error) {
        console.error("Erro ao listar contratos:", error)
        return NextResponse.json(
            { error: "Erro ao listar contratos" },
            { status: 500 }
        )
    }
}

// POST - Criar contrato
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { numero, fornecedorId, objeto, dataInicio, dataTermino, valorTotal } = body

        if (!numero || !fornecedorId || !objeto || !dataInicio || !dataTermino || !valorTotal) {
            return NextResponse.json(
                { error: "Todos os campos são obrigatórios" },
                { status: 400 }
            )
        }

        // Verificar número duplicado
        const existing = await prisma.contrato.findUnique({
            where: { numero }
        })

        if (existing) {
            return NextResponse.json(
                { error: "Número de contrato já existe" },
                { status: 400 }
            )
        }

        const contrato = await prisma.contrato.create({
            data: {
                numero,
                fornecedorId,
                objeto,
                dataInicio: new Date(dataInicio),
                dataTermino: new Date(dataTermino),
                valorTotal
            },
            include: {
                fornecedor: { select: { razaoSocial: true } }
            }
        })

        await prisma.auditoriaLog.create({
            data: {
                usuario: "Sistema",
                acao: "CREATE",
                entidade: "CONTRATO",
                entidadeId: contrato.id,
                detalhes: `Contrato ${numero} criado - Fornecedor: ${contrato.fornecedor.razaoSocial}`
            }
        })

        return NextResponse.json(contrato, { status: 201 })
    } catch (error) {
        console.error("Erro ao criar contrato:", error)
        return NextResponse.json(
            { error: "Erro ao criar contrato" },
            { status: 500 }
        )
    }
}
