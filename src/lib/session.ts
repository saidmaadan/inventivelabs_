import { auth } from "@/auth"
import { Role } from "@prisma/client"

export type AuthUser = {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: Role
}

export type AuthSession = {
  session: {
    user: AuthUser
  } | null
}

export async function getSession(): Promise<AuthSession> {
  try {
    const session = await auth()
    return { session }
  } catch (error) {
    console.error('Session error:', error)
    return { session: null }
  }
}
