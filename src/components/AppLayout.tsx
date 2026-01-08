"use client"

import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import Sidebar from "./Sidebar"

interface Props {
    children: React.ReactNode
}

export default function AppLayout({ children }: Props) {
    const { status } = useSession()
    const pathname = usePathname()

    // Pages that don't need the sidebar
    const publicPages = ["/login"]
    const isPublicPage = publicPages.includes(pathname)

    // Show loading while checking session
    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full"></div>
            </div>
        )
    }

    // Public pages without sidebar
    if (isPublicPage || status === "unauthenticated") {
        return <>{children}</>
    }

    // Authenticated pages with sidebar
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    )
}
