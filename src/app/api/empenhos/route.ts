import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// GET - Listar empenhos
export async function GET() {
    try {
        const empenhos = await prisma.empenho.findMany({
            where: { deleted: false },
            include: {
                fornecedor: { select: { razaoSocial: true } },
                contrato: { select: { numero: true } },
                usuario: { select: { name: true } }
            },
            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json(empenhos)
    } catch (error) {
        console.error("Erro ao listar empenhos:", error)
        return NextResponse.json({ error: "Erro ao listar empenhos" }, { status: 500 })
    }
}

// POST - Criar empenho (status inicial: EM_AVALIACAO)
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const body = await request.json()
        const {
            numero, fornecedorId, possuiContrato, contratoId,
            orgaoPagador, cnpjOrgao, descricao, valor, dataPrevistaPagamento, observacoes
        } = body

        if (!numero || !fornecedorId || !orgaoPagador || !cnpjOrgao || !descricao || !valor) {
            return NextResponse.json({ error: "Campos obrigatórios não preenchidos" }, { status: 400 })
        }

        // Verificar número duplicado
        const existing = await prisma.empenho.findUnique({ where: { numero } })
        if (existing) {
            return NextResponse.json({ error: "Número de empenho já existe" }, { status: 400 })
        }

        // Se possui contrato, verificar se valor não excede
        if (possuiContrato && contratoId) {
            const contrato = await prisma.contrato.findUnique({ where: { id: contratoId } })
            if (contrato) {
                const totalEmpenhos = await prisma.empenho.aggregate({
                    where: { contratoId, deleted: false },
                    _sum: { valor: true }
                })
                const totalAtual = Number(totalEmpenhos._sum.valor) || 0
                if (totalAtual + Number(valor) > Number(contrato.valorTotal)) {
                    return NextResponse.json({ error: "Valor excede o saldo do contrato" }, { status: 400 })
                }
            }
        }

        const empenho = await prisma.empenho.create({
            data: {
                numero,
                fornecedorId,
                possuiContrato: !!possuiContrato,
                contratoId: possuiContrato ? contratoId : null,
                orgaoPagador,
                cnpjOrgao,
                descricao,
                valor,
                dataPrevistaPagamento: dataPrevistaPagamento ? new Date(dataPrevistaPagamento) : null,
                observacoes,
                usuarioId: session.user.id
            },
            include: { fornecedor: { select: { razaoSocial: true } } }
        })

        await prisma.auditoriaLog.create({
            data: {
                usuario: session.user.name || "Sistema",
                acao: "CREATE",
                entidade: "EMPENHO",
                entidadeId: empenho.id,
                detalhes: `Empenho ${numero} criado - Status inicial: EM_AVALIACAO`
            }
        })

        return NextResponse.json(empenho, { status: 201 })
    } catch (error) {
        console.error("Erro ao criar empenho:", error)
        return NextResponse.json({ error: "Erro ao criar empenho" }, { status: 500 })
    }
}
