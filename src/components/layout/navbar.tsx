'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Menu, X, User } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()

  const routes = [
    {
      href: '/about',
      label: 'About',
    },
    {
      href: '/services',
      label: 'Services',
    },
    {
      href: '/projects',
      label: 'Projects',
    },
    {
      href: '/blog',
      label: 'Blog',
    },
    {
      href: '/contact',
      label: 'Contact',
    },
  ]

  const handleSignOut = async () => {
    try {
      await signOut({ 
        callbackUrl: '/',
        redirect: true 
      })
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex h-16 items-center px-8 md:px-16 lg:px-20 mx-auto">
        <div className="mr-8">
          <Link href="/" className="flex items-center space-x-2">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-bold text-xl"
            >
              {siteConfig.name}
            </motion.span>
          </Link>
        </div>

        <div className="hidden md:flex md:flex-1">
          <motion.div
            className="flex gap-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-foreground/80',
                  pathname === route.href
                    ? 'text-foreground'
                    : 'text-foreground/60'
                )}
              >
                {route.label}
              </Link>
            ))}
          </motion.div>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="hidden md:flex md:items-center md:space-x-4">
            <ThemeToggle />
            {status === 'loading' ? null : status === 'authenticated' && session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user.name && (
                        <p className="font-medium">{session.user.name}</p>
                      )}
                      {session.user.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {session.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    {session.user.role === 'ADMIN' && <Link href="/admin">Admin Dashboard</Link>}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault()
                      handleSignOut()
                    }}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-6">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      'text-lg font-medium transition-colors hover:text-foreground/80',
                      pathname === route.href
                        ? 'text-foreground'
                        : 'text-foreground/60'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {route.label}
                  </Link>
                ))}
                <div className="space-y-4">
                  {status === 'loading' ? null : status === 'authenticated' && session?.user ? (
                    <>
                      <div className="flex flex-col space-y-1 p-2">
                        {session.user.name && (
                          <p className="font-medium">{session.user.name}</p>
                        )}
                        {session.user.email && (
                          <p className="text-sm text-muted-foreground">
                            {session.user.email}
                          </p>
                        )}
                      </div>
                      <Button asChild variant="ghost" className="w-full">
                        <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                          Dashboard
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => {
                          handleSignOut()
                          setIsOpen(false)
                        }}
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="ghost" className="w-full">
                        <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                          Get Started
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
                <ThemeToggle />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
