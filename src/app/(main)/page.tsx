import Image from "next/image";

import { HeroSection } from '@/components/sections/hero'
import { FeaturesSection } from '@/components/sections/features'
import { FAQSection } from '@/components/sections/faq'
import { NewsletterSection } from '@/components/sections/newsletter'
import { LatestBlogsSectionWrapper } from '@/components/sections/latest-blogs-section'

export default function Home() {
  return (
    
      <main className="py-2">
        <HeroSection />
        <FeaturesSection />
        <LatestBlogsSectionWrapper />
        <FAQSection />
        <NewsletterSection />
      </main>
    
  )
}

export const metadata = {
  title: 'InventiveLabs - AI Software Development Company',
  description:
    'InventiveLabs is a leading AI software development company specializing in building innovative solutions for businesses.',
}
