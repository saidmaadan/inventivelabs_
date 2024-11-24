export interface Project {
  id: string
  title: string
  slug: string
  description: string
  content: string
  coverImage: string
  image: string
  category: string
  tags: string[]
  client?: string
  duration?: string
  completionDate?: string
  technologies?: string[]
  demoUrl?: string
  githubUrl?: string
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export type ProjectCategory = {
  id: string
  name: string
  slug: string
  description?: string
}

export type ProjectTag = {
  id: string
  name: string
  slug: string
}

export type ProjectView = "grid" | "list"

export interface ProjectsPageParams {
  page?: number
  category?: string
  tag?: string
  search?: string
  view?: ProjectView
}
