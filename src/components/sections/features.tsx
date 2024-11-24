'use client'

import { motion } from 'framer-motion'
import {
  Brain,
  Cloud,
  Globe,
  Palette,
  Smartphone,
  Users,
} from 'lucide-react'
import { siteConfig } from '@/config/site'
import { fadeIn, staggerContainer } from '@/lib/utils'

const icons = {
  Brain,
  Cloud,
  Globe,
  Palette,
  Smartphone,
  Users,
}

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-32">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="container"
      >
        <div className="mx-auto max-w-2xl text-center">
          <motion.div variants={fadeIn('up')} className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground">
              We offer a comprehensive range of services to help your business
              succeed in the digital age.
            </p>
          </motion.div>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.features.map((feature, index) => {
            const Icon = icons[feature.icon as keyof typeof icons]
            return (
              <motion.div
                key={feature.title}
                variants={fadeIn('up')}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border bg-background p-8"
              >
                <div className="space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
                {/* Hover gradient effect */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-primary/0 to-primary/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
