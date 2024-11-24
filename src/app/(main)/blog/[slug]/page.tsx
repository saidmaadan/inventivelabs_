import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SocialShare } from "@/components/shared/social-share";
import { SimilarPosts } from "@/components/blog/similar-posts";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

async function getBlogPost(slug: string) {
  const post = await prisma.blog.findUnique({
    where: { slug },
    include: {
      category: true,
      user: true,
    },
  });

  if (!post || post.status !== "PUBLISHED") {
    notFound();
  }

  return post;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug);

  return {
    title: `${post.title} - InventiveLabs Blog`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} - InventiveLabs Blog`,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} - InventiveLabs Blog`,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug);

  return (
    <div className="container py-10">
      <Button variant="ghost" size="sm" className="mb-8" asChild>
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>
      </Button>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
        <article className="lg:col-span-3">
          <header className="mb-8">
            <Badge variant="outline" className="mb-4 capitalize">
              {post.category.name}
            </Badge>
            <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {post.user.image ? (
                  <Image
                    src={post.user.image}
                    alt={post.user.name || ""}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-muted" />
                )}
                <span className="text-sm text-muted-foreground">
                  {post.user.name || "Anonymous"}
                </span>
              </div>
              {post.publishedAt && (
                <time
                  dateTime={post.publishedAt.toISOString()}
                  className="text-sm text-muted-foreground"
                >
                  {format(post.publishedAt, "MMM d, yyyy")}
                </time>
              )}
            </div>
          </header>

          {post.image && (
            <div className="relative mb-8 aspect-video overflow-hidden rounded-lg">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          <div
            className="prose prose-gray dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-8">
            <SocialShare
              url={`${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`}
              title={post.title}
            />
          </div>
        </article>

        <div className="lg:col-span-1">
          <SimilarPosts currentPostId={post.id} categoryId={post.categoryId} />
        </div>
      </div>
    </div>
  );
}
