import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const categories = [
  {
    name: "Development",
    slug: "development",
    description: "Software development articles and tutorials",
  },
  {
    name: "Design",
    slug: "design",
    description: "UI/UX design and visual design articles",
  },
  {
    name: "Technology",
    slug: "technology",
    description: "Latest technology news and trends",
  },
  {
    name: "Business",
    slug: "business",
    description: "Business and entrepreneurship articles",
  },
  {
    name: "Tutorial",
    slug: "tutorial",
    description: "Step-by-step tutorials and guides",
  },
]

async function main() {
  console.log("Seeding categories...")

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  console.log("Categories seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
