"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Author {
  name: string;
  image: string;
}

interface BlogCardProps {
  title: string;
  slug: string;
  excerpt: string;
  image: string | null;
  category: string;
  publishedAt: Date | null;
  author: Author;
}

export function BlogCard({
  title,
  slug,
  excerpt,
  image,
  category,
  publishedAt,
  author,
}: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      <Link href={`/blog/${slug}`}>
        <Card>
          {image && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition-transform hover:scale-105"
              />
            </div>
          )}

          <CardHeader>
            <div className="space-y-2">
              <Badge variant="outline" className="capitalize">
                {category}
              </Badge>
              <h3 className="line-clamp-2 text-2xl font-bold">{title}</h3>
              <p className="line-clamp-2 text-muted-foreground">{excerpt}</p>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {author.image ? (
                  <Image
                    src={author.image}
                    alt={author.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-muted" />
                )}
                <span className="text-sm text-muted-foreground">
                  {author.name}
                </span>
              </div>
              {publishedAt && (
                <span className="text-sm text-muted-foreground">
                  {format(new Date(publishedAt), "MMM d, yyyy")}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
