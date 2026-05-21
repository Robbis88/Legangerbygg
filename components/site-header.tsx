'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'

import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { primaryNav } from '@/lib/nav'
import { cn } from '@/lib/utils'

const SCROLL_THRESHOLD = 32

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300',
        scrolled
          ? 'border-border bg-background/80 border-b backdrop-blur-xl'
          : 'border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-20">
        <Link
          href="/"
          aria-label="Troas Bygg — til forsiden"
          className="focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Logo variant="compact" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground/80 hover:text-foreground text-sm font-medium tracking-wide transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/kontakt"
            className="bg-foreground text-background hover:bg-foreground/90 hidden items-center rounded-full px-5 py-2.5 text-sm font-medium tracking-wide transition-colors md:inline-flex"
          >
            Få et tilbud
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Åpne meny" className="md:hidden" />
              }
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(20rem,90vw)]">
              <SheetHeader>
                <SheetTitle>
                  <Logo variant="compact" />
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-1 px-4">
                {primaryNav.map((item) => (
                  <SheetClose key={item.href} render={<Link href={item.href} />}>
                    <span className="hover:bg-muted block rounded-md px-3 py-3 text-base font-medium transition-colors">
                      {item.label}
                    </span>
                  </SheetClose>
                ))}
                <SheetClose render={<Link href="/kontakt" />}>
                  <span className="bg-foreground text-background mt-4 block rounded-full px-5 py-3 text-center text-sm font-medium">
                    Få et tilbud
                  </span>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
