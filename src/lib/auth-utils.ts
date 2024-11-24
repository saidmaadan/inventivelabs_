import { getServerSession } from "next-auth/next/server"
import { authOptions } from "./auth"
import { Role } from "@prisma/client"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

export async function isAuthenticated() {
  const user = await getCurrentUser()
  return !!user
}

export async function isAdmin() {
  const user = await getCurrentUser()
  return user?.role === Role.ADMIN
}

export async function checkRole(allowedRoles: Role[]) {
  const user = await getCurrentUser()
  if (!user) return false
  return allowedRoles.includes(user.role)
}

type HandlerFunction = (req: NextRequest) => Promise<NextResponse> | NextResponse

export function withAuth(handler: HandlerFunction, allowedRoles?: Role[]) {
  return async (req: NextRequest) => {
    const user = await getCurrentUser()

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    return handler(req)
  }
}
