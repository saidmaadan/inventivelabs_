export const projectCategories = [
  {
    id: "WEB",
    name: "Web Development",
    description: "Web applications and websites",
  },
  {
    id: "MOBILE",
    name: "Mobile Development",
    description: "Mobile applications for iOS and Android",
  },
  {
    id: "AI",
    name: "AI & Machine Learning",
    description: "Artificial Intelligence and Machine Learning projects",
  },
  {
    id: "BLOCKCHAIN",
    name: "Blockchain",
    description: "Blockchain and Web3 projects",
  },
  {
    id: "UI/UX",
    name: "Design",
    description: "UI/UX and graphic design projects",
  },
  {
    id: "OTHER",
    name: "Other",
    description: "Other types of projects",
  },
] as const

export type ProjectCategory = typeof projectCategories[number]["id"]

export function getProjectCategory(id: ProjectCategory) {
  return projectCategories.find((category) => category.id === id)
}

export function getProjectCategoryName(id: ProjectCategory) {
  return getProjectCategory(id)?.name || id
}
