'use client'

import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { siteConfig } from '@/config/site'
import { fadeIn, staggerContainer } from '@/lib/utils'

export function FAQSection() {
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
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about our services and process.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={fadeIn('up')}
          className="mx-auto mt-16 max-w-3xl space-y-4"
        >
          <Accordion type="single" collapsible className="w-full">
            {siteConfig.faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </motion.div>
    </section>
  )
}
