import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // Rotas públicas
                const publicPaths = ["/login", "/api/auth"]
                const isPublicPath = publicPaths.some(path =>
                    req.nextUrl.pathname.startsWith(path)
                )

                if (isPublicPath) return true

                // Verificar se tem token para rotas protegidas
                return !!token
            }
        }
    }
)

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|public).*)"
    ]
}
