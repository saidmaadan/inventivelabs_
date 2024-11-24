import { Role } from '@prisma/client'

export type UserRole = Role

export interface User {
  id: string
  email: string
  name?: string | null
  password?: string
  role: UserRole
  image?: string | null
  projects?: Project[]
  blogs?: Blog[]
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  content: string
  image?: string | null
  demoUrl?: string | null
  githubUrl?: string | null
  published: boolean
  author: User
  authorId: string
  tags: Tag[]
  createdAt: Date
  updatedAt: Date
}

export interface Blog {
  id: string
  title: string
  slug: string
  description: string
  content: string
  image?: string | null
  published: boolean
  author: User
  authorId: string
  category: Category
  categoryId: string
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  description?: string | null
  blogs: Blog[]
  createdAt: Date
  updatedAt: Date
}

export interface Tag {
  id: string
  name: string
  description?: string | null
  projects: Project[]
  createdAt: Date
  updatedAt: Date
}

export interface Newsletter {
  id: string
  email: string
  active: boolean
  createdAt: Date
  updatedAt: Date
}

// Auth Types
export interface Session {
  user: {
    id: string
    email: string
    name?: string | null
    image?: string | null
    role: UserRole
  }
  expires: string
}

export interface AuthOptions {
  user: {
    id: string
    email: string
    role: UserRole
  }
  expires: string
}
