'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from "sonner"

import { fadeIn, staggerContainer } from '@/lib/utils'

export function NewsletterFooterSection() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to subscribe')
      }

      toast.success(data.message || 'Successfully subscribed to the newsletter')
      setEmail('')
    } catch (error: any) {
      console.error('Newsletter subscription error:', error)
      const errorMessage = error.message || 'Failed to subscribe to the newsletter'
      toast.error(errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="container "
      >
        <div className="mx-auto max-w-2xl text-center">
          <motion.div variants={fadeIn('up')} className="space-y-4">
            <h3 className="text-sm font-bold tracking-tighter ">
            Subscribe to our newsletter
            </h3>
            
          </motion.div>

          <motion.form
            variants={fadeIn('up')}
            onSubmit={onSubmit}
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-2"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError(null)
              }}
              required
              className={`h-12 ${error ? 'border-red-500' : ''}`}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'email-error' : undefined}
            />
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="h-12"
            >
              {isLoading ? (
                <>
                  <span className="animate-pulse">Subscribing...</span>
                </>
              ) : (
                <>
                  
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </motion.form>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-500"
              id="email-error"
            >
              {error}
            </motion.p>
          )}
          <motion.p
            variants={fadeIn('up')}
            className="mt-4 text-sm text-muted-foreground"
          >
            We respect your privacy. Unsubscribe at any time.
          </motion.p>
        </div>
      </motion.div>
    </section>
  )
}
