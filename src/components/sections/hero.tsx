'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fadeIn, staggerContainer, textVariant } from '@/lib/utils'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background md:justify-end">
        <div className="aspect-square w-full max-w-2xl rounded-full bg-gradient-to-tr from-primary/20 to-primary/0 blur-3xl" />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="container relative"
      >
        <div className="mx-auto max-w-3xl text-center">
          <motion.div variants={textVariant} className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Building the Future with{' '}
              <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                AI Innovation
              </span>
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl">
              We specialize in developing cutting-edge AI solutions that transform
              businesses and drive innovation. Let's build something amazing
              together.
            </p>
          </motion.div>

          <motion.div
            variants={fadeIn('up')}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Button size="lg" asChild>
              <a href="/contact">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/projects">View Our Work</a>
            </Button>
          </motion.div>

          <motion.div
            variants={fadeIn('up')}
            className="mt-16 flex items-center justify-center gap-8 grayscale"
          >
            <div className="space-y-3 text-center">
              <h3 className="text-3xl font-bold">100+</h3>
              <p className="text-sm text-muted-foreground">Projects Delivered</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="space-y-3 text-center">
              <h3 className="text-3xl font-bold">50+</h3>
              <p className="text-sm text-muted-foreground">Happy Clients</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="space-y-3 text-center">
              <h3 className="text-3xl font-bold">95%</h3>
              <p className="text-sm text-muted-foreground">Client Satisfaction</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Background grid */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </section>
  )
}
