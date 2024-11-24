'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteSubscriber(id: string) {
  try {
    await prisma.newsletter.delete({ where: { id } })
    revalidatePath('/admin/newsletter/subscribers')
    return { success: true }
  } catch (error) {
    console.error('Error deleting subscriber:', error)
    return { success: false, error: 'Failed to delete subscriber' }
  }
}
