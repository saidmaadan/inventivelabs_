// import NextAuth from "next-auth"
// import { authOptions } from "@/auth"
// import { GET, POST } from "@/auth"

// const handler = NextAuth(authOptions)

// export { GET, POST }

import { handlers } from "@/auth" // Referring to the auth.ts we just created
export const { GET, POST } = handlers
