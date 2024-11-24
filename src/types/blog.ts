export interface Author {
  id: string;
  name: string;
  avatar: string;
  role: string;
  bio: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: Author;
  tags: string[];
  category: BlogCategory;
  publishedAt: string;
  readingTime: number;
  featured?: boolean;
}

export type BlogCategory =
  | "development"
  | "design"
  | "technology"
  | "business"
  | "tutorial";

export interface BlogPageParams {
  category?: BlogCategory;
  tag?: string;
  page?: number;
  search?: string;
}

export interface PaginatedBlogPosts {
  posts: BlogPost[];
  totalPosts: number;
  currentPage: number;
  totalPages: number;
}
