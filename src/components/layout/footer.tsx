'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Github, Mail, Twitter } from 'lucide-react'

import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { NewsletterFooterSection } from '@/components/sections/newsletter-footer'

export function Footer() {
  const footerLinks = [
    {
      title: 'Company',
      links: [
        
        { label: 'About', href: '/about' },
        { label: 'Services', href: '/services' },
        { label: 'Projects', href: '/projectst' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' },
        { label: 'Disclaimer', href: '/disclaimer' },
      ],
    },
    // {
    //   title: 'Legal',
    //   links: [
    //     { label: 'Privacy', href: '/privacy' },
    //     { label: 'Terms', href: '/terms' },
    //     { label: 'Cookie Policy', href: '/cookies' },
    //   ],
    // },
  ]

  return (
    <footer className="border-t bg-background">
      <div className="py-10 md:py-12 lg:py-16 px-8 md:px-16 lg:px-20 mx-auto">
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="grid grid-cols-1 mt-10">       
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <Link href="/" className="text-xl font-bold">
                {siteConfig.name}
              </Link>
              <p className="text-sm text-muted-foreground">
                {siteConfig.description}
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={siteConfig.links.twitter}>
                    <Twitter className="h-4 w-4" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={siteConfig.links.github}>
                    <Github className="h-4 w-4" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="mailto:contact@inventivelabs.ai">
                    <Mail className="h-4 w-4" />
                    <span className="sr-only">Email</span>
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
          <div className="grid gap-8 grid-cols-2 mt-10">
            {footerLinks.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-medium">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <div className="grid gap-8 grid-cols-1 mt-10">
              <NewsletterFooterSection />
          </div>
        </div>
      </div>
      <div className="border-t pb-8 pt-8">
        <div className="flex items-center justify-between text-sm text-muted-foreground px-8 md:px-16 lg:px-20 mx-auto">
          <div className="">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </div>
          <div className="flex">
            <motion.div
                
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-x-4"
              > 
                <ul className="flex space-x-4">
                  <li>
                    <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Privacy</Link>     
                  </li>
                  <li>
                    <Link href="/terms" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Terms</Link>     
                  </li>
                  <li>
                    <Link href="/cookie" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Cookie Policy</Link>     
                  </li>
                </ul>
              </motion.div>
            
          </div>
        </div>
      </div>
    </footer>
  )
}
