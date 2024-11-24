'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen flex-col ">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="flex-1"
        >
        <div className="px-8 md:px-16 lg:px-20 mx-auto">
            {children}
        </div>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  )
}
